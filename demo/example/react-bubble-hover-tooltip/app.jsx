var React = require('react');
var Spark = require('./graph');

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

var set2 = dataSet3;
var set = dataSet4;

React.render(
  <div>
    <Spark set={set} set2={set2} />
    <Spark set={set2} set2={set} />
  </div>,
  document.getElementsByTagName('body')[0]);