var React = require('react');
var bubble = require('../../index').bubble;
var RenderWithReact = require('../RenderWithReact');

module.exports = React.createClass({
    render: function () {
        var self = this;
        return bubble({
            mixin: RenderWithReact
        }).attr({
            'chart': self.props.chart,
            'data' : self.props.data
        });
    }
});