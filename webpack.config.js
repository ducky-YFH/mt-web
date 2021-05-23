const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 提取css到单独文件的插件
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //压缩css插件

// HTML模板文件所在的文件夹
const htmlDir = path.join(__dirname, "public/");
// 入口文件所在文件夹
const srcDir = path.join(__dirname, "src/");

// 扫描获取入口
function scanEntry() {
  var entry = {};
  glob.sync(srcDir + "/**/*.js").forEach((name) => {
    name = path.normalize(name);
    chunkName = name.replace(srcDir, "").replace(/\\/g, "/").replace(".js", "");
    entry[chunkName] = name;
  });
  return entry;
}
// 扫描获取所有HTML模板
function scnanHtmlTemplate() {
  var htmlEntry = {};
  // 扫描目录以及子目录下所有html结尾的文件，不包含 include 文件夹
  glob.sync(htmlDir + "/**/*.html", { ignore: "**/include/**", }).forEach((name) => {
    name = path.normalize(name);
    chunkName = name
      .replace(htmlDir, "")
      .replace(/\\/g, "/")
      .replace(".html", "");
    htmlEntry[chunkName] = name;
  });
  return htmlEntry;
}
// 构建HtmlWebpackPlugin对象
function buildHtmlWebpackPlugins() {
  var tpl = scnanHtmlTemplate();
  var chunkFilenames = Object.keys(tpl);
  return chunkFilenames.map((item) => {
    var conf = {
      filename: item + ".html",
      template: tpl[item],
      inject: true,
      favicon: path.resolve("./public/favicon.ico"),
      chunks: [item],
    };
    return new HtmlWebpackPlugin(conf);
  });
}
// 所有入口文件
const entry = scanEntry();
// 插件对象
let plugins = [
  new CleanWebpackPlugin({
    verbose: true,
  }),
  new MiniCssExtractPlugin({
    filename: "assets/css/[name]_[chunkhash].css", // 输出目录与文件
  }),
  new OptimizeCssAssetsPlugin(),
];
// 所有 HtmlWebpackPlugin插件
plugins = plugins.concat(buildHtmlWebpackPlugins());

module.exports = {
  entry,
  output: {
    path: path.resolve("./dist"),
    filename:
      process.env.NODE_ENV === "production"
        ? "assets/js/[name].[chunkhash].js"
        : "assets/js/[name].js",
    publicPath: "/",
  },
  resolve: {
    extensions: ['.js', '.json','.less','.css'],
    alias: {
      '@': path.resolve('./src')
    }
  },
  module: {
    rules: [
      {
        // 它会应用到普通的 `.css` 文件,
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
          // outputPath:'assets/img'// 传入file-loader将图片输出到 dist/assets/img文件夹下
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
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ],
  },
  plugins,
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
    entrypoints: false
  }
};
