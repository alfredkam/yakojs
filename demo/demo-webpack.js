var yako = require('../addons');
var Label = yako.addons.Label;
var spark = yako.spark;
var pie = yako.pie;
var donut = yako.donut;
var bubble = yako.bubble;
var bar = yako.bar;

// TODO:: fix edge case of 1 data Point
var dataPoints = 30;
var nOfGraphs = 10;
var kind = 10;
var oddKinds = 2;
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

  var sparkInstance = spark('.graph');

  nodes += sparkInstance.attr({
    chart : {
      width: 300,
      height: 100
    },
    title: 'just a test',
    data: set
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

  nodes += pie('.graph').attr({
    chart: {
      width: 300,
      height: 100
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
      maxRadius: '10'
      // additional options
      // strokes: [],
      // fills: []
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

nodes = sparkInstance.attr({
    chart : {
      width: 1200,
      height: 150
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
}) + sparkInstance.attr({
    chart : {
      width: 1200,
      height: 150,
      scattered: true
    },
    title: 'just a test',
    data: set,
    yAxis: true,
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
}) + nodes;


var diff = (Date.now() - now);

nodes = '<div>' + 'Took ' + diff + 'ms to generate ' + (nOfGraphs * kind + oddKinds) + ' graphs with '+ dataPoints + ' different data points avg of ' + (diff/((nOfGraphs*kind)+oddKinds)) + 'ms' + '</div>' + nodes;

var body = document.getElementsByTagName('body')[0];
body.innerHTML = nodes;