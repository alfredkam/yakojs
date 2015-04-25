var Base = require('../../lib/base/default');
var circle = require('../../lib/svg/circle');
var bubble = require('../../lib/graphs/bubble');
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
    _getRatio: circle.getRatioByObject,
    _describeBubbleChart: bubble.describeBubbleByObject
});