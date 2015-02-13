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
	module.exports = {
	  name: 'yakojs',
	  VERSION: '0.1.0',
	  spark: function (opts) {
	    return new sparkLine(opts);
	  },
	  pie: function (opts) {
	    return new pie(opts);
	  },
	  donut: function (opts) {
	    return new donut(opts);
	  },
	  bubble: function (opts) {
	    return new bubble(opts);
	  },
	  bar: function (opts) {
	    return new bar(opts);
	  }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9);
	var Base = __webpack_require__(10);
	var spark = module.exports = Base.extend({
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
	        data[i].color = data[i].color || this._randomColor();
	        //pushes the data into a set for future analysis
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

	    //determine if padding for labels is needed
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
	      if (opts._shift)
	          padding = 20;
	      var pathToken = this._describeAttributeD(data.data, interval, paddingForLabel, opts.chart, heightRatio, padding, multi, maxIterations);
	      var pathNode = this._make('path',{
	          d: pathToken,
	          stroke: data.color,
	          'stroke-width': '5',
	          'stroke-linejoin': 'round',
	          'stroke-linecap': 'round',
	          'class': '_yakoTransitions-'+data.label,
	          fill: 'none'
	      });

	      if (!opts.chart.fill) {
	        return pathNode;
	      } else {
	        return pathNode + this._make('path', {
	          d: pathToken + this._describeCloseAttributeD(data.data, interval, paddingForLabel, opts.chart, heightRatio, padding, multi, maxIterations),
	          stroke: 'none',
	          'stroke-width': '2',
	          'stroke-linejoin': 'round',
	          'stroke-linecap': 'round',
	          'class': '_yakoTransitions-'+data.label,
	          fill: opts.chart.fill
	        });
	      }
	  }
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var arcBase = __webpack_require__(11);
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
	        var path = '';
	        var radius = circumference / 2;
	        var startAngle = 0;
	        var fills = chart.fills || 0;
	        var strokes = chart.fills || 0;
	        var centerX = chart.width / 2;
	        var centerY = chart.height / 2;
	        for (var i = 0; i < data.length; i++) {
	            var endAngle = startAngle + 360 * data[i];
	            path += this._make('path',{
	                "stroke-linecap": "round",
	                "stroke-linejoin": "round",
	                stroke: strokes[i] || this._randomColor(),
	                d: this._describeArc(centerX, centerY, radius, startAngle, endAngle) + ' L' + centerX + ' ' + centerY,
	                fill: fills[i] || this._randomColor()
	            });
	            startAngle = endAngle;
	        }
	        return path;
	    }
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var arcBase = __webpack_require__(11);
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
	        var path = '';
	        var outerRadius = circumference / 2;
	        var innerRadius = outerRadius / 2;
	        var startAngle = 0;
	        var fills = chart.fills || 0;
	        var strokes = chart.fills || 0;
	        var centerY = chart.height / 2;
	        var centerX = chart.width / 2;
	        for (var i = 0; i < data.length; i++) {
	            var endAngle = startAngle +  360 * data[i];
	            path += this._make('path', {
	                "stroke-linecap": "round",
	                "stroke-linejoin": "round",
	                stroke: strokes[i] || this._randomColor(),
	                fill: fills[i] || this._randomColor(),
	                d: this._describeDonut(centerX, centerY, outerRadius, innerRadius, startAngle, endAngle)
	            });
	            startAngle = endAngle;
	        }
	        return path;
	    },
	    /**
	     * [_describeDonut describes donut path]
	     * @param  {[type]} x           [x cordinates]
	     * @param  {[type]} y           [y cordinates]
	     * @param  {[type]} outerRadius [description]
	     * @param  {[type]} innerRadius [description]
	     * @param  {[type]} startAngle  [description]
	     * @param  {[type]} endAngle    [description]
	     * @return {[type]}             [return path attribute 'd' for donut shape]
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

	var Base = __webpack_require__(10);
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
	    set: function (opts) {
	        opts = opts || 0;
	        // width: 200,
	        // height: 100
	        this.attributes.data = opts.data || [];
	        this.attributes.opts = opts;

	        return this._prepare()
	            ._generate();
	    },
	    _generate: function () {
	        var data = this.attributes.data;
	        var chart = this.attributes.opts.chart;
	        var svg = this._make('svg',{
	            width: '100%',
	            height: chart.height,
	            //No view box?
	            xlms: 'http://www.w3.org/2000/svg',
	            version: '1.1',
	            viewBox: '0 0 '+chart.width + ' '+chart.height,
	        });
	        var result = this._compile(this.element,
	                this._compile(
	                    svg,
	                    this._describeBar(data, chart)
	                    )
	                );
	        return (typeof result == 'string') ? result : this;
	    },
	    // find min max between multiple rows of data sets
	    _findMinMax: function (data, len, rows, opts) {
	        opts = opts || 0;
	        data = typeof data[0] === 'object' ? data : [data];
	        var max = 0;
	        var min = Number.MAX_VALUE;
	        var maxSet = [];

	        // TODO:: implement a faster array search
	        for (var i = 0; i < len; i++) {
	            if (opts.stack) {
	                var rowTotal  = 0;
	                for (var j = 0; j < rows; j++) {
	                    rowTotal += data[j].data[i];
	                }
	                maxSet.push(rowTotal);
	                max = max < rowTotal ? rowTotal : max;
	                min = min > rowTotal ? rowTotal : min;
	            } else {
	                for (var k = 0; k < rows; k++) {
	                    min = min > data[k].data[i] ? data[k].data[i] : min;
	                    max = max < data[k].data[i] ? data[k].data[i] : max;
	                }
	            }
	        }

	        return {
	            min : min,
	            max : max,
	            maxSet: maxSet
	        };
	    },
	    _describeBar: function (data, chart) {
	        if (!data.length) return '';
	        // TODO:: need to account paddings for labels
	        // wrap in array for consistency
	        data = typeof data[0] === 'object' ? data : [data];
	        var height = chart.height;
	        var paddingX = height * 0.1;
	        height = height - paddingX;
	        var width = chart.width;
	        var len = data[0].data.length;
	        var rows = data.length;
	        var gap = width / len;
	        var properties = this._findMinMax(data, len, rows, chart);
	        var path  = '';

	        // TODO:: feels expensive, need to optimize
	        for (var i = 0; i < len; i++) {
	            if (chart.stack) {
	                // the top padding has been taken care off, now account for the bottom padding
	                var relativeMax = (height - paddingX) * properties.maxSet[i] / properties.max;
	                var yAxis = height - relativeMax;
	                var total = 0;
	                for (var j = 0; j < rows; j++) {
	                    path += this._make('rect',{
	                        x: gap * i + (gap/4),
	                        y: yAxis,
	                        width: gap / 2,
	                        height: (data[j].data[i]/properties.maxSet[i] * relativeMax),
	                        fill: this._randomColor()
	                    });
	                    yAxis += (data[j].data[i]/properties.maxSet[i] * relativeMax);
	                }
	            } else {
	                for (var j = 0; j < rows; j++) {
	                    var yAxis = (height - paddingX) * data[j].data[i] / properties.max;
	                    path += this._make('rect',{
	                        x: (gap * (i+1)) - (gap/(j + 1)),
	                        y: height - yAxis,
	                        width: gap / 2,
	                        height: yAxis,
	                        fill: this._randomColor()
	                    });
	                }
	            }
	        }
	        return path;
	    },
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var ArcBase = __webpack_require__(11);
	var bubble = module.exports = ArcBase.extend({
	    _generate: function () {
	        var chart = this.attributes.opts.chart;
	        var data = this.attributes.data;
	        var svg = this._make('svg',{
	            width: '100%',
	            height: chart.height,
	            xlms: 'http://www.w3.org/2000/svg',
	            version: '1.1',
	            viewBox: '0 0 '+chart.width + ' '+chart.height,
	        });

	        var widthOffset = chart.width * 0.2;
	        var path = this._describeHorizontalPath(chart.height, chart.width, widthOffset, chart);
	        path += this._describeBubble(data, chart.height, chart.width, widthOffset, chart);
	        var result = this._compile(this.element,
	                this._compile(
	                    svg,
	                        path
	                    )
	                );
	        return result;
	    },
	    _describeHorizontalPath: function (height, width, widthOffset, chart) {
	        // TODO:: need to account for stroke width 
	        var centerY = height / 2;
	        return this._make('path', {
	            "stroke-linecap": "round",
	            "stroke-linejoin": "round",
	            stroke: this._randomColor(),
	            d: 'M' + widthOffset + ' ' + centerY + ' H' + (width - widthOffset)
	        });
	    },
	    _describeBubble: function (data, height, width, widthOffset, chart) {
	        if (!data) return '';
	        var maxValue = this._getMaxOfArray(data);
	        var dataPoints = data.length;
	        var gap = (width - (widthOffset * 2)) / (dataPoints - 1);
	        var path = '';
	        // TODO:: also let user specify the max radius
	        var maxRadius =  (chart.height < chart.width ? chart.height : chart.width) / 2;
	        // TODO:: need to account for stroke width
	        var centerY = height / 2;
	        for (var i = 0; i < data.length; i++) {
	            path += this._make('circle', {
	                cx: (gap * i) + widthOffset,
	                cy: centerY,
	                r: maxRadius * (data[i] / maxValue),
	                fill: this._randomColor()
	                //stroke-width,
	                //stroke,
	            });
	        }

	        return path;
	    },
	    _getMaxOfArray: function (arr) {
	        return Math.max.apply(null, arr);
	    }
	});

/***/ },
/* 9 */
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Common = __webpack_require__(12);
	var base = module.exports = Common.extend({
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
	    }
	});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Base = __webpack_require__(13);
	var arc = module.exports = Base.extend({
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
	    set: function (opts) {
	        opts = opts || 0;
	        // width: 200,
	        // height: 100
	        this.attributes.data = opts.data || [];
	        this.attributes.opts = opts;

	        return this._prepare()
	            ._generate();
	    },
	    // parent generator that manages the svg
	    _generate: function (){
	        var chart = this.attributes.opts.chart;
	        var data = this.attributes.data;
	        var svg = this._make('svg',{
	            width: '100%',
	            height: chart.height,
	            //No view box?
	            xlms: 'http://www.w3.org/2000/svg',
	            version: '1.1',
	            viewBox: '0 0 '+chart.width + ' '+chart.height,
	        });
	        // find the max width & height
	        var circumference = chart.height < chart.width ? chart.height : chart.width;
	        // converts nums to relative => total sum equals 1
	        var relativeDataSet = this._dataSetToRelative(data);
	        var result = this._compile(this.element,
	                this._compile(
	                    svg,
	                    this._describePath(circumference, relativeDataSet, chart)
	                    )
	                );
	        return (typeof result == 'string') ? result : this;
	    },
	    // arc calculation snippet from http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
	    _polarToCartesian: function (centerX, centerY, radius, angleInDegrees) {
	      var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

	      return {
	        x: centerX + (radius * Math.cos(angleInRadians)),
	        y: centerY + (radius * Math.sin(angleInRadians))
	      };
	    },
	    _describeArc: function (x, y, radius, startAngle, endAngle){

	        var start = this._polarToCartesian(x, y, radius, endAngle);
	        var end = this._polarToCartesian(x, y, radius, startAngle);

	        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

	        var d = [
	            "M", start.x, start.y,
	            "A", radius, radius, 0, arcSweep, 0, end.x, end.y
	        ].join(" ");

	        return d;
	    },
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var utils;
	var Class = __webpack_require__(14);
	/**
	 * deep extend object or json properties
	 * @param  {object} object to extend
	 * @param  {object} object
	 * @return {object} global function object 
	 */
	module.exports = utils = Class.extend({
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
	  _dataSetToRelative: function (data) {
	    data = data || 0;
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
	  // alternate to one level deep
	  _make: function (tag, props, data) {
	    var el = '<' + tag;
	    if (tag === 'svg') {
	      el += ' version="1.1" xlms="http://www.w3.org/2000/svg"';
	    }

	    el += this._makePairs(props);
	    el += this._makePairs('data', data);

	    return el += '></'+tag+'>';
	  },
	  // only supports 1 level deep
	  _makePairs: function (header, json) {
	    if (arguments.length < 2) {
	      json = header;
	      header = '';
	    } else {
	      header += '-';
	    }

	    if (!json) return '';

	    var keys = Object.keys(json), len = keys.length;
	    var str = '';
	    while (len--) {
	      str += ' ' + header + keys[len] + '="' + json[keys[len]] + '"';
	    }
	    return str;
	  },
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
	  //appends the elements
	  _compileNode : function (node, childs, reRender) {
	      if (childs === null ^ childs === undefined) return this;
	      if (typeof childs === Object) childs = [childs];
	      if (Object.prototype.toString.call(childs)==='[object Array]') {
	          if (node.tagName) {
	              if(reRender)
	                  node.innerHTML = '';
	              for (var i in childs)
	                  node.appendChild(childs[i]);
	          } else {
	              Array.prototype.filter.call(node, function (element) {
	                  if (element.nodeName) {
	                      if(reRender)
	                          element.innerHTML = '';
	                      for (var i in childs)
	                          element.appendChild(childs[i]);
	                  }
	              });
	          }
	      } else {
	          if (node.tagName) {
	              if(reRender)
	                  node.innerHTML = '';
	              node.appendChild(childs);
	          } else {
	              Array.prototype.filter.call(node, function (element) {
	                  if (element.nodeName) {
	                      if(reRender)
	                          element.innerHTML = '';
	                      element.appendChild(childs[i]);
	                  }
	              });
	          }
	      }
	      return this;
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
	  // finding min & max between multiple set 
	  // including # of grid lines per graph
	  // (TODO:: any improvments to multiple array search?)
	  _findMinMax: function (data, multi) {
	    var min, max, length;

	    function compareNumbers(a, b) {
	      return a - b;
	    }

	    if (Object.prototype.toString.call(data)!=='[object Array]') {
	        data = [data];
	    }

	    //different initialization
	    if (multi) {
	        max = min = [];
	        for (var i in data) {
	            max[i] = min[i] = data[i][0];
	        }
	    } else {
	        max = min = data[0][0];
	    }

	    length = data[0].length;
	    for (var i in data) {
	        var _data = (data[i].slice()).sort(compareNumbers);
	        length = (length < _data.length ? _data.length : length);
	        //if multi we want the min / max to be independent
	        if (multi) {
	            min[i] = _data[0];
	            max[i] = _data[_data.length-1];
	        } else {
	        //its not multi, we find the entire picture's min max
	            min = (min > _data[0] ? _data[0]: min);
	            max = (max < _data[_data.length-1] ? _data[_data.length-1] : max);
	        }
	    }

	    var findBestFit = function (min, max) {
	        var set = {};
	        var max_ = max;
	        //find label and #borders best fit
	        if (!isNaN(max) && max !== 0) {
	            var ceil = Math.ceil10(max, max.toString().length - 1);
	            if (max.toString().length > 1 && ceil !== 10) {
	                var leftInt = parseInt(ceil.toString().substr(0,2));
	                set.l = leftInt.toString()[0];
	                
	                if (set.l > 4) {
	                    if (set.l === 9) {
	                        set.l = 10;
	                        set.f = 5;
	                    //even
	                    } else if (set.l % 2 === 0) {
	                        set.f = set.l/2;
	                    //odd
	                    } else {
	                        set.f = set.l;
	                    }
	                    max = parseInt(set.l + Math.ceil10(max,max.toString().length - 1).toString().substr(1,Math.ceil10(max,max.toString().length - 1).toString().length - 1));
	                } else {
	                    var secondaryCeil = Math.ceil(max, max.toString().length-2),
	                    secondaryLeftInt = parseInt(secondaryCeil.toString().substr(0,2));
	                    if (secondaryLeftInt.toString()[1] > 4 || secondaryLeftInt.toString()[1] === 0) {
	                        set.l = leftInt;
	                    } else {
	                        set.l = leftInt - 5;
	                    }
	                    set.f = set.l / 5;
	                    max = parseInt(set.l + Math.ceil10(max,max.toString().length - 1).toString().substr(1,Math.ceil10(max,max.toString().length - 1).toString().length - 2));
	                }
	            //single digit
	            } else {
	                if (ceil % 2 === 0) {
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
	            max: (isNaN(max) ^ max === 0? 2 : max),
	            splits: (isNaN(max) ^ max === 0? 2 : set.f), //the number of line splits
	            len: length,
	            min: min
	        };
	    };

	    if (multi) {
	        var result = [];
	        for (var i in max) {
	            result.push(findBestFit(min[i], max[i]));
	        }
	        return result;
	    } else {
	        return findBestFit(min, max);
	    }
	  }
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Common = __webpack_require__(12);
	var base = module.exports = Common.extend({
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
	    }
	});

/***/ },
/* 14 */
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