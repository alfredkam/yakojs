var React = require('react');
var Label = require('../../Label');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var GraphPureRenderMixin = require('../utils/GraphPureRenderMixin');

module.exports = React.createClass({
    mixin: [
      PureRenderMixin,
      GraphPureRenderMixin
    ],
    render: function () {
      var self = this;
      var bubble = require('../../../index').bubble;
      var chart = self.props.chart || {};

      var svg = bubble({
          // mixin: [Label],
          _call: function (scale) {
            scale.hasEvents = true;
            scale.parentType = 'bubble';
            self.props.events.setProps(scale, this.attributes.data);
          }
        }).attr({
            'chart': self.props.chart,
            'data' : self.props.data
        });
      return React.createElement("span", {
        dangerouslySetInnerHTML: {
          __html: svg
        }
      });
    }
});