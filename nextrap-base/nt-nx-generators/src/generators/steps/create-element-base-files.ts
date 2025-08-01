import { generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { ResolvedOptions } from '../options';

export default function (tree: Tree, options: ResolvedOptions, generatorSrcRoot: string): void {
  const srcPath = `${options.projectDirName}/src`;

  tree.delete(`${srcPath}/index.ts`);
  tree.delete(`${srcPath}/lib/${options.name}.ts`);
  tree.delete(`${srcPath}/lib/${options.name}.spec.ts`);

  const filesDir = path.join(generatorSrcRoot, 'files/element');

  generateFiles(tree, filesDir, options.projectDirName, options);
}
