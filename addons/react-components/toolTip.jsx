var React = require('react');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
// TODO:: Is there a more granular way to approach this?
// Issue arise on tooltip is visible on hover then flickers between its visible state.
// Had to cache the previous data to prevent it from loosing its state
module.exports = React.createClass({
    // mixin: [PureRenderMixin],
    getInitialState: function () {
      return {
        shouldShow: false,
        settings: '',
        position: ''
      };
    },
    shouldEnable: function (e) {
      e.stopPropagation();
      this.setState({
        shouldShow: true,
        settings: this._cacheData.settings,
        position: this._cacheData.position
      });
    },
    shouldDisable: function (e) {
      this.setState({
        shouldShow: false
      });
    },
    _cacheData: {
      settings: {},
      position: {}
    },
    render: function () {
      var self = this;
      var settings = self.props.settings;
      var position = self.props.position || 0;
      var displayContent = self.props.children;

      if (settings.content !== '') {
        this._cacheData = {
          settings: settings,
          position: position
        };
      }
      if (this.state.shouldShow) {
        settings = this.state.settings;
        position = this.state.position;
        displayContent = settings.content;
      }

      // TODO:: Support other browsers
      var style = {
        position: 'absolute',
        transform: 'translate(' + (position.hasOwnProperty('left') ? position.left : 0) + 'px,' + position.top + 'px)',
        visibility: settings.shouldShow ? 'visible' : 'hidden',
        top: 0
      };

      if (position.hasOwnProperty('left')) {
        style.left = 0;
      } else {
        style.right = position.right;
      }

      return (
        <span onMouseOver={this.shouldEnable} onMouseOut={this.shouldDisable} className={settings.className} style={style}>
            {displayContent}
        </span>
      );
    }
});