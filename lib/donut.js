var arcBase = require('./arcBase');
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
        var path = '';
        var outerRadius = circumference / 2;
        var innerRadius = outerRadius / 2;
        var padding = 2;
        var startAngle = 0;
        var fills = chart.fills || 0;
        var strokes = chart.fills || 0;
        for (var i = 0; i < data.length; i++) {
            var endAngle = startAngle +  360 * data[i];
            path += this._make('path', {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                stroke: strokes[i] || this._randomColor(),
                fill: fills[i] || this._randomColor(),
                d: this._describeDonut(0, outerRadius, outerRadius, innerRadius, startAngle, endAngle, padding)
            });
            startAngle = endAngle;
        }
        return path;
    },
    /**
     * [_describeDonut describes donut path]
     * @param  {[type]} x           [x cordinates]
     * @param  {[type]} y           [y cordinates]
     * @param  {[type]} outerRadius [description]
     * @param  {[type]} innerRadius [description]
     * @param  {[type]} startAngle  [description]
     * @param  {[type]} endAngle    [description]
     * @param  {[type]} padding     [description]
     * @return {[type]}             [return path attribute 'd' for donut shape]
     */
    _describeDonut: function (x, y, outerRadius, innerRadius, startAngle, endAngle, padding) {
        var outerArc = {
            start: this._polarToCartesian(0, outerRadius, outerRadius - padding, endAngle),
            end : this._polarToCartesian(0, outerRadius, outerRadius - padding, startAngle)
        };
        var innerArc = {
            start: this._polarToCartesian(0, outerRadius, innerRadius - padding, endAngle),
            end : this._polarToCartesian(0, outerRadius, innerRadius - padding, startAngle)
        };
        var arcSweep = endAngle - startAngle <= 180 ? "0": "1";

        return [
            'M', outerArc.start.x, outerArc.start.y,
            'A', outerRadius - padding, outerRadius - padding, 0, arcSweep, 0, outerArc.end.x, outerArc.end.y,
            'L', innerArc.end.x, innerArc.end.y,
            'A', innerRadius - padding , innerRadius - padding, 0, arcSweep, 0, innerArc.start.x, innerArc.start.y,
            'L', outerArc.start.x, outerArc.start.y,
            'Z'
        ].join(" ");
    }
});