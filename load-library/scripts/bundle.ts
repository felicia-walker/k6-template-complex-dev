import { buildSync } from 'esbuild'
import glob from 'glob'
import { existsSync, rmSync, cpSync } from 'node:fs'

const { sync } = glob

console.log('Building dist for node (cjs)...')

// Generate entry-points for cjs compatibility
const localeDir = 'locale'
const target = ['ES2019', 'node14.17']

if (existsSync(localeDir)) {
  rmSync(localeDir, { recursive: true, force: true })
}

buildSync({
  entryPoints: sync('./src/**/*.ts'),
  outdir: './dist/cjs',
  bundle: false,
  sourcemap: true,
  minify: false,
  format: 'cjs',
  platform: 'node',
  target,
})

console.log('Building dist for node type=module (esm)...')
buildSync({
  entryPoints: ['./src/index.ts'],
  outdir: './dist/esm',
  bundle: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  format: 'esm',
  platform: 'node',
  target,
  outExtension: { '.js': '.mjs' },
  external: ['k6/*', 'k6'],
})

console.log('Building dist for node type=module (cjs) but in esm dir...')
buildSync({
  entryPoints: sync('./src/**/*.ts'),
  outdir: './dist/esm',
  bundle: false,
  sourcemap: false,
  minify: false,
  format: 'cjs',
  platform: 'node',
  target,
})

cpSync('./src/k6-libs', './dist/esm/k6-libs', { recursive: true })
cpSync('./src/k6-libs', './dist/cjs/k6-libs', { recursive: true })
