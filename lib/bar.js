var Base = require('./base/default');
var bar = module.exports = Base.extend({
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

        return this.render(this._prepare()
            ._generate());
    },
    _generate: function () {
        var data = this.attributes.data;
        var chart = this.attributes.opts.chart;
        var svg = this.make('svg',{
            width: chart.width,
            height: chart.height,
            viewBox: '0 0 ' + chart.width + ' ' + chart.height,
        });
        return this.append(this.element,
                this.append(
                    svg,
                    this._describeBar(data, chart)
                    )
                );
    },
    // describes the svg that builds out the bar
    _describeBar: function (data, chart) {
        if (!data.length) return '';
        // TODO:: need to account paddings for labels
        // wrap in array for consistency
        data = typeof data[0] === 'object' ? data : [data];
        var height = chart.height;
        var paddingY = 5;
        height = height - paddingY;
        var width = chart.width;
        var len = data[0].data.length;
        var rows = data.length;
        var tickSize = width / len;
        var properties = this._scale(data, chart);
        var paths = [];

        // TODO:: feels expensive, need to optimize
        for (var i = 0; i < len; i++) {
            // stack chart
            if (chart.stack) {
                // the top padding has been taken care off, now account for the bottom padding
                var relativeMax = (height - paddingY) * properties.maxSet[i] / properties.max;
                var yAxis = height - relativeMax;
                var total = 0;
                for (var j = 0; j < rows; j++) {
                    paths.push(this.make('rect',{
                        x: tickSize * i + (tickSize/4),
                        y: yAxis,
                        width: tickSize / rows,
                        height: (data[j].data[i]/properties.maxSet[i] * relativeMax),
                        fill: data[j].fill || this._randomColor()
                    }));
                    yAxis += (data[j].data[i]/properties.maxSet[i] * relativeMax);
                }
            } else {
                // side by side
                for (var j = 0; j < rows; j++) {
                    var yAxis = (height - paddingY) * data[j].data[i] / properties.max;
                    paths.push(this.make('rect',{
                        x: (tickSize * (i+1)) - (tickSize/(j + 1)),
                        y: height - yAxis,
                        width: tickSize / (rows+1),
                        height: yAxis,
                        fill: data[j].fill || this._randomColor()
                    }));
                }
            }
        }
        return paths;
    },
});