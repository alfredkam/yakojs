var React = require('react');
var BubblePoint = require('./bubble-point');
var BubbleScatter = require('./bubble-scatter');

var dataPoints = 10;
var dataSet = [];
var dataSet5 = [];
var dataSet6 = [];

for (var i=0;i < dataPoints;i++) {
  dataSet.push(Math.floor((Math.random() * 500) + 10));
}

for (var i = 0; i < dataPoints; i++) {
  var temp = [];
  var temp2 = [];
  for (var j = 0; j < 3; j++) {
    temp.push(Math.floor((Math.random() * 500) + 10));
    temp2.push(Math.floor((Math.random() * 500) + 10));
  }
  dataSet5.push(temp);
  dataSet6.push(temp2);
}

var strokColorFirst = 'red';
var strokeColorSecond = 'blue';
var strokeColorThird = 'pink';
var strokeColorFourth = 'green';

var bubbleSet = [
  {
    data: dataSet5,
    fill: strokColorFirst
  },
  {
    data: dataSet6,
    fill: strokeColorSecond
  }
];

React.render(
  <div>
    <BubblePoint set={dataSet} />
    <BubbleScatter set={bubbleSet}/>
  </div>,
  document.getElementsByTagName('body')[0]);