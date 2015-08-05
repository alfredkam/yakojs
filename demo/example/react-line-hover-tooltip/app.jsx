var React = require('react');
var Line = require('./graph');

var dataPoints = 10;
var dataSet = [];
var dataSet2 = [];
var dataSet3 = [];
var dataSet4 = [];
for (var i=0;i < dataPoints;i++) {
  dataSet.push(Math.floor((Math.random() * 500) + 10));
  dataSet2.push(Math.floor((Math.random() * 500) + 10));
  dataSet3.push(Math.floor((Math.random() * 500) + 10));
  dataSet4.push(Math.floor((Math.random() * 500) + 10));
}

var strokColorFirst = 'red';
var strokeColorSecond = 'blue';
var strokeColorThird = 'pink';
var strokeColorFourth = 'green';
var set = [
  {
      data: dataSet,
      strokeColor: strokColorFirst,
      strokeWidth: 2,
      scattered : {
        strokeColor: strokColorFirst,
        fill: 'white',
        strokeWidth: 2,
        radius: 5
      },
      label: 'red'
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
var set2 = [
  {
      data: dataSet3,
      strokeColor: strokeColorThird,
      strokeWidth: 2,
      scattered : {
        strokeColor: strokeColorThird,
        fill: 'white',
        strokeWidth: 2,
        radius: 5
      },
      label: 'pink',
      meta : {
        // your own content
      }
  },
  {
      data: dataSet4,
      strokeColor: strokeColorFourth,
      strokeWidth: 2,
      scattered : {
        strokeColor: strokeColorFourth,
        fill: 'white',
        strokeWidth: 2,
        radius: 5
      },
      label: 'green',
      meta: {

      }
  }
];

React.render(
  <div>
    <Line set={set}/>
    <Line set={set2}/>
  </div>,
  document.getElementsByTagName('body')[0]);
