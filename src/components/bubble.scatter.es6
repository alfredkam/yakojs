// Object base
import Default from '../classes/default';
import api from './bubble.api';

export default class BubbleScatter extends Default {

    get componentName() {
        return 'bubble.scatter';
    }

    _startCycle () {
        var self = this;
        var chart = self.attributes.opts.chart;
        var data = self.attributes.data;

        return self._lifeCycleManager(data, chart, function (newScale) {
            return self._describeBubbleChart(data, newScale);
        });
    }

    // Describes bubble scattered graph
    // Extends default ratio w/ auto scaling
    _getRatio (...args) {
        return api.getRatioByObject(...args);
    }

    _describeBubbleChart (...args) {
        return api.describeBubbleByObject(...args);
    }
}
