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
  for (var j = 0; j < 3; j++) {
    temp.push(Math.floor((Math.random() * 500) + 10));
  }
  dataSet5.push({
    data: temp,
    meta: {}
  });
}

var strokColorFirst = 'red';
var strokeColorSecond = 'blue';
var strokeColorThird = 'pink';
var strokeColorFourth = 'green';

var bubbleSet = dataSet5

var bubblePoint =[
  {
//    date: new Date(2015,2,1),
    data: 300,
    fill : '#000',
    meta: {}
    // meta: Object
  },
  {
    //date: new Date(2015, 4, 30),
    data: 150,
    fill : '#000',
    meta: {}
    // meta: Object
  },
  {
    //date: new Date(2015, 9, 30),
    data: 200,
    fill : '#000',
     meta: {}
    // meta: Object
  }];

React.render(
  <div>
    <BubblePoint set={bubblePoint} />
    <BubbleScatter set={bubbleSet}/>
  </div>,
  document.getElementsByTagName('body')[0]);
