/**
 * Extend property
 */
module.exports = function (props) {
  var self = this;
  var keys = Object.keys(props);
  for (var i = 0;i < keys.length; i++) {
    self[keys[i]] = props[keys[i]];
  }
  return self;
};