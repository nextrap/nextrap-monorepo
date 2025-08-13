import { Tree, updateJson } from '@nx/devkit';
import * as path from 'path';
import { ResolvedOptions } from '../options';

export default function (tree: Tree, options: ResolvedOptions): void {
  const projectJsonPath = path.join(options.path, 'project.json');
  updateJson(tree, projectJsonPath, (json) => {
    json['name'] = options.name;
    json['release'] = {
      version: {
        currentVersionResolver: 'disk',
        preserveLocalDependencyProtocols: false,
        manifestRootsToUpdate: ['{projectRoot}'],
      },
    };

    return json;
  });
}
