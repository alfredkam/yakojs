// time series / object base
import Base from '../classes/default';
import api from './bubble.api.es6';

module.exports = Base.extend({

    componentName: 'bubble.scatter',

    _startCycle: function () {
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;
        var render = self.postRender;
        var paths = '';
        var scale;

        chart.type = 'bubble-scattered';
        chart.complex = true;
        chart.parentType = 'bubble';

        return self._lifeCycleManager(data, chart, function (newScale) {
            return self._describeBubbleChart(data, newScale);
        });
    },

    // Describes bubble scattered graph
    // Extends default ratio w/ auto scaling
    _getRatio: api.getRatioByObject,

    _describeBubbleChart: api.describeBubbleByObject
});
