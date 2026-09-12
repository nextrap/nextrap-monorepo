/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { tjDemoViewerPlugin } from '@trunkjs/vite-demo-viewer';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const projectName = 'nte-navbar';
const dirName = 'nextrap-elements/nte-navbar';

// Konfiguriert Entwicklung, Library-Build und Tests relativ zum Package-Verzeichnis.
export default defineConfig(() => ({
  root: __dirname,
  cacheDir: `../../node_modules/.vite/${dirName}`,
  server: {
    port: 4000,
    host: '0.0.0.0',
    hmr: true,
  },
  plugins: [
    nxViteTsPaths(),
    // Übernimmt die veröffentlichbaren SCSS- und Dokumentationsdateien in das Package-Artefakt.
    nxCopyAssetsPlugin(['*.md', '*.scss', '**/*.scss', 'skills/**/*']),
    tjDemoViewerPlugin({
      include: ['demo/**/*.demo.ts'],
      route: '/',
      title: 'NTE Navbar demos',
    }),
    dts({
      entryRoot: '.',
      aliasesExclude: [/@nextrap\/.*/],
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  // Erzeugt ein extern verlinktes ES-Modul, damit Package-Abhängigkeiten nicht eingebettet werden.
  build: {
    reportsDirectory: `../../coverage/${dirName}`,
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: { index: 'index.ts', unstyled: 'unstyled.ts' },
      name: projectName,
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ['es' as const],
    },
    rollupOptions: {
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
    },
  },
  // Führt vorhandene Package-Tests in einer browsernahen DOM-Umgebung aus.
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
