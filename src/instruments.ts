// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'https://7e53650f5f55a53d313874dd06940c9f@o4509724292349952.ingest.de.sentry.io/4511179471323216',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
