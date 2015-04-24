var util = require('util');

var yako = require('./index');
var timeSeries = require('./time-series');
var spark = yako.spark;
var pie = yako.pie;
var donut = yako.donut;
var bubble = yako.bubble;
var bar = yako.bar;
var bubbleScatterComplex = timeSeries.bubble.scatter;
var bubblePointComplex = timeSeries.bubble.point;

var http = require('http');
var express = require('express');
var app = express();
var fs = require('fs');

var Label = require('./addons/Label');

// TODO:: fix edge case of 1 data Point
var dataPoints = 30;
var nOfGraphs = 12;
var kind = 11;
var oddKinds = 4;
var amount = nOfGraphs;

var now = Date.now();
var nodes = '';

while (amount--) {
  var dataSet = [];
  var dataSet2 = [];
  var dataSet3 = [];
  var dataSet4 = [];
  var dataSet5 = [];
  var dataSet6 = [];
  var dataSet7 = [];
  for (var i=0;i < dataPoints;i++) {
    dataSet.push(Math.floor((Math.random() * 500) + 10));
    dataSet2.push(Math.floor((Math.random() * 500) + 10));
    dataSet3.push(Math.floor((Math.random() * 500) + 10));
    dataSet4.push(Math.floor((Math.random() * 500) + 1));
  }

  for (var i = 0; i < dataPoints; i++) {
    var temp = [];
    var temp2 = [];
    for (var j = 0; j < 3; j++) {
      temp.push(Math.floor((Math.random() * 500) + 10));
      temp2.push(Math.floor((Math.random() * 500) + 10));
    }
    dataSet7.push({
      data: temp
    });
    dataSet5.push(temp);
    dataSet6.push(temp2);
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
            strokeWidth: 2,
            radius: 3
          }
      },
      {
          data: dataSet2,
          strokeColor: strokeColorSecond,
          fill: yako.spark()._randomColor(),
          scattered : {
            strokeColor: strokeColorSecond,
            fill: 'white',
            strokeWidth: 2,
            radius: 3
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

  var bubbleSet = [
    {
      data: dataSet5,
      fill: yako.spark()._randomColor()
    },
    {
      data: dataSet6,
      fill: yako.spark()._randomColor()
    }
  ];

  nodes += "<div class='graph'>" + bubbleScatterComplex().attr({
    width: 300,
    height: 100,
    /* Optional parameters */
    /* Options for the circle */
    maxRadius: 10,            // Overrides default & sets a cap for a max radius for the bubble
    fill: '#000',             // Sets the default fill color
    inverse: [],
    /* Padding options for the chart */
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    points: dataSet7
  });

  // var samplePoints = [{"data":8516,"fill":"#2960ac","date":"2014-10-08T00:00:00.000Z","meta":{"count":8516,"date":"2014-10-08","version":20.4,"rating":1.446}},{"data":5380,"fill":"#2960ac","date":"2014-07-17T00:00:00.000Z","meta":{"count":5380,"date":"2014-07-17","version":20.5,"rating":1.4635}},{"data":8251,"fill":"#da294a  ","date":"2014-11-24T00:00:00.000Z","meta":{"count":8251,"date":"2014-11-24","version":20.4,"rating":4.9304}},{"data":3456,"fill":"#9ccee0  ","date":"2014-06-06T00:00:00.000Z","meta":{"count":3456,"date":"2014-06-06","version":20.3,"rating":2.9126}},{"data":1208,"fill":"#6fa3cd  ","date":"2014-06-24T00:00:00.000Z","meta":{"count":1208,"date":"2014-06-24","version":20.3,"rating":1.7544}},{"data":8875,"fill":"#6fa3cd  ","date":"2014-03-07T00:00:00.000Z","meta":{"count":8875,"date":"2014-03-07","version":20.1,"rating":1.8366}},{"data":7559,"fill":"#2960ac  ","date":"2014-02-13T00:00:00.000Z","meta":{"count":7559,"date":"2014-02-13","version":20.5,"rating":1.4732}},{"data":926,"fill":"#9ccee0  ","date":"2014-12-12T00:00:00.000Z","meta":{"count":926,"date":"2014-12-12","version":20.2,"rating":2.7276}}];

  // Sample point with 1 data point
  // var samplePoints = [{"data":8516,"fill":"#2960ac","date":"2014-10-08T00:00:00.000Z","meta":{"count":8516,"date":"2014-10-08","version":20.4,"rating":1.446}}];
  var samplePoints = [{"data":479,"fill":"#9ccee0  ","date":"2015-04-19T00:00:00.000Z","meta":{"count":479,"date":"2015-04-19","version":"3.4.2","rating":3}},{"data":337,"fill":"#9ccee0  ","date":"2015-03-26T00:00:00.000Z","meta":{"count":337,"date":"2015-03-26","version":"3.4","rating":3}},{"data":345,"fill":"#6fa3cd  ","date":"2015-02-22T00:00:00.000Z","meta":{"count":345,"date":"2015-02-22","version":"3.3.2","rating":2}},{"data":563,"fill":"#faa21b  ","date":"2015-02-09T00:00:00.000Z","meta":{"count":563,"date":"2015-02-09","version":"3.3","rating":3.5}},{"data":1721,"fill":"#2960ac  ","date":"2014-12-30T00:00:00.000Z","meta":{"count":1721,"date":"2014-12-30","version":"3.2","rating":0.5}},{"data":303,"fill":"#6fa3cd  ","date":"2014-12-06T00:00:00.000Z","meta":{"count":303,"date":"2014-12-06","version":"3.1.2","rating":1.5}},{"data":196,"fill":"#6fa3cd  ","date":"2014-11-20T00:00:00.000Z","meta":{"count":196,"date":"2014-11-20","version":"3.1.1","rating":2}},{"data":38,"fill":"#2960ac  ","date":"2014-11-14T00:00:00.000Z","meta":{"count":38,"date":"2014-11-14","version":"3.1","rating":1}},{"data":224,"fill":"#6fa3cd  ","date":"2014-10-11T00:00:00.000Z","meta":{"count":224,"date":"2014-10-11","version":"3.0.2","rating":2}},{"data":333,"fill":"#9ccee0  ","date":"2014-09-16T00:00:00.000Z","meta":{"count":333,"date":"2014-09-16","version":"3.0","rating":2.5}},{"data":430,"fill":"#6fa3cd  ","date":"2014-07-09T00:00:00.000Z","meta":{"count":430,"date":"2014-07-09","version":"2.5.1","rating":2}},{"data":75,"fill":"#6fa3cd  ","date":"2014-06-26T00:00:00.000Z","meta":{"count":75,"date":"2014-06-26","version":"2.4.3","rating":2}},{"data":123,"date":"2014-06-25T00:00:00.000Z","meta":{"count":123,"date":"2014-06-25","version":"2.4.2","rating":null}},{"data":57,"fill":"#6fa3cd  ","date":"2014-06-12T00:00:00.000Z","meta":{"count":57,"date":"2014-06-12","version":"2.4.1","rating":1.5}},{"data":116,"fill":"#faa21b  ","date":"2014-06-05T00:00:00.000Z","meta":{"count":116,"date":"2014-06-05","version":"2.4","rating":3.5}},{"data":123,"fill":"#6fa3cd  ","date":"2014-05-08T00:00:00.000Z","meta":{"count":123,"date":"2014-05-08","version":"2.3.2","rating":2}},{"data":0,"date":"2014-04-28T00:00:00.000Z","meta":{"count":0,"date":"2014-04-28","version":"2.3.1","rating":null}},{"data":8,"fill":"#2960ac  ","date":"2014-04-24T00:00:00.000Z","meta":{"count":8,"date":"2014-04-24","version":"2.3","rating":1}},{"data":9,"fill":"#2960ac  ","date":"2014-04-17T00:00:00.000Z","meta":{"count":9,"date":"2014-04-17","version":"2.2","rating":0.5}},{"data":609,"fill":"#2960ac  ","date":"2014-02-14T00:00:00.000Z","meta":{"count":609,"date":"2014-02-14","version":"2.1","rating":1}},{"data":893,"fill":"#6fa3cd  ","date":"2013-12-13T00:00:00.000Z","meta":{"count":893,"date":"2013-12-13","version":"2.0.6","rating":1.5}},{"data":266,"fill":"#6fa3cd  ","date":"2013-11-25T00:00:00.000Z","meta":{"count":266,"date":"2013-11-25","version":"2.0.3","rating":2}},{"data":255,"fill":"#9ccee0  ","date":"2013-11-16T00:00:00.000Z","meta":{"count":255,"date":"2013-11-16","version":"2.0.2","rating":2.5}},{"data":30,"fill":"#2960ac  ","date":"2013-11-13T00:00:00.000Z","meta":{"count":30,"date":"2013-11-13","version":"2.0.1","rating":1}},{"data":94,"fill":"#faa21b  ","date":"2013-11-06T00:00:00.000Z","meta":{"count":94,"date":"2013-11-06","version":"2.0","rating":3.5}},{"data":31,"fill":"#6fa3cd  ","date":"2013-10-11T00:00:00.000Z","meta":{"count":31,"date":"2013-10-11","version":"1.8.5","rating":2}},{"data":43,"fill":"#9ccee0  ","date":"2013-10-01T00:00:00.000Z","meta":{"count":43,"date":"2013-10-01","version":"1.8.4","rating":2.5}},{"data":209,"fill":"#9ccee0  ","date":"2013-09-12T00:00:00.000Z","meta":{"count":209,"date":"2013-09-12","version":"1.8.1","rating":3}},{"data":4591,"fill":"#2960ac  ","date":"2013-08-24T00:00:00.000Z","meta":{"count":4591,"date":"2013-08-24","version":"1.8","rating":1}},{"data":4397,"fill":"#faa21b  ","date":"2013-07-17T00:00:00.000Z","meta":{"count":4397,"date":"2013-07-17","version":"1.7.3","rating":3.5}},{"data":0,"date":"2013-07-04T00:00:00.000Z","meta":{"count":0,"date":"2013-07-04","version":"1.7.2","rating":null}},{"data":0,"date":"2013-07-03T00:00:00.000Z","meta":{"count":0,"date":"2013-07-03","version":"1.7.1","rating":null}},{"data":0,"date":"2013-07-01T00:00:00.000Z","meta":{"count":0,"date":"2013-07-01","version":"1.7","rating":null}},{"data":0,"date":"2013-06-18T00:00:00.000Z","meta":{"count":0,"date":"2013-06-18","version":"1.6.1","rating":null}},{"data":0,"date":"2013-06-04T00:00:00.000Z","meta":{"count":0,"date":"2013-06-04","version":"1.6","rating":null}},{"data":0,"date":"2013-05-09T00:00:00.000Z","meta":{"count":0,"date":"2013-05-09","version":"1.5","rating":null}},{"data":0,"date":"2013-04-12T00:00:00.000Z","meta":{"count":0,"date":"2013-04-12","version":"1.4.1","rating":null}},{"data":0,"date":"2013-04-11T00:00:00.000Z","meta":{"count":0,"date":"2013-04-11","version":"1.4","rating":null}},{"data":0,"date":"2013-03-01T00:00:00.000Z","meta":{"count":0,"date":"2013-03-01","version":"1.3.1","rating":null}},{"data":0,"date":"2013-02-19T00:00:00.000Z","meta":{"count":0,"date":"2013-02-19","version":"1.3","rating":null}},{"data":0,"date":"2013-02-05T00:00:00.000Z","meta":{"count":0,"date":"2013-02-05","version":"1.2","rating":null}},{"data":0,"date":"2012-11-21T00:00:00.000Z","meta":{"count":0,"date":"2012-11-21","version":"1.1.1","rating":null}},{"data":0,"date":"2012-11-13T00:00:00.000Z","meta":{"count":0,"date":"2012-11-13","version":"1.1","rating":null}},{"data":0,"date":"2012-10-27T00:00:00.000Z","meta":{"count":0,"date":"2012-10-27","version":"1.0.2","rating":null}},{"data":0,"date":"2012-10-15T00:00:00.000Z","meta":{"count":0,"date":"2012-10-15","version":"1.0.1","rating":null}},{"data":0,"date":"2012-09-28T00:00:00.000Z","meta":{"count":0,"date":"2012-09-28","version":"1.0","rating":null}}];

  for (var i in samplePoints) {
      samplePoints[i].date = new Date (samplePoints[i].date);
      samplePoints[i].fill = (samplePoints[i].fill || '').trim();
  }

  nodes += "</div><div class='graph'>" + bubblePointComplex().attr({
    // Width & height controls the svg view box
    width: 300,
    height: 100,

    /* Optional parameters */
    /* Options for the straight line */
    axis: {
      strokeColor: '#000',                // sets stroke color,
      strokeWidth: 2
    },
    maxRadius: 10,                      // Overrides default & sets a cap for a max radius for the bubble
    strokeColor: '#000',                // Set default stroke color
    strokeWidth: 2,                     // Set default stroke width
    fill: '#333',                       // Sets default fill color
    // startDate: 1418885572796,
    // endDate: 1439253572796,
    // points: [
    // {
    //   date: new Date(2015,2,1),
    //   data: 300,
    //   fill : '#000'
    //   // meta: Object
    // },
    // {
    //   date: new Date(2015, 4, 30),
    //   data: 150,
    //   fill : '#000'
    //   // meta: Object
    // },
    // {
    //   date: new Date(2015, 9, 30),
    //   data: 200,
    //   fill : '#000'
    //   // meta: Object
    // }],
    points: samplePoints,

    /* Padding options for the chart */
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
  }) + "</div>";


  var sparkInstance = spark('.graph');
  
  nodes += sparkInstance.attr({
    chart : {
      width: 300,
      height: 100
    },
    title: 'just a test',
    points: set
  });

  nodes += sparkInstance.attr({
    chart : {
      width: 300,
      height: 100
    },
    title: 'just a test',
    data: singleSet
  });

  nodes += spark('.graph').attr({
    chart : {
      width: 300,
      height: 100,
      scattered: true,
      fill: false
    },
    title: 'just a test',
    data: set
  });

  nodes += spark('.graph').attr({
    chart : {
      width: 300,
      height: 100,
      scattered: true,
      line: false,
      fill: false
    },
    title: 'just a test',
    data: set
  });

  // nodes += pie('.graph').attr({
  //   chart: {
  //     width: 300,
  //     height: 100,
  //     // additional options
  //     // strokes: [],
  //     // fills: []
  //   },
  //   title: 'just a test',
  //   data: dataSet4
  // });

  // nodes += donut('.graph').attr({
  //   chart: {
  //     width: 300,
  //     height: 100,
  //     innerRadius: 40,
  //     outerRadius: 50
  //     // addtional options
  //     // strokes: [],
  //     // fills: []
  //   },
  //   title: 'just a test',
  //   data: dataSet4
  // });

  nodes += pie('.graph').attr({
    chart: {
      width: 300,
      height: 100,
      // additional options
      // strokes: [],
      // fills: []
    },
    title: 'just a test',
    data: [1100, 0]
  });

  nodes += donut('.graph').attr({
    chart: {
      width: 300,
      height: 100,
      innerRadius: 40,
      outerRadius: 50
      // addtional options
      // strokes: [],
      // fills: []
    },
    title: 'just a test',
    data: [1100, 0]
  });

  nodes += bubble('.graph').attr({
    chart: {
      width: 300,
      height: 100,
      xAxis: {
        strokeColor: '#333',
      },
      bubble: {
        maxRadius: 10,
        strokeColor: 'red',
        strokeWidth: '3'
        // additional options
        // strokes: [],
        // fills: []
      }
    },
    title: 'just a test',
    data: dataSet4
  });

  nodes += bubble('.graph').attr({
    chart: {
      width: 300,
      height: 100
    },
    title: 'just a test',
    data: dataSet4
  });

  // scattered graph
  nodes += bubble('.graph').attr({
    chart: {
      width: 300,
      height: 100,
      maxRadius: '10',
      type: 'scattered'
      // additional options
      // strokes: [],
    },
    title: 'just a test',
    data: bubbleSet
  });
  
  nodes += bar('.graph').attr({
    chart : {
      stack: true,
      width: 300,
      height: 100,
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
      showPointer: false,
      fill: []
    },
    title: 'just a test',
    data: set
  });
}

dataSet = [];
dataSet2 = [];
for (var i=0;i < 10;i++) {
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
        }
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
        }
    }
];

var sparkInstance = spark({
  mixin: Label
});

nodes = '<div class=".graph">' + sparkInstance.attr({
    chart : {
      width: 1200,
      height: 150,
      // scattered: true
    },
    title: 'just a test',
    data: set,
    yAxis: {
      multi: true
    },
    xAxis : {
      // including format will show the xAxis Label
      format : 'dateTime',
      // interval indicates the data interval, the number of the interval indicates the label tick interval
      // same representation is also used for `dateTimeLabelFormat`
      // s - seconds
      // m - minutes
      // h - hours
      // D - days
      // M - months
      // Y - years
      interval: '4h',  //[1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
      // uses the min start date and increment the label by the set interval.  interval will be converted to miliseconds
      minUTC: Date.UTC(2013,8,7),
      //this controls the dateTime label format
      //depending on the format, it will affect the label, try :: dateTimeLabelFormat: 'hhh'
      dateTimeLabelFormat: 'MM/DD hh ap'
      // or if wanted custom label
      // format: 'label',
      // labels: [Array of label], this label must match the data value length, if not the data will be limited.  We will not aggregate the data for you.
    }
}) + '</div><div class=".graph">'  + sparkInstance.attr({
    chart : {
      width: 1200,
      height: 150,
      scattered: true
    },
    title: 'just a test',
    data: set,
    yAxis: true,
    xAxis : {
      fontSize: '14',
      // including format will show the xAxis Label
      format : 'dateTime',
      // interval indicates the data interval, the number of the interval indicates the label tick interval
      // same representation is also used for `dateTimeLabelFormat`
      // s - seconds
      // m - minutes
      // h - hours
      // D - days
      // M - months
      // Y - years
      interval: '1D',  //[1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
      // uses the min start date and increment the label by the set interval.  interval will be converted to miliseconds
      minUTC: Date.UTC(2013,8,7),
      //this controls the dateTime label format
      //depending on the format, it will affect the label, try :: dateTimeLabelFormat: 'hhh'
      dateTimeLabelFormat: 'MM/DD hh ap'
      // or if wanted custom label
      // format: 'label',
      // label: [Array of label], this label must match the data value length, if not the data will be limited.  We will not aggregate the data for you.
  }
}) + '</div>' + nodes;


// *** preRender Test *** //
nodes = bubble({
  mixin: Label,
  postRender: function (context) {
    return "<div class='.graph'>" + context + "</div>";
  }
}).attr({
  chart: {
    width: 300,
    height: 100,
    maxRadius: '10',
    type: 'scattered',
    paddingLeft: 35,
    yAxis: true,
    xAxis: {
      format : 'custom',
      labels : ['low', 'high']
    }
  },
  title: 'just a test',
  data: bubbleSet
}) + bar({
  mixin: Label,
  postRender: function (context) {
    return "<div class='.graph'>" + context + "</div>";
  }
}).attr({
  chart : {
    stack: true,
    width: 600,
    height: 100,
    showPointer: false,
    fill: [],
    yAxis: true,
    xAxis: {
      format : 'dateTime',
      interval: '1D',  //[1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
      minUTC: Date.UTC(2013,8,7),
      dateTimeLabelFormat: 'MM/DD hh ap'
    }
  },
  title: 'just a test',
  data: set
}) + bar({
  mixin: Label,
  postRender: function (context) {
    return "<div class='.graph'>" + context + "</div>";
  }
}).attr({
  chart : {
    width: 600,
    height: 100,
    showPointer: false,
    fill: [],
    yAxis: true,
    xAxis: {
      format : 'dateTime',
      interval: '1D',  //[1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
      minUTC: Date.UTC(2013,8,7),
      dateTimeLabelFormat: 'MM/DD hh ap'
    }
  },
  title: 'just a test',
  data: set
}) + nodes;

var diff = (Date.now() - now);

console.log('Took ' + diff + 'ms to generate ' + (nOfGraphs * kind + oddKinds) + ' graphs with '+ dataPoints + ' different data points each avg of ' + (diff/((nOfGraphs*kind)+oddKinds)) + 'ms');
nodes = '<div>' + 'Took ' + diff + 'ms to generate ' + (nOfGraphs * kind + oddKinds) + ' graphs with '+ dataPoints + ' different data points avg of ' + (diff/((nOfGraphs*kind)+oddKinds)) + 'ms' + '</div>' + nodes;

// test optimization => round all numbers to 1 decimal place
nodes = nodes.replace(/([0-9]+\.[0-9]+)/g, function (match, p1) {
  return Math.round10(p1, -1);
});

var str = '<html><head>'+
"<link href='http://fonts.googleapis.com/css?family=Open+Sans:300,600' rel='stylesheet' type='text/css'>"+
'</head><body>' + nodes + '</body><style>.graph {display:inline-block;}</style></html>';


var proxy = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
});

app.get('/', function (req, res) {
  res.send(str);
});

app.listen(5000);
