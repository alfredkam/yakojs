var Base = require('../../lib/base/default');
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

        // sort data
        var ascByDate = function (a,b) { return a.date - b.date;};
        data.sort(ascByDate);

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

        // Determine if its time series
        scale.timeSeries = true;
        // Check if the start date is defined, if not defined using first element in array
        // TODO:: Handle edge case of single point
        scale.startTick = startTick = (scale.startDate || data[0].date).getTime();
        scale.endTick = endTick = (scale.endDate || data[len - 1].date).getTime();
        var tickLen = endTick - startTick;  // Need to handle zero
        var firstTick = data[0].date.getTime();
        var lastTick = data[len - 1].date.getTime();
        var firstTickLeftRadius = firstTick - startTick - (scale.maxRadius * data[0].data / scale.max);
        var lastTickRightRadius = lastTick - endTick + (scale.maxRadius * data[len - 1].data / scale.max);
        scale.paddingLeft = firstTickLeftRadius < 0 ? Math.abs(firstTickLeftRadius) : 0;
        scale.paddingRight = lastTickRightRadius > 0 ? lastTickRightRadius : 0;
        scale.tickSize = (width - scale.paddingLeft - scale.paddingRight) / (tickLen);
    },
    // Describes the xAxis for bubble point graph
    _describeXAxis: function (height, width, chart) {
        var config = chart.axis;
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
    // Describes bubble point graph
    _describeBubble: function (data, height, width, scale) {
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
    }
});