import * as Sentry from '@sentry/browser';

function init() {
  Sentry.init({
    dsn: 'https://796829b429824b09952a0bb05a53455d@sentry.io/1714566'
  });
}

function log(error) {
  Sentry.captureException(error);
}

export default {
  init,
  log
};
