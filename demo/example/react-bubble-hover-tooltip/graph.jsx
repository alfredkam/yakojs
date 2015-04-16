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
        html = 'point at value : ' + content.exactPoint.label + ',' + content.exactPoint.value;
      } else {
        html = content.points.map(function (key) {
          return key.label + ':' + key.value;
        });
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
    var self = this;
    self.events = {
      // Register events for call back
      on: {
        'path:mouseMove': onActivity,
        'svg:mouseMove': onActivity,
        'container:mouseLeave': function (e) {
          self.setState({
            shouldShow: false
          });
        }
      }
    };
  },
  render: function () {
    var self = this;
    var chart = {
                                           // Width & height controls the svg view box
      width: 1200,
      height: 500,

      /* Optional parameters */
      /* Options for the straight line */
      xAxis: {
       strokeColor: '#000',                // sets stroke color,
       strokeWidth: 2
      },

      bubble: {
        maxRadius: 10,                      // Overrides default & sets a cap for a max radius for the bubble
        strokeColor: '#000',                // Set default stroke color
        strokeColors: ['#000', '#123'],     // This will override the fill color and matches with the adjacent data set
        strokeWidth: 2,                     // Set default stroke width
        strokeWidths: [2, 2],               // This will override the stroke width and matches with the adjacent data set
        fill: '#333',                       // Sets default fill color
        fills: ['#333','#334']              // This will override the fill color and matches with the adjacent data set
                                            // Note: if strokeColor / strokeColors / fill / fills are not provided - it will randomly generate a color
      },

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