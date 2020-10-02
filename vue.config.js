const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  chainWebpack: config => {
    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        // Languages are loaded on demand at runtime
        languages: ['json', 'javascript', 'html', 'xml']
      }
    ])
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },

  devServer: {
    disableHostCheck: true
  },

  publicPath: process.env.DEPLOY_PATH,

  configureWebpack: {
    devtool: 'source-map'
  },

  css: {
    loaderOptions: {
      scss: {
        data: `
          @import "src/assets/variables.scss";
        `
      }
    }
  }
}
