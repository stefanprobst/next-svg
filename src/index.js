/** @typedef {import('next').NextConfig} NextConfig */

export default function createPlugin(pluginOptions = {}) {
  const id = pluginOptions.id ?? '__root__'
  const svgoPlugins = pluginOptions.svgoPlugins ?? []

  /** @type {(nextConfig: NextConfig) => NextConfig} */
  return function createNextConfig(nextConfig = {}) {
    return {
      ...nextConfig,
      webpack(config, options) {
        const { isServer } = options
        const { assetPrefix } = options.config

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

        const svgSymbolLoader = {
          resourceQuery: /symbol/,
          use: [
            options.defaultLoaders.babel,
            {
              loader: '@stefanprobst/next-svg/svg-symbol-loader',
              options: { isServer, assetPrefix, id },
            },
          ],
        }

        const oneOf = [svgSymbolLoader]

        if (nextImageLoader != null) {
          oneOf.push({
            loader: nextImageLoader.loader,
            options: nextImageLoader.options,
          })
        }

        config.module.rules.push({
          test: /\.svg$/,
          dependency: nextImageLoader?.dependency ?? { not: ['url'] },
          issuer: nextImageLoader?.issuer ?? { not: /\.(css|scss|sass)$/ },
          rules: [
            {
              oneOf,
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
