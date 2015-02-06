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
	var Common = __webpack_require__(3);

	console.log(Common);

	module.exports = spark = Common.extend({
	  init: function (node) {
	    if (typeof node === 'string') {
	      if (node[0] === '#') {
	        this.element = '<div id="' + node.replace(/^#/,'') + '"></div>';
	      } else {
	        this.element = '<div class="' + node.replace(/^\./,'') + '"></div>';
	      }
	    } else {
	      this.element = element;
	    }
	    this.token = utils.makeToken();
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

	    this._prepare()
	    ._generate();
	    return this;
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
	    this.extend(defaults, this.attributes.opts);
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

	    //this will allow us to have responsive grpah    
	    this.element.style.width = '100%';

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
	    if (typeof result !== 'object') {
	      return result;
	    }
	    return this;
	  },
	  //building svg element in string 
	  /**
	   * _make builds the dom element in json
	   * @param  {[type]} tag   [ html tag ]
	   * @param  {[type]} props [ properties ]
	   * @param  {[type]} data  [ data-set ]
	   * @return {[type]}       [ json ]
	   */
	  _make: this._makeString,
	  //appends the elements
	  // for now lets assume there is only one child
	  _compile : function (node, child) {
	    if (typeof node === 'object') {
	      node.innerHTML = child;
	      return this;
	    }
	    return node.replace(/(.*)(<\/.*>$)/g, function (match, p1, p2) {
	      return p1 + child + p2;
	    });
	  },
	  _pathGenerator: function (data, interval, paddingForLabel, height, heightRatio, padding, multi, maxIterations) {
	    var pathToken = '';
	    //path generator
	    for (var i=0; i<data.length; i++) {
	        if (i === 0) {
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
	  //svg path builder
	  _path : function (data, opts, interval, heightRatio, paddingForLabel, multi, maxIterations) {
	      //get the path
	      //padding is for yaxis
	      var padding = 5;
	      if (opts._shift)
	          padding = 20;
	      var pathToken = this._pathGenerator(data.data, interval, paddingForLabel, opts.chart.height, heightRatio, padding, multi, maxIterations);
	      return this._make('path',{
	          fill: 'none',
	          d: pathToken,
	          stroke: data.color,
	          'stroke-width': '2',
	          'stroke-linejoin': 'round',
	          'stroke-linecap': 'round',
	          'z-index': 9,
	          'class': '_yakoTransitions-'+data.label
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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var utils;
	var Class = __webpack_require__(4);
	/**
	 * deep extend object or json properties
	 * @param  {object} object to extend
	 * @param  {object} object
	 * @return {object} global function object 
	 */
	module.exports = utils = {
	  // alternate to one level deep
	  _makeString: function (tag, props, data) {
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

	    if (!json) return;

	    var keys = Object.keys(json), len = keys.length;
	    var str = '';
	    while (len--) {
	      str += ' ' + header + keys[len] + '="' + json[keys[len]] + '"';
	    }
	    return str;
	  },
	  extend: function (attr, json) {
	    if (!json || !attr) return;

	    var k = Object.keys(json), len = k.length;
	    while(len--) {
	        if (typeof json[k[len]] !== 'object' || Object.prototype.toString.call(json[k[len]]) === '[object Array]') {
	            attr[k[len]] = json[k[len]];
	        } else {    //it has child objects, copy them too.
	            if (!attr[k[len]]) {
	                attr[k[len]] = {};
	            }
	            utils.extend(attr[k[len]], json[k[len]]);
	        }
	    }
	    return this;
	  },
	  //building svg elements
	  _make: function (tag, props, data) {
	      var node = doc.createElementNS('http://www.w3.org/2000/svg',tag);
	      this.assign(node,props);
	      // this._extendDataSet(node, data);
	      this.extend(node.dataset, data);
	      return node;
	  },
	  //appends the elements
	  _compile : function (node, childs, reRender) {
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
	  //finding min & max between multiple set (TODO:: any improvments to multiple array search?)
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
	};

/***/ },
/* 4 */
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