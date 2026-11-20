/// <reference types="vitest" />

// Die gemeinsamen Nx-, Sass- und Demo-Werkzeuge bleiben Entwicklungsabhängigkeiten im Root.
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { tjDemoViewerPlugin } from '@trunkjs/vite-demo-viewer';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// Ein Package-Pfad hält Cache, Coverage und veröffentlichte Dateien zusammen.
const projectName = 'nte-icon';
const dirName = 'nextrap-elements/nte-icon';

// Library-Build und lokale Demo nutzen dieselben Quell-Entrypoints.
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
    // Sass-API, Lizenz und Package-Skills müssen auch im npm-Package verfügbar sein.
    nxCopyAssetsPlugin(['*.md', 'LICENSE', 'package.json', '*.scss', 'src/**/*.scss', 'src/**/*.css', '.agents/**/*']),
    tjDemoViewerPlugin({ include: ['demo/**/*.demo.ts'] }),
    dts({
      entryRoot: '.',
      aliasesExclude: [/@nextrap\/.*/],
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  // Die Schriftdatei wird weder gebündelt noch während des Builds angefordert.
  build: {
    outDir: `../../dist/${dirName}`,
    emptyOutDir: true,
    reportCompressedSize: true,
    lib: {
      entry: 'index.ts',
      name: projectName,
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      // Bare Imports einschließlich aller Peer-Subpfade bleiben extern.
      external: (id) => !id.startsWith('.') && !path.isAbsolute(id),
    },
  },
  // Ein kleiner jsdom-Test prüft Font-Registrierung und src-Wechsel.
  test: {
    passWithNoTests: false,
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
