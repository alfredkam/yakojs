import Common from './common';

export default class Base extends Common {

    // Initialize
    constructor (node) {
      super();
      // adding width 100% will allow us to have responsive graphs (in re-sizing)
      if (typeof node === 'string') {
        if (node[0] === '#') {
          this.element = this.make('div',{
            id: node.replace(/^#/,''),
            width: '100%'
          });
        } else {
          this.element = this.make('div', {
            "class": node.replace(/^\./,''),
            width: '100%'
          });
        }
      } else if (typeof node == 'object')  {
        this.element = '';
        var mixin = node.mixin;
        Object.assign(this, mixin);
      } else {
        this.element = '';
      }
      this.token = this._makeToken();
      this.attributes = {};
      return this;
    }

    // Include missing values
    _prepare () {
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
        this._extend(defaults, this.attributes.opts.chart);
        this._extend(this.attributes.opts, defaults);
        this.attributes.opts.chart = defaults;
        return this;
    }

    // Public function for user to set & define the graph attributes
    attr (opts) {
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
    }

    // Add chart layout property into scale
    _addChartLayoutProps (scale) {
      var { height, width, paddingTop, paddingLeft, paddingRight, paddingBottom, innerPaddingLeft, innerPaddingRight, innerPaddingTop, innerPaddingBottom } = scale;

      scale.layout = {
        x: paddingLeft,
        y: paddingTop,
        height: height - paddingTop - paddingBottom,
        padding: {
          left: innerPaddingLeft,
          right: innerPaddingRight,
          top: innerPaddingTop,
          bottom: innerPaddingBottom
        },
        width: width - paddingLeft - paddingRight,
        yToPixel: scale.heightRatio || null,
        xToPixel: (scale.widthRatio || scale.tickSize) || null
      };

      return null;
    }

    // Wraps content with svg element
    finalize (content) {
      var self = this;
      var appendTo = self._append;
      var append = '';
      var prepend = '';
      var scale = self.props.scale;
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
    }

    // If there is additional content from user, it will retrieve it
    _getUserContent (fn, content, immutableScale) {
      if (!fn) return '';

      var additionalContent = fn(content, immutableScale) || '';

      if (typeof additionalContent == 'object') {
        additionalContent = additionalContent.stringify();
      }
      return additionalContent;
    }
}
