var React = require('react');
var Spark = require('./event-ready/spark-events');
var ToolTip = require('./toolTip');
var Legend = require('./legend');
var extend = require('../../lib/utils/extend');
module.exports = React.createClass({
  _eventData: {},
  getToolTipPosition: function (props) {

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
  onYakoEvent: function (tagName, e, props) {
    var self = this;
    self.props.events.on(tagName, e, props) || 0;
    self._eventData = props;
  },
  render: function () {
    var self = this;
    var chart = self.props.chart || {};
    var style = {
      height: chart.height || 100,
      width: chart.width || 200,
      position: 'relative'
    };

    var toolTipSettings = {
      shouldShow: false,
      content: '',
      className: '',
      offsetBottom: 20,
      position: {}
    };

    var events = self.props.events || {};
    var userDefinedToolTip = self.props.toolTip || {};
    var legend = self.props.legend || {};

    if ((Object.keys(userDefinedToolTip) == 0) || (userDefinedToolTip.shouldShow === false)) {
        toolTipSettings.shouldShow = false;
    } else {
      toolTipSettings.position = this.getToolTipPosition(self._eventData);
      extend(toolTipSettings, userDefinedToolTip);
    }

    return (
      <div style={style}>
        <Spark
          chart={chart}
          bindOn={events.bindOn}
          onTrigger={self.onYakoEvent}
          dataSet={self.props.dataSet} />
        <ToolTip 
          settings={toolTipSettings}
          position={toolTipSettings.position} >
            {toolTipSettings.content}
        </ToolTip>
        <Legend
          settings={self.props.legend} >
            {legend.content}
        </Legend>
      </div>
    );
  }
})