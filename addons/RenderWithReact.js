var React = require('react');
/**
 * Readner with react addon
 */
var RenderWithReact = module.exports = {
  make: function (tagName, attribute, dataAttribute, content) {
    return React.createElement(tagName, RenderWithReact.filter(attribute), content);
  },
  filter: function (props) {
    var keys = Object.keys(props);
    var newProps = {};
    for(var i in keys) {
      if (keys[i] == 'class') {
        newProps['className'] = props[keys[i]];
      } else if (/-/.test(keys[i])) {
        var key = keys[i].replace(/(.*)-(.*)/, function (match, p1, p2) {
          return p1 + p2[0].toUpperCase() + p2.slice(1, p2.length);
        });
        newProps[key] = props[keys[i]];
      } else {
        newProps[keys[i]] = props[keys[i]];
      }
    }
    return newProps;
  },
  append: function (parent, childs) {
    if (Object.prototype.toString.call(childs) !== '[object Array]') {
      childs = [childs];
    }
    if (parent === '') {
      return childs;
    }
    childs.unshift(parent._store.props);
    childs.unshift(parent.type);
    return React.createElement.apply(self, childs);
  },
  render: function (content) {
    var props = this.renderWithProps();
    if (!props)
      return content;
    return React.createElement(props.type, props.props, content);
  }
}