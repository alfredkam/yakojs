import Default from '../classes/default';
import Errors from '../utils/error';
import svgPath from '../svg/path';
import api from './line.api';

import Label from '../addons/Label';

class Line extends Default {
  constructor () {
    super({
      mixin: Label
    });
  }

  get componentName () {
      return 'line';
  }

  /**
   * The parent generator that manages the svg generation
   * @return {object} global function object
   */
  _startCycle () {
    var data = this.attributes.data;
    var opts = this.attributes.opts;
    var chart = opts.chart;
    var xAxis = chart.xAxis || opts.xAxis;
    var yAxis = chart.yAxis || opts.yAxis;
    var append = this._append;
    var svg;
    var paths = [];

    if (!this._isArray(data)) {
      data = [data];
    }

    if (xAxis) {
      chart.xAxis = xAxis;
    }

    if (yAxis) {
      chart.yAxis = yAxis;
    }

    return this._lifeCycleManager(data, chart, function (scale) {
        for (var x = 0; x < scale.rows; x++) {
            if (yAxis && yAxis.multi) {
              scale.heightRatio = scale.pHeight / scale.max[x];
            }
            var g = this.make('g');
            // pass in a ref for event look up, here `ref` is x
            console.log('line', data);
            paths.push(
              append(g, this._describePath(data[x], scale.paddingLeft, scale.paddingTop, scale, x))
            );
        }
        return paths;
    }.bind(this));
  }

  // Extends default getRatio in lib/base/common.js
  _getRatio (scale) {
    var self = this;
    var data = self.attributes.data;

    // Check if need inner padding
    if (scale.paddingLeft !== 0 && scale.paddingRight !== 0) {
      scale.innerPadding = 5;
    }
    if (!scale.xAxis && !scale.yAxis) {

      for (var i = 0; i < scale.len; i++) {
        // Find adjustments for inner left / right padding
        var o = data[i];
        var padding = 0;

        if (typeof o == 'object') {
          var strokeWidth = o.strokeWidth || 2;
          scale.innerPaddingBottom = scale.innerPaddingTop < strokeWidth ? strokeWidth : scale.innerPaddingTop;
        }
        if (typeof o == 'object' && o.scattered && scale.scattered) {
          var p = o.scattered;
          padding = (p.strokeWidth ? p.strokeWidth : 2) + (p.radius ? p.radius : 2);
          scale.innerPadding = scale.innerPadding < padding + 5 ? padding + 5 : scale.innerPadding;
          scale.innerPaddingBottom = scale.innerPadding > scale.innerPaddingBottom ? scale.innerPadding : scale.innerPaddingBottom;
          scale.innerPaddingTop = scale.innerPaddingBottom;
        }
      }
    }

    scale.pHeight = scale.height - scale.paddingTop - scale.paddingBottom - scale.innerPaddingTop - scale.innerPaddingBottom;
    scale.pWidth = scale.width - scale.paddingLeft - scale.paddingRight - scale.innerPadding;
    scale.heightRatio = scale.max ? scale.pHeight / scale.max : scale.pHeight;
    scale.tickSize = self._sigFigs((scale.pWidth / (scale.len - 1)),8);
  }

  // Describes scattered graph
  _describeScatteredGraph () {
      return api.describeScatter.apply(this, arguments);
  }

  // Svg path builder
  _describePath (data, paddingLeft, paddingTop, scale, ref) {
    ref = ref || 0;
    var self = this;
    var pathToken = svgPath.describeAttributeD(data.data, paddingLeft, paddingTop, scale, ref);
    var pathNode = self.make('path',{
        d: pathToken,
        stroke: data.strokeColor || self._randomColor(),
        'stroke-width': data.strokeWidth || '3',
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        fill: 'none'
    },{
        _ref: ref
    });
    var paths = [];

    if (data.fill && scale.fill) {
      paths.push(self.make('path', {
        d: pathToken + svgPath.describeCloseAttributeD(data.data, paddingLeft, paddingTop, scale, ref),
        stroke: 'none',
        'stroke-width': '2',
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        fill: data.fill,
      },{
        _ref: ref
      }));
    }

    if (scale.line) {
      paths.push(pathNode);
    }

    if (scale.scattered) {
      paths.push(self._describeScatteredGraph(data, data.data, paddingLeft, paddingTop, scale, ref));
    }

    return paths;
  }
}

export default Line;
