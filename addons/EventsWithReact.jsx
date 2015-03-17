var RenderWithReact = require('./RenderWithReact');
var React = require('react');
RenderWithReact.extend = require('../lib/utils/extend');

/**
 * An add on to interact and trigger events with react
 */

var shortHandBindFilterDefinitions = {
  'hover': ['onMouseEnter','onMouseLeave'],
  'click': ['onClick'],
  'mouseMove': ['onMouseMove'],
  'mouseEnter': ['onMouseEnter'],
  'mouseOver': ['onMouseOver'],
  'mouseUp': ['onMouseUp'],
  'mouseLeave': ['onMouseLeave'],
  'doubleClick': ['onDoubleClick']
};

var Component = module.exports = RenderWithReact.extend({
  _events: {},
  _props: {},
  _refs: {},
  _call: function (scale) {
    var self = this;
    self._props = scale;
    self._createMap();
    self._hydrate();
    return this;
  },
  _createMap: function () {
    var self = this;
    var data = self.attributes.data;
    var map = {};

    if (self._isArray(data) && data[0] instanceof Object) {
      for (var i = 0; i < data.length; i++) {
        var ref = self._makeToken();
        map[ref] = {
          ref: ref,
          data: data[i]
        };
        data[i]._ref = ref;
      }
    }
    self._refs = map;
  },
  _hydrate: function () {
    var self = this;
    var filters = self.bindOn;
    var list = {};
    for(var i = 0; i < filters.length; i++) {
      // Replace will only call the function if the condition is met
      filters[i].replace(/(.*):(.*)/, function (match, p1, p2) {
        list[p1] = list[p1] || [];
        if (shortHandBindFilterDefinitions[p2]) {
          list[p1] = list[p1].concat(shortHandBindFilterDefinitions[p2]);
        }
      });
    }
    self._events = list;
  },
  make: function (tagName, attribute, dataAttribute, content) {
    console.log(attribute);
    var self = this;
    attribute = attribute || {};
    var props = Component.renameProps(attribute);
    var events = self._events;
    function associateTriggers() {
      var list = events[tagName] || [];
      for (var i = 0; i < list.length; i++) {
        props[list[i]] = function (e) {
          self._trigger(tagName, e, props, content);
        };
      }
    }
    associateTriggers();
    return React.createElement(tagName, props, content);
  },
  postRender: function (reactElement) {
    var self = this;

    return reactElement;
  },
  _trigger: function (tagName, e, props, content) {
    var self = this;
    // do something
    var scale = this._props;
    var data = this.attributes.data;
    var eX = e.nativeEvent.offsetX;
    var eY = e.nativeEvent.offsetY;
    var points = [];
    var ref = props._ref || 0;

    // if out of quadrant should return
    var quadrantX = (eX - scale.paddingLeft + (scale.tickSize / 2)) / (scale.tickSize * scale.len);
    quadrantX = Math.floor(quadrantX * 10);

    for (var i in data) {
      points.push({
        label: data[i].label,
        value: data[i].data[quadrantX]
      });
    }

    var properties = {
      points: points,
      scale: scale,
      segmentXRef: quadrantX
    };

    if (ref) {
      properties.data = self._refs[ref];
    }
    self.on(tagName, e, properties);
  },
  bindOn: [],
  on: function (tagName, event, props) {
    return;
  },
  toolTip: function () {
    return;
  }
});