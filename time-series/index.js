var mixin = require('../lib/utils/mixin');
var bubblePoint = require('./bubble/bubble-point');
var bubbleScatter = require('./bubble/bubble-scatter');
var line = require('./line');

var initialize = function (component, obj) {
  if (typeof obj === 'object') {
    return new (obj.mixin ? mixin(mixin(component, obj.mixin), obj) : mixin(component, obj))();
  }
  return new component(obj);
};

module.exports = {
  bubble: {
    point: function (opts) {
      return initialize(bubblePoint, opts);
    },
    scatter: function (opts) {
      return initialize(bubbleScatter, opts);
    },
    line: function (opts) {
      return initialize(line, opts);
    }
  }
};