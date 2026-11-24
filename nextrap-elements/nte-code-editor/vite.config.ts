import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { tjDemoViewerPlugin } from '@trunkjs/vite-demo-viewer';
import * as path from 'node:path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

// Library und Demo teilen den Package-Pfad; Laufzeit-Peers bleiben extern.
const projectName = 'nte-code-editor';
const packagePath = 'nextrap-elements/nte-code-editor';

// Der Viewer wird nur beim Entwickeln aktiviert; der Build erzeugt die Library.
export default defineConfig({
  root: __dirname,
  cacheDir: `../../node_modules/.vite/${packagePath}`,
  server: {
    port: 4000,
    host: '0.0.0.0',
    strictPort: true,
  },
  plugins: [
    nxViteTsPaths(),
    // Öffentliche Sass-API und package-lokale Dokumentation werden mitgeliefert.
    nxCopyAssetsPlugin([
      'README.md',
      '.ai-usage-info.md',
      'index.scss',
      'src/**/*.scss',
      '.agents/**/*',
    ]),
    tjDemoViewerPlugin({
      include: ['demo/**/*.demo.ts'],
      route: '/',
      title: 'Code Editor',
    }),
    dts({
      entryRoot: '.',
      aliasesExclude: [/@nextrap\/.*/],
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  // Nx erkennt das Testtarget; DOM-Tests verwenden die vorhandene jsdom-Umgebung.
  test: {
    watch: false,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      reportsDirectory: `../../coverage/${packagePath}`,
      provider: 'v8',
    },
  },
  build: {
    outDir: `../../dist/${packagePath}`,
    emptyOutDir: true,
    reportCompressedSize: true,
    lib: {
      entry: 'index.ts',
      name: projectName,
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      // Auch Subpfade externer Libraries bleiben Imports der konsumierenden App.
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
    },
  },
});
