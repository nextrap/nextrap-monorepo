import { Tree } from '@nx/devkit';
import * as path from 'path';
import { ResolvedOptions } from '../options';

export default function (tree: Tree, options: ResolvedOptions): void {
  const viteConfigPath = path.join(options.projectDirName, 'vite.config.ts');

  const contents = tree.read(viteConfigPath).toString();
  // We use the first "real" line as a guide
  const newContents = contents.replace(
    'export default defineConfig(() => ({',
    `
import viteServerConfig from '../../utils/vite/config/vite-server-config';
import viteTestConfig from '../../utils/vite/config/vite-test-config';

export default defineConfig(() => ({
  ...viteServerConfig,
  test: viteTestConfig('${options.projectDirName}'),
    `,
  );
  tree.write(viteConfigPath, newContents);
}
