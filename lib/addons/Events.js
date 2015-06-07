/**
 * An add on to interact and trigger events
 */

/**
 * Event filter definitions
 */
var shortHandBindFilterDefinitions = {
  'hover': ['onMouseOver', 'onMouseLeave'],
  'click': ['onClick'],
  'mouseMove': ['onMouseMove'],
  'mouseEnter': ['onMouseEnter'],
  'mouseOver': ['onMouseOver'],
  'mouseOut': ['onMouseOut'],
  'mouseUp': ['onMouseUp'],
  'mouseLeave': ['onMouseLeave'],
  'doubleClick': ['onDoubleClick']
};
var ignore = function ignore() {};
var Class = require('../classes/class');
var eventFeedback = require('./Events.feedback');
var error = require('../utils/error');

module.exports = Class.extend({

  // A list of tagName w/ event combination in key - value format for fast filtering. Hydrate from `hydrate` function
  _events: {},

  // Sets props
  setProps: function setProps(scale, data) {
    this._props = {
      scale: scale,
      data: data
    };
  },

  _props: {},

  // The events should register with the top level binding
  _toRegister: {},

  // The external call back for the top level event binding to emit the event
  _emit: function _emit(e) {
    this._associateTriggers(e);
  },

  // Manually pass the domObj thats pass in, and add the events
  listen: function listen(domObj) {
    var self = this;
    self._element = domObj;
    self.hydrate();
    var props = self._toRegister;
    var keys = Object.keys(props);
    for (var i = 0; i < keys.length; i++) {
      domObj.addEventListener(keys[i].replace('on', '').toLowerCase(), props[keys[i]], false);
    }
  },

  // Manually removes the event listener
  removeListener: function removeListener() {
    var self = this;
    var domObj = self._element;
    var props = self._toRegister;
    var keys = Object.keys(props);
    for (var i = 0; i < keys.length; i++) {
      domObj.removeEventListener(keys[i].replace('on', '').toLowerCase(), props[keys[i]], false);
    }
  },

  /**
  * A user defined event map, eg:
  * 'container:mouseLeave': function (e) {
  *    // do something
  *  },
  *  'svg:mousemove': function (e) {
  *    // do something
  *  }
  */
  on: {},

  // Registers the events list we want to listen to
  hydrate: function hydrate() {
    var self = this;
    var filters = Object.keys(self.on);
    var list = {};
    var eventsToRegister = {};

    for (var i = 0; i < filters.length; i++) {
      filters[i].replace(/(.*):(.*)/, function (match, tagName, eventName) {
        if (shortHandBindFilterDefinitions[eventName]) {
          for (var x = 0; x < shortHandBindFilterDefinitions[eventName].length; x++) {
            var e = shortHandBindFilterDefinitions[eventName][x];
            var eLower = e.toLowerCase();
            list[tagName + ':' + eLower] = list[tagName + ':' + eLower] || [];
            list[tagName + ':' + eLower].push(eventName);
            eventsToRegister[e] = function (e) {
              self._emit(e);
            };
          }
        }
      });
    }
    self._events = list;
    self._toRegister = eventsToRegister;
  },

  // TODO:: handle case when child event provides a stop pragation
  // Entry point for top level event binding that will distribute to rest of binding
  _associateTriggers: function _associateTriggers(e, next) {
    e = e || window.event;
    var self = this;
    var events = self._events;
    var props = self._props;

    var tagNames = [];
    var target = e.target || e.srcElement;
    tagNames.push(e.target.tagName.toLowerCase() == 'div' ? 'container' : e.target.tagName.toLowerCase());
    tagNames.push(e.currentTarget.tagName.toLowerCase() == 'div' ? 'container' : e.currentTarget.tagName.toLowerCase());

    for (var i = 0; i < tagNames.length; i++) {
      var eventProps = events[tagNames[i] + ':on' + e.type] || 0;
      if (eventProps) {
        for (var x = 0; x < eventProps.length; x++) {
          self._trigger(tagNames[i] + ':' + eventProps[x], e, props, next);
        }
      }
    }
  },

  // Common entry point for each _associateTrigger once the eventName is associated
  // Here it provides the material at those event points - if the data is avaliable
  _trigger: function _trigger(eventName, e, props, next) {
    var self = this;
    var scale = props.scale;
    // For react, uses nativeEvent
    e.nativeEvent = e.nativeEvent || e;
    var eX = e.nativeEvent.offsetX;
    var eY = e.nativeEvent.offsetY;
    next = next || ignore;
    var properties = {};

    if (eventFeedback[scale.componentName]) {
      properties = eventFeedback[scale.componentName](e, props, eX, eY);
    } else {
      error.eventFeedback(scale.componentName || '');
    }

    self.on[eventName](e, properties);
    next(properties);
  }
});