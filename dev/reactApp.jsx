var React = require('react');
var Spark = require('./base');

var dataPoints = 10;
var dataSet = [];
var dataSet2 = [];
for (var i=0;i < dataPoints;i++) {
  dataSet.push(Math.floor((Math.random() * 500) + 10));
  dataSet2.push(Math.floor((Math.random() * 500) + 10));
}

var strokColorFirst = 'red';
var strokeColorSecond = 'blue';
var set = [
  {
      data: dataSet,
      //color controls the line
      strokeColor: strokColorFirst,
      strokeWidth: 2,
      scattered : {
        strokeColor: strokColorFirst,
        fill: 'white',
        strokeWidth: 2,
        radius: 5
      },
      label: 'red'
      //nodeColor controls the pointer color
  },
  {
      data: dataSet2,
      strokeColor: strokeColorSecond,
      strokeWidth: 2,
      scattered : {
        strokeColor: strokeColorSecond,
        fill: 'white',
        strokeWidth: 2,
        radius: 5
      },
      label: 'blue'
  }
];

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

React.render(
    <Spark
      chart={chart}
      dataSet={set} />,
  document.getElementsByTagName('body')[0]);