import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

interface TrophyProps {
  achievementLevel?: number
}

/**
 * Memoized Trophy component
 * Visualizes a user achievement using Three.js.
 */
const Trophy: React.FC<TrophyProps> = React.memo(({ achievementLevel }) => {
  const [isBrowserSupported, setIsBrowserSupported] = useState(true)
  const [loading, setLoading] = useState(true)
  const [model, setModel] = useState<THREE.Group | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const trophyRef = useRef<THREE.Group>(null)
  const animationRequestIdRef = useRef<number>(0)
  const { invalidate } = useThree()
  const controlsRef = useRef<THREE.OrbitControls>(null)

  // Memoize achievement level for performance optimization
  const memoizedAchievementLevel = useMemo(() => {
    if (typeof achievementLevel !== 'number' || !Number.isFinite(achievementLevel)) {
      console.warn('Invalid achievementLevel prop:', achievementLevel)
      return 0
    }
    return Math.max(0, Math.min(achievementLevel, 100))
  }, [achievementLevel])

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
          __MODEL_PATH_TROPHY__ || '/models/trophy.glb'
        )
        setModel(gltf.scene)

        const loadedModel = gltf.scene
        if (loadedModel) {
          loadedModel.scale.set(0.1, 0.1, 0.1)
          loadedModel.position.set(0, -0.5, 0)
          trophyRef.current = loadedModel

          animateTrophy(loadedModel, memoizedAchievementLevel)
        }

        setLoading(false)
      } catch (err: any) {
        console.error('Error loading 3D model:', err)
        setError(err)
      }
    }

    const animateTrophy = (model: THREE.Group, level: number) => {
      try {
        if (!model) {
          console.warn('Model not loaded yet.')
          return
        }

        if (typeof level !== 'number' || level < 0 || level > 100) {
          console.warn('Invalid achievement level:', level)
          return
        }

        const trophyShine = model.getObjectByName('TrophyShine') as THREE.Mesh
        if (!trophyShine) {
          console.warn('TrophyShine not found in the 3D model.')
          return
        }

        const targetIntensity = level / 100
        const defaultColor = new THREE.Color('#ffffcc')
        const completedColor = new THREE.Color('#2ecc71')

        gsap.to(trophyShine.material, {
          opacity: targetIntensity,
          duration: 0.8,
          ease: 'power3.out',
          onStart: () => {
            gsap.to(trophyShine.material, {
              color: level === 100 ? completedColor : defaultColor,
              duration: 0.3,
              ease: 'power2.inOut',
            })
          },
          onComplete: () => {
            gsap.to(trophyShine.material, {
              color: level === 100 ? completedColor : defaultColor,
              duration: 0.3,
              ease: 'power2.inOut',
            })
          },
        })
      } catch (animationError) {
        console.error('Error animating the 3D trophy:', animationError)
      }
    }

    loadModel()

    return () => {
      if (animationRequestIdRef.current) {
        cancelAnimationFrame(animationRequestIdRef.current)
      }
    }
  }, [memoizedAchievementLevel, invalidate])

  useFrame(() => {
    if (trophyRef.current) {
      trophyRef.current.rotation.y += 0.002
    }
  })

  const handleDismissError = () => {
    setError(null)
  }

  if (typeof __MODEL_PATH_TROPHY__ !== 'string') {
    console.error('Invalid environment variable: __MODEL_PATH_TROPHY__')
  }

  if (!isBrowserSupported) {
    return (
      <div className="text-red-500 font-bold text-center p-4">
        Your browser does not support WebGL. Please use a modern browser to view the 3D model.
      </div>
    )
  }

  if (loading) {
    return <div className="text-center">Loading 3D Trophy Model...</div>
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

export default Trophy