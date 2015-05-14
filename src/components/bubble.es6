/* Entry Points */
import Base from '../classes/default';
import api from './bubble.api';

module.exports = Base.extend({

    componentName: 'bubble',

    // Start of a life cyle
    _startCycle: function () {
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;
        var render = self.postRender;
        var paths = '';
        var scale;

        if (chart.type == 'scattered') {
            chart.type = 'bubble-scattered';
            return self._lifeCycleManager(data, chart, function (newScale) {
                return self._describeBubbleChart(data, newScale);
            });
        } else {
            chart.type = 'bubble-point';
            return self._lifeCycleManager(data, chart, function (newScale) {
                paths = self._describeBubble(data, chart.height, chart.width, newScale);
                paths.unshift(self._describeXAxis(chart.height, chart.width, newScale));
                return paths;
            });
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
