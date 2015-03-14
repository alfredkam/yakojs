var React = require('react');
var Spark = require('./react/spark');

module.exports = React.createClass({
  render: function () {
    function mousemove (e) {
      console.log('div',e);
    } 

    var divStyle = {
      border: '1px solid red'
    };
    
    return (
      <div className='test' style={divStyle}>
        <Spark />
      </div>
    );
  }
})