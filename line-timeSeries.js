var util = require('util');

var yako = require('./index');
var lineGraph = yako.line;

var http = require('http');
var express = require('express');
var app = express();
var fs = require('fs');

var Label = require('./addons/Label');
var testData = {};
try {
  testData = require('./testData/testData.json');
} catch (err) {
  console.warn(err);
}

// TODO:: fix edge case of 1 data Point
var nOfGraphs = 0;

var now = Date.now();
var nodes = '';

var diff = (Date.now() - now);

for (var i = 0; i < testData.length; i++) {
  if (!(testData[i].content instanceof Array)) {
    continue;
  }
  nOfGraphs++;
  testData[i].content.sort(function (a, b) {
    var a = new Date(a.timestamp),
            b = new Date(b.timestamp);
    return (a.getTime() - b.getTime());
  });

  var keys = Object.keys(testData[i].content[0]);
  var labels = {};
  for (var x = 0; x < keys.length; x++) {
    if ((keys[x] == 'publisher_id') || (keys[x] == 'timestamp')) {
      continue;
    }
    labels[keys[x]] = {
      strokeColor: yako.spark()._randomColor(),
      strokeWidth: '2',
      scattered: {
        strokeWidth: '1',
        radius: '1.5'
      }
      // fill: yako.spark()._randomColor()
    };
  }

  nodes += "<div id='.graph'>" + lineGraph({
          mixin: [Label]
        }).attr({
          chart : {
            width: 600,
            height: 100,
            scattered: true,
            // fill: true,
            yAxis: (Object.keys(labels).length == 2 ? {multi: true} : true),
            xAxis: {
              format : 'dateTime',
              interval: '1M',  //[1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
              // minUTC: Date.UTC(2014,4,1),
              dateTimeLabelFormat: 'MM / DD'
            }
          },
          title: 'just a test',
          data: {
            data: testData[i].content,
            labels: labels
          }
        }) + "</div>";
}


console.log('Took ' + diff + 'ms to generate ' + (nOfGraphs) + ' graphs with avg of ' + (diff/nOfGraphs) + 'ms');
nodes = '<div>' + 'Took ' + diff + 'ms to generate ' + (nOfGraphs) +' graphs with avg of ' + (diff/nOfGraphs) + 'ms' + '</div>' + nodes;

// test optimization => round all numbers to 1 decimal place
nodes = nodes.replace(/([0-9]+\.[0-9]+)/g, function (match, p1) {
  return Math.round10(p1, -1);
});

var str = '<html><head>'+
"<link href='http://fonts.googleapis.com/css?family=Open+Sans:300,600' rel='stylesheet' type='text/css'>"+
'</head><body>' + nodes + '</body><style>.graph {display:inline-block;</style></html>';


var proxy = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
});

app.get('/', function (req, res) {
  res.send(str);
});

app.listen(5000);
