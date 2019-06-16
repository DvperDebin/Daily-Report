const webpack = require('webpack');

const devConfig = {
    mode:'development',
    devtool: 'cheap-source-map',

    module: {
        rules: [
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
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        contentBase: './dist',
        open:true,
        port:8080,
        hot:true,
    }
};
module.exports = devConfig
