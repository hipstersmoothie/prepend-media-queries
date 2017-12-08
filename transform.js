function prependSelectors(pre, node) {
    if (node.selectors) {
        node.selectors = node.selectors.map(selector => (
            `${pre} ${selector}`
        ));
    } else {
        node.selector = `${pre} ${node.selector}`;
    }
}

function processBreakpoint(breakPoint, css) {
    if (breakPoint.includeBaseStyles) {
        css.walkRules((rule) => {
            if (rule.parent.name === 'media' && !rule.parent.params.match(/px/)) {
                prependSelectors(breakPoint.wrapper, rule);
            } else if (rule.parent.name !== 'media') {
                prependSelectors(breakPoint.wrapper, rule);
            }
        });
    }

    css.walkAtRules((rule) => {
        if (rule.name.match(/^media/) && rule.params.match(breakPoint.match)) {
            rule.nodes.map(node => prependSelectors(breakPoint.wrapper, node));
            css.append(rule.nodes);
            rule.remove();
        }
    });
}

const processAll = breakPoints => css => (
    breakPoints.forEach(breakpoint => (
        processBreakpoint(breakpoint, css)
    ))
);

module.exports = processAll;
