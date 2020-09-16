declare module '*.svg' {
  import type { FC, SVGProps } from 'react'
  const filePath: string
  const Component: FC<SVGProps<SVGSVGElement>>
  export { Component as Svg }
  export default filePath
}
