var React = require('react');
var spark = require('../../index').spark;

module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    var self = this;
    var svg = spark().attr({
      'chart': self.props.chart,
      'data': self.props.data
    });

    return React.createElement('div', { dangerouslySetInnerHTML: { __html: svg } });
  }
});