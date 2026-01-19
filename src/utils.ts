import type { Element } from 'hast'

/**
 * Check if a hast element is an infographic code block
 * @param element - The hast element to check
 * @returns true if the element has the infographic class name or data attribute
 */
export function isInfographicElement(element: Element): boolean {
  // Check for <code class="language-infographic">
  if (element.tagName === 'code') {
    const className = element.properties?.className
    if (Array.isArray(className)) {
      // Check for language-infographic class
      if (className.some(c => {
        const str = String(c)
        return str === 'language-infographic' || str.startsWith('language-infographic')
      })) {
        return true
      }
    }

    // Also check data-language attribute (Astro 5 uses this)
    const dataLanguage = element.properties?.dataLanguage
    if (String(dataLanguage) === 'infographic') {
      return true
    }
  }

  // Check for <pre class="infographic"> or <pre data-language="infographic">
  if (element.tagName === 'pre') {
    const className = element.properties?.className
    if (Array.isArray(className)) {
      if (className.includes('infographic')) {
        return true
      }
    }

    const dataLanguage = element.properties?.dataLanguage
    if (String(dataLanguage) === 'infographic') {
      return true
    }
  }

  return false
}
