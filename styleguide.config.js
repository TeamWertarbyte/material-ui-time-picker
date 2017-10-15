const { createConfig, babel } = require('webpack-blocks')

module.exports = {
  components: 'src/**/[A-Z]*.js',
  webpackConfig: createConfig([
    babel()
  ])
}
