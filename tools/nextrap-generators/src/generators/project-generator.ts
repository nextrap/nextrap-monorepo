import { PackageType } from '@nextrap/nextrap-constants';
import { formatFiles, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import { resolveOptions } from './options';
import { Schema } from './schema';
import adjustProjectJson from './steps/adjust-project-json';
import adjustViteConfig from './steps/adjust-vite-config';
import createElementBaseFiles from './steps/create-element-base-files';

export default async function (tree: Tree, input: Schema) {
  const generatorSrcRoot = __dirname;
  const options = resolveOptions(input);

  // Invoke the default generator with our options
  await libraryGenerator(tree, {
    name: options.name,
    importPath: `${options.scope}/${options.prefix}${options.name}`,
    directory: options.projectDirName,
    linter: 'eslint',
    bundler: 'vite',
    unitTestRunner: 'vitest',
  });

  // Add release configuration to project.json
  adjustProjectJson(tree, options);

  // Adjust server and test config to vite.config.ts
  adjustViteConfig(tree, options);

  if (options.type === PackageType.ELEMENTS || options.type === PackageType.LAYOUT) {
    createElementBaseFiles(tree, options, generatorSrcRoot);
  }

  await formatFiles(tree);
}
