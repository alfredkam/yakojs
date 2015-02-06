var sparkLine = require('./lib/sparkLine');
module.exports = {
  name: 'yakojs',
  VERSION: '1.0.0a',
  spark: function (opts) {
    return new sparkLine(opts);
  }
};