'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _transform = require('./transform');

var _transform2 = _interopRequireDefault(_transform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plugin = _postcss2.default.plugin('remove-media-queries', function (opts) {
    return (0, _transform2.default)(opts.breakPoints);
});

exports.default = plugin;
module.exports = exports['default'];