/**
 * TEMPLATE for hovering with multiple axis in react
 * @type {[type]}
 */
var React = require('react');
var Spark = require('../addons/react-components/spark');
module.exports = React.createClass({
  getInitialState: function () {
    // Normally this should be controlled by props
    return {
      toolTip: {
        shouldShow: false,
        content: '',
        className: ''
      },
      legend: {
        shouldShow: false,
        className: '',
        content: ''
      },
      useSetOne: true
    };
  },
  useSetOne: true,
  componentWillMount: function () {
    var self = this;
    self.events = {
      // Event call backs base on bind
      on: {
        'path:hover': function (e, props) {

        },
        'svg:mouseMove': function (e, props) {
          var html = props.points.map(function (key) {
            return key.label + ':' + key.value;
          });

          if(self.state.toolTip.shouldShow === false || self.state.toolTip.content.toString() != html.toString()) {
            self.setState({
              toolTip: {
                shouldShow: true,
                content: html
              }
            });
          }
        },
        'container:mouseLeave': function (e) {
          // e.stopPropagation();
          self.setState({
            toolTip: {
              shouldShow: false
            }
          });
        },
        'span:mouseLeave': function (e) {
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
    var self = this;
    // if (self.state.useSetOne) {
       return (
        <Spark 
          chart={chart} 
          data={self.props.set}
          events={self.events}
          toolTip={self.state.toolTip}
          legend={self.state.legend} />
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