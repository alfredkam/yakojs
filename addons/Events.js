// TODO:: make this work with all charts
// Current supports spark / line chart
/**
 * An add on to interact and trigger events
 */

/**
 * Event filter definitions
 */
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

var ignore = function () {};

var Class = require('../lib/classes/class');
module.exports = Class.extend({
  // A list of tagName w/ event combination in key - value format for fast filtering. Hydrate from `hydrate` function
  _events: {},
  // Sets props
  setProps: function (scale, data) {
    this._props = {
      scale: scale,
      data: data
    };
  },
  _props: {},
  // The events should register with the top level binding
  _toRegister: {},
  // The external call back for the top level event binding to emit the event
  _emit: function (e) {
    // console.log(this);
    this._associateTriggers(e);
  },
  // Manually pass the domObj thats pass in, and add the events
  listen: function (domObj) {
    var self = this;
    self._element = domObj;
    self.hydrate();
    var props = self._toRegister;
    var keys = Object.keys(props);
    for(var i = 0; i < keys.length; i++) {
      domObj.addEventListener(
        keys[i].replace('on','').toLowerCase(),
        props[keys[i]],
        false
      );
    }
  },
  // Manually removes the event listener
  removeListener: function () {
    var self = this;
    var domObj = self._element;
    var props = self._toRegister;
    var keys = Object.keys(props);
    for(var i = 0; i < keys.length; i++) {
      domObj.removeEventListener(keys[i].replace('on','').toLowerCase(),props[keys[i]], false);
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
  _associateTriggers: function (e, next) {
    e = e || window.event;
    var self = this;
    var events = self._events;
    var props = self._props;

    var tagNames = [];
    var target = e.target || e.srcElement;
    var ref = ((target.dataset || '')._ref || target.getAttribute('data-_ref')) || 0;
    tagNames.push(e.target.tagName.toLowerCase() == 'div' ? 'container' : e.target.tagName.toLowerCase());
    tagNames.push(e.currentTarget.tagName.toLowerCase() == 'div' ? 'container' : e.currentTarget.tagName.toLowerCase());

    for (var i = 0; i < tagNames.length; i++) {
      var eventProps = events[tagNames[i] + ':on' + e.type] || 0;
      if (eventProps) {
        for (var x = 0; x < eventProps.length; x++) {
          self._trigger(tagNames[i] + ':' + eventProps[x], e, props, ref, next);
        }
      }
    }
  },

  getProps: {
    spark: function (props, ref, eX, eY) {
      var points = [];
      var self = this;
      var scale = props.scale;
      var data = props.data;
      // if out of quadrant should return
      var quadrantX = (eX - scale.paddingLeft - scale.innerPaddingLeft + (scale.tickSize / 2)) / (scale.tickSize * scale.len);
      quadrantX = Math.floor(quadrantX * scale.len);

      var properties = {
        _scale: scale,
        _segmentXRef: quadrantX
      };

     if (ref && (data[ref])) {
        properties.exactPoint = {
            label: data[ref].label,
            value: data[ref].data[quadrantX]
        };
        properties._data = data[ref];
      }

      for (var i in data) {
        points.push({
            label: data[i].label,
            value: data[i].data[quadrantX]
        });
      }

      properties.points = points;

      if(!ref) {
        properties._data = data;
      }
      return properties;
    },
    bubble: function (e, props, eX, eY) {
      var scale = props.scale;
      var data = props.data;
      var target = e.target;

      if (scale.type == 'bubble-point') {
        // var quadrantX = (eX - scale.paddingLeft + (scale.tickSize / 2)) / (scale.tickSize * scale.len);
        // quadrantX = Math.floor(quadrantX * scale.len);
        // return {
        //   _scale: scale,
        //   _segmentXRef: column,
        //   exactPoint: {
        //     value: data[column]
        //   }
        // };

        var column = ((target.dataset || '').c || target.getAttribute('data-c'));
        var point = data[column] || 0;
        var tickSize = scale.tickSize;
        var startTick = scale.startTick;
        var minRadius = scale.minRadius || 0;
        var radius = (scale.maxRadius - minRadius) * point.data / scale.max;
        radius = radius ? radius + minRadius : 0;
        return {
          scale: scale,
          _segmentXRef: column,
          exactPoint: {
            data: {
              x : point.data,
              meta: point
            },
            eY : eY,
            eX : eX,
            cY : scale.height / 2,
            cX : ((point.date.getTime() - startTick) * tickSize) + scale.paddingLeft + scale.innerPaddingLeft,
            r : radius
          }
        }
      } else {

        var row = ((target.dataset || '').r || target.getAttribute('data-r'));
        var column = ((target.dataset || '').c || target.getAttribute('data-c'));
        if (!row && !column) {
          return {
            _scale: scale
          };
        }
        if (scale.complex) {
          var point = data[column].data;
          var minRadius = scale.minRadius || 0;
          var radius = (scale.maxRadius - minRadius) * (point[2]/scale.max[2])
          radius = radius ? radius + minRadius : 0;
          return {
            _scale: scale,
            exactPoint: {
              data: {
                x : point[0],
                y : point[1],
                z : point[2],
                meta: data[column]
              },
              eY: eY,
              eX: eX,
              cX: scale.hasInverse.x ? (point[0] * scale.widthRatio) + scale.paddingLeft + scale.innerPaddingLeft : scale.width - (point[0] * scale.widthRatio) - scale.paddingLeft - scale.innerPaddingLeft,
              cY: scale.hasInverse.y ? scale.paddingTop + scale.innerPaddingTop + (point[1] * scale.heightRatio) : scale.height - (point[1] * scale.heightRatio) - scale.paddingTop - scale.innerPaddingTop,
              r: radius
            }
          };
        }
        return {
          _scale: scale,
          exactPoint: {
            value: data[row].data[column]
          }
        };
      }
    }
  },
  // Common entry point for each _associateTrigger once the eventName is associated
  // Here it provides the material at those event points - if the data is avaliable
  _trigger: function (eventName, e, props, ref, next) {
    var self = this;
    var scale = props.scale;
    // For react, uses nativeEvent
    e.nativeEvent = e.nativeEvent || e;
    var eX = e.nativeEvent.offsetX;
    var eY = e.nativeEvent.offsetY;
    next = next || ignore;
    ref = ref || 0;
    var properties = {};

    if (scale.parentType == 'bubble') {
      properties = self.getProps.bubble(e, props, eX, eY);
    } else {
      properties = self.getProps.spark(props, ref, eX, eY);
    }

    self.on[eventName](e, properties);
    next(properties);
  },

  getPositionProps: {
    spark: function (props) {
      if (Object.keys(props).length === 0) return;

      var self = this;
      var scale = props._scale;
      var offsetY = -20;
      var left = (scale.tickSize * props._segmentXRef) + scale.paddingLeft + scale.innerPaddingLeft;
      var values = [];
      var maxOfSet = 0;
      var max = 0;

      var numberOfLines = props.points.length;
      if (scale.max instanceof Object) {
       var maxRatio = 0;
       var pos = 0;
       for (var i = 0; i < numberOfLines; i++) {
         var currValue = props.points[i].value;
         var ratio = currValue / scale.max[0];
         if (maxRatio < ratio) {
           maxRatio = ratio;
           maxOfSet = scale.max[i];
           max = currValue;
         }
       }
      } else {
       maxOfSet = scale.max;
       for (var i = 0; i < numberOfLines; i++) {
         var currValue = props.points[i].value;
         max = max < currValue ? currValue : max;
       }
      }

      /**
      * Code snippet for finding mid point
      */
      // var min = Math.min.apply(null, values);
      // var midPoint = ((max - min) / 2) + (scale.max - max);
      // var top = midPoint * scale.heightRatio + scale.paddingTop;

      var maxPoint = maxOfSet - max;
      var top = maxPoint * scale.heightRatio + scale.paddingTop + scale.innerPaddingTop + offsetY;

      // check if we are displaying on the rightside
      if (scale.len - 1 == props._segmentXRef) {
       return {
         top: top,
         right: scale.paddingRight + scale.innerPaddingRight
       };
      }
      return {
       top: top,
       left: left
      };
    },
    bubble: function (props) {
      var scale = props._scale;
      var data = scale._data;
      var minRadius = scale.minRadius || 0;
      if (scale.type == 'bubble-point') {
        var left = (scale.tickSize * props._segmentXRef) + scale.paddingLeft + scale.innerPaddingLeft;
        var centerY = scale.height / 2;
        var maxRadius = scale.bubble ? scale.bubble.maxRadius : scale.maxRadius;
        var radius = (maxRadius - minRadius) * data[props._segmentXRef] / scale.max;
        radius = radius ? radius + minRadius : 0;
        var top = centerY - radius - 30;
      } else {
        if (!props.exactPoint) {
          return {};
        }

        var point = props.exactPoint.data.meta;
        var left = scale.width - (point[0] * scale.widthRatio) - scale.paddingLeft - scale.innerPaddingLeft;
        var radius = (scale.maxRadius - minRadius) * point[2]/ scale.max[2];
        radius = radius ? radius + minRadius : 0;
        var top = scale.height - (point[1] * scale.heightRatio) - scale.paddingTop - scale.innerPaddingTop;
        top -= (radius + 20);
      }

      if (scale.len - 1 == props._segmentXRef) {
       return {
         top: top,
         right: scale.paddingRight + scale.innerPaddingRight
       };
      }
      return {
        top: top,
        left: left
      }
    }
  },
  // Depending on the props data, it will figure out where the tooltip should show
  getToolTipPosition: function (props) {
    var scale = props._scale || {};
    var self = this;
    if (Object.keys(scale).length === 0) return;
    if (scale.parentType == 'bubble') {
      return self.getPositionProps.bubble(props);
    } else {
      return self.getPositionProps.spark(props);
    }
  }
});
