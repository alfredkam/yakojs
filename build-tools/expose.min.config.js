var webpack = require('webpack');
module.exports = {
  context : __dirname,
  entry : [
    './expose.build',
  ],
  output : {
    path: __dirname,
    filename: '../yako.min.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};
