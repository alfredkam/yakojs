/**
 * Time Series Tick Fitting
 * The objective of this script is to enable auto tick fitting
 */

/**
 * Usage
 * spark({
 *   mixin: [
 *     TimeSeriesTickFitting,
 *     Label
 *   ]
 * }).attr({
 *   data: {
 *     props : [{}],
 *     labels: {
 *       'point1': {
 *         'strokeColor' : '#000',
 *         'strokeWidth' : '2'
 *       }
 *     }
 *   }
 * })
 */
module.exports = {
  // Find min max in time series data
  _scale: function (content, opts) {
    content = content[0];
    opts = opts || 0;
    var chart = opts.chart || opts;
    var max = 0;
    var yAxis = chart.yAxis || 0;
    var xAxis = chart.xAxis || 0;
    var min = Number.MAX_VALUE;
    var maxSet = [];
    var temp;
    var ans;
    var self = this;
    var ySecs = 0;
    var getSplits = this._getSplits;
    var color = [];
    var data = content.data;
    var key;

    var ascByKey = function (a,b) { return parseInt(a[key]) - parseInt(b[key]); };
    var labels = Object.keys(content.labels);
    var rows = labels.length;
    var len = data.length;

    if (yAxis) {
      chart.paddingLeft = chart.paddingRight = 30;
    }

    if (xAxis) {
      chart.paddingTop = chart.paddingBottom = 20;
    }

    var pHeight = chart.height - chart.paddingTop - chart.paddingBottom;
    var pWidth = chart.width - chart.paddingLeft - chart.paddingRight;
    var heightRatio;

    if (yAxis && yAxis.multi) {
      // Across multi set
      // Each set of data needs ot have thier own individual min / max
      min = {};
      max = {};
      ySecs = {};
      heightRatio = {};
      for (var i = 0; i < rows; i++) {
        key = labels[i];
        temp = data.slice(0).sort(asc);
        min[i] = temp[0][key];
        ans = getSplits(temp[len - 1][key]);
        max[i] = ans.max;
        ySecs[i] = ans.splits;
        heightRatio[i] = pHeight / max[i];
        delete temp;
      }
    } else {
      // Find min / max across the entire data set
      for (var i = 0; i < rows; i++) {
        // `key` is a global key
        key = labels[i];
        temp = data.slice(0).sort(ascByKey);
        min = min > parseInt(temp[0][key]) ? temp[0][key] : min;
        max = max < parseInt(temp[len - 1][key]) ? temp[len - 1][key] : max;
        delete temp;
      }


      if (yAxis) {
        ans = getSplits(max);
        max = ans.max;
        ySecs = ans.splits;
      }

      heightRatio = pHeight / max;
    }

    return {
        min: min,
        max: max,
        len: len,
        rows: rows,
        ySecs: ySecs,
        labels: labels,
        pHeight: pHeight,
        pWidth: pWidth,
        heightRatio: heightRatio
    };
  },
  _startCycle: function () {
    var self = this;
    var data = self.attributes.data;
    var opts = self.attributes.opts;
    var chart = opts.chart;
    var append = self.append;
    var svg;
    var paths = [];

    if (!self._isArray(data)) {
      data = [data];
    }
    paths = self._lifeCycleManager(data, chart, function (scale) {
        svg = self.make('svg',{
            width: chart.width,
            height: chart.height,
            viewBox: '0 0 ' + chart.width + ' ' + chart.height
        });
        return self._describeSeries(data[0], scale.paddingLeft, scale.paddingTop, scale);
    });
    return append(self.element,append(svg, paths));
  },
  // Extends default getRatio in lib/base/common.js
  _getRatio: function (scale) {
    var self = this;
    scale.type = 'timeSeries';

    var max = scale._data[0].data[scale.len - 1].timestamp;
    scale.xAxis.maxUTC = max = (new Date(max)).getTime();
    var min = scale.xAxis.minUTC || 0;
    if (!min) {
      min = scale._data[0].data[0].timestamp;
      scale.xAxis.minUTC = min = (new Date(min)).getTime();
    }

    // Need to calculate a tickSize relative to time
    // Javascript MIN_VALUE is 5e-324, so should be fine
    scale.tickSize = self._sigFigs((scale.pWidth / (max - min)),8);
  },
  // Describes the path to close the open path
  _describeCloseAttributeD: function (numArr, paddingLeft, paddingTop, scale) {
    var height = scale.height;
    var heightRatio = scale.heightRatio;
    return [
            'V',(height - paddingTop),
            'H', paddingLeft,
            'L', paddingLeft,
            (height - (numArr[0] * heightRatio) - paddingTop)
          ].join(" ");
  },
  // Describes scattered graph
  _describeScatteredGraph: function(data, numArr, paddingLeft, paddingTop, scale, ref) {
    var height = scale.height;
    var heightRatio = scale.heightRatio;
    var self = this;
    var tickSize = scale.tickSize;
    var scattered = data.scattered || 0;
    var strokeWidth = scattered.strokeWidth || 3;
    var strokeColor = scattered.strokeColor || self._randomColor();
    var radius = scattered.radius || 2;
    var fill = scattered.fill || 'white';
    var paths = [];
    ref = ref || 0;

    for (var i = 0; i < numArr.length; i++) {
      paths.push(self.make('circle', {
        cx: ((tickSize * i) + paddingLeft),
        cy: (height - (numArr[i] * heightRatio) - paddingTop),
        r: radius,
        stroke: strokeColor,
        'stroke-width': strokeWidth,
        fill: 'white'
      }, {
        _ref : ref
      }));
    }
    return paths;
  },
  _describePathAndCircle: function (dataObj, labels, paddingLeft, paddingTop, scale, isScattered, isLine, isFill) {
    var height = scale.height;
    var heightRatio = scale.heightRatio;
    var tickSize = scale.tickSize;
    var minUTC = scale.xAxis.minUTC;
    var pathTokens = {};
    var rows = scale.rows;
    var items = scale.labels;
    var self = this;
    var paths = [];

    // Initialize pathtokens
    // TODO:: need to re do this snippet paths needs to start with M
    for (var x = 0; x < rows; x++) {
      pathTokens[x] = '';
    }

    // The length of the data obj
    for (var i = 0; i < dataObj.length; i++) {
        // The number of items to include
        var timestamp = (new Date(dataObj[i].timestamp)).getTime();
        var position = (timestamp - minUTC)  * tickSize;

        for (var row = 0; row < rows; row++) {
          var point = dataObj[i][items[row]] || 0;
          if (point) {
            if (i === 0) {
              // X Y
              pathTokens[row] += 'M ' + paddingLeft + ' '+ (height - (point * heightRatio) - paddingTop);
            } else {
              pathTokens[row] += ' L '+ (position + paddingLeft) + ' ' + (height - (point * heightRatio) - paddingTop);
            }
          }
        }
    }

    for (var c = 0; c < rows; c++) {
      var item = labels[items[c]];
      paths.push(self.make('path',{
          d: pathTokens[c],
          stroke: item.strokeColor || self._randomColor(),
          'stroke-width': item.strokeWidth || '3',
          'stroke-linejoin': 'round',
          'stroke-linecap': 'round',
          fill: 'none'
      },{
          _ref: c
      }));
    }
    return paths;
  },
  // Svg path builder
  _describeSeries: function (data, paddingLeft, paddingTop, scale) {
    var self = this;
    var paths = self._describePathAndCircle(data.data, data.labels, paddingLeft, paddingTop, scale, scale.scattered, scale.line, data.fill && scale.fill);
    return paths;
  }
};