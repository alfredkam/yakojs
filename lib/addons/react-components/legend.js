var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var extend = require('../../utils/extend');

module.exports = React.createClass({
  displayName: 'exports',

  mixins: [PureRenderMixin],
  render: function render() {
    var self = this;
    var defaultStyle = {
      visibility: self.props.shouldShow ? 'visible' : 'hidden',
      position: 'absolute',
      top: 0,
      left: 0
    };
    var style = self.props.style || {};
    extend(defaultStyle, style);
    return React.createElement(
      'span',
      { style: defaultStyle },
      self.props.children
    );
  }
});