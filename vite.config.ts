import path from 'node:path'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import babel from 'vite-plugin-babel';
import { defineConfig } from 'vite'
import env from 'vite-plugin-env-compatible'
import zip from 'vite-plugin-zip-pack'
import tailwindcss from "@tailwindcss/vite"
import manifest from './manifest.config.js'
import { name, version } from './package.json'

export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    react(),
    babel({
      babelConfig: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),
    env({ prefix: "VITE", mountedPath: "process.env" }),
    crx({ manifest }),
    zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
  ],
  server: {
    cors: {
      origin: [
        /chrome-extension:\/\//,
      ],
    },
    port: 4000,
  },
})
