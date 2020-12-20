import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';


const plugins = [
  nodeResolve(),
  commonjs(),
  {
    banner() {
      return `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`;
    }
  }
];


export default [
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/markdown-it-mark.js',
        format: 'umd',
        name: 'markdownitMark'
      },
      {
        file: 'dist/markdown-it-mark.min.js',
        format: 'umd',
        name: 'markdownitMark',
        plugins: [ terser() ]
      }
    ],
    plugins: plugins
  },
];
