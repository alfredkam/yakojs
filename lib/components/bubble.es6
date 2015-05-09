/* Entry Points */
import Base from '../classes/default';
import api from './bubble.api.es6';

module.exports = Base.extend({

    componentName: 'bubble',

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
            return append(self.element, append(svg, paths));
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
    _getRatio: api.getRatioByNumberArray,
    // Describes bubble scattered graph
    _describeBubbleChart: api.describeBubbleByNumberArray,
    // Describes the xAxis for bubble point graph
    _describeXAxis: api.describeXAxisForBubbleLine,
    // Describes bubble point graph
    _describeBubble: api.describeLineByNumberArray
});
