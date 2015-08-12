/**
 * Graph ready comparison
 */
var React = require('react');
var Spark = require('./base');
var SimpleSpark = require('../addons/react-components/simpleSpark');
var NoReactSpark = require('../index').spark;

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
  height: 100,
  width: 1200
}

var start = Date.now();
React.render(
    // <SimpleSpark data={set} chart={chart} />,
    <Spark set={set} />,
  document.getElementsByTagName('body')[0]);
console.log('REACT:' + (Date.now() - start) + 'ms');

var start = Date.now();
  var nodes = NoReactSpark('.graph').attr({
    chart : {
      width: 1200,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif'
    },
    title: 'just a test',
    data: set
  });
  document.getElementsByTagName('body')[0].innerHTML += nodes;
  console.log('NO REACT:' + (Date.now() - start) + 'ms');
