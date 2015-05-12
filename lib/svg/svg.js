function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

var _arc = require('./arc');

var _arc2 = _interopRequireDefault(_arc);

var _rect = require('./rect');

var _rect2 = _interopRequireDefault(_rect);

var _composerEs6 = require('./composer');

var _composerEs62 = _interopRequireDefault(_composerEs6);

var _drawEs6 = require('./draw');

var _drawEs62 = _interopRequireDefault(_drawEs6);

module.exports = {

    path: _path2['default'],

    arc: _arc2['default'],

    rect: _rect2['default'],

    composer: _composerEs62['default'],

    create: function create(svgElement) {
        var instance = new _drawEs62['default']();
        return instance.create(svgElement);
    }
};