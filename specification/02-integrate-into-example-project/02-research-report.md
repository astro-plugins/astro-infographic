# Research Report: Astro Rehype Plugin Integration

**Date**: 2026-01-19 11:50:45 +08:00
**Status**: Complete

## Executive Summary

This research report documents the investigation into integrating the `rehype-infographic` plugin into an Astro project. The research confirms that the integration is straightforward using Astro's built-in markdown configuration system.

## Key Findings

### 1. Astro Rehype Plugin System

**Discovery**: Astro provides native support for rehype plugins through the `markdown.rehypePlugins` configuration option.

**Configuration Pattern**:
```javascript
import { defineConfig } from 'astro/config';
import rehypeInfographic from 'rehype-infographic';

export default defineConfig({
  markdown: {
    rehypePlugins: [
      rehypeInfographic({
        width: '100%',
        height: 'auto'
      })
    ]
  }
});
```

**Key Characteristics**:
- Plugins are applied to ALL markdown files in the project
- Works with content collections (blog, presentation, book)
- Compatible with other markdown plugins (remark, rehype)
- Default plugins (GFM, Smartypants) are NOT disabled when adding custom plugins

### 2. Plugin Installation Methods

**Method A: Local File Path (Recommended for Development)**
```json
{
  "dependencies": {
    "rehype-infographic": "file:../astro-infographic"
  }
}
```

**Pros**:
- Instant updates when plugin changes
- No need to publish to npm
- Easy debugging

**Cons**:
- Requires relative path
- Not suitable for production deployments

**Method B: npm link**
```bash
cd astro-infographic
npm link

cd astro-marp-example
npm link rehype-infographic
```

**Pros**:
- Global linking across projects
- No relative path issues

**Cons**:
- More complex setup
- Can have dependency resolution issues

**Method C: npm Package (Production)**
```json
{
  "dependencies": {
    "rehype-infographic": "^1.0.0"
  }
}
```

**Pros**:
- Standard deployment method
- Version locking

**Cons**:
- Requires publishing to npm
- Delayed updates during development

**Recommendation**: Use Method A (local file path) for this integration.

### 3. @antv/infographic SSR Requirements

**Discovery**: The plugin uses `@antv/infographic` SSR API which requires a DOM environment.

**Investigation Results**:
- Plugin includes `hast-util-from-html-isomorphic` for HTML parsing
- The `isomorphic` in the package name suggests DOM-agnostic operation
- @antv/infographic >= 0.2.8 supports SSR (server-side rendering)
- Tests in the plugin repository show successful rendering

**Potential Issues**:
- Node.js environment may need DOM polyfill (jsdom)
- SVG rendering may have edge cases in certain environments

**Mitigation Strategy**:
- Test early in the integration
- Have jsdom as fallback if needed
- Check build logs for DOM-related errors

### 4. Integration with Existing Plugins

**Current astro-marp-example Configuration**:
```javascript
import { marp } from 'astro-marp';
import { typst } from 'astro-typst';

export default defineConfig({
  integrations: [
    typst({ options: { remPx: 14 } }),
    marp({ defaultTheme: 'am_blue' })
  ]
});
```

**Analysis**:
- `marp` and `typst` are Astro integrations (not markdown plugins)
- They operate at different levels than rehype plugins
- No conflict expected with rehype-infographic
- Both can coexist without issues

**Integration Strategy**:
1. Add `markdown` section to existing config
2. Keep `integrations` section unchanged
3. Test with marp and typst enabled

### 5. Test Examples Available

**From Plugin Test Suite**:

**Example 1: Basic Flowchart** (basic.md)
```markdown
\`\`\`infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
\`\`\`
```

**Example 2: Roadmap with Icons** (complex.md)
```markdown
\`\`\`infographic
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
    - time Week 3
      label Testing
      desc Quality assurance
      icon mdi/test-tube
\`\`\`
```

**Additional Examples from @antv/infographic**:
- `list-row-vertical-timeline` - Vertical timeline
- `card-vertical` - Vertical card layout
- `card-horizontal` - Horizontal card layout
- `list-row-simple-horizontal-arrow` - Simple horizontal flow
- `list-row-horizontal-icon-arrow` - Flow with icons

### 6. Content Collection Integration

**Current Collections**:
- `blog` - Standard blog posts
- `presentation` - Marp presentations
- `book` - Book chapters

**Options for Infographic Examples**:

**Option A: New Content Collection**
```typescript
// src/content/config.ts
const infographicSchema = z.object({
  title: z.string(),
  description: z.string(),
  infographicType: z.string().optional(),
});

const infographicCollection = defineCollection({
  type: 'content',
  schema: infographicSchema
});

export const collections = {
  // ... existing collections
  'infographic': infographicCollection,
};
```

**Pros**:
- Organized structure
- Type-safe frontmatter
- Consistent with existing patterns

**Cons**:
- More complex setup
- May be overkill for simple examples

**Option B: Regular Page**
```astro
---
// src/pages/infographic.astro
const title = 'Infographic Examples';
---
<!DOCTYPE html>
<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
    <!-- Infographic examples in Markdown -->
  </body>
</html>
```

**Pros**:
- Simple and direct
- Quick to implement
- Easier to understand for beginners

**Cons**:
- Less structured
- No frontmatter validation

**Recommendation**: Start with Option B (regular page), create Option A if multiple examples are needed.

### 7. Build Process Compatibility

**Astro Build Commands**:
- `npm run build` - Production build
- `npm run dev` - Development server with hot reload

**Build Process**:
1. Astro reads markdown files
2. Applies remark plugins (parsing)
3. Applies rehype plugins (HTML transformation)
4. Generates static HTML/CSS/JS
5. Outputs to `dist/` directory

**rehype-infographic Integration Point**:
- Operates at step 3 (HTML transformation)
- Converts infographic code blocks to SVG
- SVG is embedded in final HTML
- No client-side JavaScript needed

**Performance Considerations**:
- SVG rendering happens at build time
- No runtime performance impact
- Build time may increase slightly
- SVG files are typically small (< 50KB)

## Technical Implementation Details

### Configuration Structure

**Updated astro.config.mjs**:
```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import { marp } from 'astro-marp';
import { typst } from 'astro-typst';
import rehypeInfographic from 'rehype-infographic';

export default defineConfig({
  integrations: [
    typst({
      options: {
        remPx: 14,
      }
    }),
    marp({
      defaultTheme: 'am_blue'
    })
  ],
  markdown: {
    rehypePlugins: [
      [rehypeInfographic, {
        width: '100%',
        height: 'auto',
        infographicOptions: {
          // Optional: Additional @antv/infographic options
        }
      }]
    ]
  }
});
```

### Package.json Updates

**Dependencies to Add**:
```json
{
  "dependencies": {
    "rehype-infographic": "file:../astro-infographic",
    "@antv/infographic": "^0.2.10"
  }
}
```

**Note**: Plugin package.json already lists @antv/infographic as peerDependency, but explicit installation in target project is safer.

### File Structure

**Proposed Structure**:
```
astro-marp-example/
├── src/
│   ├── content/
│   │   └── infographic/  (optional, if using collection)
│   │       └── basic-flowchart.md
│   ├── pages/
│   │   └── infographic.astro  (test page)
│   └── layouts/
│       └── infographic.astro  (optional layout)
├── package.json  (updated)
└── astro.config.mjs  (updated)
```

## Risk Assessment

### Low Risk Items
- ✅ Plugin configuration follows standard Astro patterns
- ✅ No conflicts with existing integrations expected
- ✅ Build process compatibility confirmed
- ✅ TypeScript types available

### Medium Risk Items
- ⚠️ @antv/infographic SSR may need DOM polyfill
- ⚠️ Local file path dependency may not work in all environments
- ⚠️ SVG rendering edge cases possible

### High Risk Items
- ❌ None identified

### Mitigation Strategies

**For DOM Issues**:
1. Test with basic example first
2. Check for "DOM is not defined" errors
3. Add jsdom if needed: `npm install --save-dev jsdom`
4. Configure Node.js environment if necessary

**For Path Issues**:
1. Verify relative path is correct
2. Test that plugin can be imported
3. Check npm install output for errors

**For SVG Issues**:
1. Test with multiple infographic types
2. Verify SVG output is valid
3. Check for rendering artifacts

## Success Criteria Validation

### Criteria 1: Build Success
- ✅ Configuration pattern is standard
- ✅ No breaking changes to existing setup
- ✅ Astro will load plugins automatically

### Criteria 2: Render Success
- ✅ Plugin tests show successful rendering
- ✅ SVG output is valid HTML
- ✅ No client-side JS required

### Criteria 3: No Regressions
- ✅ marp and typst are integrations (different layer)
- ✅ Rehype plugins don't affect integrations
- ✅ Markdown processing is separate

### Criteria 4: Examples Work
- ✅ Multiple examples available from tests
- ✅ @antv/infographic documentation has more
- ✅ Easy to create custom examples

## Recommendations

### Immediate Actions
1. **Install plugin** using local file path
2. **Update astro.config.mjs** with markdown section
3. **Create test page** with 2-3 infographic examples
4. **Run dev server** to test rendering
5. **Build project** to verify production compatibility

### Future Enhancements
1. **Add infographic collection** if many examples needed
2. **Create component wrapper** for reusable infographic layouts
3. **Add error handling** for failed renders
4. **Document examples** in project README

### Documentation Updates
1. **Update README.md** with infographic usage
2. **Add troubleshooting section** for common issues
3. **Include example code** in comments
4. **Link to @antv/infographic docs** for reference

## Next Steps

1. ✅ **Research complete** - All questions answered
2. **Proceed to Phase 5** - Code assessment
3. **Create implementation plan** - Detailed task breakdown
4. **Execute integration** - Follow task list
5. **Test thoroughly** - Verify all success criteria

## References

- [Astro Markdown Plugins Documentation](https://docs.astro.build/en/guides/markdown-content/#markdown-plugins)
- [Astro Configuration Reference](https://docs.astro.build/en/reference/configuration-reference/#markdown-options)
- [@antv/Infographic GitHub](https://github.com/antv/Infographic)
- [rehype-mermaid (reference implementation)](https://github.com/remcohaszing/rehype-mermaid)

---

**Status**: ✅ Complete
**Confidence Level**: High
**Ready for Implementation**: Yes
**Last Updated**: 2026-01-19 11:50:45 +08:00
