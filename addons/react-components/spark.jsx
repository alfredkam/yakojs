var React = require('react');
var Spark = require('./event-ready/spark-event');
var extend = require('../../lib/utils/extend');
var EventsClass = require('../Events');
var ToolTip = require('./toolTip');
var Legend = require('./legend');
var extend = require('../../lib/utils/extend');
window.sparksArr = [];
var _ = require('lodash');

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
      Events._hook = self.triggers;
      Events.on = userEvents.on;
      Events.ref = self.props.data[0].label;
      Events.hydrate();
      sparksArr.push(Events.on);
    },
    componentDidMount: function () {
      // this.getDOMNode().addEventListerner
    },
    triggers: function (e) {
      var self = this;

      this.eventsHandler._associateTriggers(e, {
        scale: self._scale,
        data: self.props.data
      }, function (props) {

        self._eventData = props;
      });
    },
    render: function () {
      var self = this;
      var Events = this.eventsHandler;
      var props = Events._toRegister;
      var chart = self.props.chart || {};
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
      var legend = self.props.legend || {};

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

      var factory = React.createFactory("div");
      // TODO:: Implement a dynamic fix for handling div / legend / tooltip level of event binding
      return factory(props,
        [
          <span style={toolTipStyle}>
            {userDefinedToolTip.content}
          </span>
          ,
          <Legend
            settings={self.props.legend} >
              {legend.content}
          </Legend>,
          <Spark
            setScale={self.setScale}
            chart={chart}
            data = {self.props.data} />
        ]
      );
    }
});