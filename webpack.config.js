const path = require('path');

module.exports = {
  stats: { errorDetails: true },
  mode: 'production',
  entry: './src/client/jsx/index.jsx',
  output: {
    filename: './client/jsx/index.js',
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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: ['svg-loader', 'file-loader'],
      },
    ],
  },
};
