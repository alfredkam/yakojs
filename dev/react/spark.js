var React = require('react');
var spark = require('../../index').spark;
var HoverWithReact = require('../../addons/HoverWithReact');
// var RenderWithReact = require('../../addons/RenderWithReact');

module.exports = React.createClass({
    render: function () {

      var self = this;
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

    return spark({
        mixin: HoverWithReact,
        bindOn: ['path:hover','svg:mouseMove', 'path:click'],
        on: function (tagName, e, props) {
          console.log('on:', tagName, e.type, JSON.stringify(props));
        }
      }).attr({
          chart : {
            width: 1200,
            height: 150,
            'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
            // scattered: true
          },
          'data' : set
      });
    }
});