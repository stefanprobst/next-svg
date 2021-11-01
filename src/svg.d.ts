declare module '*.svg?symbol' {
  import type { VFC, SVGProps } from 'react'

  const Image: VFC<SVGProps<SVGSVGElement>>

  export default Image
}

declare module '*.svg' {
  const content: StaticImageData

  export default content
}
