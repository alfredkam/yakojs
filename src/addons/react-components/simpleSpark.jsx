var React = require('react');
var spark = require('../../index').spark;

module.exports = React.createClass({
    render: function () {
      var self = this;
      var svg = spark()
        .attr(self.props.attr);

      return (
        <div dangerouslySetInnerHTML={{__html: svg}} />
      );
    }
});
