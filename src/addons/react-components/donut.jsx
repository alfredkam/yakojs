var React = require('react');
var donut = require('../../index').donut;

module.exports = React.createClass({

    displayName: 'YakoDonut',

    render: function () {
      var self = this;
      var svg = donut()
        .attr(self.props.attr);

      return (
        <div dangerouslySetInnerHTML={{__html: svg}} />
      )
    }
});
