import * as THREE from 'three'
import { useEffect, useState, useCallback, useRef } from 'react'

/**
 * Interface for performance metrics.
 */
export interface PerformanceMetrics {
  fps: number
  memoryUsage: number
  drawCalls: number
}

/**
 * A class for monitoring and collecting performance metrics of a Three.js WebGLRenderer.
 */
export class PerformanceMonitor {
  private renderer: THREE.WebGLRenderer
  private frameTimes: number[] = []
  private lastFrameTime: number = 0
  private memoryUsage: number = 0
  private drawCalls: number = 0

  /**
   * Creates a new PerformanceMonitor instance.
   *
   * @param renderer - The Three.js WebGLRenderer instance to monitor.
   * @throws TypeError if the provided renderer is not a THREE.WebGLRenderer.
   */
  constructor(renderer: THREE.WebGLRenderer) {
    if (!(renderer instanceof THREE.WebGLRenderer)) {
      throw new TypeError('Invalid renderer: Must be a THREE.WebGLRenderer.')
    }
    this.renderer = renderer
  }

  /**
   * Begins a new frame, updating the last frame time.
   */
  beginFrame(): void {
    this.lastFrameTime = performance.now()
  }

  /**
   * Ends the current frame, updating performance metrics such as FPS, memory usage, and draw calls.
   */
  endFrame(): void {
    const now = performance.now()
    const frameTime = now - this.lastFrameTime
    this.frameTimes.push(frameTime)

    // Keep only the last 30 frame times for calculating FPS moving average
    if (this.frameTimes.length > 30) {
      this.frameTimes.shift()
    }

    // Estimate memory usage and draw calls from renderer info
    if (this.renderer && this.renderer.info) {
      this.memoryUsage = this.renderer.info.memory.geometries + this.renderer.info.memory.textures
      this.drawCalls = this.renderer.info.render.calls
    } else {
      console.warn('Renderer info not available. Returning default metrics.')
      this.memoryUsage = 0
      this.drawCalls = 0
    }
  }

  /**
   * Gets the current performance metrics.
   *
   * @returns An object containing the current performance metrics (fps, memoryUsage, drawCalls).
   */
  getMetrics(): PerformanceMetrics {
    // Calculate frames per second as a moving average
    const averageFrameTime = this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length
    const fps = 1000 / averageFrameTime

    // Estimate memory usage in MB
    const memoryUsageMB = this.memoryUsage / 1024 / 1024

    return {
      fps: Number.isFinite(fps) ? Math.max(0, fps) : 0,
      memoryUsage: Number.isFinite(memoryUsageMB) ? Math.max(0, memoryUsageMB) : 0,
      drawCalls: Number.isFinite(this.drawCalls) ? Math.max(0, this.drawCalls) : 0,
    }
  }
}

/**
 * Returns a throttled version of the provided function, limiting the rate at which it can be called.
 *
 * @param func - The function to throttle.
 * @param limit - The rate limiting.
 * @returns A throttled function.
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  let lastFunc: ReturnType<typeof setTimeout>
  let lastRan: number

  return function (this: any, ...args: Parameters<T>): void {
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      lastRan = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
        inThrottle = false
      }, limit - (Date.now() - lastRan))
    }
  }
}

/**
 * React hook that instantiates and manages a PerformanceMonitor instance and provides access to its metrics.
 *
 * @param renderer - The Three.js WebGLRenderer instance to monitor.
 * @returns The performance metrics object from getMetrics().
 */
export const usePerformanceMonitor = (renderer: THREE.WebGLRenderer | null): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ fps: 0, memoryUsage: 0, drawCalls: 0 })
  const performanceMonitorRef = useRef<PerformanceMonitor | null>(null)

  const updateMetrics = useCallback(() => {
    if (performanceMonitorRef.current) {
      performanceMonitorRef.current.endFrame()
      setMetrics(performanceMonitorRef.current.getMetrics())
      performanceMonitorRef.current.beginFrame()
    }
  }, [])

  useEffect(() => {
    if (!renderer) {
      console.warn('WebGLRenderer is not available. Performance monitoring is disabled.')
      return
    }

    try {
      performanceMonitorRef.current = new PerformanceMonitor(renderer)
      performanceMonitorRef.current.beginFrame()
    } catch (error: any) {
      console.error('Failed to initialize PerformanceMonitor:', error)
    }

    const throttledUpdateMetrics = throttle(updateMetrics, 250)

    // Function to trigger a metrics update
    const animationFrameCallback = () => {
      throttledUpdateMetrics()
      requestAnimationFrame(animationFrameCallback)
    }

    // Start the animation frame loop
    let animationFrameId = requestAnimationFrame(animationFrameCallback)

    // Dispose of the PerformanceMonitor on unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      performanceMonitorRef.current = null // Clear the reference
    }
  }, [renderer, updateMetrics])

  return metrics
}