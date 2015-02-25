require('../utils/math');
var utils;
var Class = require('./class');
/**
 * deep extend object or json properties
 * @param  {object} object to extend
 * @param  {object} object
 * @return {object} global function object 
 */
module.exports = utils = Class.extend({
  // default
  init: function () {
    return this;
  },
  // mixin, extends the objs by the user 
  _mixin: function (obj) {
      var self = this;
      if (obj.mixin) {
          self._extend(self, obj.mixin);
      }
      // delete the rest so we dont copy this link to.
      // delete obj.mixin; // needed ?
      self._extend(self, obj);
  },
  // accepts a N * 1 array
  // finds total sum then creates a relative measure base on total sum
  _dataSetRelativeToTotal: function (data) {
    var total = data.reduce(function (a, b) {
      return a + b;
    });
    return data.map(function (num) {
      return num / total;
    });
  },
  // random color generator
  _randomColor: function () {
    return '#'+Math.floor(Math.random()*16777215).toString(16);
  },
  // appends the elements
  // for now lets assume there is only one child
  // TODO:: accept multiple arguments, and accept them in order
  compile: function (parent, childs) {
    if (parent === '') return childs;
    if (Object.prototype.toString.call(childs) != '[object Array]') {
      childs = [childs];
    }
    return parent.replace(/(.*)(<\/.*>$)/g, function (match, p1, p2) {
        return p1 + childs.join("") + p2;
    });
  },
  // alternate to one level deep
  make: function (tag, props, data) {
    var el = '<' + tag;

    if (tag === 'svg') {
        el += ' version="1.1" xmlns="http://www.w3.org/2000/svg"';
    }

    el += this._makePairs(props);
    el += this._makePairs('data', data);

    return el += '></'+tag+'>';
  },
  // only supports 1 level deep
  _makePairs: function (header, json) {
    if (arguments.length < 2) {
      json = header;
      header = '';
    } else {
      header += '-';
    }

    if (!json) return '';

    var keys = Object.keys(json), len = keys.length;
    var str = '';
    while (len--) {
      str += ' ' + header + keys[len] + '="' + json[keys[len]] + '"';
    }
    return str;
  },
  // deep extend
  _extend: function (attr, json) {
    var self = this;
    if (!json || !attr) return;

    var k = Object.keys(json), len = k.length;
    while(len--) {
        if (typeof json[k[len]] !== 'object' || Object.prototype.toString.call(json[k[len]]) === '[object Array]') {
            attr[k[len]] = json[k[len]];
        } else {    //it has child objects, copy them too.
            if (!attr[k[len]]) {
                attr[k[len]] = {};
            }
            self._extend(attr[k[len]], json[k[len]]);
        }
    }
    return this;
  },
  //building svg elements
  _makeNode: function (tag, props, data) {
      var node = doc.createElementNS('http://www.w3.org/2000/svg',tag);
      this.assign(node,props);
      // this._extendDataSet(node, data);
      this._extend(node.dataset, data);
      return node;
  },
  isFn: function (object) {
    return !!(object && object.constructor && object.call && object.apply);
  },
  makeToken: function () {
    return Math.random().toString(36).substr(2);
  },
    //sig fig rounding
  _sigFigs: function (n, sig) {
      var mult = Math.pow(10,
          sig - Math.floor(Math.log(n) / Math.LN10) - 1);
      return Math.round(n * mult) / mult;
  },
  // find min max between multiple rows of data sets
  _findMinMax: function (data, opts) {
      opts = opts || 0;
      data = typeof data[0] === 'object' ? data : [data];
      var max = 0;
      var min = Number.MAX_VALUE;
      var maxSet = [];

      // change up the structure
      if (data[0].data) {
        var temp = [];
        for (var x = 0; x < data.length; x++) {
          temp.push(data[x].data);
        }
        data = temp;
      }

      var rows = data.length;
      var len = data[0].length;

      // TODO:: implement a faster array search
      for (var i = 0; i < len; i++) {
          if (opts.stack) {
              var rowTotal  = 0;
              for (var j = 0; j < rows; j++) {
                  rowTotal += data[j][i];
              }
              maxSet.push(rowTotal);
              max = max < rowTotal ? rowTotal : max;
              min = min > rowTotal ? rowTotal : min;
          } else {
              for (var k = 0; k < rows; k++) {
                  min = min > data[k][i] ? data[k][i] : min;
                  max = max < data[k][i] ? data[k][i] : max;
              }
          }
      }

      return {
          min : min,
          max : max,
          maxSet: maxSet,
          len: len
      };
  }
});