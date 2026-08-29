/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { tjDemoViewerPlugin } from '@trunkjs/vite-demo-viewer';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  server: {
    port: 4003,
    host: '0.0.0.0',
    hmr: true,
  },
  test: {
    passWithNoTests: true,
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/nextrap-styles/style-switch',
      provider: 'v8' as const,
    },
  },
  root: __dirname,
  cacheDir: '../../node_modules/.vite/nextrap-styles/style-switch',
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md', '*.scss', '**/*.scss', '.agents/**/*.md']),
    tjDemoViewerPlugin({
      include: ['demo/**/*.demo.ts'],
      route: '/',
      title: 'style-switch Demos',
    }),
    dts({
      entryRoot: '.',
      aliasesExclude: [/@nextrap\/.*/],
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    outDir: '../../dist/nextrap-styles/style-switch',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'index.ts',
      name: 'style-switch',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
    },
  },
}));
