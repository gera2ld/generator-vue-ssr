const webpack = require('webpack')
const config = require('../config')
const baseWebpackConfig = require('./webpack.base.conf')
const isDev = config.nconf.get('NODE_ENV') === 'development';

module.exports = Object.assign({}, baseWebpackConfig, {
  target: 'node',
  devtool: false,
  entry: './src/server.js',
  output: Object.assign({}, baseWebpackConfig.output, {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
  }),
  externals: Object.keys(require('../package.json').dependencies),
  plugins: [
    new webpack.DefinePlugin({
      'process.env': Object.assign({
        VUE_ENV: '"server"',
      }, isDev ? config.dev.env : config.build.env),
    }),
  ],
});
