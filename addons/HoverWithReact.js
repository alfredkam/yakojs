var RenderWithReact = require('./RenderWithReact');
var React = require('react');

RenderWithReact.extend = function (props) {
  var self = this;
  var keys = Object.keys(props);
  for (var i = 0;i < keys.length; i++) {
    self[keys[i]] = props[keys[i]];
  }
  return self;
};

var Component = module.exports = RenderWithReact.extend({
  make: function (tagName, attribute, dataAttribute, content) {
    console.log(tagName);
    return React.createElement(tagName, Component.renameProps(attribute), content);
  },
  bindFilter: [],
  onTrigger: function (tagName, event, props) {

  },
  legend: function () {

  },
  toolTip: function () {

  }
});