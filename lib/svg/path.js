// TODO:: shrink the argument

var api = require('../components/api');

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
    describeAttributeD: function (numArr, paddingLeft, paddingTop, scale) {
      var height = scale.height;
      var heightRatio = scale.heightRatio;
      var tickSize = scale.tickSize;
      var hasInverse = scale.hasInverse || {};
      var pathToken = '';

      // Path generator
      for (var i = 0; i < numArr.length; i++) {
          //var yPoint = hasInverse.y ? numArr[i] * heightRatio : height = (numArr[i] * heightRatio);
          if (i === 0) {
            // X Y
              pathToken += 'M ' + (paddingLeft + scale.innerPadding) + ' '+ (height - (numArr[i] * heightRatio) - paddingTop - scale.innerPaddingTop);
          } else {
              pathToken += ' L '+ ((tickSize * i) + paddingLeft) + ' ' + (height - (numArr[i] * heightRatio) - paddingTop - scale.innerPaddingTop);
          }
      }

      // Eliminates the error calls when attributiting this to the svg path
      if (pathToken === '') {
        pathToken = 'M 0 0';
      }

      return pathToken;
    },

    // Describes the path to close the open path
    describeCloseAttributeD: function (numArr, paddingLeft, paddingTop, scale) {
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
        return path.describeAttrributeD(numberArray, 0, scale.paddingY, scale);
    },

    /**
     * getClosedPath describes the closed path with the given set
     * @param  {[obj]} scale         contains min, max, interval, heightRatio, height, width
     * @param  {[array]} numberArray an array of numbers
     * @return {[string]}            string that descibes attributeD
     */
    getClosedPath: function(scale, numberArray) {
        return path.describeAttrributeD(numberArray, 0, scale.paddingY, scale) +
          path.describeCloseAttributeD(numberArray, 0, scale.paddingY, scale);
    }
};
