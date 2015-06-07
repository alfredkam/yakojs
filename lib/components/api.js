var asc = function asc(a, b) {
  return a - b;
};

var api = module.exports = {

  sigFigs: function sigFigs(n, sig) {
    var mult = Math.pow(10, sig - Math.floor(Math.log(n) / Math.LN10) - 1);
    return Math.round(n * mult) / mult;
  },

  // Returns sum of data set
  sumOfData: function sumOfData(data) {
    return data.reduce(function (a, b) {
      return a + b;
    });
  },

  // accepts a N * 1 array
  // finds total sum then creates a relative measure base on total sum
  dataSetRelativeToTotal: function dataSetRelativeToTotal(data, total) {
    return data.map(function (num) {
      return num / total;
    });
  },

  // calculates the number of yAxis sections base on the maxium value
  getSplits: function getSplits(value) {
    var set = {};
    value = Math.ceil(value, 0); // make sure its a whole number
    if (value === 0) return { max: 2, splits: 2 };

    var supportedBorders = [3, 2, 5];
    var digitLen = value.toString().length;
    var ceil = splits = 0;

    // now search for the best for number of borders
    var checkIfSatisfy = function checkIfSatisfy(v) {
      for (var i = 0; i < 3; i++) {
        if (v % supportedBorders[i] === 0) return supportedBorders[i];
      }
      return 0;
    };

    var auditSplits = function auditSplits(v) {
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
        ceil = parseInt(ceil[0] + '5');
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

  getScaleForMulti: function getScaleForMulti(data, rows, len) {
    // across multi set
    // each set of data needs ot have thier own individual min / max
    var ySecs = {};
    var min = [];
    var max = [];

    for (var i = 0; i < rows; i++) {
      temp = data[i].slice(0).sort(asc);
      min[i] = temp[0];
      ans = api.getSplits(temp[len - 1]);
      max[i] = ans.max;
      ySecs[i] = ans.splits;
      // delete temp;
    }

    return {
      min: min,
      max: max,
      ySecs: ySecs
    };
  },

  // data reduced base by column to find a new combined min / max
  getStackedScale: function getStackedScale(data, rows, len, yAxis, min, max) {
    var maxSet = [];
    var ySecs = 0;

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
      ans = api.getSplits(max);
      max = ans.max;
      ySecs = ans.splits;
    }

    return {
      min: min,
      max: max,
      ySecs: ySecs,
      maxSet: maxSet
    };
  },

  // for bubble and need to find min / max across the x, y , z axis
  getBubbleScatterScale: function getBubbleScatterScale(data, rows, len, yAxis) {
    var ySecs = 0;
    var min = [];
    var max = [];

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
      ans = api.getSplits(max[1]);
      max[1] = ans.max;
      ySecs = ans.splits;
    }

    return {
      min: min,
      max: max,
      ySecs: ySecs
    };
  },

  // find min / max across the entire data set
  getSimpleScale: function getSimpleScale(data, rows, len, yAxis, min, max) {
    var ySecs = 0;
    for (var i = 0; i < rows; i++) {
      temp = data[i].slice(0).sort(asc);
      min = min > temp[0] ? temp[0] : min;
      max = max < temp[len - 1] ? temp[len - 1] : max;
      // delete temp;
    }

    if (yAxis) {
      ans = api.getSplits(max);
      max = ans.max;
      ySecs = ans.splits;
    }

    return {
      min: min,
      max: max,
      ySecs: ySecs
    };
  },

  // find min max between multiple rows of data sets
  // also handles the scale needed to work with multi axis
  scale: function scale(data, opts) {
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
    var getSplits = api.getSplits;
    var color = [];

    // change up the structure if the data set is an object
    if (data[0].data || data[0].data == 0) {
      temp = [];
      for (var x = 0; x < data.length; x++) {
        temp.push(data[x].data);
        color.push(data[x].strokeColor);
      }

      if (this.componentName == 'bubble.point' || this.componentName == 'bubble.scatter') {
        data = [temp];
      } else {
        data = temp;
      }
    }

    var rows = data.length;
    var len = data[0].length;

    if (yAxis && yAxis.multi) {

      var result = api.getScaleForMulti(data, rows, len);
      min = result.min;
      max = result.max;
      ySecs = result.ySecs;
    } else if (opts.stack) {

      var result = api.getStackedScale(data, rows, len, yAxis, min, max);
      min = result.min;
      max = result.max;
      ySecs = result.ySecs;
      maxSet = result.maxSet;
    } else if (self.componentName == 'bubble.scatter') {
      var result = api.getBubbleScatterScale(data, rows, len, yAxis);
      min = result.min;
      max = result.max;
      ySecs = result.ySecs;
    } else {
      var result = api.getSimpleScale(data, rows, len, yAxis, min, max);
      min = result.min;
      max = result.max;
      ySecs = result.ySecs;
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
};