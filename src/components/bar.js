var Base = require('../classes/default');

var bar = module.exports = Base.extend({

    componentName: 'bar',

    _startCycle: function () {
        var data = this.attributes.data;
        var self = this;
        var chart = this.attributes.opts.chart;
        chart.type = 'bar';

        return self._lifeCycleManager(data, chart, function (newScale) {
            return self._describeBar(data, newScale);
        });
    },

    // Describes the svg that builds out the bar
    _describeBar: function (data, scale) {
        if (!data.length) return '';
        // TODO:: need to account paddings for labels
        // Wrap in array for consistency
        data = typeof data[0] === 'object' ? data : [data];
        var height = scale.height - scale.paddingTop - scale.paddingBottom;
        var paddingY = 5;
        var width = scale.width - scale.paddingLeft - scale.paddingRight;
        var len = data[0].data.length;
        var rows = data.length;
        var tickSize = width / len;
        var paths = [];

        for (var i = 0; i < len; i++) {
            // Stack chart
            if (scale.stack) {
                // The top padding has been taken care off, now account for the bottom padding
                var relativeMax = height * scale.maxSet[i] / scale.max;
                var yAxis = height - relativeMax + scale.paddingTop;
                var total = 0;
                for (var j = 0; j < rows; j++) {
                    paths.push(this.make('rect',{
                        x: tickSize * i + (tickSize / 4) + scale.paddingLeft,
                        y: yAxis,
                        width: tickSize / rows,
                        height: (data[j].data[i] / scale.maxSet[i] * relativeMax),
                        fill: data[j].fill || this._randomColor()
                    }));
                    yAxis += (data[j].data[i] / scale.maxSet[i] * relativeMax);
                }
            } else {
                // Side by side
                var x = tickSize * i + (tickSize / 4) + scale.paddingLeft;
                for (var j = 0; j < rows; j++) {
                    x += tickSize / (rows+1)* j;
                    var relativeMax = height * data[j].data[i] / scale.max;
                    paths.push(this.make('rect',{
                        x: x,
                        y: height - relativeMax + scale.paddingTop,
                        width: tickSize / (rows+1),
                        height: relativeMax,
                        fill: data[j].fill || this._randomColor()
                    }));
                }
            }
        }
        return paths;
    },
});
