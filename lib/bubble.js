var ArcBase = require('./arcBase');
var bubble = module.exports = ArcBase.extend({
    _generate: function () {
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
        var circumference = chart.height < chart.width ? chart.height : chart.width;
        // converts nums to relative => total sum equals 1
        var relativeDataSet = this._dataSetToRelative(data);
        var result = this._compile(this.element,
                this._compile(
                    svg,
                    this._describePath(circumference, relativeDataSet, chart)
                    )
                );
        return (typeof result == 'string') ? result : this;
    },
    /**
     * [_describePath genereates the paths for each pie segment]
     * @param  {[int]} circumference [circumfrance]
     * @param  {[array]} data      [data set]
     * @param  {[json]} chart     [user specified chart options]
     * @return {[string]}           [the html string for the pie]
     */
    _describePath: function (circumference, data, chart) {
        if (!data) return '';
        var path = '';
        var radius = circumference / 2;
        var padding = 2;
        var totalAngle = 0;
        var fills = chart.fills || 0;
        var strokes = chart.fills || 0;
        for (var i = 0; i < data.length; i++) {
            var endAngle = totalAngle + 360 * data[i];
            path += this._make('path',{
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                stroke: strokes[i] || this._randomColor(),
                d: this._describeArc(0 , radius, radius - padding, totalAngle, endAngle) + ' L 0 ' + radius,
                fill: fills[i] || this._randomColor()
            });
            totalAngle = endAngle;
        }
        return path;
    }
});