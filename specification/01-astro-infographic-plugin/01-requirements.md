# Requirements Document: Astro Infographic Plugin

**Project Type**: New Feature (Astro Plugin Development)
**Tech Stack**: TypeScript + Vite (latest version)
**Reference Pattern**: rehype-mermaid
**Target Library**: @antvis/Infographic (v0.2.8+)
**Document Created**: 2026-01-18
**Status**: Draft

---

## 1. Overview

### 1.1 Purpose
Create an Astro plugin that integrates [@antvis/Infographic](https://github.com/antvis/Infographic) into the Astro ecosystem, enabling users to embed infographic code in Markdown files and render them as SVG visualizations in Astro websites.

### 1.2 Context
- @antvis/Infographic is a framework for generating infographics from text descriptions
- Since v0.2.8, Infographic supports server-side rendering (SSR)
- The plugin should follow the architecture pattern of [rehype-mermaid](https://github.com/remcohaszing/rehype-mermaid)
- Target use case: Content authors write infographic specs in Markdown, plugin renders them to SVG at build time

---

## 2. Functional Requirements

### 2.1 Core Functionality

**FR-1: Markdown Code Block Processing**
- The plugin MUST process Markdown code blocks with language identifier `infographic`
- Example Markdown syntax:
  ````markdown
  ```infographic
  infographic list-row-horizontal-icon-arrow
  data
    title Project Roadmap
    desc Q1 2026 Milestones
    items
      - time Week 1
        label Planning
        desc Define requirements
        icon mdi/clipboard
      - time Week 2
        label Development
        desc Implement features
        icon mdi/code-tags
  ```
  ````

**FR-2: SVG Rendering**
- The plugin MUST render infographic code to SVG format
- SVG output MUST be embedded in the generated HTML
- Rendering MUST happen at build time (SSR) using Infographic's SSR capabilities

**FR-3: Astro Integration**
- The plugin MUST integrate with Astro's content processing pipeline
- The plugin MUST work as a rehype plugin
- The plugin MUST be compatible with Astro's Markdown/MDX processing

**FR-4: Error Handling**
- Invalid infographic syntax MUST produce a clear error message
- Rendering failures MUST NOT crash the entire build
- Errors MUST be reported with file location and line numbers

### 2.2 Plugin Architecture

**FR-5: Plugin Structure (Following rehype-mermaid Pattern)**
- Main plugin file: `src/index.ts` exporting the rehype plugin function
- Plugin MUST use the unified/rehype API pattern
- Plugin MUST traverse HTML AST using `unist-util-visit-parents`
- Plugin MUST identify elements with `class="language-infographic"` or `class="infographic"`

**FR-6: Rendering Pipeline**
1. Parse Markdown to HTML AST (via Astro/remark-rehype)
2. Traverse AST to find infographic code blocks
3. Extract infographic specification text from `<code>` elements
4. Call @antvis/Infographic SSR API to render SVG
5. Replace code block with rendered SVG in AST
6. Continue normal HTML generation

**FR-7: Output Options**
- Default: Inline SVG in HTML (like rehype-mermaid's `inline-svg` strategy)
- Future enhancement: Support for `<img>` with SVG data URI (like `img-svg` strategy)

### 2.3 Configuration

**FR-8: Plugin Options**
The plugin SHOULD support configuration options:

```typescript
interface RehypeInfographicOptions {
  /**
   * CSS class name to identify infographic code blocks
   * @default 'language-infographic'
   */
  className?: string

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
   * Custom theme configuration for Infographic
   */
  theme?: Record<string, unknown>

  /**
   * Error fallback handler
   * @param element - The hast element that failed to render
   * @param spec - The infographic specification
   * @param error - The error that occurred
   * @param file - The vfile being processed
   * @returns Replacement node or null/undefined to remove
   */
  errorFallback?: (
    element: Element,
    spec: string,
    error: unknown,
    file: VFile
  ) => ElementContent | null | undefined
}
```

---

## 3. Non-Functional Requirements

### 3.1 Performance

**NFR-1: Build Performance**
- Rendering MUST NOT significantly slow down Astro builds
- Plugin SHOULD cache rendered output when possible
- Infographic rendering SHOULD happen in parallel for multiple diagrams

**NFR-2: Bundle Size**
- Plugin dependencies MUST be minimal
- @antvis/Infographic MUST be a peer dependency (user installs it)
- Plugin SHOULD tree-shake unused Infographic features

### 3.2 Compatibility

**NFR-3: Astro Version Support**
- Plugin MUST support Astro v4.x and later
- Plugin MUST work with both `.md` and `.mdx` files
- Plugin MUST be compatible with Astro's SSG and SSR modes

**NFR-4: Node.js Version**
- Plugin MUST support Node.js 18.x and later (Astro's minimum)

**NFR-5: TypeScript**
- Plugin MUST be written in TypeScript
- Plugin MUST export full type definitions
- Plugin MUST pass strict TypeScript checks

### 3.3 Quality

**NFR-6: Code Quality**
- Code MUST follow TypeScript best practices
- Code MUST be linted (ESLint + Prettier)
- Code MUST have unit tests (vitest or similar)
- Test coverage SHOULD be > 80%

**NFR-7: Documentation**
- README MUST include installation instructions
- README MUST include usage examples
- README MUST document all configuration options
- Code MUST be well-commented for complex logic

---

## 4. Technical Requirements

### 4.1 Dependencies

**TR-1: Runtime Dependencies**
```json
{
  "dependencies": {
    "@antvis/infographic": "^0.2.8 || ^0.2.10",
    "@types/hast": "^3.0.0",
    "hast-util-from-html-isomorphic": "^2.0.0",
    "hast-util-to-text": "^4.0.0",
    "unist-util-visit-parents": "^6.0.0",
    "unified": "^11.0.0",
    "vfile": "^6.0.0"
  }
}
```

**TR-2: Peer Dependencies**
```json
{
  "peerDependencies": {
    "@antvis/infographic": "^0.2.8 || ^0.2.10"
  },
  "peerDependenciesMeta": {
    "@antvis/infographic": {
      "optional": false
    }
  }
}
```

**TR-3: Dev Dependencies**
```json
{
  "devDependencies": {
    "@astrojs/ts-plugin": "^1.8.0",
    "astro": "^4.15.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0",
    "@types/node": "^22.0.0"
  }
}
```

### 4.2 Build Configuration

**TR-4: TypeScript Configuration**
- Must use `strict: true`
- Must target `ES2022` or later
- Must use `ESNext` module resolution
- Must emit ESM output (`"type": "module"`)

**TR-5: Vite Configuration**
- Must build library mode output
- Must output to `dist/` directory
- Must generate declaration files (`.d.ts`)
- Entry point: `src/index.ts`

### 4.3 Project Structure

```
rehype-infographic/
├── src/
│   ├── index.ts              # Main plugin export
│   ├── renderer.ts           # Infographic SSR wrapper
│   ├── utils.ts              # Helper functions
│   └── types.ts              # TypeScript types
├── test/
│   ├── fixtures/             # Test Markdown files
│   └── index.test.ts         # Unit tests
├── dist/                     # Build output (gitignored)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── README.md
└── LICENSE
```

---

## 5. Integration Requirements

### 5.1 Usage in Astro Projects

**IR-1: Installation**
```bash
npx astro add rehype-infographic
# OR
npm install rehype-infographic @antvis/infographic
```

**IR-2: Configuration**
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

**IR-3: Markdown Usage**
```markdown
---
title: My Blog Post
---

# Project Roadmap

```infographic
infographic list-row-horizontal-icon-arrow
data
  title Q1 2026
  items
    - label Planning
      icon mdi/clipboard
```
```

---

## 6. Assumptions

**AS-1**: @antvis/Infographic v0.2.8+ provides a stable SSR API
**AS-2**: The SSR API accepts an infographic specification string and returns an SVG string
**AS-3**: No browser runtime is required for SSR rendering (Node.js compatible)
**AS-4**: Infographic's SVG output is self-contained (no external CSS/JS dependencies)
**AS-5**: Astro's rehype plugin API is stable and matches unified/rehype conventions

---

## 7. Open Questions

**OQ-1**: What is the exact API for @antvis/Infographic's SSR functionality?
- **Action**: Research Infographic documentation and source code
- **Priority**: HIGH (blocks implementation)

**OQ-2**: Does Infographic require any polyfills for Node.js SSR?
- **Action**: Test SSR in Node.js environment
- **Priority**: MEDIUM

**OQ-3**: Are there any CSS dependencies for rendered SVGs?
- **Action**: Inspect Infographic SVG output
- **Priority**: MEDIUM

**OQ-4**: Should we support additional output strategies (PNG, data URI)?
- **Action**: Defer to v2.0.0, start with inline SVG only
- **Priority**: LOW

---

## 8. Acceptance Criteria

The plugin is considered complete when:

**AC-1**: Plugin can be installed via npm in an Astro project
**AC-2**: Plugin processes Markdown files with `infographic` code blocks
**AC-3**: Plugin renders SVG output from Infographic specifications
**AC-4**: Plugin works in Astro's dev mode (`astro dev`)
**AC-5**: Plugin works in Astro's build mode (`astro build`)
**AC-6**: Plugin produces clear error messages for invalid syntax
**AC-7**: Plugin has > 80% test coverage
**AC-8**: README documents installation, usage, and configuration
**AC-9**: Plugin is type-safe (TypeScript with no `any` types)
**AC-10**: Plugin follows the rehype-mermaid architecture pattern

---

## 9. Success Metrics

- Plugin can be used in a new Astro project within 5 minutes
- Rendering completes in < 100ms per infographic code block
- Zero runtime errors in Astro dev and build modes
- All test fixtures pass
- TypeScript emits no type errors
- ESLint produces zero warnings

---

## 10. Risks and Mitigations

**RISK-1**: Infographic SSR API may be unstable or poorly documented
- **Mitigation**: Study Infographic source code; create abstraction layer
- **Severity**: HIGH

**RISK-2**: Infographic may have browser-specific dependencies
- **Mitigation**: Test SSR early; investigate JSDOM or similar if needed
- **Severity**: MEDIUM

**RISK-3**: Performance issues with large numbers of infographics
- **Mitigation**: Implement caching; parallel rendering
- **Severity**: LOW

**RISK-4**: Breaking changes in future Infographic versions
- **Mitigation**: Pin to specific version range; document compatibility
- **Severity**: LOW

---

## 11. Out of Scope

The following features are explicitly OUT OF scope for v1.0.0:

- Client-side rendering (CSR)
- Interactive infographics
- Custom icon injection
- Theme customization beyond basic options
- PNG/JPEG output formats
- Lazy loading of infographics
- Infographic editor/previewer

These may be considered for future releases based on user feedback.

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-01-18 | Coordinator | Initial requirements draft |

---

## Next Steps

1. **Research Phase**: Investigate @antvis/Infographic SSR API details
2. **Architecture Design**: Create detailed technical design document
3. **Implementation**: Develop plugin following rehype-mermaid pattern
4. **Testing**: Create comprehensive test suite
5. **Documentation**: Write README and usage examples
6. **Release**: Publish to npm as `rehype-infographic`
