import { useState, useEffect, useCallback, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

/**
 * Interface defining the return type of the use3DModelLoader hook.
 */
interface Use3DModelLoaderResult {
  model: THREE.Group | null
  loading: boolean
  error: Error | null
}

/**
 * Type alias for the cache, mapping model paths to THREE.Group objects.
 */
type ModelCache = Map<string, THREE.Group>

/**
 * Configuration options for the use3DModelLoader hook.
 */
interface Use3DModelLoaderOptions {
  cacheSize?: number // Maximum number of models to store in the cache.
}

/**
 * React hook for asynchronously loading 3D models in GLTF/GLB format with caching.
 *
 * @param modelPath - The path to the GLTF/GLB model file.
 * @param options - Configuration options for the hook.
 * @returns An object containing the loaded model, loading state, and any errors.
 */
const use3DModelLoader = (modelPath: string, options: Use3DModelLoaderOptions = {}): Use3DModelLoaderResult => {
  const [model, setModel] = useState<THREE.Group | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const cacheRef = useRef<ModelCache>(new Map<string, THREE.Group>())
  const loadCounterRef = useRef<number>(0)

  const { cacheSize = 10 } = options

  /**
   * Function to dispose of the model and its resources to prevent memory leaks.
   *
   * @param object - The Three.js object (model) to dispose of.
   */
  const disposeModel = useCallback((object: THREE.Object3D) => {
    if (object) {
      object.traverse((child: any) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (child.material instanceof THREE.Material) {
            child.material.dispose()
          }
        }
      })
    }
  }, [])

  /**
   * Asynchronous function to load the 3D model.
   */
  const loadModel = useCallback(async () => {
    loadCounterRef.current += 1
    setLoading(true)
    setError(null)

    try {
      // Check if the model exists in the cache
      const cachedModel = cacheRef.current.get(modelPath)
      if (cachedModel) {
        setModel(cachedModel)
        console.log(`Model "${modelPath}" loaded from cache.`)
        return
      }

      // Resolve the model path relative to environment variables
      let resolvedModelPath = modelPath
      if (modelPath.startsWith('/models')) {
        if (modelPath.includes('graph')) {
          resolvedModelPath = __MODEL_PATH_GRAPH__ || modelPath
        } else if (modelPath.includes('goalpost')) {
          resolvedModelPath = __MODEL_PATH_GOALPOST__ || modelPath
        } else if (modelPath.includes('trophy')) {
          resolvedModelPath = __MODEL_PATH_TROPHY__ || modelPath
        }
      }

      // Load the 3D model using GLTFLoader
      const gltfLoader = new GLTFLoader()
      const gltf = await gltfLoader.loadAsync(resolvedModelPath)

      const loadedModel = gltf.scene
      setModel(loadedModel)
      console.log(`Model "${modelPath}" loaded successfully.`)

      // Store the loaded model in the cache
      cacheRef.current.set(modelPath, loadedModel)

      // Enforce cache size limit using LRU strategy
      if (cacheRef.current.size > cacheSize) {
        // Find the least recently used model in the cache.
        const lruModel = cacheRef.current.keys().next().value
        const modelToRemove = cacheRef.current.get(lruModel)

        // Dispose the model and its resources
        if (modelToRemove) {
          disposeModel(modelToRemove)
        }

        // Delete the LRU model from the cache.
        cacheRef.current.delete(lruModel)
        console.log(`Model "${lruModel}" removed from cache (LRU).`)
      }
    } catch (err: any) {
      console.error(`Error loading 3D model "${modelPath}":`, err)
      setError(err)
    } finally {
      loadCounterRef.current -= 1
      setLoading(false)
    }
  }, [modelPath, cacheSize, disposeModel])

  useEffect(() => {
    // Load the model if the load counter is greater than zero
    if (loadCounterRef.current > 0) {
      return
    }

    loadModel()

    // Cleanup function to dispose of the model when the component unmounts
    return () => {
      if (model) {
        disposeModel(model)
        setModel(null)
        console.log(`Model "${modelPath}" disposed.`)
      }
    }
  }, [loadModel, model, disposeModel, modelPath])

  return { model, loading, error }
}

export default use3DModelLoader