const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // css 代码分割插件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 生产环境压缩css插件
const prodConfig = {
    mode:'production',
    // 在开发环境中 启用 css 代码分割 需要配置相应loader， loader中的style-loader需要被替换成MiniCssExtractPlugin.loader
    module: {
      rules: [
          {
              test: /\.css$/,
              use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    }
                    ,'css-loader','postcss-loader']
          },
          {
              test: /\.scss$/,
              use: [
                  {
                      loader: MiniCssExtractPlugin.loader
                  },
                  {
                      loader: 'css-loader',
                      options: {
                          importLoaders: 2,
                          modules: true,
                      }
                  }
                  ,'sass-loader','postcss-loader']
          },
      ]
    },

    // css 代码压缩需要 设置 minimizer
    optimization:{
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
    plugins: [
        // css 代码分割
        new MiniCssExtractPlugin({
            filename:'[hash:7][name].[ext]',
            chunkName:'[hash:7][name].chunk.[ext]',
        })
    ]
};
module.exports = merge(baseConfig, prodConfig);

