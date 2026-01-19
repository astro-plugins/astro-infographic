# Implementation Plan: rehype-infographic

**Version**: 1.0.0
**Date**: 2026-01-18
**Status**: Ready for Execution

---

## 1. Overview

This document outlines the step-by-step implementation plan for the rehype-infographic plugin, following the technical specification and research findings.

**Estimated Total Time**: 4-6 hours
**Risk Level**: Low
**Complexity**: Medium

---

## 2. Implementation Phases

### Phase 1: Project Setup (30 minutes)

**Objective**: Initialize project structure and dependencies

**Tasks**:
1. Initialize npm project
2. Create directory structure
3. Configure TypeScript
4. Configure Vite for library build
5. Install dependencies
6. Set up ESLint and Prettier
7. Create .gitignore

**Deliverables**:
- package.json
- tsconfig.json
- vite.config.ts
- eslint.config.js
- prettier.config.js
- .gitignore
- src/ directory

**Success Criteria**:
- ✅ `npm run build` succeeds
- ✅ TypeScript compiles without errors
- ✅ ESLint passes

---

### Phase 2: Core Plugin Implementation (90 minutes)

**Objective**: Implement main rehype plugin function

**Tasks**:
1. Create `src/types.ts` - TypeScript interfaces
2. Create `src/utils.ts` - Helper functions
3. Create `src/renderer.ts` - SSR wrapper
4. Create `src/index.ts` - Main plugin
5. Implement element identification
6. Implement text extraction
7. Implement SVG rendering
8. Implement AST replacement
9. Implement error handling

**Deliverables**:
- src/types.ts
- src/utils.ts
- src/renderer.ts
- src/index.ts

**Success Criteria**:
- ✅ Plugin exports correctly
- ✅ TypeScript types are valid
- ✅ No compilation errors

---

### Phase 3: Testing (60 minutes)

**Objective**: Create comprehensive test suite

**Tasks**:
1. Set up Vitest configuration
2. Create test fixtures
3. Write unit tests
4. Write integration tests
5. Write snapshot tests
6. Write error case tests
7. Achieve >80% coverage

**Deliverables**:
- vitest.config.ts
- test/fixtures/basic.md
- test/fixtures/complex.md
- test/fixtures/error.md
- test/index.test.ts

**Success Criteria**:
- ✅ All tests pass
- ✅ >80% code coverage
- ✅ No test timeouts

---

### Phase 4: Documentation (60 minutes)

**Objective**: Write user-facing documentation

**Tasks**:
1. Write README.md
2. Document installation
3. Document usage
4. Document configuration options
5. Create examples
6. Write troubleshooting guide
7. Add LICENSE (MIT)

**Deliverables**:
- README.md
- LICENSE
- examples/basic.md

**Success Criteria**:
- ✅ README is clear and complete
- ✅ Examples work correctly
- ✅ All options documented

---

### Phase 5: Astro Integration Testing (30 minutes)

**Objective**: Verify plugin works with Astro

**Tasks**:
1. Create test Astro project
2. Configure plugin in astro.config.mjs
3. Create test Markdown file
4. Run astro dev
5. Run astro build
6. Verify SVG output

**Deliverables**:
- Test Astro project (temporary)
- Screenshot of rendered infographic

**Success Criteria**:
- ✅ Plugin works in dev mode
- ✅ Plugin works in build mode
- ✅ SVG renders correctly

---

## 3. Detailed Task List

### 3.1 Project Setup Tasks

```markdown
- [ ] T1: Initialize npm project
  - npm init -y
  - Update package.json with metadata

- [ ] T2: Create directory structure
  - mkdir -p src test test/fixtures

- [ ] T3: Configure TypeScript
  - Create tsconfig.json with strict mode
  - Set target to ES2022
  - Configure module resolution

- [ ] T4: Configure Vite
  - Create vite.config.ts
  - Set library mode
  - Configure entry point

- [ ] T5: Install dependencies
  - npm install @antvis/infographic@^0.2.8
  - npm install @types/hast hast-util-from-html-isomorphic
  - npm install hast-util-to-text unist-util-visit-parents
  - npm install unified vfile

- [ ] T6: Install dev dependencies
  - npm install -D typescript @types/node
  - npm install -D vite vitest @vitest/coverage-v8
  - npm install -D eslint prettier

- [ ] T7: Configure ESLint
  - Create eslint.config.js
  - Set up TypeScript rules

- [ ] T8: Configure Prettier
  - Create prettier.config.js
  - Set up formatting rules

- [ ] T9: Create .gitignore
  - Add node_modules/
  - Add dist/
  - Add *.log
```

### 3.2 Core Implementation Tasks

```markdown
- [ ] T10: Create src/types.ts
  - Export RehypeInfographicOptions interface
  - Export CodeInstance interface
  - Export types from dependencies

- [ ] T11: Create src/utils.ts
  - Implement isInfographicElement()
  - Implement extractSpec()
  - Add JSDoc comments

- [ ] T12: Create src/renderer.ts
  - Import renderToString from @antvis/infographic/ssr
  - Create renderInfographic() wrapper
  - Handle timeout errors
  - Add error messages

- [ ] T13: Create src/index.ts
  - Import dependencies
  - Create rehypeInfographic() plugin function
  - Implement AST traversal
  - Collect infographic instances
  - Render all instances in parallel
  - Replace code blocks with SVG
  - Export default function

- [ ] T14: Add error handling
  - Implement try-catch around renderToString
  - Call errorFallback if provided
  - Report errors with VFile
  - Handle graceful degradation

- [ ] T15: Add TypeScript types
  - Ensure all functions are typed
  - No 'any' types
  - Proper generic usage

- [ ] T16: Verify compilation
  - Run npm run build
  - Check dist/ output
  - Verify .d.ts files generated
```

### 3.3 Testing Tasks

```markdown
- [ ] T17: Set up Vitest
  - Create vitest.config.ts
  - Add test script to package.json

- [ ] T18: Create test fixtures
  - test/fixtures/basic.md - Simple infographic
  - test/fixtures/complex.md - Complex infographic
  - test/fixtures/error.md - Invalid syntax

- [ ] T19: Write unit tests
  - Test isInfographicElement()
  - Test extractSpec()
  - Test error handling

- [ ] T20: Write integration tests
  - Test simple rendering
  - Test complex rendering
  - Test multiple infographics
  - Test error cases

- [ ] T21: Write snapshot tests
  - Snapshot basic SVG output
  - Snapshot complex SVG output

- [ ] T22: Run tests
  - npm test
  - Verify all pass
  - Check coverage report

- [ ] T23: Achieve >80% coverage
  - Add tests for uncovered lines
  - Verify coverage threshold
```

### 3.4 Documentation Tasks

```markdown
- [ ] T24: Write README.md
  - Project description
  - Installation instructions
  - Quick start guide
  - Usage examples
  - Configuration options
  - API documentation
  - Troubleshooting
  - Contributing guidelines

- [ ] T25: Create LICENSE
  - Use MIT license
  - Add copyright notice

- [ ] T26: Create examples
  - examples/basic.md
  - examples/complex.md
  - examples/astro-config.mjs

- [ ] T27: Verify documentation
  - All links work
  - Examples are accurate
  - No typos or errors
```

### 3.5 Integration Testing Tasks

```markdown
- [ ] T28: Create test Astro project
  - mkdir /tmp/test-astro
  - npm create astro@latest
  - Install rehype-infographic

- [ ] T29: Configure plugin
  - Update astro.config.mjs
  - Add to markdown.rehypePlugins

- [ ] T30: Create test content
  - Add .md file with infographic
  - Test various infographic types

- [ ] T31: Test dev mode
  - npm run dev
  - Visit page
  - Verify SVG renders
  - Screenshot result

- [ ] T32: Test build mode
  - npm run build
  - Check dist/ output
  - Verify SVG in HTML

- [ ] T33: Cleanup
  - Remove test project
  - Document results
```

---

## 4. Configuration Files

### 4.1 package.json Template

```json
{
  "name": "rehype-infographic",
  "version": "1.0.0",
  "description": "A rehype plugin to render @antvis/Infographic diagrams",
  "type": "module",
  "main": "./dist/rehype-infographic.js",
  "module": "./dist/rehype-infographic.js",
  "types": "./dist/rehype-infographic.d.ts",
  "exports": {
    ".": {
      "types": "./dist/rehype-infographic.d.ts",
      "import": "./dist/rehype-infographic.js"
    }
  },
  "files": [
    "dist",
    "src",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc && vite build",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint .",
    "format": "prettier --write .",
    "prepublishOnly": "npm run build"
  },
  "keywords": [
    "rehype",
    "rehype-plugin",
    "unified",
    "infographic",
    "antv",
    "visualization",
    "astro"
  ],
  "dependencies": {
    "@antvis/infographic": "^0.2.8 || ^0.2.10",
    "@types/hast": "^3.0.0",
    "hast-util-from-html-isomorphic": "^2.0.0",
    "hast-util-to-text": "^4.0.0",
    "unist-util-visit-parents": "^6.0.0",
    "unified": "^11.0.0",
    "vfile": "^6.0.0"
  },
  "peerDependencies": {
    "@antvis/infographic": "^0.2.8 || ^0.2.10"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "typescript": "^5.6.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.0",
    "@vitest/coverage-v8": "^2.1.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0"
  },
  "author": "",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": ""
  }
}
```

### 4.2 tsconfig.json Template

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

### 4.3 vite.config.ts Template

```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'rehypeInfographic',
      fileName: 'rehype-infographic',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        '@antvis/infographic',
        '@antvis/infographic/ssr',
        '@types/hast',
        'hast-util-from-html-isomorphic',
        'hast-util-to-text',
        'unist-util-visit-parents',
        'unified',
        'vfile'
      ]
    }
  }
})
```

---

## 5. Risk Mitigation

### 5.1 Known Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| SSR API changes | High | Low | Pin version range |
| Performance issues | Medium | Low | Parallel rendering |
| SVG size | Low | Medium | Document best practices |
| Font loading | Low | Low | Auto-injection works |

### 5.2 Contingency Plans

**If SSR fails**:
1. Check @antvis/infographic version
2. Verify SSR export path
3. Report issue to Infographic team
4. Consider alternative DOM setup

**If tests fail**:
1. Check infographic syntax
2. Verify SSR output
3. Add debugging logs
4. Simplify test case

---

## 6. Success Criteria

### 6.1 Must Have (P0)

- ✅ Plugin renders infographic to SVG
- ✅ Works in Astro dev mode
- ✅ Works in Astro build mode
- ✅ Handles errors gracefully
- ✅ TypeScript compiles without errors
- ✅ All tests pass

### 6.2 Should Have (P1)

- ✅ > 80% test coverage
- ✅ Full documentation
- ✅ Clear examples
- ✅ Error messages with context

### 6.3 Nice to Have (P2)

- ⏸️ Caching mechanism
- ⏸️ Performance optimizations
- ⏸️ Additional output formats

---

## 7. Timeline

### Day 1: Setup + Core Implementation (2-3 hours)

- Morning: Project setup (Phase 1)
- Afternoon: Core implementation (Phase 2)

### Day 2: Testing + Documentation (2-3 hours)

- Morning: Testing (Phase 3)
- Afternoon: Documentation (Phase 4)

### Day 3: Integration + Finalization (1 hour)

- Morning: Astro integration (Phase 5)
- Afternoon: Final verification

---

## 8. Next Steps

1. ✅ Specification complete
2. ⏭️ Begin Phase 1: Project Setup
3. ⏭️ Execute tasks sequentially
4. ⏭️ Verify success criteria at each phase
5. ⏭️ Commit and push after each phase

---

## Appendix A: Command Reference

```bash
# Initialize project
npm init -y

# Install dependencies
npm install @antvis/infographic@^0.2.8
npm install @types/hast hast-util-from-html-isomorphic
npm install hast-util-to-text unist-util-visit-parents
npm install unified vfile

# Install dev dependencies
npm install -D typescript @types/node vite vitest
npm install -D @vitest/coverage-v8 eslint prettier

# Build
npm run build

# Test
npm test
npm run test:coverage

# Lint
npm run lint
npm run format
```

---

**Document Status**: Ready for Execution
**Next Action**: Begin Phase 1 - Project Setup
