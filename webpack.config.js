const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

require('babel-polyfill');

// 使用 WEBPACK_SERVE 环境变量检测当前是否是在 webpack-server 启动的开发环境中
const dev = Boolean(process.env.WEBPACK_SERVE)

module.exports = {  
    /*
        webpack 执行模式
        development：开发环境，它会在配置文件中插入调试相关的选项，比如 moduleId 使用文件路径方便调试
        production：生产环境，webpack 会将代码做压缩等优化
    */  
    mode: dev ? 'development' : 'production', // 设置mode
    context:path.resolve(__dirname,'./'),
    entry:{
        app:['babel-polyfill','./src/index.js'],
    }, 
    output:{
        filename:'js/[name]-[hash:9].js',
        // filename:'js/bundle.js',
        path:path.resolve(__dirname,'./public/dist'),
    },
  
   /*
    配置 webpack 插件
    plugin 和 loader 的区别是，loader 是在 import 时根据不同的文件名，匹配不同的 loader 对这个文件做处理，
    而 plugin, 关注的不是文件的格式，而是在编译的各个阶段，会触发不同的事件，让你可以干预每个编译阶段。
    */ 
    plugins: [
        // 自动生成 HTML 页面
        /*
        html-webpack-plugin 用来打包入口 html 文件
        entry 配置的入口是 js 文件，webpack 以 js 文件为入口，遇到 import, 用配置的 loader 加载引入文件
        但作为浏览器打开的入口 html, 是引用入口 js 的文件，它在整个编译过程的外面，
        所以，我们需要 html-webpack-plugin 来打包作为入口的 html 文件
        */ 
        new HtmlWebpackPlugin({
            /*
            template 参数指定入口 html 文件路径，插件会把这个文件交给 webpack 去编译，
            webpack 按照正常流程，找到 loaders 中 test 条件匹配的 loader 来编译，那么这里 html-loader 就是匹配的 loader
            html-loader 编译后产生的字符串，会由 html-webpack-plugin 储存为 html 文件到输出目录，默认文件名为 index.html
            可以通过 filename 参数指定输出的文件名
            html-webpack-plugin 也可以不指定 template 参数，它会使用默认的 html 模板。
            */ 
            template: './src/index.html',
            chunksSortMode: 'none'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ], 
    module: {
         /*
        配置各种类型文件的加载器，称之为 loader
        webpack 当遇到 import ... 时，会调用这里配置的 loader 对引用的文件进行编译
        */
        rules: [
            {
                /*
                使用 babel 编译 ES6 / ES7 / ES8 为 ES5 代码
                使用正则表达式匹配后缀名为 .js 的文件
                */
                test: /\.js$/,
        
                // 排除 node_modules 目录下的文件，npm 安装的包不需要编译
                exclude: /node_modules/,
        
                /*
                use 指定该文件的 loader, 值可以是字符串或者数组。
                这里先使用 eslint-loader 处理，返回的结果交给 babel-loader 处理。loader 的处理顺序是从最后一个到第一个。
                eslint-loader 用来检查代码，如果有错误，编译的时候会报错。
                babel-loader 用来编译 js 文件。
                */
                use: ['babel-loader', 'eslint-loader']
              }, 
              {
                // 匹配 html 文件
                test: /\.html$/,
                /*
                使用 html-loader, 将 html 内容存为 js 字符串，比如当遇到
                import htmlString from './template.html';
                template.html 的文件内容会被转成一个 js 字符串，合并到 js 文件里。
                */
                use: 'html-loader'
              }, 
              {
                // 匹配 css 文件
                test: /\.css$/,
        
                /*
                先使用 css-loader 处理，返回的结果交给 style-loader 处理。
                css-loader 将 css 内容存为 js 字符串，并且会把 background, @font-face 等引用的图片，
                字体文件交给指定的 loader 打包，类似上面的 html-loader, 用什么 loader 同样在 loaders 对象中定义，等会下面就会看到。
                */
                use: ['style-loader', 'css-loader']
              },
        
              {
                /*
                匹配各种格式的图片和字体文件
                上面 html-loader 会把 html 中 <img> 标签的图片解析出来，文件名匹配到这里的 test 的正则表达式，
                css-loader 引用的图片和字体同样会匹配到这里的 test 条件
                */
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        
                /*
                使用 url-loader, 它接受一个 limit 参数，单位为字节(byte)
        
                当文件体积小于 limit 时，url-loader 把文件转为 Data URI 的格式内联到引用的地方
                当文件大于 limit 时，url-loader 会调用 file-loader, 把文件储存到输出目录，并把引用的文件路径改写成输出后的路径
        
                比如 views/foo/index.html 中
                <img src="smallpic.png">
                会被编译成
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAA...">
        
                而
                <img src="largepic.png">
                会被编译成
                <img src="/f78661bef717cf2cc2c2e5158f196384.png">
                */
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                      limit: 10000
                    }
                  }
                ]
              },
              {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            } 
        ]
    }, 

  
    // webpack-dev-server
    devServer: {
        historyApiFallback: true,
        inline: true,// 注意：不写hot: true，否则浏览器无法自动更新；也不要写colors:true，progress:true等，webpack2.x已不支持这些
        // 代理
        proxy: {
            // 请求到 '/zboxService' 下 的请求都会被代理到 target： http://localhost:8021 中
            '/zboxService/*': {
                target: 'http://localhost:8021',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true
            }
        }, 
    },
};