const config = require('./config');
const fs = require('fs');
// const path = require('path');
const express = require('express');
const proxyMiddleware = require('http-proxy-middleware');

const isDev = config.nconf.get('NODE_ENV') === 'development';

// default port where dev server listens for incoming traffic
const port = config.dev.port;

const app = express();

let indexHTML;
let renderer;
if (isDev) {
  // Define HTTP proxies to your custom API backend
  // https://github.com/chimurai/http-proxy-middleware
  const proxyTable = config.dev.proxyTable;
  // proxy api requests
  Object.keys(proxyTable).forEach((context) => {
    let options = proxyTable[context];
    if (typeof options === 'string') {
      options = { target: options };
    }
    app.use(proxyMiddleware(context, options));
  });

  require('./build/setup-dev')(app, {
    onBundleUpdate(bundle) {
      renderer = createRenderer(bundle);
    },
    onIndexUpdate(index) {
      indexHTML = parseIndex(index);
    },
  });
} else {
  renderer = createRenderer(fs.readFileSync('dist/server-bundle.js', 'utf8'));
  indexHTML = parseIndex(fs.readFileSync('dist/index.html', 'utf8'));
}

function createRenderer(bundle) {
  return require('vue-server-renderer').createBundleRenderer(bundle, {
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15,
    }),
  });
}
function parseIndex(template) {
  const container = '<div id="app"></div>';
  const i = template.indexOf(container);
  return {
    head: template.slice(0, i),
    tail: template.slice(i + container.length),
  };
}

// serve pure static assets
// var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
// app.use(staticPath, express.static('./static'));

const serverInfo = 'vue-server-renderer';

app.get('*', (req, res) => {
  if (!renderer || !indexHTML) {
    return res.status(503).end('Server not ready yet!');
  }
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Server', serverInfo);

  const context = { url: req.url };
  const renderStream = renderer.renderToStream(context);

  renderStream.once('data', () => {
    let { head } = indexHTML;
    const { _meta } = context.initialState || {};
    const { title } = _meta || {};
    if (title) {
      head = head.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`);
    }
    res.write(head);
  });
  renderStream.on('data', (chunk) => {
    res.write(chunk);
  });
  renderStream.on('end', () => {
    if (context.initialState) {
      res.write(`<script>window.__INITIAL_STATE__=${JSON.stringify(context.initialState)};</script>`);
    }
    res.end(indexHTML.tail);
  });
  renderStream.on('error', (err) => {
    if (err && err.status === '404') {
      res.status(404).end();
      return;
    }
    res.status(500).end();
    console.error(`Error during render: ${req.url}`);
    console.error(err);
  });
});

module.exports = app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Listening at http://localhost:${port}\n`);
})
