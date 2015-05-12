/*
  Copyright 2015
  MIT LICENSE
  Alfred Kam (@alfredkam)
*/

var sparkLine = require('./lib/components/spark');
var pie = require('./lib/components/pie');
var donut = require('./lib/components/donut');
var bar = require('./lib/components/bar');
var bubble = require('./lib/components/bubble');
var svg = require('./lib/svg/svg');
var mixin = require('./lib/utils/mixin');
// time series / object base
var bubblePoint = require('./lib/components/bubble.point');
var bubbleScatter = require('./lib/components/bubble.scatter');
var line = require('./lib/components/line');

var initialize = function (component, obj) {
  if (typeof obj === 'object') {
    return new (obj.mixin ? mixin(mixin(component, obj.mixin), obj) : mixin(component, obj))();
  }
  return new component(obj);
};

module.exports = {
  name: 'yakojs',
  VERSION: '0.4.0',
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
  timeSeries: {
    bubble: {
      point: function (opts) {
        return initialize(bubblePoint, opts);
      },
      scatter: function (opts) {
        return initialize(bubbleScatter, opts);
      }
    },
    line: function (opts) {
      return initialize(line, opts);
    }
  }
};
