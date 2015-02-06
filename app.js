var spark = require('./index').spark;
var http = require('http');
var express = require('express');
var app = express();

var dataSet = [];
var dataSet2 = [];
var dataSet3 = [];
var dataSet4 = [];
for (var i=0;i<10;i++) {
  dataSet.push(Math.floor((Math.random() * 500) + 10));
  dataSet2.push(Math.floor((Math.random() * 500) + 10));
  dataSet3.push(Math.floor((Math.random() * 500) + 10));
  dataSet4.push(Math.floor((Math.random() * 500) + 10));
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
    },
    {
        label: 'Auto Generated 3',
        data: dataSet3,
        color: '#FF00FF'
    }
];

var amount = 30;
var now = Date.now();
var nodes = '';

for (var i = 0;i < amount;i++) {
  nodes += spark('.graph').set({
    chart : {
      type: 'line',
      width: 200,
      height: 100,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      showPointer: false,
      fillArea: true
    },
    title : 'just a test',
    data: set
  });
}

console.log('Time took ' + (Date.now() - now) + 'ms to generate ' + amount);

var str = '<html><head>'+
"<link href='http://fonts.googleapis.com/css?family=Open+Sans:300,600' rel='stylesheet' type='text/css'>"+
'<link rel="stylesheet" href="style.css" type="text/css"></head><body>' + nodes + '</body></html>';

var proxy = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
});

app.use(express.static(__dirname + '/demo'));
app.get('/', function (req, res) {
  res.send(str);
});

app.listen(3000);