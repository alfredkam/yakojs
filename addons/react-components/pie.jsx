var React = require('react');
var pie = require('../../index').pie;

module.exports = React.createClass({
    render: function () {
      var self = this;
      var svg = pie()
        .attr({
          'chart': self.props.chart,
          'data' : self.props.data
        });

      return ( 
        <div dangerouslySetInnerHTML={{__html: svg}} />
      )
    }
});