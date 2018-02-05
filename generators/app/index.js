const fs = require('mz/fs');
const Generator = require('yeoman-generator');

async function copyDir(gen, src, dist) {
  const files = await fs.readdir(src);
  files.forEach(name => {
    if (name.startsWith('.')) return;
    gen.fs.copyTpl(`${src}/${name}`, gen.destinationPath(`${dist}/${name.replace(/^_/, '.')}`), gen.state);
  });
}

module.exports = class VueSSR extends Generator {
  async prompting() {
    let pkg;
    try {
      pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
      delete pkg.scripts;
      delete pkg.dependencies;
      delete pkg.devDependencies;
    } catch (err) {
      // ignore
    }
    pkg = pkg || {};
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: pkg.name || this.appname,
      },
    ]);
    this.state = Object.assign({
      pkg,
    }, answers);
  }

  async app() {
    ['build', 'src']
    .forEach(name => {
      this.fs.copy(this.templatePath(name), this.destinationPath(name));
    });
    await copyDir(this, this.templatePath('_root'), '.');
    this.fs.extendJSON(this.destinationPath('package.json'), Object.assign({}, this.state.pkg, {
      name: this.state.name.replace(/\s+/g, '-').toLowerCase(),
    }));
  }

  install() {
    const deps = [
      'express',
      'vue',
      'vue-router',
      'vue-server-renderer',
      'lru-cache',
      '@babel/runtime',
    ];
    const devDeps = [
      'babel-eslint',
      'chalk',
      'css-loader',
      'eslint',
      'eslint-config-airbnb-base',
      'eslint-import-resolver-webpack',
      'eslint-plugin-html',
      'eslint-plugin-import',
      'extract-text-webpack-plugin',
      'babel-minify-webpack-plugin',
      'file-loader',
      'html-webpack-plugin',
      'url-loader',
      'vue-loader',
      'vue-style-loader',
      'vue-template-compiler',
      'postcss-scss',
      'autoprefixer',
      'precss',
      'webpack',
      'webpack-dev-middleware',
      'webpack-hot-middleware',
      'webpack-bundle-analyzer',
      'webpack-node-externals',
      // babel
      'babel-loader@8.0.0-beta.0',
      '@babel/core',
      '@babel/preset-env',
      '@babel/preset-stage-2',
      '@babel/plugin-transform-runtime',
    ];
    const res = this.spawnCommandSync('yarn', ['--version']);
    if (res.error && res.error.code === 'ENOENT') {
      this.npmInstall(deps);
      this.npmInstall(devDeps, { saveDev: true });
    } else {
      this.yarnInstall(deps);
      this.yarnInstall(devDeps, { dev: true });
    }
  }
};
