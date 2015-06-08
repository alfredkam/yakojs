import '../utils/adjustDecimal';
import randomColor from '../utils/randomColor';
import Errors from '../utils/error';
import api from '../components/api';
import composer from '../svg/composer';

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

export default class Common {

  // default
  constructor () {
      // data properties
      this.props = {};
      return this;
  }

  _sumOfData () {
      return api.sumOfData.apply(this, arguments);
  }

  // accepts a N * 1 array
  // finds total sum then creates a relative measure base on total sum
  _dataSetRelativeToTotal () {
      return api.dataSetRelativeToTotal.apply(this, arguments);
  }

  // random color generator
  _randomColor () {
      return randomColor.apply(this, arguments);
  }

  // appends the elements
  // accepts multiple child
  _append () {
      return composer.append.apply(this, arguments);
  }

  // alternate to one level deep
  make () {
      return composer.make.apply(this, arguments);
  }

  // Deep copies an object
  // TODO:: improve this
  _deepCopy (objToCopy) {
    return JSON.parse(JSON.stringify(objToCopy));
  }

  /**
   * A super class calls right before return the svg content to the user
   */
  postRender (svgContent) {
    return svgContent;
  }

  /**
   * [_isArray check if variable is an array]
   * @param  any type
   * @return {Boolean}   true if its an array
   */
  _isArray () {
      return isArray.apply(this, arguments);
  }

  // Default ratio
  _getRatio (scale) {
    scale.heightRatio = scale.height - (scale.paddingTop + scale.paddingBottom) / scale.max;
  }

  // Gets invert chart props defined by user
  _getInvertProps (scale) {
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
  }

  /**
   * [_defineBaseScaleProperties defines the common scale properties]
   * @param  {[obj]} data  [raw data set from user]
   * @param  {[obj]} chart [chart properties passed by the user]
   * @return {[obj]}       [return an obj that describes the scale base on the data & chart properties]
   */
  _defineBaseScaleProperties (data, chart) {
    var self = this;
    var opts = this.attributes.opts;
    // var chart = opts.chart;
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
  }

  /**
   * base on the feedback and mange the render of the life cycle
   * it passes a immutable obj to preRender and audits the user feedback
   */
  // TODO:: Rename lifeCycleManager, incorrect term usage
  _lifeCycleManager (data, chart, describe) {
    var self = this;
    var scale = this._defineBaseScaleProperties(data, chart);
    scale.componentName = this.componentName;
    // check if there is any external steps needed to be done
    if (this._call) {
      this._call(scale);
    }
    // make the obj's shallow properties immutable
    // we can know if we want to skip the entire process to speed up the computation
    var properties = (this.preRender ? this.preRender(Object.freeze(this._deepCopy(scale))) : 0);

    // properties we will except
    // - append
    // - prepend
    var paths = properties.prepend ? properties.prepend : [];
    paths = paths.concat(describe(scale));
    paths = paths.concat(properties.append ? properties.append : []);
    return paths;
    // return summary
  }

  // only supports 1 level deep
  _makePairs () {
      return composer.makePairs.apply(this, arguments);
  }

  // deep extend
  _extend (attr, json) {
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
  }

  isFn (object) {
    return !!(object && object.constructor && object.call && object.apply);
  }

  _makeToken () {
    return Math.random().toString(36).substr(2);
  }

  //sig fig rounding
  _sigFigs () {
      return api.sigFigs.apply(this, arguments);
  }

  _getSplits () {
      return api.getSplits.apply(this, arguments);
  }

  // find min max between multiple rows of data sets
  // also handles the scale needed to work with multi axis
  _scale () {
      return api.scale.apply(this, arguments);
  }
}
