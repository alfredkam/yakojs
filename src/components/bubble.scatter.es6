// Object base
import Base from '../classes/default';
import api from './bubble.api';

module.exports = Base.extend({

    componentName: 'bubble.scatter',

    _startCycle: function () {
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;

        return self._lifeCycleManager(data, chart, function (newScale) {
            return self._describeBubbleChart(data, newScale);
        });
    },

    // Describes bubble scattered graph
    // Extends default ratio w/ auto scaling
    _getRatio: api.getRatioByObject,

    _describeBubbleChart: api.describeBubbleByObject
});
