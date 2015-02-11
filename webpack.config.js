var webpack = require('webpack');
module.exports = {
  context : __dirname+'/demo',
  entry : [
    './demo-webpack',
  ],
  output : {
    path: __dirname + '/demo',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};