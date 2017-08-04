const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
const isDev = config.nconf.get('NODE_ENV') === 'development';

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/client.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: isDev ? config.dev.assetsPublicPath : config.build.assetsPublicPath,
    filename: isDev ? '[name].js' : utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: isDev ? '[id].js' : utils.assetsPath('js/[id].[chunkhash].js'),
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      src: resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
