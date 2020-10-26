declare module '*.svg' {
  import type { FC, SVGProps } from 'react'
  const filePath: string
  const Component: FC<
    SVGProps<SVGSVGElement> & {
      /** requires setting `options.svgr.titleProp: true` */
      title?: string
    }
  >
  export { Component as Svg }
  export default filePath
}
