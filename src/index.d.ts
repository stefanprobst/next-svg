import type { NextConfig } from 'next'
import type { OptimizeOptions } from 'svgo'

export interface Options {
  id?: string
  svgoPlugins?: OptimizeOptions['plugins']
}

declare function createPlugin(pluginOptions?: Options): (nextConfig: NextConfig) => NextConfig

export default createPlugin
