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
    }
});