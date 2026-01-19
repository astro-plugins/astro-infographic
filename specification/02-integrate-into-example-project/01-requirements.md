# Requirements: Integrate rehype-infographic into astro-marp-example

**Date**: 2026-01-19 11:50:45 +08:00
**Task Type**: Feature Integration
**Priority**: High
**Status**: Draft

## Overview

Integrate the `rehype-infographic` plugin into the `astro-marp-example` project to demonstrate its functionality and provide a working example for users.

## Current State

### Plugin (Source)
- **Location**: `/home/jenningsl/development/personal/astro-marp/astro-infographic`
- **Status**: Built and ready (dist/rehype-infographic.js exists)
- **Version**: 1.0.0
- **Dependencies**: @antv/infographic, unified, hast utilities

### Target Project
- **Location**: `/home/jenningsl/development/personal/astro-marp/astro-marp-example`
- **Type**: Astro 5.14.4 project
- **Existing Integrations**: astro-marp, astro-typst
- **Content Collections**: blog, presentation, book

## Functional Requirements

### FR1: Plugin Installation
- **Priority**: Must Have
- **Description**: Install rehype-infographic plugin and its dependencies
- **Details**:
  - Add rehype-infographic as a dependency (local path or npm)
  - Install @antv/infographic peer dependency
  - Verify package.json updates

### FR2: Astro Configuration
- **Priority**: Must Have
- **Description**: Configure rehype-infographic in astro.config.mjs
- **Details**:
  - Import the plugin
  - Add to markdown.rehypePlugins array
  - Configure width and height options
  - Ensure compatibility with existing plugins (marp, typst)

### FR3: Test Page Creation
- **Priority**: Must Have
- **Description**: Create a dedicated test page for infographic examples
- **Details**:
  - Create new page: `/src/pages/infographic` or integrate into existing blog
  - Include multiple infographic examples (simple, complex, with icons)
  - Demonstrate different infographic types from @antv/infographic
  - Provide clear documentation in Markdown

### FR4: Content Collection Integration
- **Priority**: Should Have
- **Description**: Optionally add infographic as a content collection
- **Details**:
  - Create infographic collection in src/content
  - Add schema for infographic metadata
  - Create index page for infographic examples

### FR5: Documentation
- **Priority**: Should Have
- **Description**: Document the integration in the example project
- **Details**:
  - Update README.md with infographic usage
  - Add inline comments in test files
  - Include troubleshooting section

## Non-Functional Requirements

### NFR1: Build Compatibility
- Plugin must not break existing build process
- Build should complete without errors
- No conflicts with existing rehype plugins

### NFR2: Performance
- Plugin should not significantly increase build time
- SVG rendering should complete in reasonable time

### NFR3: Type Safety
- TypeScript types should be available
- No type errors in astro.config.mjs

### NFR4: Developer Experience
- Easy to understand test examples
- Clear error messages if something goes wrong
- Minimal configuration required

## Technical Constraints

### TC1: Local Development
- Plugin is not published to npm yet
- Must use local path: `file:../astro-infographic` or similar
- Or npm link for development

### TC2: Astro Version
- Target project uses Astro 5.14.4
- Plugin must be compatible with Astro 5.x
- Markdown processing uses Astro's built-in rehype pipeline

### TC3: SSR Requirements
- @antv/infographic SSR requires DOM environment
- May need jsdom or similar polyfill for Node.js
- Must work in Astro's build environment

## Success Criteria

### Primary Success Metrics
1. **Build Success**: `npm run build` completes without errors
2. **Render Success**: Infographic code blocks render to SVG
3. **No Regressions**: Existing marp and typst integrations still work
4. **Examples Work**: At least 3 different infographic examples display correctly

### Secondary Success Metrics
1. **Documentation Complete**: README updated with usage instructions
2. **Test Coverage**: Multiple infographic types demonstrated
3. **Clean Code**: No console errors or warnings
4. **Git Clean**: All changes committed with proper messages

## Open Questions

### OQ1: Installation Method
**Question**: Should we use npm link, local file path, or publish to npm first?
**Recommendation**: Use local file path (`file:../astro-infographic`) for development
**Status**: Pending user confirmation

### OQ2: Content Collection vs Regular Page
**Question**: Should infographic examples be a separate content collection or just regular pages?
**Recommendation**: Start with regular page, consider collection if many examples
**Status**: Pending user confirmation

### OQ3: Example Selection
**Question**: Which infographic types should we demonstrate?
**Options**:
- Basic flowcharts (list-row-simple-horizontal-arrow)
- Process with icons (list-row-horizontal-icon-arrow)
- Decision trees (card-vertical)
- Comparison tables
**Recommendation**: Start with 2-3 simple examples, expand based on user feedback
**Status**: Pending user confirmation

## Dependencies

### External
- @antv/infographic ^0.2.8 (peer dependency)
- Astro 5.14.4 (already in target project)

### Internal
- rehype-infographic plugin (built and ready)

## Timeline Estimate

- **Phase 1**: Requirements & Research - 30 minutes
- **Phase 2**: Configuration & Integration - 1 hour
- **Phase 3**: Test Page Creation - 1 hour
- **Phase 4**: Testing & Validation - 30 minutes
- **Total**: ~3 hours

## Risk Assessment

### High Risk
- **DOM Environment**: @antv/infographic SSR may not work without DOM polyfill
- **Mitigation**: Test early, have jsdom fallback ready

### Medium Risk
- **Plugin Conflicts**: May conflict with existing rehype plugins
- **Mitigation**: Test with marp and typst enabled

### Low Risk
- **Build Time**: SVG rendering may be slow
- **Mitigation**: Limit number of examples, use caching

## Next Steps

1. **User Confirmation**: Confirm requirements and answer open questions
2. **Research Phase**: Investigate Astro rehype plugin patterns
3. **Implementation**: Follow phases 5-13 of workflow
4. **Validation**: Test thoroughly before completion

---

**Status**: Pending user review and confirmation
**Last Updated**: 2026-01-19 11:50:45 +08:00
