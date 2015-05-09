var webpack = require('webpack');
var path = require('path');

module.exports = {

  context : __dirname,

  entry : {
      yako : './index'
  },

  output : {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      {test: /\.jsx$/, loaders: ['react-hot', 'jsx-loader?harmony']},
      {
        test: /\.es6$/,
        loader: 'babel-loader?blacklist=strict'
      },

      // allow less files to load urls pointing to font assets
      // @TODO: figure out why this is necessary and do it better
      {test: /\.(woff|ttf|eot|svg)$/, loader: 'file-loader' }
    ]
  }
};
