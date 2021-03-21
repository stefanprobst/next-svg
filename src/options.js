function getOptions(pluginOptions) {
  const svgrOptions = {
    namedExport: 'Svg',
    runtimeConfig: false,
    ...(pluginOptions.svgr || {}),
    babel: false,
  }

  const svgoOptions = pluginOptions.svgo || {}

  if (Array.isArray(svgoOptions.plugins)) {
    const svgrSvgoConfig = svgrOptions.svgoConfig || {}
    svgrOptions.svgoConfig = {
      ...svgrSvgoConfig,
      multipass:
        svgrSvgoConfig.multipass !== undefined
          ? svgrSvgoConfig.multipass
          : svgoOptions.multipass,
      plugins: [...svgoOptions.plugins, ...(svgrSvgoConfig.plugins || [])],
    }
  }

  return { svgrOptions, svgoOptions }
}

module.exports = getOptions
