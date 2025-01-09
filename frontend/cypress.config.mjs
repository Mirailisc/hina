import { defineConfig } from 'cypress'

import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild'
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'

async function setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config)

  on(
    'file:preprocessor',
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  )

  return config
}

export default defineConfig({
  e2e: {
    specPattern: '**/*.feature',
    supportFile: false,
    baseUrl: 'http://localhost:3000',
    retries: {
      runMode: 2,
      openMode: 0,
    },
    defaultCommandTimeout: 5000,
    setupNodeEvents,
    video: true,
  },
})
