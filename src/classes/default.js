var Common = require('./common');
var base = module.exports = Common.extend({

    // Initialize
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

    // Include missing values
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
          innerPadding: 0,
          innerPaddingLeft: 0,
          innerPaddingRight: 0,
          innerPaddingTop: 0,
          innerPaddingBottom: 0,
          invert: [],
          // spark graph configs
          line: true,
          fill: true,
          scattered: false
        };
        self._extend(defaults, self.attributes.opts.chart);
        self._extend(self.attributes.opts, defaults);
        self.attributes.opts.chart = defaults;
        return self;
    },

    // Public function for user to set & define the graph attributes
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

        self.props.data = self.attributes.data = (opts.data || opts.points) || [];
        self.props.opts = self.attributes.opts = opts;

        return self.postRender(self.finalize(self._prepare()
            ._startCycle()));
    },

    // Add chart layout property into scale
    _addChartLayoutProps: function (scale) {
      var height = scale.height;
      var width = scale.width;
      var paddingTop = scale.paddingTop;
      var paddingLeft = scale.paddingLeft;
      var paddingRight = scale.paddingRight;
      var paddingBottom = scale.paddingBottom;

      scale.layout = {
        x: paddingLeft,
        y: paddingTop,
        height: height - paddingTop - paddingBottom,
        width: width - paddingLeft - paddingRight,
        yToPixel: scale.heightRatio || null,
        xToPixel: (scale.widthRatio || scale.tickSize) || null
      };

      return null;
    },

    // Wraps content with svg element
    finalize: function (content) {
      var self = this;
      var appendTo = self._append;
      var append = prepend = '';
      var scale = self.props.opts;
      var opts = self.props.opts;
      var svg = self.make('svg',{
        width: scale.width,
        height: scale.height,
        viewBox: '0 0 ' + scale.width + ' ' + scale.height
      });

      self._addChartLayoutProps(scale);

      if (opts.prepend || opts.append) {
        var immutableScale = Object.freeze(self._deepCopy(scale));
        append = self._getUserContent(opts.append, content, immutableScale) || '';
        prepend = self._getUserContent(opts.prepend, content, immutableScale) || '';
      }
      return appendTo(self.element, appendTo(svg, prepend + content + append));
    },

    // If there is additional content from user, it will retrieve it
    _getUserContent: function (fn, content, immutableScale) {
      if (!fn) return '';

      var additionalContent = fn(content, immutableScale) || '';

      if (typeof additionalContent == 'object') {
        additionalContent = additionalContent.stringify();
      }
      return additionalContent;
    }
});
