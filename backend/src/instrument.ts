import * as Sentry from '@sentry/nestjs'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

Sentry.init({
  dsn: 'https://e77f7cdd53493720e0d5105841507dd8@o4508484759453696.ingest.us.sentry.io/4508501771485184',
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
})
