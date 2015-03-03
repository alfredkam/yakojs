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
  // accepts multiple child
  append: function (parent, childs) {
    if (parent === '') return childs;
    if (Object.prototype.toString.call(childs) != '[object Array]') {
      childs = [childs];
    }
    return parent.replace(/(.*)(<\/.*>$)/g, function (match, p1, p2) {
        return p1 + childs.join("") + p2;
    });
  },
  // alternate to one level deep
  make: function (tagName, attribute, dataAttribute) {
    var el = '<' + tagName;

    if (tagName === 'svg') {
        el += ' version="1.1" xmlns="http://www.w3.org/2000/svg"';
    }

    el += this._makePairs(attribute);
    el += this._makePairs('data', dataAttribute);

    return el += '></'+tagName+'>';
  },
  render: function (result) {
    return result;
  },
  // only supports 1 level deep
  _makePairs: function (prefix, json) {
    if (arguments.length < 2) {
      json = prefix;
      prefix = '';
    } else {
      prefix += '-';
    }

    if (!json) return '';

    var keys = Object.keys(json), len = keys.length;
    var str = '';
    while (len--) {
      str += ' ' + prefix + keys[len] + '="' + json[keys[len]] + '"';
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
  _getSplits: function (max) {
      var set = {};
      //find label and #borders best fit
      if (!isNaN(max) && !max == 0) {
          var ceil = Math.ceil10(max, max.toString().length - 1);
          if (max.toString().length > 1 && ceil !== 10) {
              var leftInt = parseInt(ceil.toString().substr(0,2));
              set.l = leftInt.toString()[0];
              
              if (set.l > 4) {
                  if (set.l === 9) {
                      set.l = 10;
                      set.f = 5;
                  //even
                  } else if (set.l % 2 == 0) {
                      set.f = set.l/2;
                  //odd
                  } else {
                      set.f = set.l;
                  }
                  max = parseInt(set.l + Math.ceil10(max,max.toString().length - 1).toString().substr(1,Math.ceil10(max,max.toString().length - 1).toString().length - 1))
              } else {
                  var secondaryCeil = Math.ceil(max, max.toString().length-2),
                  secondaryLeftInt = parseInt(secondaryCeil.toString().substr(0,2));
                  if (secondaryLeftInt.toString()[1] > 4) {
                      set.l = leftInt;
                  } else {
                      set.l = leftInt - 5;
                  }
                  set.f = set.l / 5;
                  max = parseInt(set.l + Math.ceil10(max,max.toString().length - 1).toString().substr(1,Math.ceil10(max,max.toString().length - 1).toString().length - 2))
              }
          //single digit
          } else {
              if (ceil % 2 == 0) {
                  max = ceil;
                  set.f = ceil / 2;
              } else if (ceil === 9) {
                  max = 10;
                  set.f = 5;
              //odd
              } else {
                  max = ceil;
                  set.f = ceil;
              }
          }
      }
      return {
          max: (isNaN(max) ^ max == 0? 2 : max),
          splits: (isNaN(max) ^ max == 0? 2 : set.f), //the number of line splits
      }
  },
  // find min max between multiple rows of data sets
  // also handles the scale needed to work with multi axis
  _scale: function (data, opts) {
      opts = opts || 0;
      data = typeof data[0] === 'object' ? data : [data];
      var max = 0;
      var yAxis = [];
      var min = Number.MAX_VALUE;
      var maxSet = [];
      var temp;

      // change up the structure if the data set is an object
      if (data[0].data) {
        temp = [];
        for (var x = 0; x < data.length; x++) {
          temp.push(data[x].data);
        }
        data = temp;
      }

      var asc = function (a,b) { return a - b; }
      var rows = data.length;
      var len = data[0].length;

      if (opts.yAxis && opts.yAxis.multi) {
        // across multi set
        min = {};
        max = {};
        for (var i = 0; i < rows; i++) {
          temp = data[i].slice(0).sort(asc);
          min[i] = temp[0];
          max[i] = Math.ceil10(temp[len - 1],temp[len - 1].toString().length - 1);
          delete temp;
        }
      } else if (opts.stack) {
        for (var i = 0; i < len; i++) {
          var rowTotal = 0;
          for (var j = 0; j < rows; j++) {
              rowTotal += data[j][i];
          }
          maxSet.push(rowTotal);
          max = max < rowTotal ? rowTotal : max;
          min = min > rowTotal ? rowTotal : min;
        }
      } else {
        // find max in a set
        for (var i = 0; i < rows; i++) {
          temp = data[i].slice(0).sort(asc);
          min = min > temp[0] ? temp[0] : min;
          max = max < temp[len - 1] ? temp[len - 1] : max;
          delete temp;
        }

        if (opts.yAxis) {
          max = Math.ceil10(max, max.toString().length - 1);
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