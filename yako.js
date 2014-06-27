(function (root, doc) {
    'use strict';
    //check if there is a previous version
    var _yako = root.yako || function () {};
    var api = function () {};
    var yako = root.yako = function (node) {
        var x = new api();
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
    }
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
                            nodes.removeEventListener(keys[len], fn[i]);
                        } else if(nodes) {
                            Array.prototype.filter.call(nodes, function (element) {
                                if (element.nodeName) {
                                    element.removeEventListener(keys[len], fn[i]);
                                }
                            });
                        }
                    }
                    yako.eventList[node][keys[len]] = [];
                }
            }
        }
        return self;
    }
    //for registering a module
    yako.register = function (graphName, prototypes) {
        if (yako._graphs && yako._graphs[graphName])
            throw 'Uncaught Exception: graph module conflict for '+ graphName;
        yako._graphs[graphName] = prototypes;
    }
    //extend prototype + allow chaining on public functions and most private functions
    yako.extend(api.prototype, {
        extend: yako.extend,
        assign: yako.assign,
        //init function
        _init: function (node) {
            this.attributes = {};
            this._graphs = {};
            this._getNode(node);
            return this;
        },
        //retrieving parent node
        _getNode: function (node, raw) {
            var element;
            if(node.match(/^#/)) {
                element = doc.getElementById(node.replace(/^#/,''));
            } else if (node.match(/^\./)) {
                element = doc.getElementsByClassName(node.replace(/^\./,''));
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
        _compile : function (node, childs) {
            if (Object.prototype.toString.call(childs)==='[object Array]') {
                if (node.tagName) {
                    for (var i in childs)
                        node.appendChild(childs[i]);
                } else {
                    Array.prototype.filter.call(node, function (element) {
                        if (element.nodeName) {
                            for (var i in childs)
                                element.appendChild(childs[i]);
                        }
                    });
                }
            } else {
                if (node.tagName) {
                    node.appendChild(childs);
                } else {
                    Array.prototype.filter.call(node, function (element) {
                        if (element.nodeName) {
                            element.appendChild(childs[i]);
                        }
                    });
                }
            }
            return this;
        },
        //svg path builder
        _path : function (data, opts, interval, heightRatio) {
            var pathToken = "";
            //path generator
            for (var i=0; i<data.data.length; i++) {
                if (i === 0) {
                    pathToken += 'M '+interval*i+' '+ (opts.chart.height - (data.data[i] * heightRatio));
                } else {
                    pathToken += ' L '+interval*i+' '+ (opts.chart.height - (data.data[i] * heightRatio));
                }
            }
            return this._make('path',{
                fill: 'none',
                d: pathToken,
                stroke: data.color || 'rgb(144, 237, 125)',
                'stroke-width': '2',
                'stroke-linejoin': 'round',
                'stroke-linecap': 'round',
                'z-index': 1
            });
        },
        //svg circle builder
        _circle : function (data, opts, interval, heightRatio) {
            var circles = [];

            for (var i=0;i<data.data.length;i++) {
                circles.push(this._make('circle',{
                    fill: data.nodeColor || 'red',
                    r: 5,
                    cx: interval*i,
                    cy: (opts.chart.height - (data.data[i] * heightRatio)),
                    class: 'graphData',
                    'z-index': 3
                },{
                    info: encodeURIComponent(JSON.stringify({
                        data : data.data[i],
                        label : data.label || '',
                        interval : interval * i,
                        cx: interval *i,
                        cy: (opts.chart.height - (data.data[i] * heightRatio))
                    }))
                }));
            }
            return circles;
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
        _generate: function () {
            var data = this.attributes.data,
                opts = this.attributes.opts,
                svg = this._make('svg',{
                    width : opts.chart.width,
                    height : opts.chart.height
                }),
                sets = [];

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
            max = _tmp.max,
            interval = opts.chart.width / (_tmp.len),
            heightRatio = (opts.chart.height / (max+10));

            for (var i in data) {
                var g = this._make('g',null,{
                    label: data[i].label
                });
                this._compile(g, this._path(data[i], opts, interval, heightRatio))
                ._compile(g,this._circle(data[i], opts, interval, heightRatio))
                ._compile(svg,g);
            }
            this._compile(this.element,svg);
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

            yako.unbind(this, '.graphData');
            yako.on(this, '.graphData', 'mouseover', function (e) {
                e.target.style.fill = 'blue';
                var data = JSON.parse(decodeURIComponent(e.target.dataset.info));
                 //TODO:: make the content customizable by the user
                div.innerHTML = '<b>Data: ' + data.data + '</b><br><b>Interval: '+data.interval+'</b>';
                div.style.display = 'block';
                div.style.top = data.cy + 5;
                div.style.left = data.cx + 15;
            });
            yako.on(this, '.graphData', 'mouseout', function (e) {
                e.target.style.fill = 'red';
                div.style.display = 'none';
            });
            return this;
        },
        //extends the api
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
        hoverable: function (opts, hover) {
           this.hover = hover || true;
           this.attributes.hover = opts;
           if (this.hover)
            this._attach();
           return this;
        },
        removeHover: function () {
            yako.unbind(this,'.graphData', 'mouseout')
            .unbind(this, '.graphData', 'mouseover');
        }
    });
})(window, document);