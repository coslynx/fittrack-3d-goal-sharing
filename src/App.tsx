import React from 'react'
import HeroSection from 'src/components/HeroSection'
import FeatureSection from 'src/components/FeatureSection'

/**
 * Main application container component for the fitness tracker landing page.
 * Integrates HeroSection and FeatureSection to showcase the app's features.
 * Handles potential rendering errors with a fallback UI.
 */
function App() {
  try {
    // Render the main layout with HeroSection and FeatureSection
    return (
      <main className="font-sans antialiased" style={{ backgroundColor: 'var(--color-fitness-background)' }}>
        <HeroSection />
        <FeatureSection />
      </main>
    )
  } catch (error) {
    // Log the error and render a user-friendly error message
    console.error('Error rendering App component:', error)
    return (
      <div className="text-red-500 font-bold text-center p-4">
        An error occurred while rendering the app. Please try again later.
      </div>
    )
  }
}

export default App