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

	/*
	  Copyright 2015 
	  MIT LICENSE
	  Alfred Kam (@alfredkam)
	*/
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
	  VERSION: '0.3.13',
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
	var Errors = __webpack_require__(12);
	var spark = module.exports = Base.extend({
	  /**
	   * The parent generator that manages the svg generation
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

	    if (xAxis) {
	      chart.xAxis = xAxis;
	    }

	    if (yAxis) {
	      chart.yAxis = yAxis;
	    }

	    paths = self._lifeCycleManager(data, chart, function (scale) {
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
	  // Extends default getRatio in lib/base/common.js
	  _getRatio: function (scale) {
	    var self = this;

	    scale.pHeight = scale.height - scale.paddingTop - scale.paddingBottom;
	    scale.pWidth = scale.width - scale.paddingLeft - scale.paddingRight;
	    scale.heightRatio = scale.pHeight / scale.max;
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
	  // Svg path builder
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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var arcBase = __webpack_require__(13);
	var pie = module.exports = arcBase.extend({
	    /**
	     * [_describePath genereates the paths for each pie segment]
	     * @param  {[int]}   radius         [circumfrance]
	     * @param  {[array]} data           [data set]
	     * @param  {[json]}  chart          [user specified chart options]
	     * @return {[string]}               [the html string for the pie]
	     */
	    _describePath: function (radius, data, chart) {
	        if (!data) return '';
	        var paths = [];
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
	     * @param  {[int]} radius [circumfrance]
	     * @param  {[array]} data      [data set]
	     * @param  {[json]} chart     [user specified chart options]
	     * @return {[string]}           [the html string for the pie]
	     */
	    _describePath: function (radius, data, chart) {
	        if (!data) return '';
	        var paths = [];
	        var outerRadius = chart.outerRadius || radius;
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
	    _startCycle: function () {
	        var data = this.attributes.data;
	        var self = this;
	        var chart = this.attributes.opts.chart;
	        var append = self.append;
	        var svg;
	        chart.type = 'bar';

	        paths = self._lifeCycleManager(data, chart, function (newScale) {
	            svg = self.make('svg',{
	                width: chart.width,
	                height: chart.height,
	                viewBox: '0 0 ' + chart.width + ' ' + chart.height,
	            });
	            return self._describeBar(data, newScale);
	        });
	        return append(self.element,append(svg, paths));
	    },
	    // Describes the svg that builds out the bar
	    _describeBar: function (data, scale) {
	        if (!data.length) return '';
	        // TODO:: need to account paddings for labels
	        // Wrap in array for consistency
	        data = typeof data[0] === 'object' ? data : [data];
	        var height = scale.height - scale.paddingTop - scale.paddingBottom;
	        var paddingY = 5;
	        var width = scale.width - scale.paddingLeft - scale.paddingRight;
	        var len = data[0].data.length;
	        var rows = data.length;
	        var tickSize = width / len;
	        var paths = [];

	        for (var i = 0; i < len; i++) {
	            // Stack chart
	            if (scale.stack) {
	                // The top padding has been taken care off, now account for the bottom padding
	                var relativeMax = height * scale.maxSet[i] / scale.max;
	                var yAxis = height - relativeMax + scale.paddingTop;
	                var total = 0;
	                for (var j = 0; j < rows; j++) {
	                    paths.push(this.make('rect',{
	                        x: tickSize * i + (tickSize / 4) + scale.paddingLeft,
	                        y: yAxis,
	                        width: tickSize / rows,
	                        height: (data[j].data[i] / scale.maxSet[i] * relativeMax),
	                        fill: data[j].fill || this._randomColor()
	                    }));
	                    yAxis += (data[j].data[i] / scale.maxSet[i] * relativeMax);
	                }
	            } else {
	                // Side by side
	                var x = tickSize * i + (tickSize / 4) + scale.paddingLeft;
	                for (var j = 0; j < rows; j++) {
	                    x += tickSize / (rows+1)* j;
	                    var relativeMax = height * data[j].data[i] / scale.max;
	                    paths.push(this.make('rect',{
	                        x: x,
	                        y: height - relativeMax + scale.paddingTop,
	                        width: tickSize / (rows+1),
	                        height: relativeMax,
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

	var Base = __webpack_require__(11);
	var bubble = module.exports = Base.extend({
	    // Start of a life cyle
	    _startCycle: function () {
	        var self = this;
	        var chart = self.attributes.opts.chart;
	        var data = self.attributes.data;
	        var svg;
	        var append = self.append;
	        var render = self.postRender;
	        var paths = '';
	        var scale;

	        var getSvg = function () {
	            return self.make('svg',{
	                width: chart.width,
	                height: chart.height,
	                viewBox: '0 0 ' + chart.width + ' ' + chart.height,
	            });
	        };

	        if (chart.type == 'scattered') {
	            chart.type = 'bubble-scattered';
	            paths = self._lifeCycleManager(data, chart, function (newScale) {
	                svg = getSvg();
	                return self._describeBubbleChart(data, newScale);
	            });
	            return append(self.element,append(svg, paths));
	        } else {
	            chart.type = 'bubble-point';
	            paths = self._lifeCycleManager(data, chart, function (newScale) {
	                svg = getSvg();
	                paths = self._describeBubble(data, chart.height, chart.width, newScale);
	                paths.unshift(self._describeXAxis(chart.height, chart.width, newScale));
	                return paths;
	            });
	            return append(self.element, append(svg, paths));
	        }
	    },
	    // Extends default ratio w/ auto scaling
	    _getRatio: function (scale) {
	        var data = scale._data;
	        var height = scale.height;
	        var width = scale.width;
	        var len = scale.len;
	        var maxRadius = (height < width ? height : width) / 3;
	        var paddingRight = scale.paddingRight;
	        var paddingLeft = scale.paddingLeft;
	        var paddingTop = scale.paddingTop;
	        var paddingBottom = scale.paddingBottom;
	        if (scale.type && scale.type == 'bubble-scattered') {
	            // bubble as a scattered graph
	            maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || Math.sqrt(width * height / len) / 2;
	            scale.paddingLeft = paddingLeft < maxRadius ? maxRadius : paddingLeft;
	            scale.paddingRight = paddingRight < maxRadius ? maxRadius : paddingRight;
	            scale.paddingTop = paddingTop < maxRadius ? maxRadius : paddingTop;
	            scale.paddingBottom = paddingBottom < maxRadius ? maxRadius : paddingBottom;
	            scale.widthRatio = (width - scale.paddingLeft - scale.paddingRight) / scale.max[0];
	            scale.heightRatio = (height - scale.paddingTop - scale.paddingBottom) / scale.max[1];
	        } else {
	            // bubble line (point) graph
	            scale.bubble = scale.bubble || {};
	            scale.xAxis = scale.xAxis || {};
	            maxRadius = scale.bubble.maxRadius = parseInt(scale.bubble.maxRadius) || maxRadius;
	            // figure out the maxRadius & paddings, maxRadius is a guide line
	            var tickSize = (width - scale.paddingLeft - scale.paddingRight) / (len - 1);
	            scale.bubble.maxRadius = tickSize < maxRadius ? tickSize + scale.paddingLeft : maxRadius;
	            scale.paddingLeft = scale.paddingLeft || scale.bubble.maxRadius * (data[0] / scale.max);
	            scale.paddingRight = scale.paddingRight || scale.bubble.maxRadius * (data[len - 1] / scale.max);
	            scale.tickSize = (width - scale.paddingLeft - scale.paddingRight) / (len - 1);
	        }
	    },
	    // Describes bubble scattered graph
	    _describeBubbleChart: function(data, scale) {
	        var height = scale.height;
	        var width = scale.width;
	        var heightRatio = scale.heightRatio;
	        var widthRatio = scale.widthRatio;
	        var self = this;
	        var len = scale.len;
	        var max = scale.max;
	        var fills = scale.fills || 0;
	        var paths = [];

	        for (var r = 0; r < scale.rows; r++) {
	            for (var i = 0; i < len; i++) {
	                var point = data[r].data[i];
	                paths.push(self.make('circle', {
	                    cx: width - (point[0] * widthRatio) - scale.paddingLeft,
	                    cy: height - (point[1] * heightRatio) - scale.paddingTop,
	                    r: scale.maxRadius * (point[2]/max[2]),
	                    fill: data[r].fill || (fills[i] || self._randomColor())
	                }));
	            }
	        }
	        return paths;
	    },
	    // Describes the xAxis for bubble point graph
	    _describeXAxis: function (height, width, chart) {
	        var config = chart.xAxis;
	        var centerY = height / 2;
	        return this.make('path', {
	            "stroke-linecap": "round",
	            "stroke-linejoin": "round",
	            'stroke-width': config.strokeWidth || 2,
	            stroke: config.strokeColor || this._randomColor(),
	            d: 'M' + chart.paddingLeft + ' ' + centerY + ' H' + (width - chart.paddingLeft - chart.paddingRight)
	        });
	    },
	    // Describes bubble point graph
	    _describeBubble: function (data, height, width, scale) {
	        if (!data) return '';
	        var config = scale.bubble;
	        var dataPoints = data.length;
	        var paths = [];
	        var fills = config.fills || 0;
	        var strokeColors = config.strokeColors || 0;
	        var strokeWidths = config.strokeWidths || 0;
	        var centerY = height / 2;
	        for (var i = 0; i < data.length; i++) {
	            paths.push(this.make('circle', {
	                cx: (scale.tickSize * i) + scale.paddingLeft,
	                cy: centerY,
	                r: config.maxRadius * (data[i] / scale.max),
	                fill: fills[i] || (config.fill || this._randomColor()),
	                stroke: strokeColors[i] || (config.strokeColor || this._randomColor()),
	                'stroke-width': strokeWidths[i] || (config.strokeWidth || 2)
	            }));
	        }
	        return paths;
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
	    if (obj instanceof Array) {
	        for (var i = 0; i < obj.length; i++) {
	            component = component.extend(obj[i]);
	        }
	        return component;
	    }
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
	          self.element = self.make('div',{
	            id: node.replace(/^#/,''),
	            width: '100%'
	          });
	        } else {
	          self.element = self.make('div',{
	            "class": node.replace(/^\./,''),
	            width: '100%'
	          });
	        }
	      } else {
	        self.element = '';
	      }
	      self.token = self._makeToken();
	      self.attributes = {};
	      return self;
	    },
	    // include missing values
	    _prepare: function () {
	        var self = this;
	        var defaults = {
	          type: 'chart',
	          width: '100',
	          height: '100',
	          paddingLeft: 0,
	          paddingRight: 0,
	          paddingTop: 0,
	          paddingBottom: 0,
	          // spark graph configs
	          line: true,
	          fill: true,
	          scattered: false
	        };
	        self._extend(defaults, self.attributes.opts.chart);
	        self.attributes.opts.chart = defaults;
	        return self;
	    },
	    // public function for user to set & define the graph attributes
	    attr: function (opts) {
	        var self = this;
	        opts = opts || 0;
	        // if a user does not include opts.chart
	        if (typeof opts.chart === 'undefined') {
	          opts = {
	            chart: opts,
	            data: opts.data
	          };
	          delete opts.chart.data;
	        }

	        self.attributes.data = opts.data || [];
	        self.attributes.opts = opts;

	        return self.postRender(self._prepare()
	            ._startCycle());
	    }
	});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* istanbul ignore next */
	var warn = function (msg) {
	  console.warn(msg);
	};
	/* istanbul ignore next */
	module.exports = {
	  label: function () {
	    warn("You're attempting to use labels without the `Label` addons.  Check documentation https://github.com/alfredkam/yakojs/blob/master/doc.md");
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Base = __webpack_require__(11);
	var arc = __webpack_require__(15);
	module.exports = Base.extend({
	    // Parent generator that manages the svg
	    _startCycle: function (){
	        var self = this;
	        var chart = self.attributes.opts.chart;
	        var data = self.attributes.data;
	        var svg;

	        var append = this.append;
	        paths = self._lifeCycleManager(data, chart, function (scale) {
	            svg = self.make('svg',{
	                width: chart.width,
	                height: chart.height,
	                viewBox: '0 0 ' + chart.width + ' ' + chart.height,
	            });
	            return self._describePath(scale.outerRadius, scale.relativeDataSet, scale);
	        });

	        return append(self.element,
	                    append(svg, paths));
	    },
	    // Extends _defineBaseScaleProperties in lib/base/common.js
	    _defineBaseScaleProperties: function (data, chart) {
	        var self = this;
	        var scale = {
	            // Converts nums to relative => total sum equals 1
	            relativeDataSet: self._dataSetRelativeToTotal(data),
	            // Find the max width & height
	            outerRadius: chart.outerRadius || (chart.height < chart.width ? chart.height : chart.width) / 2
	        };

	        self._extend(scale, chart);
	        return scale;
	    },
	    _polarToCartesian: arc.polarToCartesian,
	    _describeArc: arc.describeArc,
	    _describePie: arc.describePie,
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
	        scale.tickSize = spark._sigFigs((attr.width / (scale.len - 1)),8);
	        scale.heightRatio = (attr.height - (scale.paddingY * 2)) / scale.max;
	        scale.height = attr.height;
	        scale.width = attr.width;
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
	var Class = __webpack_require__(19);
	var Errors = __webpack_require__(12);

	var isArray = function (obj) {
	    return obj instanceof Array;
	};
	/**
	 * deep extend object or json properties
	 * @param  {object} object to extend
	 * @param  {object} object
	 * @return {object} global function object 
	 */
	module.exports = Class.extend({
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

	    if (!isArray(childs)) {
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
	  // Deep copies an object
	  // TODO:: improve this
	  _deepCopy: function (objToCopy) {
	    return JSON.parse(JSON.stringify(objToCopy));
	  },
	  // Call right before return the svg content to the user
	  postRender: function (svgContent) {
	    // super class
	    return svgContent;
	  },
	  /**
	   * [_isArray check if variable is an array]
	   * @param  any type
	   * @return {Boolean}   true if its an array
	   */
	  _isArray: isArray,
	  // Default ratio
	  _getRatio: function (scale) {
	    scale.heightRatio = scale.height - (scale.paddingTop + scale.paddingBottom) / scale.max;
	  },
	  /**
	   * [_defineBaseScaleProperties defines the common scale properties]
	   * @param  {[obj]} data  [raw data set from user]
	   * @param  {[obj]} chart [chart properties passed by the user]
	   * @return {[obj]}       [return an obj that describes the scale base on the data & chart properties]
	   */
	  _defineBaseScaleProperties: function (data, chart) {
	    var self = this;
	    var opts = this.attributes.opts;
	    var chart = opts.chart;
	    var xAxis = chart.xAxis || opts.xAxis;
	    var yAxis = chart.yAxis || opts.yAxis;
	    var scale = self._scale(data, chart);
	    self._extend(scale, chart);
	    scale._data = data;

	    if ((chart.type != 'bubble-point') && (yAxis || xAxis)) {
	      self._getExternalProps(scale, yAxis, xAxis);
	      if (!self.describeYAxis) {
	        Errors.label();
	      }
	    }
	    self._getRatio(scale);
	    return scale;
	  },
	  /**
	   * base on the feedback and mange the render of the life cycle 
	   * it passes a immutable obj to preRender and audits the user feedback
	   */
	  // TODO:: Rename lifeCycleManager, incorrect term usage
	  _lifeCycleManager: function (data, chart, describe) {
	    var self = this;
	    var scale = self._defineBaseScaleProperties(data, chart);
	    // check if there is any external steps needed to be done
	    if (self._call) {
	      self._call(scale);
	    }
	    // make the obj's shallow properties immutable
	    // we can know if we want to skip the entire process to speed up the computation
	    var properties = (self.preRender ? self.preRender(Object.freeze(self._deepCopy(scale))) : 0);
	    
	    // properties we will except
	    // - append
	    // - prepend
	    var paths = properties.prepend ? properties.prepend : [];
	    paths = paths.concat(describe(scale));
	    paths = paths.concat(properties.append ? properties.append : []);
	    return paths;
	    // return summary
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
	        if (typeof json[k[len]] !== 'object' || isArray(json[k[len]])) {
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
	  isFn: function (object) {
	    return !!(object && object.constructor && object.call && object.apply);
	  },
	  _makeToken: function () {
	    return Math.random().toString(36).substr(2);
	  },
	  //sig fig rounding
	  _sigFigs: function (n, sig) {
	      var mult = Math.pow(10,
	          sig - Math.floor(Math.log(n) / Math.LN10) - 1);
	      return Math.round(n * mult) / mult;
	  },
	  // calculates the number of yAxis sections base on the maxium value
	  _getSplits: function (value) {
	      var set = {};
	      value = Math.ceil(value, 0); // make sure its a whole number
	      if (value === 0) return { max : 2, splits: 2};

	      var supportedBorders = [3,2,5];
	      var digitLen = value.toString().length;
	      var ceil = splits = 0;

	      // now search for the best for number of borders
	      var checkIfSatisfy = function (v) {
	        for (var i = 0; i < 3; i++) {
	          if (v % supportedBorders[i] === 0)
	            return supportedBorders[i];
	        }
	        return 0;
	      };

	      var auditSplits = function (v) {
	        var leftInt = parseInt(v.toString()[0]);
	        if (leftInt == 1) return 2;
	        return checkIfSatisfy(leftInt);
	      };

	      if (digitLen > 2) {
	        ceil = Math.ceil10(value, digitLen - 1);
	        splits = auditSplits(ceil);
	        if (!splits) {
	          ceil += Math.pow(10, digitLen - 1);
	          splits = auditSplits(ceil);
	        }
	      } else if (digitLen == 2) {
	        // double digit
	        ceil = value.toString();
	        if (ceil[1] <= 5 && (ceil[0] == 1 || ceil[0] == 2 || ceil[0] == 5 || ceil[0] == 7) && ceil[1] != 0) {
	          ceil = parseInt(ceil[0] + "5");
	        } else {
	          ceil = Math.ceil10(value, 1);
	          ceil = ceil == 70 ? 75 : ceil;
	        }
	        splits = checkIfSatisfy(ceil);
	      } else {
	        // single digit
	        ceil = value;
	        splits = checkIfSatisfy(ceil);
	        if (ceil == 5 || ceil == 3 || ceil == 2) {
	          splits = 1;
	        }
	        if (!splits) {
	          ceil += 1;
	          splits = auditSplits(ceil);
	        }
	      }

	      return {
	        max: ceil,
	        splits: splits
	      };
	  },
	  // find min max between multiple rows of data sets
	  // also handles the scale needed to work with multi axis
	  _scale: function (data, opts) {
	      opts = opts || 0;
	      data = typeof data[0] === 'object' ? data : [data];
	      var max = 0;
	      var yAxis = opts.yAxis || (opts.chart ? opts.chart.yAxis : 0);
	      var min = Number.MAX_VALUE;
	      var maxSet = [];
	      var temp;
	      var ans;
	      var self = this;
	      var ySecs = 0;
	      var getSplits = this._getSplits;
	      var color = [];

	      // change up the structure if the data set is an object
	      if (data[0].data) {
	        temp = [];
	        for (var x = 0; x < data.length; x++) {
	          temp.push(data[x].data);
	          color.push(data[x].strokeColor);
	        }
	        data = temp;
	      }

	      var asc = function (a,b) { return a - b; };
	      var rows = data.length;
	      var len = data[0].length;

	      if (yAxis && yAxis.multi) {
	        // across multi set
	        // each set of data needs ot have thier own individual min / max
	        min = {};
	        max = {};
	        ySecs = {};
	        for (var i = 0; i < rows; i++) {
	          temp = data[i].slice(0).sort(asc);
	          min[i] = temp[0];
	          ans = getSplits(temp[len - 1]);
	          max[i] = ans.max;
	          ySecs[i] = ans.splits;
	          delete temp;
	        }
	      } else if (opts.stack) {
	        // data reduced base by column to find a new combined min / max
	        for (var i = 0; i < len; i++) {
	          var rowTotal = 0;
	          for (var j = 0; j < rows; j++) {
	              rowTotal += data[j][i];
	          }
	          maxSet.push(rowTotal);
	          max = max < rowTotal ? rowTotal : max;
	          min = min > rowTotal ? rowTotal : min;
	        }
	        
	        if (yAxis) {
	          ans = getSplits(max);
	          max = ans.max;
	          ySecs = ans.splits;
	        }
	      } else if (opts.type == 'bubble-scattered') {
	        // for bubble and need to find min / max across the x, y , z axis
	        min = {};
	        max = {};
	        for (var x = 0; x < 3; x++) {
	          min[x] = Number.MAX_VALUE;
	          max[x] = 0;
	        }

	        for (var i = 0; i < len; i++) {
	          for (var j = 0; j < rows; j++) {
	            for (var c = 0; c < 3; c++) {
	              max[c] = max[c] < data[j][i][c] ? data[j][i][c] : max[c];
	              min[c] = min[c] > data[j][i][c] ? data[j][i][c] : min[c];
	            }
	          }
	        }
	        if (yAxis) {
	          ans = getSplits(max[1]);
	          max[1] = ans.max;
	          ySecs = ans.splits;
	        }

	      } else {
	        // find min / max across the entire data set
	        for (var i = 0; i < rows; i++) {
	          temp = data[i].slice(0).sort(asc);
	          min = min > temp[0] ? temp[0] : min;
	          max = max < temp[len - 1] ? temp[len - 1] : max;
	          delete temp;
	        }

	        if (yAxis) {
	          ans = getSplits(max);
	          max = ans.max;
	          ySecs = ans.splits;
	        }
	      }
	      
	      return {
	          min: min,
	          max: max,
	          maxSet: maxSet,
	          len: len,
	          rows: rows,
	          ySecs: ySecs,
	          color: color
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