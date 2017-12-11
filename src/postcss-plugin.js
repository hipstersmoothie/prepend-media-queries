import postcss from 'postcss'
import transform from './transform'

const plugin = postcss.plugin('remove-media-queries', opts => (
    transform(opts.breakPoints)
))

export default plugin
