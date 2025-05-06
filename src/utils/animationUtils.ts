import gsap from 'gsap'
import * as THREE from 'three'

/**
 * Configuration options for animations.
 */
export interface AnimationConfig {
  defaultDuration: number
  defaultEase: string
}

/**
 * Default configuration for animations, defining the default duration and easing function.
 */
export const animationConfig: AnimationConfig = {
  defaultDuration: 0.8,
  defaultEase: 'power3.out',
}

/**
 * Creates a GSAP timeline animation for scaling a Three.js mesh on its Y-axis with a specified color highlight.
 *
 * @param bar - The Three.js mesh to animate.
 * @param targetValue - The target scale value for the Y-axis of the mesh.
 * @param color - The highlight color for the mesh during the animation.
 * @param duration - The duration of the animation in seconds.
 * @returns A GSAP timeline animation.
 */
export function createBarAnimation(
  bar: THREE.Mesh,
  targetValue: number,
  color: string,
  duration: number
): gsap.core.Timeline {
  // Validate bar parameter
  if (!(bar instanceof THREE.Mesh)) {
    console.warn('Invalid bar parameter: Must be a THREE.Mesh.')
    return gsap.timeline() // Return an empty timeline to prevent errors
  }

  // Validate targetValue parameter
  if (typeof targetValue !== 'number' || !Number.isFinite(targetValue)) {
    console.warn('Invalid targetValue parameter: Must be a finite number.')
    return gsap.timeline() // Return an empty timeline to prevent errors
  }

  // Create GSAP timeline
  const tl = gsap.timeline()

  // Animation sequence: scale the bar, highlight its color, and then revert to the original color
  tl.to(bar.scale, {
    y: targetValue / 100, // Scale the value to a reasonable range
    duration: duration,
    ease: animationConfig.defaultEase,
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

  return tl
}