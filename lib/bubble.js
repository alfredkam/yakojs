var Base = require('./base/default');
var bubble = module.exports = Base.extend({
    // Start of a life cyle
    _startCycle: function () {
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;
        var svg;
        var append = self.append;
        var render = self.postRender;
        var paths = '';
        var scale;

        var getSvg = function () {
            return self.make('svg',{
                width: chart.width,
                height: chart.height,
                viewBox: '0 0 ' + chart.width + ' ' + chart.height,
            });
        };

        if (chart.type == 'scattered') {
            chart.type = 'bubble-scattered';
            paths = self._lifeCycleManager(data, chart, function (newScale) {
                svg = getSvg();
                return self._describeBubbleChart(data, newScale);
            });
            return append(self.element,append(svg, paths));
        } else {
            chart.type = 'bubble-point';
            paths = self._lifeCycleManager(data, chart, function (newScale) {
                svg = getSvg();
                paths = self._describeBubble(data, chart.height, chart.width, newScale);
                paths.unshift(self._describeXAxis(chart.height, chart.width, newScale));
                return paths;
            });
            return append(self.element, append(svg, paths));
        }
    },
    // Extends default ratio w/ auto scaling
    _getRatio: function (scale) {
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
            // console.log(scale);
            // bubble as a scattered graph
            maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || Math.sqrt(width * height / len) / 2;
            scale.paddingLeft = paddingLeft < maxRadius ? maxRadius : paddingLeft;
            scale.paddingRight = paddingRight < maxRadius ? maxRadius : paddingRight;
            scale.paddingTop = paddingTop < maxRadius ? maxRadius : paddingTop;
            scale.paddingBottom = paddingBottom < maxRadius ? maxRadius : paddingBottom;
            scale.widthRatio = (width - scale.paddingLeft - scale.paddingRight) / scale.max[0];
            scale.heightRatio = (height - scale.paddingTop - scale.paddingBottom) / scale.max[1];
        } else {
            // bubble line (point) graph
            scale.bubble = scale.bubble || {};
            scale.xAxis = scale.xAxis || {};
            maxRadius = scale.bubble.maxRadius = parseInt(scale.bubble.maxRadius) || maxRadius;
            // figure out the maxRadius & paddings, maxRadius is a guide line
            var tickSize = (width - scale.paddingLeft - scale.paddingRight) / (len - 1);
            scale.bubble.maxRadius = tickSize < maxRadius ? tickSize + scale.paddingLeft : maxRadius;
            scale.paddingLeft = scale.paddingLeft || scale.bubble.maxRadius * (data[0] / scale.max);
            scale.paddingRight = scale.paddingRight || scale.bubble.maxRadius * (data[len - 1] / scale.max);
            scale.tickSize = (width - scale.paddingLeft - scale.paddingRight) / (len - 1);
        }
    },
    // Describes bubble scattered graph
    _describeBubbleChart: function(data, scale) {
        var height = scale.height;
        var width = scale.width;
        var heightRatio = scale.heightRatio;
        var widthRatio = scale.widthRatio;
        var self = this;
        var len = scale.len;
        var max = scale.max;
        var fills = scale.fills || 0;
        var paths = [];

        for (var r = 0; r < scale.rows; r++) {
            for (var i = 0; i < len; i++) {
                var point = data[r].data[i];
                paths.push(self.make('circle', {
                    cx: width - (point[0] * widthRatio) - scale.paddingLeft,
                    cy: height - (point[1] * heightRatio) - scale.paddingTop,
                    r: scale.maxRadius * (point[2]/max[2]),
                    fill: data[r].fill || (fills[i] || self._randomColor())
                }));
            }
        }
        return paths;
    },
    // Describes the xAxis for bubble point graph
    _describeXAxis: function (height, width, chart) {
        var config = chart.xAxis;
        var centerY = height / 2;
        return this.make('path', {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            'stroke-width': config.strokeWidth || 2,
            stroke: config.strokeColor || this._randomColor(),
            d: 'M' + chart.paddingLeft + ' ' + centerY + ' H' + (width - chart.paddingLeft - chart.paddingRight)
        });
    },
    // Describes bubble point graph
    _describeBubble: function (data, height, width, scale) {
        if (!data) return '';
        var config = scale.bubble;
        var dataPoints = data.length;
        var paths = [];
        var fills = config.fills || 0;
        var strokeColors = config.strokeColors || 0;
        var strokeWidths = config.strokeWidths || 0;
        var centerY = height / 2;
        for (var i = 0; i < data.length; i++) {
            paths.push(this.make('circle', {
                cx: (scale.tickSize * i) + scale.paddingLeft,
                cy: centerY,
                r: config.maxRadius * (data[i] / scale.max),
                fill: fills[i] || (config.fill || this._randomColor()),
                stroke: strokeColors[i] || (config.strokeColor || this._randomColor()),
                'stroke-width': strokeWidths[i] || (config.strokeWidth || 2)
            }));
        }
        return paths;
    }
});