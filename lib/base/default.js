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
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          // spark graph configs
          line: true,
          fill: true,
          scattered: false
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
            data: opts.data
          };
          delete opts.chart.data;
        }

        self.attributes.data = opts.data || [];
        self.attributes.opts = opts;

        return self.postRender(self._prepare()
            ._startCycle());
    }
});