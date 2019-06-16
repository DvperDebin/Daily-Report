const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode:'production',

    entry: {
        main: './src/index.js',
    },

    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: '[name][hash:7].[ext]',
                        limit: 2048,
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader','postcss-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            modules: true,
                        }
                    }
                    ,'sass-loader','postcss-loader']
            },
            {
                test: /\.(ttf|svg|eot)$/,
                use: {
                    loader: 'file-loader',
                }
            },
        ]
    },
    // plugin 相当于在webpack 运行到某个时刻时做一些事情
    plugins: [
        new HtmlWebpackPlugin(  // 在打包结束后 自动在dist 目录下生成index.html 并插入打包生成的js文件
            {
                template: './src/index.html'  // 模板配置
            }
        ),
        new CleanWebpackPlugin(
            {
                cleanOnceBeforeBuildPatterns:['dist'] // 在打包之前 使用此插件删除dist目录下的所有内容
            }
        )
    ],

    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname,'dist'),
    }
};
