function disableStyles() {
  require.extensions = require.extensions || {};
  require.extensions['.less'] = Function.prototype;
  require.extensions['.css'] = Function.prototype;
  require.extensions['.sass'] = Function.prototype;
  require.extensions['.svg'] = Function.prototype;
}

// disableStyles();
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

disableStyles();
