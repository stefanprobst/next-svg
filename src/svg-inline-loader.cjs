module.exports = function loader(content) {
  const cb = this.async()
  import('./svg-inline-loader.js').then((mod) => {
    const result = mod.default.call(this, content)
    cb(null, result)
  })
}
