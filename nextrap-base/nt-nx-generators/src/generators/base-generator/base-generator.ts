import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import path from 'path';
import { Schema } from './base-schema';
import { resolveOptions } from './options';
import adjustProjectJson from './steps/adjust-project-json';

export default async function (tree: Tree, input: Schema) {
  const generatorSrcRoot = __dirname;
  const options = resolveOptions(input);

  // Invoke the default generator with our options
  await libraryGenerator(tree, {
    name: options.name,
    importPath: `${options.path}`,
    directory: options.path,
    linter: 'eslint',
    bundler: 'vite',
    unitTestRunner: 'vitest',
  });

  // Add release configuration to project.json
  adjustProjectJson(tree, options);

  const srcPath = `${options.path}/src`;

  tree.delete(`${srcPath}/index.ts`);
  tree.delete(`${srcPath}/lib/${options.name}.ts`);
  tree.delete(`${srcPath}/lib/${options.name}.spec.ts`);

  const filesDir = path.join(generatorSrcRoot, 'files/base');

  generateFiles(tree, filesDir, options.path, options);

  await formatFiles(tree);

  // const viteConfig = tree.read(`${options.projectDirName}/vite.config.ts`, 'utf-8')
  // console.log(viteConfig)
}
