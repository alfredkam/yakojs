module.exports = {
    // Extends default getRatio in lib/base/common.js
    _getRatio: function (scale) {
      var self = this;

      scale.pHeight = scale.height - scale.paddingTop - scale.paddingBottom;
      scale.pWidth = scale.width - scale.paddingLeft - scale.paddingRight;
      scale.heightRatio = scale.pHeight / scale.max;

      // Need to calculate a tickSize relative to time & tickSize
      // Should expect a start and end time
      scale.tickSize = self._sigFigs((scale.pWidth / (scale.len - 1)),8);
    },
    // Describes an open path
    _describeAttributeD: function (numArr, paddingLeft, paddingTop, scale) {
      var height = scale.height;
      var heightRatio = scale.heightRatio;
      var tickSize = scale.tickSize;
      var pathToken = '';

      // Path generator
      for (var i = 0; i < numArr.length; i++) {
          if (i === 0) {
            // X Y
              pathToken += 'M ' + paddingLeft + ' '+ (height - (numArr[i] * heightRatio) - paddingTop);
          } else {
              pathToken += ' L '+ ((tickSize * i) + paddingLeft) + ' ' + (height - (numArr[i] * heightRatio) - paddingTop);
          }
      }
      // Eliminates the error calls when attributiting this to the svg path
      if (pathToken === '') {
        pathToken = 'M 0 0';
      }
      return pathToken;
    },
    // Describes the path to close the open path
    _describeCloseAttributeD: function (numArr, paddingLeft, paddingTop, scale) {
      var height = scale.height;
      var heightRatio = scale.heightRatio;
      return [
              'V',(height - paddingTop),
              'H', paddingLeft,
              'L', paddingLeft,
              (height - (numArr[0] * heightRatio) - paddingTop)
            ].join(" ");
    },
    // Describes scattered graph
    _describeScatteredGraph: function(data, numArr, paddingLeft, paddingTop, scale, ref) {
      var height = scale.height;
      var heightRatio = scale.heightRatio;
      var self = this;
      var tickSize = scale.tickSize;
      var scattered = data.scattered || 0;
      var strokeWidth = scattered.strokeWidth || 3;
      var strokeColor = scattered.strokeColor || self._randomColor();
      var radius = scattered.radius || 2;
      var fill = scattered.fill || 'white';
      var paths = [];
      ref = ref || 0;

      for (var i = 0; i < numArr.length; i++) {
        paths.push(self.make('circle', {
          cx: ((tickSize * i) + paddingLeft),
          cy: (height - (numArr[i] * heightRatio) - paddingTop),
          r: radius,
          stroke: strokeColor,
          'stroke-width': strokeWidth,
          fill: 'white'
        }, {
          _ref : ref
        }));
      }
      return paths;
    },
};