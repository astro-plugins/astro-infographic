import type { Element, Root, Parent } from 'hast'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import { toText } from 'hast-util-to-text'
import type { VFile } from 'vfile'
import { renderInfographic } from './renderer.js'
import type { RehypeInfographicOptions } from './types.js'
import { isInfographicElement } from './utils.js'

/**
 * Default options for the plugin
 */
const defaultOptions: RehypeInfographicOptions = {
  width: '100%',
  height: 'auto'
}

/**
 * Simple AST visitor that manually traverses the tree
 */
function visitElements(tree: Root, callback: (node: Element, parent: Parent) => void): void {
  function walk(node: unknown, parent: Parent): void {
    if (!node || typeof node !== 'object') {
      return
    }

    // Check if this is an element node
    if ('type' in node && node.type === 'element') {
      callback(node as Element, parent)
    }

    // Recursively walk children
    if ('children' in node && Array.isArray(node.children)) {
      const currentParent = node as Parent
      for (const child of node.children) {
        walk(child, currentParent)
      }
    }
  }

  walk(tree, tree as Parent)
}

/**
 * A rehype plugin to render @antvis/Infographic diagrams
 *
 * @param options - Plugin configuration options
 * @returns A unified plugin function
 */
function rehypeInfographic(options: RehypeInfographicOptions = {}) {
  // Merge user options with defaults
  const finalOptions = { ...defaultOptions, ...options }

  return async function transformer(tree: any, file: any) {
    const instances: Array<{ spec: string; parent: Element; node: Element }> = []

    // Step 1: Traverse AST to find infographic code blocks
    visitElements(tree, (node, parent) => {
      // Skip if parent is the Root node
      if (parent.type === 'root') {
        return
      }

      // Parent should be an element at this point
      if (parent.type !== 'element') {
        return
      }

      const parentElement = parent as Element

      // Check if this is an infographic code block
      // First check the <code> element directly
      let isInfographic = isInfographicElement(node)

      // If not found, check if the parent <pre> has the infographic class
      // (Shiki in Astro 5 may have already modified the code element's attributes)
      if (!isInfographic && parentElement.tagName === 'pre') {
        const preClassName = parentElement.properties?.className
        if (Array.isArray(preClassName)) {
          isInfographic = preClassName.some(c => {
            const str = String(c)
            return str === 'language-infographic' ||
              str.startsWith('language-infographic') ||
              str === 'infographic'
          })
        }
      }

      if (!isInfographic) {
        return
      }

      // Check if this is <code> wrapped in <pre>
      if (parentElement.tagName === 'pre') {
        // Only process if the <code> element is the only meaningful child
        // Allow whitespace text siblings
        for (const child of parentElement.children) {
          if (child.type === 'text') {
            // Skip whitespace text nodes
            if (child.value.trim().length > 0) {
              return
            }
          } else if (child !== node) {
            // Non-whitespace sibling means don't process
            return
          }
        }
      }

      // Extract the infographic specification from the code block
      const spec = toText(node, { whitespace: 'pre' })

      // Skip empty specifications
      if (spec.trim().length === 0) {
        return
      }

      instances.push({
        spec,
        parent: parentElement,
        node
      })
    })


    // If no infographic blocks found, we're done
    if (instances.length === 0) {
      return
    }

    // Step 2: Render all infographic instances in parallel
    const renderPromises = instances.map(async ({ spec }) => {
      try {
        const svg = await renderInfographic(spec, {
          width: finalOptions.width,
          height: finalOptions.height,
          ...finalOptions.infographicOptions
        })
        return { success: true, svg } as const
      } catch (error) {
        return { success: false, error } as const
      }
    })

    const results = await Promise.all(renderPromises)

    // Step 3: Replace code blocks with rendered SVG or error fallback
    for (const [index, instance] of instances.entries()) {
      const result = results[index]
      const { parent, node } = instance
      const nodeIndex = parent.children.indexOf(node)

      if (result.success) {
        // Convert SVG string to AST node
        // The SVG output starts with XML declarations which need special handling
        // <?xml version="1.0"?><?xml-stylesheet ...?><svg>...</svg>

        // Strip XML declarations - they're not valid HTML and cause parsing issues
        let svgHTML = result.svg
        svgHTML = svgHTML.replace(/<\?xml[^>]*>\s*/g, '')

        // Wrap in a div to ensure proper HTML parsing
        const wrapped = `<div>${svgHTML}</div>`
        const fragment = fromHtmlIsomorphic(wrapped, { fragment: true })
        const container = fragment.children[0] as Element

        // Extract the SVG element from the container
        const svgElement = container.children?.[0] as Element

        if (svgElement) {
          // Replace the code block with the SVG
          parent.children[nodeIndex] = svgElement
        } else {
          // Fallback: wrap in a div if SVG parsing failed
          const wrapperElement: Element = {
            type: 'element',
            tagName: 'div',
            properties: {},
            children: [
              { type: 'text', value: svgHTML }
            ]
          }
          parent.children[nodeIndex] = wrapperElement
        }
      } else {
        // Handle rendering error
        if (finalOptions.errorFallback) {
          const fallback = finalOptions.errorFallback(
            node,
            instance.spec,
            result.error,
            file
          )

          if (fallback) {
            // Use fallback node
            parent.children[nodeIndex] = fallback
          } else {
            // Remove the element (fallback returned null/undefined)
            parent.children.splice(nodeIndex, 1)
          }
        } else {
          // No error fallback provided, report error and throw
          const message = file.message(
            `Failed to render infographic: ${result.error instanceof Error ? result.error.message : String(result.error)}`,
            {
              ruleId: 'rehype-infographic',
              source: 'rehype-infographic'
            }
          )
          message.fatal = true
          message.url = 'https://github.com/antv/infographic'
          throw message
        }
      }
    }
  }
}

export default rehypeInfographic
