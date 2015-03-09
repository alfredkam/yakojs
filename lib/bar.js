var Base = require('./base/default');
var bar = module.exports = Base.extend({
    // include missing values
    _prepare: function () {
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
            ._startCycle());
    },
    _startCycle: function () {
        var data = this.attributes.data;
        var self = this;
        var chart = this.attributes.opts.chart;
        var append = self.append;
        var svg = this.make('svg',{
            width: chart.width,
            height: chart.height,
            viewBox: '0 0 ' + chart.width + ' ' + chart.height,
        });

        var scale = self._defineBaseScaleProperties(data, chart);
        paths = self._lifeCycleManager(scale, function (newScale) {
            return self._describeBar(data, scale);
        });
        return append(self.element,append(svg, paths));
    },
    // describes the svg that builds out the bar
    _describeBar: function (data, scale) {
        if (!data.length) return '';
        // TODO:: need to account paddings for labels
        // wrap in array for consistency
        data = typeof data[0] === 'object' ? data : [data];
        var height = scale.height - scale.paddingTop - scale.paddingBottom;
        var paddingY = 5;
        var width = scale.width - scale.paddingLeft - scale.paddingRight;
        var len = data[0].data.length;
        var rows = data.length;
        var tickSize = width / len;
        var paths = [];

        for (var i = 0; i < len; i++) {
            // stack chart
            if (scale.stack) {
                // the top padding has been taken care off, now account for the bottom padding
                var relativeMax = height * scale.maxSet[i] / scale.max;
                var yAxis = height - relativeMax + scale.paddingTop;
                var total = 0;
                for (var j = 0; j < rows; j++) {
                    paths.push(this.make('rect',{
                        x: tickSize * i + (tickSize/4) + scale.paddingLeft,
                        y: yAxis,
                        width: tickSize / rows,
                        height: (data[j].data[i] / scale.maxSet[i] * relativeMax),
                        fill: data[j].fill || this._randomColor()
                    }));
                    yAxis += (data[j].data[i] / scale.maxSet[i] * relativeMax);
                }
            } else {
                // side by side
                for (var j = 0; j < rows; j++) {
                    var relativeMax = height * data[j].data[i] / scale.max;
                    paths.push(this.make('rect',{
                        x: (tickSize * (i + 1)) - (tickSize/(j + 1)) + scale.paddingLeft,
                        y: height - relativeMax + scale.paddingTop,
                        width: tickSize / (rows + 0.5),
                        height: relativeMax,
                        fill: data[j].fill || this._randomColor()
                    }));
                }
            }
        }
        return paths;
    },
});