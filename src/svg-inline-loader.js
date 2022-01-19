import { toEstree } from 'hast-util-to-estree'
import parse5 from 'parse5'
import { fromParse5 } from 'hast-util-from-parse5'
import recast from 'recast'

export default function loader(content) {
  const { icon } = this.getOptions()

  /**
   * @see https://github.com/syntax-tree/hast-util-to-estree#use
   */
  const hast = fromParse5(parse5.parseFragment(content), { space: 'svg' })
  const estree = toEstree(hast, { space: 'svg' })
  /** `recast` doesn't like comments on the root. */
  estree.comments = null
  /* Get rid of wrapping Program node and Fragment wrapper. */
  const svgElement = estree.body[0].expression.children[0]

  if (icon === true) {
    /** Add `width="1em"`. */
    svgElement.openingElement.attributes.unshift({
      type: 'JSXAttribute',
      name: {
        type: 'JSXIdentifier',
        name: 'width',
      },
      value: {
        type: 'Literal',
        value: '1em',
        raw: '"1em"',
      },
    })
    /** Add `height="1em"`. */
    svgElement.openingElement.attributes.unshift({
      type: 'JSXAttribute',
      name: {
        type: 'JSXIdentifier',
        name: 'height',
      },
      value: {
        type: 'Literal',
        value: '1em',
        raw: '"1em"',
      },
    })
  }

  /** Add `{...props}`. */
  svgElement.openingElement.attributes.push({
    type: 'JSXSpreadAttribute',
    argument: {
      type: 'Identifier',
      name: 'props',
    },
  })

  /** Add `{title != null ? <title>{title}</title> : null}`. */
  svgElement.children.unshift({
    type: 'JSXExpressionContainer',
    expression: {
      type: 'ConditionalExpression',
      test: {
        type: 'BinaryExpression',
        left: {
          type: 'Identifier',
          name: 'title',
        },
        operator: '!=',
        right: {
          type: 'Literal',
          value: null,
          raw: 'null',
        },
      },
      consequent: {
        type: 'JSXElement',
        openingElement: {
          type: 'JSXOpeningElement',
          attributes: [],
          name: {
            type: 'JSXIdentifier',
            name: 'title',
          },
          selfClosing: false,
        },
        closingElement: {
          type: 'JSXClosingElement',
          name: {
            type: 'JSXIdentifier',
            name: 'title',
          },
        },
        children: [
          {
            type: 'JSXExpressionContainer',
            expression: {
              type: 'Identifier',
              name: 'title',
            },
          },
        ],
      },
      alternate: {
        type: 'Literal',
        value: null,
        raw: 'null',
      },
    },
  })

  const jsx = recast.prettyPrint(svgElement).code

  return `
  export default function Image({ title, ...props }) {
    return (
      ${jsx}
    )
  }`
}
