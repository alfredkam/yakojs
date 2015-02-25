var sparkLine = require('./lib/sparkLine');
var pie = require('./lib/pie');
var donut = require('./lib/donut');
var bar = require('./lib/bar');
var bubble = require('./lib/bubble');
var svg = require('./lib/svg/svg');
module.exports = {
  name: 'yakojs',
  VERSION: '0.1.0',
  spark: function (opts) {
    opts = opts || 0;
    return new sparkLine(opts);
  },
  pie: function (opts) {
    opts = opts || 0;
    return new pie(opts);
  },
  donut: function (opts) {
    opts = opts || 0;
    return new donut(opts);
  },
  bubble: function (opts) {
    opts = opts || 0;
    return new bubble(opts);
  },
  bar: function (opts) {
    opts = opts || 0;
    return new bar(opts);
  },
  svg: svg
};