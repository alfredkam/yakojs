##Content
- [General Usage](#Usage)
  - [Spark Graph Attributes](#spark-graph-attributes)
  - [Line Graph Attributes](#line-graph-attributes)
  - [Pie Chart Attributes](#pie-chart-attributes)
  - [Donut Chart Attributes](#donut-chart-attributes)
  - [Bubble Graph Attributes ( for representing a cohort)](#bubble-graph-attributes)
  - [Bubble Point Graph Attributes (for a horizontal line time series representation)](#bubble-point-bubble-line-attributes)
  - [Bar Graph Attributes](#bar-graph-attributes)
- [API & Mixin](#api--mixin)
- [SVG API](#svg-api)
- [Addons](#addons)
  - [Label](#label)
  - [ReturnAsObject](#returnasobject)
  - [React Components](#react-components)
    - [Spark](#spark)
    - [Spark with Events in react](#spark-with-events-in-react)
    - [Pie](#pie)
    - [Donut](#donut)
    - [Bubble](#bubble)
    - [Bubble Point (line)](#bubble-point-line)
    - [Bar](#bar)
- [Extend or Modify Library](#extending-or-modify-library)

[External Link: Visual Examples](http://alfredkam.com/yakojs/example.html)

##General Usage
To use any of the graphs you could access them through these entry points.
``` javascript
var yako = require('yako');                // or window.yako on the browser
var bar = yako.bar;                        // Bar graph
var bubbleScatter = yako.bubble.scater;    // Bubble (scatter) graph
var bubblePoint = yako.bubble.point;       // Bubble point (line) graph
var donut = yako.donut;                    // Donut chart
var spark = yako.spark;                    // Spark graph
var line = yako.line;                      // Line graph
var pie = yako.pie;                        // Pie chart
```

####Initializing
<i>graph</i>().attr(<i>attributes</i>) <br>
&nbsp;&nbsp; => returns a string ```<svg>...</svg>``` <br>
<i>graph</i>("#graph").attr(<i>attributes</i>) <br>
&nbsp;&nbsp; => returns a string ```<div id='graph'><svg>...</svg></div>```<br>
<i>graph</i>(".graph").attr(<i>attributes</i>) <br>
&nbsp;&nbsp; => returns a string ```<div class='graph'><svg>...</svg></div>```<br>

####Spark Graph Attributes
```javascript
var set = [
  {
    points: [214,3423],             // An array with numbers

    /* Optional parameters */
    strokeColor: "rgb(200,94,54)",// Controls the stroke color. 
                                  // If its not provided, it will randomly generate a color
    strokeWidth: 2,               // Controls the stroke width
    fill: '#F0FFF0'               // Controls the fill color. if its not provided, it will not fill

    /* Options for scattered if enabled in chart options */
    scattered : {
      strokeColor: "rgb(200,94,54)",
      fill: 'white',              // Default white
      strokeWidth: 3,             // Default 3,
      radius: 5                   // Default 5
    }
  },
  {
    points: [13414,243243],         // An array with numbers

    /* Optional parameters */
    strokeColor: "#333",          // Controls the stroke color. if its not provided, it will randomly generate a color
    strokeWidth: 2,               // Controls the stroke width.
    fill: '#F0FFF0'               // Controls the fill color. if its not provided, it will not fill

    /* Options for scattered if enabled in chart options */
    scattered : {
      strokeColor: "rgb(200,94,54)",
      fill: 'white',              // Default white
      strokeWidth: 3,             // Default 3,
      radius: 5                   // Default 5
    }
  }
];

// Spark accepts multiple data sets
spark().attr({
                               // Width & height controls the svg view box
  width: 300,                  // Default 200
  height: 100,                 // Default 100

  /* Optional parameters */
  stroke: false                // It will disable the stroke from drawn
  line: true,                  // Override to disable the line to be drawn
  fill: true,                  // Defaults is true, override to disable fill
                               // Say if you want to only have scattered graph, you will set line & fill properties to false
  scattered: false,            // Override to enable scattered
  invert: ['y']                // Optionally if want to invert the data set

  /* Padding options for the chart */
  paddingLeft: 0, 
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  points: set                      // Accepts an array or json obj
});
```

####Line Graph Attributes
Line graph is relatively similar to spark graph, except line graph works with time series data.

```javascript
var dataPoints = {

  data: [
    {"labelOne":"951", "labelTwo":"119695", "timestamp":"2014-06-06"},
    {"labelOne":"912", "labelTwo":"119263", "timestamp":"2014-07-01"}
  ],

  /* A config for each data's key must be include in labels in order for that data set to be drawn. */
  labels: {
            "labelOne": {
              "strokeColor": "#15b74",  // Set stroke color
              "strokeWidth": "2",       // Set stroke width
              "fill": "black"           // Set fill color
              
              /* Options for scatter, by including the scatter option - scatter will be enable  */
              "scattered": {
                  "strokeWidth": "1",   // Set the scatter's circle stroke width
                  "radius": "1.5",      // Set the scatter's circle radius
                  "fill": "red"         // Set the scatter's circle fill color
              }
            },

            // 
            "labelTwo": {
              "strokeColor": "#2ff158",  // Set stroke color
              "strokeWidth": "2",       // Set stroke width
              "fill": "black"           // Set fill color

              /* Options for scatter, by including the scatter option - scatter will be enable  */
              "scattered": {
                "strokeWidth": "1",   // Set the scatter's circle stroke width
                "radius": "1.5",      // Set the scatter's circle radius
                "fill": "red"         // Set the scatter's circle fill color
              }
            }
          }
};

line().attr({
                               // Width & height controls the svg view box
  width: 600,                  // Default 200
  height: 100,                 // Default 100

  /* Optional parameters */
  stroke: false                // It will disable the stroke from drawn
  line: true,                  // Override to disable the line to be drawn
  fill: true,                  // Defaults is true, override to disable fill
                               // Say if you want to only have scattered graph, you will set line & fill properties to false
  scattered: false,            // Override to enable scattered

  /* Padding options for the chart */
  paddingLeft: 0, 
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,

  /* Graph data to be drawn */
  points: dataPoints 
});
```
####Pie Chart Attributes
```javascript
var set = [123,1233,1231,123];      // An array of numbers
pie('.graph').attr({
                                  // Width & height controls the svg view box
  width: 300,
  height: 100,

  /* Optional parameters */
  strokeColor: '#000',            // Sets default stroke color
  strokeColors: ["#333","#444"],  // This will override the default 
                                  // Stroke color and matches with the adjacent data set
  fills: ['#123',"#555"]          // This will by matching with the adjacent data set
                                  // Note: if strokeColor / strokeColors / 
                                  // Fills are not provided - it will randomly generate a color
  /* Padding options for the chart */
  paddingLeft: 0, 
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  points: set
});
```

####Donut Chart Attributes
```javascript
var set = [];                           // An array of numbers
donut('.graph').attr({
                                      // Width & height controls the svg view box
  width: 300,
  height: 100,

  /* optional parameters */
  outerRadius: 100,                   // Overrides default & sets the outerRadius of the donut
  innerRadius: 25,                    // Overrides the default & controls the innerRadius of the donut
  strokeColor: '#000',                // Sets default stroke color
  strokeColors: ["#f0f","#000",...],  // This will override the default 
                                      // Stroke color and matches with the adjacent data set
  fills: ["#f0f","#000",...]          // This will by matching with the adjacent data set
                                      // Note: if strokeColor / strokeColors / fills are not provided - it will randomly generate a color

  /* Padding options for the chart */
  paddingLeft: 0, 
  paddingRight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  points: set
});

/* Default outerRadius & innerRadius base on chart attributes */
var circumference = chart.height < chart.width ? chart.height : chart.width;
var outerRadius = chart.outerRadius || (circumference / 2);
var innerRadius = chart.innerRadius || (outerRadius / 2);
```

####Bar Graph Attributes
```javascript
var set = [
  {
    data: [23424, 2445],      // An array with numbers
    fill: '#F0FFF0'           // Controls the fill color
  },
  {
    data: [23423, 34234],     // An array with numbers
    fill: '#F0FFF0'           // Controls the fill color
  }
];
bar('.graph').attr({
  width: 300,
  height: 100,

  /* Optional parameters */
  stack: true,               // This will enable stack graph
  points: set
});
```
####Bubble Graph Attributes
A bubble graph, best use to represnet a cohort's sample size and consumes a data object

```javascript
var bubblePoint = requrie('yako').bubble.scatter
var points = [{
    data: [0,1,3],
    fill: '#000',
    /* Optional Params */
    strokeWidth: 2,
    strokeColor: '#000'
    metaData: {}
  },{
    ...
  }];

bubbleScatter().attr({
  width: 1200,
  height: 100,
  /* Optional parameters */
  maxRadius: 10,                        // Caps the maxRadius
  fill: '#000',                         // Sets the default fill color
  invert : ['x', 'y'],                  // If need to invert the x or y cords
  maxRange: {                           // Option to set a max range
   x: 100,
   y: 100
  },
  minRange: {                           // Option to set a min range
   x: 0,
   y: 0
  },
  
  /* Data Set */
  points: points
});
```

####Bubble Point (Bubble Line) Attributes
A time series graph and uses bubble to represent a sample size happening a cross a series.
```javascript
var bubblePoint = requrie('yako').bubble.point
var points = [{
    data: 123,
    date: new Date(2015,2,14)
    fill: '#000',
    /* Optional Params */
    strokeWidth: 2,
    strokeColor: '#000'
    metaData: {}
  },{
    ...
  }];
  
bubblePoint().attr({
  // Width & height controls the svg view box
  width: 1200,
  height: 100,
  points: self.props.set,
  /* Optional parameters */
  /* Options for the straight line */
  axis: {
    strokeColor: '#000',              // sets stroke color,
    strokeWidth: 2
  },
  autoFit: false,                     // Will equally space the data base on the length of data
  maxRadius: 10,                      // Caps the maxRadius
  strokeColor: '#000',                // Set default stroke color
  strokeWidth: 2,                     // Set default stroke width
  fill: '#333',                       // Sets default fill color
  startDate: new Date(2015,2,13),     // Sets the default start date
  endDate: new Date(2015,2,15),       // Sets the default end date
  
  /* Data Set */
  points: points
});

```

##API & Mixin
Instances of the graph component are created internally, and each component could be re-used subsequently.  Once you've picked your entry point, you could access the component api. Within each component, you could access your component with ```javascript this```
```javascript
/* Example */
var yako = require('yako');     // Or window.yako if FE
var spark = yako.spark;
var instance = spark({
  mixin: {
    make: function(tagName, attribute, dataAttributes) {
      ...
    }
  },
  append: function(parent, child) {
    ...
  }
});

var result = instance.attr({
  ...
})
```

#####mixin: [{...}]
Sometimes common components / functions may share some common functionality with other graph components.  Mixin allows you to enable the magic to happen.

#####make(tagName, attribute, dataAttribute)
```make``` is called everytime to create a svg element with the provided attributes and data attributes, and expects to return a string or object that ```append``` function can consume.

The super class of ```make``` is referenced [here](https://github.com/alfredkam/yakojs/blob/d5ef0c5072d8b952e66929c5bc9a5f40171b6e1b/lib/base/common.js#L41-L52)

#####append(parent, childs)
```append``` is called everytime to append the childs into the parent element. ```childs``` is the result of an array of ```make``` and ```parent``` is either empty or a result of a ```make``` function call to create the parent element.  It expects to return a string or object.

#####preRender(immutableScale) [Beta]
Expects an array of svg elements in string format, unless the ```make``` and ```append``` format is changed up by you.
```javascript
return {
  prepend: [],  // Prepend svg elements in string format
  append: []    // Append svg element in string format
}
```

Example
```javascript
return {
  prepend: [
    '<g><text text-anchor="start" x="60" y="40">A</text></g>',
    '<g><text text-anchor="start" x="60" y="50">B</text></g>'
  ]
}
```

The super class of ```append``` is referenced [here](https://github.com/alfredkam/yakojs/blob/d5ef0c5072d8b952e66929c5bc9a5f40171b6e1b/lib/base/common.js#L31-L39)

#####postRender(result)
```render``` provides the result of the component, you could intercept the result before it passes back up to the chain

##SVG API
```javascript
var svg = require('yako').svg;
```
The below svg api helps you to create and simplify the process of creating svg contents.
#####.create(svgTagName)
Returns a yako svg obj, and permits method chaining
```javascript
// example
var obj = svg.create("g");
```
######obj.attr({})
Sets the attributes for an svg object, using the standard svg attributes and permits method chaining
```javascript
// examples
var obj = svg.create("rect");
obj.attr({
    x: 1,
    y: 10,
    height: 100,
    width: 100
});
```

######obj.append(string)
Appends the string content as a children of a svg object and permits method chaining
```javascript
// example
var obj = svg.create("g");

obj.append("<rect fill='#000' height='100' width='100'></rect>");
```

######obj.append(obj)
Appends a svg obj as a children of another svg object and permits method chaining
```javascript
// example
var parentObj = svg.create("g");
var childObj = svg.create("rect");

childObj.attr({
    x: 1,
    y: 10,
    height: 100,
    width: 100
});

parentObj.append(childObj);

```

######obj.append(array)
Appends an array of svg objects as children of another svg object and permits method chaining
```javascript
// example
var parentObj = svg.create("g");
var group = [];

for (var i = 0; i < 3; i++) {
    group.push(
        svg
        .create("rect")
        .attr({
            x: 1+i,
            y: 1+i,
            height: 100,
            width: 100
        }));
}

parentObj.append(group);
```

######obj.stringify()
Returns an svg string
```javascript
// example
var parentObj = svg.create("g");
var group = [];

for (var i = 0; i < 3; i++) {
    group.push(
        svg
        .create("rect")
        .attr({
            x: 1+i,
            y: 1+i,
            height: 100,
            width: 100
        }));
}

parentObj.append(group);
parentObj.stringify();

//outputs
<g><rect width="100" height="100" y="1" x="1"></rect><rect width="100" height="100" y="2" x="2"></rect><rect width="100" height="100" y="3" x="3"></rect></g>


```
###Additional SVG Helper functions
These svg helper functions will help you to build the svg paths base on your data composition
#####.path.getScale(attr)
Returns the scale for the path and returns min, height, interval, heightRatio, height, width in json object.  Expects attr to contain
```javascript
attr = {
  points: [
          [1,2,3,4],
          [34,6,6,7]
        ],            // An N * M array or a single N * 1 array, eg [1,23,4,5]
  height: 300,        // In px
  width: 200          // In px
}
```

#####.path.getOpenPath(scale, numberArray)
returns attribute D of ```<path>``` that describes the open path expecting
```javascript
scale = svg.Path.getScale(attr);
numberArray = [1,2,3,4,5,6];  // an N * 1 Number array
```

#####.path.getClosedPath(scale, numberArray)
returns attribute D of ```<path>``` that describes the closed path expecting
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

##Addons
###Label
Yako provides a simple additional for labels.
Labels are supported for ```spark``` and ```bar``` graphs.
Custom tags is only supported for ```bubble``` graph with ```type: 'scattered'``` that represents a cohort.

General configuration
```javascript
var yako = require('yako/addons');
var Label = yako.addons.Label;
var spark = yako.spark;                     // Or yako.bar or yako.bubble

var svg = spark({
  mixin: [Label]
}).attr({
  chart: {
    width: 300,
    height: 100,

    /* Options for enabling label */
    /* To enable yAxis, please include yAxis in the property */
    yAxis: true,

    /* Additional options for yAxis */
    // yAxis : {
    //  fontSize: '12',                     // Default 12 in px
    //  multi : true                        // Enables multi yAxis, only avalible for spark graphs
    // },

    /* To enable xAxis, please include xAxis in the property */
    xAxis : {
      fontSize: '12',                       // default 12 in px
      format : 'dateTime',

      /* Additionally for custom labels */
      // format: 'custom',
      // labels: ['label1', 'label2'],      // The label must match the data value length, if not it will be zero
      textAnchor: 'start',                  // Or 'middle' or 'end' - positions the label

      /* Options for configuring format `datetime` */
      // Interval indicates the data interval, the number of the interval indicates the label tick interval
      // Same representation is also used for `dateTimeLabelFormat`
      // s - seconds
      // m - minutes
      // h - hours
      // D - days
      // M - months
      // Y - years
      interval: '4h',                       // [1-9]s, [1-9]m, [1-9]h, [1-9]D, [1-9]M, [1-9]Y
      minUTC: Date.UTC(2013,8,7),           // Used as the min start date and increment the label by the set interval.
                                            // Interval will be converted to miliseconds
      dateTimeLabelFormat: 'MM/DD hh ap'    // This controls the dateTime label format
                                            // Depending on the format, it will affect the label, try :: dateTimeLabelFormat: 'hhh'
                                            // For 12hr time use `ap`, it then will use am/pm
    }
  }
})
  
```

NOTE:: <br>
When labeling is enabled for ```xAxis``` the default ```paddingTop``` & ```paddingBottom``` is 30 in px;
When labeling is enabled for ```yAxis``` the default ```paddingLeft``` & ```paddingRight``` is 20 in px;

###Events (draft)
Yako provides an Event addon that will let you hook into your Yako graphs.

```javascript
var Events = require('yako/addons/Events');

```

###ReturnAsObject
A plugin to return a dom like object representation
```javascript
var yako = require('yako/addons');
var ReturnAsObject = yako.addons.ReturnAsObject;
var spark = yako.spark;

spark({
  mixin: [RetunAsObject]
}).attr({
  chart: {
    ...
  },
  points: [ ... ]
});

```

Example result
```javascript
{ 
  svg: [ 
    g: {
      path: { 
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'stroke-width': 2,
        stroke: '#22e98e',
        d: 'M0.8958407394241024 50 L60 298.5709207252044' 
      } 
    }
  ]
}
```
###React Components
Yako offers a wild range of Reactjs ready graph components.

```javascript
var yako = require('yako/components');
```
Note:: Here ```yako``` also includes ```yako.addons```

###Spark
```javascript
var yako = require('yako/components');
var Spark = yako.components.SimpleSpark;
// Assumes the data type & chart configurations from above
var data = [
  {...},
  {...}
];
var chartConfig = {...}
chartConfig.points = data;
React.render(
<Spark attr={chartConfig} />,
document.getElementsByTagName('body')[0]);
```
###Spark with Events in react
Yako includes a react component for the more complex ```spark``` graphs.  In this component you could hook in events and react base on the props passed back from the response.  This component also supports tooltips and legends, an [example of the code usage could be found here](https://github.com/alfredkam/yakojs/tree/master/demo/example/react-spark-hover-tooltip) that takes full advantage of tooltip hovering with events 

The snippet below explains the events hooks usage

```javascript
var yako = require('yako/components');
var Spark = yako.components.Spark;
// Assumes the data type & chart configurations from above
var data = [
  {...},
  {...}
];
var chartConfig = {...}

var events = {
  // Registers events to listen to
  on: {
    'path:mouseMove': function (e, props) {
      /**
       * You would expect props to include
       * {
       *   points : [             // values unders X segment
       *     {
       *       label    : String, // data label
       *       value    : Number  // value at X segment
       *     }
       *   ],
       *   exactPoint : { // only included if hovered on a path / circle
       *     label      : String, // data label,
       *     value      : Number  // value at X segment on a path
       *   },
       *   _segmentXRef : Number, // reference to X segment
       *   _data        : Object, // reference to user data
       *   _scale       : Object  // reference to the mathematical values used to calculate the graph
       * }
       */
      // do something
    },
    'svg:mouseMove': function (e, props) {
      // do something
    },
    'container:mouseLeave': function (e, props) {
      // do something
    }
  }
};

React.render(
  <Spark
    attr={chartConfig}
    events={events} />,
document.getElementsByTagName('body')[0]);
```
Notice when your registering an event, you would register with ```container``` or ```svg element``` in the combination of ```event name```.  Here ```container``` is the wrapper that contains the svg elements.

List of supported events:

Event Name | Reference To 
-----------|---------------
hover | onMouseOver & onMouseLeave
click | onClick
mouseMove | onMouseMove
mouseEnter | onMouseEnter
mouseOver | onMouseOver
mouseLeave | onMouseLeave
doubleClick | onDoubleClick


###Pie
```javascript
var yako = require('yako/components');
var Pie = yako.components.Pie

/* Assumes the data type & chart configurations from above */
var data = [
  {...},
  {...}
];
var chartConfig = {...}
chartConfig.points = data;
React.render(
<Pie attr={chartConfig} />,
document.getElementsByTagName('body')[0]);
```

###Donut
```javascript
var yako = require('yako/components');
var Donut = yako.components.Donut;

/* Assumes the data type & chart configurations from above */
var data = [
  {...},
  {...}
];
var chartConfig = {...}
chartConfig.points = data;
React.render(
<Donut attr={chartConfig} />,
document.getElementsByTagName('body')[0]);
```

###Bubble
```javascript
var yako = require('yako/components');
var Bubble = yako.components.Bubble.Scatter

/* Assumes the data type & chart configurations from above */
var data = [
  {...},
  {...}
];
var chartConfig = {...}
chartConfig.points = data;
React.render(
<Bubble attr={chartConfig} />,
document.getElementsByTagName('body')[0]);
```

###Bubble Point (Line)
```javascript
var yako = require('yako/components');
var Bubble = yako.components.Bubble.Point

/* Assumes the data type & chart configurations from above */
var data = [
  {...},
  {...}
];
var chartConfig = {...}
chartConfig.points = data;
React.render(
<Bubble attr={chartConfig} />,
document.getElementsByTagName('body')[0]);
```

###Bar
```javascript
var yako = require('yako/components');
var Bar = yako.components.Bar;

/* Assumes the data type & chart configurations from above */
var data = [
  {...},
  {...}
];
var chartConfig = {...}
chartConfig.points = data;
React.render(
<Bar attr={chartConfig} />,
document.getElementsByTagName('body')[0]);
```

##Extending or Modify library
Say you wanted to create your own or modify the library to do something extra. you require the library and extend from it.  Since this is build using common js and inheritance, one could easily extend specific graphs.<br>

For example you think its smarter to append the svg objects into dom object, during the mid process you would
```javascript
var defaultSpark = require('yako/lib/spark');
var mySparkGraph = defaultSpark.extend({

  // This will have mySparkGraph's internal call to default to this function
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

