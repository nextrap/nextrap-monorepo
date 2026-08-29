/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
export default defineConfig(() => ({
  root: __dirname, cacheDir: '../../node_modules/.vite/nextrap-elements/nte-data-table',
  plugins: [nxViteTsPaths(), nxCopyAssetsPlugin(['*.md','.ai-usage-info.md','*.scss','**/*.scss','skills/**/*','web-types.json']), dts({entryRoot:'.',aliasesExclude:[/@nextrap\/.*/],tsconfigPath:path.join(__dirname,'tsconfig.lib.json')})],
  build:{outDir:'../../dist/nextrap-elements/nte-data-table',emptyOutDir:true,lib:{entry:'index.ts',name:'nte-data-table',fileName:'index',formats:['es']},rollupOptions:{external:(id)=>!id.startsWith('.')&&!path.isAbsolute(id)}},
  test:{passWithNoTests:true,watch:false,globals:true,environment:'jsdom'}
}));
