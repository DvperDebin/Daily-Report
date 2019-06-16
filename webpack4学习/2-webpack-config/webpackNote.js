const path = require('path'); // 引入node 核心模块

module.exports = {

    mode:'production', // 打包模式 如果不填默认为production，可选值还有development

    // 项目打包入口
    entry: {
        main: './index.js'
    },
    // entry: './index.js', 这是入口的简写方式

    // 项目打包出口
    output: {
        filename: 'main.js',  // 打包后文件的名称
        // __dirname 相当于当前 webpackNote.js 所在的路径
        path: path.resolve(__dirname,'main'), // 打包后文件的绝对路径： webpackNote.js 所在的路径/main/main.js
    }
};
/*
*  这个简单的webpack配置 意思就是 以index.js作为入口 将文件打包到当前 webpackNote.js 所在的路径下的main文件夹中，打包后文件名为main.js
*  运行 npx webpack
*  webpack 默认会去找 webpack.config.js 为配置文件 如果想指定配置文件 运行 npx webpack --config xxxxxx.js
*  例如 想要运行本配置 npx webpack --config webpackNote.js
*/

/*
*  webpack 与 npm scripts连用
*  在package.json 中找到 scripts 对象 在这个对象中 key 为npm命令，value为要执行的命令
*  例如在这个demo中  "bundle": "webpack"  我们运行的命令是 npm run bundle 实际运行命令是 webpack 相当于之前的 npx webpack
*/

/* **** webpack-cli 的作用是可以让我们在命令行里使用webpack的命令 **** */
