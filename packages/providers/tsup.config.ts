import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    compilerOptions: {
      composite: false,
      incremental: false
    }
  },
  clean: true,
  splitting: false,
  external: ['@arc/solana', '@arc/jupiter']
})