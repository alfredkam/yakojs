var Base = require('./base/arc');
var bubble = module.exports = Base.extend({
    _startCycle: function () {
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;
        var svg = self.make('svg',{
            width: chart.width,
            height: chart.height,
            viewBox: '0 0 ' + chart.width + ' ' + chart.height,
        });
        var append = self.append;
        var render = self.render;
        var paths = '';
        var scale;

        if (chart.type == 'scattered') {
            chart.bubble = true;
            scale = self._defineBaseScaleProperties(data, chart);
            paths = self._lifeCycleManager(scale, function (newScale) {
                return self._describeBubbleChart(data, newScale);
            });
            return append(self.element,append(svg, paths));
        } else {
            scale = self._defineBaseScaleProperties(data, chart);
            paths = self._lifeCycleManager(scale, function (newScale) {
                paths = self._describeBubble(data, chart.height, chart.width, newScale);
                paths.unshift(self._describeHorizontalPath(chart.height, chart.width, newScale));
                return paths;
            });
            return append(self.element, append(svg, paths));
        }
    },
    _getRatio: function (scale) {
        if (scale.type && scale.type == 'scattered') {
            scale.widthRatio = (scale.width - scale.paddingLeft - scale.paddingRight) / scale.max[0];
            scale.heightRatio = (scale.height - scale.paddingTop - scale.paddingBottom) / scale.max[1];
        } else {
            scale.tickSize = (scale.width - scale.paddingLeft - scale.paddingRight) / (scale.len - 1);
        }
        scale.maxRadius = scale.maxRadius || (height < width ? height : width) / 2;
    },
    // bubble graph
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
                    cx: width - (point[0] * widthRatio) - scale.paddingRight,
                    cy: height - (point[1] * heightRatio) - scale.paddingBottom,
                    r: scale.maxRadius * (point[2]/max[2]),
                    fill: data[r].fill || (fills[i] || self._randomColor())
                }));
            }
        }
        return paths;
    },
    _describeHorizontalPath: function (height, width, chart) {
        var centerY = height / 2;
        return this.make('path', {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            'stroke-width': chart.strokeWidth || 2,
            stroke: chart.strokColor || this._randomColor(),
            d: 'M' + chart.paddingLeft + ' ' + centerY + ' H' + (width - chart.paddingLeft - chart.paddingRight)
        });
    },
    // bubble point
    _describeBubble: function (data, height, width, scale) {
        if (!data) return '';
        var dataPoints = data.length;
        var paths = [];
        var fills = scale.fills || 0;
        var centerY = height / 2;
        for (var i = 0; i < data.length; i++) {
            paths.push(this.make('circle', {
                cx: (scale.tickSize * i) + scale.paddingLeft,
                cy: centerY,
                r: scale.maxRadius * (data[i] / scale.max),
                fill: fills[i] || (scale.fill || this._randomColor())
            }));
        }
        return paths;
    }
});