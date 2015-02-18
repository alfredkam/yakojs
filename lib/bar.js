var Base = require('./base');
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

        return this._prepare()
            ._generate();
    },
    _generate: function () {
        var data = this.attributes.data;
        var chart = this.attributes.opts.chart;
        var svg = this._make('svg',{
            "style": "width: 100%; max-width: "
                +chart.width+"px; height:"
                +chart.height+"px;",
            //No view box?
            xmlns: 'http://www.w3.org/2000/svg',
            version: '1.1',
            viewBox: '0 0 '+chart.width + ' '+chart.height,
        });
        var result = this._compile(this.element,
                this._compile(
                    svg,
                    this._describeBar(data, chart)
                    )
                );
        return (typeof result == 'string') ? result : this;
    },
    // find min max between multiple rows of data sets
    _findMinMax: function (data, len, rows, opts) {
        opts = opts || 0;
        data = typeof data[0] === 'object' ? data : [data];
        var max = 0;
        var min = Number.MAX_VALUE;
        var maxSet = [];

        // TODO:: implement a faster array search
        for (var i = 0; i < len; i++) {
            if (opts.stack) {
                var rowTotal  = 0;
                for (var j = 0; j < rows; j++) {
                    rowTotal += data[j].data[i];
                }
                maxSet.push(rowTotal);
                max = max < rowTotal ? rowTotal : max;
                min = min > rowTotal ? rowTotal : min;
            } else {
                for (var k = 0; k < rows; k++) {
                    min = min > data[k].data[i] ? data[k].data[i] : min;
                    max = max < data[k].data[i] ? data[k].data[i] : max;
                }
            }
        }

        return {
            min : min,
            max : max,
            maxSet: maxSet
        };
    },
    _describeBar: function (data, chart) {
        if (!data.length) return '';
        // TODO:: need to account paddings for labels
        // wrap in array for consistency
        data = typeof data[0] === 'object' ? data : [data];
        var height = chart.height;
        var paddingX = height * 0.1;
        height = height - paddingX;
        var width = chart.width;
        var len = data[0].data.length;
        var rows = data.length;
        var gap = width / len;
        var properties = this._findMinMax(data, len, rows, chart);
        var path  = '';

        // TODO:: feels expensive, need to optimize
        for (var i = 0; i < len; i++) {
            // stack chart
            if (chart.stack) {
                // the top padding has been taken care off, now account for the bottom padding
                var relativeMax = (height - paddingX) * properties.maxSet[i] / properties.max;
                var yAxis = height - relativeMax;
                var total = 0;
                for (var j = 0; j < rows; j++) {
                    path += this._make('rect',{
                        x: gap * i + (gap/4),
                        y: yAxis,
                        width: gap / rows,
                        height: (data[j].data[i]/properties.maxSet[i] * relativeMax),
                        fill: data[j].fill || this._randomColor()
                    });
                    yAxis += (data[j].data[i]/properties.maxSet[i] * relativeMax);
                }
            } else {
                // side by side
                for (var j = 0; j < rows; j++) {
                    var yAxis = (height - paddingX) * data[j].data[i] / properties.max;
                    path += this._make('rect',{
                        x: (gap * (i+1)) - (gap/(j + 1)),
                        y: height - yAxis,
                        width: gap / (rows+1),
                        height: yAxis,
                        fill: data[j].fill || this._randomColor()
                    });
                }
            }
        }
        return path;
    },
});