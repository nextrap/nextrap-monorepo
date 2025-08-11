import { Tree } from '@nx/devkit';
import * as path from 'path';
import { ResolvedOptions } from '../options';

export default function (tree: Tree, options: ResolvedOptions): void {
  const viteConfigPath = path.join(options.projectDirName, 'vite.config.ts');

  const contents = tree.read(viteConfigPath).toString();
  const newContents = contents
    // add imports (they end at the first double new line)
    .replace(
      /\n\n/,
      `
// Importing directly because vite does not support ts path alias
import { nextrap, PackageType } from '../../nextrap-base/nt-meta/src/index';

    `,
    )
    // set project variables
    .replace(
      'export default',
      `
const projectName = '${options.prefixedName}';
const dirName = \`\${nextrap}-\${PackageType.${options.packageTypeEnumProp}}/\${projectName}\`;

export default`,
    )

    // add server config
    .replace(
      'export default defineConfig(() => ({',
      `
export default defineConfig(() => ({
  server: {
    port: 4000,
    host: '0.0.0.0',
    hmr: true,
  },`,
    )

    // adjust test config
    .replace(
      'test: {',
      `test: {
  passWithNoTests: true,`,
    )

    // replace hard-coded names
    .replace(`name: '${options.name}'`, `name: projectName`)
    .replace(/cacheDir.*$/gm, `cacheDir: \`../../node_modules/.vite/\${dirName}\`,`)
    .replace(/outDir.*$/gm, `reportsDirectory: \`../../dist/\${dirName}\`,`)
    .replace(/reportsDirectory.*$/gm, `reportsDirectory: \`../../coverage/\${dirName}\`,`);

  tree.write(viteConfigPath, newContents);
}
