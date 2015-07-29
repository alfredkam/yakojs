/**
 * TEMPLATE for hovering with multiple axis in react
 * @type {[type]}
 */
var React = require('react');
var Spark = require('../addons/react-components/spark');
var PureRenderMixin = React.addons.PureRenderMixin;

var ToolTip = React.createClass({
  mixin: [PureRenderMixin],
  render: function () {
    var html = {};
    if (Object.keys(this.props.content).length !== 0) {
      if (this.props.content.exactPoint) {
        html = 'point at value : ' + this.props.content.exactPoint.label + ',' + this.props.content.exactPoint.value;
      } else {
        html = this.props.content.points.map(function (key) {
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


module.exports = React.createClass({
  getInitialState: function () {
    // Normally this should be controlled by props
    return {
      toolTip: {
        shouldShow: false,
      },
      useSetOne: true
    };
  },
  useSetOne: true,
  componentWillMount: function () {
    var onActivity = function (e, props) {
      self.setState({
        toolTip: {
          shouldShow: true
        }
      });
    }
    var self = this;
    self.events = {
      // Event call backs base on bind
      on: {
        'path:mouseMove': onActivity,
        'svg:mouseMove': onActivity,
        'container:mouseLeave': function (e) {
          self.setState({
            toolTip: {
              shouldShow: false
            }
          });
        }
      }
    };
  },
  componentDidMount: function () {
    // var self = this;
    // setTimeout(function () {
    //   self.setState({
    //     useSetOne: false
    //   });
    // },5000);
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
        shouldShow: self.state.toolTip.shouldShow,
        reactElement: ToolTip
      }
    }


    var self = this;
    // if (self.state.useSetOne) {
       return (
        <Spark 
          chart={chart} 
          data={self.props.set}
          events={self.events}
          toolTip={toolTip}
          legend={legend} />
      );
    // } else {
    //    return (
    //     <Spark 
    //       chart={chart} 
    //       data={self.props.set2}
    //       events={self.events}
    //       toolTip={self.state.toolTip}
    //       legend={self.state.legend} />
    //   );
    // }
   
  }
});