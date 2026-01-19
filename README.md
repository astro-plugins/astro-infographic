# rehype-infographic

> A [rehype](https://github.com/rehypejs/rehype) plugin to render [@antv/Infographic](https://github.com/antv/Infographic) diagrams in Markdown files.

[![npm version](https://img.shields.io/npm/v/rehype-infographic)](https://www.npmjs.com/package/rehype-infographic)
[![License](https://img.shields.io/npm/l/rehype-infographic)](LICENSE)

## ✨ Features

- 📝 **Markdown Syntax**: Write infographic specifications directly in Markdown code blocks
- 🎨 **SVG Rendering**: High-quality SVG output at build time
- ⚡ **Fast**: Server-side rendering with no browser dependencies
- 🔧 **Configurable**: Custom width, height, and error handling
- 💻 **TypeScript**: Fully typed for excellent developer experience

## 📦 Installation

```bash
npm install rehype-infographic @antv/infographic
```

## 🚀 Usage

### With Astro

Add the plugin to your `astro.config.mjs`:

```javascript
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

### Markdown Syntax

In your Markdown files, use `infographic` as the code block language:

````markdown
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
````

This will be rendered to an SVG visualization in your built HTML.

## ⚙️ Options

### `width`

- **Type**: `string | number`
- **Default**: `'100%'`
- **Description**: Width of the rendered SVG

### `height`

- **Type**: `string | number`
- **Default**: `'auto'`
- **Description**: Height of the rendered SVG

### `infographicOptions`

- **Type**: `Partial<InfographicInitOptions>`
- **Default**: `{}`
- **Description**: Additional options passed to @antv/Infographic's SSR renderer

### `errorFallback`

- **Type**: `(element, spec, error, file) => ElementContent | null | undefined`
- **Default**: `undefined` (throws on error)
- **Description**: Custom error handler for failed infographic rendering

## 📖 Examples

### Basic Infographic

```markdown
\`\`\`infographic
infographic list-row-simple-horizontal-arrow
data
  lists
    - label Planning
    - label Development
    - label Deployment
\`\`\`
```

### With Icons

```markdown
\`\`\`infographic
infographic list-row-horizontal-icon-arrow
data
  title Project Roadmap
  items
    - label Planning
      icon mdi/clipboard
    - label Development
      icon mdi/code-tags
\`\`\`
```

### Custom Error Handling

```javascript
rehypeInfographic({
  errorFallback: (element, spec, error, file) => {
    file.message(`Failed to render infographic: ${error}`)
    return {
      type: 'element',
      tagName: 'div',
      properties: { className: ['error'] },
      children: [{ type: 'text', value: 'Could not render infographic' }]
    }
  }
})
```

## 🎯 How It Works

1. Parse Markdown to HTML AST
2. Find `<code class="language-infographic">` elements
3. Extract infographic specification text
4. Call `@antv/infographic/ssr` to render SVG
5. Replace code block with SVG in HTML
6. Output final HTML with embedded visualizations

## 🐛 Known Limitations

- The @antv/Infographic SSR API requires a DOM environment which may have compatibility issues in certain Node.js configurations
- SVG-only output (no PNG or other formats)
- No client-side rendering (SSR only)

## 📝 License

MIT © [Your Name]

## 🔗 Links

- [rehype](https://github.com/rehypejs/rehype)
- [@antv/Infographic](https://github.com/antv/Infographic)
- [Astro](https://astro.build)

---

**Note**: This plugin is in early development. Please report issues on GitHub.
