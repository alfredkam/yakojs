var arcBase = require('../classes/arc');
var pie = module.exports = arcBase.extend({

    componentName: 'pie',

    /**
     * [_describePath genereates the paths for each pie segment]
     * @param  {[int]}   radius         [circumfrance]
     * @param  {[array]} data           [data set]
     * @param  {[json]}  chart          [user specified chart options]
     * @return {[string]}               [the html string for the pie]
     */
    _describePath: function _describePath(radius, data, chart) {
        if (!data) return '';
        var paths = [];
        var startAngle = 0;
        var fills = chart.fills || 0;
        var strokes = chart.strokeColors || 0;
        var centerX = chart.width / 2;
        var centerY = chart.height / 2;
        var self = this;

        if (chart.total == 0) {
            return self.make('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                stroke: strokes[i] || (chart.strokeColor || self._randomColor()),
                fill: 'transparent',
                d: self._describeEmptyPie(centerX, centerY, radius)
            });
        }

        for (var i = 0; i < data.length; i++) {
            var endAngle = startAngle + 360 * data[i];
            paths.push(self.make('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                stroke: strokes[i] || (chart.strokeColor || self._randomColor()),
                d: self._describePie(centerX, centerY, radius, startAngle, endAngle),
                fill: fills[i] || self._randomColor()
            }));
            startAngle = endAngle;
        }
        return paths;
    },

    /**
     * [_describeEmptyPie describes a full pie using paths]
     * @param  {Number} x           [x cordinates]
     * @param  {Number} y           [y cordinates]
     * @param  {Number} R           [outer radius]
     */
    _describeEmptyPie: function _describeEmptyPie(x, y, R) {
        var y1 = y + R;
        var y2 = y + r;
        var path = 'M' + x + ' ' + y1 + 'A' + R + ' ' + R + ' 0 1 1 ' + (x + 0.001) + ' ' + y1; // Outer circle
        return path;
    } });