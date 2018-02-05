const webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { isDev, isProd, resolve, styleRule } = require('./utils');
const vueLoaderConfig = require('./vue-loader.conf');

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  },
});

module.exports = {
  output: {
    path: resolve('dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js',
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '#': resolve('src'),
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
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: '[name].[ext]?[hash:7]',
        }
      },
      styleRule({
        fallback: 'vue-style-loader',
        loaders: ['postcss-loader'],
      }),
    ],
  },
  devtool: isDev ? '#inline-source-map' : false,
  plugins: [
    definePlugin,
    isProd && new MinifyPlugin(),
    isProd && new ExtractTextPlugin('[name].[chunkhash].css'),
  ].filter(Boolean),
};
