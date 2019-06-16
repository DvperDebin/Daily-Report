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
                    loader: 'url-loader', // url-loader 会把图片变成base 64格式 然后放到打包后的js文件中
                    options: {
                        name: '[name][hash:7].[ext]',
                        limit: 2048, // 如果图片大小超过2048字节（2kb） 那就会生成一个图片，否则就会 会把图片变成base 64格式 然后放到打包后的js文件中
                    }
                }
            }
        ]
    },

    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname,'dist'),
    }
};
