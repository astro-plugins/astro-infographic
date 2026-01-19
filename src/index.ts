import type { Element, ElementContent, Root } from 'hast'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import { toText } from 'hast-util-to-text'
import type { Plugin } from 'unified'
import { visitParents } from 'unist-util-visit-parents'
import type { VFile } from 'vfile'
import { renderInfographic } from './renderer.js'
import type { CodeInstance, RehypeInfographicOptions } from './types.js'
import { isInfographicElement } from './utils.js'

/**
 * Default options for the plugin
 */
const defaultOptions: RehypeInfographicOptions = {
  width: '100%',
  height: 'auto'
}

/**
 * A rehype plugin to render @antvis/Infographic diagrams
 *
 * @param options - Plugin configuration options
 * @returns A unified plugin function
 */
const rehypeInfographic: Plugin<[RehypeInfographicOptions?], Root> = (options = {}) => {
  // Merge user options with defaults
  const finalOptions = { ...defaultOptions, ...options }

  return async (ast, file) => {
    const instances: CodeInstance[] = []

    // Step 1: Traverse AST to find infographic code blocks
    visitParents(ast, 'element', (node, ancestors) => {
      if (!isInfographicElement(node as Element)) {
        return
      }

      const parent = ancestors.at(-1)
      let inclusiveAncestors = ancestors as Element[]

      // Check if this is <code> wrapped in <pre>
      if (parent?.type === 'element' && parent.tagName === 'pre') {
        // Only process if the <code> element is the only meaningful child
        // Allow whitespace text siblings
        for (const child of parent.children) {
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
      } else {
        // Not wrapped in <pre>, include the current element
        inclusiveAncestors = [...inclusiveAncestors, node as Element]
      }

      // Extract the infographic specification from the code block
      const spec = toText(node as Element, { whitespace: 'pre' })

      // Skip empty specifications
      if (spec.trim().length === 0) {
        return
      }

      instances.push({
        spec,
        ancestors: inclusiveAncestors
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
      const { ancestors } = instance
      const node = ancestors.at(-1)!
      const parent = ancestors.at(-2)!
      const nodeIndex = parent.children.indexOf(node)

      if (result.success) {
        // Convert SVG string to AST node
        const fragment = fromHtmlIsomorphic(result.svg, { fragment: true })
        const svgElement = fragment.children[0] as Element

        // Replace the code block with the SVG
        parent.children[nodeIndex] = svgElement
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
              source: 'rehype-infographic',
              ancestors
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
