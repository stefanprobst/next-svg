const { process } = require('babel-jest')
const processors = require('./processors')

/**
 * @typedef {{
 *   namedExport?: string;
 *   expandProps: 'end';
 *   memo?: boolean;
 *   ref?: boolean;
 *   replaceAttrValues?: { [key: string]: any };
 *   svgProps?: { [key: string]: any };
 *   titleProp?: boolean;
 *   svgoConfig?: { plugins?: Array<string> };
 * }} SvgrOptions
 *
 * @see https://github.com/gregberge/svgr/blob/main/packages/core/src/config.js
 */

/**
 * @typedef {{
 *   svgr?: SvgrOptions;
 *   svgo?: { plugins?: Array<string> };
 * }} SvgOptions
 */

/** @type {(userOptions?: SvgOptions ) => import('@jest/transform').Transformer} */
function createTransformer(userOptions) {
  return {
    process(sourceText, sourcePath, config, options) {
      const jsx = processors.svg(sourceText, userOptions)
      const processed = process(jsx, sourcePath, config, options)
      return 'code' in processed ? processed.code : processed
    },
  }
}

/**
 * Jest transformer for mdx.
 *
 * @type {import('@jest/transform').Transformer}
 */
const transformer = {
  ...createTransformer(),
  createTransformer,
}

module.exports = transformer
