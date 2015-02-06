var spark = require('./index').spark;
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

var amount = 10000;
var now = Date.now();

for (var i = 0;i < amount;i++) {
  var string = spark('#graph').set({
    chart : {
      type: 'line',
      width: 700,
      height: 300,
      'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
      showPointer: false
    },
    title : 'just a test',
    data: set
  });
}

console.log('Time took ' + (Date.now() - now) + 'ms to generate ' + amount);