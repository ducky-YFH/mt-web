const path = require("path");
const glob = require("glob");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取css到单独文件的插件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //压缩css插件

const getEntry = () => {
  const entry = {}; 
  const reg = /(?<=src\\page\\).*?(?=\\\w*\.js)/;
  const entryPaths = glob.sync('./src/page/**/*.js');

  entryPaths.forEach(item => {
    const normalPath = path.normalize(item);
    const name = reg.exec(normalPath)[0].replace('\\', '/');
    
    entry[name] = path.join(__dirname, normalPath)
  });
  
  return entry;
}

const getHtmlPlugins = () => {
  const reg = /(?<=src\\page\\).*?(?=\\\w*\.html)/;
  const paths = glob.sync("./src/page/**/*.html");

  return paths.map(item => {
    const normalPath = path.normalize(item);
    const name = reg.exec(normalPath)[0].replace('\\', '/');
    
    return new HtmlWebpackPlugin({
      template: path.join(__dirname, normalPath),
      filename: `${name}.html`,
      inject: true,
      chunks: [name, 'main'],
      favicon: path.resolve("./src/assets/favicon.ico")
    })
  })
}

module.exports = {
  devServer: {
    inline: true,
    contentBase:path.resolve(__dirname, 'dist'),
    compress: true,
    hot: true,
    host: '0.0.0.0', // 0.0.0.0 localhost
    port: 3000,
    overlay: {
      warnings: false,
      errors: true
    },
  },
  entry: {
    main: './src/main.js',
    ...getEntry(),
  },
  output: {
    path: path.resolve("./dist"),
    filename: process.env.NODE_ENV === "prod" ? "assets/js/[name].[chunkhash].js" : "assets/js/[name].js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".json", ".less", ".css"],
    alias: {
      "@": path.resolve("./src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["html-withimg-loader"]
      },
      {
        // use数组loader的名字是有顺序的，即先由less-loader，再由css-loader处理，最后由style-loader处理
        test: /\.(sc|c|sa|le)ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // 匹配图片文件
        loader: "url-loader",
        options: {
          limit: 10 * 1024, // 小于limit限制的图片将转为base64嵌入引用位置
          fallback: "file-loader", // 大于limit限制的将转交给指定的file-loader处理
          outputPath:'assets/img',// 传入file-loader将图片输出到 dist/assets/img文件夹下
          esModule: false,
          name: "assets/img/[name].[hash:7].[ext]",
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "assets/media/[name].[hash:7].[ext]",
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: "assets/fonts/[name].[hash:7].[ext]",
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: require.resolve('jquery'),
        use: {
          loader: 'expose-loader',
          options: '$'
        }
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/[name]_[chunkhash].css", // 输出目录与文件
    }),
    new CleanWebpackPlugin({
      verbose: true,
    }),
    new OptimizeCssAssetsPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    ...getHtmlPlugins()
  ],
  // 提取公共模块，包括第三方库和自定义工具库等
  optimization: {
    // 找到chunk中共享的模块,取出来生成单独的chunk
    splitChunks: {
      chunks: "all", // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
      cacheGroups: {
        vendors: {
          // 抽离第三方插件
          test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
          name: "vendors",
          priority: -10, // 抽取优先级
        },
        utilCommon: {
          // 抽离自定义的公共库
          name: "common",
          minSize: 0, // 将引用模块分离成新代码文件的最小体积
          minChunks: 2, // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
          priority: -20,
        },
      },
    },
    // 为 webpack 运行时代码创建单独的chunk
    runtimeChunk: {
      name: "manifest",
    },
  },
  stats: {
    assets: false,
    modules: false,
    entrypoints: false,
  },
};
