import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint2'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'
import type { PluginOption } from 'vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'

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
      alias: [{ find: 'src', replacement: resolve(__dirname, 'src') }],
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
