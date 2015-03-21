var React = require('react');
var Label = require('../../Label');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

module.exports = React.createClass({
    mixin: [PureRenderMixin],
    render: function () {
      var self = this;
      var spark = require('../../../index').spark;
      var chart = self.props.chart || {};

      var svg = spark({
        mixin: [Label],
        _call: function (scale) {
          self.props.setScale(scale);
        },
      }).attr({
          'chart': chart,
          'data' : self.props.data || []
        });
      return React.createElement("span", {
        dangerouslySetInnerHTML: {
          __html: svg
        }
      });
    }
});