var React = require('react');
var Spark = require('./event-ready/spark-event');
var EventsClass = require('../Events');
var ToolTip = require('./toolTip');
var Legend = require('./legend');

var cssPrefix = ['Moz','Webkit','ms','O'];

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
      Events.ref = self.props.data[0].label;
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
        height: chart.height || 100,
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

      if (ToolTipReactElement) {
        var position = Events.getToolTipPosition(self._eventData) || {};

        var toolTipStyle = {
          position: 'absolute',
          transform: 'translate(' + (position.hasOwnProperty('left') ? position.left : 0) + 'px,' + position.top + 'px)',
          visibility: userDefinedToolTip.shouldShow ? 'visible' : 'hidden',
          top: 0
        };

        for (var i = 0; i < cssPrefix.length; i++) {
          toolTipStyle[cssPrefix[i]+'Transform'] = toolTipStyle.transform;
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

      if (Legend){
        content.push(<Legend />);
      }

      content.push(<Spark
            events={self.eventsHandler}
            chart={chart}
            data = {self.props.data} />);

      var factory = React.createFactory("div");
      return factory(props,
        content
      );
    }
});