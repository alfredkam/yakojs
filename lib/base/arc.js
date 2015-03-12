var Base = require('./default');
var arc = require('../svg/arc');
module.exports = Base.extend({
    // include missing values
    _prepare: function () {
        var self = this;
        var defaults = {
            chart: {
                type: 'chart',
                width: '100',
                height: '100',
                'font-family' : '"Open Sans", sans-serif',
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                paddingBottom: 0
            }
        };
        self._extend(defaults, self.attributes.opts);
        self.attributes.opts = defaults;
        return self;
    },
    // public function for user to set & define the graph attributes
    attr: function (opts) {
        var self = this;
        opts = opts || 0;
        // width: 200,
        // height: 100
        self.attributes.data = opts.data || [];
        self.attributes.opts = opts;

        return self.postRender(self._prepare()
            ._startCycle());
    },
    // parent generator that manages the svg
    _startCycle: function (){
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;
        var svg = self.make('svg',{
            width: chart.width,
            height: chart.height,
            viewBox: '0 0 ' + chart.width + ' ' + chart.height,
        });

        var append = this.append;
        // find the max width & height
        var outerRadius = chart.outerRadius || (chart.height < chart.width ? chart.height : chart.width) / 2;
        // converts nums to relative => total sum equals 1
        var relativeDataSet = this._dataSetRelativeToTotal(data);
        var scale = {
            relativeDataSet: relativeDataSet,
            outerRadius: outerRadius
        };
        self._extend(scale, chart);
        paths = self._lifeCycleManager(scale, function (newScale) {
            return self._describePath(outerRadius, relativeDataSet, scale);
        });

        return append(self.element,
                    append(svg, paths));
    },
    _polarToCartesian: arc.polarToCartesian,
    _describeArc: arc.describeArc,
    _describePie: arc.describePie,
    /* end of snippet */
    /**
     * [_describePath super class]
     * @return {[type]} [empty string]
     */
    _describePath: function () {
        return '';
    }
});