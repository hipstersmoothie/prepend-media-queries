import postcss from 'postcss';
import transform from './transform';

export default postcss.plugin('remove-media-queries', opts => (
    transform(opts.breakPoints)
));
