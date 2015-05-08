module.exports = {
    getConfigForScatterTimeSeries: function (chart) {
        chart.type = 'bubble-scattered';
        chart.complex = true;
        chart.parentType = 'bubble';
        return chart;
    },
    getConfigForLine: function (chart) {
        chart.type = 'bubble-point';
        chart.complex = true;
        chart.parentType = 'bubble';
        return chart;
    },
    // TODO::  Should refer to a function in path to build this
    // Describes the xAxis for bubble point graph
    describeXAxisForBubbleLine: function (height, width, chart) {
        // Note:: chart.xAxis is the old format
        var config = chart.axis || chart.xAxis;
        var centerY = height / 2;
        // Self Note:: PaddingLeft / PaddingRight adjustments are taken out
        return this.make('path', {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            'stroke-width': config.strokeWidth || 2,
            stroke: config.strokeColor || 'transparent',
            d: 'M' + chart.paddingLeft + ' ' + centerY + ' H' + width
        });
    },
    describeBubbleByObject: function(data, scale) {
        var height = scale.height;
        var width = scale.width;
        var heightRatio = scale.heightRatio;
        var widthRatio = scale.widthRatio;
        var self = this;
        var len = scale.len;
        var max = scale.max;
        var defaultFill = scale.fill || 0;
        var defaultStrokeColor = scale.strokeColor || 0;
        var defaultStrokeWidth = scale.strokeWidth || 0;
        var paths = [];
        var refs;
        var minRadius = scale.minRadius || 0;

        // Acceptable inverse flags to inverse the data set
        var inverseList = {
            'x': 'x',
            'y': 'y'
        };
        var inverse = {};
        if (scale.inverse) {
            for (var x in scale.inverse) {
                if (inverseList[scale.inverse[x]]) {
                    inverse[inverseList[scale.inverse[x]]] = true;
                }
            }
        }
        scale.hasInverse = inverse;

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
            paths.push(self.make('circle', {
                cx: (inverse.x ? (point[0] * widthRatio) + scale.paddingLeft : width - (point[0] * widthRatio) - scale.paddingLeft),
                cy: (inverse.y ? scale.paddingTop + (point[1] * heightRatio) : height - (point[1] * heightRatio) - scale.paddingTop),
                r: r,
                fill: props.fill || (defaultFill || self._randomColor())
            }, refs));
        }
        return paths;
    },
    describeBubbleByNumberArray: function(data, scale) {
        var height = scale.height;
        var width = scale.width;
        var heightRatio = scale.heightRatio;
        var widthRatio = scale.widthRatio;
        var self = this;
        var len = scale.len;
        var max = scale.max;
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
                paths.push(self.make('circle', {
                    cx: width - (point[0] * widthRatio) - scale.paddingLeft,
                    cy: height - (point[1] * heightRatio) - scale.paddingTop,
                    r: scale.maxRadius * (point[2]/max[2]),
                    fill: data[r].fill || (fills[i] || self._randomColor())
                }, refs));
            }
        }
        return paths;
    },
    describeLineByObject: function (data, height, width, scale) {
        if (!data) return '';
        var dataPoints = data.length;
        var paths = [];
        var defaultStrokeColor = scale.strokeColors || 0;
        var defaultStrokeWidth = scale.strokeWidths || 0;
        var defaultFill = scale.fill || 0;
        var centerY = height / 2;
        var refs;
        var tickSize = scale.tickSize;
        var startTick = scale.startTick;
        var minRadius = scale.minRadius || 0;

        for (var i = 0; i < data.length; i++) {
            var point = data[i];
            if (scale.hasEvents) {
                // c = columns
                refs = {
                    c: i
                };
            }
            var r = (scale.maxRadius - minRadius) * point.data / scale.max;
            r = r ? r + minRadius : 0;
            paths.push(this.make('circle', {
                cx: ((point.date.getTime() - startTick) * tickSize) + scale.paddingLeft,
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
        var strokeColors = config.strokeColors || 0;
        var strokeWidths = config.strokeWidths || 0;
        var centerY = height / 2;
        var refs;
        var minRadius = config.minRadius || 0;

        for (var i = 0; i < data.length; i++) {
            if (scale.hasEvents) {
                // c = columns
                refs = {
                    c: i
                };
            }
            var r = (config.maxRadius - minRadius) * (data[i] / scale.max);
            r = r ? r + minRadius : 0;
            paths.push(this.make('circle', {
                cx: (scale.tickSize * i) + scale.paddingLeft,
                cy: centerY,
                r: r,
                fill: fills[i] || (config.fill || this._randomColor()),
                stroke: strokeColors[i] || (config.strokeColor || this._randomColor()),
                'stroke-width': strokeWidths[i] || (config.strokeWidth || 2)
            }, refs));
        }
        return paths;
    },
    getRatioByNumberArray: function (scale) {
        var data = scale._data;
        var height = scale.height;
        var width = scale.width;
        var len = scale.len;
        var maxRadius = (height < width ? height : width) / 3;
        var paddingRight = scale.paddingRight;
        var paddingLeft = scale.paddingLeft;
        var paddingTop = scale.paddingTop;
        var paddingBottom = scale.paddingBottom;
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
        var data = scale._data;
        var height = scale.height;
        var width = scale.width;
        var len = scale.len;
        var maxRadius = (height < width ? height : width) / 3;
        var paddingRight = scale.paddingRight;
        var paddingLeft = scale.paddingLeft;
        var paddingTop = scale.paddingTop;
        var paddingBottom = scale.paddingBottom;
        // bubble as a scattered graph
        maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || Math.sqrt(width * height / len) / 2;
        scale.minRadius = scale.minRadius || 0;

        scale.paddingLeft = paddingLeft < maxRadius ? maxRadius : paddingLeft;
        scale.paddingRight = paddingRight < maxRadius ? maxRadius : paddingRight;
        scale.paddingTop = paddingTop < maxRadius ? maxRadius : paddingTop;
        scale.paddingBottom = paddingBottom < maxRadius ? maxRadius : paddingBottom;
        scale.widthRatio = (width - scale.paddingLeft - scale.paddingRight) / scale.max[0];
        scale.heightRatio = (height - scale.paddingTop - scale.paddingBottom) / scale.max[1];
    },
    // Extends default ratio w/ auto scaling for Bubble point
    getRatioByTimeSeries: function (scale) {
        var data = scale._data;
        var height = scale.height;
        var width = scale.width;
        var len = scale.len;
        var maxRadius = (height < width ? height : width) / 3;
        var paddingRight = scale.paddingRight;
        var paddingLeft = scale.paddingLeft;
        var paddingTop = scale.paddingTop;
        var paddingBottom = scale.paddingBottom;
        scale.axis = scale.axis || {};
        maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || maxRadius;
        scale.minRadius = scale.minRadius || 0;

        // Determine if its time series
        scale.timeSeries = true;
        // Check if the start date is defined, if not defined using first element in array
        // TODO:: Handle edge case of single point
        scale.startTick = startTick = (scale.startDate || data[0].date).getTime();
        scale.endTick = endTick = (scale.endDate || data[len - 1].date).getTime();
        var tickLen = endTick - startTick;  // Need to handle zero
        tickLen = (tickLen == 0 ? 1000 : tickLen);
        var firstTick = data[0].date.getTime();
        var lastTick = data[len - 1].date.getTime();
        var firstTickLeftRadius = firstTick - startTick - (scale.maxRadius * data[0].data / scale.max);
        var lastTickRightRadius = lastTick - endTick + (scale.maxRadius * data[len - 1].data / scale.max);
        scale.paddingLeft = firstTickLeftRadius < 0 ? Math.abs(firstTickLeftRadius) : 0;
        scale.paddingRight = lastTickRightRadius > 0 ? lastTickRightRadius : 0;
        scale.tickSize = (width - scale.paddingLeft - scale.paddingRight) / (tickLen);   
    }
};