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
    return new sparkLine(opts);
  },
  pie: function (opts) {
    return new pie(opts);
  },
  donut: function (opts) {
    return new donut(opts);
  },
  bubble: function (opts) {
    return new bubble(opts);
  },
  bar: function (opts) {
    return new bar(opts);
  },
  svg: svg
};