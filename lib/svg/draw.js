var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _composerEs6 = require('./composer');

var _composerEs62 = _interopRequireDefault(_composerEs6);

var _utilsExtend = require('../utils/extend');

var _utilsExtend2 = _interopRequireDefault(_utilsExtend);

var Draw = (function () {
    function Draw() {
        _classCallCheck(this, Draw);

        var self = this;
        //self = {};
        return this;
    }

    _createClass(Draw, [{
        key: 'getNode',
        value: function getNode() {
            var node = arguments[0] === undefined ? null : arguments[0];

            var parent = null;
            var self = this;
            if (!node) {
                node = self;
            }
            return { node: node, parent: parent };
        }
    }, {
        key: 'create',
        value: function create(svgElement) {
            var self = this;
            self.element = svgElement;
            return self;
        }
    }, {
        key: 'append',
        value: function append(svgElement) {
            var self = this;

            var _self$getNode = self.getNode();

            var node = _self$getNode.node;

            node.children = node.children || [];

            if (Array.isArray(svgElement)) {
                node.children.push(svgElement);
            } else {
                var svg = new Draw();
                svgElement = svg.create(svgElement);
                node.children.push(svgElement);
            }
            return svgElement;
        }
    }, {
        key: 'attr',
        value: function attr(attrName, property) {
            var self = this;

            var _self$getNode2 = self.getNode();

            var node = _self$getNode2.node;

            node.attrs = node.attrs || {};

            if (typeof attrName == 'object') {
                _utilsExtend2['default'](node.attrs, attrName);
            } else {
                node.attrs[attrName] = property;
            }
            return self;
        }
    }, {
        key: 'forEach',
        value: function forEach(fn) {
            var self = this;

            var _self$getNode3 = self.getNode();

            var node = _self$getNode3.node;

            var children = node.children || [];
            children.forEach(fn);
            return self;
        }
    }, {
        key: 'stringify',
        value: function stringify() {
            var self = this;

            var _self$getNode4 = self.getNode();

            var node = _self$getNode4.node;

            var childContent = (node.children || []).map(function (svgObj) {
                return svgObj.stringify();
            });

            return _composerEs62['default'].make(node.element, node.attrs, {}, childContent.join(''));
        }
    }]);

    return Draw;
})();

module.exports = Draw;