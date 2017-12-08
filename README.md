# extract-media-queries 

Strips out all media queries based on user provided breakpoints and prepends all effected classes with a breakpoint specific wrapper. 

## Installation

```console
$ npm i extract-media-queries --save-dev
```


## Usage
##### myCss.css
```css
.foo {
    color: red;
}

@media (min-width: 350px) {
    .foo {
        color: blue;
    }
}

@media (min-width: 767px) {
    .foo {
        color: green;
    }
}
```

##### transformed.css
```css
.base .foo {
    color: red;
}

.small .foo {
    color: blue;
}

.medium .foo {
    color: green;
}
```

### Breakpoints Structure

For the plugin to work you must specify the breakpoints for the media queries you want to replace. 

##### Breakpoints:
```js
{
    breakPoints: [
        {
            wrapper: '.base',
            includeBaseStyles: true,
            match:
                `\\(max-width:[ \t]+350px\\)|` +
                `\\(max-width:[ \t]+767px\\)|` +
        },
        {
            wrapper: '.small',
            match:
                `\\(min-width:[ \t]+350px\\)|` +
                `\\(max-width:[ \t]+766px\\)`
        },
        {
            wrapper: '.medium',
            match: `(min-width: 767px)`,
        }
    ]
}
```

#### wrapper
The className to wrap each matched query in.

#### includeBaseStyles
If set to true will include any none media query in the wrapper.

#### match
The media queries to match. Can either be a RegExp or a string.

## Webpack Loader

If you are using `css-loader` with css modules you will need to use this loader. It must come directly after the `css-loader` so that the wrapper classes don

```js
module: {
    rules: [
        {
            test: /\.css$/,
            use: [
                {
                    loader: 'extract-media-queries/webpack-plugin',
                    query: {
                        breakPoints: [ ... ]
                    }
                },
                {
                    loader: 'css-loader',
                    query: `modules`
                },
                {
                    loader: 'postcss-loader'
                }
            ]
        }
    ]
}
```

## PostCSS Plugin

If you are using `css-loader` with css modules you will need to use this loader. It must come directly after the `css-loader`.

##### postcss.config.js:
```js
{
    plugins: [
        require('extract-media-queries/postcss-plugin')({
            breakPoints: [ ... ]
        }),
    ]
});
```
