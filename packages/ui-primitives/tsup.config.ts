import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'dialog-alpha/index': 'src/dialog-alpha/index.ts',
    'dropdown-alpha/index': 'src/dropdown-alpha/index.ts',
    'react/index': 'src/react/index.tsx',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ['react', 'react-dom'],
})