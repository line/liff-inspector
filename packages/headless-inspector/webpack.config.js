const path = require('path');

/** @type import('webpack').Configuration */
const config = {
  context: path.join(__dirname, 'src'),
  entry: './headless-inspector.ts',
  output: {
    path: path.join(__dirname, 'dist', 'umd'),
    filename: 'headless-inspector.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
};

module.exports = config;
