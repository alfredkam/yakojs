var webpack = require('webpack');
module.exports = {
  context : __dirname+'/lib',
  entry : [
    './sparkLine',
  ],
  output : {
    path: __dirname+'/lib',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};