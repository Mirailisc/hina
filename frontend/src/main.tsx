import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import * as Sentry from '@sentry/react'

import App from './App.tsx'
import './index.css'

Sentry.init({
  dsn: 'https://30d77b5a17db730c06d9c37a39b9b6af@o4508484759453696.ingest.us.sentry.io/4508501816770560',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
