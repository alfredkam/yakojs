/**
 * Expected feedback for different chart types
 */

module.exports = {

  spark: function (e, props, eX, eY) {
    var target = e.target;
    var self = this;
    var ref = ((target.dataset || '')._ref || target.getAttribute('data-_ref')) || 0;
    var points = [];
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

  line: function (e, props, eX, eY) {
    var target = e.target;
    var self = this;
    var ref = ((target.dataset || '')._ref || target.getAttribute('data-_ref')) || 0;
    var points = [];
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

  // Alternatively Bubble line
  'bubble.point': function (e, props, eX, eY) {
    var scale = props.scale;
    var data = props.data;
    var target = e.target;
    var column = ((target.dataset || '').c || target.getAttribute('data-c'));
    var point = data[column] || 0;
    var tickSize = scale.tickSize;
    var startTick = scale.startTick;
    var minRadius = scale.minRadius || 0;
    var radius = (scale.maxRadius - minRadius) * point.data / scale.max;
    var cx;
    radius = radius ? radius + minRadius : 0;

    if (scale.autoFit == false) {
      var column = ((target.dataset || '').c || target.getAttribute('data-c'));
      cx = (column * tickSize) + scale.paddingLeft + scale.innerPaddingLeft;
    } else {
      cx = ((point.date.getTime() - startTick) * tickSize) + scale.paddingLeft + scale.innerPaddingLeft;
    }

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
        cX : cx,
        r : radius
      }
    };
  },

  'bubble.scatter': function (e, props, eX, eY) {
    var scale = props.scale;
    var data = props.data;
    var target = e.target;
    var row = ((target.dataset || '').r || target.getAttribute('data-r'));
    var column = ((target.dataset || '').c || target.getAttribute('data-c'));
    var point = data[column].data;
    var minRadius = scale.minRadius || 0;
    var radius = (scale.maxRadius - minRadius) * (point[2]/scale.max[2]);
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
};
