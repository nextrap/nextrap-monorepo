---
slugName: hierarchical-nx-generators
includeFiles:
    - src/generators/element-generator.ts
    - src/generators/layout-generator.ts
    - src/generators/options.ts
    - src/generators/steps/adjust-project-json.ts
    - src/generators/steps/adjust-vite-config.ts
    - src/generators/steps/create-element-base.ts
    - generators.json
editFiles:
    - src/gener/base-generator.ts
    - src/generators/base-schema.d.ts
    - src/generators/base-schema.json
    - src/generators/element-generator.ts
    - src/generators/layout-generator.ts
    - src/generators/options.ts
    - src/generators/steps/create-element-base-files.ts
    - src/generators/files/base/index.scss
    - src/generators/files/base/index.html
    - src/generators/files/base/demo/index.html
    - src/generators/files/base/demo/main.ts
    - src/generators/files/base/src/styles/index.scss
    - src/generators/files/base/src/lib/utils.ts
    - generators.json
    - README.md
original_prompt: Baue das so, dass man 3 tags hat base, element und layout. element
    und base basieren auf base. D.h. ein generator muss einen anderen generator triggern
    können. Every generate has a set of files it provides.
---

# Prepare Hierarchical NX Generators

We want three separate Nx generators – **base**, **element**, and **layout** – in which  
`element` and `layout` re-use all shared logic contained in `base`.  
Technically this means both generators must **trigger** the `base` generator, forwarding all
options and adding their own template specific files.  
Every generator owns a clear set of template files.

## Assumptions

1. PackageType already contains the variants `BASE`, `ELEMENTS`, `LAYOUT`.  
   If not, we will extend it.
2. The existing duplicated logic in `element` and `layout` _is_ the common part that
   should move to `base`.
3. No breaking changes should be introduced to public generator API.
4. Tests can stay as _todo_ but we add at least skeletons.

## Missing Information

No critical information is missing.  
(If you need to change the PackageType enum location, tell us.)

## Tasks

- **create-base-generator** Build new `base` generator that encapsulates the currently duplicated workflow.
- **move-shared-logic** Extract duplicated code from `element` / `layout` into the new generator.
- **refactor-element-gen** Replace implementation by a thin wrapper that calls `base` and then injects element-specific files.
- **refactor-layout-gen** Same as above for layout.
- **extend-options** Add an optional `template` field (`'base' | 'element' | 'layout'`) to pass down.
- **update-generators-json** Register the new generator.
- **add-base-templates** Provide minimal template set inside `files/base`.
- **update-readme** Document usage of the new generator hierarchy.

## Overview: File changes

- **src/generators/base-generator.ts** brand-new generator implementation
- **src/generators/base-schema.\*** schema typings & json
- **src/generators/element-generator.ts** strip duplicated code, delegate to base
- **src/generators/layout-generator.ts** same as element
- **src/generators/options.ts** add `template` option helper
- **src/generators/steps/create-element-base-files.ts** rename to generic, accept template param
- **generators.json** register `base`
- **src/generators/files/base/** new template folder
- **README.md** explain three-layer usage

## Detail changes

### src/generators/base-generator.ts

**Referenced Tasks**

- **create-base-generator**
- **move-shared-logic**

New file:

```ts
import { Tree, formatFiles } from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import { Schema } from './base-schema';
import { resolveOptions } from './options';
import adjustProjectJson from './steps/adjust-project-json';
import adjustViteConfig from './steps/adjust-vite-config';
import createElementBaseFiles from './steps/create-element-base-files';

export default async function baseGenerator(
    tree: Tree,
    input: Schema,
    template: 'base' | 'element' | 'layout' = 'base',
) {
    const generatorSrcRoot = __dirname;
    const options = resolveOptions(input);

    await libraryGenerator(tree, {
        name: options.name,
        importPath: `${options.scope}/${options.prefix}${options.name}`,
        directory: options.projectDirName,
        linter: 'eslint',
        bundler: 'vite',
        unitTestRunner: 'vitest',
    });

    adjustProjectJson(tree, options);
    adjustViteConfig(tree, options);

    createElementBaseFiles(tree, options, generatorSrcRoot, template);
    await formatFiles(tree);
}
```

### src/generators/base-schema.d.ts / base-schema.json

**Referenced Tasks**

- **create-base-generator**

Both mirror former element schema, but expose only `name` & `type`.

### src/generators/element-generator.ts

**Referenced Tasks**

- **refactor-element-gen**

Replace file content:

```ts
import { Tree } from '@nx/devkit';
import { Schema } from './element-schema';
import baseGenerator from './base-generator';

export default async function (tree: Tree, input: Schema) {
    return baseGenerator(tree, input, 'element');
}
```

### src/generators/layout-generator.ts

**Referenced Tasks**

- **refactor-layout-gen**

Same pattern as element but pass `'layout'`.

### src/generators/options.ts

**Referenced Tasks**

- **extend-options**

Add:

```ts
export interface TemplateAware extends Schema {
    template?: 'base' | 'element' | 'layout';
}
```

and forward the value in `resolveOptions`.

### src/generators/steps/create-element-base-files.ts

**Referenced Tasks**

- **move-shared-logic**

Rename argument `template` to keep but ensure it accepts `'base'`.

```ts
export default function (
  tree: Tree,
  options: ResolvedOptions,
  generatorSrcRoot: string,
  template: 'base' | 'element' | 'layout' = 'base',
): void {
  ...
}
```

### generators.json

**Referenced Tasks**

- **update-generators-json**

Add:

```json
"base": {
  "factory": "./src/generators/base-generator",
  "schema": "./src/generators/base-schema.json",
  "description": "Shared base generator for element & layout"
}
```

### README.md

**Referenced Tasks**

- **update-readme**

Add usage examples:

```
nx g @nextrap/nt-nx-generators:base my-lib
nx g @nextrap/nt-nx-generators:element my-element
nx g @nextrap/nt-nx-generators:layout my-layout
```

### Templates – src/generators/files/base/\*\*

Copy from existing element template or keep minimal placeholders identical to current layout.

---

With these changes we obtain a clean three-level generator structure where `element` and `layout`
depend on and reuse everything from `base`, avoiding code duplication and ensuring every generator
keeps its own template set.
