var webpack = require('webpack');
module.exports = {
  context : __dirname,
  entry : [
    './build-tools/expose.build',
  ],
  output : {
    path: __dirname,
    filename: 'yako.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};
