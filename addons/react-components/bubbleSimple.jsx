var React = require('react');
var bubble = require('../../index').bubble;

module.exports = React.createClass({
    render: function () {
      var self = this;
      var svg = bubble()
        .attr({
            'chart': self.props.chart,
            'data' : self.props.data
        });
        
      return (
        <div dangerouslySetInnerHTML={{__html: svg}} />
      )
    }
});