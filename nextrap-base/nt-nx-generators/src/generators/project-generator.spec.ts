import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { nextrap, PackageType } from 'nextrap-base/nt-meta/src';

import generatorFunc from './project-generator';
import { Schema } from './schema';

describe('project-generator generator', () => {
  let tree: Tree;
  const options: Schema = { name: 'Test Element', type: PackageType.ELEMENTS };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generatorFunc(tree, options);

    const packageJson = tree.read(`${nextrap}-${PackageType.ELEMENTS}/nte-test-element/package.json`, 'utf-8');
    expect(packageJson).toBeDefined();
  });
});
