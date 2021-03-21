const svgr = require('@svgr/core')

exports.svg = function (source, options) {
  const code = svgr.sync(source, options)
  return code
}
