var React = require('react');
var bar = require('../../index').bar;

module.exports = React.createClass({

    displayName: 'YakoBar',

    render: function () {
      var self = this;
      var svg = bar()
        .attr(self.props.attr);

      return (
        <div dangerouslySetInnerHTML={{__html: svg}} />
      )
    }
});
