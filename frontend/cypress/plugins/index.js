/* eslint-disable global-require */

module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);
  on('file:preprocessor', require('@cypress/code-coverage/use-browserify-istanbul'));

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config;
};

/* eslint-enable global-require */
