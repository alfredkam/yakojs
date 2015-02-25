var arcBase = require('./base/arc');
var pie = module.exports = arcBase.extend({
    /**
     * [_describePath genereates the paths for each pie segment]
     * @param  {[int]} circumference [circumfrance]
     * @param  {[array]} data      [data set]
     * @param  {[json]} chart     [user specified chart options]
     * @return {[string]}           [the html string for the pie]
     */
    _describePath: function (circumference, data, chart) {
        if (!data) return '';
        var paths = [];
        var outerRadius = chart.outerRadius || (circumference / 2);
        var innerRadius = chart.innerRadius || (outerRadius / 2);
        var startAngle = 0;
        var fills = chart.fills || 0;
        var strokes = chart.strokeColors || 0;
        var centerY = chart.height / 2;
        var centerX = chart.width / 2;
        for (var i = 0; i < data.length; i++) {
            var endAngle = startAngle +  360 * data[i];
            paths.push(this.make('path', {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                stroke: strokes[i] || (chart.strokeColor||this._randomColor()),
                fill: fills[i] || this._randomColor(),
                d: this._describeDonut(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle)
            }));
            startAngle = endAngle;
        }
        return paths;
    },
    /**
     * [_describeDonut describes donut path]
     * @param  {Number} x           [x cordinates]
     * @param  {Number} y           [y cordinates]
     * @param  {Number} outerRadius [description]
     * @param  {Number} innerRadius [description]
     * @param  {Number} startAngle  [description]
     * @param  {Number} endAngle    [description]
     * @return {String}             [return path attribute 'd' for donut shape]
     */
    _describeDonut: function (x, y, outerRadius, innerRadius, startAngle, endAngle) {
        var outerArc = {
            start: this._polarToCartesian(x, y, outerRadius, endAngle),
            end : this._polarToCartesian(x, y, outerRadius, startAngle)
        };
        var innerArc = {
            start: this._polarToCartesian(x, y, innerRadius, endAngle),
            end : this._polarToCartesian(x, y, innerRadius, startAngle)
        };
        var arcSweep = endAngle - startAngle <= 180 ? "0": "1";

        return [
            'M', outerArc.start.x, outerArc.start.y,
            'A', outerRadius, outerRadius, 0, arcSweep, 0, outerArc.end.x, outerArc.end.y,
            'L', innerArc.end.x, innerArc.end.y,
            'A', innerRadius, innerRadius, 0, arcSweep, 1, innerArc.start.x, innerArc.start.y,
            'L', outerArc.start.x, outerArc.start.y,
            'Z'
        ].join(" ");
    }
});