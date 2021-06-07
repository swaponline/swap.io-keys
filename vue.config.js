module.exports = {
  lintOnSave: true,

  devServer: {
    open: true,
    // https: true,
    disableHostCheck: true,
    watchOptions: {
      ignored: /node_modules/,
      poll: 1000
    }
    // proxy: ''
  },

  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/front/assets/scss/vars"; @import "~@/front/assets/scss/media";'
      }
    }
  },
  transpileDependencies: ['vuetify'],

  pages: {
    index: {
      entry: 'src/front/main.ts',
      template: 'public/index.html'
    }
  },

  pluginOptions: {
    lintStyleOnBuild: false,
    stylelint: {},
    svgSprite: {
      dir: 'src/front/assets/icons',
      test: /\.(svg)(\?.*)?$/,
      loaderOptions: {
        extract: true,
        spriteFilename: 'img/icons.[hash:8].svg'
      }
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()

    svgRule.use('svg-sprite-loader').loader('svg-sprite-loader')
  }
}
