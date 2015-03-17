var React = require('react');
var spark = require('../../index').spark;
var EventsWithReact = require('../../addons/EventsWithReact');
// var RenderWithReact = require('../../addons/RenderWithReact');

module.exports = React.createClass({
    render: function () {
      var self = this;
      return spark({
          mixin: EventsWithReact,
          bindOn: ['path:hover','svg:mouseMove','svg:mouseLeave', 'path:click'],
          on: self.props.onTrigger
        }).attr({
            chart : {
              width: 1200,
              height: 150,
              'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif'
            },
            'data': self.props.dataSet
        });
    }
});