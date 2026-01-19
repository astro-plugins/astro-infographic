# SSR Research Findings: @antv/Infographic Timeout Issue

**Date**: 2026-01-19
**Status**: RESOLVED - Not a Bug, Incorrect Test Syntax

---

## Executive Summary

The SSR render timeout issue reported in v0.2.10 was **NOT a bug** in @antv/Infographic. The issue was caused by using incorrect infographic syntax in test files. When the correct syntax is used, SSR rendering works perfectly.

---

## Investigation Timeline

### Phase 1: Initial Hypothesis - Missing fetch polyfill
- **Hypothesis**: The SSR environment was missing `fetch` API
- **Test Created**: `debug-ssr.mjs` with fetch monitoring
- **Result**: No fetch calls were detected - hypothesis ruled out

### Phase 2: Promise Tracking Investigation
- **Hypothesis**: `waitForSvgLoads` was hanging on tracked promises
- **Test Created**: `trace-promises.mjs` with WeakMap instrumentation
- **Result**: No promises were being tracked - hypothesis ruled out

### Phase 3: Event Emission Tracing
- **Hypothesis**: 'loaded' event was never emitted
- **Test Created**: `patch-performRender.mjs` with detailed logging
- **Breakthrough**: Found `isCompleteParsedInfographicOptions` was failing
- **Root Cause**: `data.items` was **empty array** `[]`

### Phase 4: Parser Error Analysis
- **Discovery**: Parser was throwing "bad_list" errors
- **Root Cause**: Incorrect infographic syntax in test files

---

## The Issue: Incorrect Infographic Syntax

### Wrong Syntax (What Was Used)
```yaml
infographic list-row-simple-horizontal-arrow
data
items          # ❌ Wrong key name
- label Step 1  # ❌ Missing indentation
desc Start
- label Step 2
desc In Progress
- label Step 3
desc Complete
```

**Parser Errors**:
```
code: 'bad_list'
message: 'List item is not under an array container.'
```

**Result**: `data.items = []` (empty array) → `isCompleteParsedInfographicOptions` fails → 'loaded' event never emitted → SSR timeout

### Correct Syntax (From README)
```yaml
infographic list-row-simple-horizontal-arrow
data
  lists         # ✅ Correct key name
    - label Step 1
      desc Start    # ✅ Proper indentation (4 spaces)
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete
```

---

## Code Flow Analysis

### When Syntax is CORRECT:
```
1. infographic.render(spec) called
2. parseSyntax(spec) → parses correctly → data.lists populated
3. performRender()
   ├─ isCompleteParsedInfographicOptions() → ✅ PASS
   ├─ renderer.render() → creates SVG
   ├─ emit('rendered') → event fired
   └─ waitForSvgLoads() → no promises → resolves immediately
      └─ emit('loaded') → event fired
4. SSR renderer 'loaded' listener → exportToSVG()
5. ✅ SUCCESS: SVG returned in ~31ms
```

### When Syntax is WRONG:
```
1. infographic.render(spec) called
2. parseSyntax(spec) → parse errors → data.items = []
3. performRender()
   ├─ isCompleteParsedInfographicOptions()
   │  └─ !Array.isArray(data.items) || data.items.length < 1
   │  └─ ❌ FAIL (0 < 1 is false)
   ├─ emit('error', 'Incomplete options')
   └─ return (early exit, no 'loaded' event)
4. SSR renderer waits for 'loaded' event forever...
5. ❌ TIMEOUT after 10 seconds
```

---

## Key Code Locations

| File | Line | Function | Role |
|------|------|----------|------|
| `esm/runtime/utils.js` | 27-50 | `isCompleteParsedInfographicOptions` | Validates options before render |
| `esm/runtime/utils.js` | 35 | Check | `!Array.isArray(data.items) \|\| data.items.length < 1` |
| `esm/runtime/Infographic.js` | 59-62 | `performRender` | Returns early if validation fails |
| `esm/runtime/Infographic.js` | 77-84 | `waitForSvgLoads` then emit | 'loaded' event only after validation |
| `esm/syntax/parser.ts` | 118, 164 | Parser error | "bad_list" when incorrect indentation |
| `esm/syntax/index.js` | 85-96 | `DataSchema` mapping | Maps `lists` → `data.items` |

---

## Validation Function Details

```javascript
// esm/runtime/utils.js:27-50
export function isCompleteParsedInfographicOptions(options) {
    const { design, data } = options;
    if (!design)
        return false;
    if (!isNonNullableParsedDesignsOptions(design))
        return false;
    if (!data)
        return false;
    // THIS IS THE CRITICAL CHECK:
    if (!Array.isArray(data.items) || data.items.length < 1)
        return false;  // ← Empty array fails here!
    return true;
}
```

**Why `lists` becomes `items`**:
The syntax parser maps the `lists` key in the YAML-like syntax to `data.items` in the parsed options object.

---

## Test Results

### Before Fix (Wrong Syntax)
```
❌ FAIL: items not array or empty true 0
❌ Incomplete options!
🔴 TIMEOUT! After 10 seconds
```

### After Fix (Correct Syntax)
```
✅ PASS (design and data valid)
✅ SUCCESS! SVG length: 3983
ssr-render: 31.445ms
```

---

## Lessons Learned

### 1. Syntax Format is Critical
The @antv/Infographic syntax parser is strict about:
- **Key names**: Must use `lists` not `items`
- **Indentation**: List items must be indented under their parent key
- **Spacing**: Proper 2-space or 4-space indentation required

### 2. Error Messages Can Be Misleading
"SSR render timeout" suggests a hanging promise, but the real issue was:
1. Parser silently failed to populate data
2. Validation check returned false
3. Early exit prevented 'loaded' event
4. Timeout was waiting for an event that was never coming

### 3. Debugging Strategy
Adding detailed logging at each step of the render flow was more effective than:
- Fetch monitoring (showed nothing wrong)
- Promise tracking (showed nothing tracked)
- Event tracing (showed no events after error)

The breakthrough was patching `isCompleteParsedInfographicOptions` to show WHY validation was failing.

---

## Updated Recommendations

### For the rehype-infographic Plugin

1. **Documentation Updates**:
   - Add infographic syntax examples to README
   - Document common syntax errors
   - Add troubleshooting section

2. **Error Messages**:
   - Catch parse errors and provide clearer messages
   - Detect empty `data.items` and suggest syntax check
   - Add syntax validation before calling SSR

3. **Testing**:
   - Use CORRECT syntax in all test fixtures
   - Add negative tests for common syntax errors
   - Test with real infographic examples from documentation

### Correct Test Fixture Syntax

**File**: `test/fixtures/basic.md`
```markdown
# Test Infographic

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

---

## Conclusion

The @antv/Infographic SSR API is **working correctly**. The timeout issue was entirely due to incorrect test syntax. No code changes are needed to @antv/Infographic.

**Next Steps**:
1. ✅ Update all test fixtures with correct syntax
2. ⏳ Re-run unit tests
3. ⏳ Integration test with astro-marp-example
4. ⏳ Update documentation

---

**Research Duration**: ~2 hours
**Files Analyzed**: 15+ source files
**Lines of Code Traced**: ~500+
**Status**: ✅ RESOLVED
