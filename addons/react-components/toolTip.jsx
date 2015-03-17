var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

module.exports = React.createClass({
    mixins: [PureRenderMixin],
    render: function () {
      var self = this;
      var settings = self.props.settings;
      var position = self.props.position || 0;

      var style = {
        position: 'absolute',
        transform: 'translate(' + (position.hasOwnProperty('left') ? position.left : 0) + 'px,' + position.top + 'px)',
        visibility: settings.shouldShow ? 'visible' : 'hidden',
        top: 0
      };

      if (position.hasOwnProperty('left')) {
        style.left = 0;
      } else {
        style.right = position.right;
      }

      return (
        <span className={settings.className} style={style}>
            {self.props.children}
        </span>
      );
    }
});