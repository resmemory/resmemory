const path = require('path');
const webpack = require('webpack');

module.exports = {
  stats: { errorDetails: true },
  mode: 'development', // production
  entry: './src/client/jsx/index.jsx',
  output: {
    filename: './client/jsx/index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, './dist/client'),
    },
    hot: true,
    port: 8000,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
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