Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/*
  Copyright 2015
  MIT LICENSE
  Alfred Kam (@alfredkam)
*/

var _componentsSpark = require('./components/spark');

var _componentsSpark2 = _interopRequireDefault(_componentsSpark);

var _componentsPie = require('./components/pie');

var _componentsPie2 = _interopRequireDefault(_componentsPie);

var _componentsDonut = require('./components/donut');

var _componentsDonut2 = _interopRequireDefault(_componentsDonut);

var _componentsBar = require('./components/bar');

var _componentsBar2 = _interopRequireDefault(_componentsBar);

var _componentsBubble = require('./components/bubble');

var _componentsBubble2 = _interopRequireDefault(_componentsBubble);

var _svgSvg = require('./svg/svg');

var _svgSvg2 = _interopRequireDefault(_svgSvg);

var _utilsMixin = require('./utils/mixin');

var _utilsMixin2 = _interopRequireDefault(_utilsMixin);

// time series / object base

var _componentsBubblePoint = require('./components/bubble.point');

var _componentsBubblePoint2 = _interopRequireDefault(_componentsBubblePoint);

var _componentsBubbleScatter = require('./components/bubble.scatter');

var _componentsBubbleScatter2 = _interopRequireDefault(_componentsBubbleScatter);

var _componentsLine = require('./components/line');

var _componentsLine2 = _interopRequireDefault(_componentsLine);

var initialize = function initialize(component, obj) {
  if (typeof obj === 'object') {
    return new (obj.mixin ? _utilsMixin2['default'](_utilsMixin2['default'](component, obj.mixin), obj) : _utilsMixin2['default'](component, obj))();
  }
  return new component(obj);
};

exports['default'] = {
  name: 'yakojs',
  VERSION: '0.4.1',
  spark: function spark(opts) {
    return initialize(_componentsSpark2['default'], opts);
  },
  pie: function pie(opts) {
    return initialize(_componentsPie2['default'], opts);
  },
  donut: function donut(opts) {
    return initialize(_componentsDonut2['default'], opts);
  },
  bubble: function bubble(opts) {
    return initialize(_componentsBubble2['default'], opts);
  },
  bar: function bar(opts) {
    return initialize(_componentsBar2['default'], opts);
  },
  svg: _svgSvg2['default'],
  timeSeries: {
    bubble: {
      point: function point(opts) {
        return initialize(_componentsBubblePoint2['default'], opts);
      },
      scatter: function scatter(opts) {
        return initialize(_componentsBubbleScatter2['default'], opts);
      }
    },
    line: function line(opts) {
      return initialize(_componentsLine2['default'], opts);
    }
  }
};
module.exports = exports['default'];