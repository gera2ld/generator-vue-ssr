const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const base = require('./webpack.base.conf')
const { merge, isProd } = require('./utils');

module.exports = merge(base, {
  target: 'node',
  devtool: false,
  entry: './src/entry-server.js',
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
  },
  externals: nodeExternals({
    whitelist: /\.css$/,
  }),
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        VUE_ENV: '"server"',
      },
    }),
    new VueSSRServerPlugin(),
  ],
});
