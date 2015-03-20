var React = require('react');
var spark = require('../../../index').spark;
var Label = require('../../Label');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
// var Events = require('../../Events');

module.exports = React.createClass({
    // componentWillMount: function () {
    //   var Events = self.props.
    //   Events._hook = this.triggers;
    // },
    mixin: [PureRenderMixin],
    // shouldComponentUpdate: function (prev, curr) {
    //   // console.log(prev, curr);
    //   return false;
    // },
    // triggers: function (e) {
    //   var self = this;
    //   Events._associateTriggers(e, function (props) {
    //     self._eventData = props;
    //   });
    // },
    render: function () {
      var self = this;
      // var userEvents = self.props.events;
      // var Events = self.props.eventModule;

      // Events.on = userEvents.on;
      // Events.hydrate();
      // var props = Events._toRegister;
      // var Events = self.props.events;
      var chart = self.props.chart || {};

      var svg = spark({
        mixin: [Label],
        _call: function (scale) {
          // console.log(this.attributes.data);
          // self.props.dataProps = {
          //   scale: scale,
          //   data: this.attributes.data
          // };
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