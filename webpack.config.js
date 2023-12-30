const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/public/jsx/index.jsx',
  output: {
    filename: './public/jsx/index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
    ],
  },
};
