const postcss = require('postcss');
const transform = require('./transform');

module.exports = postcss.plugin('remove-media-queries', opts => (
    transform(opts.breakPoints)
));
