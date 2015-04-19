var Base = require('../base/default');

module.exports = Base.extend({
    _startCycle: function () {
        var data = this.attributes.data;
        var self = this;
        var chart = this.attributes.opts.chart;
        var append = self.append;
        var svg;
        chart.type = 'bar';

        paths = self._lifeCycleManager(data, chart, function (newScale) {
            // Chart will now only specifiy the space it needs
            svg = self.make('svg',{
                width: chart.width,
                height: chart.height,
                viewBox: '0 0 ' + chart.width + ' ' + chart.height,
            });
            return self._describeProps(data, newScale);
        });
        return append(self.element,append(svg, paths));
    },
    _describeProps: function (data, newScale) {
        
    }
});