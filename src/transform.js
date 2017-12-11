export function prependSelectors(pre, node) {
    if (node.selectors) {
        node.selectors = node.selectors.map(selector => (
            `${pre} ${selector}`
        ))
    } else if (node.selector) {
        node.selector = `${pre} ${node.selector}`
    }
}

export function processBreakpoint(breakPoint = {}, css) {
    if (breakPoint.includeBaseStyles) {
        css.walkRules((rule) => {
            if (rule.parent.name === 'media' && !rule.parent.params.match(/px/)) {
                prependSelectors(breakPoint.wrapper, rule)
            } else if (rule.parent.name !== 'media') {
                prependSelectors(breakPoint.wrapper, rule)
            }
        })
    }

    css.walkAtRules((rule) => {
        if (rule.name.match(/^media/) && breakPoint.match && rule.params.match(breakPoint.match)) {
            rule.nodes.map(node => prependSelectors(breakPoint.wrapper, node))
            rule.parent.insertBefore(rule, rule.nodes)
            rule.remove()
        }
    })
}

export const processAll = (breakPoints = []) => (css) => {
    breakPoints.forEach((breakPoint) => {
        processBreakpoint(breakPoint, css)
    })
}

export default processAll
