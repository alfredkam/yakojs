var Base = require('./base/default');
var Error = require('./utils/error');
var spark = module.exports = Base.extend({
  // the graph data & options setter
  attr: function (opts) {
    opts = opts || {};
    // to deal with no data fed in
    if (opts && (!opts.data || opts.data.length === 0)) {
        opts.data = undefined;
    }
    // make sure the data will not cause memory reference error, if some sets of data a shared among other graphs
    var self = this;
    self.attributes.data = opts.data || 0;
    self.attributes.opts = opts;

    return self.postRender(self._prepare()
    ._startCycle());
  },
  // set default value if they are missing
  _prepare: function () {
    var defaults = {
      chart: {
          width: '100',
          height: '200',
          'font-family' : '"Open Sans", sans-serif',
          line: true,
          fill: true,
          scattered: false,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0
      },
      // 
      showNodes: false,
      // reservered for labels
      data : []
    };
    this._extend(defaults, this.attributes.opts);
    this.attributes.opts = defaults;
    return this;
  },
  /**
   * the parent generator that manages the svg generation
   * @return {object} global function object 
   */
  _startCycle: function () {
    var self = this;
    var data = self.attributes.data;
    var opts = self.attributes.opts;
    var chart = opts.chart;
    var xAxis = chart.xAxis || opts.xAxis;
    var yAxis = chart.yAxis || opts.yAxis;
    var append = self.append;
    var svg;
    var paths = [];

    if (!self._isArray(data)) {
      data = [data];
    }

    var scale = self._scale(data, opts);
    self._extend(scale, chart);

    if (yAxis || xAxis) {
      self._getLabelConfig(scale, yAxis, xAxis);
      if (!self.describeYAxis) {
        Error.label();
      }
    }

    scale.pHeight = scale.height - scale.paddingTop - scale.paddingBottom;
    scale.pWidth = scale.width - scale.paddingLeft - scale.paddingRight;
    scale.heightRatio = scale.pHeight / scale.max;
    scale.tickSize = self._sigFigs((scale.pWidth / (scale.len - 1)),8);

    paths = self._lifeCycleManager(scale, function (newScale) {
        svg = self.make('svg',{
            width: chart.width,
            height: chart.height,
            viewBox: '0 0 ' + chart.width + ' ' + chart.height
        });
        for (var x = 0; x < scale.rows; x++) {
            if (yAxis && yAxis.multi) {
              scale.heightRatio = scale.pHeight / scale.max[x];
            }
            var g = self.make('g');
            // pass in a ref for event look up, here `ref` is x
            paths.push(
              append(g, self._describePath(data[x], scale.paddingLeft, scale.paddingTop, scale, x))
            );
        }
        return paths;
    });
    return append(self.element,append(svg, paths));
  },
  // describes an open path
  _describeAttributeD: function (numArr, paddingLeft, paddingTop, scale) {
    var height = scale.height;
    var heightRatio = scale.heightRatio;
    var tickSize = scale.tickSize;
    var pathToken = '';

    //path generator
    for (var i = 0; i < numArr.length; i++) {
      // console.log( height, numArr[i], heightRatio, paddingTop);
        if (i === 0) {
          // X Y
            pathToken += 'M ' + paddingLeft + ' '+ (height - (numArr[i] * heightRatio) - paddingTop);
        } else {
            pathToken += ' L '+ ((tickSize * i) + paddingLeft) + ' ' + (height - (numArr[i] * heightRatio) - paddingTop);
        }
    }
    // eliminates the error calls when attributiting this to the svg path
    if (pathToken === '') {
      pathToken = 'M 0 0';
    }
    return pathToken;
  },
  // describes the path to close the open path
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
  // describes scattered graph
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
  //svg path builder
  _describePath : function (data, paddingLeft, paddingTop, scale, ref) {
    ref = ref || 0;
    var self = this;
    var pathToken = self._describeAttributeD(data.data, paddingLeft, paddingTop, scale);
    var pathNode = self.make('path',{
        d: pathToken,
        stroke: data.strokeColor || self._randomColor(),
        'stroke-width': data.strokeWidth || '3',
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        fill: 'none'
    },{
        _ref: ref
    });
    var paths = [];

    if (data.fill && scale.fill) {
      paths.push(self.make('path', {
        d: pathToken + self._describeCloseAttributeD(data.data, paddingLeft, paddingTop, scale),
        stroke: 'none',
        'stroke-width': '2',
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        fill: data.fill,
      },{
        _ref: ref
      }));
    }
    if (scale.line) {
      paths.push(pathNode);
    }
    if (scale.scattered) {
      paths.push(self._describeScatteredGraph(data, data.data, paddingLeft, paddingTop, scale, ref));
    }
    return paths;
  }
});