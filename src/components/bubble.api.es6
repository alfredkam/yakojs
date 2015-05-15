// TODO:: Consolidate code
import composer from '../svg/composer';
import randomColor from '../utils/randomColor';

module.exports = {

  getConfigForScatterTimeSeries (chart) {
    chart.type = 'bubble-scattered';
    chart.complex = true;
    chart.parentType = 'bubble';
    return chart;
  },

  getConfigForLine (chart) {
    chart.type = 'bubble-point';
    chart.complex = true;
    chart.parentType = 'bubble';
    return chart;
  },

  // TODO::  Should refer to a function in path to build this
  // Describes the xAxis for bubble point graph
  describeXAxisForBubbleLine (height, width, chart) {
    // Note:: chart.xAxis is the old format
    var config = chart.axis || chart.xAxis;
    var centerY = height / 2;
    // Self Note:: PaddingLeft / PaddingRight adjustments are taken out
    return composer.make('path', {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        'stroke-width': config.strokeWidth || 2,
        stroke: config.strokeColor || 'transparent',
        d: 'M' + chart.paddingLeft + ' ' + centerY + ' H' + width
    });
  },

  describeBubbleByObject (data, scale) {
    var { height, width, heightRatio, widthRatio, len, max, innerPaddingLeft, paddingLeft, innerPaddingTop, paddingTop } = scale;
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
        var r = (scale.maxRadius - minRadius) * (point[2]/max[2]);
        r = r ? r + minRadius : 0;
        paths.push(composer.make('circle', {
            cx: (inverse.x ? (point[0] * widthRatio) + innerPaddingLeft + paddingLeft : width - (point[0] * widthRatio) - innerPaddingLeft - paddingLeft),
            cy: (inverse.y ? paddingTop + innerPaddingTop + (point[1] * heightRatio) : height - (point[1] * heightRatio) - innerPaddingTop - paddingTop),
            r: r,
            fill: props.fill || (defaultFill || randomColor())
        }, refs));
    }
    return paths;
  },

  describeBubbleByNumberArray (data, scale) {
    var { height, width, heightRatio, widthRatio, len, max } = scale;
    var self = this;
    var fills = scale.fills || 0;
    var paths = [];
    var refs;
    var minRadius = scale.minRadius || 0;

    for (var r = 0; r < scale.rows; r++) {
        for (var i = 0; i < len; i++) {
            var point = data[r].data[i];
            if (scale.hasEvents) {
                // r = row, c = column for reference
                refs = {
                    r: r,
                    c: i
                };
            }
            var radius = (scale.maxRadius - minRadius) * (point[2]/max[2]);
            radius = radius ? radius + minRadius : 0;
            paths.push(composer.make('circle', {
                cx: width - (point[0] * widthRatio) - scale.paddingLeft,
                cy: height - (point[1] * heightRatio) - scale.paddingTop,
                r: scale.maxRadius * (point[2]/max[2]),
                fill: data[r].fill || (fills[i] || randomColor())
            }, refs));
        }
    }
    return paths;
  },

  describeBubbleLineByObject: function (data, height, width, scale) {
    if (!data) return '';
    var { autoFit, strokeColors, strokeWidths, fill, tickSize, startTick, minRadius, maxRadius } = scale;
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
          cx = (i * tickSize) + scale.paddingLeft;
        } else {
          cx = ((point.date.getTime() - startTick) * tickSize) + scale.paddingLeft;
        }

        var r = ( maxRadius - minRadius ) * point.data / scale.max;
        r = r ? r + minRadius : 0;

        paths.push(composer.make('circle', {
            cx: cx,
            cy: centerY,
            r: r,
            fill: point.fill || defaultFill,
            stroke: point.strokeColor || (defaultStrokeColor || 'transparent'),
            'stroke-width' : point.strokeWidth || (defaultStrokeWidth || 0)
        }, refs));
    }
    return paths;
  },

  describeLineByNumberArray: function (data, height, width, scale) {
    if (!data) return '';
    var config = scale.bubble;
    var dataPoints = data.length;
    var paths = [];
    var fills = config.fills || 0;
    var { strokeColor, strokeWidths, minRadius } = config;
    var minRadius = minRadius || 0;
    var strokeColors = strokeColors || 0;
    var strokeWidths = strokeWidths || 0;
    var centerY = height / 2;
    var refs;

    for (var i = 0; i < data.length; i++) {
        if (scale.hasEvents) {
            // c = columns
            refs = {
                c: i
            };
        }
        var r = (config.maxRadius - minRadius) * (data[i] / scale.max);
        r = r ? r + minRadius : 0;
        paths.push(composer.make('circle', {
            cx: (scale.tickSize * i) + scale.paddingLeft,
            cy: centerY,
            r: r,
            fill: fills[i] || (config.fill || randomColor()),
            stroke: strokeColors[i] || (config.strokeColor || randomColor()),
            'stroke-width': strokeWidths[i] || (config.strokeWidth || 2)
        }, refs));
    }
    return paths;
  },

  getRatioByNumberArray: function (scale) {
    var { _data, height, width, len, paddingTop, paddingLeft, paddingRight, paddingBottom } = scale;
    var data = _data;
    var maxRadius = (height < width ? height : width) / 3;

    if (scale.type && scale.type == 'bubble-scattered') {
      // Bubble as a scattered graph
      maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || Math.sqrt(width * height / len) / 2;
      scale.paddingLeft = paddingLeft < maxRadius ? maxRadius : paddingLeft;
      scale.paddingRight = paddingRight < maxRadius ? maxRadius : paddingRight;
      scale.paddingTop = paddingTop < maxRadius ? maxRadius : paddingTop;
      scale.paddingBottom = paddingBottom < maxRadius ? maxRadius : paddingBottom;
      scale.widthRatio = (width - scale.paddingLeft - scale.paddingRight) / scale.max[0];
      scale.heightRatio = (height - scale.paddingTop - scale.paddingBottom) / scale.max[1];
      scale.minRadius = scale.minRadius || 0;
    } else {
      // Bubble line (point) graph
      scale.bubble = scale.bubble || {};
      scale.xAxis = scale.xAxis || {};
      maxRadius = scale.bubble.maxRadius = parseInt(scale.bubble.maxRadius) || maxRadius;
      scale.bubble.minRadius = scale.bubble.minRadius || 0;
      // Figure out the maxRadius & paddings, maxRadius is a guide line
      var tickLen = len - 1 == 0 ? 1 : len - 1;
      var tickSize = (width - scale.paddingLeft - scale.paddingRight) / (tickLen);
      scale.bubble.maxRadius = tickSize < maxRadius ? tickSize + scale.paddingLeft : maxRadius;
      scale.paddingLeft = scale.paddingLeft || scale.bubble.maxRadius * (data[0] / scale.max);
      scale.paddingRight = scale.paddingRight || scale.bubble.maxRadius * (data[len - 1] / scale.max);
      scale.tickSize = (width - scale.paddingLeft - scale.paddingRight) / (tickLen);
    }
  },

  // Extends default ratio w/ auto scaling for Bubble Scatter
  getRatioByObject: function (scale) {
    var { _data, height, width, len, innerPaddingLeft, innerPaddingTop, innerPaddingRight, innerPaddingBottom, minRadius } = scale;
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
  getRatioByTimeSeries: function (scale) {
    var { autoFit, _data, height, width, len, paddingTop, paddingLeft, paddingRight, paddingBottom, axis } = scale;
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
      startTick = ((scale.startDate || data[0].date) || 0).getTime();
      endTick = (scale.endDate || data[len - 1].date).getTime();
    }
    scale.startTick = startTick;
    scale.endTick = endTick;
    var tickLen = endTick - startTick;
    tickLen = (tickLen == 0 ? 1000 : tickLen);

    var potentialPxTickRatio = width / tickLen;

    var firstElementRadius = ( maxRadius - minRadius ) * data[0].data / scale.max;
    var lastElementRadius = ( maxRadius - minRadius ) * data[len - 1].data / scale.max;

    firstElementRadius = firstElementRadius ? firstElementRadius + minRadius : 0;
    lastElementRadius = lastElementRadius ? lastElementRadius + minRadius : 0;

    var startTickLeftRadius = ((startTick - startTick) * potentialPxTickRatio) - firstElementRadius;
    var endTickRightRadius = ((endTick - endTick) * potentialPxTickRatio) + lastElementRadius;
    scale.paddingLeft = startTickLeftRadius < 0 ? Math.abs(startTickLeftRadius) : 0;
    scale.paddingRight = endTickRightRadius > 0 ? endTickRightRadius : 0;
    scale.tickSize = (width - scale.paddingLeft - scale.paddingRight) / (tickLen);
  }
};
