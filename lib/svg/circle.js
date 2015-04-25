var bubble = module.exports = {
    getRatioByNumberArray: function (scale) {
        var data = scale._data;
        var height = scale.height;
        var width = scale.width;
        var len = scale.len;
        var maxRadius = (height < width ? height : width) / 3;
        var paddingRight = scale.paddingRight;
        var paddingLeft = scale.paddingLeft;
        var paddingTop = scale.paddingTop;
        var paddingBottom = scale.paddingBottom;
        if (scale.type && scale.type == 'bubble-scattered') {
            // Bubble as a scattered graph
            maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || Math.sqrt(width * height / len) / 2;
            scale.paddingLeft = paddingLeft < maxRadius ? maxRadius : paddingLeft;
            scale.paddingRight = paddingRight < maxRadius ? maxRadius : paddingRight;
            scale.paddingTop = paddingTop < maxRadius ? maxRadius : paddingTop;
            scale.paddingBottom = paddingBottom < maxRadius ? maxRadius : paddingBottom;
            scale.widthRatio = (width - scale.paddingLeft - scale.paddingRight) / scale.max[0];
            scale.heightRatio = (height - scale.paddingTop - scale.paddingBottom) / scale.max[1];
        } else {
            // Bubble line (point) graph
            scale.bubble = scale.bubble || {};
            scale.xAxis = scale.xAxis || {};
            maxRadius = scale.bubble.maxRadius = parseInt(scale.bubble.maxRadius) || maxRadius;
            // Figure out the maxRadius & paddings, maxRadius is a guide line
            var tickLen = len - 1 == 0 ? 1 : len - 1;
            var tickSize = (width - scale.paddingLeft - scale.paddingRight) / (tickLen);
            scale.bubble.maxRadius = tickSize < maxRadius ? tickSize + scale.paddingLeft : maxRadius;
            scale.paddingLeft = scale.paddingLeft || scale.bubble.maxRadius * (data[0] / scale.max);
            scale.paddingRight = scale.paddingRight || scale.bubble.maxRadius * (data[len - 1] / scale.max);
            scale.tickSize = (width - scale.paddingLeft - scale.paddingRight) / (tickLen);
        }
    },
    // Extends default ratio w/ auto scaling for Bubble Scatter
    getRatioByObject: function (scale) {
        var data = scale._data;
        var height = scale.height;
        var width = scale.width;
        var len = scale.len;
        var maxRadius = (height < width ? height : width) / 3;
        var paddingRight = scale.paddingRight;
        var paddingLeft = scale.paddingLeft;
        var paddingTop = scale.paddingTop;
        var paddingBottom = scale.paddingBottom;
        // bubble as a scattered graph
        maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || Math.sqrt(width * height / len) / 2;
        scale.paddingLeft = paddingLeft < maxRadius ? maxRadius : paddingLeft;
        scale.paddingRight = paddingRight < maxRadius ? maxRadius : paddingRight;
        scale.paddingTop = paddingTop < maxRadius ? maxRadius : paddingTop;
        scale.paddingBottom = paddingBottom < maxRadius ? maxRadius : paddingBottom;
        scale.widthRatio = (width - scale.paddingLeft - scale.paddingRight) / scale.max[0];
        scale.heightRatio = (height - scale.paddingTop - scale.paddingBottom) / scale.max[1];
    },
    // Extends default ratio w/ auto scaling for Bubble point
    getRatioByTimeSeries: function (scale) {
        var data = scale._data;
        var height = scale.height;
        var width = scale.width;
        var len = scale.len;
        var maxRadius = (height < width ? height : width) / 3;
        var paddingRight = scale.paddingRight;
        var paddingLeft = scale.paddingLeft;
        var paddingTop = scale.paddingTop;
        var paddingBottom = scale.paddingBottom;
        scale.axis = scale.axis || {};
        maxRadius = scale.maxRadius = parseInt(scale.maxRadius) || maxRadius;

        // Determine if its time series
        scale.timeSeries = true;
        // Check if the start date is defined, if not defined using first element in array
        // TODO:: Handle edge case of single point
        scale.startTick = startTick = (scale.startDate || data[0].date).getTime();
        scale.endTick = endTick = (scale.endDate || data[len - 1].date).getTime();
        var tickLen = endTick - startTick;  // Need to handle zero
        tickLen = (tickLen == 0 ? 1000 : tickLen);
        var firstTick = data[0].date.getTime();
        var lastTick = data[len - 1].date.getTime();
        var firstTickLeftRadius = firstTick - startTick - (scale.maxRadius * data[0].data / scale.max);
        var lastTickRightRadius = lastTick - endTick + (scale.maxRadius * data[len - 1].data / scale.max);
        scale.paddingLeft = firstTickLeftRadius < 0 ? Math.abs(firstTickLeftRadius) : 0;
        scale.paddingRight = lastTickRightRadius > 0 ? lastTickRightRadius : 0;
        scale.tickSize = (width - scale.paddingLeft - scale.paddingRight) / (tickLen);   
    }
};