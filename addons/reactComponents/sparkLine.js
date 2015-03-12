var React = require('react');
var RenderWithReact = require('../RenderWithReact');

modue.exports = React.createClass({

    render: function () {
        return spark({
            mixin: RenderWithReact,
            renderWithProps: function () {
              return {
                    type: "div",
                    props: {
                      className: '',
                    }
                };
            }
        }).attr({
            'chart' : {
                'height' : this.props.height,
                'width'  : this.props.width
            },
            'data' : [{
                'data'        : this.props.data,
                'strokeColor' : colors['color-black-50'],
                'strokeWidth' : 5,
                'fill'        : colors['color-black-05'],
            }]
        });
    }
});