// time series / object base
var Base = require('../classes/default');
var api = require('./bubble.api');

module.exports = Base.extend({

    componentName: 'bubble.point',
    
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
    _getRatio: api.getRatioByTimeSeries,
    // Describes the xAxis for bubble point graph
    _describeXAxis: api.describeXAxisForBubbleLine,
    // Describes bubble point graph
    _describeBubble: api.describeLineByObject
});