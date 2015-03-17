var React = require('react');
var Spark = require('./react/spark');
var ToolTip = require('../addons/react-components/toolTip');
var Legend = require('../addons/react-components/legend');
module.exports = React.createClass({
  getInitialState: function () {
    return {
      shouldShow: false,
      toolTip: {
        shouldShow: false,
        content: '',
        style: {},
        position: {}
      },
      toolTipPosition: {},
      toolTipContent: '',
      legend: {
        shouldShow: false,
        style: {},
        content: ''
      }
    };
  },
  getToolTipPosition: function (e, props) {
    var self = this;
    var scale = props.scale;

    var left = (scale.tickSize * props.segmentXRef) + scale.paddingLeft;

    var numberOfLines = props.points.length;
    var values = [];
    for (var i = 0; i < numberOfLines; i++) {
      values.push(props.points[i].value);
    }

    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);

    var midPoint = ((max - min) / 2) + (scale.max - max);
    var top = midPoint * scale.heightRatio + scale.paddingTop;

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
    if (tagName == 'svg' && e.type == 'mousemove') {

      var html = props.points.map(function (key) {
        return key.label + ':' + key.value;
      });

      this.setState({
        shouldShow: true,
        toolTipContent: html.join(","),
        toolTipPosition: this.getToolTipPosition(e, props)
      });
    }
    if (tagName == 'svg' && e.type == 'mouseleave') {
      this.setState({
        shouldShow: false
      });
    }
  },
  render: function () {
    var self = this;
    var chart = self.props.chart || {};
    var style = {
      height: chart.height || 100,
      width: chart.width || 200,
      position: 'relative',
      border: '1px solid red'
    };

    return (
      <div style={style}>
        <Spark
          chart={chart}
          onTrigger={self.onYakoEvent}
          dataSet={self.props.dataSet} />
        <ToolTip 
          shouldShow={self.state.shouldShow}
          position={self.state.toolTipPosition} >
            {self.state.toolTipContent}
        </ToolTip>
        <Legend
          shouldShow={self.state.legend.shouldShow}>
            {self.state.legend.content}
        </Legend>
      </div>
    );
  }
})