var RenderWithReact = require('./RenderWithReact');
var React = require('react');
RenderWithReact.extend = require('../lib/utils/extend');

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
  _call: function (scale) {
    this._props = scale;
    this._hydrate();
    return this;
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
    var self = this;
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
  _trigger: function (tagName, e, props, content) {
    var self = this;
    // do something
    var scale = this._props;
    var data = this.attributes.data;
    var eX = e.nativeEvent.offsetX;
    var eY = e.nativeEvent.offsetY;
    var result = [];

    console.log(props);
    // if out of quadrant should return

    var quadrantX = (eX - scale.paddingLeft + (scale.tickSize / 2)) / (scale.tickSize * scale.len);
    quadrantX = Math.floor(quadrantX * 10)

    for (var i in data) {
      result.push({
        label: data[i].label,
        value: data[i].data[quadrantX]
      });
    }
    // console.log('quadrant:', , eX);

    self.on(tagName, e, result);
  },
  bindOn: ['path:hover', 'svg:click'],
  on: function (tagName, event, props) {
    return;
  },
  legend: function () {
    return;
  },
  toolTip: function () {
    return;
  }
});