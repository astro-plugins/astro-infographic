# Research Report: Astro Infographic Plugin

**Project**: rehype-infographic
**Date**: 2026-01-18
**Status**: Complete

---

## Executive Summary

This research confirms that @antvis/Infographic v0.2.8+ provides a stable Server-Side Rendering (SSR) API through the `/ssr` export path. The SSR implementation uses the `linkedom` library to create a DOM shim in Node.js, enabling SVG rendering without a browser environment.

**Key Finding**: The `renderToString()` function is the primary SSR API and is fully compatible with Node.js environments, making it ideal for an Astro rehype plugin.

---

## 1. @antvis/Infographic SSR API

### 1.1 Module Structure

The Infographic package exports an SSR module:

```typescript
// Package exports
{
  "./ssr": {
    "types": "./lib/ssr/index.d.ts",
    "require": "./lib/ssr/index.js",
    "import": "./esm/ssr/index.js"
  }
}
```

**Import path**: `@antv/infographic/ssr`

### 1.2 Primary SSR Function

```typescript
export async function renderToString(
  options: string | Partial<InfographicOptions>,
  init?: Partial<InfographicOptions>,
): Promise<string>
```

**Parameters**:
- `options`: Infographic specification string or configuration object
- `init`: Optional initialization options for the Infographic instance

**Returns**: Promise resolving to SVG outerHTML string

**Example Usage**:
```typescript
import { renderToString } from '@antv/infographic/ssr';

const svg = await renderToString(`
  infographic list-row-simple-horizontal-arrow
  data
    lists
      - label Step 1
        desc Start
`);
// Returns: <svg>...</svg>
```

### 1.3 SSR Implementation Details

#### DOM Environment Setup
- Uses `linkedom` library for Node.js DOM implementation
- Creates a virtual DOM with:
  - `window`, `document`, `DOMParser` globals
  - Full HTMLElement and SVG element classes
  - `requestAnimationFrame`/`cancelAnimationFrame` polyfills
  - Document.fonts API shim

#### Rendering Pipeline
1. Setup virtual DOM environment
2. Create Infographic instance with container
3. Register 'loaded' event listener
4. Render infographic specification
5. Export loaded node to SVG (with embedded resources)
6. Inject XML stylesheets for fonts
7. Cleanup Infographic instance
8. Return SVG string

#### Timeout Protection
- 10-second timeout for rendering
- Prevents hanging builds
- Error handling with cleanup

### 1.4 Font Handling

The SSR implementation automatically:
- Extracts font-family declarations from SVG
- Decodes font families
- Generates `@font-face` URLs
- Injects XML stylesheet declarations

**Example Output**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700" type="text/css"?>
<svg font-family="Roboto">...</svg>
```

---

## 2. Reference Implementation: rehype-mermaid

### 2.1 Architecture Pattern

The rehype-mermaid plugin follows this architecture:

```
Markdown → remark-parse → remark-rehype → rehype-mermaid → rehype-stringify → HTML
                                    ↓
                              Process AST
                                    ↓
                            Find <code class="language-mermaid">
                                    ↓
                            Extract diagram text
                                    ↓
                            Call mermaid-isomorphic
                                    ↓
                            Replace with rendered output
```

### 2.2 Core Components

**Main Plugin** (`rehype-mermaid.ts`):
- Uses `unified` plugin API
- Traverses AST with `unist-util-visit-parents`
- Identifies elements by className: `language-mermaid` or `mermaid`
- Validates rendering strategy
- Creates renderer (cached per transform)
- Processes all instances in parallel

**Renderer Creation** (`mermaid-isomorphic` package):
- Wraps browser-based Mermaid.js
- Provides Node.js compatibility
- Supports multiple output strategies:
  - `inline-svg`: Direct SVG embedding
  - `img-svg`: `<img>` with data URI
  - `img-png`: `<img>` with PNG data URI
  - `pre-mermaid`: Raw code block for client rendering

**Error Handling**:
- Optional `errorFallback` function
- VFile message integration
- Fatal error reporting
- Graceful degradation

### 2.3 Key Functions

```typescript
// Element identification
function isMermaidElement(element: Element, strategy: Strategy): boolean

// Diagram text extraction
const diagram = toText(node, { whitespace: 'pre' })

// Render to SVG
const { svg } = await renderDiagrams([diagram])

// HTML to AST conversion
const replacement = fromHtmlIsomorphic(svg, { fragment: true })
```

### 2.4 Configuration Options

```typescript
interface RehypeMermaidOptions {
  strategy?: 'img-png' | 'img-svg' | 'inline-svg' | 'pre-mermaid'
  dark?: MermaidConfig | true
  colorScheme?: 'light' | 'dark'
  errorFallback?: (element, diagram, error, file) => Element
  // ... plus CreateMermaidRendererOptions
}
```

---

## 3. Technical Feasibility Analysis

### 3.1 Compatibility Assessment

| Requirement | rehype-mermaid | @antvis/Infographic | Compatibility |
|------------|----------------|---------------------|---------------|
| SSR Support | ✅ (via mermaid-isomorphic) | ✅ (via /ssr export) | ✅ Full |
| SVG Output | ✅ | ✅ | ✅ Full |
| Node.js Compatible | ✅ | ✅ | ✅ Full |
| TypeScript Types | ✅ | ✅ | ✅ Full |
| Error Handling | ✅ | ✅ | ✅ Full |
| Parallel Rendering | ✅ | ⚠️ (sequential) | ⚠️ Partial |
| Output Strategies | ✅ (4 strategies) | ❌ (SVG only) | ⚠️ Limited |

### 3.2 Key Differences

**Mermaid**:
- Requires browser or headless browser for rendering
- Supports PNG output via screenshot
- Has dark mode support via theme switching
- Multiple output strategies

**Infographic**:
- Pure Node.js rendering (no browser needed)
- SVG-only output
- Built-in font embedding
- XML stylesheet injection

### 3.3 Implementation Strategy

Based on the research, the recommended approach is:

1. **Use `inline-svg` strategy only** (like rehype-mermaid's default)
2. **Single output format** simplifies the plugin
3. **Leverage `renderToString()`** directly
4. **Follow rehype-mermaid's AST traversal pattern**
5. **Reuse error handling pattern**

---

## 4. Dependencies Analysis

### 4.1 Required Dependencies

```json
{
  "dependencies": {
    "@antvis/infographic": "^0.2.8",
    "@types/hast": "^3.0.0",
    "hast-util-from-html-isomorphic": "^2.0.0",
    "hast-util-to-text": "^4.0.0",
    "unist-util-visit-parents": "^6.0.0",
    "unified": "^11.0.0",
    "vfile": "^6.0.0"
  }
}
```

**Justification**:
- `@antvis/infographic`: Core rendering engine
- `@types/hast`: TypeScript types for HTML AST
- `hast-util-from-html-isomorphic`: Convert SVG string to AST node
- `hast-util-to-text`: Extract infographic spec from code blocks
- `unist-util-visit-parents`: Traverse HTML AST
- `unified`: Rehype plugin API
- `vfile`: File tracking and error reporting

### 4.2 Peer Dependencies

```json
{
  "peerDependencies": {
    "@antvis/infographic": "^0.2.8 || ^0.2.10"
  }
}
```

**Rationale**: Users install Infographic themselves, allowing version flexibility.

### 4.3 NOT Required

- ❌ `mermaid-isomorphic`: Mermaid-specific
- ❌ `mini-svg-data-uri`: Not using data URI strategy
- ❌ `space-separated-tokens`: Not needed (no complex class parsing)
- ❌ Playwright/Puppeteer: Infographic doesn't need browser

---

## 5. Implementation Plan

### 5.1 File Structure

```
rehype-infographic/
├── src/
│   ├── index.ts              # Main plugin (following rehype-mermaid)
│   ├── renderer.ts           # Infographic SSR wrapper
│   └── types.ts              # TypeScript interfaces
├── test/
│   ├── fixtures/             # Test cases
│   │   ├── basic.md
│   │   ├── complex.md
│   │   └── error.md
│   └── index.test.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 5.2 Core Implementation Flow

```typescript
// 1. Import SSR function
import { renderToString } from '@antvis/infographic/ssr'

// 2. Create unified plugin
const rehypeInfographic: Plugin<[RehypeInfographicOptions?], Root> = (options) => {
  return async (ast, file) => {
    const instances: CodeInstance[] = []

    // 3. Traverse AST to find infographic blocks
    visitParents(ast, 'element', (node, ancestors) => {
      if (isInfographicElement(node)) {
        instances.push({
          spec: toText(node, { whitespace: 'pre' }),
          ancestors
        })
      }
    })

    // 4. Render all instances
    const results = await Promise.all(
      instances.map(async ({ spec }) => {
        try {
          const svg = await renderToString(spec, options)
          return { success: true, svg }
        } catch (error) {
          return { success: false, error }
        }
      })
    )

    // 5. Replace code blocks with SVG
    results.forEach((result, index) => {
      const { ancestors } = instances[index]
      const node = ancestors.at(-1)!
      const parent = ancestors.at(-2)!

      if (result.success) {
        const replacement = fromHtmlIsomorphic(result.svg, { fragment: true })
        parent.children[parent.children.indexOf(node)] = replacement.children[0]
      } else if (options?.errorFallback) {
        const fallback = options.errorFallback(node, spec, result.error, file)
        if (fallback) {
          parent.children[parent.children.indexOf(node)] = fallback
        }
      }
    })
  }
}
```

### 5.3 Element Identification

```typescript
function isInfographicElement(element: Element): boolean {
  // Check for <code class="language-infographic">
  if (element.tagName === 'code') {
    const className = element.properties?.className
    return Array.isArray(className) && className.includes('language-infographic')
  }

  // Check for <pre class="infographic">
  if (element.tagName === 'pre') {
    const className = element.properties?.className
    return Array.isArray(className) && className.includes('infographic')
  }

  return false
}
```

---

## 6. Testing Strategy

### 6.1 Test Cases

**Basic Rendering**:
- Simple list infographic
- Verify SVG output
- Check class names preserved

**Error Handling**:
- Invalid infographic syntax
- Missing data sections
- Timeout scenarios

**Edge Cases**:
- Empty code blocks
- Whitespace handling
- Multiple infographics in one document
- Nested code blocks

### 6.2 Test Framework

Use Vitest (already in Infographic's devDependencies):

```typescript
import { describe, it, expect } from 'vitest'
import { rehype } from 'rehype'
import rehypeInfographic from '../src/index'

describe('rehype-infographic', () => {
  it('should render infographic to SVG', async () => {
    const markdown = `
\`\`\`infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label Test
\`\`\`
    `

    const { value } = await rehype()
      .use(rehypeInfographic)
      .process(markdown)

    expect(value).toContain('<svg')
  })
})
```

---

## 7. Documentation Requirements

### 7.1 README Sections

1. **Installation**: npm install command
2. **Quick Start**: Minimal configuration example
3. **Usage**: Markdown syntax examples
4. **Configuration**: All options documented
5. **Astro Integration**: astro.config.mjs example
6. **Troubleshooting**: Common issues

### 7.2 API Documentation

```typescript
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
   * Custom Infographic initialization options
   */
  infographicOptions?: Partial<InfographicOptions>

  /**
   * Error fallback handler
   */
  errorFallback?: ErrorFallbackHandler
}
```

---

## 8. Risks and Mitigations

### 8.1 Identified Risks

**Risk 1: SSR Timeout**
- **Impact**: Build hangs
- **Probability**: Low (10s timeout built-in)
- **Mitigation**: Document timeout; provide config option

**Risk 2: Font Loading**
- **Impact**: Missing fonts in SVG
- **Probability**: Low (auto-injection)
- **Mitigation**: Test font embedding; document requirements

**Risk 3: Large SVG Output**
- **Impact**: Large HTML files
- **Probability**: Medium
- **Mitigation**: Document best practices; consider compression

**Risk 4: Breaking Changes in Infographic**
- **Impact**: Plugin breaks
- **Probability**: Low (stable API)
- **Mitigation**: Pin version range; monitor releases

### 8.2 Contingency Plans

If `renderToString()` has issues:
1. Create minimal DOM environment manually
2. Use Infographic class directly with linkedom
3. Report issue to Infographic team

---

## 9. Open Questions Resolved

**OQ-1**: What is the exact API for @antvis/Infographic's SSR functionality?
- ✅ **Resolved**: `renderToString(spec: string, init?: Partial<InfographicOptions>): Promise<string>`
- Import from: `@antv/infographic/ssr`

**OQ-2**: Does Infographic require any polyfills for Node.js SSR?
- ✅ **Resolved**: No, uses `linkedom` internally for DOM shim

**OQ-3**: Are there any CSS dependencies for rendered SVGs?
- ✅ **Resolved**: CSS is embedded; fonts are auto-injected as XML stylesheets

**OQ-4**: Should we support additional output strategies?
- ✅ **Resolved**: No, SVG-only for v1.0.0 (simpler, faster)

---

## 10. Recommendations

### 10.1 Implementation Priorities

1. **P0 (Must Have)**:
   - Basic plugin with `renderToString()`
   - Element identification
   - SVG replacement
   - Error handling

2. **P1 (Should Have)**:
   - Comprehensive tests
   - Full documentation
   - Astro integration examples

3. **P2 (Nice to Have)**:
   - Custom width/height options
   - Caching mechanism
   - Performance optimizations

### 10.2 Success Criteria

- ✅ Renders simple infographic to SVG
- ✅ Handles errors gracefully
- ✅ Works in Astro dev mode
- ✅ Works in Astro build mode
- ✅ Has > 80% test coverage
- ✅ Fully documented

---

## 11. Next Steps

1. ✅ Research complete
2. ⏭️ Proceed to Code Assessment (Phase 5)
3. ⏭️ Create Architecture Design (Phase 5.3)
4. ⏭️ Write Specification (Phase 6)
5. ⏭️ Implement Plugin (Phase 8)
6. ⏭️ Test and Document (Phase 8-10)

---

## Conclusion

The research confirms that building a rehype-infographic plugin following the rehype-mermaid pattern is **technically feasible and straightforward**. The @antvis/Infographic SSR API is stable, well-designed, and requires no browser dependencies.

**Estimated Implementation Time**: 4-6 hours for MVP
**Risk Level**: Low
**Confidence Level**: High

The project can proceed to the Code Assessment and Architecture Design phases with confidence.
