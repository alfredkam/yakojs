[General Usage](#Usage) <br>
[API] (#api-propose) <br>
[SVG API] (#svg-api) <br>
  
##Usage

To use any of the graphs you could access them through these entry points.
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

####Spark Graph Attributes
```javascript
var set = [
  {
    data: [214,3423],// an array with numbers
    // optional parameters
    strokeColor: "rgb(200,94,54)",// controls the stroke color. 
                                  // if its not provided, it will randomly generate a color
    strokeWidth: 2, // controls the stroke width
    fill: '#F0FFF0' // controls the fill color. if its not provided, it will not fill
    // options for scattered if enabled in chart options
    scattered : {
      strokeColor: "rgb(200,94,54)",
      fill: 'white', // default white
      strokeWidth: 3, // default 3,
      radius: 5 // default 5
    }
  },
  {
    data: [13414,243243], // an array with numbers
    // optional parameters
    strokeColor: "#333",// controls the stroke color. if its not provided, it will randomly generate a color
    strokeWidth: 2, // controls the stroke width.
    fill: '#F0FFF0' // controls the fill color. if its not provided, it will not fill
    // options for scattered if enabled in chart options
    scattered : {
      strokeColor: "rgb(200,94,54)",
      fill: 'white', // default white
      strokeWidth: 3, // default 3,
      radius: 5 // default 5
    }
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
    line: true, // override to disable the line to be drawn
    scattered: false // override to enable scattered
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
    strokeColors: ["#333","#444"],  // this will override the default 
                                    //stroke color and matches with the adjacent data set
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
    outerRadius: 100, // overrides default & sets the outerRadius of the donut
    innerRadius: 25, // overrides the default & controls the innerRadius of the donut
    strokeColor: '#000',  // sets default stroke color
    strokeColors: ["#f0f","#000",...],  // this will override the default 
                                        // stroke color and matches with the adjacent data set
    fills: ["#f0f","#000",...] // this will by matching with the adjacent data set
    // Note: if strokeColor / strokeColors / fills are not provided - it will randomly generate a color
  },
  data: set
});

// default outerRadius & innerRadius base on chart attributes
var circumference = chart.height < chart.width ? chart.height : chart.width;
var outerRadius = chart.outerRadius || (circumference / 2);
var innerRadius = chart.innerRadius || (outerRadius / 2);
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
    paddingX: 10, // default 10 & overrides the paddingX to better suit the adjusted maxRadius.
    // options for the circle
    maxRadius: 100, // overrides default & sets a cap for a max radius for the bubble
    fill: '#333', // sets default fill color
    fills: ['#333','#334'] // this will override the fill color and matches with the adjacent data set
    // Note: if strokeColor / strokeColors / fill / fills are not provided - it will randomly generate a color
  },
  data: set
});

// default maxRadius base on chart attributes
var maxRadius =  chart.maxRadius || (chart.height < chart.width ? chart.height : chart.width) / 2;
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


##API <i>[PROPOSE]</i>
Instances of the graph component are created internally, and each component could be re-used subsequently.  Once you've picked your entry point, you could access the component api. Within each component, you could access your component with ```javascript this```
```javascript
// Example
var yako = require('yako'); // or window.yako if FE
var spark = yako.spark;
var instance = spark({
  mixin: {
    make: function(tagName, attribute, dataAttributes) {
      ...
    }
  },
  compile: function(parent, child) {
    ...
  }
});

var result = instance.attr({
  chart: { ... },
  data: [ ... ]
})
```

####mixin({ ... })
Sometimes common components / functions may share some common functionality with other graph components.  Mixin allows you to enable the magic to happen here.

####make(tagName, attribute, dataAttribute)
make is called everytime to compile a svg element, and expects to return a string or object that ```compile``` function can consume. [Overrides the base function](https://github.com/alfredkam/yakojs/blob/master/lib/base/common.js#L42-L51)

####compile(parent, child)
compile is called everytime to append the child into the parent node. [Overrides the base function](https://github.com/alfredkam/yakojs/blob/master/lib/base/common.js#L53-L63)


##SVG API
```javascript
var svg = require('yako').svg;
```

#####.path.getScale(attr)
returns the scale for the path and returns min, height, interval, heightRatio, height, width in json object.  Expects attr to contain
```javascript
attr = {
  data: [
          [1,2,3,4],
          [34,6,6,7]
        ], // an N * M array or a single N * 1 array, eg [1,23,4,5]
  height: 300,  // in px
  width: 200    // in px
}
```

#####.path.getOpenPath(scale, numberArray)
returns attribute D of ```<path>``` that describes the open path
```javascript
scale = svg.Path.getScale(attr);
numberArray = [1,2,3,4,5,6];  // an N * 1 Number array
```

#####.path.getClosedPath(scale, numberArray)
returns attribute D of ```<path>``` that describes the closed path
```javascript
scale = svg.Path.getScale(attr);
numberArray = [1,2,3,4,5,6];  // an N * 1 Number array
```

#####.arc.polarToCartesian(centerX, centerY, radius, angleInDegress)
returns the polar to cartesian coordinate in ```javascript {x:Number, y:Number} ```

#####.arc.describeArc(centerX, centerY, radius, startAngle, endAngle)
returns attribute D of ```<path>``` that descibes an arc

#####.arc.describePie(centerX, centerY, radius, startAngle, endAngle)
returns attribute D of ```<path>``` that decribes an arc w/ the path closed ~ equivalent to a piece of pie 


##Extending or modify the library
say you wanted to create your own or modify the library to do something extra. you require the library and extend from it.  Since this is build using common js and inheritance, one could easily extend specific graphs.<br>

For example you think its smarter to compile the svg objects into dom object, during the mid process you would
```javascript
var defaultSpark = require('./lib/spark');
var mySparkGraph = defaultSpark.extend({
  // this will have mySparkGraph's internal call to default to this function
  make: function (tag, props, data) {
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

