var React = require('react');
var spark = require('../../../index').spark;
var EventsWithReact = require('../../EventsWithReact');
var Label = require('../../Label');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

module.exports = React.createClass({
    mixin: [PureRenderMixin],
    render: function () {
      var self = this;

      EventsWithReact.bindOn = self.props.bindOn || [];
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