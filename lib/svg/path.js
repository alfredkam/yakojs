var spark = require('../sparkLine');
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
        if (data && !data[0][0]) {
            data = [data];
        }
        var range = spark._findMinMax(data, false);
        range.interval = spark._sigFigs((attr.width / (range.len-1)),8);
        range.heightRatio = (attr.height - 10) / range.max;
        range.height = attr.height;
        range.width = attr.width;
        return range;
    },
    /**
     * getOpenPath describes the open path with the given set
     * @param  {[obj]} scale       contains min, max, interval, heightRatio, height, width
     * @param  {[array]} dataArray an array of numbers
     * @return {[string]}           [string that descibes attributeD]
     */
    getOpenPath: function (scale, dataArray) {
        return spark._describeAttributeD(dataArray, scale.interval, 0, scale, scale.heightRatio, 5, false);
    },
    /**
     * getClosedPath describes the closed path with the given set
     * @param  {[obj]} scale       contains min, max, interval, heightRatio, height, width
     * @param  {[array]} dataArray an array of numbers
     * @return {[string]}           [string that descibes attributeD]
     */
    getClosedPath: function(scale, dataArray) {
        return spark._describeAttributeD(dataArray, scale.interval, 0, scale, scale.heightRatio, 5, false) +
        spark._describeCloseAttributeD(dataArray, scale.interval, 0, scale, scale.heightRatio, 5, false);
    }
};