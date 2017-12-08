'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = transformMediaQueries;

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _transform = require('./transform');

var _transform2 = _interopRequireDefault(_transform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformMediaQueries(file) {
    var query = _loaderUtils2.default.parseQuery(this.query);
    var cb = this.async();

    var start = 'exports.push([module.id, "';
    var end = '", ""]);';
    var startIndex = file.indexOf(start);
    var endIndex = file.indexOf(end);

    var css = file.substring(startIndex + start.length, endIndex).replace(/(\\r\\n|\\n|\\r)/gm, '');

    (0, _postcss2.default)([(0, _transform2.default)(query.breakPoints)]).process(css).then(function (result) {
        var endFile = file.substring(0, startIndex + start.length) + result.css + file.substring(endIndex);

        cb(null, endFile);
    });
}