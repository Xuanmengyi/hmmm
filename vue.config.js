const path = require('path')
const port = process.env.port || process.env.npm_config_port || 9528
module.exports = {
  lintOnSave: false,
  devServer: {
    port: port,
    open: true
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .test(/.svg$/)
      .include.add(path.resolve(__dirname, './src/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    const fileRule = config.module.rule('file')
    fileRule.uses.clear()
    fileRule
      .test(/.svg$/)
      .exclude.add(path.resolve(__dirname, './src/icons/svg'))
      .end()
      .use('file-loader')
      .loader('file-loader')
  }
}
