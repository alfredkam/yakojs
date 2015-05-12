// Describes scattered graph
var api = module.exports = {
  describeScatter: function describeScatter(data, numArr, paddingLeft, paddingTop, scale, ref) {
    var height = scale.height;
    var heightRatio = scale.heightRatio;
    var self = this;
    var tickSize = scale.tickSize;
    var scattered = data.scattered || 0;
    var strokeWidth = scattered.strokeWidth || 2;
    var strokeColor = scattered.strokeColor || self._randomColor();
    var radius = scattered.radius || 2;
    var fill = scattered.fill || 'white';
    var paths = [];
    ref = ref || 0;

    for (var i = 0; i < numArr.length; i++) {
      paths.push(self.make('circle', {
        cx: i === 0 ? i + scale.innerPadding + paddingLeft : tickSize * i + paddingLeft,
        cy: height - numArr[i] * heightRatio - paddingTop - scale.innerPaddingTop,
        r: radius,
        stroke: strokeColor,
        'stroke-width': strokeWidth,
        fill: fill
      }, {
        _ref: ref
      }));
    }
    return paths;
  }
};