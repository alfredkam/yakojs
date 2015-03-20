/**
 * An add on to interact and trigger events
 */

// TODO:: make this work with all charts
var shortHandBindFilterDefinitions = {
  'hover': ['onMouseOver','onMouseLeave'],
  'click': ['onClick'],
  'mouseMove': ['onMouseMove'],
  'mouseEnter': ['onMouseEnter'],
  'mouseOver': ['onMouseOver'],
  'mouseOut': ['onMouseOut'],
  'mouseUp': ['onMouseUp'],
  'mouseLeave': ['onMouseLeave'],
  'doubleClick': ['onDoubleClick']
};

module.exports = {
  _events: {},
  _props: {},
  _toRegister: {},
  _hook: function () {},
  _associateTriggers: function (e, props, next) {
    var self = this;
    var events = self._events;

    var tagName = e.target.tagName.toLowerCase() == 'div' ? 'container' : e.target.tagName.toLowerCase();
    var eventProps = events[tagName + ':on' + e.type] || 0;
    if (eventProps) {
        for (var x = 0; x < eventProps.length; x++) {
            var ref = e.target.dataset._ref || 0;
            self._trigger(tagName + ':' + eventProps[x], e, props, ref, next);
        }
    }
  },
  hydrate: function () {
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
                    eventsToRegister[e] = self._hook;
                }
            }
        });
    }
    self._events = list;
    self._toRegister = eventsToRegister;
  },
  _trigger: function (eventName, e, props, ref, next) {
    var self = this;
    // do something
    var scale = props.scale;
    var data = props.data;
    var eX = e.nativeEvent.offsetX;
    var eY = e.nativeEvent.offsetY;
    var points = [];
    var ref = ref || 0;

    // if out of quadrant should return
    var quadrantX = (eX - scale.paddingLeft + (scale.tickSize / 2)) / (scale.tickSize * scale.len);
    quadrantX = Math.floor(quadrantX * 10);

    var properties = {
      scale: scale,
      segmentXRef: quadrantX
    };

    for (var i in data) {
        if (ref && (data[i]._ref == ref)) {
            properties.exactPoint = {
                label: data[i].label,
                value: data[i].data[quadrantX]
            };
            properties.data = data[i];
        }
        points.push({
            label: data[i].label,
            value: data[i].data[quadrantX]
        });
    }

    properties.points = points;

    if(!ref) {
      properties.data = data;
    }

    self.on[eventName](e, properties);
    next(properties);
  },
  on: {}
};