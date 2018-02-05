// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  parser: require('postcss-scss'),
  plugins: [
    require('autoprefixer'),
    require('precss'),
  ],
};
