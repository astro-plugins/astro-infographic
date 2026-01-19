# Implementation Plan: rehype-infographic Integration

**Version**: 1.0
**Date**: 2026-01-19 11:50:45 +08:00
**Estimated Duration**: 2.25 hours

## Phase Overview

This document breaks down the integration into discrete, executable tasks with clear acceptance criteria and validation steps.

## Task Breakdown

### Phase 8: Execution & QA (Parallel Execution)

#### Task 8.1: Install Dependencies
**Priority**: Critical
**Duration**: 15 minutes
**Responsible**: dev-executor

**Steps**:
1. Navigate to example project: `cd /home/jenningsl/development/personal/astro-marp/astro-marp-example`
2. Install rehype-infographic with local path:
   ```bash
   pnpm add rehype-infographic@file:../astro-infographic
   ```
3. Install @antv/infographic:
   ```bash
   pnpm add @antv/infographic@^0.2.10
   ```
4. Verify package.json updated correctly
5. Check node_modules for installed packages

**Acceptance Criteria**:
- [ ] package.json contains both dependencies
- [ ] pnpm-lock.yaml updated
- [ ] No errors during installation
- [ ] `ls node_modules | grep infographic` shows packages

**Validation Commands**:
```bash
cd /home/jenningsl/development/personal/astro-marp/astro-marp-example
cat package.json | grep -E "(rehype-infographic|@antv/infographic)"
ls node_modules/rehype-infographic
ls node_modules/@antv/infographic
```

**Error Handling**:
- If path error: Verify relative path is correct
- If version conflict: Check @antv/infographic version in plugin package.json
- If pnpm error: Try `pnpm install --force`

**Dependencies**: None
**Outputs**: Updated package.json, pnpm-lock.yaml

---

#### Task 8.2: Update Astro Configuration
**Priority**: Critical
**Duration**: 15 minutes
**Responsible**: dev-executor

**Steps**:
1. Backup current config:
   ```bash
   cp astro.config.mjs astro.config.mjs.backup
   ```
2. Edit astro.config.mjs:
   - Add import: `import rehypeInfographic from 'rehype-infographic';`
   - Add markdown section after integrations
   - Configure rehypePlugins array
3. Save file
4. Verify TypeScript syntax

**File**: `/home/jenningsl/development/personal/astro-marp/astro-marp-example/astro.config.mjs`

**Changes**:
```diff
 // @ts-check
 import { defineConfig } from 'astro/config';
 import { marp } from 'astro-marp';
 import { typst } from 'astro-typst';
+import rehypeInfographic from 'rehype-infographic';

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
+  markdown: {
+    rehypePlugins: [
+      [rehypeInfographic, {
+        width: '100%',
+        height: 'auto'
+      }]
+    ]
+  }
 });
```

**Acceptance Criteria**:
- [ ] Import added at top of file
- [ ] markdown section added to config
- [ ] rehypePlugins array configured
- [ ] No TypeScript errors
- [ ] File is valid JavaScript

**Validation Commands**:
```bash
cd /home/jenningsl/development/personal/astro-marp/astro-marp-example
cat astro.config.mjs | grep -A 10 "markdown:"
node --check astro.config.mjs
```

**Error Handling**:
- If import error: Verify plugin is installed
- If syntax error: Check JSON syntax in options
- If TypeScript error: Verify @ts-check is not failing

**Dependencies**: Task 8.1 (Dependencies installed)
**Outputs**: Updated astro.config.mjs

---

#### Task 8.3: Create Test Page
**Priority**: High
**Duration**: 45 minutes
**Responsible**: dev-executor

**Steps**:
1. Create directory if needed: `mkdir -p src/pages`
2. Create file: `src/pages/infographic.astro`
3. Add page content with examples
4. Save file

**File**: `/home/jenningsl/development/personal/astro-marp/astro-marp-example/src/pages/infographic.astro`

**Content**: (Using Markdown for simplicity)
```astro
---
const title = 'Infographic Examples - rehype-infographic';
const description = 'Examples of @antv/Infographic diagrams rendered with rehype-infographic plugin';
---

# {title}

{description}

## Example 1: Basic Flowchart

A simple three-step process flowchart.

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

## Example 2: Project Roadmap with Icons

A project timeline with Material Design icons and detailed descriptions.

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

## Example 3: Development Process

A five-step development workflow from design to monitoring.

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

---

## Usage

To use infographics in your Markdown files:

1. Create a code block with language `infographic`
2. Specify the infographic type (e.g., `list-row-simple-horizontal-arrow`)
3. Add the `data` section with your content
4. Use indentation to define structure

## Resources

- [@antv/Infographic Documentation](https://github.com/antvis/Infographic)
- [rehype-infographic Plugin](https://github.com/yourusername/rehype-infographic)
- [Astro Markdown Plugins](https://docs.astro.build/en/guides/markdown-content/#markdown-plugins)

---

[← Back to Home](/)
```

**Acceptance Criteria**:
- [ ] File created at correct location
- [ ] Contains 3 infographic examples
- [ ] Markdown syntax is correct
- [ ] Code blocks use `infographic` language
- [ ] Page has navigation back to home

**Validation Commands**:
```bash
cd /home/jenningsl/development/personal/astro-marp/astro-marp-example
ls -la src/pages/infographic.astro
cat src/pages/infographic.astro | grep -c "infographic"  # Should be 4 (3 examples + 1 in usage)
```

**Error Handling**:
- If directory doesn't exist: Create with `mkdir -p`
- If file exists: Overwrite after confirmation
- If syntax error: Check Markdown fence blocks

**Dependencies**: Task 8.2 (Config updated)
**Outputs**: New file src/pages/infographic.astro

---

#### Task 8.4: Update Homepage Navigation
**Priority**: Medium
**Duration**: 10 minutes
**Responsible**: dev-executor

**Steps**:
1. Edit `src/pages/index.astro`
2. Add link to infographic page
3. Save file

**File**: `/home/jenningsl/development/personal/astro-marp/astro-marp-example/src/pages/index.astro`

**Changes**:
```diff
     <div class="nav">
         <a href="/blog">View All Posts</a>
         <a href="/presentations">View All Presentations</a>
         <a href="/book">View All books</a>
+        <a href="/infographic">View Infographic Examples</a>
     </div>
```

**Acceptance Criteria**:
- [ ] Link added to navigation section
- [ ] Link points to /infographic
- [ ] Link styling matches existing links

**Validation**:
```bash
cd /home/jenningsl/development/personal/astro-marp/astro-marp-example
cat src/pages/index.astro | grep infographic
```

**Dependencies**: Task 8.3 (Test page exists)
**Outputs**: Updated src/pages/index.astro

---

#### Task 8.5: Build Testing (QA Agent)
**Priority**: Critical
**Duration**: 15 minutes
**Responsible**: qa-agent

**Steps**:
1. Start dev server:
   ```bash
   cd /home/jenningsl/development/personal/astro-marp/astro-marp-example
   pnpm run dev
   ```
2. Check console for errors
3. Verify server starts successfully
4. Wait for build to complete
5. Stop server (Ctrl+C)

**Acceptance Criteria**:
- [ ] Dev server starts without errors
- [ ] No "DOM is not defined" errors
- [ ] No module import errors
- [ ] Build completes in reasonable time (< 2 minutes)
- [ ] Server runs on port 4321 (or available port)

**Validation Commands**:
```bash
cd /home/jenningsl/development/personal/astro-marp/astro-marp-example
timeout 30 pnpm run dev || true
# Check output for errors
```

**Error Handling**:
- If "Cannot find module": Check dependencies installed
- If "DOM is not defined": May need jsdom polyfill
- If port conflict: Server will use alternative port

**Dependencies**: Tasks 8.1, 8.2, 8.3
**Outputs**: Server startup verification

---

#### Task 8.6: Functional Testing (QA Agent)
**Priority**: Critical
**Duration**: 30 minutes
**Responsible**: qa-agent

**Steps**:
1. Start dev server in background:
   ```bash
   pnpm run dev > /tmp/dev-server.log 2>&1 &
   DEV_PID=$!
   ```
2. Wait for server to start (sleep 10)
3. Test infographic page:
   ```bash
   curl -s http://localhost:4321/infographic | grep -c "<svg"
   ```
4. Test homepage:
   ```bash
   curl -s http://localhost:4321/ | grep infographic
   ```
5. Test existing pages:
   ```bash
   curl -s http://localhost:4321/blog
   curl -s http://localhost:4321/presentations
   ```
6. Kill dev server:
   ```bash
   kill $DEV_PID
   ```

**Acceptance Criteria**:
- [ ] Infographic page returns HTTP 200
- [ ] Page contains SVG elements (count > 0)
- [ ] SVGs have valid XML structure
- [ ] Homepage links to infographic page
- [ ] Existing pages still work
- [ ] No console errors

**Validation Commands**:
```bash
# Check SVG count
curl -s http://localhost:4321/infographic | grep -o "<svg" | wc -l

# Check SVG validity
curl -s http://localhost:4321/infographic | grep -A 5 "<svg"

# Check existing pages
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/blog
curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/presentations
```

**Error Handling**:
- If no SVGs found: Check plugin configuration
- If page errors: Check Markdown syntax
- If existing pages broken: Revert config changes

**Dependencies**: Task 8.5 (Server starts)
**Outputs**: Test results log

---

#### Task 8.7: Production Build Testing (QA Agent)
**Priority**: High
**Duration**: 10 minutes
**Responsible**: qa-agent

**Steps**:
1. Clean build artifacts:
   ```bash
   rm -rf dist .astro
   ```
2. Run production build:
   ```bash
   pnpm run build
   ```
3. Check output:
   ```bash
   ls -la dist/infographic/index.html
   ```
4. Verify built HTML:
   ```bash
   grep -c "<svg" dist/infographic/index.html
   ```

**Acceptance Criteria**:
- [ ] Build completes without errors
- [ ] dist/infographic/index.html exists
- [ ] Built file contains SVG elements
- [ ] Build time is reasonable (< 5 minutes)
- [ ] No build warnings related to plugin

**Validation Commands**:
```bash
cd /home/jenningsl/development/personal/astro-marp/astro-marp-example
pnpm run build
ls -la dist/
grep -c "svg" dist/infographic/index.html
```

**Error Handling**:
- If build fails: Check config syntax
- If timeout: May be SVG rendering issue
- If no SVGs: Check plugin execution

**Dependencies**: Task 8.6 (Dev tests pass)
**Outputs**: Production build in dist/

---

### Phase 9: Code Review (After Execution)

#### Task 9.1: Review Configuration Changes
**Reviewer**: code-reviewer

**Review Checklist**:
- [ ] Config follows Astro best practices
- [ ] No security issues (local path is OK for dev)
- [ ] TypeScript types are correct
- [ ] Options are appropriate (width, height)
- [ ] Comments are clear

**Focus Areas**:
- Integration correctness
- Configuration safety
- Error handling
- Documentation

---

#### Task 9.2: Review Test Page Code
**Reviewer**: code-reviewer

**Review Checklist**:
- [ ] Page structure is sound
- [ ] Markdown syntax is correct
- [ ] Examples are appropriate
- [ ] Content is clear and helpful
- [ ] Navigation works

**Focus Areas**:
- Code quality
- User experience
- Example variety
- Documentation completeness

---

#### Task 9.3: Review Integration Impact
**Reviewer**: code-reviewer

**Review Checklist**:
- [ ] No breaking changes to existing features
- [ ] Performance impact is acceptable
- [ ] Dependencies are appropriate
- [ ] Error handling is sufficient
- [ ] Testing is adequate

**Focus Areas**:
- Backward compatibility
- Performance
- Stability
- Test coverage

---

### Phase 10: Documentation Update

#### Task 10.1: Update README.md
**Priority**: Medium
**Duration**: 30 minutes
**Responsible**: docs-executor

**File**: `/home/jenningsl/development/personal/astro-marp/astro-marp-example/README.md`

**Add Section**: (Insert before "Contributing" or at end)
```markdown
## Infographic Examples

This project includes examples of [rehype-infographic](https://github.com/yourusername/rehype-infographic),
a plugin that renders [@antv/Infographic](https://github.com/antv/Infographic) diagrams in Markdown files.

### Quick Start

1. View the examples:
   \`\`\`bash
   pnpm run dev
   \`\`\`
2. Open [http://localhost:4321/infographic](http://localhost:4321/infographic)

### Usage

Create a code block with language `infographic`:

\`\`\`markdown
\`\`\`infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
\`\`\`
\`\`\`

### Configuration

The plugin is configured in `astro.config.mjs`:

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

### Supported Types

- `list-row-simple-horizontal-arrow` - Simple horizontal flow
- `list-row-horizontal-icon-arrow` - Flow with icons
- And more from [@antv/Infographic](https://github.com/antvis/Infographic)
```

**Acceptance Criteria**:
- [ ] README updated with infographic section
- [ ] Installation instructions included
- [ ] Usage example provided
- [ ] Links to relevant resources
- [ ] Formatting matches README style

---

### Phase 11: Cleanup

#### Task 11.1: Remove Temporary Files
**Priority**: Low
**Duration**: 5 minutes

**Steps**:
1. Remove backup config: `rm astro.config.mjs.backup`
2. Remove build artifacts: `rm -rf dist .astro`
3. Remove test logs: `rm -f /tmp/dev-server.log`

**Acceptance Criteria**:
- [ ] No backup files left
- [ ] No temporary build artifacts
- [ ] Clean working directory

---

### Phase 12: Commit & Push

#### Task 12.1: Create Commit
**Priority**: Critical
**Duration**: 10 minutes

**Steps**:
1. Stage changes:
   ```bash
   git add package.json pnpm-lock.yaml
   git add astro.config.mjs
   git add src/pages/infographic.astro
   git add src/pages/index.astro
   git add README.md
   ```
2. Generate commit message using skill
3. Commit with message

**Files to Commit**:
- package.json
- pnpm-lock.yaml
- astro.config.mjs
- src/pages/infographic.astro
- src/pages/index.astro
- README.md

**Acceptance Criteria**:
- [ ] All modified files staged
- [ ] Commit message is descriptive
- [ ] Commit follows project conventions
- [ ] No extra files committed

---

#### Task 12.2: Push Changes
**Priority**: High
**Duration**: 5 minutes

**Steps**:
1. Verify commit: `git log -1`
2. Push to remote: `git push`
3. Verify push: `git status`

**Acceptance Criteria**:
- [ ] Changes pushed successfully
- [ ] Remote repository updated
- [ ] Working tree is clean

---

### Phase 13: Final Verification

#### Task 13.1: Complete Verification Checklist
**Priority**: Critical
**Duration**: 15 minutes

**Final Checklist**:
- [ ] All tasks completed
- [ ] Build succeeds
- [ ] Dev server runs
- [ ] Infographic page displays SVGs
- [ ] Existing features work
- [ ] README updated
- [ ] Changes committed
- [ ] Changes pushed
- [ ] No temporary files
- [ ] Documentation complete

**Sign-Off**:
- Implementation: ✅ Complete
- Testing: ✅ Passed
- Documentation: ✅ Updated
- Git: ✅ Committed and pushed

---

## Progress Tracking

### Task Status Matrix

| Task ID | Task Name | Phase | Status | Assigned To | Duration |
|---------|-----------|-------|--------|-------------|----------|
| 8.1 | Install Dependencies | 8 | Pending | dev-executor | 15m |
| 8.2 | Update Config | 8 | Pending | dev-executor | 15m |
| 8.3 | Create Test Page | 8 | Pending | dev-executor | 45m |
| 8.4 | Update Navigation | 8 | Pending | dev-executor | 10m |
| 8.5 | Build Testing | 8 | Pending | qa-agent | 15m |
| 8.6 | Functional Testing | 8 | Pending | qa-agent | 30m |
| 8.7 | Production Build | 8 | Pending | qa-agent | 10m |
| 9.1 | Review Config | 9 | Pending | code-reviewer | - |
| 9.2 | Review Test Page | 9 | Pending | code-reviewer | - |
| 9.3 | Review Impact | 9 | Pending | code-reviewer | - |
| 10.1 | Update README | 10 | Pending | docs-executor | 30m |
| 11.1 | Cleanup | 11 | Pending | manual | 5m |
| 12.1 | Commit | 12 | Pending | manual | 10m |
| 12.2 | Push | 12 | Pending | manual | 5m |
| 13.1 | Verification | 13 | Pending | coordinator | 15m |

**Total Estimated Time**: 2.25 hours
**Critical Path**: 8.1 → 8.2 → 8.3 → 8.5 → 8.6 → 8.7

---

## Risk Mitigation

### High Risk Items
1. **DOM Environment Issues**
   - **Mitigation**: Test early with Task 8.5
   - **Fallback**: Add jsdom polyfill if needed
   - **Task**: 8.5 (Build Testing)

2. **SVG Rendering Failures**
   - **Mitigation**: Start with simple examples
   - **Fallback**: Simplify infographic specs
   - **Task**: 8.3 (Test Page - use known working examples)

### Medium Risk Items
1. **Build Time Increase**
   - **Mitigation**: Limit to 3 examples
   - **Monitoring**: Task 8.7 (measure build time)
   - **Task**: 8.7

2. **Path Resolution Issues**
   - **Mitigation**: Use correct relative path
   - **Verification**: Task 8.1 (check installation)
   - **Task**: 8.1

---

## Success Metrics

### Phase 8 (Execution)
- [ ] 100% of tasks completed
- [ ] 0 critical errors
- [ ] < 2 minor warnings

### Phase 9 (Code Review)
- [ ] 0 critical findings
- [ ] 0 high findings
- [ ] < 2 medium findings

### Phase 10-13 (Completion)
- [ ] Documentation 100% updated
- [ ] Git status clean
- [ ] All success criteria met

---

**Status**: ✅ Ready for Execution
**Last Updated**: 2026-01-19 11:50:45 +08:00
**Version**: 1.0
