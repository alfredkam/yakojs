var webpack = require('webpack');
module.exports = {
  context : __dirname,
  entry : [
    '../demo/example-webpack'
  ],
  output : {
    path: __dirname,
    filename: '../demo/example.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};