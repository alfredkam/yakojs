import composer from './composer';
import extend from '../utils/extend';

class Draw {

    constructor () {
        var self = this;
        return this;
    }

    getNode (node = null) {
        var parent = null;
        var self = this;
        if (!node) {
            node = self;
        }
        return { node, parent };
    }

    create (svgElement) {
        var self = this;
        self.element = svgElement;
        return self;
    }

    append (svgElement) {
        var self = this;
        var { node } = self.getNode();
        node.children = node.children || [];

        if (Array.isArray(svgElement)) {
            node.children.push(svgElement);
        } else {
            var svg = new Draw();
            svgElement = svg.create(svgElement);
            node.children.push(svgElement);
        }
        return svgElement;
    }

    attr (attrName, property) {
      var self = this;
      var { node } = self.getNode();
      node.attrs = node.attrs || {};

      if (typeof attrName == 'object') {
        extend(node.attrs, attrName);
      } else {
       node.attrs[attrName] = property;
      }
      return self;
    }

    forEach (fn) {
      var self = this;
      var { node } = self.getNode();
      var children = node.children || [];
      children.forEach(fn);
      return self;
    }

    stringify () {
      var self = this;
      var { node } = self.getNode();

      var childContent = (node.children || []).map(function (svgObj) {
        return svgObj.stringify();
      });

      return composer.make(node.element, node.attrs, {}, childContent.join(""));
    }
}

module.exports = Draw;
