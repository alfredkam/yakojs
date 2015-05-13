function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// time series / object base

var _classesDefault = require('../classes/default');

var _classesDefault2 = _interopRequireDefault(_classesDefault);

var _bubbleApi = require('./bubble.api');

var _bubbleApi2 = _interopRequireDefault(_bubbleApi);

module.exports = _classesDefault2['default'].extend({

    componentName: 'bubble.point',

    // Start of a life cyle
    _startCycle: function _startCycle() {
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;
        var render = self.postRender;
        var paths = '';
        var scale;

        chart.type = 'bubble-point';
        chart.complex = true;
        chart.parentType = 'bubble';

        // sort data
        var ascByDate = function ascByDate(a, b) {
            return a.date - b.date;
        };
        data.sort(ascByDate);

        return self._lifeCycleManager(data, chart, function (newScale) {
            paths = self._describeBubble(data, chart.height, chart.width, newScale);
            paths.unshift(self._describeXAxis(chart.height, chart.width, newScale));
            return paths;
        });
    },

    // Extends default ratio w/ auto scaling
    _getRatio: _bubbleApi2['default'].getRatioByTimeSeries,

    // Describes the xAxis for bubble point graph
    _describeXAxis: _bubbleApi2['default'].describeXAxisForBubbleLine,

    // Describes bubble point graph
    _describeBubble: _bubbleApi2['default'].describeLineByObject
});