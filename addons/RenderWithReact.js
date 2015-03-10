var React = require('react');
/**
 * An addon to render with ReactJs
 */
var RenderWithReact = module.exports = {
  // Extends default make
  make: function (tagName, attribute, dataAttribute, content) {
    return React.createElement(tagName, RenderWithReact.renameProps(attribute), content);
  },
  // Rename props to be react compatible
  renameProps: function (props) {
    var keys = Object.keys(props);
    var newProps = {};

    for(var i = 0; i < keys.length; i++) {
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
  // Extends default append
  append: function (parent, childs) {
    if (parent === '') {
      return childs;
    }

    if (Object.prototype.toString.call(childs) !== '[object Array]') {
      childs = [childs];
    }

    childs.unshift(parent._store.props);
    childs.unshift(parent.type);
    return React.createElement.apply(null, childs);
  },
  // Extends default postRender
  postRender: function (content) {
    if (!this.renderWithProps) {
      return content;
    }

    var props = this.renderWithProps() || 0;
    return React.createElement(props.type, props.props, content);
  }
}