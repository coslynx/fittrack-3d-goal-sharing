import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * Entry point of the React application.
 * Renders the App component into the 'root' element.
 * Handles potential errors during the rendering process.
 */
try {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Root element not found in the document.');
    ReactDOM.render(React.createElement('div', null, 'Error: Root element not found'), document.body);
  } else {
    ReactDOM.createRoot(rootElement).render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(App, null)
      )
    );
  }
} catch (error) {
  console.error('Failed to render the app:', error);
  ReactDOM.render(React.createElement('div', null, 'Error: Failed to render the app.'), document.body);
}