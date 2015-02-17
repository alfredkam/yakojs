var spark = require('../sparkLine');
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
        var range = spark._findMinMax(attr.data, false);
        range.interval = spark._sigFigs((attr.width / (range.len-1)),8);
        range.heightRatio = (attr.height - 10) / attr.max;
        return range;
    },
    /**
     * getOpenPath describes the open path with the given set
     * @param  {[obj]} scale       contains min, max, interval, heightRatio
     * @param  {[array]} dataArray an array of numbers
     * @return {[string]}           [string that descibes attributeD]
     */
    getOpenPath: function (scale, dataArray) {
        return spark._describeAttributeD(dataArray, scale.interval, 0, scale, scale.heighRatio, 0, false);
    },
    /**
     * getClosedPath describes the closed path with the given set
     * @param  {[obj]} scale       contains min, max, interval, heightRatio
     * @param  {[array]} dataArray an array of numbers
     * @return {[string]}           [string that descibes attributeD]
     */
    getClosedPath: function(scale, dataArray) {
        return spark._describeAttributeD(dataArray, scale.interval, 0, scale, heighRatio, 0, false) +
        spark._describeCloseAttributeD(dataArray, scale.interval, 0, scale, heightRatio, 0, false);
    }
};