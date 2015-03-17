var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

module.exports = React.createClass({
    mixins: [PureRenderMixin],
    render: function () {
      var self = this;
      var position = self.props.position || 0;
      var style = {
        position: 'absolute',
        transform: 'translate(' + (position.hasOwnProperty('left') ? position.left : position.right) + 'px,' + position.top + 'px)',
        visibility: self.props.shouldShow ? 'visible' : 'hidden',
        top: 0
      };

      if (position.hasOwnProperty('left')) {
        style.left = 0;
      } else {
        style.right = 0;
      }

      return (
        <span style={style}>
            {self.props.children}
        </span>
      );
    }
});