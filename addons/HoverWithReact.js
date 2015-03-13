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
  _triggers: {},
  _setup: function () {
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
    self._triggers = list;
  },
  make: function (tagName, attribute, dataAttribute, content) {
    var self = this;
    var props = Component.renameProps(attribute);
    var triggers = self._triggers;
    function associateTriggers() {
      var list = triggers[tagName] || [];
      for (var i = 0; i < list.length; i++) {
        props[list[i]] = function (e) {
          self._on(tagName, e, props, content);
        };
      }
    }
    associateTriggers();
    return React.createElement(tagName, props, content);
  },
  _on: function (tagName, e, props, content) {
    e.preventDefault();

  },
  bindOn: ['path:hover', 'svg:click'],
  onTrigger: function (tagName, event, props) {

  },
  legend: function () {

  },
  toolTip: function () {

  }
});