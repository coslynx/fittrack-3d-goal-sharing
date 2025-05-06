import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * @param {string} mode - The application mode (e.g., 'development', 'production').
 * @param {string} command - The command being run (e.g., 'serve', 'build').
 * @returns {import('vite').UserConfigExport} - Vite configuration object.
 */
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  try {
    /** @type {import('vite').UserConfig} */
    const config = {
      base: '/',
      server: {
        /** Configure HMR for development */
        hmr: true,
      },
      build: {
        /** Optimizes for modern browsers */
        target: 'esnext',
        /** Enable or disable brotli compress, or set a different algorithm */
        brotliSize: true,
        /** Chunk size warning limit (default 500) */
        chunkSizeWarningLimit: 1000,
        /** Minify option. When set to 'boolean', it will be automatically determined based on the `mode` */
        minify: isProduction,
        /** Manifest file name */
        manifest: false,
        /** Sourcemap generation for production builds */
        sourcemap: !isProduction,
        /** Adjust chunk strategy to optimize initial load */
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                return 'vendor';
              }
            },
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'js/[name]-[hash].js',
            assetFileNames: '[ext]/[name]-[hash].[ext]',
          },
        },
      },
      /** Define environment variables */
      define: {
        'process.env': env,
        __BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL),
        __MODEL_PATH_GRAPH__: JSON.stringify(env.VITE_MODEL_PATH_GRAPH),
        __MODEL_PATH_GOALPOST__: JSON.stringify(env.VITE_MODEL_PATH_GOALPOST),
        __MODEL_PATH_TROPHY__: JSON.stringify(env.VITE_MODEL_PATH_TROPHY),
      },
      /** Handle module aliases */
      resolve: {
        alias: {
          '~assets': path.resolve(__dirname, 'public/assets'),
          '@': path.resolve(__dirname, 'src'),
        },
      },
      /** Add React plugin */
      plugins: [react()],
    };
    return config;
  } catch (error) {
    console.error('Vite configuration failed:', error);
    return {
      /** Fallback configuration to prevent complete failure */
      plugins: [react()],
      define: {
        __BASE_URL__: JSON.stringify(''),
        __MODEL_PATH_GRAPH__: JSON.stringify(''),
        __MODEL_PATH_GOALPOST__: JSON.stringify(''),
        __MODEL_PATH_TROPHY__: JSON.stringify(''),
      },
    };
  }
});