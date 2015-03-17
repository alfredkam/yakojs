var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

module.exports = React.createClass({
    mixins: [PureRenderMixin],
    render: function () {
      var self = this;
      var style = {
        position: 'absolute',
        transform: 'translate(' + self.props.position.left + 'px,' + self.props.position.top + 'px)',
        visibility: self.props.shouldShow ? 'visible' : 'hidden',
        top: 0,
        left: 0
      };

      return (
        <div style={style}>
            {self.props.children}
        </div>
      );
    }
});