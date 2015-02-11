<b>Note this version has not been published from NPM yet!</b>

### usage

To use any of graphs you could access them through
``` javascript
var yako = require('yako');
var spark = yako.spark; // spark graph
var pie = yako.pie; // pie charts
var donut = yako.donut; // donut charts
var bar = yako.bar; // bar graph
```

<b>calling</b>
<i>graph</i>().set(<i>attributes</i>) => returns a string wrapped with ```<svg>...</svg>``` tag
<i>graph</i>("#graph").set(<i>attributes</i>) => returns a string wrapped with ```<div id='graph'><svg>...</svg></div>```<br>
<i>graph</i>(".graph").set(<i>attributes</i>) => returns a string wrapped with ```<div id='graph'><svg>...</svg></div>```<br>
<i>graph</i>(<i>domObj</i>).set(<i>attributes</i>) => returns this , and automatically does <i>domObj</i>.innerHTML = ```<svg>...</svg>```<br>


Spark Graph Attributes
```
spark()

```

