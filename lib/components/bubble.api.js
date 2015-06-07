function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// TODO:: Consolidate code

var _svgComposer = require('../svg/composer');

var _svgComposer2 = _interopRequireDefault(_svgComposer);

var _utilsRandomColor = require('../utils/randomColor');

var _utilsRandomColor2 = _interopRequireDefault(_utilsRandomColor);

module.exports = {

  // TODO::  Should refer to a function in path to build this
  // Describes the xAxis for bubble point graph
  describeXAxisForBubbleLine: function describeXAxisForBubbleLine(height, width, chart) {
    // Note:: chart.xAxis is the old format
    var config = chart.axis || chart.xAxis;
    var centerY = height / 2;

    // Self Note:: PaddingLeft / PaddingRight adjustments are taken out
    return _svgComposer2['default'].make('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': config.strokeWidth || 2,
      stroke: config.strokeColor || 'transparent',
      d: 'M' + chart.paddingLeft + ' ' + centerY + ' H' + width
    });
  },

  describeBubbleByObject: function describeBubbleByObject(data, scale) {
    var height = scale.height;
    var width = scale.width;
    var heightRatio = scale.heightRatio;
    var widthRatio = scale.widthRatio;
    var len = scale.len;
    var max = scale.max;
    var innerPaddingLeft = scale.innerPaddingLeft;
    var paddingLeft = scale.paddingLeft;
    var innerPaddingTop = scale.innerPaddingTop;
    var paddingTop = scale.paddingTop;

    var self = this;
    var defaultFill = scale.fill || 0;
    var defaultStrokeColor = scale.strokeColor || 0;
    var defaultStrokeWidth = scale.strokeWidth || 0;
    var paths = [];
    var refs;
    var minRadius = scale.minRadius || 0;
    var inverse = scale.hasInverse;

    for (var i = 0; i < len; i++) {
      var props = data[i];
      var point = props.data;

      if (scale.hasEvents) {
        // c = column for reference
        refs = {
          c: i
        };
      }

      var r = (scale.maxRadius - minRadius) * (point[2] / max[2]);
      r = r ? r + minRadius : 0;
      paths.push(_svgComposer2['default'].make('circle', {
        cx: inverse.x ? point[0] * widthRatio + innerPaddingLeft + paddingLeft : width - point[0] * widthRatio - innerPaddingLeft - paddingLeft,
        cy: inverse.y ? paddingTop + innerPaddingTop + point[1] * heightRatio : height - point[1] * heightRatio - innerPaddingTop - paddingTop,
        r: r,
        fill: props.fill || (defaultFill || _utilsRandomColor2['default']())
      }, refs));
    }
    return paths;
  },

  describeBubbleLineByObject: function describeBubbleLineByObject(data, height, width, scale) {
    if (!data) return '';
    var paddingLeft = scale.paddingLeft;
    var innerPaddingLeft = scale.innerPaddingLeft;
    var autoFit = scale.autoFit;
    var strokeColors = scale.strokeColors;
    var strokeWidths = scale.strokeWidths;
    var fill = scale.fill;
    var tickSize = scale.tickSize;
    var startTick = scale.startTick;
    var minRadius = scale.minRadius;
    var maxRadius = scale.maxRadius;

    var dataPoints = data.length;
    var paths = [];
    var defaultStrokeColor = strokeColors || 0;
    var defaultStrokeWidth = strokeWidths || 0;
    var defaultFill = scale.fill || 0;
    var centerY = height / 2;
    var refs, cx;
    var minRadius = minRadius || 0;

    for (var i = 0; i < data.length; i++) {
      var point = data[i];

      if (scale.hasEvents) {
        // c = columns
        refs = {
          c: i
        };
      }

      if (autoFit == false) {
        cx = i * tickSize + paddingLeft + innerPaddingLeft;
      } else {
        cx = (point.date.getTime() - startTick) * tickSize + paddingLeft + innerPaddingLeft;
      }

      var r = (maxRadius - minRadius) * point.data / scale.max;
      r = r ? r + minRadius : 0;

      paths.push(_svgComposer2['default'].make('circle', {
        cx: cx,
        cy: centerY,
        r: r,
        fill: point.fill || defaultFill,
        stroke: point.strokeColor || (defaultStrokeColor || 'transparent'),
        'stroke-width': point.strokeWidth || (defaultStrokeWidth || 0)
      }, refs));
    }
    return paths;
  },

  // Extends default ratio w/ auto scaling for Bubble Scatter
  getRatioByObject: function getRatioByObject(scale) {
    var _data = scale._data;
    var height = scale.height;
    var width = scale.width;
    var len = scale.len;
    var innerPaddingLeft = scale.innerPaddingLeft;
    var innerPaddingTop = scale.innerPaddingTop;
    var innerPaddingRight = scale.innerPaddingRight;
    var innerPaddingBottom = scale.innerPaddingBottom;
    var minRadius = scale.minRadius;

    var data = _data;
    // bubble as a scattered graph

    var maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || Math.sqrt(width * height / len) / 2;
    scale.minRadius = minRadius || 0;
    scale.innerPaddingLeft = innerPaddingLeft < maxRadius ? maxRadius : innerPaddingLeft;
    scale.innerPaddingRight = innerPaddingRight < maxRadius ? maxRadius : innerPaddingRight;
    scale.innerPaddingTop = innerPaddingTop < maxRadius ? maxRadius : innerPaddingTop;
    scale.innerPaddingBottom = innerPaddingBottom < maxRadius ? maxRadius : innerPaddingBottom;
    scale.widthRatio = (width - scale.innerPaddingLeft - scale.innerPaddingRight) / scale.max[0];
    scale.heightRatio = (height - scale.innerPaddingTop - scale.innerPaddingBottom) / scale.max[1];
  },

  // Extends default ratio w/ auto scaling for Bubble point
  getRatioByTimeSeries: function getRatioByTimeSeries(scale) {
    var autoFit = scale.autoFit;
    var _data = scale._data;
    var height = scale.height;
    var width = scale.width;
    var len = scale.len;
    var paddingTop = scale.paddingTop;
    var paddingLeft = scale.paddingLeft;
    var paddingRight = scale.paddingRight;
    var paddingBottom = scale.paddingBottom;
    var axis = scale.axis;

    var data = _data;
    scale.axis = axis || {};
    var maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || maxRadius;
    var minRadius = scale.minRadius = scale.minRadius || 0;
    var startTick, endTick;

    // Check if the start date is defined, if not defined using first element in array
    if (autoFit == false) {
      startTick = 0;
      endTick = len - 1;
    } else {
      startTick = (scale.startDate || data[0].date || 0).getTime();
      endTick = (scale.endDate || data[len - 1].date).getTime();
    }

    scale.startTick = startTick;
    scale.endTick = endTick;
    var tickLen = endTick - startTick;
    tickLen = tickLen == 0 ? 1000 : tickLen;

    var potentialPxTickRatio = width / tickLen;

    var firstElementRadius = (maxRadius - minRadius) * data[0].data / scale.max;
    var lastElementRadius = (maxRadius - minRadius) * data[len - 1].data / scale.max;

    firstElementRadius = firstElementRadius ? firstElementRadius + minRadius : 0;
    lastElementRadius = lastElementRadius ? lastElementRadius + minRadius : 0;

    var startTickLeftRadius = (startTick - startTick) * potentialPxTickRatio - firstElementRadius;
    var endTickRightRadius = (endTick - endTick) * potentialPxTickRatio + lastElementRadius;
    scale.paddingLeft = startTickLeftRadius < 0 ? Math.abs(startTickLeftRadius) : 0;
    scale.paddingRight = endTickRightRadius > 0 ? endTickRightRadius : 0;
    scale.tickSize = (width - scale.paddingLeft - scale.paddingRight) / tickLen;
  }
};