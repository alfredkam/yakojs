var React = require('react');
var pie = require('../../index').pie;
var RenderWithReact = require('../RenderWithReact');

module.exports = React.createClass({
    render: function () {
        var self = this;
        return pie({
            mixin: RenderWithReact
        }).attr({
            'chart': self.props.chart,
            'data' : self.props.data
        });
    }
});