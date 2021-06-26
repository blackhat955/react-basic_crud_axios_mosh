import * as Sentry from '@sentry/browser';

function init() {
  Sentry.init({
    dsn: "https://2b9d87e993b04562bdb541dea5060ad4@o881070.ingest.sentry.io/5835340",
  
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });

}

function log(error) {
  Sentry.captureException(error);
}

export default {
  init,
  log
}