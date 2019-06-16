const path = require('path');

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
            /* loader 的执行顺序是从右到左，从下到上 */
            {
                test: /\.css$/, // 遇到以.css结尾的文件时, 使用css-loader,style-loader
                use: ['style-loader','css-loader','postcss-loader'] // css-loader 可以分析出几个css文件之间的关系 然后合并成一段css
                //  style-loader 能把得到的合并后的css内容后 解析挂载到html head中
            },
            {
                test: /\.scss$/,
                use: ['style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2, // 通过import 引入的scss 在引入之前也要经过 sass-loader 和 postcss-loader
                            modules: true, // 开启css的模块化打包
                        }
                    }
                    ,'sass-loader','postcss-loader'] // 需要 sass-loader 把 scss 转换成 css, 下载sass-loader时也需要 node-sass
                // 'postcss-loader' 配置在postcss.config.js中 当前我们使用这个loader来自动补充厂商前缀
            },
            // 对字体文件进行处理
            {
                test: /\.(ttf|svg|eot)$/,
                use: {
                    loader: 'file-loader', // 打包 字体文件 其实就是把 这类文件用file-loader 从 src 移动到 dist文件下即可
                }
            },
        ]
    },

    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname,'dist'),
    }
};
