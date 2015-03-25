require('../utils/math');
var Class = require('./class');
var Error = require('../utils/error');

var isArray = function (obj) {
    return obj instanceof Array;
};
/**
 * deep extend object or json properties
 * @param  {object} object to extend
 * @param  {object} object
 * @return {object} global function object 
 */
module.exports = Class.extend({
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

    if (!isArray(childs)) {
      childs = [childs];
    }
    return parent.replace(/(.*)(<\/.*>$)/g, function (match, p1, p2) {
        return p1 + childs.join("") + p2;
    });
  },
  // alternate to one level deep
  make: function (tagName, attribute, dataAttribute, content) {
    var el = '<' + tagName;

    if (tagName === 'svg') {
        el += ' version="1.1" xmlns="http://www.w3.org/2000/svg"';
    }
    el += this._makePairs(attribute);
    el += this._makePairs('data', dataAttribute);
    return el += '>' + (content || content === 0 ? content : '') + '</'+tagName+'>';
  },
  // Deep copies an object
  // TODO:: improve this
  _deepCopy: function (objToCopy) {
    return JSON.parse(JSON.stringify(objToCopy));
  },
  // Call right before return the svg content to the user
  postRender: function (svgContent) {
    // super class
    return svgContent;
  },
  /**
   * [_isArray check if variable is an array]
   * @param  any type
   * @return {Boolean}   true if its an array
   */
  _isArray: isArray,
  // Default ratio
  _getRatio: function (scale) {
    scale.heightRatio = scale.height - (scale.paddingTop + scale.paddingBottom) / scale.max;
  },
  /**
   * [_defineBaseScaleProperties defines the common scale properties]
   * @param  {[obj]} data  [raw data set from user]
   * @param  {[obj]} chart [chart properties passed by the user]
   * @return {[obj]}       [return an obj that describes the scale base on the data & chart properties]
   */
  _defineBaseScaleProperties: function (data, chart) {
    var self = this;
    var opts = this.attributes.opts;
    var chart = opts.chart;
    var xAxis = chart.xAxis || opts.xAxis;
    var yAxis = chart.yAxis || opts.yAxis;
    var scale = self._scale(data, chart);
    self._extend(scale, chart);
    scale._data = data;

    if ((chart.type != 'bubble-point') && (yAxis || xAxis)) {
      self._getExternalProps(scale, yAxis, xAxis);
      if (!self.describeYAxis) {
        Error.label();
      }
    }
    self._getRatio(scale);
    return scale;
  },
  /**
   * base on the feedback and mange the render of the life cycle 
   * it passes a immutable obj to preRender and audits the user feedback
   */
  // TODO:: Rename lifeCycleManager, incorrect term usage
  _lifeCycleManager: function (data, chart, describe) {
    var self = this;
    var scale = self._defineBaseScaleProperties(data, chart);
    // check if there is any external steps needed to be done
    if (self._call) {
      self._call(scale);
    }
    // make the obj's shallow properties immutable
    // we can know if we want to skip the entire process to speed up the computation
    var properties = (self.preRender ? self.preRender(Object.freeze(self._deepCopy(scale))) : 0);
    
    // properties we will except
    // - append
    // - prepend
    var paths = properties.prepend ? properties.prepend : [];
    paths = paths.concat(describe(scale));
    paths = paths.concat(properties.append ? properties.append : []);
    return paths;
    // return summary
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
        if (typeof json[k[len]] !== 'object' || isArray(json[k[len]])) {
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
  isFn: function (object) {
    return !!(object && object.constructor && object.call && object.apply);
  },
  _makeToken: function () {
    return Math.random().toString(36).substr(2);
  },
  //sig fig rounding
  _sigFigs: function (n, sig) {
      var mult = Math.pow(10,
          sig - Math.floor(Math.log(n) / Math.LN10) - 1);
      return Math.round(n * mult) / mult;
  },
  // calculates the number of yAxis sections base on the maxium value
  _getSplits: function (value) {
      var set = {};
      value = Math.ceil(value, 0); // make sure its a whole number
      if (value === 0) return { max : 2, splits: 2};

      var supportedBorders = [3,2,5];
      var digitLen = value.toString().length;
      var ceil = splits = 0;

      // now search for the best for number of borders
      var checkIfSatisfy = function (v) {
        for (var i = 0; i < 3; i++) {
          if (v % supportedBorders[i] === 0)
            return supportedBorders[i];
        }
        return 0;
      };

      var auditSplits = function (v) {
        var leftInt = parseInt(v.toString()[0]);
        if (leftInt == 1) return 2;
        return checkIfSatisfy(leftInt);
      };

      if (digitLen > 2) {
        ceil = Math.ceil10(value, digitLen - 1);
        splits = auditSplits(ceil);
        if (!splits) {
          ceil += Math.pow(10, digitLen - 1);
          splits = auditSplits(ceil);
        }
      } else if (digitLen == 2) {
        // double digit
        ceil = value.toString();
        if (ceil[1] <= 5 && (ceil[0] == 1 || ceil[0] == 2 || ceil[0] == 5 || ceil[0] == 7) && ceil[1] != 0) {
          ceil = parseInt(ceil[0] + "5");
        } else {
          ceil = Math.ceil10(value, 1);
          ceil = ceil == 70 ? 75 : ceil;
        }
        splits = checkIfSatisfy(ceil);
      } else {
        // single digit
        ceil = value;
        splits = checkIfSatisfy(ceil);
        if (ceil == 5 || ceil == 3 || ceil == 2) {
          splits = 1;
        }
        if (!splits) {
          ceil += 1;
          splits = auditSplits(ceil);
        }
      }

      return {
        max: ceil,
        splits: splits
      };
  },
  // find min max between multiple rows of data sets
  // also handles the scale needed to work with multi axis
  _scale: function (data, opts) {
      opts = opts || 0;
      data = typeof data[0] === 'object' ? data : [data];
      var max = 0;
      var yAxis = opts.yAxis || (opts.chart ? opts.chart.yAxis : 0);
      var min = Number.MAX_VALUE;
      var maxSet = [];
      var temp;
      var ans;
      var self = this;
      var ySecs = 0;
      var getSplits = this._getSplits;
      var color = [];

      // change up the structure if the data set is an object
      if (data[0].data) {
        temp = [];
        for (var x = 0; x < data.length; x++) {
          temp.push(data[x].data);
          color.push(data[x].strokeColor);
        }
        data = temp;
      }

      var asc = function (a,b) { return a - b; };
      var rows = data.length;
      var len = data[0].length;

      if (yAxis && yAxis.multi) {
        // across multi set
        // each set of data needs ot have thier own individual min / max
        min = {};
        max = {};
        ySecs = {};
        for (var i = 0; i < rows; i++) {
          temp = data[i].slice(0).sort(asc);
          min[i] = temp[0];
          ans = getSplits(temp[len - 1]);
          max[i] = ans.max;
          ySecs[i] = ans.splits;
          delete temp;
        }
      } else if (opts.stack) {
        // data reduced base by column to find a new combined min / max
        for (var i = 0; i < len; i++) {
          var rowTotal = 0;
          for (var j = 0; j < rows; j++) {
              rowTotal += data[j][i];
          }
          maxSet.push(rowTotal);
          max = max < rowTotal ? rowTotal : max;
          min = min > rowTotal ? rowTotal : min;
        }
        
        if (yAxis) {
          ans = getSplits(max);
          max = ans.max;
          ySecs = ans.splits;
        }
      } else if (opts.type == 'bubble-scattered') {
        // for bubble and need to find min / max across the x, y , z axis
        min = {};
        max = {};
        for (var x = 0; x < 3; x++) {
          min[x] = Number.MAX_VALUE;
          max[x] = 0;
        }

        for (var i = 0; i < len; i++) {
          for (var j = 0; j < rows; j++) {
            for (var c = 0; c < 3; c++) {
              max[c] = max[c] < data[j][i][c] ? data[j][i][c] : max[c];
              min[c] = min[c] > data[j][i][c] ? data[j][i][c] : min[c];
            }
          }
        }
        if (yAxis) {
          ans = getSplits(max[1]);
          max[1] = ans.max;
          ySecs = ans.splits;
        }

      } else {
        // find min / max across the entire data set
        for (var i = 0; i < rows; i++) {
          temp = data[i].slice(0).sort(asc);
          min = min > temp[0] ? temp[0] : min;
          max = max < temp[len - 1] ? temp[len - 1] : max;
          delete temp;
        }

        if (yAxis) {
          ans = getSplits(max);
          max = ans.max;
          ySecs = ans.splits;
        }
      }
      
      return {
          min: min,
          max: max,
          maxSet: maxSet,
          len: len,
          rows: rows,
          ySecs: ySecs,
          color: color
      };
  }
});