module.exports = {
  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    if (this.props.data == nextProps.data) {
      return false;
    }
    return true;
  }
};