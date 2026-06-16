import { defineConfig } from 'vite'
import { copyFileSync, cpSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    {
      name: 'copy-p5-static-files',
      closeBundle() {
        const outDir = resolve('dist')
        mkdirSync(outDir, { recursive: true })
        copyFileSync(resolve('sketch.js'), resolve(outDir, 'sketch.js'))
        cpSync(resolve('assets'), resolve(outDir, 'assets'), { recursive: true })
      },
    },
  ],
  server: {
    open: false,
  },
})
