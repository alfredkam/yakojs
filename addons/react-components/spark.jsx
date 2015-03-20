var React = require('react');
var Spark = require('./event-ready/spark-event');
var extend = require('../../lib/utils/extend');
var Events = {};
// TODO:: switch to new
Events = extend(Events, require('../Events'));
// var Events = JSON.parse(JSON.stringify(require('../Events')))

var ToolTip = require('./toolTip');
var Legend = require('./legend');
var extend = require('../../lib/utils/extend');

module.exports = React.createClass({
    _eventData: {},
    setScale: function (scale) {
      // console.log(scale);
      this._scale = scale;
    },
    getToolTipPosition: function (props) {
       if (Object.keys(props).length === 0) return;

       var self = this;
       var scale = props.scale;
       var offsetY = -1 * self.props.toolTip.offsetBottom || -20;
       var left = (scale.tickSize * props.segmentXRef) + scale.paddingLeft;
       var numberOfLines = props.points.length;
       var values = [];
       var maxOfSet = 0;
       var max = 0;

       if (scale.max instanceof Object) {
         var maxRatio = 0;
         var pos = 0;
         for (var i = 0; i < numberOfLines; i++) {
           var currValue = props.points[i].value;
           var ratio = currValue / scale.max[0];
           if (maxRatio < ratio) {
             maxRatio = ratio;
             maxOfSet = scale.max[i];
             max = currValue;
           }
         }
       } else {
         maxOfSet = scale.max;
         for (var i = 0; i < numberOfLines; i++) {
           var currValue = props.points[i].value;
           max = max < currValue ? currValue : max;
         }
       }
       // Code snippet for finding mid point
       // var min = Math.min.apply(null, values);
       // var midPoint = ((max - min) / 2) + (scale.max - max);
       // var top = midPoint * scale.heightRatio + scale.paddingTop;

       var maxPoint = maxOfSet - max;
       var top = maxPoint * scale.heightRatio + scale.paddingTop + offsetY;

       // check if we are displaying on the rightside
       if (scale.len - 1 == props.segmentXRef) {
         return {
           top: top,
           right: scale.paddingRight
         };
       }
       return {
         top: top,
         left: left
       };
    },
    // base
    componentWillMount: function () {
      Events._hook = this.triggers;
    },
    triggers: function (e) {
      var self = this;
      Events._associateTriggers(e, {
        scale: self._scale,
        data: self.props.data
      }, function (props) {
        self._eventData = props;
      });
    },
    render: function () {
      var self = this;
      var userEvents = self.props.events;
      Events.on = userEvents.on;
      Events.hydrate();

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
        shouldShow: false,
        content: '',
        className: '',
        offsetBottom: 20,
        position: {}
      };

      var userDefinedToolTip = self.props.toolTip || {};
      var legend = self.props.legend || {};

      if ((Object.keys(userDefinedToolTip) == 0) || (userDefinedToolTip.shouldShow === false)) {
          toolTipSettings.shouldShow = false;
      } else {
        toolTipSettings.position = this.getToolTipPosition(self._eventData);
        extend(toolTipSettings, userDefinedToolTip);
      }

      console.log('..');

      var factory = React.createFactory("div");
      // TODO:: Implement a dynamic fix for handling div / legend / tooltip level of event binding
      return factory(props,
        [
          <ToolTip
            settings={toolTipSettings}
            position={toolTipSettings.position} >
              {toolTipSettings.content}
          </ToolTip>,
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