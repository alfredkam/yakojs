import composer from './composer';
module.exports () {

    props: {},

    getCurrentNode (node = null) {
        var parent = null;
        var self = this;
        if (!node) {
            node = self.props;
        }
        if (node.children) {
            var len = node.children.length;
            parent = node;
            node = node.children[len - 1];
            if (node.children) {
                { node, parent } = self.getCurrentNode(node);
            }
        }
        return { node, parent };
    },

    create (svgElement) {
        var self = this;
        self.props.element = svgElement;
        return self;
    },

    append (svgElement) {
        var self = this;
        var { node } = self.getCurrentNode();
        node.children = node.children || [];

        if (typeof svgElement == 'object') {
            node.push(svgElement);
        } else {
            node.children.push({
                element: svgElement
            });
        }
        return self;
    },

    attr (attrName, property) {
        var self = this;
        var { node } = self.getCurrentNode();
        node.attr = node.attr || {};
        node.attr[attrName] = property;
        return self;
    },
}
