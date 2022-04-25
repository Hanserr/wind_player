const { defineConfig } = require('@vue/cli-service')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const {plugins} = require("eslint-plugin-vue/lib/configs/base");
const {rules} = require("eslint-plugin-vue");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  chainWebpack:config => {
    config.plugin('html')
        .tap(args => {
          args[0].title='WindPlayer'
          return args
        })
  }
},
    plugins[
        new VueLoaderPlugin()
],
    module[
        rules[
            {test:/\.vue$/,use:'vue-loader'}
            ]
        ]
)
