/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  server: {
    port: 4002,
    host: '0.0.0.0',
    hmr: true,
  },
  root: __dirname,
  cacheDir: '../../node_modules/.vite/nextrap-base/style-elements',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md', '*.scss', '**/*.scss']),
    dts({
      entryRoot: 'src',
      aliasesExclude: [/@nextrap\/.*/],
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    outDir: '../../dist/nextrap-base/style-elements',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: 'style-elements',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/nextrap-base/style-elements',
      provider: 'v8' as const,
    },
  },
}));
