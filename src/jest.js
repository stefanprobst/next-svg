const { process } = require('babel-jest')
const getOptions = require('./options')
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
 *   svgoConfig?: { plugins?: Array<string>; multipass?: boolean };
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
  const { svgrOptions } = getOptions(userOptions)
  return {
    process(sourceText, sourcePath, config, options) {
      const jsx = processors.svg(sourceText, svgrOptions)
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
