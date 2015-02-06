var utils;
var Class = require('./class');
/**
 * deep extend object or json properties
 * @param  {object} object to extend
 * @param  {object} object
 * @return {object} global function object 
 */
module.exports = utils = Class.extend({
  // alternate to one level deep
  _make: function (tag, props, data) {
    var el = '<' + tag;
    if (tag === 'svg') {
      el += ' version="1.1" xlms="http://www.w3.org/2000/svg"';
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
  // //building svg elements
  // _make: function (tag, props, data) {
  //     var node = doc.createElementNS('http://www.w3.org/2000/svg',tag);
  //     this.assign(node,props);
  //     // this._extendDataSet(node, data);
  //     this._extend(node.dataset, data);
  //     return node;
  // },
  //appends the elements
  _compile : function (node, childs, reRender) {
      if (childs === null ^ childs === undefined) return this;
      if (typeof childs === Object) childs = [childs];
      if (Object.prototype.toString.call(childs)==='[object Array]') {
          if (node.tagName) {
              if(reRender)
                  node.innerHTML = '';
              for (var i in childs)
                  node.appendChild(childs[i]);
          } else {
              Array.prototype.filter.call(node, function (element) {
                  if (element.nodeName) {
                      if(reRender)
                          element.innerHTML = '';
                      for (var i in childs)
                          element.appendChild(childs[i]);
                  }
              });
          }
      } else {
          if (node.tagName) {
              if(reRender)
                  node.innerHTML = '';
              node.appendChild(childs);
          } else {
              Array.prototype.filter.call(node, function (element) {
                  if (element.nodeName) {
                      if(reRender)
                          element.innerHTML = '';
                      element.appendChild(childs[i]);
                  }
              });
          }
      }
      return this;
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
  //finding min & max between multiple set (TODO:: any improvments to multiple array search?)
  _findMinMax: function (data, multi) {
    var min, max, length;

    function compareNumbers(a, b) {
      return a - b;
    }

    if (Object.prototype.toString.call(data)!=='[object Array]') {
        data = [data];
    }

    //different initialization
    if (multi) {
        max = min = [];
        for (var i in data) {
            max[i] = min[i] = data[i][0];
        }
    } else {
        max = min = data[0][0];
    }

    length = data[0].length;
    for (var i in data) {
        var _data = (data[i].slice()).sort(compareNumbers);
        length = (length < _data.length ? _data.length : length);
        //if multi we want the min / max to be independent
        if (multi) {
            min[i] = _data[0];
            max[i] = _data[_data.length-1];
        } else {
        //its not multi, we find the entire picture's min max
            min = (min > _data[0] ? _data[0]: min);
            max = (max < _data[_data.length-1] ? _data[_data.length-1] : max);
        }
    }

    var findBestFit = function (min, max) {
        var set = {};
        var max_ = max;
        //find label and #borders best fit
        if (!isNaN(max) && max !== 0) {
            var ceil = Math.ceil10(max, max.toString().length - 1);
            if (max.toString().length > 1 && ceil !== 10) {
                var leftInt = parseInt(ceil.toString().substr(0,2));
                set.l = leftInt.toString()[0];
                
                if (set.l > 4) {
                    if (set.l === 9) {
                        set.l = 10;
                        set.f = 5;
                    //even
                    } else if (set.l % 2 === 0) {
                        set.f = set.l/2;
                    //odd
                    } else {
                        set.f = set.l;
                    }
                    max = parseInt(set.l + Math.ceil10(max,max.toString().length - 1).toString().substr(1,Math.ceil10(max,max.toString().length - 1).toString().length - 1));
                } else {
                    var secondaryCeil = Math.ceil(max, max.toString().length-2),
                    secondaryLeftInt = parseInt(secondaryCeil.toString().substr(0,2));
                    if (secondaryLeftInt.toString()[1] > 4 || secondaryLeftInt.toString()[1] === 0) {
                        set.l = leftInt;
                    } else {
                        set.l = leftInt - 5;
                    }
                    set.f = set.l / 5;
                    max = parseInt(set.l + Math.ceil10(max,max.toString().length - 1).toString().substr(1,Math.ceil10(max,max.toString().length - 1).toString().length - 2));
                }
            //single digit
            } else {
                if (ceil % 2 === 0) {
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
            max: (isNaN(max) ^ max === 0? 2 : max),
            splits: (isNaN(max) ^ max === 0? 2 : set.f), //the number of line splits
            len: length,
            min: min
        };
    };

    if (multi) {
        var result = [];
        for (var i in max) {
            result.push(findBestFit(min[i], max[i]));
        }
        return result;
    } else {
        return findBestFit(min, max);
    }
  }
});