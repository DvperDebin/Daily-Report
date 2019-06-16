const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack')

module.exports = {
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
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                    'imports-loader?this=>window'  // 强制模块中的this指向为loader
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(ttf|svg|eot)$/,
                use: {
                    loader: 'file-loader',
                }
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: './src/index.html'
            }
        ),
        new CleanWebpackPlugin(
            /*{  // 更新新版本后无需配置 会自动将output path文件夹中的内容删除一遍（文件夹不删）
                cleanOnceBeforeBuildPatterns:['dist']
            }*/
        ),
        new webpack.ProvidePlugin({
            $: 'jQuery', // 如果在某个模块里使用了$ 这个字符串 那么我们就会在这个模块里引入 jQuery这个模块，然后把jQuery 赋值给$，相当于做了一步 import $ from 'jQuery'
            _: 'lo dash'
        })
    ],
    output:{
        publicPath: '/',
        filename: '[name][hash:7].js',
        chunkFilename:'[name][hash:7].chunk.js',
        path: path.resolve(__dirname,'../dist'),
    },
    // 不要 warning 性能问题
    performance:false,

    optimization: {
        runtimeChunk:{
          name: 'runtime',
        },
        // 配合package.json中的sideEffects 使用 不对sideEffects中的文件进行tree-shaking
        usedExports: true,
        // 代码分割
        splitChunks:{
            chunks: 'all', // 将所有的内容进行代码分割 可选 async（默认值）  - 只对异步代码生效 initial - 只对同步代码生效
            minSize: 30000, // 引入的模块大小 大于30kb 才会做代码分割
            maxSize: 50000, // 可配可不配 对于分割出来的代码 进行二次分割 （相对不建议配置）
            minChunks: 1, // 打包生成的模块中到底有几个引用了当前模块 数量超过才会被分割
            maxAsyncRequests:5, // 同时最多加载几个模块 （建议使用默认）
            maxInitialRequests:3, // 入口文件或者说网站首页加载时所用的模块需要被分割成几个模块 （建议使用默认）
            automaticNameDelimiter: '~', // 分割出来的代码做文件名连接时的连接符
            name:true, // cacheGroup 的 filename配置有效性 （建议使用默认）
            // 对同步代码进行分割的配置
            catchGroups:{
                // 对于chunks:all 进行必要配置后才可以对同步代码进行分割, 这里只分割 node_modules 下的第三方库
                vendors: {
                    test: /[\\/]node_modules[\\/]/, // 检测是否在 node_modules 下的库
                    priority: -10, // priority 值越大 优先级越高 比如 node_modules 既符合vendors又符合default（因为通过了vendors的test，同时default中没有test），这时候就要比较priority， -10 > -20 所以遵守vendors的配置
                    filename: '[hash:7][name].[ext]'
                },
                // 这里是对业务逻辑的同步代码进行分割的配置
                default: {
                    priority: -20,
                    reuseExistingChunk: true, // 如果一个模块已经打包过了，又再次被引用 那么这次引用将不会被打包 而会复用上次的打包结果
                    filename: '[hash:7][name].[ext]'
                }
            }
        },
    },
}

/*
*  dynamic-import-webpack - 可以帮助我们实现异步引入文件的代码的分割
*/
