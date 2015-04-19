var Base = require('./base/default');
var Errors = require('./utils/error');
var spark = module.exports = Base.extend({
  /**
   * The parent generator that manages the svg generation
   * @return {object} global function object 
   */
  _startCycle: function () {
    var self = this;
    var data = self.attributes.data;
    var opts = self.attributes.opts;
    var chart = opts.chart;
    var xAxis = chart.xAxis || opts.xAxis;
    var yAxis = chart.yAxis || opts.yAxis;
    var append = self.append;
    var svg;
    var paths = [];

    if (!self._isArray(data)) {
      data = [data];
    }

    if (xAxis) {
      chart.xAxis = xAxis;
    }

    if (yAxis) {
      chart.yAxis = yAxis;
    }

    paths = self._lifeCycleManager(data, chart, function (scale) {
        svg = self.make('svg',{
            width: chart.width,
            height: chart.height,
            viewBox: '0 0 ' + chart.width + ' ' + chart.height
        });
        for (var x = 0; x < scale.rows; x++) {
            if (yAxis && yAxis.multi) {
              scale.heightRatio = scale.pHeight / scale.max[x];
            }
            var g = self.make('g');
            // pass in a ref for event look up, here `ref` is x
            paths.push(
              append(g, self._describePath(data[x], scale.paddingLeft, scale.paddingTop, scale, x))
            );
        }
        return paths;
    });
    return append(self.element,append(svg, paths));
  },
  // Extends default getRatio in lib/base/common.js
  _getRatio: function (scale) {
    var self = this;
    var data = self.attributes.data;

    scale.innerPadding = 0;
    // find max length
    if (scale.paddingLeft != 0 && scale.paddingRight != 0) {
      scale.innerPadding = 5;
      for (var i = 0; i < scale.len; i++) {
        if (typeof data[i] == 'object' && data[i].scattered) {
          var p = data[i].scattered;
          var total = (p.strokeWidth ? p.strokeWidth : 2) + (p.radius ? p.radius : 2);
          scale.innerPadding = scale.innerPadding < total + 5 ? total + 5 : scale.innerPadding;
        }
      }
    }

    scale.pHeight = scale.height - scale.paddingTop - scale.paddingBottom;
    scale.pWidth = scale.width - scale.paddingLeft - scale.paddingRight - scale.innerPadding;
    scale.heightRatio = scale.pHeight / scale.max;
    scale.tickSize = self._sigFigs((scale.pWidth / (scale.len - 1)),8);
  },
  // Describes an open path
  _describeAttributeD: function (numArr, paddingLeft, paddingTop, scale) {
    var height = scale.height;
    var heightRatio = scale.heightRatio;
    var tickSize = scale.tickSize;
    var pathToken = '';

    // Path generator
    for (var i = 0; i < numArr.length; i++) {
        if (i === 0) {
          // X Y
            pathToken += 'M ' + (paddingLeft + scale.innerPadding) + ' '+ (height - (numArr[i] * heightRatio) - paddingTop);
        } else {
            pathToken += ' L '+ ((tickSize * i) + paddingLeft) + ' ' + (height - (numArr[i] * heightRatio) - paddingTop);
        }
    }
    // Eliminates the error calls when attributiting this to the svg path
    if (pathToken === '') {
      pathToken = 'M 0 0';
    }
    return pathToken;
  },
  // Describes the path to close the open path
  _describeCloseAttributeD: function (numArr, paddingLeft, paddingTop, scale) {
    var height = scale.height;
    var heightRatio = scale.heightRatio;
    return [
            'V',(height - paddingTop),
            'H', paddingLeft,
            'L', paddingLeft + scale.innerPadding,
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
    var strokeWidth = scattered.strokeWidth || 2;
    var strokeColor = scattered.strokeColor || self._randomColor();
    var radius = scattered.radius || 2;
    var fill = scattered.fill || 'white';
    var paths = [];
    ref = ref || 0;

    for (var i = 0; i < numArr.length; i++) {
      paths.push(self.make('circle', {
        cx: i == 0 ? (i + scale.innerPadding + paddingLeft) : ((tickSize * i) + paddingLeft),
        cy: (height - (numArr[i] * heightRatio) - paddingTop),
        r: radius,
        stroke: strokeColor,
        'stroke-width': strokeWidth,
        fill: fill
      }, {
        _ref : ref
      }));
    }
    return paths;
  },
  // Svg path builder
  _describePath : function (data, paddingLeft, paddingTop, scale, ref) {
    ref = ref || 0;
    var self = this;
    var pathToken = self._describeAttributeD(data.data, paddingLeft, paddingTop, scale);
    var pathNode = self.make('path',{
        d: pathToken,
        stroke: data.strokeColor || self._randomColor(),
        'stroke-width': data.strokeWidth || '3',
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        fill: 'none'
    },{
        _ref: ref
    });
    var paths = [];

    if (data.fill && scale.fill) {
      paths.push(self.make('path', {
        d: pathToken + self._describeCloseAttributeD(data.data, paddingLeft, paddingTop, scale),
        stroke: 'none',
        'stroke-width': '2',
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        fill: data.fill,
      },{
        _ref: ref
      }));
    }
    if (scale.line) {
      paths.push(pathNode);
    }
    if (scale.scattered) {
      paths.push(self._describeScatteredGraph(data, data.data, paddingLeft, paddingTop, scale, ref));
    }
    return paths;
  }
});
