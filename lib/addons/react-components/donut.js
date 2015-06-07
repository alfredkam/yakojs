var React = require('react');
var donut = require('../../index').donut;

module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    var self = this;
    var svg = donut().attr({
      'chart': self.props.chart,
      'data': self.props.data
    });
    return React.createElement('div', { dangerouslySetInnerHTML: { __html: svg } });
  }
});