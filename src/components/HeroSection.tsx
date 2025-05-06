import React from 'react'
import AnimatedGraph from 'src/components/Three/AnimatedGraph'
import useScrollAnimation from 'src/hooks/useScrollAnimation'

/**
 * Renders the hero section of the fitness tracker landing page, showcasing the app's core value proposition.
 * Integrates a dynamic 3D animated graph to visually represent fitness progress.
 */
function HeroSection() {
  try {
    // Apply scroll-triggered animations to the hero section
    const { scrollYProgress } = useScrollAnimation()

    // Render the main layout with a title, subtitle, and the AnimatedGraph
    return (
      <section
        className="min-h-screen flex flex-col justify-center items-center p-8"
        style={{
          backgroundColor: 'var(--color-fitness-background)',
          opacity: scrollYProgress, // Apply fade-in effect
        }}
      >
        <h1
          className="text-fitness-text-primary font-montserrat text-4xl font-bold text-center mb-4"
          style={{ opacity: scrollYProgress }} // Apply fade-in effect
        >
          Track Your Fitness, Achieve Your Goals
        </h1>
        <h2
          className="text-fitness-text-secondary font-open-sans text-xl text-center mb-8"
          style={{ opacity: scrollYProgress }} // Apply fade-in effect
        >
          Visualize Your Progress with Our Interactive 3D Graph
        </h2>

        {/* Integrate the AnimatedGraph component */}
        <div className="w-full max-w-2xl">
          <AnimatedGraph />
        </div>
      </section>
    )
  } catch (error) {
    // Log the error and render a user-friendly error message
    console.error('Error rendering HeroSection component:', error)
    return (
      <div className="text-red-500 font-bold text-center p-4">
        An error occurred while rendering the hero section. Please try again later.
      </div>
    )
  }
}

export default HeroSection