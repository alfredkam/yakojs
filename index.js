var sparkLine = require('./lib/sparkLine');
var pie = require('./lib/pie');
var donut = require('./lib/donut');
var bar = require('./lib/bar');
var bubble = require('./lib/bubble');
var svg = require('./lib/svg/svg');
var mixin = require('./lib/utils/mixin');

var initialize = function (component, obj) {
  if (typeof obj === 'object') {
    return new (obj.mixin ? mixin(mixin(component, obj.mixin), obj) : mixin(component, obj))();
  }
  return new component(obj);
};

module.exports = {
  name: 'yakojs',
  VERSION: '0.1.0',
  spark: function (opts) {
    return initialize(sparkLine, opts);
  },
  pie: function (opts) {
    return initialize(pie, opts);
  },
  donut: function (opts) {
    return initialize(donut, opts);
  },
  bubble: function (opts) {
    return initialize(bubble, opts);
  },
  bar: function (opts) {
    return initialize(bar, opts);
  },
  svg: svg
};