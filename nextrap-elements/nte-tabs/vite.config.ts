/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { tjDemoViewerPlugin } from '@trunkjs/vite-demo-viewer';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const projectName = 'nte-tabs';
const dirName = 'nextrap-elements/nte-tabs';

export default defineConfig(() => ({
  server: {
    port: 4000,
    host: '0.0.0.0',
    fixedPort: true,
    hmr: true,
  },
  root: __dirname,
  cacheDir: `../../node_modules/.vite/${dirName}`,
  css: {
    devSourcemap: true,
  },
  esbuild: {
    sourcemap: true,
  },
  plugins: [
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['README.md', '.ai-usage-info.md', 'package.json', '*.scss', 'src/**/*.scss']),
    {
      name: 'watch-md-reload',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.md')) {
          server.ws.send({ type: 'full-reload' });
        }
      },
    },
    tjDemoViewerPlugin({
      include: ['demo/**/*.demo.ts'],
    }),
    dts({
      entryRoot: '.',
      aliasesExclude: [/@nextrap\/.*/],
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    outDir: `../../dist/${dirName}`,
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
}));
