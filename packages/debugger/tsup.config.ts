import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.tsx',
    react: 'src/react.ts',
  },
  format: ['esm', 'cjs'],
  dts: {
    resolve: true
  },
  sourcemap: true,
  clean: true,
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
  minify: process.env.NODE_ENV === 'production',
  splitting: true,
  external: [
    'react',
    'react-dom',
    '@connector-kit/connector'
  ],
  esbuildOptions: (options) => {
    // Aggressive tree-shaking optimizations
    options.treeShaking = true
    options.minifySyntax = true
    options.minifyIdentifiers = process.env.NODE_ENV === 'production'
    options.keepNames = process.env.NODE_ENV === 'development'
    
    // Optimize for modern bundlers
    options.platform = 'neutral'
    options.target = 'es2020'
  }
})

