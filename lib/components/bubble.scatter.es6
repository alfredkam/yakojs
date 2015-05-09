// time series / object base
import Base from '../classes/default';
import api from './bubble.api.es6';

module.exports = Base.extend({

    componentName: 'bubble.scatter',

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
    _getRatio: api.getRatioByObject,
    _describeBubbleChart: api.describeBubbleByObject
});
