import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeInfographic from '../src/index'

describe('rehype-infographic', () => {
  const createProcessor = (options = {}) =>
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeInfographic, options)
      .use(rehypeStringify)

  describe('basic rendering', () => {
    it('should render a simple infographic to SVG', async () => {
      const markdown = `
\`\`\`infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label Step 1
\`\`\`
      `

      const processor = createProcessor()
      const { value } = await processor.process(markdown)

      expect(String(value)).toContain('<svg')
      expect(String(value)).toContain('viewBox')
    })

    it('should handle multiple infographics in one document', async () => {
      const markdown = `
\`\`\`infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label A
\`\`\`

\`\`\`infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label B
\`\`\`
      `

      const processor = createProcessor()
      const { value } = await processor.process(markdown)

      const html = String(value)
      // Count SVG tags - should have 2
      const svgCount = (html.match(/<svg/g) || []).length
      expect(svgCount).toBeGreaterThanOrEqual(2)
    })
  })

  describe('error handling', () => {
    it('should use errorFallback when provided', async () => {
      const markdown = `
\`\`\`infographic
invalid syntax here
\`\`\`
      `

      const processor = createProcessor({
        errorFallback: () => ({
          type: 'element',
          tagName: 'div',
          properties: { className: ['error'] },
          children: [{ type: 'text', value: 'Error rendering infographic' }]
        })
      })

      const { value } = await processor.process(markdown)

      expect(String(value)).toContain('<div class="error">')
      expect(String(value)).toContain('Error rendering infographic')
    })

    it('should remove element when errorFallback returns null', async () => {
      const markdown = `
\`\`\`infographic
invalid syntax here
\`\`\`
      `

      const processor = createProcessor({
        errorFallback: () => null
      })

      const { value } = await processor.process(markdown)

      const html = String(value)
      // Should not contain SVG or the error div
      expect(html).not.toContain('<svg')
    })

    it('should throw error when no errorFallback provided', async () => {
      const markdown = `
\`\`\`infographic
invalid syntax here
\`\`\`
      `

      const processor = createProcessor()

      await expect(processor.process(markdown)).rejects.toThrow()
    })
  })

  describe('element identification', () => {
    it('should process code blocks with language-infographic class', async () => {
      const markdown = `
\`\`\`infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label Test
\`\`\`
      `

      const processor = createProcessor()
      const { value } = await processor.process(markdown)

      expect(String(value)).toContain('<svg')
    })

    it('should ignore code blocks with other languages', async () => {
      const markdown = `
\`\`\`javascript
console.log('hello');
\`\`\`
      `

      const processor = createProcessor()
      const { value } = await processor.process(markdown)

      expect(String(value)).not.toContain('<svg')
      expect(String(value)).toContain('javascript')
    })

    it('should skip empty infographic blocks', async () => {
      const markdown = `
\`\`\`infographic

\`\`\`
      `

      const processor = createProcessor()
      const { value } = await processor.process(markdown)

      expect(String(value)).not.toContain('<svg')
    })
  })

  describe('configuration', () => {
    it('should respect width and height options', async () => {
      const markdown = `
\`\`\`infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label Test
\`\`\`
      `

      const processor = createProcessor({
        width: 800,
        height: 600
      })

      const { value } = await processor.process(markdown)

      // Should still render successfully
      expect(String(value)).toContain('<svg')
    })
  })
})
