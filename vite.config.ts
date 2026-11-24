import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    minify: false,
    cssCodeSplit: false,
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-dom/client',
        'clsx',
        'cmdk',
        'class-variance-authority',
        'tailwind-merge',
        'lucide-react',
        'react-markdown',
        /^remark-/,
        /^rehype-/,
        /^unist/,
        /^mdast/,
        /^hast/,
        'katex',
        /^katex\//,
        'mermaid',
      ],
    },
  },
})
