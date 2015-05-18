module.exports = {
  shouldComponentUpdate: function (nextProps) {
      if (this.props.data == nextProps.data) {
        return false;
      }
      return true;
  }
}