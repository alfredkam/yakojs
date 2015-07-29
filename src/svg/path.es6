// TODO:: shrink the argument

import api from '../components/api';
import * as _ from '../utils/utility';

var path = module.exports = {
    /**
     * scale describe the min max
     * @param  attr: {
     *                  data : an N * M array,
     *                  height: chart height,
     *                  width: chart width
     *             }
     * @return obj              min / max
     */
    // getLinearScale?
    getScale: function (attr) {
        var data = attr.data || 0;
        var scale = api.scale(data);
        scale.paddingY = attr.paddingY || 5;
        scale.tickSize = api.sigFigs((attr.width / (scale.len - 1)),8);
        scale.heightRatio = (attr.height - (scale.paddingY * 2)) / scale.max;
        scale.height = attr.height;
        scale.width = attr.width;
        scale.innerPadding = attr.innerPadding || 0;
        scale.innerPaddingTop = attr.innerPaddingTop || 0;
        scale.innerPaddingBottom = attr.innerPaddingBottom || 0;
        return scale;
    },

    // Describes an open path
    describeAttributeD: function (numArr, paddingLeft, paddingTop, scale, ref) {
      var height = scale.height;
      var heightRatio = scale.heightRatio;
      var tickSize = scale.tickSize;
      var hasInverse = scale.hasInverse || {};
      var pathToken = '';

      if (_.isArray(scale.max)) {
          max = scale.max[ref];
          min = scale.min[ref];
      } else {
          max = scale.max;
          min = scale.min;
      }
      // need to find proper min / max;
      // min max is tainted by scale
      // need to find a new key for min max for usage here
      console.log(max, min);

      // Path generator
      for (var i = 0; i < numArr.length; i++) {
          let value = max < numArr[i] ? max : numArr[i];
          var pointY = (hasInverse.y ? height - (value * heightRatio) :  (height - (value * heightRatio))) - paddingTop - scale.innerPaddingTop;
          if (i === 0) {
            // X Y
              pathToken += 'M ' + (paddingLeft + scale.innerPadding) + ' ' + pointY;
          } else {
              pathToken += ' L '+ ((tickSize * i) + paddingLeft) + ' ' +  pointY;
          }
      }

      // Eliminates the error calls when attributiting this to the svg path
      if (pathToken === '') {
        pathToken = 'M 0 0';
      }

      return pathToken;
    },

    // Describes the path to close the open path
    describeCloseAttributeD: function (numArr, paddingLeft, paddingTop, scale, ref) {
      var height = scale.height;
      var heightRatio = scale.heightRatio;
      return [
              'V',(height - paddingTop),
              'H', paddingLeft,
              'L', paddingLeft + scale.innerPadding,
              (height - (numArr[0] * heightRatio) - paddingTop - scale.innerPaddingTop)
            ].join(" ");
    },

    /**
     * getOpenPath describes the open path with the given set
     * @param  {[obj]} scale         contains min, max, interval, heightRatio, height, width
     * @param  {[array]} numberArray an array of numbers
     * @return {[string]}            string that descibes attributeD
     */
    getOpenPath: function (scale, numberArray) {
        return path.describeAttributeD(numberArray, 0, scale.paddingY, scale);
    },

    /**
     * getClosedPath describes the closed path with the given set
     * @param  {[obj]} scale         contains min, max, interval, heightRatio, height, width
     * @param  {[array]} numberArray an array of numbers
     * @return {[string]}            string that descibes attributeD
     */
    getClosedPath: function(scale, numberArray) {
        return path.describeAttributeD(numberArray, 0, scale.paddingY, scale) +
          path.describeCloseAttributeD(numberArray, 0, scale.paddingY, scale);
    },

    beginPath: function () {
        var self = this;
        var d = "";
        self.moveTo = function (x, y) {
            d += "M" + x + " " + y;
            return self;
        };

        self.lineTo = function (x, y) {
            d += "L" + x + " " + y;
            return self;
        };

        self.endPath = function () {
          return d;
        };
        return self;
    }
};
