const path = require('path');
const webpack = require('webpack');
const MFS = require('memory-fs');
const clientConfig = require('./webpack.client.conf');
const serverConfig = require('./webpack.server.conf');

module.exports = function setupDev(app, opts) {
  Object.keys(clientConfig.entry).forEach(function (name) {
    clientConfig.entry[name] = ['./build/dev-client'].concat(clientConfig.entry[name]);
  });
  clientConfig.plugins.push(
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );

  // dev middleware
  const clientCompiler = webpack(clientConfig);
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    stats: {
      colors: true,
      chunks: false
    }
  });
  app.use(devMiddleware);
  clientCompiler.plugin('done', () => {
    const fs = devMiddleware.fileSystem;
    const filePath = path.join(clientConfig.output.path, 'index.html');
    if (fs.existsSync(filePath)) {
      const index = fs.readFileSync(filePath, 'utf-8');
      opts.onIndexUpdate(index);
    }
  });
  // force page reload when html-webpack-plugin template changes
  // clientCompiler.plugin('compilation', function (compilation) {
  //   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
  //     hotMiddleware.publish({ action: 'reload' });
  //     cb();
  //   });
  // });

  // hot middleware
  app.use(require('webpack-hot-middleware')(clientCompiler));

  // server renderer
  const serverCompiler = webpack(serverConfig);
  const mfs = new MFS();
  const outputPath = path.join(serverConfig.output.path, serverConfig.output.filename);
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(err => console.warn(err));
    opts.onBundleUpdate(mfs.readFileSync(outputPath, 'utf-8'));
  });
};
