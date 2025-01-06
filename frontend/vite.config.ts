import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import type { PluginOption } from 'vite'
import eslint from 'vite-plugin-eslint2'
import tsconfigPaths from 'vite-tsconfig-paths'

import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  process.env = { ...process.env, ...env }

  return {
    optimizeDeps: {
      include: [],
    },
    build: {
      commonjsOptions: {
        exclude: [],
        include: [/node_modules/],
      },
    },
    base: '/',
    plugins: [
      react(),
      eslint({ fix: true }) as PluginOption,
      tsconfigPaths(),
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'phubordin-poolnai',
        project: 'ui-client',
      }),
    ],
    resolve: {
      alias: {
        '@components': resolve(__dirname, 'src/components'),
        '@constants': resolve(__dirname, 'src/constants'),
        '@gql': resolve(__dirname, 'src/gql'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@context': resolve(__dirname, 'src/context'),
        '@lib': resolve(__dirname, 'src/lib'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@images': resolve(__dirname, 'src/images'),
      },
    },
    server: {
      port: 3000,
    },
    preview: {
      host: '0.0.0.0',
      port: 8000,
    },
  }
})
