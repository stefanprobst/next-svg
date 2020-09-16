function componentTemplate(
  babel,
  options,
  { imports, interfaces, componentName, props, jsx, exports },
) {
  /**
   * `@svgr/babel-plugin-transform-svg-component` by default exports the
   * React component with the "ReactComponent" named export, when `@svgr/webpack`
   * is used together with another loader in the chain. this allows
   * customizing the named export with the `namedExport` option
   */
  if (options.namedExport) {
    const namedExport = exports.find(babel.types.isExportNamedDeclaration)
    if (namedExport) {
      const [specifier] = namedExport.specifiers
      specifier.exported.name = options.namedExport
    }
  }

  const plugins = ['jsx']
  if (options.typescript) {
    plugins.push('typescript')
  }

  const template = babel.template.smart({ plugins })

  return template.ast`
    ${imports}
    ${interfaces}
    function ${componentName}(${props}) {
      return ${jsx};
    }
    ${exports}
  `
}

module.exports = (pluginOptions = {}) => (nextConfig = {}) => {
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
            options: {
              /**
               * use a custom template, which only changes the named export
               * from ReactComponent to Svg when importing with
               * import { Svg as Logo } from 'assets/logo.svg'
               */
              template: componentTemplate,
              /**
               * when changing this, also update the types in index.d.ts
               */
              namedExport: 'Svg',
              /**
               * by default svgr uses ['jsx', 'svgo'] plugins,
               * but applies the svgo transformations only to
               * the generated React component, but not to the
               * emitted file. we use a separate loader for svgo,
               * so don't need @svgr/plugin-svgo.
               */
              plugins: [require.resolve('@svgr/plugin-jsx')],
              ...(pluginOptions.svgr || {}),
              babel: false,
            },
          },
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: pluginOptions.limit || 8192,
              fallback: require.resolve('next/dist/compiled/file-loader'),
              publicPath: '/_next/',
              /**
               * in server-side compilation phase, `outputPath` defaults to
               * `.next/server`, but images should be emitted
               * to `.next/static/images`
               */
              outputPath: options.isServer ? '../' : undefined,
              name: 'static/images/[name].[contenthash].[ext]',
              /**
               * don't emit images twice
               *
               * images are emitted in the server-side compilation phase, not the
               * client-side compilation phase, to support `require` and
               * `require.context` in `getStaticProps`. note that
               * `require.context` currently does not work with `issuer` because
               * of https://github.com/webpack/webpack/issues/9309
               */
              emitFile: options.isServer,
            },
          },
          {
            loader: '@stefanprobst/svgo-loader',
            options: {
              ...(pluginOptions.svgo || {}),
            },
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
