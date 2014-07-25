    // Closure
    (function(){
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
    })();

    // Closure
    (function (root, doc) {
        'use strict';
        //check if there is a previous version
        var _yako = root.yako || function () {};
        var graphInstance = function () {};
        var yako = root.yako = function (node) {
            var x = new graphInstance();
            return x._init(node);
        };
        //version
        yako.VERSION = '0.0.2';
        yako.eventList = {};
        yako._graphs = {};

        /**
         * deep extend object or json properties
         * @param  {object} object to extend
         * @param  {object} object
         * @return {object} global function object 
         */
        yako.extend = function (attr, json) {
            if (!json)
                return;
            var k = Object.keys(json), len = k.length;
            while(len--) {
                if (typeof json[k[len]] !== 'object' || Object.prototype.toString.call(json[k[len]]) === '[object Array]') {
                    attr[k[len]] = json[k[len]];
                } else {    //it has child objects, copy them too.
                    yako.extend(attr[k[len]], json[k[len]]);
                }
            }
            return this;
        };

        /**
         * extend attributes NS
         * @param  {object} object to be assigned
         * @param  {object} object
         * @return {object} global function object 
         */
        yako.assign = function (attr, json) {
            if (!json)
                return;
            var k = Object.keys(json), len = k.length;
            while(len--) {
                attr.setAttributeNS(null, k[len], json[k[len]]);
            }
            return this;
        };

        /**
         * check if its a function
         * @param  {variable} ambiguous variable
         * @return {boolean} true if its an object 
         */
        yako.isFn = function (object) {
           return !!(object && object.constructor && object.call && object.apply);
        };

        //TODO:: replace this with jymin
        //event binding
        yako.on = function (self, node, event, fn, useCapture) {
            var useCapture = useCapture || false;
            if (yako.eventList[node]) {
                if (yako.eventList[node][event]) {
                    yako.eventList[node][event].push(fn);
                } else {
                    yako.eventList[node][event] = [];
                    yako.eventList[node][event].push(fn);
                }
            } else {
                yako.eventList[node] = {};
                yako.eventList[node][event] = [];
                yako.eventList[node][event].push(fn);
            }
            var nodes = self._getNode(node, true);
            if (nodes && nodes.tagName) {
                nodes.addEventListener(event, fn, useCapture);
            } else if (nodes) {
                Array.prototype.filter.call(nodes, function (element) {
                    if (element.nodeName) {
                        element.addEventListener(event, fn, useCapture);
                    }
                });
            }
            return self;
        };

        //TODO:: replace this with jymin
        //event ubinding
        yako.unbind = function (self, node, event, fn) {
            var nodes = self._getNode(node, true);
            //remove specific event & function
            if (event && fn && yako.isFn(fn)) {
                //check if event exist first && remove from array
                if (yako.eventList[node] && yako.eventList[node][event]) {
                    var found = false;
                    for (var i in yako.eventList[node][event]) {
                        if (yako.eventList[node][event][i] == fn) {
                            yako.eventList[node][event].splice(i,1);
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        return self;
                    }
                } else {
                    return self;
                }
                //remove event
                if(nodes && nodes.tagName) {
                    nodes.removeEventListener(event, fn);
                } else if(nodes) {
                    Array.prototype.filter.call(nodes, function (element) {
                        if (element.nodeName) {
                            element.removeEventListener(event, fn);
                        }
                    });
                }
            //remove specific event
            } else if (event && yako.eventList[node] && yako.eventList[node][event]) {
                var keys = yako.eventList[node][event], len = keys.length;
                while (len--) {
                    if(nodes && nodes.tagName) {
                        nodes.removeEventListener(event, keys[len]);
                    } else if(nodes) {
                        Array.prototype.filter.call(nodes, function (element) {
                            if (element.nodeName) {
                                element.removeEventListener(event, keys[len]);
                            }
                        });
                    }
                }
                yako.eventList[node][event] = [];
            //remove all event
            } else {
                if (yako.eventList[node] && nodes) {
                    var keys = Object.keys(yako.eventList[node]), len = keys.length;
                    while (len--) {
                        var fns = yako.eventList[node][keys[len]];
                        for (var i in fns) {
                            if (nodes && nodes.tagName) {
                                nodes.removeEventListener(keys[len], fns[i]);
                            } else if(nodes) {
                                Array.prototype.filter.call(nodes, function (element) {
                                    if (element.nodeName) {
                                        element.removeEventListener(keys[len], fns[i]);
                                    }
                                });
                            }
                        }
                        yako.eventList[node][keys[len]] = [];
                    }
                }   
            }
            return self;
        };

        /**
         * queues the job to be executed by the watcher (yako.startCycle)
         * @param  {string} token to identify the queue
         * @param  {object} json object params to pass to object to execute
         * @param  {object} object to excute
         */
        var queue = [], _job = [], _complete = [], _cycle = [];
        var blockQueue = {};
        var waitQueue = {};
        yako.queue = function (token, opts, fn) {
            opts = opts || {};
            queue[token] = queue[token] || [];
            _job[token] = _job[token] || [];
            _complete[token] = _complete[token] || [];
            blockQueue[token] = blockQueue[token] || 0;
            waitQueue[token] = waitQueue[token] || false;
            _cycle[token] = _cycle[token] || 0;
            queue[token].push({
                opts : opts,
                fn: fn
            });
        };

        /**
         * starts the cycle
         * the aim of this module is to have all animation to be watched under one event timer instead of spawning multiple ones
         * @param  {string} token to identify the queue
         * @param  {object} object to excute on complete of the cycle
         * @param  {object} the next object to excute
         * @param  {object} the next object to excute on complete of the cycle
         */
        yako.startCycle = function (token, complete, nextState, nextComplete) {
            //make a copy and empty queue
            var workers = nextState || queue[token].slice(0);
            var complete = nextComplete || complete;
            var frames = 69, frame = 0;
            var interval = 1000/frames;
            var before = new Date();
            if (waitQueue[token] == true) {
                _job[token].push(workers);
                _complete[token].push(complete);
                queue[token] = [];
                return;
            }
            waitQueue[token] = true;
            blockQueue[token] = 0;
            if (complete == null) { 
                queue[token] = [];
            }
            function render() {
                if (frame <= frames) {
                    window.setTimeout(function () {
                        var now = new Date();
                        var elapsedTime = (now.getTime() - before.getTime());
                        // inactive gracorrectionph interval 
                        if (elapsedTime > interval) {
                            frame += Math.floor(elapsedTime/interval);
                        } else {
                            frame++;
                        }
                        for (var i in workers) {    
                            blockQueue[token]++;
                            workers[i].opts._cycle = _cycle[token];
                            workers[i].fn(frame-1, frames, workers[i].opts, function () {
                                blockQueue[token]--;
                            });
                        }
                        before = new Date();
                        render();  
                    }, interval);
                } else {
                    if (blockQueue[token] == 0) {
                        complete();
                        _cycle[token]+=1;
                        waitQueue[token] = false;
                        if (_job[token].length !== 0) {
                            yako.startCycle(token, null, _job[token].shift(), _complete[token].shift());
                        }
                    }
                }
            };
            render();
        };

        /**
         * generates a token for the graph
         * @return {string} a random string with numbers 
         */        
        yako.makeToken = function () {
            return Math.random().toString(36).substr(2);
        }

        //for registering a module
        yako.register = function (graphName, prototypes) {
            if (yako._graphs && yako._graphs[graphName])
                throw 'Uncaught Exception: graph module conflict for '+ graphName;
            yako._graphs[graphName] = prototypes;
        };

        //extend prototype + allow chaining on public functions and most private functions
        yako.extend(graphInstance.prototype, {
            extend: yako.extend,
            assign: yako.assign,
            //init function
            _init: function (node) {
                this.token = yako.makeToken();
                this.attributes = {};
                this._graphs = {};
                this._getNode(node);
                return this;
            },
            _getElement: function (obj, node) {
                if(node.match(/^#/))
                    return obj.getElementById(node.replace(/^#/,''));
                else if (node.match(/^\./))
                    return obj.getElementsByClassName(node.replace(/^\./,''));
                else
                    return obj.getElementsByTagName(node);
            },
            //retrieving parent node
            //TODO:: Update to support, current nesting only supports #ID > Class or #ID > #ID > ... > Class
            //.class .class
            //TODO:: replace this with jymin - with all() - need to ask if it supports feeding in an HTMLElement
            //#id .class [Done]
            _getNode: function (node, raw, opts) {
                if (node instanceof HTMLElement && (opts === undefined || opts === null)) {
                    this.element = node;
                    return this;
                }
                if (node instanceof HTMLElement && (opts !== undefined || opts !== null)) {
                    return this._getElement(node, opts);
                }
                if (Object.prototype.toString.call(node)==='[object Array]' || node.tagName) {
                    var arr = opts.split(' ');
                    if(arr.length > 1)
                        return this._getNode(this._getElement(node, arr.shift()), null, arr.join(',',' '));
                    else
                        return this._getElement(node, arr.shift());
                }
                if (node.split(' ').length > 1) {
                    var arr = node.split(' ');
                    return this._getNode(this._getElement(doc, arr.shift()),null, arr.join(',',' '));
                } else {
                    var element = this._getElement(doc, node);
                }
                if (raw) {
                    return element;
                } else {
                    this.element = element;
                    return this;
                }
            },
            //building svg elements
            _make: function (tag, props, data) {
                var node = doc.createElementNS('http://www.w3.org/2000/svg',tag);
                this.assign(node,props);
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
            _pathGenerator: function (data, interval, paddingForLabel, height, heightRatio, padding) {
              var pathToken = '';
              //path generator
              for (var i=0; i<data.length; i++) {
                  if (i === 0) {
                      pathToken += 'M '+(interval*i+parseInt(paddingForLabel))+' '+ (height - (data[i] * heightRatio)-padding);
                  } else {
                      pathToken += ' L '+(interval*i+parseInt(paddingForLabel))+' '+ (height - (data[i] * heightRatio)-padding);
                  }
              }
              return pathToken;
            },
            //svg path builder
            _path : function (data, opts, interval, heightRatio, paddingForLabel) {
                //get the path
                //padding is for yaxis
                var padding = 5;
                if (opts._shift)
                    padding = 20;
                var pathToken = this._pathGenerator(data.data, interval, paddingForLabel, opts.chart.height, heightRatio, padding);
                return this._make('path',{
                    fill: 'none',
                    d: pathToken,
                    //if stroke is not define, generate a random color!
                    stroke: data.color || '#'+(Math.random()*0xFFFFFF<<0).toString(16),
                    'stroke-width': '2',
                    'stroke-linejoin': 'round',
                    'stroke-linecap': 'round',
                    'z-index': 9,
                    'class': '_yakoTransitions'
                },{
                    label: data.label
                });
            },
            //svg circle builder
            _circle : function (data, opts, interval, heightRatio) {
                var circles = [],
                    shift = 0;

                if (opts._shift)
                    shift = 50;

                if (opts.chart.showPointer === false)
                    return circles;

                var utcMult = this._utcMultiplier(opts.xAxis.interval);

                for (var i=0;i<data.data.length;i++) {
                    circles.push(this._make('circle',{
                        fill: data.nodeColor || 'red',
                        r: 5,
                        cx: (interval*i + parseInt(shift)),
                        cy: (opts.chart.height - (data.data[i] * heightRatio) - shift),
                        'class': 'graphData',
                        'z-index': 3
                    },{
                        info: encodeURIComponent(JSON.stringify({
                            data : data.data[i],
                            label : data.label || '',
                            date: (opts.xAxis.format === 'dateTime' ? this._formatTimeStamp(opts, opts.xAxis.minUTC+ parseInt(((i+opts._shiftIntervals)) * utcMult)) : ''),
                            interval : interval * (i+opts._shiftIntervals),
                            cx: (interval *i + parseInt(shift)),
                            cy: (opts.chart.height - (data.data[i] * heightRatio) - shift)
                        }))
                    }));
                }
                return circles;
            },
            _utcMultiplier: function(tick) {
                var mili = 1000,
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
            //for reRendering labels and borders
            _reRenderLabelAndBorders: function (data, opts, interval, heightRatio, min, max, splits, paddingForLabel) {
                if (!opts._shift) return null;
                var self = this,
                    padding = paddingForLabel,
                    height = opts.chart.height - 25,
                    heightFactor = height / max;
                //animate the label for xaxis
                this.currentCycle = this.currentCycle || 0;
                this.tickCycle = this.tickCycle || 0;
                this.defaultStartValue = 0;
                var delayedRenderYAxis = function (frame, frames, options, done) {
                    if (self.currentCycle != options._cycle || self.currentCycle == 0) {
                        var yaxis = self._getNode(self.element, null, '.yaxis')[0];
                        yaxis.innerHTML = '';
                        var borders = self._getNode(self.element, null, '.borders')[0];
                        borders.innerHTML = '';
                        var i = splits + 1;
                        while(i--) {
                            var value = (max/splits)*(splits-i),
                            factor = (heightFactor * (max-value));
                            factor = (isNaN(factor)? height : factor);
                            var x = self._make('text',{
                                y: factor + 10,
                                x: padding - 10,
                                'font-size': 12,
                                'font-family': opts.chart['font-family'],
                                'text-anchor': 'end'
                            });
                            var xaxis = parseInt((factor+5).toFixed(0)) + 0.5;
                            var border = self._make('path',{
                              'd' : 'M '+padding + ' '+ xaxis + ' L ' + (opts.chart.width) + ' ' + xaxis,
                              'stroke-width': '1',
                              'stroke': '#c0c0c0',
                              'fill': 'none',
                              'opacity': '1',
                              'stroke-linecap': 'round'
                            });

                            self._compile(yaxis, x)
                            ._compile(borders, border);
                            x.innerHTML = (isNaN(value)? 0 : value);
                        }
                    }
                    done();
                }
                yako.queue(self.token, null, delayedRenderYAxis);

                var xaxisNodes = this._getNode(this.element, null, '.xaxis')[0].getElementsByTagName('text');
                var textNodes = [];

                Array.prototype.filter.call(xaxisNodes, function (element) {
                    if (element.nodeName) {
                        textNodes.push(element);
                    }
                });
                var oldData = this.attributes.oldData[0].data,
                dataAdded = this.attributes._newDataLength,
                tickGap = this.attributes._tickGap;

                //TODO:: this part to handle the animation is pretty dirty - requires cleaning and merging all animation under one timer.

                var animateXaxis = function (frame, frames, options, done) {
                    // var textNodes = options.nodes;
                    var o = self.defaultStartValue;
                    if (self.currentCycle != options._cycle) {
                        self.currentCycle +=1;
                        self.tickCycle +=1;
                        if (self.tickCycle == tickGap) {
                            self.tickCycle = 0;
                        }
                        if(textNodes[0].attributes.x.value < 0) {
                            var shifted = textNodes.shift();
                            if (shifted.parentNode)
                                shifted.parentNode.removeChild(shifted);
                            textNodes = [];
                            Array.prototype.filter.call(xaxisNodes, function (element) {
                                if (element.nodeName) {
                                    textNodes.push(element);
                                }
                            });
                        }
                    }
                    var flagToRemove = false;
                    for (var i=0; i<oldData.length + dataAdded; i++) {
                        var xaxis = (((interval*i-1)  + ((interval*(i-1) - interval*(i))/frames * (frame))) + parseInt(padding));
                        if ((i+self.tickCycle) % tickGap == 0) {
                            // if (textNodes[o].attributes.x.value <= 0) {
                            //     o+=1;
                            // }
                            if (textNodes[o+1] === undefined) {
                                var tickInterval = parseInt(self.attributes._tickGap);
                                var node = self._make('text', {
                                    y: height + 20,
                                    x: 1500,
                                    'font-size': 10,
                                    'font-family': opts.chart['font-family']
                                });
                                self.attributes._lastTickPos += tickGap;
                                node.innerHTML = self._formatTimeStamp(opts, opts.xAxis.minUTC+ parseInt(((self.attributes._lastTickPos)) *  self._utcMultiplier(opts.xAxis.interval)));
                                textNodes.push(node);
                                textNodes[o].parentNode.appendChild(node);
                            } else {
                                //the new position calculation is not correct!!!
                                if ( xaxis < textNodes[o].attributes.x.value) {
                                    textNodes[o].setAttributeNS(null, 'x', xaxis);
                                }
                            }
                            o+=1;
                        }

                        if (i == 0 && (xaxis <= padding && textNodes[0].x.baseVal[0].value <= padding)) {
                            textNodes[0].style.opacity = ((frames - frame * 2)/ frames);
                        }
                        if (i==0 && (xaxis <= 0 && textNodes[0].x.baseVal[0].value <= 0)) {
                                 flagToRemove = true;
                        }
                    }

                    if (flagToRemove) {
                        if(textNodes[0].parentNode) {
                            textNodes[0].parentNode.removeChild(textNodes[0]);
                        }
                    }
                    done();   
                };
                yako.queue(self.token, null, animateXaxis);
                return this;
            },
            //computes and distributes the label
            _labelAndBorders: function (data, opts, interval, heightRatio, min, max, splits, paddingForLabel) {
                if (!opts._shift) return null;
                var self = this,
                    padding = paddingForLabel,
                    height = opts.chart.height - 25;

                //yAxis
                var i = splits + 1,
                    arr = [],
                gLabelYaxis = this._make('g',{
                  'class': 'yaxis'
                }),
                gLabelXaxis = this._make('g', {
                  'class': 'xaxis'
                }),
                gBorders = this._make('g', {
                  'class': 'borders',
                  'z-index': '1'
                })

                var heightFactor = height / max;

                while(i--) {
                    var value = (max/splits)*(splits-i),
                    factor = (heightFactor * (max-value));
                    factor = (isNaN(factor)? height : factor);
                    var x = this._make('text',{
                        y: factor + 10,
                        x: padding - 10,
                        'font-size': 12,
                        'font-family': opts.chart['font-family'],
                        'text-anchor': 'end'
                    });
                    var xaxis = parseInt((factor+5).toFixed(0)) + 0.5;
                    var border = this._make('path',{
                      'd' : 'M '+padding + ' '+ xaxis + ' L ' + (opts.chart.width) + ' ' + xaxis,
                      'stroke-width': '1',
                      'stroke': '#c0c0c0',
                      'fill': 'none',
                      'opacity': '1',
                      'stroke-linecap': 'round'
                    })
                    this._compile(gLabelYaxis, x)
                    ._compile(gBorders, border);
                    x.innerHTML = (isNaN(value)? 0 : value);
                }
                arr.push(gLabelYaxis);
                arr.push(gBorders);

                //xAxis
                //Accepted xAxis - [1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
                var len = data[0].data.length,
                    tick = opts.xAxis.interval,
                    formatSpec = '',
                    format = {
                        tickInterval: (/\d+/.test(tick) ? tick.match(/\d+/)[0] : 1)
                    },
                    mili = 1000,
                    s = 60,
                    m = 60,
                    h = 24,
                    D = 30,
                    M = 12,
                    Y = 1,
                    label = opts.xAxis.dateTimeLabelFormat;

                //what to do if the interval and format dont match
                //eg: given 1D interval and its requesting a format of per hour
                //should it be a straight line for that period ?
                if (opts.xAxis.format === 'dateTime') {
                    //to get the UTC time stamp multiplexer
                    format.utc = this._utcMultiplier(tick);

                    //figures out the tick size
                    if (
                        (/ss/.test(label) && /s$/.test(tick))
                        || (/mm/.test(label) && /m$/.test(tick))
                        || (/hh/.test(label) && /h$/.test(tick))
                        || (/DD/.test(label) && /D$/.test(tick))
                        || (/MM/.test(label) && /M$/.test(tick))
                        || (/YY/.test(label) && /Y$/.test(tick))
                        )
                    {
                        format.tickSize = 1;
                    } else if (
                        (/mm/.test(label) && /s$/.test(tick))
                        || (/hh/.test(label) && /m$/.test(tick))
                    ) {
                        format.tickSize = s; //m
                    } else if (
                        /hh/.test(label) && /s$/.test(tick)
                    ) {
                        format.tickSize = s * m;
                    } else if (
                        /DD/.test(label)
                    ) {
                        if (/s$/.test(tick))
                            format.tickSize = s * m * h;
                        if (/m$/.test(tick))
                            format.tickSize = m * h;
                        if (/h$/.test(tick))
                            format.tickSize = h;
                    } else if (
                        /MM/.test(label)
                    ) {
                        if (/s$/.test(tick))
                            format.tickSize = s * m * h * D;
                        if (/m$/.test(tick))
                            format.tickSize = m * h * D;
                        if (/h$/.test(tick))
                            format.tickSize = h * D;
                        if (/D$/.test(tick))
                            format.tickSize = D;
                    } else if (
                        /YY/.test(label)
                    ) {
                        if (/s$/.test(tick))
                            format.tickSize = s * m * h * D * M;
                        if (/m$/.test(tick))
                            format.tickSize = m * h * D * M;
                        if (/h$/.test(tick))
                            format.tickSize = h * D * M;
                        if(/YY/.test(label) && /D$/.test(tick))
                            format.tickSize = D * M;
                        if (/M$/.test(tick))
                            format.tickSize = M;
                    } else {
                        throw 'Error: Incorrect Label Format';
                    }

                    //this is not re-render the labels but adding in new document objects
                    var i = 0,
                        counter = 0,
                        tickIntervalArray = [];
                    while (len--) {
                        counter++;
                        if (format.tickSize*format.tickInterval === counter || i === 0) {
                            tickIntervalArray.push(i);
                            var x = this._make('text',{
                                //plus 20 is for padding
                                y: height + 20,
                                x: padding + interval * i,
                                'font-size': 10,
                                'font-family': opts.chart['font-family']
                            },{
                                tickPos : i
                            });
                            x.innerHTML = this._formatTimeStamp(opts, opts.xAxis.minUTC+ parseInt(((i+opts._shiftIntervals)) * format.utc)); //(interval * (i+opts._shiftIntervals)).toFixed(0);
                            this._compile(gLabelXaxis, x);
                            if (i !== 0 || format.tickSize === counter)
                                counter = 0;
                        }
                        i++;
                    }
                    arr.push(gLabelXaxis);
                    this.attributes._lastTickPos = tickIntervalArray[tickIntervalArray.length-1];
                    this.attributes._tickGap = tickIntervalArray[1];
                    this.attributes._tickGapCircuit = 0;
                }
                return arr;
            },
            //formats the time stamp
            _formatTimeStamp: function (opts, time) {
                var format = opts.xAxis.dateTimeLabelFormat,
                    dateObj = new Date(time),
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
            },
            //sig fig rounding
            _sigFigs: function (n, sig) {
                var mult = Math.pow(10,
                    sig - Math.floor(Math.log(n) / Math.LN10) - 1);
                return Math.round(n * mult) / mult;
            },
            //finding min & max between multiple set (any improvments to multiple array search)
            _findMinMax: function (data) {
                var min, max, length;

                function compareNumbers(a, b) {
                  return a - b;
                }

                if (Object.prototype.toString.call(data)!=='[object Array]') {
                    data = [data];
                }

                max = min = data[0][0];
                length = data[0].length;
                for (var i in data) {
                    var _data = (data[i].slice()).sort(compareNumbers);
                    length = (length < _data.length ? _data.length : length);
                    min = (min > _data[0] ? _data[0]: min);
                    max = (max < _data[_data.length-1] ? _data[_data.length-1] : max);
                }

                var set = {};
                //TODO:: this piece of code a bit naive, should be optimized during next refactor
                if (!isNaN(max) && !max == 0) {
                    var leftInt4 = parseInt(Math.ceil10(max,max.toString().length - 1).toString()[0]),
                        leftInt5 = parseInt(Math.ceil10(max,max.toString().length - 1).toString()[0]),
                        leftInt2 = parseInt(Math.ceil10(max,max.toString().length - 1).toString()[0]);

                    var res4 = leftInt4 % 4;
                    if (res4 !== 0)
                        leftInt4+= 4 - res4;

                    set.l = leftInt4;
                    set.s = leftInt4/4;
                    set.f = 4;
             
                    var res5 = leftInt5 % 5;
                    if (res5 !== 0)
                        leftInt5+= 5 - res5;

                    if (leftInt5/5 < set.s) {
                        set.l = leftInt5;
                        set.s = leftInt5/5;
                        set.f = 5; 
                    }

                    var res2 = leftInt2 % 2;
                    if (res2 !== 0)
                        leftInt2+= 2 - res2;

                    if (leftInt2 % 2 == 0) {
                        if (leftInt2/2 <= set.s) {
                            set.l = leftInt2;
                            set.s = leftInt2/2;
                            set.f = 2; 
                        }   
                    }

                    if (15 < max && max <= 20) {
                        set.l = 2;
                        set.f = 4;
                    } else if ( 5 < max && max <= 10 ) {
                        set.l = 1;
                        set.f = 5;
                    }

                    if ( 1 < max && max < 5) {
                        max = 5;
                        set.f = 5;
                    } else if ( 10 < max && max <= 15) {
                        max = 15;
                        set.f = 3;
                    } else {
                        max = parseInt(set.l + Math.ceil10(max,max.toString().length - 1).toString().substr(1,Math.ceil10(max,max.toString().length - 1).toString().length - 1))
                    }
                }

                return {
                    min: min,
                    max: (isNaN(max) ^ max == 0? 2 : max),
                    len: length,
                    splits: (isNaN(max) ^ max == 0? 2 : set.f)  //the number of line splits
                };
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
                        width : '100%',
                        height : opts.chart.height,
                        //No view box?
                        viewBox : '0 0 '+opts.chart.width + ' '+opts.chart.height,
                        // 'preserveAspectRatio': 'none'
                    }),
                    sets = [],
                    reRender = reRender || false,
                    self = this;

                //this will allow us to have responsive grpah    
                this.element.style.width = '100%';

                if (Object.prototype.toString.call(data) !== '[object Array]') {
                    data = [data];
                }

                for (var i in data) {
                    sets.push(data[i].data);
                }

                //need to account for the old data that is getting pushed out
                if (this.attributes.oldData) {
                    var od = this.attributes.oldData;
                    for(var i in od) {
                        sets.push(od[i].data);
                    }
                }
                // console.log(this.attributes.oldData);
                //find min / max point
                //assume all data are positive for now;
                var _tmp = this._findMinMax(sets),
                min = _tmp.min,
                max = _tmp.max,
                splits = _tmp.splits,
                interval = this._sigFigs((opts.chart.width / (_tmp.len-1)),8),
                heightRatio = (opts.chart.height - 10) / (max);

                if (opts.xAxis.format) {
                    if (opts.xAxis.format === 'dateTime') {
                        if (opts.chart.width - 100 <= 0 || opts.chart.height - 100 <= 0)
                            console.warn('insufficent width or height (min 100px for labels), ignored format: ' +opts.xAxis.format);
                        else {
                            //TODO:: standardize this part
                            interval = (opts.chart.width-42) / (_tmp.len-1);
                            heightRatio = (opts.chart.height-25.5) / (max);
                            opts._shift = true;
                        }
                    }
                }

                //determine if padding for labels is needed
                var paddingForLabel = (opts._shift ? 40 : 0);

                //we are now adding on to exisiting data and to allow animation
                if (reRender) {
                    this._reRenderLabelAndBorders(data, opts, interval, heightRatio, min, max, splits, paddingForLabel, true);
                    var nodes = this._getNode(this.element, null, 'g');
                    for (var i in data) {
                        this._reRenderPath(nodes, data[i], opts, interval, heightRatio, paddingForLabel, this.attributes.oldData[i]);
                    }
                    yako.startCycle(this.token, function (){
                        //complete
                    });
                    return this;
                }

                //svg z index is compiled by order
                this._compile(svg, this._labelAndBorders(data, opts, interval, heightRatio, min, max, splits, paddingForLabel, false));

                //adding each path & circle
                for (var i in data) {
                    var g = this._make('g',{
                        'z-index': 9
                    },{
                        label: data[i].label
                    });
                    this._compile(g, this._path(data[i], opts, interval, heightRatio, paddingForLabel))
                    // ._compile(g,this._circle(data[i], opts, interval, heightRatio, paddingForLabel))
                    ._compile(svg,g);
                }
                //adding a label
                this._compile(this.element,svg, reRender);
                return this;
            },
            //reRender the path by modify the current path element, such that we dont do a deletion and insertion.
            _reRenderPath: function (nodes, data, opts, interval, heightRatio, paddingForLabel, oldData) {
              //now need to look for the new one
                var newData = data.data,
                  oldData = oldData.data,
                  height = opts.chart.height,
                  dataAdded = this.attributes._newDataLength,
                  self = this;
             
              //We will be shifiting the yaxis only for linear graph
              //This function would be queued into the same timer to render all components for this specific graph, such that we do not overload the timer
              //TODO:: OPTIMIZE the code
              var animateGraph = function (frame, frames, options, done) {
                    var pathToken = '', 
                    path = options.path;
                    var o = 0;
                    for (var i=0; i < oldData.length + dataAdded; i++) {
                        //for smoothing the shifting
                        var xaxis = (((interval*i-dataAdded)  + ((interval*(i-dataAdded) - interval*(i))/frames * frame)) + parseInt(paddingForLabel));
                        //to determine which set of data to use
                        if (i >= oldData.length) {
                          var yaxis = (height-(newData[i-dataAdded] * heightRatio) - 20);
                        } else {
                          var yaxis = (height - (oldData[i] * heightRatio) - 20);
                        }

                        //smoothing the line when leaving the grid
                        if (xaxis <= paddingForLabel) {
                            xaxis = paddingForLabel;
                            yaxis = height - (oldData[0] + ((oldData[1] - oldData[0]) * frame / frames)) * heightRatio - 20;
                        }

                        if (i === 0) {
                            pathToken += 'M '+ xaxis +' '+ yaxis;
                        } else {
                            pathToken += ' L '+ xaxis +' '+ yaxis;
                        }
                    }
                    path.setAttributeNS(null, 'd', pathToken);
                    //call done for work completion
                    done();
              }

              var self = this;
              //gets the associated path
              Array.prototype.filter.call(nodes, function (e) {
                  if(e.nodeName && e.dataset.label == data.label) {
                        var path = e.getElementsByTagName('path')[0];
                        yako.queue(self.token, {
                            path: path
                        }, animateGraph);
                  }
              });
            },
            //attach events
            _attach: function () {
                return this;
                if (!this.hover)
                    return this;

                var div = doc.createElement('div');
                div.className = 'graphHover';
                div.style.position = 'absolute';
                div.style.display = 'none';
                this._compile(this.element, div);
                var self = this;

                yako.unbind(this,'#'+this.element.id +' .graphData');
                yako.on(this, '#'+this.element.id +' .graphData', 'mouseover', function (e) {
                    e.target.style.fill = 'blue';
                    var data = JSON.parse(decodeURIComponent(e.target.dataset.info));
                     //TODO:: make the content customizable by the user
                    div.innerHTML = '<b>Data: ' + data.data + '</b><br><b>Interval: '+( data.date ? data.date : data.interval )+'</b>';
                    div.style.display = 'block';
                    div.style.top = data.cy + 5;
                    div.style.left = data.cx + 15;
                });
                yako.on(this, '#'+this.element.id +' .graphData', 'mouseout', function (e) {
                    e.target.style.fill = 'red';
                    div.style.display = 'none';
                });
                return this;
            },
            //extends the api & will not affect the parent name space - a plug & play system
            _spawn : function (graphName) {
                if (this._graphs[graphName])
                    return this._graphs[graphName];
                var self = this;
                var newApi = function () {};
                yako._graphs[graphName]._contructor = function () {
                    this.root = self;
                    return this;
                };
                yako.extend(newApi.prototype, yako._graphs[graphName]);
                var x = new newApi();
                this._graphs[graphName] = x._contructor();
                return this._graphs[graphName];
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
                yako.extend(defaults, this.attributes.opts);
                this.attributes.opts = defaults;
                            this.lock = {};
                            this.lock.label = 0;
                            // this.lock.currentLabel = 0;
                return this;
            },
            //the graph data & options setter
            set: function (opts) {
                var opts = opts || {};
                this.attributes.data = opts.data || [];
                opts._originalDataLength = this.attributes.data[0].data.length;
                this.attributes.opts = opts;
                if(opts.chart && opts.chart.type && yako._graphs[opts.chart.type]) {
                    return this._spawn(opts.chart.type);
                } else {
                    this._prepare()
                    ._reSize()
                    ._generate();
                }
                return this;
            },
            //detecting resize and update the graph
            //TODO:: update it such that it will only affect xaxis changes
            _reSize: function () {
                var self = this,
                    prev = self.element.scrollWidth;
                self.attributes.opts.chart.width = self.element.scrollWidth;
                window.addEventListener('resize', function () {
                    if (prev !== self.element.scrollWidth) {
                        self.attributes.opts.chart.width = self.element.scrollWidth;
                        self.element.innerHTML = '';
                        self._generate();
                    }
                }, false);
                return this;
            },
            //the graph hover options
            hoverable: function (opts) {
                this.hover = true;
                this.attributes.hover = opts;
                this._attach();
                return this;
            },
            //remove hover events
            removeHover: function () {
                yako.unbind(this,'#'+this.element.id+ ' .graphData', 'mouseout')
                .unbind(this,'#'+this.element.id+' .graphData', 'mouseover');
                return this;
            },
            //to support increment data for 3 scenarios
            //+ adding new set of data
            //+ partial update on one set of data
            //+ updating all data at once
            //INPUT: json object or array of object
            //RETURN: this
            incrementData: function (json) {
                //analyze what is needed to be update
                this._appendZeroAndData(this.attributes.data, json)
                    ._shiftData()
                    ._generate(true)
                    ._attach();
                //to keep delivering previous data untill new data comes in.
                // this._autoflow(json);
            },
            //if the chart is accumulateIncrementalData = false, shift the labels (ie: we discard the old data that is outside of the view box)
            _shiftData: function () {
                var opts = this.attributes.opts;
                if (opts.chart.accumulateIncrementalData)
                    return this;
                var data = this.attributes.data,
                    diff = data[0].data.length - opts._originalDataLength;
                    // diff = this.attributes.newDataLength;

                opts._shiftIntervals += (diff);
                for (var i in data) {
                    for (var j = 0; j<diff;j++)
                        data[i].data.shift();
                }
                return this;
            },
            //generates a bunch of zeros
            _zeroGenerator: function (len) {
                var arr = [];
                while(len--) arr.push(0);
                return arr;
            },
            //appends new data to old data / zeros data if one of the chart is missing data
            _appendZeroAndData: function (oldData, newData) {
                //cast them into an array if they are not in array yet
                if (typeof oldData === Object) oldData = [oldData];
                if (typeof newData === Object) newData = [newData];

                //just to make your we have both data
                if(!oldData || !newData)
                    return this;

                //deep copy hack
                this.attributes.oldData = JSON.parse(JSON.stringify(oldData));

                var oldLen = oldData[0].length,
                    newLen = 0;

                //check if the corresponding label exist for the data;
                for (var i in newData) {
                    for (var j in oldData) {
                        if (oldData[j].label == newData[i].label) {
                            newData[i]._exist = true;
                            break;
                        }
                    }
                }

                //determine the new max length && check if data exist;
                //get new len & push non existing data to old data
                for (var i in newData) {
                    if (newData[i] && newData[i]._exist === undefined) {
                        if (newData[i].data.length > oldLen &&
                            (newData[i].data.length - oldLen) > newLen) {
                            newLen = newData[i].data.length;
                            oldData.push(newData.splice(i,1));
                        }
                    } else if (newData[i] && newData[i]._exist === true){
                        if(newData[i].data.length > newLen)
                            newLen = newData[i].data.length;
                    }
                }
                //store the length
                this.attributes._newDataLength = newLen;

                //append new data into old data & zeroing unmatched array length;
                for (var i in oldData) {
                    var updated = false;
                    for(var j in newData) {
                        if (oldData[i].label == newData[j].label) {
                            var zeros = this._zeroGenerator(newLen - newData[j].data.length);
                            oldData[i].data=(oldData[i].data.concat(newData[j].data.concat(zeros)));
                            updated = true;
                            break;
                        }
                    }
                    if(!updated) {
                        var zeros = this._zeroGenerator(newLen);
                        oldData[i].data = oldData[i].data.concat(zeros);
                    }
                }

                return this;
            }
        });
    })(window, document);
