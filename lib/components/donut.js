var arcBase = require('../classes/arc');
var pie = module.exports = arcBase.extend({

    componentName: 'donut',

    /**
     * [_describePath genereates the paths for each pie segment]
     * @param  {[int]} radius [circumfrance]
     * @param  {[array]} data      [data set]
     * @param  {[json]} chart     [user specified chart options]
     * @return {[string]}           [the html string for the pie]
     */
    _describePath: function _describePath(radius, data, chart) {
        if (!data) return '';
        var paths = [];
        var outerRadius = chart.outerRadius || radius;
        var innerRadius = chart.innerRadius || outerRadius / 2;
        var startAngle = 0;
        var fills = chart.fills || 0;
        var strokes = chart.strokeColors || 0;
        var centerY = chart.height / 2;
        var centerX = chart.width / 2;
        var self = this;

        if (chart.total == 0) {
            return self.make('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                stroke: strokes[i] || (chart.strokeColor || self._randomColor()),
                fill: 'transparent',
                d: self._describeDonutRing(centerX, centerY, innerRadius, outerRadius)
            });
        }

        for (var i = 0; i < data.length; i++) {
            var endAngle = startAngle + 360 * data[i];
            paths.push(self.make('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                stroke: strokes[i] || (chart.strokeColor || self._randomColor()),
                fill: fills[i] || self._randomColor(),
                d: self._describeDonut(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle)
            }));
            startAngle = endAngle;
        }

        return paths;
    },

    /**
     * [_describeDonutRing describes donut ring path]
     * @param  {Number} x           [x cordinates]
     * @param  {Number} y           [y cordinates]
     * @param  {Number} R           [outer radius]
     * @param  {Number} r           [inner radius]
     */
    _describeDonutRing: function _describeDonutRing(x, y, r, R) {
        var y1 = y + R;
        var y2 = y + r;
        var path = 'M' + x + ' ' + y1 + 'A' + R + ' ' + R + ' 0 1 1 ' + (x + 0.001) + ' ' + y1; // Outer circle
        path += 'M' + x + ' ' + y2 + 'A' + r + ' ' + r + ' 0 1 0 ' + (x - 0.001) + ' ' + y2; // Inner Circle
        return path;
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
    _describeDonut: function _describeDonut(x, y, outerRadius, innerRadius, startAngle, endAngle) {
        // A temporary fix for working with a stroke that is 360
        if (startAngle == 0 && endAngle == 360) {
            startAngle = 1;
        };

        var outerArc = {
            start: this._polarToCartesian(x, y, outerRadius, endAngle),
            end: this._polarToCartesian(x, y, outerRadius, startAngle)
        };
        var innerArc = {
            start: this._polarToCartesian(x, y, innerRadius, endAngle),
            end: this._polarToCartesian(x, y, innerRadius, startAngle)
        };
        var arcSweep = endAngle - startAngle <= 180 ? '0' : '1';

        return ['M', outerArc.start.x, outerArc.start.y, 'A', outerRadius, outerRadius, 0, arcSweep, 0, outerArc.end.x, outerArc.end.y, 'L', innerArc.end.x, innerArc.end.y, 'A', innerRadius, innerRadius, 0, arcSweep, 1, innerArc.start.x, innerArc.start.y, 'L', outerArc.start.x, outerArc.start.y, 'Z'].join(' ');
    }
});