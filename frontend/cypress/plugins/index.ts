/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  if (config.testingType === 'component') {
    const { startDevServer } = require('@cypress/webpack-dev-server')

    // No need to import a plugin here because we're using plain Webpack
    // Hahahahaha!!
    const webpackConfig = require('../../../webpack.config.ts')

    on('dev-server:start', (options) =>
      startDevServer({ options, webpackConfig })
    )
  }

  return config
}