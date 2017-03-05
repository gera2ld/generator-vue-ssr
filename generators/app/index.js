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
    this.yarnInstall();
  }
};
