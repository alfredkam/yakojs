var React = require('react');
var spark = require('../../index').spark;
var RenderWithReact = require('../RenderWithReact');

module.exports = React.createClass({
    render: function () {
        var self = this;
        return spark({
            mixin: RenderWithReact
        }).attr({
            'chart': self.props.chart,
            'data' : self.props.data
        });
    }
});