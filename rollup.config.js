import sass from 'rollup-plugin-sass'
import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel';

import pkg from './package.json'

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false
    }
  ],
  plugins: [sass({ insert: true }), typescript(), babel({ babelHelpers: 'bundled' })],
  external: ['react', 'react-dom']
}
