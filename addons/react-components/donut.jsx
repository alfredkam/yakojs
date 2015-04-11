var React = require('react');
var donut = require('../../index').donut;

module.exports = React.createClass({
    render: function () {
      var self = this;
      var svg = donut()
        .attr({
            'chart': self.props.chart,
            'data' : self.props.data
        });
      return (
        <div dangerouslySetInnerHTML={{__html: svg}} />
      )
    }
});