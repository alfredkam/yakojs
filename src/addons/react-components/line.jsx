var React = require('react');
var EventsClass = require('../Events');
var Legend = require('./legend');
var GraphPureRenderMixin = require('./utils/GraphPureRenderMixin');
var cssPrefix = ['Moz','Webkit','ms','O'];

/* Line Component */
var Line = React.createClass({

  displayName: 'YakoLineChart',

  mixins: [
    GraphPureRenderMixin
  ],

  render: function () {
    var self = this;
    var line = require('../../index').line;
    var attr = self.props.attr || {};

    var svg = line({
      mixin: {
        _call: function (scale) {
          scale.hasEvents = true;
          scale.parentType = 'line';
          self.props.events.setProps(scale, this.attributes.data);
        }
      }
    }).attr(attr);
    return React.createElement("span", {
      dangerouslySetInnerHTML: {
        __html: svg
      }
    });
  }
});

module.exports = React.createClass({

  displayName: 'YakoLineEventHandler',

  _eventData: {},

  eventsHandler: '',

  setScale: function (scale) {
    this._scale = scale;
  },

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
            key={1}
            content={self._eventData} />
        );
    }

    content.push(<Line
          key={2}
          events={self.eventsHandler}
          attr={attr} />);

    if (Legend){
      content.push(<Legend key={3}/>);
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
