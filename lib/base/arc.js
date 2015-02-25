var Base = require('./default');
var arc = require('../svg/arc');
module.exports = Base.extend({
    // include missing values
    _prepare: function () {
        var defaults = {
            chart: {
                type: 'chart',
                width: '100',
                height: '100',
                'font-family' : '"Open Sans", sans-serif'
            }
        };
        this._extend(defaults, this.attributes.opts);
        this.attributes.opts = defaults;
        return this;
    },
    // public function for user to set & define the graph attributes
    attr: function (opts) {
        opts = opts || 0;
        // width: 200,
        // height: 100
        this.attributes.data = opts.data || [];
        this.attributes.opts = opts;

        return this._prepare()
            ._generate();
    },
    // parent generator that manages the svg
    _generate: function (){
        var chart = this.attributes.opts.chart;
        var data = this.attributes.data;
        var svg = this.make('svg',{
            width: chart.width,
            height: chart.height,
            viewBox: '0 0 ' + chart.width + ' ' + chart.height,
        });
        // find the max width & height
        var circumference = chart.height < chart.width ? chart.height : chart.width;
        // converts nums to relative => total sum equals 1
        var relativeDataSet = this._dataSetRelativeToTotal(data);
        var result = this.compile(this.element,
                this.compile(
                    svg,
                    this._describePath(circumference, relativeDataSet, chart)
                    )
                );
        return (typeof result == 'string') ? result : this;
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