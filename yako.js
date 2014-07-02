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
    yako.VERSION = '0.0.1';
    yako.eventList = {};
    yako._graphs = {};

    //to extend properties
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

    //to assign attributes NS
    yako.assign = function (attr, json) {
        if (!json)
            return;
        var k = Object.keys(json), len = k.length;
        while(len--) {
            attr.setAttributeNS(null, k[len], json[k[len]]);
        }
        return this;
    };
    //check if is function
    yako.isFn = function (object) {
       return !!(object && object.constructor && object.call && object.apply);
    };

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
        //#id .class [Done]
        _getNode: function (node, raw, opts) {
            var element;
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
                element = this._getElement(doc, node);
            }
            if (raw) {
                return element;
            } else {
                this.element = element;
                return this;
            }
            // return (this.element !== null ? this : (throw 'Uncaught Node Element: '+ node + ' is null'));
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
        //svg path builder
        _path : function (data, opts, interval, heightRatio) {
            var pathToken = "",
                shift = 0;
            //shift for labeling
            if (opts._shift)
                shift = 100;
            //path generator
            for (var i=0; i<data.data.length; i++) {
                if (i === 0) {
                    pathToken += 'M '+(interval*i+parseInt(shift))+' '+ (opts.chart.height - (data.data[i] * heightRatio) - shift);
                } else {
                    pathToken += ' L '+(interval*i+parseInt(shift))+' '+ (opts.chart.height - (data.data[i] * heightRatio) - shift);
                }
            }

            return this._make('path',{
                fill: 'none',
                d: pathToken,
                //if stroke is not define, generate a random color!
                stroke: data.color || '#'+(Math.random()*0xFFFFFF<<0).toString(16),
                'stroke-width': '2',
                'stroke-linejoin': 'round',
                'stroke-linecap': 'round',
                'z-index': 1
            },{
                label: data.label
            });
        },
        //svg circle builder
        _circle : function (data, opts, interval, heightRatio) {
            var circles = [],
                shift = 0;
            if (opts._shift)
                shift = 100;
            if (opts.chart.showPointer === false)
                return circles;

            for (var i=0;i<data.data.length;i++) {
                circles.push(this._make('circle',{
                    fill: data.nodeColor || 'red',
                    r: 5,
                    cx: (interval*i + parseInt(shift)),
                    cy: (opts.chart.height - (data.data[i] * heightRatio) - shift),
                    class: 'graphData',
                    'z-index': 3
                },{
                    info: encodeURIComponent(JSON.stringify({
                        data : data.data[i],
                        label : data.label || '',
                        interval : interval * (i+opts._shiftIntervals),
                        cx: (interval *i + parseInt(shift)),
                        cy: (opts.chart.height - (data.data[i] * heightRatio) - shift)
                    }))
                }));
            }
            return circles;
        },
        //computes and distributes the label
        _label: function (data, opts, interval, heightRatio, min, max) {
            if (!opts._shift) return null;
            var height = opts.chart.height - 100;

            //yAxis
            //TODO:: NEED TO fix ADJUSTED height - incorrect scaling ???
            //NEED TO VERIFY
            var i = 5,
                arr = [];
            while(i--) {
                if (i === 0) break;
                var x = this._make('text',{
                    y: (height/4) * (4-i),
                    x: 0,
                    'font-size': 15,
                    'font-family': '"Open Sans", sans-serif'
                });
                // console.log(height-this._sigFigs(((max/4)*i),1), this._sigFigs(((max/4)*i),1));
                x.innerHTML = this._sigFigs(((max/4)*i),1);
                arr.push(x);
            }

            //Accepted xAxis - [1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
            var len = data[0].data.length,
                ints = opts.xAxis.interval,
                formatSpec = '',
                format = {
                    tickInterval: (ints.match(/\d+/) && ints.match(/\d+/).length ? ints.match(/\d+/)[0] : 1)
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
                if (ints.match('s$'))
                    format.utc = mili;
                else if (ints.match('m$'))
                    format.utc = s * mili;
                else if (ints.match('h$'))
                    format.utc = s * m * mili;
                else if (ints.match('D$'))
                    format.utc = s * m * h * mili;
                else if (ints.match('M$'))
                    format.utc = s * m * h * D * mili;
                else if (ints.match('Y'))
                    format.utc = s * m * h * D * M * mili;

                //figures out the tick size
                if (opts.xAxis.dateTimeLabelFormat.match('ss')) {
                    if (ints.match('s$'))
                        format.tickSize = 1;
                } else if (opts.xAxis.dateTimeLabelFormat.match('mm')) {
                    if (ints.match('s$'))
                        format.tickSize = s * m;
                    if (ints.match('m$'))
                        format.tickSize = 1;
                } else if (opts.xAxis.dateTimeLabelFormat.match('hh')) {
                    if (ints.match('s$'))
                        format.tickSize = s * m;
                    if (ints.match('m$'))
                        format.tickSize = m;
                    if (ints.match('h$'))
                        format.tickSize = 1;
                } else if (opts.xAxis.dateTimeLabelFormat.match('DD')) {
                    if (ints.match('s$'))
                        format.tickSize = s * m * h;
                    if (ints.match('m$'))
                        format.tickSize = m * h;
                    if (ints.match('h$'))
                        format.tickSize = h;
                    if (ints.match('D$'))
                        format.tickSize = 1;
                } else if (opts.xAxis.dateTimeLabelFormat.match('MM')) {
                    if (ints.match('s$'))
                        format.tickSize = s * m * h * D;
                    if (ints.match('m$'))
                        format.tickSize = m * h * D;
                    if (ints.match('h$'))
                        format.tickSize = h * D;
                    if (ints.match('D$'))
                        format.tickSize = D;
                    if (ints.match('M$'))
                        format.tickSize = 1;
                } else if (opts.xAxis.dateTimeLabelFormat.match('YY')) {
                    if (ints.match('s$'))
                        format.tickSize = s * m * h * D * M;
                    if (ints.match('m$'))
                        format.tickSize = m * h * D * M;
                    if (ints.match('h$'))
                        format.tickSize = h * D * M;
                    if (ints.match('D$'))
                        format.tickSize = D * M;
                    if (ints.match('M$'))
                        format.tickSize = M;
                    if (ints.match('Y$'))
                        format.tickSize = Y;
                }

                var i = 0,
                    counter = 0;
                while (len--) {
                    counter++;
                    if (format.tickSize*format.tickInterval === counter || i === 0) {
                        var x = this._make('text',{
                            y: height + 50,
                            x: 100 + interval * i,
                            'font-size': 15,
                            'font-family': '"Open Sans", sans-serif'
                        });
                        x.innerHTML = this._formatTimeStamp(opts, opts.xAxis.minUTC+ parseInt(((i+opts._shiftIntervals)) * format.utc)); //(interval * (i+opts._shiftIntervals)).toFixed(0);
                        arr.push(x);
                        if (i !== 0 || format.tickSize === counter)
                            counter = 0;
                    }
                    i++;
                }
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

            str = str.replace(/MM/,dateObj.getMonth()+1)
                .replace(/DD/, dateObj.getDate())
                .replace(/hh/, dateObj.getHours()+1)
                .replace(/mm/,dateObj.getMinutes())
                .replace(/ss/,dateObj.getSeconds());

            return str;
        },
        //sig fig rounding
        _sigFigs: function (n, sig) {
            var mult = Math.pow(10,
                sig - Math.floor(Math.log(n) / Math.LN10) - 1);
            return Math.round(n * mult) / mult;
        },
        //finding min & max between multiple set (any improvments to multiple array search)
        _findMixMax: function (data) {
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
            return {
                min: min,
                max: max,
                len: length
            };
        },
        //the parent svg builder
        _generate: function (reRender) {
            var data = this.attributes.data,
                opts = this.attributes.opts,
                svg = this._make('svg',{
                    width : opts.chart.width,
                    height : opts.chart.height,
                    viewBox : '0 0 '+opts.chart.width + ' '+opts.chart.height
                }),
                sets = [],
                reRender = reRender || false;
            if (Object.prototype.toString.call(data) !== '[object Array]') {
                data = [data];
            }
    
            for (var i in data) {
                sets.push(data[i].data);
            }

            //find min / max point
            //assume all data are positive for now;
            var _tmp = this._findMixMax(sets),
            min = _tmp.min,
            max = _tmp.max,     //need to round to nearest 100?
            interval = opts.chart.width / (_tmp.len -1),
            heightRatio = (opts.chart.height / (max+10));

            if (opts.xAxis.format) {
                if (opts.xAxis.format === 'dateTime') {
                    if (opts.chart.width - 100 <= 0 || opts.chart.height - 100 <= 0)
                        console.warn('insufficent width or height (min 100px for labels), ignored format: ' +opts.xAxis.format);
                    else {
                        interval = (opts.chart.width - 100) / (_tmp.len-1);
                        heightRatio = (opts.chart.height - 100) / (max+10);
                        opts._shift = true;
                    }
                }
            }

            for (var i in data) {
                var g = this._make('g',null,{
                    label: data[i].label
                });
                this._compile(g, this._path(data[i], opts, interval, heightRatio))
                ._compile(g,this._circle(data[i], opts, interval, heightRatio))
                ._compile(svg,g);
            }
            this._compile(svg, this._label(data, opts, interval, heightRatio, min, max))
            ._compile(this.element,svg, reRender);
            return this;
        },
        //attach events
        _attach: function () {
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
                div.innerHTML = '<b>Data: ' + data.data + '</b><br><b>Interval: '+data.interval+'</b>';
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
                    height: '200'
                },
                xAxis: {},
                yAxis: {},
                data : []
            };
            yako.extend(defaults, this.attributes.opts);
            this.attributes.opts = defaults;
            return this;
        },
        //the graph data & options setter
        set: function (opts) {
            var opts = opts || {};
            this.attributes.data = opts.data || [];
            opts._originalDataLength = this.attributes.data[0].data.length;
            opts._shiftIntervals = 0;
            this.attributes.opts = opts;
            if(opts.chart && opts.chart.type && yako._graphs[opts.chart.type]) {
                return this._spawn(opts.chart.type);
            } else {
                this._prepare()
                ._generate();
            }
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
            //to contain all the dom nodes
            var domArray = [];
            //this is an id element
            if (this.element.tagName) {
                var _arr = this.element.getElementsByTagName('path');
                Array.prototype.filter.call(_arr, function (e) {
                    if(e.nodeName) {
                        domArray.push(e);
                    }
                });
            //this is a class element
            } else {
                domArray = {};
                var i = 0;
                Array.prototype.filter.call(this.element, function(e) {
                    if (e.nodeName) {
                        domArray[e.nodeName+i] = [];
                        var _arr =  this.element.getElementsByTagName('path');
                        Array.prototype.filter.call(_arr, function (x) {
                            if (x.nodeName) {
                                domArray[e.nodeName+i].push(x);
                                i++;
                            }
                        });
                    }
                });
            }

            //now analyze what is needed to be update;
            this._appendZeroAndData(this.attributes.data, json)
                ._shiftData()
                ._generate(true)
                ._attach();
        },
        //if the chart is non - cummulative, shift the labels 
        _shiftData: function () {
            var opts = this.attributes.opts;
            if (opts.chart.accumulateIncrementalData)
                return this;
            var data = this.attributes.data,
                diff = data[0].data.length - opts._originalDataLength;
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