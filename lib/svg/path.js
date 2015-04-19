var spark = require('../spark');
spark = new spark();
// TODO:: shrink the arguments!
module.exports = {
    /**
     * scale describe the min max
     * @param  attr: {
     *                  data : an N * M array,
     *                  height: chart height,
     *                  width: chart width   
     *             }
     * @return obj              min / max
     */
    getScale: function (attr) {
        var data = attr.data || 0;
        var scale = spark._scale(data);
        scale.paddingY = attr.paddingY || 5;
        scale.tickSize = spark._sigFigs((attr.width / (scale.len - 1)),8);
        scale.heightRatio = (attr.height - (scale.paddingY * 2)) / scale.max;
        scale.height = attr.height;
        scale.width = attr.width;
        scale.innerPadding = attr.innerPadding || 0;
        return scale;
    },
    /**
     * getOpenPath describes the open path with the given set
     * @param  {[obj]} scale         contains min, max, interval, heightRatio, height, width
     * @param  {[array]} numberArray an array of numbers
     * @return {[string]}            string that descibes attributeD
     */
    getOpenPath: function (scale, numberArray) {
        return spark._describeAttributeD(numberArray, 0, scale.paddingY, scale);
    },
    /**
     * getClosedPath describes the closed path with the given set
     * @param  {[obj]} scale         contains min, max, interval, heightRatio, height, width
     * @param  {[array]} numberArray an array of numbers
     * @return {[string]}            string that descibes attributeD
     */
    getClosedPath: function(scale, numberArray) {
        return spark._describeAttributeD(numberArray, 0, scale.paddingY, scale) +
        spark._describeCloseAttributeD(numberArray, 0, scale.paddingY, scale);
    }
};