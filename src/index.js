const getOptions = require('./options')

/**
 * @typedef {{
 *   namedExport?: string;
 *   expandProps: 'end';
 *   memo?: boolean;
 *   ref?: boolean;
 *   replaceAttrValues?: { [key: string]: any };
 *   svgProps?: { [key: string]: any };
 *   titleProp?: boolean;
 *   svgoConfig?: { plugins?: Array<string>; multipass?: boolean };
 * }} SvgrOptions
 *
 * @see https://github.com/gregberge/svgr/blob/main/packages/core/src/config.js
 */

/**
 * @typedef {{
 *   svgr?: SvgrOptions;
 *   svgo?: { plugins?: Array<string>; multipass?: boolean };
 *   limit?: number
 * }} PluginOptions
 */

/**
 * Create Next.js svg plugin.
 *
 * @param {PluginOptions} [pluginOptions] Options
 */
function createSvgPlugin(pluginOptions = {}) {
  return function createNextConfig(nextConfig = {}) {
    const { svgrOptions, svgoOptions } = getOptions(pluginOptions)

    return {
      ...nextConfig,
      webpack(config, options) {
        config.module.rules.push({
          test: /\.svg$/,
          issuer: /\.(js|jsx|ts|tsx)$/,
          use: [
            options.defaultLoaders.babel,
            {
              loader: require.resolve('@svgr/webpack'),
              options: svgrOptions,
            },
            /**
             * TODO: Use webpack 5 asset modules.
             * @see https://webpack.js.org/guides/asset-modules/
             */
            {
              loader: require.resolve('url-loader'),
              options: {
                limit: pluginOptions.limit || 8192,
                fallback: require.resolve('next/dist/compiled/file-loader'),
                publicPath: '/_next/',
                /**
                 * In server-side compilation phase, `outputPath` defaults to
                 * `.next/server`, but images should be emitted
                 * to `.next/server/chunks/static/images`.
                 */
                outputPath: options.isServer ? '../../' : undefined,
                name: 'static/images/[name].[contenthash].[ext]',
                /**
                 * Don't emit images twice.
                 *
                 * Images are emitted in the server-side compilation phase, not the
                 * client-side compilation phase, to support `require` and
                 * `require.context` in `getStaticProps`. Note that
                 * `require.context` currently does not work with `issuer` because
                 * of https://github.com/webpack/webpack/issues/9309
                 */
                emitFile: options.isServer,
              },
            },
            {
              loader: '@stefanprobst/svgo-loader',
              options: svgoOptions,
            },
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

module.exports = createSvgPlugin
