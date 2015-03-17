var React = require('react');
var Spark = require('./react/spark');
var ToolTip = require('../addons/reactComponents/toolTip');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      shouldShow: false,
      toolTipPosition: {},
      toolTipContent: '',
    }
  },
  getToolTipPosition: function (e, props) {
    var self = this;
    var scale = props.scale;
    // var spark = self.refs.sparkWrapper;
    var left = (scale.tickSize * props.segmentXRef) + scale.paddingLeft;
    // var offsetX = spark.offsetLeft - spark.scrollLeft
    // var offsetY = spark.offsetTop - spark.scrollTop;

    var numberOfLines = props.points.length;
    var values = [];
    for (var i = 0; i < numberOfLines; i++) {
      values.push(props.points[i].value);
    }

    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);

    var midPoint = ((max - min) / 2) + (scale.max - max);
    var top = midPoint * scale.heightRatio + scale.paddingTop;
    
    return {
      top: top,
      left: left
    }
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
      })
    }
    if (tagName == 'svg' && e.type == 'mouseleave') {
      this.setState({
        shouldShow: false
      })
    }
  },
  render: function () {
    var divStyle = {
      border: '1px solid red',
      position: 'relative'
    };

    return (
      <div style={divStyle}>
        <Spark onTrigger={this.onYakoEvent} dataSet={this.props.dataSet}/>
        <ToolTip shouldShow={this.state.shouldShow} position={this.state.toolTipPosition}>
            {this.state.toolTipContent}
        </ToolTip>
      </div>
    );
  }
})