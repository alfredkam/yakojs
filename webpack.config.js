var webpack = require('webpack');
module.exports = {
  context : __dirname+'/demo',
  entry : [
    './demo-webpack',
    // './example-webpack'
  ],
  output : {
    path: __dirname + '/demo',
    filename: 'bundle.js'
    // filename: 'example.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};