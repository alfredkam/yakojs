var Common = require('../base/common');

var label = module.exports = Common.extend({
    // expect the boundaries
    describe: function (minMax, chart) {

    },
    describeBorder: function () {

    },
    describeLabel: function () {

    },
    describeYAxis: function (scale, opts) {
        var self = this;
        var axis = [];
        var labels = [];
        var y = scale.rows;
        if (!opts.multi) {
            y = 1;
            scale.ySecs = [scale.ySecs];
            scale.max = [scale.max];
        }
        var partialHeight = scale.pHeight;
        var paddingY = scale.paddingY;
        var paddingX = scale.paddingX;

        // goes through the number of yaxis need
        while (y--) {
            var g = self.make('g');
            var splits = fSplits = parseInt(scale.ySecs[y]);
            var heightFactor = partialHeight / splits;
            var xCord = (y % 2 === 0 ? scale.width - (y + 1) * paddingX : y * paddingX);

            labels = [];
            splits += 1;
            while(splits--) {
                labels.push(self.make('text',{
                    y: paddingY + (heightFactor * splits),
                    x: xCord,
                    'font-size': 12,
                    'text-anchor': y % 2 === 0 ? 'start' : 'end',
                    fill: opts.color || '#333',
                }, null, scale.max[y] / fSplits * (fSplits - splits)));
            }
            // building the border
            // TODO:: this needs to dynamic!
            xCord = (y % 2 === 0) ? xCord - 5 : xCord + 5;
            labels.push(self.make('path',{
              'd' : 'M' + xCord + ' 0L' + xCord + ' ' + (partialHeight + paddingY),
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
    // TODO::  support custom format
    // for simplicity lets only consider dateTime format atm
    describeXAxis: function (scale, opts) {
        var self = this;
        var g = self.make('g', {
          'class': 'xaxis'
        });
        var labels = [];
        var partialHeight = scale.pHeight;
        var gap = scale.gap;
        var paddingX = scale.paddingX;
        var paddingY = scale.paddingY * 2  - 8;
        var yAxis = partialHeight + paddingY;
     
        if (opts.format === 'dateTime') {
            //to get the UTC time stamp multiplexer
            var tick = opts.interval;
            var utc = self._utcMultiplier(opts.interval);
            var tickInterval =  (/\d+/.test(tick) ? tick.match(/\d+/)[0] : 1);
            var format = opts.dateTimeLabelFormat;
            var base = opts.minUTC;
        }

        for (var i = 1; i < scale.len - 1; i++) {
            labels.push(self.make('text',{
                y: yAxis,
                x: (gap * i) + paddingX,
                'font-size': 12,
                'text-anchor': 'start',
                fill: opts.color || '#333',
            }, null, self._formatTimeStamp(format, base + (utc * i))));
        }

        labels.push(self.make('path',{
          'd' : 'M' + (paddingX  * 2) + ' ' + (yAxis - 12) + ' L' + (scale.width - paddingX*2) + ' ' + (yAxis - 12),
          'stroke-width': '1',
          'stroke': '#c0c0c0',
          'fill': 'none',
          'opacity': '1',
          'stroke-linecap': 'round'
        }));

        return [self.append(g, labels)];
    },
    _utcMultiplier: function(tick) {
        var mili = 1e3,
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
    //formats the time stamp
    _formatTimeStamp: function (format, time) {
        var dateObj = new Date(time),
            str = format,
            flag = false;

        if (/YYYY/.test(str))
            str = str.replace('YYYY',dateObj.getFullYear());
        else if (/YY/.test(str))
            str = str.replace('YY',(dateObj.getFullYear()).replace(/^\d{1,2}/,''));

        if (/hh/.test(str) && /ap/.test(str)) {
          if ((dateObj.getHours())  > 11)
            str = str.replace(/hh/, (dateObj.getHours() - 12 === 0 ? 12 : dateObj.getHours() - 12))
                    .replace(/ap/, 'pm');
          else
            str = str.replace(/hh/, (dateObj.getHours() == 0? 12 :  dateObj.getHours()))
                    .replace(/ap/,'am');
        } else
          str = str.replace(/hh/, (dateObj.getHours() == 0? 12 :  dateObj.getHours()))

        str = str.replace(/MM/,dateObj.getMonth()+1)
            .replace(/DD/, dateObj.getDate());

        if (/mm/.test(str) && /ss/.test(str)) {
            str = str.replace(/mm/,(dateObj.getMinutes().toString().length == 1 ? '0'+dateObj.getMinutes(): dateObj.getMinutes()))
            .replace(/ss/,(dateObj.getSeconds().toString().length == 1 ? '0'+dateObj.getSeconds(): dateObj.getSeconds()));
        } else {
            str = str.replace(/mm/,dateObj.getMinutes())
            .replace(/ss/,dateObj.getSeconds());
        } 
        return str;
    }
});
