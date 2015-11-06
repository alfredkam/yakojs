var yako = require('../addons');
var Label = yako.addons.Label;
var spark = yako.spark;
var pie = yako.pie;
var donut = yako.donut;
var bubble = yako.bubble;
var bar = yako.bar;

var append = function (className, content) {
    document.getElementsByClassName(className)[0].innerHTML = content;
};

var spark = yako.spark;
var component = spark({
  mixin: Label
});

var set = [ { data:
     [ 494, 306, 350, 389, 367, 295, 281, 404, 256, 378, 389, 127, 214, 103, 425, 99, 413, 320, 204, 276, 307, 107, 436, 485, 227, 42, 439, 167, 55, 33 ],
    strokeColor: '#f2ee2',
    fill: '#424c2d',
    scattered:
     { strokeColor: '#38c98f',
       fill: 'white',
       strokeWidth: 2,
       radius: 3 } },
  { data:
     [ 282, 336, 181, 329, 209, 338, 16, 215, 251, 270, 49, 389, 216, 218, 11, 485, 145, 60, 33, 299, 333, 126, 464, 69, 329, 257, 328, 282, 247, 397 ],
    strokeColor: '#ab2ab1',
    fill: '#be514',
    scattered: 
     { strokeColor: '#ab2ab1',
       fill: 'white',
       strokeWidth: 2,
       radius: 3 } } ];

var singleSet = [ { label: 'Auto Generated 3',
       data: 
        [ 187, 292, 117, 391, 250, 325, 358, 236, 497, 125, 132, 446, 267, 86, 431, 186, 13, 328, 258, 88, 359, 293, 127, 229, 137, 422, 144, 95, 397, 485 ],
       strokeColor: '#ac6583'} ];

var svg = component.attr({
    chart : {
      width: 800,
      height: 100
    },
    title: 'just a test',
    data: set
  });

var multiSet = [ { data: [ 36, 409, 109, 245, 355, 410, 257, 316, 179, 19 ],
    strokeColor: 'red',
    strokeWidth: 2,
    scattered: { strokeColor: 'red', fill: 'white', strokeWidth: 2, radius: 2 } },
  { data: [ 273, 354, 307, 68, 483, 70, 253, 507, 325, 474 ],
    strokeColor: 'blue',
    strokeWidth: 2,
    scattered: { strokeColor: 'blue', fill: 'white', strokeWidth: 2, radius: 2 } } ];

append('spark-spark', svg);


var svg = component.attr({
    chart : {
      width: 800,
      height: 100
    },
    title: 'just a test',
    data: singleSet
});
append('spark-line', svg);

var svg = component.attr({
    chart : {
      width: 800,
      height: 100,
      line: false
    },
    title: 'just a test',
    data: set
});
append('spark-area', svg);


var svg = component.attr({
    chart : {
      width: 800,
      height: 100
      // scattered: true
    },
    title: 'just a test',
    data: multiSet,
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
});

append('spark-multi', svg);


var svg = component.attr({
    chart : {
      width: 800,
      height: 100,
      line: false,
      fill: false,
      scattered: true,
    },
    title: 'just a test',
    data: set
  });

append('spark-scattered', svg);

var svg = component.attr({
    chart : {
      width: 800,
      height: 100,
      scattered: true
    },
    title: 'just a test',
    data: multiSet,
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
});

append('spark-label-scattered', svg);
