const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode:'development',  //sourceMap 在development模式下默认被配置好
    devtool: 'cheap-source-map', //source-map 映射错误会具体到哪一行那一列 加上cheap-前缀会只具体到哪一行而且只会针对业务代码，加上module-前缀会针对业务和其他代码 比如loader
    // 开发环境 使用 cheap-module-eval-source-map   线上环境最好不用 或者用 cheap-module-source-map(相对来说不建议)
    entry: {
        main: './src/index.js',
       // sub: './src/index.js'
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
              test: /\.js$/,
              loader: "babel-loader",
              exclude: /node_modules/, // 排除第三方插件库的js代码
/*              options: {   // 放到 .babelrc中
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                useBuiltIns: "usage", // 当babel-polyfill 添加es6特性时 不全都加 只根据业务代码来添加
                            }
                        ]
                    ]
               },*/

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
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: './src/index.html'
            }
        ),
        new CleanWebpackPlugin(
            {
                cleanOnceBeforeBuildPatterns:['dist']
            }
        ),
        // 配合dev-server 中的HMR使用
        new webpack.HotModuleReplacementPlugin()
    ],

    optimization: {
        // production tree-shaking 类的配置都被配置好了
        usedExports: true, // tree-shaking 的应用 哪些包被使用了 才会被打包, 要配合 package.json 中 sideEffects 使用,sideEffects 数组中的内容都是被usedExports忽略的 也就是一定会被打包
    },

    output:{
        publicPath: '/', // 在index.html中 script 引入的src上加公用路径 适合 所有静态资源上传到cdn或者其他服务器时使用
        filename: '[name][hash:7].js',  // 这里[name] 对应打包entry的key值
        path: path.resolve(__dirname,'dist'),
    },

    devServer: {
        contentBase: './dist', // 监听
        open:true, // 启动webpack-dev-Server 时会自动打开浏览器并访问本地地址
        port:8080,
        hot:true, // 开启HMR - css 修改不会刷新页面 不会改js之前渲染出的内容
        hotOnly:true, // 即使HMR 没有生效 也不让浏览器自动刷新
    }
};

/*  三种开发服务器的方式：
*   webpack --watch  会监听打包的文件 一旦文件发生改变 就会重新打包 （不推荐）
*   webpack-dev-server 通过package.json 中 scripts配置以及 webpack.config.js中 devServer配置 （最推荐）
*   使用node express/koa 快速搭建一个服务器 利用 webpack 中间件以及编译器 （相对不推荐）
*/

/*
* webpack-dev-server 会把打包好的dist 目录放到 内存中以提高效率
*/
