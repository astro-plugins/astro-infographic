# Task List: rehype-infographic Implementation

**Project**: rehype-infographic
**Start Date**: 2026-01-18
**Target Completion**: 2026-01-18

---

## Task Tracking

### Phase 1: Project Setup (30 min)

- [ ] T1.1: Initialize npm project with `npm init -y`
- [ ] T1.2: Update package.json with project metadata
- [ ] T1.3: Create directory structure (`src/`, `test/`, `test/fixtures/`)
- [ ] T1.4: Create tsconfig.json with strict mode configuration
- [ ] T1.5: Create vite.config.ts for library build
- [ ] T1.6: Install runtime dependencies
  - [ ] @antvis/infographic@^0.2.8
  - [ ] @types/hast
  - [ ] hast-util-from-html-isomorphic
  - [ ] hast-util-to-text
  - [ ] unist-util-visit-parents
  - [ ] unified
  - [ ] vfile
- [ ] T1.7: Install dev dependencies
  - [ ] typescript
  - [ ] @types/node
  - [ ] vite
  - [ ] vitest
  - [ ] @vitest/coverage-v8
  - [ ] eslint
  - [ ] prettier
- [ ] T1.8: Create eslint.config.js
- [ ] T1.9: Create prettier.config.js
- [ ] T1.10: Create .gitignore

### Phase 2: Core Implementation (90 min)

- [ ] T2.1: Create src/types.ts
  - [ ] Export RehypeInfographicOptions interface
  - [ ] Export CodeInstance interface
  - [ ] Add JSDoc comments
- [ ] T2.2: Create src/utils.ts
  - [ ] Implement isInfographicElement() function
  - [ ] Implement extractSpec() helper
  - [ ] Add unit tests for utilities
- [ ] T2.3: Create src/renderer.ts
  - [ ] Import renderToString from @antvis/infographic/ssr
  - [ ] Create renderInfographic() wrapper
  - [ ] Add error handling
  - [ ] Add timeout handling
- [ ] T2.4: Create src/index.ts (main plugin)
  - [ ] Import all dependencies
  - [ ] Create rehypeInfographic() plugin function
  - [ ] Implement options merging with defaults
  - [ ] Implement AST traversal with visitParents
  - [ ] Collect infographic instances
  - [ ] Render all instances in parallel
  - [ ] Replace code blocks with SVG nodes
  - [ ] Export default plugin function
- [ ] T2.5: Verify TypeScript compilation
- [ ] T2.6: Run `npm run build` and verify output

### Phase 3: Testing (60 min)

- [ ] T3.1: Create vitest.config.ts
- [ ] T3.2: Add test script to package.json
- [ ] T3.3: Create test fixtures
  - [ ] test/fixtures/basic.md
  - [ ] test/fixtures/complex.md
  - [ ] test/fixtures/error.md
- [ ] T3.4: Write unit tests
  - [ ] Test isInfographicElement()
  - [ ] Test extractSpec()
  - [ ] Test error handling
- [ ] T3.5: Write integration tests
  - [ ] Test simple infographic rendering
  - [ ] Test complex infographic rendering
  - [ ] Test multiple infographics
  - [ ] Test error fallback
- [ ] T3.6: Write snapshot tests
  - [ ] Snapshot basic SVG output
  - [ ] Snapshot complex SVG output
- [ ] T3.7: Run all tests with `npm test`
- [ ] T3.8: Check coverage with `npm run test:coverage`
- [ ] T3.9: Verify >80% coverage
- [ ] T3.10: Fix any failing tests

### Phase 4: Documentation (60 min)

- [ ] T4.1: Write README.md
  - [ ] Project title and description
  - [ ] Installation instructions
  - [ ] Quick start example
  - [ ] Usage examples
  - [ ] Configuration options reference
  - [ ] API documentation
  - [ ] Troubleshooting section
  - [ ] Contributing guidelines
- [ ] T4.2: Create LICENSE file (MIT)
- [ ] T4.3: Create examples directory
  - [ ] examples/basic.md
  - [ ] examples/astro-config.mjs
- [ ] T4.4: Add badges to README
  - [ ] npm version
  - [ ] License
  - [ ] Build status (when CI added)
- [ ] T4.5: Verify all documentation links
- [ ] T4.6: Test all examples

### Phase 5: Astro Integration Testing (30 min)

- [ ] T5.1: Create test Astro project in /tmp
- [ ] T5.2: Install rehype-infographic in test project
- [ ] T5.3: Configure plugin in astro.config.mjs
- [ ] T5.4: Create test Markdown file with infographic
- [ ] T5.5: Test dev mode (`npm run dev`)
- [ ] T5.6: Verify SVG renders in browser
- [ ] T5.7: Test build mode (`npm run build`)
- [ ] T5.8: Verify SVG in built HTML
- [ ] T5.9: Document test results
- [ ] T5.10: Cleanup test project

### Phase 6: Final Verification (30 min)

- [ ] T6.1: Run `npm run lint` - should pass
- [ ] T6.2: Run `npm run build` - should succeed
- [ ] T6.3: Run `npm test` - all tests pass
- [ ] T6.4: Check coverage >80%
- [ ] T6.5: Verify all documentation complete
- [ ] T6.6: Verify package.json is complete
- [ ] T6.7: Verify dist/ output is correct
- [ ] T6.8: Create git repository
- [ ] T6.9: Commit all files
- [ ] T6.10: Tag release v1.0.0

---

## Progress Tracking

**Completed**: 0 / 71 tasks
**In Progress**: 0 tasks
**Pending**: 71 tasks
**Completion**: 0%

---

## Phase Status

- [ ] Phase 1: Project Setup (0/10)
- [ ] Phase 2: Core Implementation (0/6)
- [ ] Phase 3: Testing (0/10)
- [ ] Phase 4: Documentation (0/6)
- [ ] Phase 5: Astro Integration (0/10)
- [ ] Phase 6: Final Verification (0/10)

---

## Notes

- Mark tasks complete immediately when done
- Update this file after each task
- Commit after each phase
- Do not batch tasks

---

**Last Updated**: 2026-01-18 22:25:00 EST
