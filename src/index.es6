/*
  Copyright 2015
  MIT LICENSE
  Alfred Kam (@alfredkam)
*/

import './utils/polyfill';
import sparkLine from './components/spark';
import pie from './components/pie';
import donut from './components/donut';
import bar from './components/bar';
import svg from './svg/svg';
// time series / object base
import bubblePoint from './components/bubble.point';
import bubbleScatter from './components/bubble.scatter';
import lineTimeSeries from './components/line.timeSeries';
import line from './components/line';

var initialize = (component, obj) => {
  return new component(obj);
};

export default {

  name: 'yakojs',

  VERSION: '0.5.5',

  spark (opts) {
    return initialize(sparkLine, opts);
  },

  line (opts) {
    return initialize(line, opts);
  },

  pie (opts) {
    return initialize(pie, opts);
  },

  donut (opts) {
    return initialize(donut, opts);
  },

  bar (opts) {
    return initialize(bar, opts);
  },

  bubble: {
    point (opts) {
      return initialize(bubblePoint, opts);
    },
    scatter (opts) {
      return initialize(bubbleScatter, opts);
    }
  },

  timeSeries: {
    line (opts) {
      return initialize(lineTimeSeries, opts);
    }
  },

  svg: svg,
};
