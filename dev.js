require("babel-core/register")({
  blacklist: ["strict"],
  only: /(src|addons)/,
  extensions: [".es6"]
});

var yako = require('./src/index');
var svg = yako.svg;
var timeSeries = yako.timeSeries;
var spark = yako.spark;
var pie = yako.pie;
var donut = yako.donut;
var bubbleScatter = yako.bubble.scatter;
var bubblePoint = yako.bubble.point;
var bar = yako.bar;

var http = require('http');
var express = require('express');
var app = express();

var addons = require('./src/addons/index.es6');
var Label = addons.Label;

var template = "";

template = "<div style='background:beige'>" + yako.spark().attr({
  width: 300,
  height: 100,
  yAxis: { multi: true },
  points: [{
    data: [1, 1, 1, 1, 1, 1, 3, 1, 1],
    scale: [0, 1] // 0 is min 2 is max
    },
    {
      data: [1, 1, 1, 1, 1, 1, 3, 4, 3],
      scale: [2, 3] // 0 is min 2 is max
    }]
  // scale: [0, 2] // possibly a scale for every data set since spark can have multiple
}) + "</div>";

var str = '<html><head>'+
"<link href='http://fonts.googleapis.com/css?family=Open+Sans:300,600' rel='stylesheet' type='text/css'>"+
'</head><body>' + template + '</body><style>.graph {display:inline-block;}</style></html>';


var proxy = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
});


console.log('generated');
app.get('/', function (req, res) {
  res.send(str);
});

app.listen(5000);
