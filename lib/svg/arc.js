
var arc = module.exports = {
    // snippet from http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    // calculates the polar to cartesian coordinates
    polarToCartesian: function (centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    },
    // describes an arc
    describeArc: function (centerX, centerY, radius, startAngle, endAngle){
        var start = arc.polarToCartesian(centerX, centerY, radius, endAngle);
        var end = arc.polarToCartesian(centerX, centerY, radius, startAngle);
        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

        if (startAngle == 360 && endAngle == 360) {
            // Solution http://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path/10477334#10477334
            return [
                "M", radius * 2, radius,
                "a", radius, radius, 0, 1, 0, radius*2, 0,
                "a", radius, radius, 0, 1, 0, -radius * 2, 0
            ].join(" ");
        }

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, arcSweep, 0, end.x, end.y
        ].join(" ");
    },
    describePie: function (centerX, centerY, radius, startAngle, endAngle) {
        return arc.describeArc(centerX, centerY, radius, startAngle, endAngle) + ' L' + centerX + ' ' + centerY;
    }
};