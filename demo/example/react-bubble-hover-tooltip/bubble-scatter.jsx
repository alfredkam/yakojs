/**
 * TEMPLATE for hovering with multiple axis in react
 */
var React = require('react');
var yako = require('../../../components');
var Bubble = yako.components.Bubble;
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
     *   points : [             // values unders X segment
     *     {
     *       label    : String, // data label
     *       value    : Number  // value at X segment
     *     }
     *   ],
     *   exactPoint : { // only included if hovered on a path / circle
     *     label      : String, // data label,
     *     value      : Number  // value at X segment on a path
     *   },
     *   _segmentXRef : Number, // reference to X segment
     *   _data        : Object, // reference to user data
     *   _scale       : Object  // reference to the mathematical values used to calculate the graph
     * }
     */
    if (Object.keys(content).length !== 0) {
      if (content.exactPoint) {
        html = 'point at value : ' + content.exactPoint.value.join(",");
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
      type: 'scattered',        // <= This is needed for bubble graph
                                // Width & height controls the svg view box
      width: 300,
      height: 100,

      /* Optional parameters */
      /* Options for the circle */
      maxRadius: 10,            // Overrides default & sets a cap for a max radius for the bubble
      fill: ['#000'],           // Sets the default fill color
      fills: ['#333','#334'],   // This will override the fill color and matches with the adjacent dataset
                                // Note: if fill / fills are not provided - it will randomly generate a color

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
        data={self.props.set}
        events={self.events}
        toolTip={toolTip}
        legend={legend} />
    );
  }
});