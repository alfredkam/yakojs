var Base = require('../base/default');
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
        chart.type = 'bubble-point';
        chart.complex = true;
        chart.parentType = 'bubble';

        paths = self._lifeCycleManager(data, chart, function (newScale) {
            svg = getSvg();
            paths = self._describeBubble(data, chart.height, chart.width, newScale);
            paths.unshift(self._describeXAxis(chart.height, chart.width, newScale));
            return paths;
        });
        return append(self.element, append(svg, paths));
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
        scale.axis = scale.axis || {};
        maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || maxRadius;

        // Determine if its tick
        if (data[0].tick) {
            scale.timeSeries = true;
            // Check if the start tick is defined, if not defined used first tick
            scale.startTick = scale.startTick || data[0].tick;
            scale.endTick = scale.endTick || data[len].tick;
            // TODO:: determine the new maxRadius / padding
            
        } else {
            // If data set is relative to data length
            // Figure out the maxRadius & paddings, maxRadius is a guide line
            var tickSize = (width - scale.paddingLeft - scale.paddingRight) / (len - 1);
            scale.maxRadius = tickSize < maxRadius ? tickSize + scale.paddingLeft : maxRadius;
            scale.paddingLeft = scale.paddingLeft || scale.maxRadius * (data[0] / scale.max);
            scale.paddingRight = scale.paddingRight || scale.maxRadius * (data[len - 1] / scale.max);
            scale.tickSize = (width - scale.paddingLeft - scale.paddingRight) / (len - 1);
        }
    },
    // Describes the xAxis for bubble point graph
    _describeXAxis: function (height, width, chart) {
        var config = chart.axis;
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
        var dataPoints = data.length;
        var paths = [];
        var defaultStrokeColors = scale.strokeColors || 0;
        var defaultStrokeWidths = scale.strokeWidths || 0;
        var defaultFill = scale.fill || 0;
        var centerY = height / 2;
        var refs;

        console.log(scale.max);

        for (var i = 0; i < data.length; i++) {
            if (scale.hasEvents) {
                // c = columns
                refs = {
                    c: i
                };
            }
            paths.push(this.make('circle', {
                // cx: (scale.tickSize * i) + scale.paddingLeft,
                // cy: centerY,
                // r: config.maxRadius * (data[i] / scale.max),
                // fill: fills[i] || (config.fill || this._randomColor()),
                // stroke: strokeColors[i] || (config.strokeColor || this._randomColor()),
                // 'stroke-width': strokeWidths[i] || (config.strokeWidth || 2)
            }, refs));

        }

        return paths;
    }
});