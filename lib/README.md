#Yako's next version graphing api (draft)
Building upon v0.3.X experiences and feedbacks.

##Usage
Simplifying the entry point and consumable entry points.  To define a graph in a chart, simpily include the chart prefix as your key and its data set into the mix.  The avaliable charts are listed below.

```javascript
var yako = require('yako');
yako({
    mixins: [ ... ]
}).attr({
    width: 300,
    height: 100,
    points: {
        spark: [
            ...
        ],
        bubble: [
            ...
        ],
        bar: [
            ...
        ],
        pie: [
            ...
        ],
        donut: [
            ...
        ],
        /* Charts below are time series base */
        line: [
            ...
        ],
        bubbleLine: [
            ...
        ]
    }
})
```

##Spark
Spark is designed for simple trivial graph, and works with a simple set of data.

```javascript
spark: [
    {
        data: [Number, Number, Number],
        strokeWidth: 2,
        strokeColor: '#f0f0f0'
        fill: '#000',
        scatter: {
            strokeWidth: 2
            strokeColor: 'red',
            fill: 'white'
        }
    },
    {
        ...
    }
]
```

##Bubble
Bubble graph, best for representing a cohort of sample size

```javascript
bubble: {
    maxRadius: 10,                        // Caps the maxRadius
    fill: '#000',                         // Sets the default fill color
    strokeWidth: '2',                     // Sets the default stroke width,
    strokeColor: '#000',                   // Sets the default stroke color
    /* Data Set */
    points: [{
      data: [0,1,3],
      fill: '#000',
      /* Optional Params */
      strokeWidth: 2,
      strokeColor: '#000'
      metaData: {}
    },{
      ...
    }]
}
