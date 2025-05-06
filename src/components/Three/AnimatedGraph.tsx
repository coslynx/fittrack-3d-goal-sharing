import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Environment, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'

// Define the FitnessData interface
interface FitnessData {
  steps: number
  calories: number
  distance: number
}

interface AnimatedGraphProps {
  fitnessData?: FitnessData
}

/**
 * Memoized AnimatedGraph component
 * Visualizes fitness data using Three.js.
 */
const AnimatedGraph: React.FC<AnimatedGraphProps> = React.memo(({ fitnessData }) => {
  const [isBrowserSupported, setIsBrowserSupported] = useState(true)
  const [loading, setLoading] = useState(true)
  const [model, setModel] = useState<THREE.Group | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const graphRef = useRef<THREE.Group>(null)
  const animationRequestIdRef = useRef<number>(0) // Store animation frame request ID
  const { invalidate } = useThree()
  const scene = useThree((state) => state.scene) // Access the scene
  const camera = useThree((state) => state.camera)
  const controlsRef = useRef<THREE.OrbitControls>(null)

  // Memoize fitness data for performance optimization
  const memoizedFitnessData = useMemo(() => {
    // Validate fitnessData prop
    if (!fitnessData || typeof fitnessData !== 'object') {
      console.warn('Invalid fitnessData prop:', fitnessData)
      return { steps: 0, calories: 0, distance: 0 }
    }

    const { steps, calories, distance } = fitnessData
    if (
      typeof steps !== 'number' ||
      !Number.isFinite(steps) ||
      typeof calories !== 'number' ||
      !Number.isFinite(calories) ||
      typeof distance !== 'number' ||
      !Number.isFinite(distance)
    ) {
      console.warn('Invalid fitnessData values:', fitnessData)
      return { steps: 0, calories: 0, distance: 0 }
    }
    return { steps, calories, distance }
  }, [fitnessData])

  useEffect(() => {
    let currentAnimationRequestId: number

    // Check if WebGL is supported
    const isWebGLAvailable = () => {
      try {
        const canvas = document.createElement('canvas')
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
      } catch (e) {
        return false
      }
    }

    if (!isWebGLAvailable()) {
      setIsBrowserSupported(false)
      return
    }

    // Load the 3D model using GLTFLoader
    const loadModel = async () => {
      try {
        const gltfLoader = new GLTFLoader()
        const gltf = await gltfLoader.loadAsync(
          __MODEL_PATH_GRAPH__ || '/models/graph.glb' // fallback if env is not set
        )
        setModel(gltf.scene)

        // Set the loaded model to state for future access
        const loadedModel = gltf.scene
        if (loadedModel) {
          // Apply initial scaling and positioning if necessary
          loadedModel.scale.set(0.1, 0.1, 0.1)
          loadedModel.position.set(0, -0.5, 0)
          graphRef.current = loadedModel // setting it to ref

          // Set up initial animations for the graph
          if (memoizedFitnessData) {
            animateGraph(loadedModel, memoizedFitnessData)
          }
        }

        setLoading(false)
      } catch (err: any) {
        console.error('Error loading 3D model:', err)
        setError(err)
      }
    }

    const animateGraph = (model: THREE.Group, data: FitnessData) => {
      try {
        // Ensure the data is valid
        if (!data || typeof data !== 'object') {
          console.warn('Invalid fitnessData:', data)
          return
        }

        const { steps, calories, distance } = data

        // Ensure data values are numeric
        if (
          typeof steps !== 'number' ||
          typeof calories !== 'number' ||
          typeof distance !== 'number' ||
          !Number.isFinite(steps) ||
          !Number.isFinite(calories) ||
          !Number.isFinite(distance)
        ) {
          console.warn('Invalid data types in fitnessData:', data)
          return
        }

        // Check if model is already animated
        if (!model || !model.children) {
          console.warn('3D model not loaded or has no children.')
          return
        }

        // Find the step, calorie, and distance bars
        const stepBar = model.getObjectByName('StepBar') as THREE.Mesh
        const calorieBar = model.getObjectByName('CalorieBar') as THREE.Mesh
        const distanceBar = model.getObjectByName('DistanceBar') as THREE.Mesh

        if (!stepBar || !calorieBar || !distanceBar) {
          console.warn('One or more data bars not found in the 3D model.')
          return
        }

        // GSAP timeline to animate graph bars and change color based on current bar
        const tl = gsap.timeline()

        // Define reusable animation for each bar with a highlighting effect
        const animateBar = (bar: THREE.Mesh, value: number, color: string) => {
          tl.to(bar.scale, {
            y: value / 100, // scale the value to a reasonable range
            duration: 0.8,
            ease: 'power3.out',
            onStart: () => {
              gsap.to(bar.material, {
                color: color, // Highlight the bar's color
                duration: 0.3, // Shorter duration for color change
                ease: 'power2.inOut',
              })
            },
            onComplete: () => {
              gsap.to(bar.material, {
                color: '#FFFFFF', // Restore the bar's color to white (or your default color)
                duration: 0.3,
                ease: 'power2.inOut',
              })
            },
          })
        }

        animateBar(stepBar, steps, '#2ecc71') // Highlight step bar
        animateBar(calorieBar, calories, '#3498db') // Highlight calorie bar
        animateBar(distanceBar, distance, '#f39c12') // Highlight distance bar

        // Play timeline
        tl.play()

        // Function to invalidate the frame on each update.
        currentAnimationRequestId = requestAnimationFrame(() => {
          invalidate()
        })
      } catch (animationError) {
        console.error('Error animating the 3D graph:', animationError)
      }
    }

    loadModel()

    return () => {
      if (animationRequestIdRef.current) {
        cancelAnimationFrame(animationRequestIdRef.current)
      }
    }
  }, [memoizedFitnessData, invalidate]) // Memoized data as dependency.

  // Use useFrame to update the scene on each frame
  useFrame(() => {
    if (graphRef.current) {
      graphRef.current.rotation.y += 0.002 // slowly rotate graph
    }
  })

  const handleDismissError = () => {
    setError(null)
  }

  // Basic props validation
  if (typeof __MODEL_PATH_GRAPH__ !== 'string') {
    console.error('Invalid environment variable: __MODEL_PATH_GRAPH__')
  }

  if (!isBrowserSupported) {
    return (
      <div className="text-red-500 font-bold text-center p-4">
        Your browser does not support WebGL. Please use a modern browser to view the 3D graph.
      </div>
    )
  }

  if (loading) {
    return <div className="text-center">Loading 3D Graph...</div>
  }

  if (error) {
    return (
      <div className="text-red-500 font-bold text-center p-4">
        Error: {error.message}
        <button className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded" onClick={handleDismissError}>
          Dismiss
        </button>
      </div>
    )
  }

  return (
    <Canvas dpr={[1, 2]} shadows camera={{ fov: 50, position: [0, 2, 5] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.7} castShadow />
      {model && <primitive object={model} />}
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={7}
        minPolarAngle={0.5}
        maxPolarAngle={1.5}
      />
      <Environment preset="city" blur={0.5} />
    </Canvas>
  )
})

export default AnimatedGraph