/**
 * TEMPLATE for hovering with multiple axis in react
 * @type {[type]}
 */
var React = require('react');
var Spark = require('../addons/react-components/spark');
module.exports = React.createClass({
  getInitialState: function () {
    return {
      toolTip: {
        shouldShow: false,
        content: '',
        className: '',
        offsetBottom: 20,
        position: {}
      },
      legend: {
        shouldShow: false,
        className: '',
        content: ''
      }
    };
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

    var events = {
      // bindOn are the events you want to listen
      bindOn: ['path:hover','svg:mouseMove','svg:mouseLeave', 'path:click'],
      // event call back
      on: function (tagName, e, props) {
        console.log(props);
        var html = [];
        var shouldShow = false;
        if (tagName == 'svg' && e.type == 'mousemove') {
          shouldShow = true;
          var html = props.points.map(function (key) {
            return key.label + ':' + key.value;
          });
        } 

        self.setState({
          toolTip: {
            shouldShow: shouldShow,
            content: html.join(","),
          }
        });
      }
    };

    return (
      <Spark 
        chart={chart} 
        dataSet={this.props.set}
        events={events}
        toolTip={self.state.toolTip}
        legend={self.state.legend} />
    );
  }
});