// TODO:: Consolidate code
import composer from '../svg/composer';
import randomColor from '../utils/randomColor';
import error from '../utils/error';

module.exports = {

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

  describeBubbleLineByObject: function (data, height, width, scale) {
    if (!data) return '';
    var { paddingLeft, innerPaddingLeft, autoFit, strokeColors, strokeWidths, fill, tickSize, startTick, minRadius, maxRadius } = scale;
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
          cx = (i * tickSize) + paddingLeft + innerPaddingLeft;
        } else {
          cx = ((point.date.getTime() - startTick) * tickSize) + paddingLeft + innerPaddingLeft;
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

  // Extends default ratio w/ auto scaling for Bubble Scatter
  getRatioByObject: function (scale) {
    var { _data, height, width, len, innerPaddingLeft, innerPaddingTop, innerPaddingRight, innerPaddingBottom, minRadius } = scale;
    var data = _data;
    // bubble as a scattered graph

    if (scale.maxRange && scale.maxRange.length != 3) {
      error.insufficientRange(this.componentName);
    }

    scale.max[2] = (scale.maxRange? scale.maxRange[2] || scale.max[2] : scale.max[2]);
    scale.max[1] = (scale.maxRange? scale.maxRange[1] || scale.max[1] : scale.max[1]);
    scale.max[0] = (scale.maxRange? scale.maxRange[0] || scale.max[0] : scale.max[0]);

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
      // Date time not provided, it will error out
      startTick = (scale.startDate || data[0].date).getTime();
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
