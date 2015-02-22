  var yako = require('./index');
var spark = yako.spark;
var pie = yako.pie;
var donut = yako.donut;
var bubble = yako.bubble;
var bar = yako.bar;

var http = require('http');
var express = require('express');
var app = express();
var fs = require('fs');

// TODO:: fix edge case of 1 data Point
var dataPoints = 30;
var nOfGraphs = 10;
var kind = 7;
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

  var strokColorFirst = yako.spark()._randomColor();
  var strokeColorSecond = yako.spark()._randomColor();
  var set = [
      {
          data: dataSet,
          //color controls the line
          strokeColor: strokColorFirst,
          fill: yako.spark()._randomColor(),
          scattered : {
            strokeColor: strokColorFirst,
            fill: 'white',
            strokeWidth: 3,
            radius: 5
          }
          //nodeColor controls the pointer color
      },
      {
          data: dataSet2,
          strokeColor: strokeColorSecond,
          fill: yako.spark()._randomColor(),
          scattered : {
            strokeColor: strokeColorSecond,
            fill: 'white',
            strokeWidth: 3,
            radius: 5
          }
      }
  ];

  var singleSet = [
    {
        label: 'Auto Generated 3',
        data: dataSet3,
        strokeColor: yako.spark()._randomColor(),
        fill: yako.spark()._randomColor()
    }
  ];
  
  nodes += spark('.graph').attr({
    chart : {
      width: 300,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif'
    },
    title: 'just a test',
    data: set
  });

  nodes += spark('.graph').attr({
    chart : {
      width: 300,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif'
    },
    title: 'just a test',
    data: singleSet
  });

  nodes += spark('.graph').attr({
    chart : {
      width: 300,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      scattered: true,
    },
    title: 'just a test',
    data: set
  });

  nodes += spark('.graph').attr({
    chart : {
      width: 300,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      scattered: true,
      line: false
    },
    title: 'just a test',
    data: set
  });

  nodes += pie('.graph').attr({
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

  nodes += donut('.graph').attr({
    chart: {
      width: 300,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      innerRadius: 40,
      outerRadius: 50
      // addtional options
      // strokes: [],
      // fills: []
    },
    title: 'just a test',
    data: dataSet4
  });

  nodes += bubble('.graph').attr({
    chart: {
      width: 300,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      maxRadius: '10'
      // additional options
      // strokes: [],
      // fills: []
    },
    title: 'just a test',
    data: dataSet4
  });

  nodes += bar('.graph').attr({
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

  nodes += bar('.graph').attr({
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

// test optimization => round all numbers to 1 decimal place
nodes = nodes.replace(/([0-9]+\.[0-9]+)/g, function (match, p1) {
  return Math.round10(p1,-1);
});

var str = '<html><head>'+
"<link href='http://fonts.googleapis.com/css?family=Open+Sans:300,600' rel='stylesheet' type='text/css'>"+
'<link rel="stylesheet" href="style.css" type="text/css"></head><body>' + nodes + '</body></html>';

var proxy = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
});

// fs.writeFileSync(__dirname + '/demo/demo.html', str);

app.use(express.static(__dirname + '/demo'));
app.get('/', function (req, res) {
  res.send(str);
});

app.listen(3000);