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

        for (var i = 0; i < data.length; i++) {
            var endAngle = startAngle + 360 * data[i];
            paths.push(this.make('path', {
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                stroke: strokes[i] || (chart.strokeColor || this._randomColor()),
                d: this._describePie(centerX, centerY, radius, startAngle, endAngle),
                fill: fills[i] || this._randomColor()
            }));
            startAngle = endAngle;
        }
        return paths;
    }
});