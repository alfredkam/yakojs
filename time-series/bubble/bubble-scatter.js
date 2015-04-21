var Base = require('../../lib/base/default');
module.exports = Base.extend({
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

        chart.type = 'bubble-scattered';
        chart.complex = true;
        chart.parentType = 'bubble';

        paths = self._lifeCycleManager(data, chart, function (newScale) {
            svg = getSvg();
            return self._describeBubbleChart(data, newScale);
        });
        return append(self.element,append(svg, paths));
    },
    // Describes bubble scattered graph
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
        // bubble as a scattered graph
        maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || Math.sqrt(width * height / len) / 2;
        scale.paddingLeft = paddingLeft < maxRadius ? maxRadius : paddingLeft;
        scale.paddingRight = paddingRight < maxRadius ? maxRadius : paddingRight;
        scale.paddingTop = paddingTop < maxRadius ? maxRadius : paddingTop;
        scale.paddingBottom = paddingBottom < maxRadius ? maxRadius : paddingBottom;
        scale.widthRatio = (width - scale.paddingLeft - scale.paddingRight) / scale.max[0];
        scale.heightRatio = (height - scale.paddingTop - scale.paddingBottom) / scale.max[1];
    },
    _describeBubbleChart: function(data, scale) {
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
    }
});