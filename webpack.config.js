require('babel-core/register')({
  ignore: /(node_modules|__tests__)/,
  optional : [
    'es7.asyncFunctions',
    'es7.classProperties',
    'es7.comprehensions',
    'es7.decorators',
    'es7.doExpressions',
    'es7.exponentiationOperator',
    'es7.exportExtensions',
    'es7.objectRestSpread',
    'es7.trailingFunctionCommas'
  ],

  blacklist: ['strict'],

  extensions: [".es6", ".es", ".jsx", ".es6.js", ".js" ]
});

var webpack = require('webpack');
var path = require('path');

module.exports = {

  context : __dirname,

  entry : {
      yako : './build-tools/expose.build'
  },

  devtool: 'source-map',

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
      {
        test: /\.jsx$/,
        loaders: ['jsx-loader?harmony']
      },

      {
          test: /\.(es6|js)$/,
          loader: 'babel-loader?stage=0&blacklist=useStrict'
      },

      // allow less files to load urls pointing to font assets
      // @TODO: figure out why this is necessary and do it better
      {
          test: /\.(woff|ttf|eot|svg)$/, loader: 'file-loader'
      }
    ]
  }
};
