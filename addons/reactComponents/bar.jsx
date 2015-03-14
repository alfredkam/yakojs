var React = require('react');
var bar = require('../../index').bar;
var RenderWithReact = require('../RenderWithReact');

module.exports = React.createClass({
    render: function () {
        var self = this;
        return bar({
            mixin: RenderWithReact
        }).attr({
            'chart': self.props.chart,
            'data' : self.props.data
        });
    }
});