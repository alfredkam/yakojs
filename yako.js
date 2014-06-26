(function (root, doc) {
    'use strict';
    var _yako = root.yako || function () {};
    var api = function () {};
    var yako = root.yako = function (node) {
        var x =     new api();
        return x._init(node);
    };

    yako.extend = function (attr, json) {
        if (!json)
            return;
        var k = Object.keys(json),
        len = k.length;
        while(len--) {
            attr[k[len]] = json[k[len]];
        }
    };
    yako.assign = function (attr, json) {
        if (!json)
            return;
        var k = Object.keys(json), len = k.length;
        while(len--) {
            console.log(k[len]);
            attr.setAttributeNS(null, k[len], json[k[len]]);
        }
    };

    yako.extend(api.prototype, {
        attributes : {},
        extend : yako.extend,
        assign : yako.assign,
        _getNode: function (node) {
            if(node.match(/^#/)) {
                this.element = doc.getElementById(node.replace(/^#/,''));
            } else if (node.match(/^\./)) {
                this.element = doc.getElementByClassName(node.replace(/^\./,''));
            }
            // return (this.element !== null ? this : (throw 'Uncaught Node Element: '+ node + ' is null'));
            return this;
        },
        _make: function (tag, props, data) {
            var node = doc.createElementNS('http://www.w3.org/2000/svg',tag);
            this.assign(node,props);
            this.extend(node.dataset, data);
            return node;
        },
        _init: function (node) {
            this.attributes = {};
            this._getNode(node);
            return this;
        },
        _compile : function (node, childs) {
            if (childs instanceof Array) {
                for (var i =0;i<childs.length;i++)
                    node.appendChild(childs);
            } else {
                node.appendChild(childs);
            }
        },
        _render : function (child) {
            var node = this.element;
            if (node instanceof Array) {
                Array.prototype.filter.call(node, function (element) {
                    if(element.nodeName) {
                        element.appendChild(child);
                    }
                });
            } else {
                node.appendChild(child);
            }
        },
        _generate : function () {
            var data = this.attributes.data,
                opts = this.attributes.opts,
                svg = this._make('svg',{
                    width : opts.width || 200,
                    height : opts.height || 100
                }),
                interval = opts.width / (data.length),
                pathToken = '',
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
            //path generator
            for (var i=0; i<data.length; i++) {
                if (i === 0) {
                    pathToken += 'M '+interval*i+' '+ (data[i] * heightRatio);
                } else {
                    pathToken += ' L '+interval*i+' '+ (data[i] * heightRatio);
                }
            }

            var path = this._make('path',{
                fill: 'none',
                d: pathToken,
                stroke: 'rgb(144, 237, 125)',
                'stroke-width': '2',
                'stroke-linejoin': 'round',
                'stroke-linecap': 'round'
            });

            this._compile(svg,path);
            this._render(svg);
        },
        set: function (opts, data) {
            this.attributes.data = data || [];
            this.attributes.opts = opts || {};
            this._generate();
        }
    });

})(window, document);