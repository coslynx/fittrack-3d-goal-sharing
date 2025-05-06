import React from 'react'
import GoalPost from 'src/components/Three/GoalPost'
import Trophy from 'src/components/Three/Trophy'
import 'src/styles/index.css'

/**
 * Renders the feature section of the fitness tracker landing page, showcasing the app's key features.
 * Integrates 3D models to visually represent each feature.
 */
function FeatureSection() {
  try {
    // Render the main layout with feature descriptions and 3D models
    return (
      <section
        className="min-h-screen flex flex-col justify-center items-center p-8"
        style={{ backgroundColor: 'var(--color-fitness-background)' }}
      >
        {/* Feature: Set Your Goals */}
        <div className="w-full max-w-2xl flex flex-col md:flex-row justify-center items-center p-4 mb-8 border border-gray-200 rounded-lg shadow-md">
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <GoalPost />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4">
            <h2 className="text-fitness-text-primary font-montserrat text-2xl font-bold text-center mb-2">
              Set Your Goals
            </h2>
            <p className="text-fitness-text-secondary font-open-sans text-base text-center md:text-left">
              Define your fitness objectives and track your progress towards achieving them. Our app provides the tools to
              set realistic goals and stay motivated.
            </p>
          </div>
        </div>

        {/* Feature: Celebrate Achievements */}
        <div className="w-full max-w-2xl flex flex-col md:flex-row justify-center items-center p-4 mb-8 border border-gray-200 rounded-lg shadow-md">
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <Trophy />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4">
            <h2 className="text-fitness-text-primary font-montserrat text-2xl font-bold text-center mb-2">
              Celebrate Achievements
            </h2>
            <p className="text-fitness-text-secondary font-open-sans text-base text-center md:text-left">
              Acknowledge and celebrate your fitness milestones. Share your achievements with friends and stay inspired on
              your fitness journey.
            </p>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    // Log the error and render a user-friendly error message
    console.error('Error rendering FeatureSection component:', error)
    return (
      <div className="text-red-500 font-bold text-center p-4">
        An error occurred while rendering the feature section. Please try again later.
      </div>
    )
  }
}

export default FeatureSection