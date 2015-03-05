var Base = require('./base/arc');
var bubble = module.exports = Base.extend({
    _generate: function () {
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

        var paddingX = 10 || chart.paddingX;
        if (chart.type == 'scattered') {
            var scale = self._scale(data, {bubble: true});
            paddingX = 30;
            var paddingY = 20;
            scale.heightRatio = (chart.height - (paddingY * 2)) / scale.max[1];
            scale.widthRatio = (chart.width - (paddingX * 2)) / scale.max[0];
            scale.paddingY = paddingY;
            scale.paddingX = paddingX;
            self._extend(scale, chart);
            paths = self._describeBubbleChart(data, scale);
            return render(append(self.element,append(svg, paths)));

        } else {
            paths = self._describeBubble(data, chart.height, chart.width, paddingX, chart);
            paths.unshift(self._describeHorizontalPath(chart.height, chart.width, paddingX, chart));
            return render(
                    append(self.element, 
                        append(svg, paths)
                    )
                );
        }
    },
    // bubble graph
    _describeBubbleChart: function(data, scale) {
        var height = scale.height;
        var width = scale.width;
        var heightRatio = scale.heightRatio;
        var widthRatio = scale.widthRatio;
        var paddingX = scale.paddingX;
        var paddingY = scale.paddingY;
        var self = this;
        var len = scale.len;
        var maxRadius =  scale.maxRadius || (height < width ? height : width) / 2;
        var max = scale.max;
        var fills = scale.fills || 0;
        var paths = [];

        for (var r = 0; r < scale.rows; r++) {
            for (var i = 0; i < len; i++) {
                var point = data[r].data[i];

                paths.push(self.make('circle', {
                    cx: width - (point[0] * widthRatio) - paddingX,
                    cy: height - (point[1] * heightRatio) - paddingY,
                    r: maxRadius * (point[2]/max[2]),
                    fill: data[r].fill || (fills[i] || self._randomColor())
                }));
            }
        }
        return paths;
    },
    _describeHorizontalPath: function (height, width, widthOffset, chart) {
        // TODO:: need to account for stroke width 
        var centerY = height / 2;
        return this.make('path', {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            stroke: chart.strokColor || this._randomColor(),
            d: 'M' + widthOffset + ' ' + centerY + ' H' + (width - widthOffset)
        });
    },
    // bubble point
    _describeBubble: function (data, height, width, widthOffset, chart) {
        if (!data) return '';
        var maxValue = this._getMaxOfArray(data);
        var dataPoints = data.length;
        var gap = (width - (widthOffset * 2)) / (dataPoints - 1);
        var paths = [];
        var fills = chart.fills || 0;
        var maxRadius =  chart.maxRadius || (chart.height < chart.width ? chart.height : chart.width) / 2;
        var centerY = height / 2;
        for (var i = 0; i < data.length; i++) {
            paths.push(this.make('circle', {
                cx: (gap * i) + widthOffset,
                cy: centerY,
                r: maxRadius * (data[i] / maxValue),
                fill: fills[i] || (chart.fill || this._randomColor())
            }));
        }

        return paths;
    },
    _getMaxOfArray: function (arr) {
        return Math.max.apply(null, arr);
    }
});