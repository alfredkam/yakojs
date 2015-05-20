var React = require('react/addons');
var EventsClass = require('../../Events');
var cssPrefix = ['Moz','Webkit','ms','O'];
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var GraphPureRenderMixin = require('../utils/GraphPureRenderMixin');

/* Bubble Component */
var Bubble = React.createClass({
    mixin: [
      PureRenderMixin,
      GraphPureRenderMixin
    ],
    render: function () {
      var self = this;
      var bubblePoint = require('../../../index').bubble.scatter;
      var attr = self.props.attr || {};
      var svg = bubblePoint({
          _call: function (scale) {
            scale.hasEvents = true;
            scale.parentType = 'bubble';
            self.props.events.setProps(scale, this.attributes.data);
          }
      }).attr(attr);
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
      var attr = self.props.attr || {};
      var content = [];
      var style = {
        width: attr.width || 200,
        position: 'relative'
      };
      props.style = style;

      var userDefinedToolTip = self.props.toolTip || {};
      var Legend = self.props.legend || 0;
      var ToolTipReactElement = userDefinedToolTip.reactElement || 0;
      var CustomComponent = self.props.customComponent || 0;

      if (ToolTipReactElement) {
        content.push(
            <ToolTipReactElement
              content={self._eventData} />
          );
      }

      content.push(<Bubble
            events={self.eventsHandler}
            attr={attr} />);

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
