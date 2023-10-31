const path = require('path');

module.exports = {
  entry: './src/public/jsx/test.jsx',
  output: {
    filename: './public/jsx/test.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
