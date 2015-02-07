var Base = require('./Base');
var arc = module.exports = Base.extend({
    // public function for user to set & define the graph attributes
    set: function (opts) {
        opts = opts || 0;
        // width: 200,
        // height: 100
        this.attributes.data = opts.data || [];
        this.attributes.opts = opts;

        return this._prepare()
            ._generate();
    },
    // arc calculation snippet from http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
    _polarToCartesian: function (centerX, centerY, radius, angleInDegrees) {
      var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    },
    _describeArc: function (x, y, radius, startAngle, endAngle){

        var start = this._polarToCartesian(x, y, radius, endAngle);
        var end = this._polarToCartesian(x, y, radius, startAngle);

        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, arcSweep, 0, end.x, end.y
        ].join(" ");

        return d;
    }
    /* end of snippet */
});