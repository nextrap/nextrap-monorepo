/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const projectName = 'nte-spinner';
const dirName = `nextrap-elements/nte-spinner`;

export default defineConfig(() => ({
  server: {
    port: 4000,
    host: '0.0.0.0',
    hmr: true,
  },
  root: __dirname,
  cacheDir: `../../node_modules/.vite/${dirName}`,
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    {
      name: 'watch-md-reload',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.md')) {
          server.ws.send({ type: 'full-reload' });
        }
      },
    },
    dts({
      entryRoot: 'src',
      aliasesExclude: [/@nextrap\/.*/],
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    reportsDirectory: `../../coverage/${dirName}`,
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'index.ts',
      name: projectName,
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
    },
  },
  test: {
    passWithNoTests: true,
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: `../../coverage/${dirName}`,
      provider: 'v8' as const,
    },
  },
}));
