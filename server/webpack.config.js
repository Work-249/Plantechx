// server/webpack.config.js
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'index.js'), // your handler entry
  target: 'node',
  mode: 'production', // use 'development' while debugging
  output: {
    path: path.resolve(__dirname, '.webpack_output'),
    filename: 'index.js',           // MUST match your handler filename
    libraryTarget: 'commonjs2',
  },
  externalsPresets: { node: true }, // keeps built-in node modules external
  resolve: {
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [
      // add loaders if you use babel/ts
    ],
  },
};
