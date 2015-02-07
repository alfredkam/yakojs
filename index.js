var sparkLine = require('./lib/sparkLine');
var pie = require('./lib/pie');
var donut = require('./lib/donut');
module.exports = {
  name: 'yakojs',
  VERSION: '1.0.0a',
  spark: function (opts) {
    return new sparkLine(opts);
  },
  pie: function (opts) {
    return new pie(opts);
  },
  donut: function (opts) {
    return new donut(opts);
  }
};