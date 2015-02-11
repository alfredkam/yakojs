<b>Note this version is a draft and has not been published to NPM yet!</b>

## usage

To use any of graphs you could access them through
``` javascript
var yako = require('yako');
var spark = yako.spark; // spark graph
var pie = yako.pie; // pie chart
var donut = yako.donut; // donut chart
var bar = yako.bar; // bar graph
```

####calling
<i>graph</i>().set(<i>attributes</i>) <br>
&nbsp;&nbsp; => returns a string content with ```<svg>...</svg>``` <br>
<i>graph</i>("#graph").set(<i>attributes</i>) <br> 
&nbsp;&nbsp; => returns a string content with ```<div id='graph'><svg>...</svg></div>```<br>
<i>graph</i>(".graph").set(<i>attributes</i>) <br>
&nbsp;&nbsp; => returns a string content with ```<div class='graph'><svg>...</svg></div>```<br>
<i>graph</i>(<i>domObj</i>).set(<i>attributes</i>)<br> 
&nbsp;&nbsp; => returns this, and automatically does <i>domObj</i>.innerHTML = ```<svg>...</svg>```<br>


####Spark Graph Attributes
```javascript
var set = [
  {
    data: [],// an array with numbers
    // optional parameters
    color: // controls the stroke color. if its not provided, it will randomly generate a color
    width: // controls the stroke width
    fill: '#F0FFF0' // controls the fill color. if its not provided, it will not fill
  },
  {
    data: [], // an array with numbers
    // optional parameters
    color: // controls the stroke color. if its not provided, it will randomly generate a color
    width: // controls the stroke width.
    fill: '#F0FFF0' // controls the fill color. if its not provided, it will not fill
  }
];
// spark accepts multiple data sets
spark('.graph').set({
  chart : {
    // width & height controls the svg view box
    width: 300, // default 200
    height: 100,  // default 100
    // optional parameters
    'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
    line: false // it will disable the line drawing
  },
  data: set //accepts an array or json obj
});
```

####Pie Chart Attributes
```javascript
var set = []; // an array of numbers
pie('.graph').set({
  chart: {
    // width & height controls the svg view box
    width: 300,
    height: 100,
    // optional parameters
    'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
    strokeColor: '#000',  // sets default stroke color
    strokeColors: [],  // this will override the default stroke color and matches with the adjacent data set
    fills: [] // this will by matching with the adjacent data set
    // Note: if strokeColor / strokeColors / fills are not provided - it will randomly generate a color
  },
  data: set
});
```

####Donut Chart Attributes
```javascript
var set = []; // an array of numbers
donut('.graph').set({
  chart: {
    // width & height controls the svg view box
    width: 300,
    height: 100,
    // optional parameters
    'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
    strokeColor: '#000',  // sets default stroke color
    strokeColors: [],  // this will override the default stroke color and matches with the adjacent data set
    fills: [] // this will by matching with the adjacent data set
    // Note: if strokeColor / strokeColors / fills are not provided - it will randomly generate a color
  },
  data: set
});
```

####Bubble Graph Attributes <i>(for a horizontal line time series representation)</i>
```javascript
var set = []; // an array of numbers
bubble('.graph').set({
  // width & height controls the svg view box
  chart: {
    // width & height controls the svg view box
    width: 300,
    height: 100,
    // optional parameters
    'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
    strokeColor: '#000',  // sets default stroke color
    strokeColors: [],  // this will override the default stroke color and matches with the adjacent data set
    fill: '#333', // sets default fill color
    fills: [] // this will override the fill color and matches with the adjacent data set
    // Note: if strokeColor / strokeColors / fill / fills are not provided - it will randomly generate a color
  },
  data: set
});
```

###Bar Graph Attributes
```javascript
var set = [
  {
    data: [], // an array of numbers
    // optional parameters
    color: '#1E90FF', // controls the stroke color
    fill: // controls the fill color
    // if color / fill is not provided, it will randomly generate one
  },
  {
    data: [], // an array of numbers
    // optional parameters
    color: '#FF7F00', // controls the stroke color
    fill: // controls the fill color
    // if color / fill is not provided, it will randomly generate one
  }
];
bar('.graph').set({
  chart : {
    width: 300,
    height: 100,
    // optional parameters
    'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
    stack: true // this will enable stack graph
  },
  data: set
});
```

## extending or modify the library
say you wanted to create your own or modify the library to do something extra. you require the library and extend from it.  Since this is build using common js and inheritance, one could easily extend specific graphs.<br>

For example you think its smarter to compile the svg objects into dom object, during the mid process you would
```javascript
var defaultSpark = require('./lib/spark');
var mySparkGraph = defaultSpark.extend({
  // this will have mySparkGraph's internal call to default to this function
  _make: function (tag, props, data) {
    var node = doc.createElementNS('http://www.w3.org/2000/svg',tag);
    this.assign(node, props);
    this._extend(node.dataset, data);
    return node;
  },
});

var spark = new mySparkGraph('.graph');
spark.set({
  ...
});
```

