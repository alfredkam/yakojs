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
            paths.push(self.make('circle', {
                cx: (inverse.x ? (point[0] * widthRatio) + scale.paddingLeft : width - (point[0] * widthRatio) - scale.paddingLeft),
                cy: (inverse.y ? scale.paddingTop + (point[1] * heightRatio) : height - (point[1] * heightRatio) - scale.paddingTop),
                r: scale.maxRadius * (point[2]/max[2]),
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

        for (var i = 0; i < data.length; i++) {
            var point = data[i];
            if (scale.hasEvents) {
                // c = columns
                refs = {
                    c: i
                };
            }
            paths.push(this.make('circle', {
                cx: ((point.date.getTime() - startTick) * tickSize) + scale.paddingLeft,
                cy: centerY,
                r: scale.maxRadius * point.data / scale.max,
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

        for (var i = 0; i < data.length; i++) {
            if (scale.hasEvents) {
                // c = columns
                refs = {
                    c: i
                };
            }
            paths.push(this.make('circle', {
                cx: (scale.tickSize * i) + scale.paddingLeft,
                cy: centerY,
                r: config.maxRadius * (data[i] / scale.max),
                fill: fills[i] || (config.fill || this._randomColor()),
                stroke: strokeColors[i] || (config.strokeColor || this._randomColor()),
                'stroke-width': strokeWidths[i] || (config.strokeWidth || 2)
            }, refs));
        }
        return paths;
    }
};