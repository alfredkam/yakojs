var webpack = require('webpack');
module.exports = {
  context : __dirname+'/lib',
  entry : [
    './sparkLine',
  ],
  output : {
    path: __dirname,
    filename: 'yako.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  module : {
    loaders: [
      { test: require.resolve("index"), loader: "expose?Yako" }
    ]
  }
};