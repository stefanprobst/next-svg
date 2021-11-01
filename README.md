# next-svg

Next.js plugin to optimize svg images with [SVGO v2](https://github.com/svg/svgo). Output can be
used with `next/image` by default, or as a React component when imported with a `?symbol` resource
query.

Note: previous versions have used `@svgr/webpack` to generate React components. The current version
generates a thin wrapping component around a svg
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

const svgPlugin = createsSvgPlugin({
  id: '__root__',
  svgoPlugins: [],
})

export default createSvgPlugin(nextConfig)
```

Import image in a component:

```js
import RocketAsset from '../public/rocket.svg'
import RocketComponent from '../public/rocket.svg?symbol'

export default function HomePage() {
  return (
    <main>
      <Image src={RocketAsset} alt="Cartoon rocket">
      <RocketComponent aria-label="Cartoon rocket" />
    </main>
  )
}
```

### Plugin options

- `id`: Added to the image's root `svg` element, so it can be refereced via `<use href="#id">`.
  (Optional)
- `svgoPlugins`: Add [svgo plugins](https://github.com/svg/svgo#built-in-plugins). By default, the
  base svgo preset with `removeViewBox` disabled, and `removeDimensions` and `prefixIds` enabled is
  added. (Optional)

### Types

When using typescript, add the following to `app.d.ts` (or any other `.d.ts` file referenced in
`tsconfig.json#include`):

```ts
/// <reference types="@stefanprobst/next-svg/types" />
```
