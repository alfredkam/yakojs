var Common = require('./common');
var base = module.exports = Common.extend({
    init: function (node) {
      var self = this;
      // adding width 100% will allow us to have responsive graphs (in re-sizing)
      if (typeof node === 'string') {
        if (node[0] === '#') {
          self.element = self.make('div',{
            id: node.replace(/^#/,''),
            width: '100%'
          });
        } else {
          self.element = self.make('div',{
            "class": node.replace(/^\./,''),
            width: '100%'
          });
        }
      } else {
        self.element = '';
      }
      self.token = self._makeToken();
      self.attributes = {};
      return self;
    },
    // include missing values
    _prepare: function () {
        var self = this;
        var defaults = {
          type: 'chart',
          width: '100',
          height: '100',
          // For controling the chart's external and internal spacing
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
          innerPaddingTop: 0,
          innerPaddingLeft: 0,
          innerPaddingRight: 0,
          innerPaddingBottom: 0
        };
        
        self._extend(defaults, self.attributes.opts.chart);
        self.attributes.opts.chart = defaults;
        return self;
    },
    // public function for user to set & define the graph attributes
    attr: function (opts) {
        var self = this;
        opts = opts || 0;
        // if a user does not include opts.chart
        if (typeof opts.chart === 'undefined') {
          opts = {
            chart: opts,
            data: opts.data || opts.points
          };
          delete opts.chart.data;
          delete opts.chart.points;
        }

        self.attributes.data = (opts.data || opts.points) || [];
        self.attributes.opts = opts;

        return self.postRender(self._prepare()
            ._startCycle());
    }
});