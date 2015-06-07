var React = require('react');
var pie = require('../../index').pie;

module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    var self = this;
    var svg = pie().attr({
      'chart': self.props.chart,
      'data': self.props.data
    });

    return React.createElement('div', { dangerouslySetInnerHTML: { __html: svg } });
  }
});