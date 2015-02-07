var Base = require('./base');
var pie = module.exports = Base.extend({
    // public function for user to set & define the graph attributes
    set: function (opts) {
        opts = opts || 0;
        // width: 200,
        // height: 100
        this.attributes.data = opts.data || [];
        this.attributes.opts = opts;

        return this._prepare()
            ._generate();
    },
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
    // parent generator that manages the svg
    _generate: function (){
        var chart = this.attributes.opts.chart;
        var data = this.attributes.data;
        var svg = this._make('svg',{
            width: '100%',
            height: chart.height,
            //No view box?
            xlms: 'http://www.w3.org/2000/svg',
            version: '1.1',
            viewBox: '0 0 '+chart.width + ' '+chart.height,
        });
        // find the max width & height
        var dimension = chart.height < chart.width ? chart.height : chart.width;
        // converts nums to relative => total sum equals 1
        var relativeDataSet = this._dataSetToRelative(data);
        var result = this._compile(this.element,
                this._compile(
                    svg,
                    this._buildPie(dimension, relativeDataSet, chart)
                    )
                );
        return (typeof result == 'string') ? result : this;
    },
    // arc calculation snippet from http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    _polarToCartesian: function (centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    },
    _describeArc: function (x, y, radius, startAngle, endAngle){

        var start = this._polarToCartesian(x, y, radius, endAngle);
        var end = this._polarToCartesian(x, y, radius, startAngle);

        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, arcSweep, 0, end.x, end.y
        ].join(" ");

        return d;
    },
    /* end of snippet */
    _buildPie: function (dimension, data, chart) {
        if (!data) return '';
        var path = '';
        var radius = dimension / 2;
        var offset = 2;
        var totalAngle = 0;
        var fills = chart.fills || 0;
        var strokes = chart.fills || 0;
        for (var i = 0; i < data.length; i++) {
            var endAngle = totalAngle + 360 * data[i];
            path += this._make('path',{
                stroke: strokes[i] || this._randomColor(),
                d: this._describeArc(0 , radius, radius - offset, totalAngle, endAngle) + ' L 0 ' + radius,
                fill: fills[i] || this._randomColor()
            });
            totalAngle = endAngle;
        }
        return path;
    }
});