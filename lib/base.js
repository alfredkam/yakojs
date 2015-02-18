var Common = require('./common');
var base = module.exports = Common.extend({
    init: function (node) {
      var self = this;
      // adding width 100% will allow us to have responsive graphs (in re-sizing)
      if (typeof node === 'string') {
        if (node[0] === '#') {
          this.element = this._make('div',{
            id: node.replace(/^#/,''),
            "style": 'width: 100%;'
          });
        } else {
          this.element = this._make('div',{
            "class": node.replace(/^\./,''),
            "style": 'width: 100%;'
          });
        }
      } else if(typeof node === 'object'){
        // type of object?
        this.element = element;
        this.element.style.width = '100%';
      } else {
        this.element = '';
      }
      this.token = self.makeToken();
      this.attributes = {};
      return this;
    }
});