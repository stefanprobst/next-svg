# next-svg

Next.js plugin to optimize svg images with [SVGO v2](https://github.com/svg/svgo). Output can be
used with `next/image` by default, or as a React component when imported with a resource query.

The current version generates a thin wrapping component around a svg
[`<use>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use) element.

## How to install

```bash
yarn add @stefanprobst/next-svg`
```

## How to use

Add the plugin to the Next.js configuration:

```js
// next.config.mjs
import createSvgPlugin from '@stefanprobst/next-svg'

/** @type {import('next').NextConfig} */
const nextConfig = {}

const withSvg = createSvgPlugin({
  // id: '__root__',
  // svgoPlugins: [],
})

export default withSvg(nextConfig)
```

There are three options for importing an svg image:

### Use with `next/image`

By default, the svg image will be imported for use with `next/image`. This is also the default
`next` behavior.

```js
import Image from 'next/image'
import RocketAsset from '../public/rocket.svg'

export default function HomePage() {
  return (
    <main>
      <Image src={RocketAsset} alt="Cartoon rocket" />
    </main>
  )
}
```

### Use as a React component with inlined svg

When used with a `?inline` resource query, the import returns a React component which inlines the
svg as jsx. This is similar to what `svgr` does.

```js
import RocketComponent from '../public/rocket.svg?inline'

export default function HomePage() {
  return (
    <main>
      <RocketComponent aria-label="Cartoon rocket" />
    </main>
  )
}
```

Alternatively, the `?inline-icon` resource query will add a default width and height of `1em`.

### Use as a React component with `<use>`

When used with a `?symbol` resource query, the import returns a React component which references the
svg image via `<use>`.

```js
import RocketComponent from '../public/rocket.svg?symbol'

export default function HomePage() {
  return (
    <main>
      <RocketComponent aria-label="Cartoon rocket" />
    </main>
  )
}
```

Alternatively, the `?symbol-icon` resource query will add a default width and height of `1em`.

### Plugin options

- `id`: Added to the image's root `svg` element, so it can be refereced via `<use href="#id">`.
  (Optional)
- `svgoPlugins`: Add [svgo plugins](https://github.com/svg/svgo#built-in-plugins). By default, the
  base svgo preset with `removeViewBox` disabled, and `removeDimensions`, `convertStyleToAttrs` and
  `prefixIds` enabled is added. (Optional)

### Types

When using typescript, add the following to `app.d.ts` (or any other `.d.ts` file referenced in
`tsconfig.json#include`):

```ts
/// <reference types="@stefanprobst/next-svg/types" />
```
