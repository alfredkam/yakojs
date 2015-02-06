require('./extendDecimal');
var Common = require('./common');
var spark = module.exports = Common.extend({
  init: function (node) {
    var self = this;
    // adding width 100% will allow us to have responsive graphs (in re-sizing)
    if (typeof node === 'string') {
      if (node[0] === '#') {
        this.element = this._make('div',{
          id: node.replace(/^#/,''),
          width: '100%'
        });
      } else {
        this.element = this._make('div',{
          "class": node.replace(/^\./,''),
          width: '100%'
        });
      }
    } else if(typeof node === 'object'){
      // type of object?
      this.element = element;
      this.element.style.width = '100%';
    } else {
      this.element ='';
    }
    this.token = self.makeToken();
    this.attributes = {};
    return this;
  },
  // the graph data & options setter
  set: function (opts) {
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
        opts.data[i].label = opts.data[i].label.replace(/\s/g,'-');
    }

    return this._prepare()
    ._generate();
  },
  //set default value if they are missing
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
            //No view box?
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
        //sets a random color if color is not determined.
        data[i].color = data[i].color || '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        //pushes the data into a set for future analysis
        sets.push(data[i].data);
    }

    //empty data
    if (data.length === 0) {
      var result = this._compile(
          this.element,
          this._compile(svg, this._emptyData(opts)),
          reRender);

      if (typeof result !== 'object') {
        return result;
      }
      return this;
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

    // this snippet is for label formet, preserve this snippet for now
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
    //             interval = (opts.chart.width-40) / (range.len-1);    //this part adjust the interval base on the width offset;
    //             heightRatio = (opts.chart.height-25.5) / (max);
    //         }
           
    //         opts._shift = true;
    //     }
    // }

    this.heightRatio = heightRatio;
    this.interval = interval;

    //determine if padding for labels is needed
    var paddingForLabel = (opts._shift ? 40 : 0);

    // TODO:: Move re-render to a seperate module
    // we are now adding on to exisiting data and to allow animation
    // NOTE:: We will not do MULTIPLE AXIS for real time data
    // if (reRender) {
    //     this._reRenderLabelAndBorders(data, opts, interval, heightRatio, min, max, splits, paddingForLabel, true);
    //     var nodes = this._getNode(this.element, null, 'path');
    //     for (var i in data) {
    //         this._reRenderPath(nodes, data[i], opts, interval, heightRatio, paddingForLabel, this.attributes.oldData[i]);
    //     }
    //     yako.startCycle(this.token, function (){
    //         //complete
    //     });
    //     return this;
    // }

    // svg z index is compiled by order
    // snippet for compiling labels and border
    // this._compile(highlight, hightlightRect)
    //     ._compile(svg, highlight)
    //     ._compile(svg, this._labelAndBorders(data, opts, interval, heightRatio, range, paddingForLabel, multi));

    // adding each path & circle
    for (var i in data) {
        var g = this._make('g',{
            'z-index': 9
        },{
            label: data[i].label
        });
        svg = this._compile(svg,
          this._compile(g, this._path(data[i], opts, interval, (multi? heightRatio[i]: heightRatio), paddingForLabel, multi, range.length))
          );
    }
    // add to element;
    var result = this._compile(this.element, svg, reRender);
    if (typeof result == 'string') {
      return result;
    }
    return this;
  },
  //appends the elements
  // for now lets assume there is only one child
  _compile : function (node, child) {
    if (typeof node === 'object') {
      node.innerHTML = child;
      return this;
    }
    if (node === '') return child;
    return node.replace(/(.*)(<\/.*>$)/g, function (match, p1, p2) {
      return p1 + child + p2;
    });
  },
  _pathGenerator: function (data, interval, paddingForLabel, opts, heightRatio, padding, multi, maxIterations) {
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
    if (opts.fill) {
      // closing the line to be able to fill area
      pathToken += ' V '+(height-padding)+' H ' + (parseInt(paddingForLabel)*(multi?Math.ceil(maxIterations / 2):1)) + ' L ' + (parseInt(paddingForLabel)*(multi?Math.ceil(maxIterations / 2):1))+' '+ (height - (data[0] * heightRatio)-padding);
    }
    // eliminates the error calls when attributiting this to the svg path
    if (pathToken === '') {
      pathToken = 'M 0 0';
    }
    return pathToken;
  },
  //svg path builder
  _path : function (data, opts, interval, heightRatio, paddingForLabel, multi, maxIterations) {
      //get the path
      //padding is for yaxis
      var padding = 5;
      if (opts._shift)
          padding = 20;
      var pathToken = this._pathGenerator(data.data, interval, paddingForLabel, opts.chart, heightRatio, padding, multi, maxIterations);
      return this._make('path',{
          d: pathToken,
          stroke: data.color,
          'stroke-width': '2',
          'stroke-linejoin': 'round',
          'stroke-linecap': 'round',
          'z-index': 9,
          'class': '_yakoTransitions-'+data.label,
          fill: opts.chart.fill || 'none'
      });
  },
  _emptyData: function (opts) {
    var height = (opts.chart.height-10) / 4;
    var i = 5,
        arr = [];

    while(i--) {
      arr.push(this._make('path',{
          'd' : 'M '+ 0 + ' '+ (height*i+5) + ' L ' + opts.chart.width + ' ' +(height*i+5),
          'stroke-width': '1',
          'stroke': '#c0c0c0',
          'fill': 'none',
          'opacity': '1',
          'stroke-linecap': 'round'
      }));
    }
    return arr;
  }
});