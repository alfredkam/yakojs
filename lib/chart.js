// This is a draft
var Base = require('./classes/default');

module.exports = Base.extend({
    _startCycle: function () {
        var points  = this.attributes.data;
        var self = this;
        var chart = this.attributes.opts.chart;
        var append = self._append;
        var svg = self.make('svg',{
            width: chart.width,
            height: chart.height,
            viewBox: '0 0 ' + chart.width + ' ' + chart.height,
        });

        var path = self._lifeCycleManager(data, chart, function (preliminraryScale) {
            var paths = [];
            for (var chartType in points) {
                paths.push(self._dispatchProps(preliminraryScale, chartType, points[chartType], chart));
            }
            return paths;
        });

        return append(self.element, append(svg, path));
    },
    _describeProps: function (data, newScale) {
        // Preliminary Scale should be really tiny.
        var scaleCopy = JSON.parse(JSON.stringify(preliminraryScale));
        var scale = self._defineBaseScaleProperties(scaleCopy, data, chart);
    },
    _dispatchProps: function (preliminraryScale, chartType, data, chartProps) {
        var self = this;
    }
});
