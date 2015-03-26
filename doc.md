##Content
 - [General Usage](#Usage)
  - [Spark Graph Attributes](#spark-graph-attributes)
  - [Pie Chart Attributes](#pie-chart-attributes)
  - [Donut Chart Attributes](#donut-chart-attributes)
  - [Bubble Point Graph Attributes (for a horizontal line time series representation)](#bubble-point-graph-attributes-for-a-horizontal-line-time-series-representation)
  - [Bubble Graph Attributes ( for representing a cohort)](#bubble-graph-attributes--for-representing-a-cohort)
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
    - [Bar](#bar)
- [Extend or Modify Library](#extending-or-modify-library)

[External Link: Visual Examples](http://alfredkam.com/yakojs/example.html)

##General Usage
To use any of the graphs you could access them through these entry points.
``` javascript
var yako = require('yako'); // Or window.yako if FE
var bar = yako.bar;         // Bar graph
var bubble = yako.bubble    // Bubble graph
var donut = yako.donut;     // Donut chart
var spark = yako.spark;     // Spark graph
var pie = yako.pie;         // Pie chart
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
    data: [214,3423],             // An array with numbers

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
    data: [13414,243243],         // An array with numbers

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
  chart : {
                                 // Width & height controls the svg view box
    width: 300,                  // Default 200
    height: 100,                 // Default 100

    /* Optional parameters */
    stroke: false                // It will disable the stroke from drawn
    line: true,                  // Override to disable the line to be drawn
    fill: true,                  // Defaults is true, override to disable fill
                                 // Say if you want to only have scattered graph, you will set line & fill properties to false
    scattered: false             // Override to enable scattered

    /* Padding options for the chart */
    paddingLeft: 0, 
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  data: set                      // Accepts an array or json obj
});
```

####Pie Chart Attributes
```javascript
var set = [123,1233,1231,123];      // An array of numbers
pie('.graph').attr({
  chart: {
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
    paddingBottom: 0
  },
  data: set
});
```

####Donut Chart Attributes
```javascript
var set = [];                           // An array of numbers
donut('.graph').attr({
  chart: {
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
    paddingBottom: 0
  },
  data: set
});

/* Default outerRadius & innerRadius base on chart attributes */
var circumference = chart.height < chart.width ? chart.height : chart.width;
var outerRadius = chart.outerRadius || (circumference / 2);
var innerRadius = chart.innerRadius || (outerRadius / 2);
```

####Bubble Point Graph Attributes <i>(for a horizontal line time series representation)</i>
```javascript
var set = [];                               // An array of numbers
bubble('.graph').attr({
  chart: {
                                            // Width & height controls the svg view box
    width: 300,
    height: 100,

    /* Optional parameters */
    /* Options for the straight line */
    xAxis: {
        strokeColor: '#000',                // sets stroke color,
        strokeWidth: 2
    },
    bubble: {
        maxRadius: 10,                      // Overrides default & sets a cap for a max radius for the bubble
        strokeColor: '#000',                // Set default stroke color
        strokeColors: ['#000', '#1234'],    // This will override the fill color and matches with the adjacent data set
        strokeWidth: 2,                     // Set default stroke width
        strokeWidths: [2, 2],               // This will override the stroke width and matches with the adjacent data set
        fill: '#333',                       // Sets default fill color
        fills: ['#333','#334']              // This will override the fill color and matches with the adjacent data set
                                            // Note: if strokeColor / strokeColors / fill / fills are not provided - it will randomly generate a color
    },

    /* Padding options for the chart */
    paddingLeft: 0, 
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  data: set
});
// default maxRadius base on chart attributes
var maxRadius =  chart.maxRadius || (chart.height < chart.width ? chart.height : chart.width) / 3;
```
####Bubble Graph Attributes <i>( for representing a cohort)</i>
```javascript
var set = [{
  data: [
          [0, 1, 2],          // x (xAxis), y (yAxis), z (sample size) 
          [2, 3, 4]
  ],
  fill: '#000'                // Default fill
}]; 
bubble('.graph').attr({
  chart: {
    type: 'scattered',        // <= This is needed for bubble graph
                              // Width & height controls the svg view box
    width: 300,
    height: 100,

    /* Optional parameters */
    /* Options for the circle */
    maxRadius: 10,            // Overrides default & sets a cap for a max radius for the bubble
    fill: ['#000'],           // Sets the default fill color
    fills: ['#333','#334']    // This will override the fill color and matches with the adjacent dataset
                              // Note: if fill / fills are not provided - it will randomly generate a color

    /* Padding options for the chart */
    paddingLeft: 0, 
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  data: set
});

/* Default maxRadius base on chart attributes */
var maxRadius =  Math.sqrt(chart.width * chart.height / data.length) / 2;
```

###Bar Graph Attributes
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
  chart : {
    width: 300,
    height: 100,

    /* Optional parameters */
    stack: true               // This will enable stack graph
  },
  data: set
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
  chart: { ... },
  data: [ ... ]
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

#####.path.getScale(attr)
Returns the scale for the path and returns min, height, interval, heightRatio, height, width in json object.  Expects attr to contain
```javascript
attr = {
  data: [
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
var yako = require('yako');
var Label = require('yako/addons/label');
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
var ReturnAsObject = require('yako/addons/ReturnAsObject');
var spark = require('yako').spark;

spark({
  mixin: [RetunAsObject]
}).attr({
  chart: {
    ...
  },
  data: [ ... ]
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
Under ```addons/react-components```, there offers a wild range of react ready graph components.

###Spark
```javascript
var Spark = require('yako/addons/react-components/simpleSpark');
// Assumes the data type & chart configurations from above
var data = [
  {...},
  {...}
];
var chartConfig = {...}
React.render(
<Spark data={data} chart={chartConfig} />,
document.getElementsByTagName('body')[0]);
```
###Spark with Events in react
Yako includes a react component for the more complex ```spark``` graphs.  In this component you could hook in events and react base on the props passed back from the response.  This component also supports tooltips and legends, an [example of the code usage could be found here](https://github.com/alfredkam/yakojs/tree/master/demo/example/react-spark-hover-tooltip) that takes full advantage of tooltip hovering with events 

The snippet below explains the events hooks usage

```javascript
var Spark = require('yako/addons/react-components/spark');
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
    data={data}
    chart={chartConfig}
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
var Spark = require('yako/addons/react-components/pie');

/* Assumes the data type & chart configurations from above */
var data = [
  {...},
  {...}
];
var chartConfig = {...}
React.render(
<Pie data={data} chart={chartConfig} />,
document.getElementsByTagName('body')[0]);
```

###Donut
```javascript
var Donut = require('yako/addons/react-components/donut');

/* Assumes the data type & chart configurations from above */
var data = [
  {...},
  {...}
];
var chartConfig = {...}
React.render(
<Donut data={data} chart={chartConfig} />,
document.getElementsByTagName('body')[0]);
```

###Bubble
```javascript
var Bubble = require('yako/addons/react-components/bubble');

/* Assumes the data type & chart configurations from above */
var data = [
  {...},
  {...}
];
var chartConfig = {...}
React.render(
<Bubble data={data} chart={chartConfig} />,
document.getElementsByTagName('body')[0]);
```

###Bar
```javascript
var Bar = require('yako/addons/react-components/bar');

/* Assumes the data type & chart configurations from above */
var data = [
  {...},
  {...}
];
var chartConfig = {...}
React.render(
<Bar data={data} chart={chartConfig} />,
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

