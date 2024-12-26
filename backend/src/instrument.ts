import * as Sentry from '@sentry/nestjs'

Sentry.init({
  dsn: 'https://86b9b294e05e6958220380db93df7763@o4508484759453696.ingest.us.sentry.io/4508501773058048',
  tracesSampleRate: 1.0,
})
