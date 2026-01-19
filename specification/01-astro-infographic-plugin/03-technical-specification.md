# Technical Specification: rehype-infographic

**Version**: 1.0.0
**Date**: 2026-01-18
**Status**: Draft

---

## 1. Overview

rehype-infographic is a unified/rehype plugin that processes Markdown code blocks containing @antvis/Infographic specifications and renders them as SVG visualizations during the Astro build process.

### 1.1 Purpose

Enable content authors to write infographic specifications directly in Markdown files using a simple code block syntax:

````markdown
```infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label Step 1
      desc Start
```
````

The plugin renders these specifications to SVG at build time, embedding the SVG directly in the output HTML.

### 1.2 Design Principles

1. **Follow rehype-mermaid pattern**: Proven architecture for diagram rendering plugins
2. **Type-safe**: Full TypeScript with strict mode
3. **Simple API**: Minimal configuration, sensible defaults
4. **Error resilient**: Graceful handling of invalid specifications
5. **Performance**: Parallel rendering, minimal overhead

---

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Astro Build Process                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Markdown File (.md)                                     │
│       ↓                                                   │
│  [remark-parse] → Markdown AST                           │
│       ↓                                                   │
│  [remark-rehype] → HTML AST (hast)                       │
│       ↓                                                   │
│  ┌─────────────────────────────────────────────┐         │
│  │         rehype-infographic (plugin)          │         │
│  ├─────────────────────────────────────────────┤         │
│  │  1. Traverse AST with visitParents()        │         │
│  │  2. Find <code class="language-infographic">│         │
│  │  3. Extract infographic spec text           │         │
│  │  4. Call renderToString(spec)              │         │
│  │  5. Convert SVG to AST node                │         │
│  │  6. Replace code block in-place            │         │
│  └─────────────────────────────────────────────┘         │
│       ↓                                                   │
│  [rehype-stringify] → HTML                                │
│       ↓                                                   │
│  Final HTML with embedded SVG                             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Module Structure

```
src/
├── index.ts          # Main plugin export
│   └─ rehypeInfographic()  # Unified plugin function
│
├── renderer.ts       # Infographic SSR wrapper
│   └─ renderInfographic()   # Calls @antvis/infographic/ssr
│
├── utils.ts          # Helper functions
│   ├─ isInfographicElement()  # Element identification
│   ├─ extractSpec()           # Text extraction
│   └─ toDataURI()             # (Future) Data URI conversion
│
└── types.ts          # TypeScript types
    └─ RehypeInfographicOptions
```

### 2.3 Data Flow

**Input**:
```html
<pre><code class="language-infographic">infographic list-row-simple-horizontal-arrow
data
  lists
    - label Test</code></pre>
```

**Processing**:
1. Identify `<code>` element with `className="language-infographic"`
2. Extract text content: `infographic list-row-simple-horizontal-arrow\ndata...`
3. Call `renderToString(spec)` → Returns: `<svg>...</svg>`
4. Parse SVG to AST: `fromHtmlIsomorphic(svg, { fragment: true })`
5. Replace original element with SVG AST node

**Output**:
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <!-- Infographic content -->
</svg>
```

---

## 3. API Specification

### 3.1 Plugin Function

```typescript
import type { Plugin } from 'unified'
import type { Root } from 'hast'

interface RehypeInfographicOptions {
  /**
   * Width of rendered SVG
   * @default '100%'
   */
  width?: string | number

  /**
   * Height of rendered SVG
   * @default 'auto'
   */
  height?: string | number

  /**
   * Custom Infographic initialization options passed to SSR renderer
   */
  infographicOptions?: Partial<InfographicOptions>

  /**
   * Error fallback handler
   * @param element - The hast element that failed to render
   * @param spec - The infographic specification
   * @param error - The error that occurred
   * @param file - The vfile being processed
   * @returns Replacement node, or null/undefined to remove element
   */
  errorFallback?: (
    element: Element,
    spec: string,
    error: unknown,
    file: VFile
  ) => ElementContent | null | undefined
}

const rehypeInfographic: Plugin<[RehypeInfographicOptions?], Root>
```

### 3.2 Usage Example

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import rehypeInfographic from 'rehype-infographic'

export default defineConfig({
  markdown: {
    rehypePlugins: [
      rehypeInfographic({
        width: '100%',
        height: 'auto'
      })
    ]
  }
})
```

---

## 4. Implementation Details

### 4.1 Element Identification

```typescript
function isInfographicElement(element: Element): boolean {
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
```

### 4.2 Text Extraction

```typescript
import { toText } from 'hast-util-to-text'

const spec = toText(element, { whitespace: 'pre' })
```

Preserves whitespace and newlines in the infographic specification.

### 4.3 SVG Rendering

```typescript
import { renderToString } from '@antvis/infographic/ssr'

const svg = await renderToString(spec, {
  width: options.width,
  height: options.height,
  ...options.infographicOptions
})
```

### 4.4 AST Replacement

```typescript
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'

// Convert SVG string to AST
const fragment = fromHtmlIsomorphic(svg, { fragment: true })
const svgElement = fragment.children[0] as Element

// Replace original element
const parent = ancestors.at(-2)!
const node = ancestors.at(-1)!
const index = parent.children.indexOf(node)
parent.children[index] = svgElement
```

### 4.5 Error Handling

```typescript
try {
  const svg = await renderToString(spec, initOptions)
  // Process SVG...
} catch (error) {
  if (options.errorFallback) {
    const fallback = options.errorFallback(element, spec, error, file)
    if (fallback) {
      // Use fallback node
      parent.children[index] = fallback
    } else {
      // Remove element
      parent.children.splice(index, 1)
    }
  } else {
    // Report error
    const message = file.message(`Failed to render infographic: ${error}`, {
      ruleId: 'rehype-infographic',
      source: 'rehype-infographic',
      ancestors
    })
    message.fatal = true
    throw message
  }
}
```

---

## 5. Configuration

### 5.1 Default Options

```typescript
const defaultOptions: RehypeInfographicOptions = {
  width: '100%',
  height: 'auto',
  infographicOptions: {}
}
```

### 5.2 Option Merging

```typescript
const finalOptions = {
  ...defaultOptions,
  ...options
}
```

---

## 6. Testing Strategy

### 6.1 Test Categories

**Unit Tests**:
- `isInfographicElement()` - Various className scenarios
- `extractSpec()` - Text extraction with whitespace
- Error handling - Invalid specs, timeouts

**Integration Tests**:
- Simple infographic rendering
- Complex infographic (multiple items, icons)
- Multiple infographics in one document
- Empty/whitespace handling
- Error fallback behavior

**Snapshot Tests**:
- SVG output validation
- Regression detection

### 6.2 Test Framework

```typescript
// test/index.test.ts
import { describe, it, expect } from 'vitest'
import { unified } from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeInfographic from '../src/index'

describe('rehype-infographic', () => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeInfographic)
    .use(rehypeStringify)

  it('should render infographic to SVG', async () => {
    const markdown = `
\`\`\`infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label Test
\`\`\`
    `

    const { value } = await processor.process(markdown)

    expect(value).toContain('<svg')
    expect(value).toContain('viewBox')
  })

  it('should handle invalid spec with errorFallback', async () => {
    const markdown = '```infographic\ninvalid\n```'

    const { value } = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeInfographic, {
        errorFallback: () => ({
          type: 'element',
          tagName: 'div',
          properties: { className: ['error'] },
          children: [{ type: 'text', value: 'Error' }]
        })
      })
      .use(rehypeStringify)
      .process(markdown)

    expect(value).toContain('<div class="error">Error</div>')
  })
})
```

---

## 7. Performance Considerations

### 7.1 Parallel Rendering

Multiple infographics in a document should be rendered in parallel:

```typescript
const promises = instances.map(({ spec }) =>
  renderToString(spec, initOptions)
)

const results = await Promise.all(promises)
```

### 7.2 Caching (Future Enhancement)

Not implemented in v1.0.0, but consider:
- Hash-based caching of SVG output
- Cache invalidation on spec changes
- Configurable cache directory

---

## 8. Error Scenarios

### 8.1 Handled Errors

| Scenario | Behavior |
|----------|----------|
| Invalid infographic syntax | Error message, remove element or fallback |
| SSR timeout (>10s) | Timeout error, fallback or remove |
| Missing data section | SSR error, fallback or remove |
| Empty code block | Skip (no output) |

### 8.2 Error Messages

All errors include:
- File path
- Line/column number
- Error description
- Suggestion (if applicable)

---

## 9. Dependencies

### 9.1 Runtime Dependencies

```json
{
  "@antvis/infographic": "^0.2.8 || ^0.2.10",
  "@types/hast": "^3.0.0",
  "hast-util-from-html-isomorphic": "^2.0.0",
  "hast-util-to-text": "^4.0.0",
  "unist-util-visit-parents": "^6.0.0",
  "unified": "^11.0.0",
  "vfile": "^6.0.0"
}
```

### 9.2 Peer Dependencies

```json
{
  "peerDependencies": {
    "@antvis/infographic": "^0.2.8 || ^0.2.10"
  }
}
```

---

## 10. Release Notes

### Version 1.0.0

**Features**:
- ✅ Basic infographic rendering to SVG
- ✅ Astro integration via rehype plugin
- ✅ Error handling with optional fallback
- ✅ TypeScript support
- ✅ Full test coverage

**Known Limitations**:
- SVG output only (no PNG/data URI)
- No caching
- No dark mode support

**Future Enhancements**:
- Caching mechanism
- PNG output support
- Performance optimizations
- More configuration options

---

## 11. Migration Guide

N/A - Initial release

---

## 12. Troubleshooting

### Issue 1: SVG not rendering

**Symptoms**: HTML contains no SVG

**Solutions**:
1. Check infographic syntax validity
2. Verify `language-infographic` class name
3. Check build logs for errors
4. Ensure @antvis/infographic is installed

### Issue 2: Build timeout

**Symptoms**: Build hangs or times out

**Solutions**:
1. Check infographic complexity
2. Verify SSR API is responsive
3. Try simpler infographic spec

### Issue 3: Missing fonts

**Symptoms**: Fonts don't match expected

**Solutions**:
1. Check internet connection (fonts loaded from CDN)
2. Verify font URLs in SVG output
3. Consider embedding fonts locally

---

## Appendix A: Infographic Syntax Examples

### Simple List

```infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label Step 1
    - label Step 2
```

### With Icons

```infographic
infographic list-row-horizontal-icon-arrow
data
  title Project Roadmap
  items
    - label Planning
      icon mdi/clipboard
    - label Development
      icon mdi/code-tags
```

### Complex Example

```infographic
infographic timeline-vertical
data
  title Q1 2026
  items
    - time January
      label Kickoff
      desc Project start
      icon mdi/rocket
    - time February
      label Development
      desc Core features
      icon mdi/code-tags
```

---

## Appendix B: Configuration Examples

### Basic Configuration

```typescript
// astro.config.mjs
export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeInfographic()]
  }
})
```

### With Custom Width/Height

```typescript
rehypeInfographic({
  width: 800,
  height: 600
})
```

### With Error Fallback

```typescript
rehypeInfographic({
  errorFallback: (element, spec, error, file) => {
    file.message(`Infographic error: ${error}`)
    return {
      type: 'element',
      tagName: 'div',
      properties: { className: ['infographic-error'] },
      children: [{ type: 'text', value: 'Could not render infographic' }]
    }
  }
})
```

---

**Document Status**: Ready for Implementation
**Next Phase**: Implementation Plan (08-implementation-plan.md)
