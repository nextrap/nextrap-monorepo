import { tjDemoViewerPlugin } from '@trunkjs/vite-demo-viewer';
import { defineConfig } from 'vite';

const demoInclude = [
  'nextrap-base/*/demo/**/*.demo.ts',
  'nextrap-styles/*/demo/**/*.demo.ts',
  'nextrap-elements/*/demo/**/*.demo.ts',
  'nextrap-layout/*/demo/**/*.demo.ts',
];

export default defineConfig(() => ({
  base: './',
  root: __dirname,
  publicDir: false,
  appType: 'custom',
  server: {
    port: 4000,
    host: '0.0.0.0',
    hmr: true,
  },
  optimizeDeps: {
    entries: demoInclude,
  },
  plugins: [
    tjDemoViewerPlugin({
      include: demoInclude,
      route: '/',
      title: 'Nextrap Demos',
      build: true,
    }),
  ],
  build: {
    outDir: './docs',
    emptyOutDir: false,
  },
}));
