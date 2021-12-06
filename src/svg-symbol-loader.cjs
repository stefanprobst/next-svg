const loaderUtils = require('next/dist/compiled/loader-utils3')

module.exports = function loader(content) {
  const { isServer, assetPrefix, id, basePath } = this.getOptions()

  const context = this.rootContext
  const interpolatedName = loaderUtils.interpolateName(
    this,
    '/static/media/[name].[hash:8].[ext]',
    { context, content },
  )

  if (!isServer) {
    this.emitFile(interpolatedName, content, null)
  }

  const prefix = basePath ?? assetPrefix + '/_next'
  const outputPath = prefix + interpolatedName

  return `
  export default function Image(props) {
    return (
      <svg {...props}>
        <use href="${outputPath}#${id}" />
      </svg>
    )
  }`
}
