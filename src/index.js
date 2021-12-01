/** @typedef {import('next').NextConfig} NextConfig */

export default function createPlugin(pluginOptions = {}) {
  const id = pluginOptions.id ?? '__root__'
  const svgoPlugins = pluginOptions.svgoPlugins ?? []

  /** @type {(nextConfig: NextConfig) => NextConfig} */
  return function createNextConfig(nextConfig = {}) {
    return {
      ...nextConfig,
      webpack(config, options) {
        const nextImageLoader = config.module.rules.find(
          (rule) => rule.loader === 'next-image-loader',
        )

        const svgoLoader = {
          loader: 'svgo-loader',
          options: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    removeViewBox: false,
                  },
                },
              },
              'prefixIds',
              'removeDimensions',
              ...svgoPlugins,
              {
                name: 'addAttributesToSVGElement',
                params: {
                  attributes: [{ id }],
                },
              },
            ],
          },
        }

        config.module.rules.push({
          test: /\.svg$/,
          dependency: nextImageLoader.dependency,
          issuer: nextImageLoader.issuer,
          rules: [
            {
              oneOf: [
                {
                  resourceQuery: /symbol/,
                  use: [
                    options.defaultLoaders.babel,
                    {
                      loader: './svg-symbol-loader',
                      options: { ...nextImageLoader.options, id },
                    },
                  ],
                },
                {
                  loader: nextImageLoader.loader,
                  options: nextImageLoader.options,
                },
              ],
            },
            svgoLoader,
          ],
        })

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      },
    }
  }
}
