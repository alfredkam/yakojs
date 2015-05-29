var React = require('react');
var pie = require('../../index').pie;

module.exports = React.createClass({
    displayName: 'YakoPie',

    render: function () {
      var self = this;
      var svg = pie()
        .attr(self.props.attr);

      return (
        <div dangerouslySetInnerHTML={{__html: svg}} />
      )
    }
});
