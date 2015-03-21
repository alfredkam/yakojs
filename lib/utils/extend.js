/**
 * Extend property
 */
 var isArray = function (obj) {
     return obj instanceof Array;
 };
var extend = module.exports = function (props) {
  var self = this;
  if (arguments.length > 1) {
    self = arguments[0];
    props = arguments[1];
  }
  var keys = Object.keys(props);
  for (var i = 0;i < keys.length; i++) {
    self[keys[i]] = props[keys[i]];
  }
  return self;
};

