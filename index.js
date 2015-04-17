/*
  Copyright 2015 
  MIT LICENSE
  Alfred Kam (@alfredkam)
*/
var sparkLine = require('./lib/spark');
var pie = require('./lib/pie');
var donut = require('./lib/donut');
var bar = require('./lib/bar');
var bubble = require('./lib/bubble');
var svg = require('./lib/svg/svg');
var mixin = require('./lib/utils/mixin');
var bubbleScatterComplex = require('./lib/complex/bubble-scatter');
var bubblePointComplex = require('./lib/complex/bubble-point');

var initialize = function (component, obj) {
  if (typeof obj === 'object') {
    return new (obj.mixin ? mixin(mixin(component, obj.mixin), obj) : mixin(component, obj))();
  }
  return new component(obj);
};

module.exports = {
  name: 'yakojs',
  VERSION: '0.3.13',
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
  svg: svg,
  complex: {
    bubble: {
      scatter: function (opts) {
        return initialize(bubbleScatterComplex, opts);
      },
      point: function (opts) {
        return initialize(bubblePointComplex, opts);
      }
    }
  }
};