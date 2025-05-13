import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const input = 'src/index.js'

const defaultOutputOptions = {
  name: pkg.name,
  format: 'umd',
  globals: {},
  banner: `/*! [banner info] !*/`,
  footer: '/* [footer info] */',
}

const defaultPlugins = [json(), resolve({ browser: true })]

const external = []

export default [
  // UMD - Minified
  {
    input,
    output: {
      ...defaultOutputOptions,
      file: `dist/${pkg.name}.min.js`,
      format: 'umd',
    },
    external,
    plugins: [
      ...defaultPlugins,
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        babelHelpers: 'runtime',
        presets: ['@babel/preset-env'],
      }),
      terser(),
    ],
  },
  // UMD
  {
    input,
    output: {
      ...defaultOutputOptions,
      file: `dist/${pkg.name}.js`,
      format: 'umd',
    },
    external,
    plugins: [
      ...defaultPlugins,
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        babelHelpers: 'runtime',
        presets: ['@babel/preset-env'],
      }),
    ],
  },
  // ES
  {
    input,
    output: [
      {
        ...defaultOutputOptions,
        file: 'dist/esm/index.mjs',
        format: 'esm',
      },
    ],
    plugins: [
      ...defaultPlugins,
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        babelHelpers: 'runtime',
        presets: ['@babel/preset-env'],
      }),
    ],
  },
  // CJS
  {
    input,
    output: {
      ...defaultOutputOptions,
      file: 'dist/cjs/index.cjs',
      format: 'cjs',
      exports: 'auto',
    },
    plugins: [
      ...defaultPlugins,
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        babelHelpers: 'runtime',
        presets: [['@babel/preset-env', { modules: false }]],
      }),
      commonjs({
        include: /node_modules/,
      }),
    ],
  },
]
