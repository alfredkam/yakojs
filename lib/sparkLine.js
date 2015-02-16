require('./extendMath');
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
    this.attributes.data = opts.data || [];
    opts._originalDataLength = (opts.data?opts.data[0].data.length:0);
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
          'font-family' : '"Open Sans", sans-serif',
          realtime : {
            zero : undefined
          }
      },
      // for labels
      xAxis: {},
      yAxis: {},
      data : [],
      _shiftIntervals: 0
    };
    this._extend(defaults, this.attributes.opts);
    this.attributes.opts = defaults;
    this.lock = {};
    this.lock.label = 0;
    return this;
  },
    /**
   * the parent generator that manages the svg generation
   * @param  {boolean}  true to reRender
   * @return {object} global function object 
   */
  _generate: function (reRender) {
    var data = this.attributes.data,
        opts = this.attributes.opts,
        svg = this._make('svg',{
            width: '100%',
            height: opts.chart.height,
            xlms: 'http://www.w3.org/2000/svg',
            version: '1.1',
            viewBox: '0 0 '+opts.chart.width + ' '+opts.chart.height,
        }),
        sets = [],
        self = this;
    reRender = reRender || false;

    if (Object.prototype.toString.call(data) !== '[object Array]') {
        data = [data];
    }

    for (var i in data) {
        // sets a random color if color is not determined.
        data[i].color = data[i].color || this._randomColor();
        // pushes the data into a set for future analysis
        sets.push(data[i].data);
    }

    // find min / max point
    // assume all data are positive for now;
    var multi = (opts.xAxis && opts.xAxis.multi ? opts.xAxis.multi : false),
        range = this._findMinMax(sets, multi),
        min = range.min,
        max = range.max,
        splits = range.splits,
        interval = this._sigFigs((opts.chart.width / (range.len-1)),8),
        heightRatio = (opts.chart.height - 10) / (max);
    this.attributes._multi = multi;
    this.attributes._range = range;

    this.heightRatio = heightRatio;
    this.interval = interval;

    // determine if padding for labels is needed
    var paddingForLabel = (opts._shift ? 40 : 0);

    // adding each path & circle
    for (var i in data) {
        var g = this._make('g',{
        },{
            label: data[i].label
        });
        svg = this._compile(svg,
          this._compile(g, this._describePath(data[i], opts, interval, (multi? heightRatio[i]: heightRatio), paddingForLabel, multi, range.length))
          );
    }
    // add to element;
    var result = this._compile(this.element, svg, reRender);
    return (typeof result == 'string') ? result : this;
  },
  _describeAttributeD: function (data, interval, paddingForLabel, opts, heightRatio, padding, multi, maxIterations) {
    var height = opts.height;
    var pathToken = '';
    //path generator
    for (var i=0; i<data.length; i++) {
        if (i === 0) {
          // X Y
            pathToken += 'M '+(interval*i+(parseInt(paddingForLabel)*(multi?Math.ceil(maxIterations / 2):1)))+' '+ (height - (data[i] * heightRatio)-padding);
        } else {
            pathToken += ' L '+(interval*i+(parseInt(paddingForLabel)*(multi?Math.ceil(maxIterations / 2):1)))+' '+ (height - (data[i] * heightRatio)-padding);
        }
    }
    // eliminates the error calls when attributiting this to the svg path
    if (pathToken === '') {
      pathToken = 'M 0 0';
    }
    return pathToken;
  },
  // describe the close case for the path
  _describeCloseAttributeD: function (data, interval, paddingForLabel, opts, heightRatio, padding, multi, maxIterations) {
    var height = opts.height;
    return ' V '+(height-padding)+' H ' + (parseInt(paddingForLabel)*(multi?Math.ceil(maxIterations / 2):1)) + ' L ' + (parseInt(paddingForLabel)*(multi?Math.ceil(maxIterations / 2):1))+' '+ (height - (data[0] * heightRatio)-padding);
  },
  //svg path builder
  _describePath : function (data, opts, interval, heightRatio, paddingForLabel, multi, maxIterations) {
      //get the path
      //padding is for yaxis
      var padding = 5;
      var self = this;
      if (opts._shift)
          padding = 20;
      var pathToken = this._describeAttributeD(data.data, interval, paddingForLabel, opts.chart, heightRatio, padding, multi, maxIterations);
      var pathNode = this._make('path',{
          d: pathToken,
          stroke: data.strokeColor || self._randomColor,
          'stroke-width': data.strokeWidth || '5',
          'stroke-linejoin': 'round',
          'stroke-linecap': 'round',
          'class': '_yakoTransitions-'+data.label,
          fill: 'none'
      });

      if (!data.fill) {
        return pathNode;
      } else {
        return pathNode + this._make('path', {
          d: pathToken + this._describeCloseAttributeD(data.data, interval, paddingForLabel, opts.chart, heightRatio, padding, multi, maxIterations),
          stroke: 'none',
          'stroke-width': '2',
          'stroke-linejoin': 'round',
          'stroke-linecap': 'round',
          'class': '_yakoTransitions-'+data.label,
          fill: data.fill
        });
      }
  }
});