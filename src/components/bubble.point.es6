// time series / object base
import Base from '../classes/default';
import api from './bubble.api';

module.exports = Base.extend({

    componentName: 'bubble.point',

    // Start of a life cyle
    _startCycle: function () {
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;
        var render = self.postRender;
        var paths = '';
        var scale;

        chart.type = 'bubble-point';
        chart.complex = true;
        chart.parentType = 'bubble';

        // sort data
        var ascByDate = function (a,b) { return a.date - b.date;};
        data.sort(ascByDate);

        return self._lifeCycleManager(data, chart, function (newScale) {
            paths = self._describeBubble(data, chart.height, chart.width, newScale);
            paths.unshift(self._describeXAxis(chart.height, chart.width, newScale));
            return paths;
        });
    },

    // Extends default ratio w/ auto scaling
    _getRatio: api.getRatioByTimeSeries,

    // Describes the xAxis for bubble point graph
    _describeXAxis: api.describeXAxisForBubbleLine,

    // Describes bubble point graph
    _describeBubble: api.describeLineByObject
});
