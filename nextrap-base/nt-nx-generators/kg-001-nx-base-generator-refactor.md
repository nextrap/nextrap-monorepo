---
slugName: nx-base-generator-refactor
includeFiles:
    - src/generators/element-generator.ts
    - src/generators/layout-generator.ts
    - src/generators/options.ts
    - src/generators/steps/adjust-project-json.ts
    - src/generators/steps/adjust-vite-config.ts
    - src/generators/steps/create-element-base-files.ts
    - generators.json
editFiles:
    - src/generators/base-generator.ts
    - src/generators/base-schema.d.ts
    - src/generators/base-schema.json
    - src/generators/element-generator.ts
    - src/generators/layout-generator.ts
    - src/generators/options.ts
    - generators.json
    - src/generators/base-generator.spec.ts
    - README.md
original_prompt: Baue das so, dass man 3 tags hat base, element und layout. element
    und base basieren auf base. D.h. ein generator muss einen anderen generator triggern
    können. Beachte das ausgabeformt
---

# Prepare Shared Base Generator Refactor

Introduce a new `base` generator which bundles all logic common to `element` and `layout`.  
`element` and `layout` will become thin wrappers that delegate to `base`, passing their specific
templates (`element` / `layout`).  
Nx tags hierarchy will be enforced:

- `base` ➜ tag `base`
- `element` ➜ tags `base,element`
- `layout` ➜ tags `base,layout`

## Missing Information

<!-- Only provide if needed; here no essential data is missing. -->

## Tasks

- **create-base-generator** Add new generator consolidating shared logic of element & layout
- **extend-schemas** Create `base-schema` (d.ts + json) and update `element` / `layout` schemas
- **refactor-delegation** Change element & layout generator factories to call base generator
- **update-nx-tags** Ensure project.json of generated libs contains correct tag set
- **register-generator** Add `base` entry to `generators.json`
- **test-coverage** Add unit tests to verify delegation & tag assignment
- **docs-update** Extend README with usage & hierarchy description

## Overview: File changes

- **src/generators/base-generator.ts** New generator, extracted common code
- **src/generators/base-schema.d.ts/json** New schema files reused by wrappers
- **src/generators/element-generator.ts** Remove duplicate code, call base generator
- **src/generators/layout-generator.ts** Remove duplicate code, call base generator
- **src/generators/options.ts** Split option resolution; base handles generic, wrappers adjust
- **generators.json** Register `base` generator
- **README.md** Document new generator & tag hierarchy
- **src/generators/base-generator.spec.ts** Add tests

## Detail changes

### src/generators/base-generator.ts

**Referenced Tasks**

- **create-base-generator** Implement core generator logic
- **update-nx-tags** Apply tag assignment

Create file with:

```ts
import { formatFiles, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import { PackageType } from 'nextrap-base/nt-meta/src';
import { BaseSchema } from './base-schema';
import { resolveOptions } from './options';
import adjustProjectJson from './steps/adjust-project-json';
import adjustViteConfig from './steps/adjust-vite-config';
import createElementBaseFiles from './steps/create-element-base-files';

export default async function (tree: Tree, input: BaseSchema, template: 'element' | 'layout' | 'base' = 'base') {
    const generatorSrcRoot = __dirname;
    const options = resolveOptions(input);

    await libraryGenerator(tree, {
        name: options.name,
        importPath: `${options.scope}/${options.prefix}${options.name}`,
        directory: options.projectDirName,
        linter: 'eslint',
        bundler: 'vite',
        unitTestRunner: 'vitest',
        tags: [`base`, ...(template === 'element' ? ['element'] : template === 'layout' ? ['layout'] : [])],
    });

    adjustProjectJson(tree, options);
    adjustViteConfig(tree, options);

    if (template !== 'base') {
        createElementBaseFiles(tree, options, generatorSrcRoot, template);
    }

    await formatFiles(tree);
}
```

### src/generators/base-schema.d.ts

**Referenced Tasks**

- **extend-schemas**

```ts
import { PackageType } from './constants/package-type';

export interface BaseSchema {
    name: string;
    type: PackageType;
}
```

A matching `base-schema.json` replicates current schema structure.

### src/generators/element-generator.ts

**Referenced Tasks**

- **refactor-delegation**

Replace file content with:

```ts
import { Tree } from '@nx/devkit';
import baseGenerator from './base-generator';
import { BaseSchema } from './base-schema';

export default async function (tree: Tree, schema: BaseSchema) {
    return baseGenerator(tree, schema, 'element');
}
```

### src/generators/layout-generator.ts

Apply same replacement but pass `'layout'`.

### src/generators/options.ts

**Referenced Tasks**

- **extend-schemas**

Move generic `resolveOptions` to its own export so base & wrappers can reuse.

```ts
// No change in logic, just ensure it accepts BaseSchema not only element/layout
export function resolveOptions(input: BaseSchema) { ... }
```

### generators.json

**Referenced Tasks**

- **register-generator**

Add:

```json
"base": {
  "factory": "./src/generators/base-generator",
  "schema": "./src/generators/base-schema.json",
  "description": "Base generator for nextrap packages"
}
```

### README.md

**Referenced Tasks**

- **docs-update**

Add subsection:

```
### Generator hierarchy

```

- `nx g @nextrap/nt-nx-generators:base`
- `nx g @nextrap/nt-nx-generators:element`
- `nx g @nextrap/nt-nx-generators:layout`

`element` and `layout` delegate internally to `base`.

````

### src/generators/base-generator.spec.ts

**Referenced Tasks**
- **test-coverage**

```ts
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import generator from './base-generator';

describe('base-generator', () => {
  it('creates library with base tag', async () => {
    const tree = createTreeWithEmptyWorkspace();
    await generator(tree, { name: 'demo', type: 'elements' });
    const projectJson = JSON.parse(tree.read('nextrap-elements/nte-demo/project.json', 'utf-8'));
    expect(projectJson.tags).toContain('base');
  });
});
````

<!-- Add more test cases as needed -->
