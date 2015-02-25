var Common = require('./common');
var base = module.exports = Common.extend({
    init: function (node) {
      var self = this;
      // adding width 100% will allow us to have responsive graphs (in re-sizing)
      if (typeof node === 'string') {
        if (node[0] === '#') {
          this.element = this.make('div',{
            id: node.replace(/^#/,''),
            width: '100%'
          });
        } else {
          this.element = this.make('div',{
            "class": node.replace(/^\./,''),
            width: '100%'
          });
        }
      } else if(typeof node === 'object'){
        // type of object?
        this.element = node;
        this.element.style.width = '100%';
      } else {
        this.element = '';
      }
      this.token = self.makeToken();
      this.attributes = {};
      return this;
    }
});