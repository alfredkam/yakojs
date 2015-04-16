/**
 * TEMPLATE for hovering with multiple axis in react
 */
var React = require('react');
var yako = require('../../../components');
var Spark = yako.components.Spark;
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
      width: 1200,
      height: 150,
      yAxis: {
        multi: true
      },
      xAxis : {
        // including format will show the xAxis Label
        format : 'dateTime',
        // interval indicates the data interval, the number of the interval indicates the label tick interval
        // same representation is also used for `dateTimeLabelFormat`
        // s - seconds
        // m - minutes
        // h - hours
        // D - days
        // M - months
        // Y - years
        interval: '4h',  //[1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
        // uses the min start date and increment the label by the set interval.  interval will be converted to miliseconds
        minUTC: Date.UTC(2013,8,7),
        //this controls the dateTime label format
        //depending on the format, it will affect the label, try :: dateTimeLabelFormat: 'hhh'
        dateTimeLabelFormat: 'MM/DD hh ap'
        // or if wanted custom label
        // format: 'label',
        // labels: [Array of label], this label must match the data value length, if not the data will be limited.  We will not aggregate the data for you.
      }
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
      <Spark 
        chart={chart} 
        data={self.props.set}
        events={self.events}
        toolTip={toolTip}
        legend={legend} />
    );
  }
});