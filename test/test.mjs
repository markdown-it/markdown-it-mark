import { fileURLToPath } from 'node:url'
import markdownit from 'markdown-it'
import generate from 'markdown-it-testgen'

import mark from '../index.mjs'

describe('markdown-it-mark', function () {
  const md = markdownit().use(mark)

  generate(fileURLToPath(new URL('fixtures/mark.txt', import.meta.url)), md)
})
