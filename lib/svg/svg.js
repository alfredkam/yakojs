function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('./path');

var _path2 = _interopRequireDefault(_path);

var _arc = require('./arc');

var _arc2 = _interopRequireDefault(_arc);

var _rect = require('./rect');

var _rect2 = _interopRequireDefault(_rect);

var _composer = require('./composer');

var _composer2 = _interopRequireDefault(_composer);

var _draw = require('./draw');

var _draw2 = _interopRequireDefault(_draw);

module.exports = {

    path: _path2['default'],

    arc: _arc2['default'],

    rect: _rect2['default'],

    composer: _composer2['default'],

    create: function create(svgElement) {
        var instance = new _draw2['default']();
        return instance.create(svgElement);
    }
};