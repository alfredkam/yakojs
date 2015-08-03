## Yako
[![npm version](https://badge.fury.io/js/yako.svg)](http://badge.fury.io/js/yako)
[![Stories in Ready](https://badge.waffle.io/alfredkam/yakojs.png?label=ready&title=Ready)](https://waffle.io/alfredkam/yakojs)
[![Dependencies](https://david-dm.org/alfredkam/yakojs.svg)](https://david-dm.org/alfredkam/yakojs)
[![Build Status](https://travis-ci.org/alfredkam/yakojs.svg?branch=master)](https://travis-ci.org/alfredkam/yakojs)
[![Coverage Status](https://coveralls.io/repos/alfredkam/yakojs/badge.svg?branch=master)](https://coveralls.io/r/alfredkam/yakojs?branch=master)
[![bitHound Score](https://www.bithound.io/github/alfredkam/yakojs/badges/score.svg)](https://www.bithound.io/github/alfredkam/yakojs/master)

A tiny **DOM-less** graph library, build for fast front end and server side rendering in CommonJs pattern.
This library is intend to generate light weight and simple SVG graphs, and is more performable compare to highcharts / flot / c3 / d3 when **front end matters**.

This library also works great with webpack & react w/ [prepared react graph components](https://github.com/alfredkam/yakojs/blob/master/doc.md#react-components)

Documentation [https://github.com/alfredkam/yakojs/blob/master/doc.md](https://github.com/alfredkam/yakojs/blob/master/doc.md)

Demo [http://alfredkam.com/yakojs](http://alfredkam.com/yakojs) or ```gulp dev``` and visit ```http://localhost:3000```

Supports Chrome, Firefox, Safari, and IE 9+;

###Note on upgrading 0.4.X to 0.5.X
- Deprecate the old bubble usage and with a new interface
- Simplify ```<graph>.timeseries``` require usage - It is now no longer needed to include ```.timeseries``` to use those graphs
- Simplify chart configuration by flattern out ```<graph>.attr({})```

### Install
```npm install yako```<br
<i>Alternatively</i><br>
```bower install yako```

### Building the package
```gulp build```<br>
This will build the ```lib``` directory, by converting ```src``` directory from es6 to es5.

### API Ready
- Simple Graphs
  - Line 
    - Scattered
    - Line
    - Area Graphs
  - Pie Charts
  - Donut Charts
  - Bubble Point (Bubble Line) Chart for Time Flow Representation (Represents actions across a period of time)
  - Bubble Graph  (Represents a cohort / segment activty)
  - Bar Graphs (stack & non stack)
- MixIn / Inheritance
- Multi axis for spark graphs
- Labels
    - Bar graph
    - Line Graph
    - Bubble Graph
- Programmatic point of access (Only Avaliable for React)
- Events & Emitters (Only Avaliable for React)

### Road Map
- Complex Graphs
  - eg. time series w/ auto fill
- Expose math functions
- Bring svg to live
- Real time graphs


### How to run unit test
```npm test```
 
### Latest Release
Please refer to the release branch - [https://github.com/alfredkam/yakojs/tree/release](https://github.com/alfredkam/yakojs/tree/release)

[![Analytics](https://ga-beacon.appspot.com/UA-25416273-3/yakojs/readme)](https://github.com/igrigorik/ga-beacon)
[![wercker status](https://app.wercker.com/status/a74eda189271b3b148197e07ad6fa9f1/s "wercker status")](https://app.wercker.com/project/bykey/a74eda189271b3b148197e07ad6fa9f1)
