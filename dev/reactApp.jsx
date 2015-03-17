var React = require('react');
var Spark = require('./base');
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
  width: 1200,
  height: 150
};

React.render(
  <div>
    <Spark chart={chart} dataSet={set}/>
  </div>,
  document.getElementsByTagName('body')[0]);