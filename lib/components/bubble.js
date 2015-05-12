function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* Entry Points */

var _classesDefault = require('../classes/default');

var _classesDefault2 = _interopRequireDefault(_classesDefault);

var _bubbleApiEs6 = require('./bubble.api');

var _bubbleApiEs62 = _interopRequireDefault(_bubbleApiEs6);

module.exports = _classesDefault2['default'].extend({

    componentName: 'bubble',

    // Start of a life cyle
    _startCycle: function _startCycle() {
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;
        var render = self.postRender;
        var paths = '';
        var scale;

        if (chart.type == 'scattered') {
            chart.type = 'bubble-scattered';
            return self._lifeCycleManager(data, chart, function (newScale) {
                return self._describeBubbleChart(data, newScale);
            });
        } else {
            chart.type = 'bubble-point';
            return self._lifeCycleManager(data, chart, function (newScale) {
                paths = self._describeBubble(data, chart.height, chart.width, newScale);
                paths.unshift(self._describeXAxis(chart.height, chart.width, newScale));
                return paths;
            });
        }
    },

    // Extends default ratio w/ auto scaling
    _getRatio: _bubbleApiEs62['default'].getRatioByNumberArray,

    // Describes bubble scattered graph
    _describeBubbleChart: _bubbleApiEs62['default'].describeBubbleByNumberArray,

    // Describes the xAxis for bubble point graph
    _describeXAxis: _bubbleApiEs62['default'].describeXAxisForBubbleLine,

    // Describes bubble point graph
    _describeBubble: _bubbleApiEs62['default'].describeLineByNumberArray
});