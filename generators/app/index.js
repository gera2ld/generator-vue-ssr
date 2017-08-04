const fs = require('fs');
const Generator = require('yeoman-generator');

module.exports = class VueSSR extends Generator {
  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname.toLowerCase().replace(/\s+/g, '-'),
    }, {
      type: 'input',
      name: 'description',
      message: 'Description of your project',
    }, {
      type: 'input',
      name: 'author',
      message: 'Author',
    }])
    .then(answers => {
      this.context = answers;
    });
  }

  app() {
    ['build', 'config', 'src']
    .forEach(name => {
      this.fs.copy(this.templatePath(name), this.destinationPath(name));
    });
    const rootFilesDir = this.templatePath('root-files');
    fs.readdirSync(rootFilesDir)
    .forEach(name => {
      if (name.startsWith('.')) return;
      this.fs.copy(`${rootFilesDir}/${name}`, this.destinationPath(name.replace(/^_/, '.')));
    });
    ['package.json', 'README.md']
    .forEach(name => {
      this.fs.copyTpl(this.templatePath(name), this.destinationPath(name), this.context);
    });
  }

  install() {
    const deps = [
      'express',
      'nconf',
      'nconf-yaml',
      'vue',
      'vue-router',
      'vue-server-renderer',
    ];
    const devDeps = [
      'autoprefixer',
      'babel-core',
      'babel-eslint',
      'babel-loader',
      'babel-plugin-transform-runtime',
      'babel-preset-env',
      'chalk',
      'connect-history-api-fallback',
      'css-loader',
      'eslint',
      'eslint-config-airbnb-base',
      'eslint-import-resolver-webpack',
      'eslint-plugin-html',
      'eslint-plugin-import',
      'eventsource-polyfill',
      'extract-text-webpack-plugin',
      'file-loader',
      'friendly-errors-webpack-plugin',
      'html-webpack-plugin',
      'http-proxy-middleware',
      'ora',
      'rimraf',
      'semver',
      'url-loader',
      'vue-loader',
      'vue-style-loader',
      'vue-template-compiler',
      'webpack',
      'webpack-bundle-analyzer',
      'webpack-dev-middleware',
      'webpack-hot-middleware',
      'webpack-merge',
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
