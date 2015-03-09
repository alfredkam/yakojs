/**
 * Readner with react addon
 */
var render = module.exports = {
  make: function (tagName, attribute, dataAttribute, content) {
    return React.createElement(tagName, attribute, content);
  },
  render: function (parent, childs) {
    // TODO:: double check second argument in React.render could consume an array
    return React.render(parent, childs);
  }
}