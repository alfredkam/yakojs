#Creating Modules
To create a new modules, you can register your module by: 

```javascript
  yako.register('graphName', functions); 
```
eg:

```javascript
   	yako.register('piechart',{
        draw: function () {
            console.log('drawing !!!!');
            console.log(this.root);
        }
    });

```
Users then can access your graph module through

```javascript
	//assume user has a dom id called graph
	yako('#graph')
	.set({
		//options in json
	}, [ /* data in array */])
	.draw();
```
#Reserved name space
- _constructor
- root

#Accessing user data & options
##Data
- this.root.attributes.data
##Options
- this.root.attributes.options

#Accessing yako's private api
## this.root.<i>api name</i>
This will let you access the private apis
 - _path(data, opts, interval, heightRatio)
 	- This generates a line
 	- data: is an array of values
 	- opts: options, must pass the graph's height through opts.height
 	- interval: the interval between each node
 	- heightRatio: this is used to scale the height of the node depending on the value * heightRatio
 	- RETURNS svg path element;

 - _circle(data, opts, interval, heightRatio)
 	- This is used to generate a circle in between the change in x & y axis between each value in array (used for hovering in on a line)
 	- data: is an array of values
 	- opts: options, must pass the graph's height through opts.height
 	- interval: the interval between each node
 	- heightRatio: this is used to scale the height of the node depending on the value * heightRatio
 	- RETURNS an array of circle;

 - _compile(elementObject, childrens)
 	- This is used to append the childs to the element object.
 	- elmenetObject: The element can either be an id element object or class element object
 	- childrens: can be a single element or an array of element
 	- RETURNS this, for chaining

 - _getNode(nodeName <i>[, boolean]</i>)
 	- This is used to get an exisiting dom element
 	- nodeName: either a className (starting with a '.') or an id name (starting with '#')
 	- boolean: accepts true or false
 	- with boolean as true: RETURNS dom object;
 	- with boolean as false or empty: RETURNS this, for chaining

 - _make(tag, props, data)
 	- this creates the svg dom objects
 	- tag: the name of dom tag , egs: path, g, svg .. etc
 	- props: the object attributes in json
 	- data: the data attributes in json

#accessing yako's public api
## yako.<i>api name</i>
- on(self, node, event, fn <i>[, useCapture]</i>)
	- event binding, an addEventListener Manager
	- self: this
	- node: the id or class name of the element [string]
	- event: any javascript supported event [string]
	- fn: the function, will pass back the event through ~ fn(event)
	- useCapture: true or false ~ check MDN for more info
	- RETURNS self, for chaining

- unbind(self, node <i>[, event, fn]</i>)
	- unbinds all events or specific events
	- self: this,
	- node: the id or class name of the element [string]. if event nor fn is specified will unbind all event
	- event: the event to unbind. if fn is not specified, will unbind the specifed event
	- fn: the function it had bind to.  it will unbind the specific event & fn

- isFn(object)
	- check if object is a function
	- RETURNS true if is a function, false otherwise

- assign(node, json)
	- assigns setAttributeNS on the json key / value
	- node: an svg dom object
	- json: json properties

- extend(object, json)
	- it maps 1-1 with the json key / value (similar to lodash / underscore extend)
	- object: any object
	- json: json properties  




    

