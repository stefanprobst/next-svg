declare module '*.svg?inline' {
  import type { ReactNode, SVGProps, VFC } from 'react'

  const Image: VFC<SVGProps<SVGSVGElement> & { title?: ReactNode }>

  export default Image
}

declare module '*.svg?inline-icon' {
  import type { ReactNode, SVGProps, VFC } from 'react'

  const Image: VFC<SVGProps<SVGSVGElement> & { title?: ReactNode }>

  export default Image
}

declare module '*.svg?symbol' {
  import type { ReactNode, SVGProps, VFC } from 'react'

  const Image: VFC<SVGProps<SVGSVGElement> & { title?: ReactNode }>

  export default Image
}

declare module '*.svg?symbol-icon' {
  import type { ReactNode, SVGProps, VFC } from 'react'

  const Image: VFC<SVGProps<SVGSVGElement> & { title?: ReactNode }>

  export default Image
}

declare module '*.svg' {
  const content: StaticImageData

  export default content
}
