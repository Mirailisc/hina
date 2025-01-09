import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import { BrowserRouter } from 'react-router-dom'

import * as Sentry from '@sentry/react'

import App from './App.tsx'
import './index.css'

const isProd = import.meta.env.MODE === 'production'

if (isProd) {
  Sentry.init({
    dsn: 'https://30d77b5a17db730c06d9c37a39b9b6af@o4508484759453696.ingest.us.sentry.io/4508501816770560',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}

if (isProd) {
  ReactGA.initialize('G-6VHE5KP5H2')
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
