/**
 * TEMPLATE for hovering with multiple axis in react
 */
var React = require('react');
var yako = require('../../../../components');
var Bubble = yako.components.timeSeries.Bubble.Scatter;
var PureRenderMixin = React.addons.PureRenderMixin;

/* Tool Tip Component */
var ToolTip = React.createClass({
  mixin: [PureRenderMixin],
  render: function () {
    var html;
    var content = this.props.content;
    /**
     * You would expect this.props.content to include
     * {
     *   exactPoint : { // only included if hovered on a path / circle
     *     data      : {
                x : Number,
                y : Number,
                z : Number,
                meta: {}
           },
     *     eY        : mouse event y,
     *     eX        : mouse event x,
     *     cY        : center y of the bubble that is relative to the chart
     *     cX        : center x of the bubble that is relative to the chart
     *     r         : radius of the bubble
     *   },
     *   _segmentXRef : Number, // reference to X segment
     *   _data        : Object, // reference to user data
     *   _scale       : Object  // reference to the mathematical values used to calculate the graph
     * }
     */
    if (Object.keys(content).length !== 0) {
      if (content.exactPoint) {
        html = 'point at value : ' + JSON.stringify(content.exactPoint);
      }
    }
    return (
      <div>
        {html}
      </div>
    );
  }
});

/* Legend Component */
var Legend = React.createClass({
  mixin: [PureRenderMixin],
  render: function () {
    return (
      <div>
        I am a legend
      </div>
    );
  }
});

/* Graph Component */
module.exports = React.createClass({
  getInitialState: function () {
    return {
      shouldShow: false,
    };
  },
  componentWillMount: function () {
    var onActivity = function (e, props) {
      self.setState({
        shouldShow: true
      });
    }
    var onLeave = function (e, props) {
      self.setState({
        shouldShow: false
      });
    }
    var self = this;
    self.events = {
      // Register events for call back
      on: {
        'circle:mouseMove': onActivity,
        'circle:mouseOut': onLeave,
        'container:mouseLeave': onLeave
      }
    };
  },
  render: function () {
    var self = this;
    var chart = {
      width: 1200,
      height: 100,
      points: self.props.set,
      /* Optional parameters */
      /* Options for the circle */
      maxRadius: 10,            // Overrides default & sets a cap for a max radius for the bubble
      fill: '#000',             // Sets the default fill color

      /* Padding options for the chart */
      paddingLeft: 0, 
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0
    };

    var toolTip = ToolTip || 0;
    var legend = Legend || 0;

    if (!toolTip) {
      self.events = {};
    } else {
      toolTip = {
        shouldShow: self.state.shouldShow,
        reactElement: ToolTip
      }
    }

    var self = this;
     return (
      <Bubble 
        chart={chart}
        events={self.events}
        toolTip={toolTip}
        legend={legend} />
    );
  }
});