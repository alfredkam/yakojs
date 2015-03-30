var React = require('react');
var bar = require('../../index').bar;

module.exports = React.createClass({
    render: function () {
      var self = this;
      var svg = bar()
        .attr({
            'chart': self.props.chart,
            'data' : self.props.data
        });

      return (
        <div dangerouslySetInnerHTML={{__html: svg}} />
      )
    }
});