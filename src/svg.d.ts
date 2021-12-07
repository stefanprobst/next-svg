declare module '*.svg?symbol' {
  import type { ReactNode, SVGProps, VFC } from 'react'

  const Image: VFC<SVGProps<SVGSVGElement> & { title?: ReactNode }>

  export default Image
}

declare module '*.svg' {
  const content: StaticImageData

  export default content
}
