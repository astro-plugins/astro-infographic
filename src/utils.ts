import type { Element } from 'hast'

/**
 * Check if a hast element is an infographic code block
 * @param element - The hast element to check
 * @returns true if the element has the infographic class name
 */
export function isInfographicElement(element: Element): boolean {
  // Check for <code class="language-infographic">
  if (element.tagName === 'code') {
    const className = element.properties?.className
    if (Array.isArray(className)) {
      return className.includes('language-infographic')
    }
  }

  // Check for <pre class="infographic">
  if (element.tagName === 'pre') {
    const className = element.properties?.className
    if (Array.isArray(className)) {
      return className.includes('infographic')
    }
  }

  return false
}
