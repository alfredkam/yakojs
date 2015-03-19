[General Usage](#Usage) <br>
[API] (#api) <br>
[SVG API] (#svg-api) <br>
[Addons] (#addons) <br>
&nbsp;&nbsp; [Label] (#label)<br>
&nbsp;&nbsp; [ReturnAsObject] (#returnasobject)<br>
&nbsp;&nbsp; [RenderWithReact] (#renderwithreact)<br>
&nbsp;&nbsp; [EventsWithReact] (#eventswithreact)<br>
&nbsp;&nbsp; [React Components] (#react-components)<br>
[Extend or Modify Library] (#extending-or-modify-library) <br>

[External Link: Visual Examples](http://alfredkam.com/yakojs/example.html) <br>

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
spark({
  mixin: require('yako/addons/Label') // this is require if you want to work with labels
}).attr({
  chart : {
    // width & height controls the svg view box
    width: 300, // default 200
    height: 100,  // default 100
    // optional parameters
    'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
    stroke: false // it will disable the stroke from drawn
    line: true, // override to disable the line to be drawn
    fill: true, // defaults is true, override to disable fill
    // say if you want to only have scattered graph, you will set line & fill properties to false
    scattered: false // override to enable scattered
    // labels
    // for the graph to have labels, these properties must be included
    yAxis: true,
    // yAxis : { multi : true }  // <= multi yAxis
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
      // this controls the dateTime label format
      // depending on the format, it will affect the label, try :: dateTimeLabelFormat: 'hhh'
      // for 12hr time use `ap`, it then will use am/pm
      dateTimeLabelFormat: 'MM/DD hh ap'
      // or if wanted custom label
      // format: 'label',
      // labels: [Array of label], this label must match the data value length, if not it will be zero
    }
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

####Bubble Point Graph Attributes <i>(for a horizontal line time series representation)</i>
```javascript
var set = []; // an array of numbers
bubble('.graph').attr({
  chart: {
    // width & height controls the svg view box
    width: 300,
    height: 100,
    // optional parameters
    'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
    // options for the straight line
    xAxis: {
        strokeColor: '#000',  // sets stroke color,
        strokeWidth: 2
    },
    bubble: {
        maxRadius: 10, // overrides default & sets a cap for a max radius for the bubble
        strokeColor: '#000',  // set default stroke color
        strokeColors: ['#000', '#1234'], // this will override the fill color and matches with the adjacent data set
        strokeWidth: 2, // set default stroke width
        strokeWidths: [2, 2], // this will override the stroke width and matches with the adjacent data set
        fill: '#333', // sets default fill color
        fills: ['#333','#334'] // this will override the fill color and matches with the adjacent data set
        // Note: if strokeColor / strokeColors / fill / fills are not provided - it will randomly generate a color
    },
    // padding configuration for the chart
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
          [0,1,2],  // x (xAxis), y (yAxis), z (sample size) 
          [2,3,4]
  ],
  fill: '#000' // default fill
}]; // an array of a set of numbers
bubble('.graph').attr({
  chart: {
    type: 'scattered', // <= this is needed for bubble graph
    // width & height controls the svg view box
    width: 300,
    height: 100,
    // optional parameters
    'font-family': '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
    // options for the straight line
    // options for the circle
    maxRadius: 10, // overrides default & sets a cap for a max radius for the bubble
    // fills: ['#333','#334'] // this will override the fill color and matches with the adjacent dataset
    // Note: if fill / fills are not provided - it will randomly generate a color
  },
  data: set
});

// default maxRadius base on chart attributes
var maxRadius =  Math.sqrt(chart.width * chart.height / data.length) / 2;
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


##API
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
  append: function(parent, child) {
    ...
  }
});

var result = instance.attr({
  chart: { ... },
  data: [ ... ]
})
```

#####mixin({ ... })
Sometimes common components / functions may share some common functionality with other graph components.  Mixin allows you to enable the magic to happen.

#####make(tagName, attribute, dataAttribute)
```make``` is called everytime to create a svg element with the provided attributes and data attributes, and expects to return a string or object that ```append``` function can consume.

The super class of ```make``` is referenced [here](https://github.com/alfredkam/yakojs/blob/d5ef0c5072d8b952e66929c5bc9a5f40171b6e1b/lib/base/common.js#L41-L52)

#####append(parent, childs)
```append``` is called everytime to append the childs into the parent element. ```childs``` is the result of an array of ```make``` and ```parent``` is either empty or a result of a ```make``` function call to create the parent element.  It expects to return a string or object.

#####preRender(immutableScale) [Beta]
expects an array of svg elements in string format, unless the ```make``` and ```append``` format is changed up by you.
```javascript
return {
  prepend: []  // prepend svg elements in string format
  append: [] // append svg element in string format
}
```

example
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

##Addons
###Label

###ReturnAsObject
A plugin to return a dom like object representation
```javascript
var ReturnAsObject = require('yako/addons/ReturnAsObject');
var spark = require('yako').spark;

spark(RetunAsObject).attr({
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
###RenderWithReact
A React plugin to generate ```React``` code
```javascript
// example usage
var RenderWithReact = require('yako/addons/RenderWithReact');
var spark = require('yako').spark;

module.exports = React.createClass({
  render: function () {
    return spark({
      mixin: RenderWithReact
    }).attr({
      chart: {
        ...
      },
      data: [ ... ]
    });
  }
});

// optionally you could extend RenderWithReact
RenderWithReact
  .renderWithProps = function () { 
    return {
      props: {
        className: 'className'
      }
    }
  }

```
###EventsWithReact
###React Components
Under ```addons/react-components```, there offers a wild range of react ready graph components with its build through the React top level API!
###Spark
```javascript
var Spark = require('./addons/react-components/simpleSpark');
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
###Pie
```javascript
var Spark = require('./addons/react-components/pie');
// Assumes the data type & chart configurations from above
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
var Donut = require('./addons/react-components/donut');
// Assumes the data type & chart configurations from above
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
var Bubble = require('./addons/react-components/bubble');
// Assumes the data type & chart configurations from above
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
var Bar = require('./addons/react-components/bar');
// Assumes the data type & chart configurations from above
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
say you wanted to create your own or modify the library to do something extra. you require the library and extend from it.  Since this is build using common js and inheritance, one could easily extend specific graphs.<br>

For example you think its smarter to append the svg objects into dom object, during the mid process you would
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

