var Common = require('../base/common');

var label = module.exports = Common.extend({
    // expect the boundaries
    describe: function (minMax, chart) {

    },
    describeBorder: function () {

    },
    describeLabel: function () {

    },
    describeYAxis: function (range, opts) {
        var self = this;
        var axis = [];
        var labels = [];
        var yAxis = range.yAxis.length - 1;

        // goes through the number of yaxis need
        while (yAxis--) {
            var g = self.make('g');
            var splits = range.yAxis[i].splits;
            var heightFactor = heightRatio / splits;
            var paddingX = range.yAxis[i].paddingX;
            // building the yaxis
            while(splits--) {
                labels.push(self.make('text',{
                    y: range.yAxis[i].paddingY,
                    x: paddingX + (heightFactor * splits),
                    'font-size': 12,
                    'font-family': opts.fontFamily,
                    'text-anchor': iteration % 2 === 0 ? 'end' : 'start',
                    fill: opts.color || '#333'
                }));
            }
            // building the border
            lables.push(self.make('path',{
              'd' : 'M' + paddingX + ' 0L' + paddingX + ' ' + range.maxHeight,
              'stroke-width': '1',
              'stroke': '#c0c0c0',
              'fill': 'none',
              'opacity': '1',
              'stroke-linecap': 'round'
            }));
            axis.push(self.append(g, labels));
        }
        return axis;
    },
    _utcMultiplier: function(tick) {
        var mili = 1000,
            s = 60,
            m = 60,
            h = 24,
            D = 30,
            M = 12,
            Y = 1,
            multiplier = 0;
        if (/s$/.test(tick))
            multiplier = mili;
        else if (/m$/.test(tick))
            multiplier = s * mili;
        else if (/h$/.test(tick))
            multiplier = s * m * mili;
        else if (/D$/.test(tick))
            multiplier = s * m * h * mili;
        else if (/M$/.test(tick))
            multiplier = s * m * h * D * mili;
        else if (/Y$/.test(tick))
            multiplier = s * m * h * D * M * mili;

        return multiplier;
    },
    //computes and distributes the label
    _labelAndBorders: function (data, opts, interval, heightRatio, range, padding, multi) {
        if (!opts._shift) return null;
        var self = this,
            height = opts.chart.height - 25,
            arr = [];

        if (multi) {
            for (var i in range) {
                arr = arr.concat(self._makeYAxis(opts, height, {max: range[i].max, min: range[i].min, splits: range[0].splits} , padding, multi, i, range.length, data[i].color, data[i].label));
            }
        } else {
            arr = arr.concat(self._makeYAxis(opts, height, range, padding, multi));
        }

        //xAxis
        //Accepted xAxis - [1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
        var len = data[0].data.length,
            tick = opts.xAxis.interval,
            gLabelXaxis = self.make('g', {
              'class': 'xaxis'
            }),
            formatSpec = '',
            format = {
                tickInterval: (/\d+/.test(tick) ? tick.match(/\d+/)[0] : 1)
            },
            mili = 1000,
            s = 60,
            m = 60,
            h = 24,
            D = 30,
            M = 12,
            Y = 1,
            label = opts.xAxis.dateTimeLabelFormat;

        //what to do if the interval and format dont match
        //eg: given 1D interval and its requesting a format of per hour
        //should it be a straight line for that period ?
        if (opts.xAxis.format === 'dateTime') {
            //to get the UTC time stamp multiplexer
            format.utc = self._utcMultiplier(tick);

            //figures out the tick size
            if (
                (/ss/.test(label) && /s$/.test(tick))
                || (/mm/.test(label) && /m$/.test(tick))
                || (/hh/.test(label) && /h$/.test(tick))
                || (/DD/.test(label) && /D$/.test(tick))
                || (/MM/.test(label) && /M$/.test(tick))
                || (/YY/.test(label) && /Y$/.test(tick))
                )
            {
                format.tickSize = 1;
            } else if (
                (/mm/.test(label) && /s$/.test(tick))
                || (/hh/.test(label) && /m$/.test(tick))
            ) {
                format.tickSize = s; //m
            } else if (
                /hh/.test(label) && /s$/.test(tick)
            ) {
                format.tickSize = s * m;
            } else if (
                /DD/.test(label)
            ) {
                if (/s$/.test(tick))
                    format.tickSize = s * m * h;
                if (/m$/.test(tick))
                    format.tickSize = m * h;
                if (/h$/.test(tick))
                    format.tickSize = h;
            } else if (
                /MM/.test(label)
            ) {
                if (/s$/.test(tick))
                    format.tickSize = s * m * h * D;
                if (/m$/.test(tick))
                    format.tickSize = m * h * D;
                if (/h$/.test(tick))
                    format.tickSize = h * D;
                if (/D$/.test(tick))
                    format.tickSize = D;
            } else if (
                /YY/.test(label)
            ) {
                if (/s$/.test(tick))
                    format.tickSize = s * m * h * D * M;
                if (/m$/.test(tick))
                    format.tickSize = m * h * D * M;
                if (/h$/.test(tick))
                    format.tickSize = h * D * M;
                if(/YY/.test(label) && /D$/.test(tick))
                    format.tickSize = D * M;
                if (/M$/.test(tick))
                    format.tickSize = M;
            } else {
                throw 'Error: Incorrect Label Format';
            }

            //self part not re-render the labels but adding in new document objects
            var i = 0,
                counter = 0,
                tickIntervalArray = [];
            while (len--) {
                counter++;
                if (format.tickSize*format.tickInterval === counter || i === 0) {
                    tickIntervalArray.push(i);
                    var x = self.make('text',{
                        //plus 20 is for padding
                        y: height + 20,
                        x: (multi? padding*Math.ceil(range.length/ 2 ):padding) + interval * i,
                        'font-size': 10,
                        'font-family': opts.chart['font-family']
                    },{
                        tickPos : i
                    });
                    x.textContent = self._formatTimeStamp(opts, opts.xAxis.minUTC+ parseInt(((i+opts._shiftIntervals)) * format.utc));
                    self._append(gLabelXaxis, x);
                    if (i !== 0 || format.tickSize === counter)
                        counter = 0;
                }
                i++;
            }
            arr.push(gLabelXaxis);
            self.attributes._lastTickPos = tickIntervalArray[tickIntervalArray.length-1];
            self.attributes._tickGap = tickIntervalArray[1];
            self.attributes._tickGapCircuit = 0;
        }
        return arr;
    }
});

// self snippet is for label formet, preserve self snippet for now
// if (opts.xAxis.format) {
//     if (opts.xAxis.format === 'dateTime') {
//         // should throw warning
//         if (multi) {
//             interval = (opts.chart.width-(40*sets.length)) / (range[0].len-1);
//             heightRatio = [];
//             for (var i in range) {
//                 heightRatio.push((opts.chart.height-25.5) / (range[i].max));
//             }
//         } else {
//             interval = (opts.chart.width-40) / (range.len-1);    //self part adjust the interval base on the width offset;
//             heightRatio = (opts.chart.height-25.5) / (max);
//         }
       
//         opts._shift = true;
//     }
// }

// TODO:: Move re-render to a seperate module
// we are now adding on to exisiting data and to allow animation
// NOTE:: We will not do MULTIPLE AXIS for real time data
// if (reRender) {
//     self._reRenderLabelAndBorders(data, opts, interval, heightRatio, min, max, splits, paddingForLabel, true);
//     var nodes = self._getNode(self.element, null, 'path');
//     for (var i in data) {
//         self._reRenderPath(nodes, data[i], opts, interval, heightRatio, paddingForLabel, self.attributes.oldData[i]);
//     }
//     yako.startCycle(self.token, function (){
//         //complete
//     });
//     return self;
// }
