var React = require('react');
var bar = require('../../index').bar;

module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    var self = this;
    var svg = bar().attr({
      'chart': self.props.chart,
      'data': self.props.data
    });

    return React.createElement('div', { dangerouslySetInnerHTML: { __html: svg } });
  }
});