##Usage

To use any of graphs you could access them through
``` javascript
var yako = require('yako'); // or window.yako if FE
var spark = yako.spark; // spark graph
var pie = yako.pie; // pie chart
var donut = yako.donut; // donut chart
var bar = yako.bar; // bar graph
```

####Calling
<i>graph</i>().attr(<i>attributes</i>) <br>
&nbsp;&nbsp; => returns a string content with ```<svg>...</svg>``` <br>
<i>graph</i>("#graph").attr(<i>attributes</i>) <br> 
&nbsp;&nbsp; => returns a string content with ```<div id='graph'><svg>...</svg></div>```<br>
<i>graph</i>(".graph").attr(<i>attributes</i>) <br>
&nbsp;&nbsp; => returns a string content with ```<div class='graph'><svg>...</svg></div>```<br>
<i>graph</i>(<i>domObj</i>).attr(<i>attributes</i>)<br> 
&nbsp;&nbsp; => returns this, and automatically does <i>domObj</i>.innerHTML = ```<svg>...</svg>```<br>

####Spark Graph Attributes
```javascript
var set = [
  {
    data: [214,3423],// an array with numbers
    // optional parameters
    strokeColor: "rgb(200,94,54)",// controls the stroke color. if its not provided, it will randomly generate a color
    strokeWidth: 2, // controls the stroke width
    fill: '#F0FFF0' // controls the fill color. if its not provided, it will not fill
  },
  {
    data: [13414,243243], // an array with numbers
    // optional parameters
    strokeColor: "#333",// controls the stroke color. if its not provided, it will randomly generate a color
    strokeWidth: 2, // controls the stroke width.
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
    stroke: false // it will disable the stroke from drawn
  },
  data: set //accepts an array or json obj
});
```

####Pie Chart Attributes
```javascript
var set = [123,1233,1231,123]; // an array of numbers
pie('.graph').attr({
  chart: {
    // width & height controls the svg view box
    width: 300,
    height: 100,
    // optional parameters
    'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
    strokeColor: '#000',  // sets default stroke color
    strokeColors: ["#333","#444"],  // this will override the default stroke color and matches with the adjacent data set
    fills: ['#123',"#555"] // this will by matching with the adjacent data set
    // Note: if strokeColor / strokeColors / fills are not provided - it will randomly generate a color
  },
  data: set
});
```

####Donut Chart Attributes
```javascript
var set = []; // an array of numbers
donut('.graph').attr({
  chart: {
    // width & height controls the svg view box
    width: 300,
    height: 100,
    // optional parameters
    'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
    strokeColor: '#000',  // sets default stroke color
    strokeColors: ["#f0f","#000",...],  // this will override the default stroke color and matches with the adjacent data set
    fills: ["#f0f","#000",...] // this will by matching with the adjacent data set
    // Note: if strokeColor / strokeColors / fills are not provided - it will randomly generate a color
  },
  data: set
});
```

####Bubble Graph Attributes <i>(for a horizontal line time series representation)</i>
```javascript
var set = []; // an array of numbers
bubble('.graph').attr({
  // width & height controls the svg view box
  chart: {
    // width & height controls the svg view box
    width: 300,
    height: 100,
    // optional parameters
    'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
    // options for the straight line
    strokeColor: '#000',  // sets default stroke color
    // options for the circle
    fill: '#333', // sets default fill color
    fills: ['#333','#334'] // this will override the fill color and matches with the adjacent data set
    // Note: if strokeColor / strokeColors / fill / fills are not provided - it will randomly generate a color
  },
  data: set
});
```

###Bar Graph Attributes
```javascript
var set = [
  {
    data: [23424,2445],// an array with numbers
    fill: '#F0FFF0' // controls the fill color
  },
  {
    data: [23423,34234], // an array with numbers
    fill: '#F0FFF0' // controls the fill color
  }
];
bar('.graph').attr({
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

##Accessing the SVG builder (Draft)
```javascript
var svg = require('yako').svg;
```


##Extending or modify the library
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

