var React = require('react');
var spark = require('../../index').spark;
var EventsWithReact = require('../../addons/EventsWithReact');
var Label = require('../../addons/Label');

module.exports = React.createClass({
    render: function () {
      var self = this;

      EventsWithReact.bindOn = ['path:hover','svg:mouseMove','svg:mouseLeave', 'path:click'];
      EventsWithReact.on = self.props.onTrigger;

      return spark({
          mixin: [
            EventsWithReact,
            Label
          ]
        }).attr({
            chart : self.props.chart,
            'data': self.props.dataSet
        });
    }
});