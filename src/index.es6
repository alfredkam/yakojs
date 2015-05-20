/*
  Copyright 2015
  MIT LICENSE
  Alfred Kam (@alfredkam)
*/

import sparkLine from './components/spark';
import pie from './components/pie';
import donut from './components/donut';
import bar from './components/bar';
import bubble from './components/bubble';
import svg from './svg/svg';
import mixin from './utils/mixin';
// time series / object base
import bubblePoint from './components/bubble.point';
import bubbleScatter from './components/bubble.scatter';
import line from './components/line';

var initialize = (component, obj) => {
  if (typeof obj === 'object') {
    return new (obj.mixin ? mixin(mixin(component, obj.mixin), obj) : mixin(component, obj))();
  }
  return new component(obj);
};

export default {
  name: 'yakojs',
  VERSION: '0.4.10',
  spark (opts) {
    return initialize(sparkLine, opts);
  },
  pie (opts) {
    return initialize(pie, opts);
  },
  donut (opts) {
    return initialize(donut, opts);
  },
  bubble (opts) {
    return initialize(bubble, opts);
  },
  bar (opts) {
    return initialize(bar, opts);
  },
  svg: svg,
  timeSeries: {
    bubble: {
      point (opts) {
        return initialize(bubblePoint, opts);
      },
      scatter (opts) {
        return initialize(bubbleScatter, opts);
      }
    },
    line (opts) {
      return initialize(line, opts);
    }
  }
};
