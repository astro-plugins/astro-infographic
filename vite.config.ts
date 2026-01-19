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
