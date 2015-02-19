var Base = require('./base');
var spark = module.exports = Base.extend({
  // the graph data & options setter
  attr: function (opts) {
    opts = opts || {};
    // to deal with no data fed in
    if (opts && (!opts.data || opts.data.length === 0)) {
        opts.data = undefined;
    }
    // make sure the data will not cause memory reference error, if some sets of data a shared among other graphs
    this.attributes.data = opts.data || 0;
    this.attributes.opts = opts;

    for(var i in opts.data) {
        opts.data[i].label = (opts.data[i].label || '').replace(/\s/g,'-');
    }

    return this._prepare()
    ._generate();
  },
  // set default value if they are missing
  _prepare: function () {
    var defaults = {
      chart: {
          type: 'line',
          width: '100',
          height: '200',
          'font-family' : '"Open Sans", sans-serif'
      },
      // reservered for labels
      xAxis: {},
      yAxis: {},
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
    var data = this.attributes.data,
        opts = this.attributes.opts,
        chart = opts.chart,
        svg = this._make('svg',{
            width: opts.chart.width,
            height: opts.chart.height,
            viewBox: '0 0 '+opts.chart.width + ' '+opts.chart.height,
        }),
        self = this;
    // reserved for padding
    var paddingX = 0;
    var paddingY = 5;

    if (Object.prototype.toString.call(data) !== '[object Array]') {
        data = [data];
    }

    var scale = self._findMinMax(data);
    self._extend(opts._scale, scale);
    opts.heightRatio = (chart.height - (paddingY * 2)) / scale.max;
    // need to account for paddingX, when paddingX is included the math is off
    opts.gap = self._sigFigs((chart.width / (scale.len - 1)),8);
    
    // adding each path & circle
    for (var x = 0; x < data.length; x++) {
        var g = self._make('g',{},{
            label: data[x].label
        });
        svg = self._compile(svg,
          self._compile(g, self._describePath(data[x], paddingX, paddingY, opts))
          );
    }
    // add to element;
    var result = self._compile(self.element, svg);
    return (typeof result == 'string') ? result : self;
  },
  _describeAttributeD: function (numArr, paddingX, paddingY, opts) {
    var height = opts.chart.height;
    var heightRatio = opts.heightRatio;
    var gap = opts.gap;
    var pathToken = '';
    //path generator
    for (var i = 0; i < numArr.length; i++) {
        if (i === 0) {
          // X Y
            pathToken += 'M ' + paddingX + ' '+ (height - (numArr[i] * heightRatio) - paddingY);
        } else {
            pathToken += ' L '+((gap * i) + paddingX) + ' ' + (height - (numArr[i] * heightRatio) - paddingY);
        }
    }
    // eliminates the error calls when attributiting this to the svg path
    if (pathToken === '') {
      pathToken = 'M 0 0';
    }
    return pathToken;
  },
  // describe the close case for the path
  _describeCloseAttributeD: function (numArry, paddingX, paddingY, opts) {
    var height = opts.chart.height;
    var heightRatio = opts.heightRatio;
    return [
            'V',(height - paddingY),
            'H', paddingX,
            'L', paddingX, (height - (numArry[0] * heightRatio) - paddingY)
          ].join(" ");
  },
  //svg path builder
  _describePath : function (data, paddingX, paddingY, opts) {
    var self = this;
    var pathToken = self._describeAttributeD(data.data, paddingX, paddingY, opts);
    var pathNode = self._make('path',{
        d: pathToken,
        stroke: data.strokeColor || self._randomColor(),
        'stroke-width': data.strokeWidth || '5',
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        'class': '_yakoTransitions-' + data.label,
        fill: 'none'
    });

    if (!data.fill) {
      return pathNode;
    }

    return pathNode + self._make('path', {
      d: pathToken + self._describeCloseAttributeD(data.data, paddingX, paddingY, opts),
      stroke: 'none',
      'stroke-width': '2',
      'stroke-linejoin': 'round',
      'stroke-linecap': 'round',
      'class': '_yakoTransitions-' + data.label,
      fill: data.fill
    });
  }
});