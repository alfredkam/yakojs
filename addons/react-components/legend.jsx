var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var extend = require('../../lib/utils/extend');

module.exports = React.createClass({
    mixins: [PureRenderMixin],
    render: function () {
      var self = this;
      var defaultStyle = {
        visibility: (self.props.shouldShow ? 'visible' : 'hidden'),
        position: 'absolute',
        top: 0,
        left: 0
      };
      var style = self.props.style || {};
      extend(defaultStyle, style);
      return (
        <span style={defaultStyle}>
            {self.props.children}
        </span>
      );
    }
});