var Base = require('./base/default');
var Label = require('./utils/label');
var label = new Label();
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

    for(var i in opts.data) {
        opts.data[i].label = (opts.data[i].label || '').replace(/\s/g,'-');
    }

    return self.render(self._prepare()
    ._generate());
  },
  // set default value if they are missing
  _prepare: function () {
    var defaults = {
      chart: {
          width: '100',
          height: '200',
          'font-family' : '"Open Sans", sans-serif',
          line: true,
          scattered: false
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
  _generate: function () {
    var self = this;
    var data = self.attributes.data;
    var opts = self.attributes.opts;
    var chart = opts.chart;
    var svg = self.make('svg',{
            width: chart.width,
            height: chart.height,
            viewBox: '0 0 ' + chart.width + ' ' + chart.height
        });
    // For paddings
    var paddingX = 0;
    var paddingY = 5;
    var xAxis = opts.xAxis;
    var yAxis = opts.yAxis;
    var append = self.append;

    if (Object.prototype.toString.call(data) !== '[object Array]') {
        data = [data];
    }

    var scale = self._scale(data, opts);
    self._extend(scale, chart);
 
    // simple hnadOff
    // TODO:: fix the paddingX & Y dependecies
    if (yAxis || xAxis) {
      paddingX = !opts.yAxis ? 0 : 30;
      paddingY = 20;
      scale.pHeight = (chart.height - (paddingY * 2));
      scale.paddingY = paddingY;
      scale.paddingX = paddingX;
    }

    if (yAxis) {
      svg = append(svg, label.describeYAxis(scale, yAxis));
      // TODO:: this needs to be adjusted
      paddingX += 5;
    }

    scale.heightRatio = (chart.height - (paddingY * 2)) / scale.max;
    scale.gap = self._sigFigs(((chart.width - paddingX * 2) / (scale.len - 1)),8);
    // xAxis depends on scale.gap
    if (xAxis) {
      svg = append(svg, label.describeXAxis(scale, xAxis));
    }
    
    // adding each path & circle
    for (var x = 0; x < scale.rows; x++) {
      if (yAxis && yAxis.multi) {
        scale.heightRatio = (chart.height - (paddingY * 2)) / scale.max[x];
      }
        var g = self.make('g',{},{
            label: data[x].label
        });
        svg = append(
          svg,
          append(g, self._describePath(data[x], paddingX, paddingY, scale))
        );
    }
    // add to element;
    return append(self.element, svg);
  },
  // describes an open path
  _describeAttributeD: function (numArr, paddingX, paddingY, scale) {
    var height = scale.height;
    var heightRatio = scale.heightRatio;
    var gap = scale.gap;
    var pathToken = '';
    //path generator
    for (var i = 0; i < numArr.length; i++) {
        if (i === 0) {
          // X Y
            pathToken += 'M ' + paddingX + ' '+ (height - (numArr[i] * heightRatio) - paddingY);
        } else {
            pathToken += ' L '+ ((gap * i) + paddingX) + ' ' + (height - (numArr[i] * heightRatio) - paddingY);
        }
    }
    // eliminates the error calls when attributiting this to the svg path
    if (pathToken === '') {
      pathToken = 'M 0 0';
    }
    return pathToken;
  },
  // describes the path to close the open path
  _describeCloseAttributeD: function (numArr, paddingX, paddingY, scale) {
    var height = scale.height;
    var heightRatio = scale.heightRatio;
    return [
            'V',(height - paddingY),
            'H', paddingX,
            'L', paddingX, (height - (numArr[0] * heightRatio) - paddingY)
          ].join(" ");
  },
  // describes scattered graph
  _describeScatteredGraph: function(data, numArr, paddingX, paddingY, scale) {
    var height = scale.height;
    var heightRatio = scale.heightRatio;
    var self = this;
    var gap = scale.gap;
    var scattered = data.scattered || 0;
    var strokeWidth = scattered.strokeWidth || 3;
    var strokeColor = scattered.strokeColor || self._randomColor();
    var radius = scattered.radius || 2;
    var fill = scattered.fill || 'white';
    var paths = [];

    for (var i = 0; i < numArr.length; i++) {
      paths.push(self.make('circle', {
        cx: ((gap * i) + paddingX),
        cy: (height - (numArr[i] * heightRatio) - paddingY),
        r: radius,
        stroke: strokeColor,
        'stroke-width': strokeWidth,
        fill: 'white'
      }));
    }
    return paths;
  },
  //svg path builder
  _describePath : function (data, paddingX, paddingY, scale) {
    var self = this;
    var pathToken = self._describeAttributeD(data.data, paddingX, paddingY, scale);
    var pathNode = self.make('path',{
        d: pathToken,
        stroke: data.strokeColor || self._randomColor(),
        'stroke-width': data.strokeWidth || '3',
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        'class': '_yakoTransitions-' + data.label,
        fill: 'none'
    });

    return [
      scale.line ? pathNode : '',
      scale.line && data.fill ? self.make('path', {
        d: pathToken + self._describeCloseAttributeD(data.data, paddingX, paddingY, scale),
        stroke: 'none',
        'stroke-width': '2',
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        'class': '_yakoTransitions-' + data.label,
        fill: data.fill
      }) : ''
    ].concat(scale.scattered ?
        self._describeScatteredGraph(data, data.data, paddingX, paddingY, scale) :
        []);
  }
});