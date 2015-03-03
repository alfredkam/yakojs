/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["yako"] = __webpack_require__(3);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var sparkLine = __webpack_require__(4);
	var pie = __webpack_require__(5);
	var donut = __webpack_require__(6);
	var bar = __webpack_require__(7);
	var bubble = __webpack_require__(8);
	var svg = __webpack_require__(9);
	var mixin = __webpack_require__(10);

	var initialize = function (component, obj) {
	  if (typeof obj === 'object') {
	    return new (obj.mixin ? mixin(mixin(component, obj.mixin), obj) : mixin(component, obj))();
	  }
	  return new component(obj);
	};

	module.exports = {
	  name: 'yakojs',
	  VERSION: '0.1.0',
	  spark: function (opts) {
	    return initialize(sparkLine, opts);
	  },
	  pie: function (opts) {
	    return initialize(pie, opts);
	  },
	  donut: function (opts) {
	    return initialize(donut, opts);
	  },
	  bubble: function (opts) {
	    return initialize(bubble, opts);
	  },
	  bar: function (opts) {
	    return initialize(bar, opts);
	  },
	  svg: svg
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Base = __webpack_require__(11);
	var Label = __webpack_require__(12);
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
	    this.attributes.data = opts.data || 0;
	    this.attributes.opts = opts;

	    for(var i in opts.data) {
	        opts.data[i].label = (opts.data[i].label || '').replace(/\s/g,'-');
	    }

	    return this.render(this._prepare()
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
	    var data = this.attributes.data,
	        opts = this.attributes.opts,
	        chart = opts.chart,
	        svg = this.make('svg',{
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

	    var scale = self._scale(data, opts);
	    self._extend(scale, chart);
	 
	    // simple hnadOff
	    // TODO:: fix the paddingX & Y dependecies
	    if (opts.yAxis) {
	      paddingX = 30;
	      paddingY = 20;
	      scale.pHeight = (chart.height - (paddingY * 2));
	      scale.paddingY = paddingY;
	      scale.paddingX = paddingX;
	      svg = self.append(svg, label.describeYAxis(scale, opts.yAxis));
	      // TODO:: this needs to be adjusted
	      paddingX += 5;
	    }

	    scale.heightRatio = (chart.height - (paddingY * 2)) / scale.max;
	    scale.gap = self._sigFigs(((chart.width - paddingX*2) / (scale.len - 1)),8);

	    if (opts.xAxis) {
	      svg = self.append(svg, label.describeXAxis(scale, opts.xAxis));
	    }
	    
	    // adding each path & circle
	    for (var x = 0; x < scale.rows; x++) {
	      if (opts.yAxis && opts.yAxis.multi) {
	        scale.heightRatio = (chart.height - (paddingY * 2)) / scale.max[x];
	      }
	        var g = self.make('g',{},{
	            label: data[x].label
	        });
	        svg = self.append(svg,
	          self.append(g, self._describePath(data[x], paddingX, paddingY, scale))
	          );
	    }
	    // add to element;
	    return self.append(self.element, svg);
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
	    var radius = scattered.radius || 5;
	    var fill = scattered.fill || 'white';
	    var paths = '';

	    for (var i = 0; i < numArr.length; i++) {
	      paths += self.make('circle', {
	        cx: ((gap * i) + paddingX) - (radius / 2) + (strokeWidth / 2),
	        cy: (height - (numArr[i] * heightRatio) - paddingY - (radius / 2) + (strokeWidth / 2)),
	        r: radius - strokeWidth / 2,
	        stroke: strokeColor,
	        'stroke-width': strokeWidth,
	        fill: 'white'
	      });
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

	    return (scale.line ? pathNode + (data.fill ? self.make('path', {
	      d: pathToken + self._describeCloseAttributeD(data.data, paddingX, paddingY, scale),
	      stroke: 'none',
	      'stroke-width': '2',
	      'stroke-linejoin': 'round',
	      'stroke-linecap': 'round',
	      'class': '_yakoTransitions-' + data.label,
	      fill: data.fill
	    }) : '') : '') +
	    (scale.scattered ?
	      self._describeScatteredGraph(data, data.data, paddingX, paddingY, scale) :
	      '');
	  }
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var arcBase = __webpack_require__(13);
	var pie = module.exports = arcBase.extend({
	    /**
	     * [_describePath genereates the paths for each pie segment]
	     * @param  {[int]} circumference [circumfrance]
	     * @param  {[array]} data      [data set]
	     * @param  {[json]} chart     [user specified chart options]
	     * @return {[string]}           [the html string for the pie]
	     */
	    _describePath: function (circumference, data, chart) {
	        if (!data) return '';
	        var paths = [];
	        var radius = circumference / 2;
	        var startAngle = 0;
	        var fills = chart.fills || 0;
	        var strokes = chart.strokeColors || 0;
	        var centerX = chart.width / 2;
	        var centerY = chart.height / 2;
	        for (var i = 0; i < data.length; i++) {
	            var endAngle = startAngle + 360 * data[i];
	            paths.push(this.make('path',{
	                "stroke-linecap": "round",
	                "stroke-linejoin": "round",
	                stroke: strokes[i] || (chart.strokeColor || this._randomColor()),
	                d: this._describePie(centerX, centerY, radius, startAngle, endAngle),
	                fill: fills[i] || this._randomColor()
	            }));
	            startAngle = endAngle;
	        }
	        return paths;
	    }
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var arcBase = __webpack_require__(13);
	var pie = module.exports = arcBase.extend({
	    /**
	     * [_describePath genereates the paths for each pie segment]
	     * @param  {[int]} circumference [circumfrance]
	     * @param  {[array]} data      [data set]
	     * @param  {[json]} chart     [user specified chart options]
	     * @return {[string]}           [the html string for the pie]
	     */
	    _describePath: function (circumference, data, chart) {
	        if (!data) return '';
	        var paths = [];
	        var outerRadius = chart.outerRadius || (circumference / 2);
	        var innerRadius = chart.innerRadius || (outerRadius / 2);
	        var startAngle = 0;
	        var fills = chart.fills || 0;
	        var strokes = chart.strokeColors || 0;
	        var centerY = chart.height / 2;
	        var centerX = chart.width / 2;
	        for (var i = 0; i < data.length; i++) {
	            var endAngle = startAngle +  360 * data[i];
	            paths.push(this.make('path', {
	                "stroke-linecap": "round",
	                "stroke-linejoin": "round",
	                stroke: strokes[i] || (chart.strokeColor||this._randomColor()),
	                fill: fills[i] || this._randomColor(),
	                d: this._describeDonut(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle)
	            }));
	            startAngle = endAngle;
	        }
	        return paths;
	    },
	    /**
	     * [_describeDonut describes donut path]
	     * @param  {Number} x           [x cordinates]
	     * @param  {Number} y           [y cordinates]
	     * @param  {Number} outerRadius [description]
	     * @param  {Number} innerRadius [description]
	     * @param  {Number} startAngle  [description]
	     * @param  {Number} endAngle    [description]
	     * @return {String}             [return path attribute 'd' for donut shape]
	     */
	    _describeDonut: function (x, y, outerRadius, innerRadius, startAngle, endAngle) {
	        var outerArc = {
	            start: this._polarToCartesian(x, y, outerRadius, endAngle),
	            end : this._polarToCartesian(x, y, outerRadius, startAngle)
	        };
	        var innerArc = {
	            start: this._polarToCartesian(x, y, innerRadius, endAngle),
	            end : this._polarToCartesian(x, y, innerRadius, startAngle)
	        };
	        var arcSweep = endAngle - startAngle <= 180 ? "0": "1";

	        return [
	            'M', outerArc.start.x, outerArc.start.y,
	            'A', outerRadius, outerRadius, 0, arcSweep, 0, outerArc.end.x, outerArc.end.y,
	            'L', innerArc.end.x, innerArc.end.y,
	            'A', innerRadius, innerRadius, 0, arcSweep, 1, innerArc.start.x, innerArc.start.y,
	            'L', outerArc.start.x, outerArc.start.y,
	            'Z'
	        ].join(" ");
	    }
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Base = __webpack_require__(11);
	var bar = module.exports = Base.extend({
	    // include missing values
	    _prepare: function () {
	        var defaults = {
	            chart: {
	                type: 'chart',
	                width: '100',
	                height: '100',
	                'font-family' : '"Open Sans", sans-serif'
	            }
	        };
	        this._extend(defaults, this.attributes.opts);
	        this.attributes.opts = defaults;
	        return this;
	    },
	    // public function for user to set & define the graph attributes
	    attr: function (opts) {
	        opts = opts || 0;
	        // width: 200,
	        // height: 100
	        this.attributes.data = opts.data || [];
	        this.attributes.opts = opts;

	        return this.render(this._prepare()
	            ._generate());
	    },
	    _generate: function () {
	        var data = this.attributes.data;
	        var chart = this.attributes.opts.chart;
	        var svg = this.make('svg',{
	            width: chart.width,
	            height: chart.height,
	            viewBox: '0 0 ' + chart.width + ' ' + chart.height,
	        });
	        return this.append(this.element,
	                this.append(
	                    svg,
	                    this._describeBar(data, chart)
	                    )
	                );
	    },
	    // describes the svg that builds out the bar
	    _describeBar: function (data, chart) {
	        if (!data.length) return '';
	        // TODO:: need to account paddings for labels
	        // wrap in array for consistency
	        data = typeof data[0] === 'object' ? data : [data];
	        var height = chart.height;
	        var paddingY = 5;
	        height = height - paddingY;
	        var width = chart.width;
	        var len = data[0].data.length;
	        var rows = data.length;
	        var gap = width / len;
	        var properties = this._scale(data, chart);
	        var paths = [];

	        // TODO:: feels expensive, need to optimize
	        for (var i = 0; i < len; i++) {
	            // stack chart
	            if (chart.stack) {
	                // the top padding has been taken care off, now account for the bottom padding
	                var relativeMax = (height - paddingY) * properties.maxSet[i] / properties.max;
	                var yAxis = height - relativeMax;
	                var total = 0;
	                for (var j = 0; j < rows; j++) {
	                    paths.push(this.make('rect',{
	                        x: gap * i + (gap/4),
	                        y: yAxis,
	                        width: gap / rows,
	                        height: (data[j].data[i]/properties.maxSet[i] * relativeMax),
	                        fill: data[j].fill || this._randomColor()
	                    }));
	                    yAxis += (data[j].data[i]/properties.maxSet[i] * relativeMax);
	                }
	            } else {
	                // side by side
	                for (var j = 0; j < rows; j++) {
	                    var yAxis = (height - paddingY) * data[j].data[i] / properties.max;
	                    paths.push(this.make('rect',{
	                        x: (gap * (i+1)) - (gap/(j + 1)),
	                        y: height - yAxis,
	                        width: gap / (rows+1),
	                        height: yAxis,
	                        fill: data[j].fill || this._randomColor()
	                    }));
	                }
	            }
	        }
	        return paths;
	    },
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Base = __webpack_require__(13);
	var bubble = module.exports = Base.extend({
	    _generate: function () {

	        var chart = this.attributes.opts.chart;
	        var data = this.attributes.data;
	        var svg = this.make('svg',{
	            width: chart.width,
	            height: chart.height,
	            viewBox: '0 0 ' + chart.width + ' ' + chart.height,
	        });

	        var widthOffset = 10 || chart.paddingX;
	        var paths = this._describeBubble(data, chart.height, chart.width, widthOffset, chart);
	        paths.unshift(this._describeHorizontalPath(chart.height, chart.width, widthOffset, chart));
	        return this.render(this.append(this.element,
	                this.append(
	                    svg,
	                        paths
	                    )
	                ));
	    },
	    _describeHorizontalPath: function (height, width, widthOffset, chart) {
	        // TODO:: need to account for stroke width 
	        var centerY = height / 2;
	        return this.make('path', {
	            "stroke-linecap": "round",
	            "stroke-linejoin": "round",
	            stroke: chart.strokColor || this._randomColor(),
	            d: 'M' + widthOffset + ' ' + centerY + ' H' + (width - widthOffset)
	        });
	    },
	    _describeBubble: function (data, height, width, widthOffset, chart) {
	        if (!data) return '';
	        var maxValue = this._getMaxOfArray(data);
	        var dataPoints = data.length;
	        var gap = (width - (widthOffset * 2)) / (dataPoints - 1);
	        var paths = [];
	        var fills = chart.fills || 0;
	        var maxRadius =  chart.maxRadius || (chart.height < chart.width ? chart.height : chart.width) / 2;
	        var centerY = height / 2;
	        for (var i = 0; i < data.length; i++) {
	            paths.push(this.make('circle', {
	                cx: (gap * i) + widthOffset,
	                cy: centerY,
	                r: maxRadius * (data[i] / maxValue),
	                fill: fills[0] || (chart.fill || this._randomColor())
	            }));
	        }

	        return paths;
	    },
	    _getMaxOfArray: function (arr) {
	        return Math.max.apply(null, arr);
	    }
	});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	module.exports = {
	    path: __webpack_require__(14),
	    arc: __webpack_require__(15),
	    react: __webpack_require__(16)
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	var mixin = module.exports = function (component, obj) {
	    return component.extend(obj);
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Common = __webpack_require__(17);
	var base = module.exports = Common.extend({
	    init: function (node) {
	      var self = this;
	      // adding width 100% will allow us to have responsive graphs (in re-sizing)
	      if (typeof node === 'string') {
	        if (node[0] === '#') {
	          this.element = this.make('div',{
	            id: node.replace(/^#/,''),
	            width: '100%'
	          });
	        } else {
	          this.element = this.make('div',{
	            "class": node.replace(/^\./,''),
	            width: '100%'
	          });
	        }
	      } else {
	        this.element = '';
	      }
	      this.token = self.makeToken();
	      this.attributes = {};
	      return this;
	    }
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var Common = __webpack_require__(17);

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

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Base = __webpack_require__(11);
	var arc = __webpack_require__(15);
	module.exports = Base.extend({
	    // include missing values
	    _prepare: function () {
	        var defaults = {
	            chart: {
	                type: 'chart',
	                width: '100',
	                height: '100',
	                'font-family' : '"Open Sans", sans-serif'
	            }
	        };
	        this._extend(defaults, this.attributes.opts);
	        this.attributes.opts = defaults;
	        return this;
	    },
	    // public function for user to set & define the graph attributes
	    attr: function (opts) {
	        opts = opts || 0;
	        // width: 200,
	        // height: 100
	        this.attributes.data = opts.data || [];
	        this.attributes.opts = opts;

	        return this.render(this._prepare()
	            ._generate());
	    },
	    // parent generator that manages the svg
	    _generate: function (){
	        var chart = this.attributes.opts.chart;
	        var data = this.attributes.data;
	        var svg = this.make('svg',{
	            width: chart.width,
	            height: chart.height,
	            viewBox: '0 0 ' + chart.width + ' ' + chart.height,
	        });
	        // find the max width & height
	        var circumference = chart.height < chart.width ? chart.height : chart.width;
	        // converts nums to relative => total sum equals 1
	        var relativeDataSet = this._dataSetRelativeToTotal(data);
	        return this.append(this.element,
	                this.append(
	                    svg,
	                    this._describePath(circumference, relativeDataSet, chart)
	                    )
	                );
	    },
	    _polarToCartesian: arc.polarToCartesian,
	    _describeArc: arc.describeArc,
	    _describePie: arc.describePie,
	    /* end of snippet */
	    /**
	     * [_describePath super class]
	     * @return {[type]} [empty string]
	     */
	    _describePath: function () {
	        return '';
	    }
	});

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var spark = __webpack_require__(4);
	spark = new spark();
	// TODO:: shrink the arguments!
	module.exports = {
	    /**
	     * scale describe the min max
	     * @param  attr: {
	     *                  data : an N * M array,
	     *                  height: chart height,
	     *                  width: chart width   
	     *             }
	     * @return obj              min / max
	     */
	    getScale: function (attr) {
	        var data = attr.data || 0;
	        var scale = spark._scale(data);
	        scale.paddingY = attr.paddingY || 5;
	        scale.gap = spark._sigFigs((attr.width / (scale.len - 1)),8);
	        scale.heightRatio = (attr.height - (scale.paddingY * 2)) / scale.max;
	        scale.chart = scale.chart || {};
	        scale.chart.height = attr.height;
	        scale.chart.width = attr.width;
	        return scale;
	    },
	    /**
	     * getOpenPath describes the open path with the given set
	     * @param  {[obj]} scale         contains min, max, interval, heightRatio, height, width
	     * @param  {[array]} numberArray an array of numbers
	     * @return {[string]}            string that descibes attributeD
	     */
	    getOpenPath: function (scale, numberArray) {
	        return spark._describeAttributeD(numberArray, 0, scale.paddingY, scale);
	    },
	    /**
	     * getClosedPath describes the closed path with the given set
	     * @param  {[obj]} scale         contains min, max, interval, heightRatio, height, width
	     * @param  {[array]} numberArray an array of numbers
	     * @return {[string]}            string that descibes attributeD
	     */
	    getClosedPath: function(scale, numberArray) {
	        return spark._describeAttributeD(numberArray, 0, scale.paddingY, scale) +
	        spark._describeCloseAttributeD(numberArray, 0, scale.paddingY, scale);
	    }
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	
	var arc = module.exports = {
	    // snippet from http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
	    // calculates the polar to cartesian coordinates
	    polarToCartesian: function (centerX, centerY, radius, angleInDegrees) {
	      var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

	      return {
	        x: centerX + (radius * Math.cos(angleInRadians)),
	        y: centerY + (radius * Math.sin(angleInRadians))
	      };
	    },
	    // describes an arc
	    describeArc: function (centerX, centerY, radius, startAngle, endAngle){
	        var start = arc.polarToCartesian(centerX, centerY, radius, endAngle);
	        var end = arc.polarToCartesian(centerX, centerY, radius, startAngle);
	        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

	        var d = [
	            "M", start.x, start.y,
	            "A", radius, radius, 0, arcSweep, 0, end.x, end.y
	        ].join(" ");

	        return d;
	    },
	    describePie: function (centerX, centerY, radius, startAngle, endAngle) {
	        return arc.describeArc(centerX, centerY, radius, startAngle, endAngle) + ' L' + centerX + ' ' + centerY;
	    }
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {



/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(18);
	var utils;
	var Class = __webpack_require__(19);
	/**
	 * deep extend object or json properties
	 * @param  {object} object to extend
	 * @param  {object} object
	 * @return {object} global function object 
	 */
	module.exports = utils = Class.extend({
	  // default
	  init: function () {
	    return this;
	  },
	  // accepts a N * 1 array
	  // finds total sum then creates a relative measure base on total sum
	  _dataSetRelativeToTotal: function (data) {
	    var total = data.reduce(function (a, b) {
	      return a + b;
	    });
	    return data.map(function (num) {
	      return num / total;
	    });
	  },
	  // random color generator
	  _randomColor: function () {
	    return '#'+Math.floor(Math.random()*16777215).toString(16);
	  },
	  // appends the elements
	  // accepts multiple child
	  append: function (parent, childs) {
	    if (parent === '') return childs;
	    if (Object.prototype.toString.call(childs) != '[object Array]') {
	      childs = [childs];
	    }
	    return parent.replace(/(.*)(<\/.*>$)/g, function (match, p1, p2) {
	        return p1 + childs.join("") + p2;
	    });
	  },
	  // alternate to one level deep
	  make: function (tagName, attribute, dataAttribute, content) {
	    var el = '<' + tagName;

	    if (tagName === 'svg') {
	        el += ' version="1.1" xmlns="http://www.w3.org/2000/svg"';
	    }
	    el += this._makePairs(attribute);
	    el += this._makePairs('data', dataAttribute);
	    return el += '>' + (content || content === 0 ? content : '') + '</'+tagName+'>';
	  },
	  render: function (result) {
	    return result;
	  },
	  // only supports 1 level deep
	  _makePairs: function (prefix, json) {
	    if (arguments.length < 2) {
	      json = prefix;
	      prefix = '';
	    } else {
	      prefix += '-';
	    }

	    if (!json) return '';

	    var keys = Object.keys(json), len = keys.length;
	    var str = '';
	    while (len--) {
	      str += ' ' + prefix + keys[len] + '="' + json[keys[len]] + '"';
	    }
	    return str;
	  },
	  // deep extend
	  _extend: function (attr, json) {
	    var self = this;
	    if (!json || !attr) return;

	    var k = Object.keys(json), len = k.length;
	    while(len--) {
	        if (typeof json[k[len]] !== 'object' || Object.prototype.toString.call(json[k[len]]) === '[object Array]') {
	            attr[k[len]] = json[k[len]];
	        } else {    //it has child objects, copy them too.
	            if (!attr[k[len]]) {
	                attr[k[len]] = {};
	            }
	            self._extend(attr[k[len]], json[k[len]]);
	        }
	    }
	    return this;
	  },
	  //building svg elements
	  _makeNode: function (tag, props, data) {
	      var node = doc.createElementNS('http://www.w3.org/2000/svg',tag);
	      this.assign(node,props);
	      // this._extendDataSet(node, data);
	      this._extend(node.dataset, data);
	      return node;
	  },
	  isFn: function (object) {
	    return !!(object && object.constructor && object.call && object.apply);
	  },
	  makeToken: function () {
	    return Math.random().toString(36).substr(2);
	  },
	    //sig fig rounding
	  _sigFigs: function (n, sig) {
	      var mult = Math.pow(10,
	          sig - Math.floor(Math.log(n) / Math.LN10) - 1);
	      return Math.round(n * mult) / mult;
	  },
	  _getSplits: function (max) {
	      var set = {};
	      //find label and #borders best fit
	      if (!isNaN(max) && !max == 0) {
	          var ceil = Math.ceil10(max, max.toString().length - 1);
	          if (max.toString().length > 1 && ceil !== 10) {
	              var leftInt = parseInt(ceil.toString().substr(0,2));
	              set.l = leftInt.toString()[0];
	              
	              if (set.l > 4) {
	                  if (set.l === 9) {
	                      set.l = 10;
	                      set.f = 5;
	                  //even
	                  } else if (set.l % 2 == 0) {
	                      set.f = set.l/2;
	                  //odd
	                  } else {
	                      set.f = set.l;
	                  }
	                  max = parseInt(set.l + Math.ceil10(max,max.toString().length - 1).toString().substr(1,Math.ceil10(max,max.toString().length - 1).toString().length - 1))
	              } else {
	                  var secondaryCeil = Math.ceil(max, max.toString().length-2),
	                  secondaryLeftInt = parseInt(secondaryCeil.toString().substr(0,2));
	                  if (secondaryLeftInt.toString()[1] > 4) {
	                      set.l = leftInt;
	                  } else {
	                      set.l = leftInt - 5;
	                  }
	                  set.f = set.l / 5;
	                  max = parseInt(set.l + Math.ceil10(max,max.toString().length - 1).toString().substr(1,Math.ceil10(max,max.toString().length - 1).toString().length - 2))
	              }
	          //single digit
	          } else {
	              if (ceil % 2 == 0) {
	                  max = ceil;
	                  set.f = ceil / 2;
	              } else if (ceil === 9) {
	                  max = 10;
	                  set.f = 5;
	              //odd
	              } else {
	                  max = ceil;
	                  set.f = ceil;
	              }
	          }
	      }
	      return {
	          max: (isNaN(max) ^ max == 0? 2 : max),
	          splits: (isNaN(max) ^ max == 0? 2 : set.f), //the number of line splits
	      }
	  },
	  // find min max between multiple rows of data sets
	  // also handles the scale needed to work with multi axis
	  _scale: function (data, opts) {
	      opts = opts || 0;
	      data = typeof data[0] === 'object' ? data : [data];
	      var max = 0;
	      var yAxis = [];
	      var min = Number.MAX_VALUE;
	      var maxSet = [];
	      var temp;
	      var ans;
	      var ySecs;
	      var self = this;

	      // change up the structure if the data set is an object
	      if (data[0].data) {
	        temp = [];
	        for (var x = 0; x < data.length; x++) {
	          temp.push(data[x].data);
	        }
	        data = temp;
	      }

	      var asc = function (a,b) { return a - b; };
	      var rows = data.length;
	      var len = data[0].length;

	      if (opts.yAxis && opts.yAxis.multi) {
	        // across multi set
	        min = {};
	        max = {};
	        ySecs = {};
	        for (var i = 0; i < rows; i++) {
	          temp = data[i].slice(0).sort(asc);
	          min[i] = temp[0];
	          ans = self._getSplits(temp[len - 1]);
	          max[i] = ans.max;
	          ySecs[i] = ans.splits;
	          delete temp;
	        }
	      } else if (opts.stack) {
	        for (var i = 0; i < len; i++) {
	          var rowTotal = 0;
	          for (var j = 0; j < rows; j++) {
	              rowTotal += data[j][i];
	          }
	          maxSet.push(rowTotal);
	          max = max < rowTotal ? rowTotal : max;
	          min = min > rowTotal ? rowTotal : min;
	        }
	      } else {
	        // find max in a set
	        for (var i = 0; i < rows; i++) {
	          temp = data[i].slice(0).sort(asc);
	          min = min > temp[0] ? temp[0] : min;
	          max = max < temp[len - 1] ? temp[len - 1] : max;
	          delete temp;
	        }

	        if (opts.yAxis) {
	          ans = self._getSplits(max);
	          max = ans.max;
	          ySecs = ans.splits;
	        }
	      }
	      
	      return {
	          min : min,
	          max : max,
	          maxSet: maxSet,
	          len: len,
	          rows: rows,
	          ySecs: ySecs
	      };
	  }
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Code from MDN
	 * Decimal adjustment of a number.
	 *
	 * @param   {String}    type    The type of adjustment.
	 * @param   {Number}    value   The number.
	 * @param   {Integer}   exp     The exponent (the 10 logarithm of the adjustment base).
	 * @returns {Number}            The adjusted value.
	 */
	function decimalAdjust(type, value, exp) {
	    // If the exp is undefined or zero...
	    if (typeof exp === 'undefined' || +exp === 0) {
	        return Math[type](value);
	    }
	    value = +value;
	    exp = +exp;
	    // If the value is not a number or the exp is not an integer...
	    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
	        return NaN;
	    }
	    // Shift
	    value = value.toString().split('e');
	    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
	    // Shift back
	    value = value.toString().split('e');
	    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}
	// Decimal round
	if (!Math.round10) {
	    Math.round10 = function(value, exp) {
	        return decimalAdjust('round', value, exp);
	    };
	}
	// Decimal floor
	if (!Math.floor10) {
	    Math.floor10 = function(value, exp) {
	        return decimalAdjust('floor', value, exp);
	    };
	}
	// Decimal ceil
	if (!Math.ceil10) {
	    Math.ceil10 = function(value, exp) {
	        return decimalAdjust('ceil', value, exp);
	    };
	}


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Class provides simple JavaScript inheritance.
	 * by John Resig
	 * MIT Licensed
	 */
	function isFunction(object) {
	  return typeof object == 'function';
	}

	function hasSuper(name) {
	  return /\b_super\b/.test(name);
	}

	var Class = module.exports = function doNothing() {};

	Class.extend = function extend(properties) {
	  var _super = this.prototype;

	  // Instantiate a base class without running the init constructor.
	  var init = this.prototype.init;
	  this.prototype.init = null;
	  var prototype = new this();
	  this.prototype.init = init;

	  // Copy the properties over onto the new prototype.
	  for (var name in properties) {
	    // Check if we're overwriting an existing function.
	    var property = properties[name];
	    prototype[name] = isFunction(property) && isFunction(_super[name]) && hasSuper(property) ?
	      (function createMethod(name, fn) {
	        return function method() {
	          var tmp = this._super;

	          // Add a new ._super() method that is the same method but on the super-class.
	          this._super = _super[name];

	          // The method only needs to be bound temporarily, so remove it when we're done executing.
	          var ret = fn.apply(this, arguments);
	          this._super = tmp;

	          return ret;
	        };
	      })(name, property) : property;
	  }

	  // The dummy class constructor.
	  function Class() {
	    if (this.init) {
	      this.init.apply(this, arguments);
	    }
	  }

	  // Populate our constructed prototype object.
	  Class.prototype = prototype;

	  // Enforce the constructor to be what we expect.
	  Class.prototype.constructor = Class;

	  // And make this class extendable.
	  Class.extend = arguments.callee;

	  return Class;
	};

/***/ }
/******/ ])