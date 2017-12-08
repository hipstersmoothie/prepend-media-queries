'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.prependSelectors = prependSelectors;
exports.processBreakpoint = processBreakpoint;
exports.default = processAll;
function prependSelectors(pre, node) {
    if (node.selectors) {
        node.selectors = node.selectors.map(function (selector) {
            return pre + ' ' + selector;
        });
    } else {
        node.selector = pre + ' ' + node.selector;
    }
}

function processBreakpoint(breakPoint, css) {
    if (breakPoint.includeBaseStyles) {
        css.walkRules(function (rule) {
            if (rule.parent.name === 'media' && !rule.parent.params.match(/px/)) {
                prependSelectors(breakPoint.wrapper, rule);
            } else if (rule.parent.name !== 'media') {
                prependSelectors(breakPoint.wrapper, rule);
            }
        });
    }

    css.walkAtRules(function (rule) {
        if (rule.name.match(/^media/) && rule.params.match(breakPoint.match)) {
            rule.nodes.map(function (node) {
                return prependSelectors(breakPoint.wrapper, node);
            });
            rule.parent.insertBefore(rule, rule.nodes);
            rule.remove();
        }
    });
}

function processAll(breakPoints) {
    return function (css) {
        breakPoints.forEach(function (breakPoint) {
            processBreakpoint(breakPoint, css);
        });
    };
}