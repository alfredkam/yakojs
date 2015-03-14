var webpack = require('webpack');
module.exports = {
  context : __dirname,
  entry : [
    '../demo/demo-webpack',
    // './example-webpack'
  ],
  output : {
    path: __dirname,
    filename: '../demo/bundle.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};