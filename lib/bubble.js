var ArcBase = require('./arcBase');
var bubble = module.exports = ArcBase.extend({
    _generate: function () {
        var chart = this.attributes.opts.chart;
        var data = this.attributes.data;
        var svg = this._make('svg',{
            width: chart.width,
            height: chart.height,
            viewBox: '0 0 '+chart.width + ' '+chart.height,
        });

        var widthOffset = chart.width * 0.2;
        var path = this._describeHorizontalPath(chart.height, chart.width, widthOffset, chart);
        path += this._describeBubble(data, chart.height, chart.width, widthOffset, chart);
        var result = this._compile(this.element,
                this._compile(
                    svg,
                        path
                    )
                );
        return result;
    },
    _describeHorizontalPath: function (height, width, widthOffset, chart) {
        // TODO:: need to account for stroke width 
        var centerY = height / 2;
        return this._make('path', {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            stroke: chart.strokColor || this._randomColor(),
            d: 'M' + widthOffset + ' ' + centerY + ' H' + (width - widthOffset)
        });
    },
    _describeBubble: function (data, height, width, widthOffset, chart) {
        if (!data) return '';
        var maxValue = this._getMaxOfArray(data);
        var dataPoints = data.length;
        var gap = (width - (widthOffset * 2)) / (dataPoints - 1);
        var path = '';
        var fills = chart.fills || 0;
        // TODO:: also let user specify the max radius
        var maxRadius =  (chart.height < chart.width ? chart.height : chart.width) / 2;
        // TODO:: need to account for stroke width
        var centerY = height / 2;
        for (var i = 0; i < data.length; i++) {
            path += this._make('circle', {
                cx: (gap * i) + widthOffset,
                cy: centerY,
                r: maxRadius * (data[i] / maxValue),
                fill: fills[0] || (chart.fill || this._randomColor())
            });
        }

        return path;
    },
    _getMaxOfArray: function (arr) {
        return Math.max.apply(null, arr);
    }
});