(function (root, doc) {
    'use strict';

    var _yako = root.yako || function () {};
    var api = function () {};
    var yako = root.yako = function (node) {
        var x = new api();
        return x._init(node);
    };
    //to extend properties
    yako.extend = function (attr, json) {
        if (!json)
            return;
        var k = Object.keys(json), len = k.length;
        while(len--) {
            attr[k[len]] = json[k[len]];
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

    yako.eventList = {};

    yako.isFn = function (object) {
       return !!(object && object.constructor && object.call && object.apply);
    };

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

    yako.unbind = function (self, node, event, fn) {
        var nodes = self._getNode(node, true);
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

        } else {
            if (yako.eventList[node] && nodes) {
                var keys = yako.eventList[node], len = keys.length;
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

    yako.extend(api.prototype, {
        attributes : {},
        extend : yako.extend,
        assign : yako.assign,
        //init function
        _init: function (node) {
            this.attributes = {};
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
        //TODO:: make it support class
        _compile : function (node, childs) {
            if (Object.prototype.toString.call(childs)==='[object Array]') {
                for (var i =0;i<childs.length;i++)
                    node.appendChild(childs[i]);
            } else {
                node.appendChild(childs);
            }
            return this;
        },
        //svg path builder
        _path : function (data, opts, interval, heightRatio) {
            var pathToken = "";
            //path generator
            for (var i=0; i<data.length; i++) {
                if (i === 0) {
                    pathToken += 'M '+interval*i+' '+ (opts.height - (data[i] * heightRatio));
                } else {
                    pathToken += ' L '+interval*i+' '+ (opts.height - (data[i] * heightRatio));
                }
            }
            return this._make('path',{
                fill: 'none',
                d: pathToken,
                stroke: 'rgb(144, 237, 125)',
                'stroke-width': '2',
                'stroke-linejoin': 'round',
                'stroke-linecap': 'round',
                'z-index': 1
            });
        },
        //svg circle builder
        _circle : function (data, opts, interval, heightRatio) {
            var circles = [];

            for (var i=0;i<data.length;i++) {
                circles.push(this._make('circle',{
                    fill: 'red',
                    r: 5,
                    cx: interval*i,
                    cy: (opts.height - (data[i] * heightRatio)),
                    class: 'graphData',
                    'z-index': 3
                },{
                    info: encodeURIComponent(JSON.stringify({
                        data : data[i],
                        interval : interval * i,
                        cx: interval *i,
                        cy: (opts.height - (data[i] * heightRatio))
                    }))
                }));
            }

            return circles;
        },
        //the parent svg builder
        _generate : function () {
            var data = this.attributes.data,
                opts = this.attributes.opts,
                svg = this._make('svg',{
                    width : opts.width || 200,
                    height : opts.height || 100
                }),
                interval = opts.width / (data.length),
                //find min / max point
                //assume all data are positive for now;
                max = data[0], min = data[0];

            for (var j in data) {
                if (max < data[j])
                    max = data[j];
                if (min > data[j])
                    min = data[j];
            }

            var heightRatio = (opts.height / (max+10));

            var path = this._path(data, opts, interval, heightRatio);
            var circle = this._circle(data, opts, interval, heightRatio);
            
            this._compile(svg,path)
            ._compile(svg, circle)
            ._compile(this.element,svg);
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
        //the graph data & options setter
        set: function (opts, data) {
            this.attributes.data = data || [];
            this.attributes.opts = opts || {};
            this._generate();
            return this;
        },
        //the graph hover options
        hoverable: function (opts, hover) {
           this.hover = hover || true;
           this.attributes.hover = opts;
           if (this.hover)
            this._attach();
           return this;
        }
    });

})(window, document);