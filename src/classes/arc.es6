import Default from './default';
import arc from '../svg/arc';

export default class Arc extends Default {

    // Parent generator that manages the svg
    _startCycle (){
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;

        return self._lifeCycleManager(data, chart, function (scale) {
            return self._describePath(scale.outerRadius, scale.relativeDataSet, scale);
        });
    }

    // Extends _defineBaseScaleProperties in lib/base/common.js
    _defineBaseScaleProperties (data, chart) {
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
    }

    _polarToCartesian () {
        return arc.polarToCartesian.apply(this, arguments);
    }

    _describeArc () {
        return arc.describeArc.apply(this, arguments);
    }

    _describePie () {
        return arc.describePie.apply(this, arguments);
    }

    /**
     * [_describePath super class]
     * @return {[type]} [empty string]
     */
    _describePath () {
        return '';
    }
}
