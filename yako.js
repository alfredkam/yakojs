var spark = require('./lib/bundle');
var yako = {
  VERSION: '1.0.0',
  spark: spark
};

// support CommonJS
if (typeof exports === 'object')
  module.exports = yako;

// support AMD
else if (typeof define === 'function' && define.amd)
  define(function() { return yako; });

// support browser
else
  this.yako = yako;