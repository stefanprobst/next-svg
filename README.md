# next-svg

Adds a Webpack loader for importing `.svg` files as file paths or React
components to the Next.js config.

## How to use

First, add the loader to the Next.js configuration in `next.config.js`:

```js
const withSvg = require('@stefanprobst/next-svg')(/* options */)

const nextConfig = {
  /** ... */
}

module.exports = withSvg(nextConfig)
```

An `.svg` image can then be imported either as a file path to be used in an
`<img>` element, or as a React component from a `Svg` named import. This is
similar to a `create-react-app` setup.

```tsx
import Logo from '@/assets/images/logo.svg'
import { Svg as RocketIcon } from '@/assets/icons/rocket.svg'

export default function Page() {
  return (
    <h1>
      <img src={Logo} alt="Logo" />
      <RocketIcon />
      Also cool!
    </h1>
  )
}
```

## Options

The package uses three loaders in a loader chain:
[`svgo-loader`](https://github.com/stefanprobst/svgo-loader) to optimize the
image with [`svgo`](https://github.com/svg/svgo),
[`url-loader`](https://github.com/webpack-contrib/url-loader) to inline the
image or emit it to file , and
[`@svgr/webpack`](https://github.com/gregberge/svgr/tree/master/packages/webpack)
to generate the React component. Each loader can be configured individually:

```js
const createSvgPlugin = require('@stefanprobst/next-svg')

const withSvg = createSvgPlugin({
  svgo: {},
  svgr: {},
  limit: 8192,
  namedExport: 'Svg',
})
```

For `svgo` options, please refer to the
[SVGO docs](https://github.com/svg/svgo#what-it-can-do). For the `url-loader`
`limit` option please refer to the
[`url-loader` docs](https://github.com/webpack-contrib/url-loader#limit). For
`svgr` options, please refer to the
[SVGR docs](https://react-svgr.com/docs/options/).

Additionally, the `namedExport` option allows customizing how React component
must be imported. Note that this depends on the included custom `svgr` template
to work; when providing your own template, the named export defaults to
"ReactComponent".

## Typescript

To make typescript understand `.svg` imports, add the following to
`next-env.d.ts`:

```ts
/// <reference types="@stefanprobst/next-svg" />
```

Note that when changing the `namedExport` option, you will need to provide your
own module declaration for `.svg` files. Copy `src/index.d.ts` to your project
and adjust the named export accordingly.
