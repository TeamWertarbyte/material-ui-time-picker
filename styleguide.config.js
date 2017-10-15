const { createConfig, babel, postcss } = require('webpack-blocks')

module.exports = {
  components: 'src/**/[A-Z]*.js',
  webpackConfig: createConfig([
    babel(),
    postcss()
  ])
}
