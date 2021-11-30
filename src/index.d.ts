import type { OptimizeOptions } from 'svgo'

export interface Options {
  id?: string
  svgoPlugins?: OptimizeOptions['plugins']
}

declare function createPlugin(pluginOptions?: Options)

export default createPlugin
