// Supports time series & object base
import Default from '../classes/default';
import api from './bubble.api';

export default class BubblePoint extends Default {

    get componentName() {
        return 'bubble.point';
    }

    // Start of a life cyle
    _startCycle () {
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;
        var paths = '';

        // Sort the data by date
        if (chart.autoFit != false) {
            var ascByDate = function (a,b) { return a.date - b.date;};
            data.sort(ascByDate);
        }

        return self._lifeCycleManager(data, chart, function (newScale) {
            paths = self._describeBubble(data, chart.height, chart.width, newScale);
            paths.unshift(self._describeXAxis(chart.height, chart.width, newScale));
            return paths;
        });
    }

    // Extends default ratio w/ auto scaling
    _getRatio (...args) {
        return api.getRatioByTimeSeries(...args);
    }

    // Describes the xAxis for bubble point graph
    _describeXAxis (...args) {
        return api.describeXAxisForBubbleLine(...args);
    }

    // Describes bubble point graph
    _describeBubble (...args){
        return api.describeBubbleLineByObject(...args);
    }
}
