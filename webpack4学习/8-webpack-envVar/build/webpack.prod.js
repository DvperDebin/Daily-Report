const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const prodConfig = {
    mode:'production',
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
    optimization:{
        minimizer: [new OptimizeCSSAssetsPlugin({})]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename:'[hash:7][name].[ext]',
            chunkName:'[hash:7][name].chunk.[ext]',
        })
    ]
};
module.exports = prodConfig

