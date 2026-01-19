# Integration Specification: rehype-infographic into astro-marp-example

**Version**: 1.0
**Date**: 2026-01-19 11:50:45 +08:00
**Status**: Ready for Implementation

## 1. Overview

### 1.1 Purpose
Integrate the `rehype-infographic` plugin into the `astro-marp-example` project to demonstrate @antv/Infographic diagram rendering capabilities within Astro's markdown processing pipeline.

### 1.2 Scope
- Install and configure rehype-infographic plugin
- Add plugin to Astro's markdown configuration
- Create test page with infographic examples
- Update project documentation
- Validate integration with existing features (marp, typst)

### 1.3 Out of Scope
- Publishing plugin to npm
- Creating new infographic types
- Modifying plugin code
- Performance optimization
- Advanced error handling

## 2. Technical Approach

### 2.1 Integration Strategy

**Architecture**:
```
Markdown Files
    ↓
[remark-parse] (Astro built-in)
    ↓
[remark-plugins] (GFM, Smartypants)
    ↓
[remark-rehype] (Markdown → HTML AST)
    ↓
[rehype-plugins] ← INSERT HERE
    ↓
    ├─ [rehype-infographic] ← NEW
    └─ [other rehype plugins]
    ↓
[rehype-stringify] (HTML AST → HTML)
    ↓
Final HTML with embedded SVG
```

**Key Points**:
- Plugin processes HTML AST, not markdown directly
- Works with ALL markdown files (blog, presentation, book, pages)
- SVG is embedded in final HTML (no client-side JS)
- Build-time rendering (no runtime overhead)

### 2.2 Configuration Pattern

**astro.config.mjs**:
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
        height: 'auto'
      }]
    ]
  }
});
```

### 2.3 Installation Method

**Local Development** (file: path):
```json
{
  "dependencies": {
    "rehype-infographic": "file:../astro-infographic",
    "@antv/infographic": "^0.2.10"
  }
}
```

**Package Manager**: pnpm (based on pnpm-lock.yaml)

**Installation Commands**:
```bash
cd astro-marp-example
pnpm add rehype-infographic@file:../astro-infographic
pnpm add @antv/infographic@^0.2.10
```

## 3. Implementation Details

### 3.1 Files to Modify

#### 3.1.1 package.json
**Location**: `/home/jenningsl/development/personal/astro-marp/astro-marp-example/package.json`

**Changes**:
```json
{
  "dependencies": {
    "@antv/infographic": "^0.2.10",
    "astro": "^5.14.4",
    "astro-marp": "github:astro-marp/astro-marp",
    "astro-typst": "^0.12.1",
    "rehype-infographic": "file:../astro-infographic"
  }
}
```

**Validation**: Run `pnpm install` to verify dependencies resolve correctly

#### 3.1.2 astro.config.mjs
**Location**: `/home/jenningsl/development/personal/astro-marp/astro-marp-example/astro.config.mjs`

**Changes**: Add `markdown` section with `rehypePlugins`

**Validation**:
- Run `pnpm run dev` - should start without errors
- Check console for "DOM is not defined" errors
- Verify plugin is loaded (no import errors)

### 3.2 Files to Create

#### 3.2.1 Test Page: src/pages/infographic.astro
**Location**: `/home/jenningsl/development/personal/astro-marp/astro-marp-example/src/pages/infographic.astro`

**Purpose**: Demonstrate infographic functionality with multiple examples

**Content Structure**:
```astro
---
import Layout from '../../layouts/Layout.astro';

const title = 'Infographic Examples';
const description = 'Examples of @antv/Infographic diagrams rendered with rehype-infographic plugin';
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        /* Inline styles for simplicity */
        body {
            font-family: system-ui, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
        }
        .example {
            margin: 3rem 0;
            padding: 2rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
        }
        .example h2 {
            color: #2d3748;
            border-bottom: 2px solid #4299e1;
            padding-bottom: 0.5rem;
        }
        .infographic-code {
            background: #f7fafc;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            font-family: monospace;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <header>
        <h1>{title}</h1>
        <p>{description}</p>
        <nav>
            <a href="/">← Back to Home</a>
        </nav>
    </header>

    <main>
        <!-- Example 1: Basic Flowchart -->
        <section class="example">
            <h2>Example 1: Basic Flowchart</h2>
            <p>A simple horizontal flowchart with three steps.</p>
            <div class="infographic-code">
```infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
```
            </div>
        </section>

        <!-- Example 2: Roadmap with Icons -->
        <section class="example">
            <h2>Example 2: Project Roadmap with Icons</h2>
            <p>A project timeline with icons and detailed descriptions.</p>
            <div class="infographic-code">
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
    - time Week 3
      label Testing
      desc Quality assurance
      icon mdi/test-tube
```
            </div>
        </section>

        <!-- Example 3: Process Steps -->
        <section class="example">
            <h2>Example 3: Development Process</h2>
            <p>A five-step development workflow.</p>
            <div class="infographic-code">
```infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label Design
      desc Create mockups
    - label Develop
      desc Write code
    - label Test
      desc Run tests
    - label Deploy
      desc Ship to production
    - label Monitor
      desc Track performance
```
            </div>
        </section>
    </main>

    <footer style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e2e8f0;">
        <p>
            Powered by <a href="https://github.com/antvis/Infographic">@antv/Infographic</a>
            and <a href="https://github.com/yourusername/rehype-infographic">rehype-infographic</a>
        </p>
    </footer>
</body>
</html>
```

**Alternative**: Use Markdown with frontmatter (simpler):
```astro
---
const title = 'Infographic Examples';
---

# {title}

## Example 1: Basic Flowchart

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

[Continue with more examples...]
```

**Recommendation**: Start with Markdown version for simplicity

### 3.3 Optional: Content Collection

If multiple infographic examples are needed, create a collection:

**src/content/config.ts** - Add:
```typescript
const infographicSchema = z.object({
  title: z.string(),
  description: z.string(),
  infographicType: z.string().optional(),
  complexity: z.enum(['basic', 'intermediate', 'advanced']).optional(),
});

const infographicCollection = defineCollection({
  type: 'content',
  schema: infographicSchema
});

export const collections = {
  'presentation': presentationCollection,
  'blog': blogCollection,
  'book': bookCollection,
  'infographic': infographicCollection,  // NEW
};
```

**src/content/infographic/basic-flowchart.md**:
```yaml
---
title: "Basic Flowchart"
description: "A simple three-step process flowchart"
infographicType: "list-row-simple-horizontal-arrow"
complexity: "basic"
---

# Basic Flowchart

This example demonstrates a simple horizontal flowchart.

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

**Decision**: Start with single page, add collection if needed later

## 4. Validation Strategy

### 4.1 Build Validation

**Test 1: Dependency Resolution**
```bash
cd astro-marp-example
pnpm install
# Expected: No errors, dependencies installed
```

**Test 2: Dev Server Start**
```bash
pnpm run dev
# Expected: Server starts on http://localhost:4321
# No errors in console
```

**Test 3: Build Process**
```bash
pnpm run build
# Expected: Build completes successfully
# dist/ directory created with HTML files
```

### 4.2 Functional Validation

**Test 4: Page Rendering**
- Navigate to http://localhost:4321/infographic
- Expected: Page loads without errors
- Expected: Infographic SVGs are rendered

**Test 5: SVG Validation**
- View page source
- Expected: SVG elements present in HTML
- Expected: SVGs have valid XML structure
- Expected: No broken images or placeholders

**Test 6: Existing Features**
- Check blog pages still work
- Check presentations still work
- Check book pages still work
- Expected: No regressions

### 4.3 Browser Validation

**Test 7: Cross-Browser**
- Test in Chrome, Firefox, Safari
- Expected: SVGs render correctly in all browsers

**Test 8: Responsive Design**
- Test on mobile viewport
- Expected: SVGs scale properly (width: 100%)

### 4.4 Error Handling

**Test 9: Invalid Infographic**
```markdown
\`\`\`infographic
invalid syntax here
\`\`\`
```
- Expected: Build error or graceful fallback
- No crash or hang

## 5. Success Criteria

### 5.1 Primary Metrics (Must Pass)
1. ✅ Build completes without errors
2. ✅ Dev server starts successfully
3. ✅ Infographic code blocks render to SVG
4. ✅ Test page displays correctly in browser
5. ✅ Existing features (marp, typst) still work

### 5.2 Secondary Metrics (Should Pass)
1. ✅ SVG renders with correct dimensions
2. ✅ Multiple infographic examples work
3. ✅ No console errors in browser
4. ✅ Page source contains valid SVG markup

### 5.3 Quality Metrics (Nice to Have)
1. ✅ README updated with infographic usage
2. ✅ Code is well-documented
3. ✅ Examples are clear and reusable
4. ✅ Performance is acceptable

## 6. Rollback Plan

If integration fails:

1. **Revert astro.config.mjs** - Remove markdown section
2. **Remove dependencies** - `pnpm remove rehype-infographic @antv/infographic`
3. **Delete test page** - Remove src/pages/infographic.astro
4. **Verify restore** - Run `pnpm run dev` to confirm

**Checkpoint Strategy**:
- Commit after each successful step
- Use git stash before risky changes
- Tag commits for easy rollback

## 7. Documentation Updates

### 7.1 README.md

**Add Section**:
```markdown
## Infographic Examples

This project demonstrates the [rehype-infographic](https://github.com/yourusername/rehype-infographic) plugin, which renders [@antv/Infographic](https://github.com/antv/Infographic) diagrams in Markdown files.

### Usage

1. Install dependencies:
   \`\`\`bash
   pnpm add rehype-infographic @antv/infographic
   \`\`\`

2. Configure in `astro.config.mjs`:
   \`\`\`javascript
   import rehypeInfographic from 'rehype-infographic';

   export default defineConfig({
     markdown: {
       rehypePlugins: [[rehypeInfographic, {
         width: '100%',
         height: 'auto'
       }]]
     }
   });
   \`\`\`

3. Use in Markdown:
   \`\`\`markdown
   \`\`\`infographic
   infographic list-row-simple-horizontal-arrow
   data
     lists
       - label Step 1
         desc Start
   \`\`\`
   \`\`\`

4. View examples at [localhost:4321/infographic](http://localhost:4321/infographic)

### Supported Infographic Types

- `list-row-simple-horizontal-arrow` - Simple horizontal flow
- `list-row-horizontal-icon-arrow` - Flow with icons
- `list-row-vertical-timeline` - Vertical timeline
- And more from [@antv/Infographic](https://github.com/antv/Infographic)
```

### 7.2 Inline Documentation

**Add comments** in astro.config.mjs:
```javascript
// @ts-check
import { defineConfig } from 'astro/config';
import { marp } from 'astro-marp';
import { typst } from 'astro-typst';
import rehypeInfographic from 'rehype-infographic';

// https://astro.build/config
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
    // Add rehype plugins to process Markdown HTML output
    rehypePlugins: [
      // Render @antv/Infographic diagrams from code blocks
      // See: /src/pages/infographic for examples
      [rehypeInfographic, {
        width: '100%',   // Responsive width
        height: 'auto'   // Automatic height based on content
      }]
    ]
  }
});
```

## 8. Testing Strategy

### 8.1 Manual Testing

**Pre-Integration**:
- [ ] Verify existing build works
- [ ] Verify existing features work
- [ ] Create baseline commit

**During Integration**:
- [ ] Install dependencies
- [ ] Update config
- [ ] Create test page
- [ ] Test each step individually

**Post-Integration**:
- [ ] Full build test
- [ ] Dev server test
- [ ] Browser rendering test
- [ ] Existing features test
- [ ] Cross-browser test

### 8.2 Automated Testing (Optional)

**Playwright E2E Test** (if needed):
```typescript
import { test, expect } from '@playwright/test';

test('infographic page renders', async ({ page }) => {
  await page.goto('/infographic');
  await expect(page.locator('svg')).toHaveCount(3); // 3 examples
});

test('svg has correct attributes', async ({ page }) => {
  await page.goto('/infographic');
  const svg = page.locator('svg').first();
  await expect(svg).toHaveAttribute('width', '100%');
  await expect(svg).toHaveAttribute('height');
});
```

## 9. Performance Considerations

### 9.1 Build Time Impact

**Expected**: +5-10 seconds per 10 infographic blocks

**Mitigation**:
- Limit number of examples in test page
- Use caching if available
- Optimize infographic specifications

### 9.2 Bundle Size Impact

**Expected**: +200KB (SVG content is embedded)

**Mitigation**:
- SVG is text, not JavaScript
- No runtime overhead
- gzip compression effective

### 9.3 Runtime Performance

**Expected**: Zero impact (build-time rendering)

**Verification**:
- Check Lighthouse scores
- Verify no hydration needed
- Confirm SVG renders instantly

## 10. Future Enhancements

### 10.1 Short Term
- [ ] Add more infographic examples
- [ ] Create infographic component
- [ ] Add error handling for invalid specs
- [ ] Optimize build caching

### 10.2 Long Term
- [ ] Interactive infographics (client-side)
- [ ] Custom infographic themes
- [ ] Export to PNG/PDF
- [ ] Infographic editor UI

## 11. Dependencies

### 11.1 External
- @antv/infographic ^0.2.10
- rehype-infographic (local)
- Astro 5.14.4 (already installed)

### 11.2 Internal
- astro-infographic plugin source
- Test fixtures from plugin repository

## 12. Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Dependencies Install | 15 min | None |
| Configuration Update | 15 min | Dependencies |
| Test Page Creation | 45 min | Configuration |
| Testing & Validation | 30 min | Test Page |
| Documentation | 30 min | Testing |
| **Total** | **2.25 hours** | |

## 13. Sign-Off

**Requirements**: ✅ All FRs addressed
**Research**: ✅ All findings incorporated
**Assessment**: ✅ All risks mitigated
**Plan**: ✅ All steps defined
**Ready**: ✅ Yes - Proceed to implementation

---

**Status**: ✅ Approved for Implementation
**Last Updated**: 2026-01-19 11:50:45 +08:00
**Version**: 1.0
