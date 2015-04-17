var React = require('react/addons');
var EventsClass = require('../../../Events');
var cssPrefix = ['Moz','Webkit','ms','O'];
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var GraphPureRenderMixin = require('../../utils/GraphPureRenderMixin');
/* Bubble Component */

var Bubble = React.createClass({
    mixin: [
      PureRenderMixin,
      GraphPureRenderMixin
    ],
    render: function () {
      var self = this;
      var bubblePoint = require('../../../../time-series').bubble.point;
      var chart = self.props.chart || {};
      var svg = bubblePoint({
          _call: function (scale) {
            scale.hasEvents = true;
            scale.parentType = 'bubble';
            self.props.events.setProps(scale, this.attributes.data);
          }
        }).attr(chart);
      return React.createElement("span", {
        dangerouslySetInnerHTML: {
          __html: svg
        }
      });
    }
});
// TODO:: Decouple tooltip logics
/* EventHandling Component */
module.exports = React.createClass({
    _eventData: {},
    eventsHandler: '',
    setScale: function (scale) {
      this._scale = scale;
    },
    // base
    componentWillMount: function () {
      var self = this;
      this.eventsHandler = Events = new EventsClass();
      var userEvents = self.props.events;
      Events._emit = self.triggers;
      Events.on = userEvents.on || {};
      Events.hydrate();
    },
    triggers: function (e) {
      var self = this;
      this.eventsHandler._associateTriggers(e, function (props) {
        self._eventData = props;
      });
    },
    render: function () {
      var self = this;
      var Events = this.eventsHandler;
      var props = Events._toRegister;
      var chart = self.props.chart || {};
      var content = [];
      var style = {
        // height: chart.height || 100,
        width: chart.width || 200,
        position: 'relative'
      };
      props.style = style;
      // default tool tip settings
      var toolTipSettings = {
        shouldShow: true,
        content: 'test',
        className: '',
        offsetBottom: 20,
        position: {x: 0, y: 0}
      };

      var userDefinedToolTip = self.props.toolTip || {};
      var Legend = self.props.legend || 0;
      var ToolTipReactElement = userDefinedToolTip.reactElement || 0;
      var CustomComponent = self.props.customComponent || 0;

      if (ToolTipReactElement) {
        var position = Events.getToolTipPosition(self._eventData) || {};

        var toolTipStyle = {
          position: 'absolute',
          transform: 'translate(' + (position.hasOwnProperty('left') ? position.left : 0) + 'px,' + position.top + 'px)',
          visibility: userDefinedToolTip.shouldShow ? 'visible' : 'hidden',
          top: 0
        };

        for (var i = 0; i < cssPrefix.length; i++) {
          toolTipStyle[cssPrefix[i] + 'Transform'] = toolTipStyle.transform;
        }

        if (position.hasOwnProperty('left')) {
          toolTipStyle.left = 0;
        } else {
          toolTipStyle.right = position.right;
        }

        content.push(<span style={toolTipStyle}>
            <ToolTipReactElement
              content={self._eventData} />
          </span>);
      }

      content.push(<Bubble
            events={self.eventsHandler}
            chart={chart}
            data = {self.props.data} />);

      if (Legend){
        content.push(<Legend />);
      }

      if (CustomComponent) {
        content = content.concat(CustomComponent);
      }

      var factory = React.createFactory("div");
      return factory(props,
        content
      );
    }
});