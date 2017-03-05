const nconf = require('nconf');

nconf
.file({
  file: 'config.yml',
  format: require('nconf-yaml'),
})
.env()
.defaults({
  NODE_ENV: 'development',
  HOST: '',
  PORT: 8080,
});

module.exports = nconf;
