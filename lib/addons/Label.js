var label = module.exports = {

    // Applies the label prior to the graph is generate
    preRender: function preRender(immutableScale) {
        var self = this;
        var opts = self.attributes.opts;
        var chart = opts.chart;
        var xAxis = chart.xAxis || opts.xAxis;
        var yAxis = chart.yAxis || opts.yAxis;
        var paths = [];
        // simple hnadOff
        if (yAxis) {
            paths.push(self.describeYAxis(immutableScale, yAxis));
        }
        // xAxis depends on scale.tickSize
        if (xAxis) {
            paths.push(self.describeXAxis(immutableScale, xAxis));
        }
        return {
            prepend: paths
        };
    },

    // Applies the external props to scale
    // TODO:: Allow proper padding adjustment for single / multi axis
    _getExternalProps: function _getExternalProps(scale, yAxis, xAxis) {
        var self = this;
        if (yAxis) {
            scale.paddingLeft = scale.paddingRight = 30;
        }

        if (xAxis) {
            scale.paddingTop = scale.paddingBottom = 20;
        }
        if (!scale.pHeight && yAxis) {
            scale.pHeight = scale.height - scale.paddingTop - scale.paddingBottom;
        }
        if (!scale.pWidth && xAxis) {
            scale.pWidth = scale.width - scale.paddingLeft - scale.paddingRight;
        }
        if (scale.type == 'bar') {
            scale.tickSize = scale.pWidth / scale.len;
        }

        if (scale.type == 'bubble-scattered') {
            var len = xAxis.labels ? xAxis.labels.length : 2;
            scale.tickSize = scale.pWidth / len;
            scale.prefLen = len;
            if (!xAxis.labels) {
                console.warn('Attempting to use labels with `bubble graph` type:scattered, without defining custom labels');
            }
        }
    },

    // TODO:: Support custom targets
    // Describes the lable for y axis
    describeYAxis: function describeYAxis(scale, opts) {
        var self = this;
        var axis = [];
        var labels = [];
        var y = rows = scale.rows;
        var max = scale.max;
        var ySegments = scale.ySecs;
        opts = opts || {};
        if (scale.type == 'bubble-scattered') {
            max = [max[1]];
        }
        if (!opts.hasOwnProperty('multi') || !opts.multi) {
            y = rows = 1;
            if (!(max instanceof Array || max instanceof Object)) {
                max = [max];
            }
            ySegments = [ySegments];
        }
        var partialHeight = scale.pHeight;
        var paddingY = scale.paddingY || scale.paddingTop;
        var paddingX = scale.paddingX || scale.paddingLeft - 5;

        // Goes through the number of yaxis need
        while (y--) {
            var g = self.make('g');
            var splits = fSplits = ySegments[y];
            var heightFactor = partialHeight / splits;
            var xCord = (y + 1) % 2 === 0 ? scale.width - y * paddingX : (y + 1) * paddingX;
            labels = [];
            splits += 1;
            while (splits--) {
                labels.push(self.make('text', {
                    y: paddingY + heightFactor * splits,
                    x: xCord,
                    'font-size': opts.fontSize || 12,
                    'text-anchor': (y + 1) % 2 === 0 ? 'start' : 'end',
                    fill: opts.color || '#333' }, null, max[y] / fSplits * (fSplits - splits)));
            }

            // building the border
            xCord = (y + 1) % 2 === 0 ? xCord - 5 : xCord + 5;
            labels.push(self.make('path', {
                'd': 'M' + xCord + ' 0L' + xCord + ' ' + (partialHeight + paddingY),
                'stroke-width': '1',
                'stroke': opts.multi ? scale.color[y] : '#c0c0c0',
                'fill': 'none',
                'opacity': '1',
                'stroke-linecap': 'round'
            }));
            axis.push(self._append(g, labels));
        }
        return axis;
    },

    // TODO:: support custom format
    // Describes the label for x axis
    // For simplicity lets only consider dateTime format atm
    describeXAxis: function describeXAxis(scale, opts) {
        var self = this;
        var g = self.make('g');
        var labels = [];
        var partialHeight = scale.pHeight;
        var tickSize = scale.tickSize;
        var paddingX = scale.paddingX || scale.paddingLeft;
        var paddingY = scale.paddingY ? scale.paddingY * 2 - 8 : scale.paddingTop + scale.paddingBottom - 8;
        var yAxis = partialHeight + paddingY;
        var form = opts.format == 'dateTime' ? true : false;

        if (form) {
            // Get UTC time stamp multiplexer
            var tick = opts.interval;
            var utcMultiplier = self._utcMultiplier(opts.interval);
            var tickInterval = /\d+/.test(tick) ? tick.match(/\d+/)[0] : 1;
            var format = opts.dateTimeLabelFormat;
            var minUTC = opts.minUTC || scale.xAxis.minUTC;
        }

        var offset = 1;
        if (scale.type == 'bar' || !form) {
            offset = 0;
        }

        if (scale.type == 'timeSeries' && form) {
            // In timeSeries, the data is relatively to time and there are possiblities
            // a label should exist in spots where data does not exist.
            // The label for the time series will be relative to time.
            var tickSize = scale.tickSize;
            var maxUTC = scale.xAxis.maxUTC;
            var numberOfTicks = (maxUTC - minUTC) / utcMultiplier;

            for (var i = 0; i < numberOfTicks; i++) {
                var positionX = utcMultiplier * i * tickSize + paddingX;
                labels.push(self.make('text', {
                    y: yAxis,
                    x: positionX,
                    'font-size': opts.fontSize || 12,
                    'text-anchor': opts.textAnchor || 'middle',
                    fill: opts.color || '#333' }, null, form ? self._formatTimeStamp(format, minUTC + utcMultiplier * i) : opts.labels[i] || 0));
            }
        } else {
            // Non timeSeries
            for (var i = offset; i < (scale.prefLen || scale.len) - offset; i++) {
                labels.push(self.make('text', {
                    y: yAxis,
                    x: tickSize * i + paddingX + (scale.type == 'bar' ? tickSize / 4 : 0),
                    'font-size': opts.fontSize || 12,
                    'text-anchor': opts.textAnchor || (scale.type == 'bar' ? 'start' : 'middle'),
                    fill: opts.color || '#333' }, null, form ? self._formatTimeStamp(format, minUTC + utcMultiplier * i) : opts.labels[i] || 0));
            }
        }

        labels.push(self.make('path', {
            'd': 'M' + scale.paddingLeft + ' ' + (yAxis - 12) + ' L' + (scale.width - scale.paddingRight) + ' ' + (yAxis - 12),
            'stroke-width': '1',
            'stroke': '#c0c0c0',
            'fill': 'none',
            'opacity': '1',
            'stroke-linecap': 'round'
        }));

        return [self._append(g, labels)];
    },

    // Determines the utc multiplier
    _utcMultiplier: function _utcMultiplier(tick) {
        var mili = 1000,
            s = 60,
            m = 60,
            h = 24,
            D = 30,
            M = 12,
            Y = 1,
            multiplier = 0;
        if (/s$/.test(tick)) multiplier = mili;else if (/m$/.test(tick)) multiplier = s * mili;else if (/h$/.test(tick)) multiplier = s * m * mili;else if (/D$/.test(tick)) multiplier = s * m * h * mili;else if (/M$/.test(tick)) multiplier = s * m * h * D * mili;else if (/Y$/.test(tick)) multiplier = s * m * h * D * M * mili;

        return multiplier;
    },

    // Formats the time stamp
    // TODO:: Create a template to speed up the computation
    _formatTimeStamp: function _formatTimeStamp(str, time) {
        var dateObj = new Date(time),
            flag = false;

        if (/YYYY/.test(str)) str = str.replace('YYYY', dateObj.getFullYear());else if (/YY/.test(str)) str = str.replace('YY', dateObj.getFullYear().toString().replace(/^\d{1,2}/, ''));

        if (/hh/.test(str) && /ap/.test(str)) {
            if (dateObj.getHours() > 11) str = str.replace(/hh/, dateObj.getHours() - 12 === 0 ? 12 : dateObj.getHours() - 12).replace(/ap/, 'pm');else str = str.replace(/hh/, dateObj.getHours() === 0 ? 12 : dateObj.getHours()).replace(/ap/, 'am');
        } else str = str.replace(/hh/, dateObj.getHours() === 0 ? 12 : dateObj.getHours());

        str = str.replace(/MM/, dateObj.getMonth() + 1).replace(/DD/, dateObj.getDate());

        if (/mm/.test(str) && /ss/.test(str)) {
            str = str.replace(/mm/, dateObj.getMinutes().toString().length == 1 ? '0' + dateObj.getMinutes() : dateObj.getMinutes()).replace(/ss/, dateObj.getSeconds().toString().length == 1 ? '0' + dateObj.getSeconds() : dateObj.getSeconds());
        } else {
            str = str.replace(/mm/, dateObj.getMinutes()).replace(/ss/, dateObj.getSeconds());
        }
        return str;
    }
};