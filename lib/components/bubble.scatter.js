function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// time series / object base

var _classesDefault = require('../classes/default');

var _classesDefault2 = _interopRequireDefault(_classesDefault);

var _bubbleApi = require('./bubble.api');

var _bubbleApi2 = _interopRequireDefault(_bubbleApi);

module.exports = _classesDefault2['default'].extend({

    componentName: 'bubble.scatter',

    _startCycle: function _startCycle() {
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;
        var render = self.postRender;
        var paths = '';
        var scale;

        chart.type = 'bubble-scattered';
        chart.complex = true;
        chart.parentType = 'bubble';

        return self._lifeCycleManager(data, chart, function (newScale) {
            return self._describeBubbleChart(data, newScale);
        });
    },

    // Describes bubble scattered graph
    // Extends default ratio w/ auto scaling
    _getRatio: _bubbleApi2['default'].getRatioByObject,

    _describeBubbleChart: _bubbleApi2['default'].describeBubbleByObject
});