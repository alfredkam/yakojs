var Base = require('./default');
var arc = require('../svg/arc');

module.exports = Base.extend({

    // Parent generator that manages the svg
    _startCycle: function _startCycle() {
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;

        return self._lifeCycleManager(data, chart, function (scale) {
            return self._describePath(scale.outerRadius, scale.relativeDataSet, scale);
        });
    },

    // Extends _defineBaseScaleProperties in lib/base/common.js
    _defineBaseScaleProperties: function _defineBaseScaleProperties(data, chart) {
        var self = this;
        var total = self._sumOfData(data);
        var scale = {
            total: total,
            // Converts nums to relative => total sum equals 1
            relativeDataSet: self._dataSetRelativeToTotal(data, total),
            // Find the max width & height
            outerRadius: chart.outerRadius || (chart.height < chart.width ? chart.height : chart.width) / 2
        };

        self._extend(scale, chart);
        return scale;
    },

    _polarToCartesian: arc.polarToCartesian,

    _describeArc: arc.describeArc,

    _describePie: arc.describePie,

    /**
     * [_describePath super class]
     * @return {[type]} [empty string]
     */
    _describePath: function _describePath() {
        return '';
    }
});