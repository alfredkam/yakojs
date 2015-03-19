var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var cssPrefix = ['-moz-','-webkit-','-ms-','-o-'];

module.exports = React.createClass({
    mixin: [PureRenderMixin],
    render: function () {
      var self = this;
      var settings = self.props.settings;
      var position = self.props.position || 0;

      // TODO:: Support other browsers
      var style = {
        position: 'absolute',
        transform: 'translate(' + (position.hasOwnProperty('left') ? position.left : 0) + 'px,' + position.top + 'px)',
        visibility: settings.shouldShow ? 'visible' : 'hidden',
        top: 0
      };

      for (var i = 0; i < cssPrefix.length; i++) {
        style[cssPrefix[i]+'transform'] = style.transform;
      }

      if (position.hasOwnProperty('left')) {
        style.left = 0;
      } else {
        style.right = position.right;
      }

      return (
        <span ref="toolTip" className={settings.className} style={style}>
            {self.props.children}
        </span>
      );
    }
});