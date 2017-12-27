import test from 'ava'
import postcss from 'postcss'
import { prependSelectors, processBreakpoint, processAll } from '../src/transform'

test('prependSelectors - does nothing', (t) => {
    const pre = '.prepended-class'
    const node = {}

    prependSelectors(pre, node)
    t.deepEqual(node, {})
})

test('prependSelectors - prepends to just one selector', (t) => {
    const pre = '.prepended-class'
    const node = { selector: '.foo div' }

    prependSelectors(pre, node)
    t.deepEqual(node, { selector: '.prepended-class .foo div' })
})

test('prependSelectors - prepends many selectors', (t) => {
    const pre = '.prepended-class'
    const node = {
        selectors: [
            '.foo',
            '.bar',
            '.baz',
        ],
    }

    prependSelectors(pre, node)
    t.deepEqual(node, {
        selectors: [
            '.prepended-class .foo',
            '.prepended-class .bar',
            '.prepended-class .baz',
        ],
    })
})

test.cb('processBreakpoint - does nothing', (t) => {
    const breakpoint = undefined
    const process = css => processBreakpoint(breakpoint, css)

    const css = `
        .foo: {
            color: red;
        }

        @media (min-width: 350px) {
            .foo: {
                color: blue;
            }
        }

        @media (max-width: 350px) {
            .foo: {
                color: green;
            }
        }
    `

    postcss([process])
        .process(css)
        .then((result) => {
            t.is(result.css, css)
            t.end()
        })
})

test.cb('processBreakpoint - wraps the specified media query', (t) => {
    const breakpoint = {
        wrapper: '.wrapper-class',
        match: '(min-width: 350px)',
    }
    const process = css => processBreakpoint(breakpoint, css)

    const css = `
        .foo: {
            color: red;
        }

        @media (min-width: 350px) {
            .foo: {
                color: blue;
            }
        }

        @media (max-width: 350px) {
            .foo: {
                color: green;
            }
        }
    `
    const expected = `
        .foo: {
            color: red;
        }

        .wrapper-class .foo: {
                color: blue;
            }

        @media (max-width: 350px) {
            .foo: {
                color: green;
            }
        }
    `

    postcss([process])
        .process(css)
        .then((result) => {
            t.is(result.css, expected)
            t.end()
        })
})

test.cb('processBreakpoint - wraps the specified media queries', (t) => {
    const breakpoint = {
        wrapper: '.wrapper-class',
        match:
            '\\(min-width:[ \t]+350px\\)|' +
            '\\(max-width:[ \t]+350px\\)',
    }
    const process = css => processBreakpoint(breakpoint, css)

    const css = `
        .foo: {
            color: red;
        }

        @media (min-width: 350px) {
            .foo: {
                color: blue;
            }
        }

        @media (max-width: 350px) {
            .foo: {
                color: green;
            }
        }
    `
    const expected = `
        .foo: {
            color: red;
        }

        .wrapper-class .foo: {
                color: blue;
            }

        .wrapper-class .foo: {
                color: green;
            }
    `

    postcss([process])
        .process(css)
        .then((result) => {
            t.is(result.css, expected)
            t.end()
        })
})

test.cb('processBreakpoint - include base styles', (t) => {
    const breakpoint = {
        includeBaseStyles: true,
        wrapper: '.wrapper-class',
    }
    const process = css => processBreakpoint(breakpoint, css)

    const css = `
        .foo: {
            color: red;
        }

        @media (min-width: 350px) {
            .foo: {
                color: blue;
            }
        }

        @media (max-width: 350px) {
            .foo: {
                color: green;
            }
        }
    `
    const expected = `
        .wrapper-class .foo: {
            color: red;
        }

        @media (min-width: 350px) {
            .foo: {
                color: blue;
            }
        }

        @media (max-width: 350px) {
            .foo: {
                color: green;
            }
        }
    `

    postcss([process])
        .process(css)
        .then((result) => {
            t.is(result.css, expected)
            t.end()
        })
})

test.cb('processBreakpoint - handle non pixel based media queries', (t) => {
    const breakpoint = {
        includeBaseStyles: true,
        wrapper: '.wrapper-class',
    }
    const process = css => processBreakpoint(breakpoint, css)

    const css = `
        .foo: {
            color: red;
        }

        @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
            .foo: {
                color: blue;
            }
        }

        @media (min-width: 350px) {
            .foo: {
                color: blue;
            }
        }

        @media (max-width: 350px) {
            .foo: {
                color: green;
            }
        }
    `
    const expected = `
        .wrapper-class .foo: {
            color: red;
        }

        @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
            .wrapper-class .foo: {
                color: blue;
            }
        }

        @media (min-width: 350px) {
            .foo: {
                color: blue;
            }
        }

        @media (max-width: 350px) {
            .foo: {
                color: green;
            }
        }
    `

    postcss([process])
        .process(css)
        .then((result) => {
            t.is(result.css, expected)
            t.end()
        })
})

test.cb('processBreakpoint - prepend everything', (t) => {
    const breakpoint = {
        includeAll: true,
        wrapper: '.wrapper-class',
    }
    const process = css => processBreakpoint(breakpoint, css)

    const css = `
        .foo: {
            color: red;
        }

        @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
            .foo: {
                color: blue;
            }
        }

        @media (min-width: 350px) {
            .foo: {
                color: blue;
            }
        }

        @media (max-width: 350px) {
            .foo: {
                color: green;
            }
        }
    `
    const expected = `
        .wrapper-class .foo: {
            color: red;
        }

        @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
            .wrapper-class .foo: {
                color: blue;
            }
        }

        @media (min-width: 350px) {
            .wrapper-class .foo: {
                color: blue;
            }
        }

        @media (max-width: 350px) {
            .wrapper-class .foo: {
                color: green;
            }
        }
    `

    postcss([process])
        .process(css)
        .then((result) => {
            t.is(result.css, expected)
            t.end()
        })
})

test.cb('processAll - does nothing with no breakpoints provided', (t) => {
    const css = `
        .foo: {
            color: red;
        }

        @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
            .foo: {
                color: blue;
            }
        }

        @media (min-width: 350px) {
            .foo: {
                color: blue;
            }
        }

        @media (max-width: 350px) {
            .foo: {
                color: green;
            }
        }
    `

    postcss([processAll])
        .process(css)
        .then((result) => {
            t.is(result.css, css)
            t.end()
        })
})

test.cb('processAll - replaces the media queries with the wrapper class for each breakpoint', (t) => {
    const breakpoints = [
        {
            wrapper: '.first',
            match: '(min-width: 350px)',
        },
        {
            wrapper: '.second',
            match: '(max-width: 350px)',
        },
    ]
    const css = `
        .foo: {
            color: red;
        }

        @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
            .foo: {
                color: blue;
            }
        }

        @media (min-width: 350px) {
            .foo: {
                color: blue;
            }
        }

        @media (max-width: 350px) {
            .foo: {
                color: green;
            }
        }
    `
    const expected = `
        .foo: {
            color: red;
        }

        @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
            .foo: {
                color: blue;
            }
        }

        .first .foo: {
                color: blue;
            }

        .second .foo: {
                color: green;
            }
    `

    postcss([processAll(breakpoints)])
        .process(css)
        .then((result) => {
            t.is(result.css, expected)
            t.end()
        })
})
