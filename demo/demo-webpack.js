var yako = require('../index');
var spark = yako.spark;
var pie = yako.pie;
var donut = yako.donut;
var bubble = yako.bubble;
var bar = yako.bar;

// TODO:: fix edge case of 1 data Point
var dataPoints = 100;
var nOfGraphs = 10;
var kind = 6;
var amount = nOfGraphs;
var now = Date.now();
var nodes = '';

while (amount--) {
  var dataSet = [];
  var dataSet2 = [];
  var dataSet3 = [];
  var dataSet4 = [];
  for (var i=0;i<dataPoints;i++) {
    dataSet.push(Math.floor((Math.random() * 500) + 10));
    dataSet2.push(Math.floor((Math.random() * 500) + 10));
    dataSet3.push(Math.floor((Math.random() * 500) + 10));
    dataSet4.push(Math.floor((Math.random() * 500) + 1));
  }

  var set = [
      {
          label: 'Auto Generated',
          data: dataSet,
          //color controls the line
          color: '#1E90FF'
          //nodeColor controls the pointer color
      },
      {
          label: 'Auto Generated 2',
          data: dataSet2,
          color: '#FF7F00'
      }
  ];
  nodes += spark('.graph').set({
    chart : {
      type: 'line',
      width: 300,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      showPointer: false,
      fill: '#F0FFF0'
    },
    title: 'just a test',
    data: set
  });

  nodes += pie('.graph').set({
    chart: {
      width: 300,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      // additional options
      // strokes: [],
      // fills: []
    },
    title: 'just a test',
    data: dataSet4
  });

  nodes += donut('.graph').set({
    chart: {
      width: 300,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      // addtional options
      // strokes: [],
      // fills: []
    },
    title: 'just a test',
    data: dataSet4
  });

  nodes += bubble('.graph').set({
    chart: {
      width: 300,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      // additional options
      // strokes: [],
      // fills: []
    },
    title: 'just a test',
    data: dataSet4
  });

  nodes += bar('.graph').set({
    chart : {
      stack: true,
      width: 300,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      showPointer: false,
      fill: []
    },
    title: 'just a test',
    data: set
  });

  nodes += bar('.graph').set({
    chart : {
      width: 300,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      showPointer: false,
      fill: []
    },
    title: 'just a test',
    data: set
  });
}

var diff = (Date.now() - now);

console.log('Took ' + diff + 'ms to generate ' + (nOfGraphs * kind) + ' graphs with '+ dataPoints + ' different data points each avg of ' + (diff/nOfGraphs/kind) + 'ms');
nodes = '<div>' + 'Took ' + diff + 'ms to generate ' + (nOfGraphs * kind) + ' graphs with '+ dataPoints + ' different data points avg of ' + (diff/nOfGraphs/kind) + 'ms' + '</div>' + nodes;

var body = document.getElementsByTagName('body')[0];
body.innerHTML = nodes;