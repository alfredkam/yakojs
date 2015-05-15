require('../utils/adjustDecimal');
var randomColor = require('../utils/randomColor');
var Class = require('./class');
var Errors = require('../utils/error');
var api = require('../components/api');
var composer = require('../svg/composer');

var isArray = function (obj) {
    return obj instanceof Array;
};

var inverseList = {
    'x': 'x',
    'y': 'y'
};
/**
 * deep extend object or json properties
 * @param  {object} object to extend
 * @param  {object} object
 * @return {object} global function object
 */
module.exports = Class.extend({

  // default
  init: function () {
    return this;
  },

  // data properties
  props: {},

  _sumOfData: api.sumOfData,

  // accepts a N * 1 array
  // finds total sum then creates a relative measure base on total sum
  _dataSetRelativeToTotal: api.dataSetRelativeToTotal,

  // random color generator
  _randomColor: randomColor,

  // appends the elements
  // accepts multiple child
  _append: composer.append,

  // alternate to one level deep
  make: composer.make,

  // Deep copies an object
  // TODO:: improve this
  _deepCopy: function (objToCopy) {
    return JSON.parse(JSON.stringify(objToCopy));
  },

  /**
   * A super class calls right before return the svg content to the user
   */
  postRender: function (svgContent) {
    return svgContent;
  },

  /**
   * [_isArray check if variable is an array]
   * @param  any type
   * @return {Boolean}   true if its an array
   */
  _isArray: isArray,

  // Default ratio
  _getRatio: function (scale) {
    scale.heightRatio = scale.height - (scale.paddingTop + scale.paddingBottom) / scale.max;
  },

  // Gets invert chart props defined by user
  _getInvertProps: function (scale) {
    // Acceptable inverse flags to inverse the data set
    var inverse = {};
    if (scale.invert) {
      for (var x in scale.invert) {
        if (inverseList[scale.invert[x]]) {
              inverse[inverseList[scale.invert[x]]] = true;
            }
        }
    }
    scale.hasInverse = inverse;
  },

  /**
   * [_defineBaseScaleProperties defines the common scale properties]
   * @param  {[obj]} data  [raw data set from user]
   * @param  {[obj]} chart [chart properties passed by the user]
   * @return {[obj]}       [return an obj that describes the scale base on the data & chart properties]
   */
  _defineBaseScaleProperties: function (data, chart) {
    var self = this;
    var opts = this.attributes.opts;
    var chart = opts.chart;
    var xAxis = chart.xAxis || opts.xAxis;
    var yAxis = chart.yAxis || opts.yAxis;
    var scale = self._scale(data, chart);
    self._extend(scale, chart);
    scale._data = data;
    self._getInvertProps(scale);

    if ((chart.type != 'bubble-point') && (yAxis || xAxis)) {
      self._getExternalProps(scale, yAxis, xAxis);
      if (!self.describeYAxis) {
        Errors.label();
      }
    }
    self._getRatio(scale);
    self.props.scale = scale;
    return scale;
  },

  /**
   * base on the feedback and mange the render of the life cycle
   * it passes a immutable obj to preRender and audits the user feedback
   */
  // TODO:: Rename lifeCycleManager, incorrect term usage
  _lifeCycleManager: function (data, chart, describe) {
    var self = this;
    var scale = self._defineBaseScaleProperties(data, chart);
    // check if there is any external steps needed to be done
    if (self._call) {
      self._call(scale);
    }
    // make the obj's shallow properties immutable
    // we can know if we want to skip the entire process to speed up the computation
    var properties = (self.preRender ? self.preRender(Object.freeze(self._deepCopy(scale))) : 0);

    // properties we will except
    // - append
    // - prepend
    var paths = properties.prepend ? properties.prepend : [];
    paths = paths.concat(describe(scale));
    paths = paths.concat(properties.append ? properties.append : []);
    return paths;
    // return summary
  },

  // only supports 1 level deep
  _makePairs: composer.makePairs,

  // deep extend
  _extend: function (attr, json) {
    var self = this;
    if (!json || !attr) return;

    var k = Object.keys(json), len = k.length;
    while(len--) {
        if (typeof json[k[len]] !== 'object' || isArray(json[k[len]])) {
            attr[k[len]] = json[k[len]];
        } else {    //it has child objects, copy them too.
            if (!attr[k[len]]) {
                attr[k[len]] = {};
            }
            self._extend(attr[k[len]], json[k[len]]);
        }
    }
    return this;
  },

  isFn: function (object) {
    return !!(object && object.constructor && object.call && object.apply);
  },

  _makeToken: function () {
    return Math.random().toString(36).substr(2);
  },

  //sig fig rounding
  _sigFigs: api.sigFigs,

  _getSplits: api.getSplits,

  // find min max between multiple rows of data sets
  // also handles the scale needed to work with multi axis
  _scale: api.scale
});
