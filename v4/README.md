#Yako's next version graphing api (draft)
Building upon v0.3.X experiences and feedbacks.

##Usage
Simplifying the entry point and consumable entry points.

```javascript
var yako = require('yako');
yako({
    mixins: [ ... ]
}).attr({
    width: 300,
    height: 100,
    points: {
        spark: [{
            data: [Number, Number, Number],
            strokeWidth: 2,
            strokeColor: '#f0f0f0'
            fill: '#000',
            scatter: {
                strokeWidth: 2
                strokeColor: 'red',
                fill: 'white'
            }
        }],
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
        // Time Series
        line: [
            ...
        ],
        bubbleLine: [
            ...
        ]
    }
})
```