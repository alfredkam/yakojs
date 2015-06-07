var React = require('react');
var Spark = require('./event-ready/spark-event');
var EventsClass = require('../Events');
var Legend = require('./legend');
var cssPrefix = ['Moz', 'Webkit', 'ms', 'O'];

module.exports = React.createClass({
  displayName: 'exports',

  _eventData: {},
  eventsHandler: '',
  setScale: function setScale(scale) {
    this._scale = scale;
  },
  // base
  componentWillMount: function componentWillMount() {
    var self = this;
    this.eventsHandler = Events = new EventsClass();
    var userEvents = self.props.events;
    Events._emit = self.triggers;
    Events.on = userEvents.on || {};
    Events.hydrate();
  },
  triggers: function triggers(e) {
    var self = this;
    this.eventsHandler._associateTriggers(e, function (props) {
      self._eventData = props;
    });
  },
  render: function render() {
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
      position: { x: 0, y: 0 }
    };

    var userDefinedToolTip = self.props.toolTip || {};
    var Legend = self.props.legend || 0;
    var ToolTipReactElement = userDefinedToolTip.reactElement || 0;

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

      content.push(React.createElement(
        'span',
        { style: toolTipStyle },
        React.createElement(ToolTipReactElement, {
          content: self._eventData })
      ));
    }

    content.push(React.createElement(Spark, {
      events: self.eventsHandler,
      chart: chart,
      data: self.props.data }));

    if (Legend) {
      content.push(React.createElement(Legend, null));
    }

    var factory = React.createFactory('div');
    return factory(props, content);
  }
});