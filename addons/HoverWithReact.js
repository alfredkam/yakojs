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
  events: {},
  _call: function () {
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
    self.events = list;
  },
  make: function (tagName, attribute, dataAttribute, content) {
    var self = this;
    var props = Component.renameProps(attribute);
    var triggers = self.events;
    function associateTriggers() {
      var list = triggers[tagName] || [];
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
    e.preventDefault();
    // do something
    self.on(tagName, e, props);
  },
  bindOn: ['path:hover', 'svg:click'],
  on: function (tagName, event, props) {

  },
  legend: function () {

  },
  toolTip: function () {

  }
});