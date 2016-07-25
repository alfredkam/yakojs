/**
 * TEMPLATE for hovering with multiple axis in react
 */
var React = require('react');
var yako = require('../../../src');
var Bubble = require('../../../src/addons/react-components/bubble/bubble-point');
var PureRenderMixin = require('react-addons-pure-render-mixin');

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
                x : Number (eg. time),
                y : Number (sample size),
                meta : {}
           },
     *     eY        : mouse event y,
     *     eX        : mouse event x,
     *     cY        : center y of the bubble that is relative to the chart
     *     cX        : center x of the bubble that is relative to the chart
     *     r         : radius of the bubble
     *   },
     *   _data        : Object, // reference to user data
     *   _scale       : Object  // reference to the mathematical values used to calculate the graph
     * }
     */
    if (Object.keys(content).length !== 0) {
      if (content.exactPoint) {
        html = 'point at value : ' + JSON.stringify(content.exactPoint);
      }
    }

    var style = {
      position: 'absolute'
    };

    return (
      <div style={style}>
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
    var attr = {
      // Width & height controls the svg view box
      width: 1200,
      height: 100,
      points: self.props.set,
      autoFit: false,
      /* Optional parameters */
      /* Options for the straight line */
      axis: {
        strokeColor: '#000',                // sets stroke color,
        strokeWidth: 2
      },
      maxRadius: 10,                      // Overrides default & sets a cap for a max radius for the bubble
      strokeColor: '#000',                // Set default stroke color
      strokeWidth: 2,                     // Set default stroke width
      fill: '#333',                       // Sets default fill color
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
        attr={ attr }
        events={self.events}
        toolTip={toolTip}
        legend={legend} />
    );
  }
});
