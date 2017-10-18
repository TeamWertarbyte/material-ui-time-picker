const { createConfig, babel } = require('webpack-blocks')
const path = require('path')

module.exports = {
  components: 'src/**/[A-Z]*.js',
  webpackConfig: createConfig([
    babel()
  ]),
  getComponentPathLine: (componentPath) => {
    const name = path.basename(componentPath, '.js')
    return `import { ${name} } from 'material-ui-time-picker';`
  }
}
