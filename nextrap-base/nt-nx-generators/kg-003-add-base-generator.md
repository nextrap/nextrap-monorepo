---
slugName: add-base-generator
includeFiles:
    - src/generators/element-generator.ts
    - src/generators/layout-generator.ts
    - src/generators/options.ts
    - src/generators/steps/create-element-base-files.ts
    - generators.json
editFiles:
    - src/generators/base-generator.ts
    - src/generators/base-schema.d.ts
    - src/generators/base-schema.json
    - src/generators/base-generator.spec.ts
    - src/generators/options.ts
    - src/generators/steps/create-element-base-files.ts
    - src/generators/files/base/index.html
    - src/generators/files/base/index.scss
    - src/generators/files/base/demo/index.html
    - src/generators/files/base/demo/main.ts
    - src/generators/files/base/src/styles/index.scss
    - src/generators/files/base/src/lib/utils.ts
    - generators.json
original_prompt: Create a new base generator in an own subdir below src/generators/base
    . it should have a own files dir with template-files.
---

# Prepare Add Base Generator

Introduce a new “base” generator that can scaffold simple, non-element / non-layout libraries.  
The generator lives in `src/generators/base` and owns its own `files/base` template folder.

## Missing Information

None – task can be implemented by mirroring the existing element/layout generators.

## Tasks

- **create-base-generator** Implement `base-generator.ts` copied & cleaned from element-generator (≤160 chars)
- **base-generator-schema** Add `base-schema.d.ts` & `base-schema.json` describing `{ name:string }` (≤160 chars)
- **test-base-generator** Add `base-generator.spec.ts` placeholder with `describe.todo` (≤160 chars)
- **register-generator** Append entry “base” to `generators.json` (≤160 chars)
- **template-files** Copy generic starter templates to `files/base/**` (≤160 chars)
- **adapt-create-files** Allow template `'base'` in `create-element-base-files.ts` (≤160 chars)
- **extend-options** No change needed; function already agnostic to template (≤160 chars)

## Overview: File changes

- **src/generators/base-generator.ts** New generator implementation
- **src/generators/base-schema.d.ts/json** New schema definition files
- **src/generators/base-generator.spec.ts** New Vitest placeholder
- **src/generators/steps/create-element-base-files.ts** Accept 'base' template
- **src/generators/files/base/**/_._ \*\* New templates (html, scss, ts)
- **generators.json** Register the new generator

## Detail changes

### src/generators/base-generator.ts

**Referenced Tasks**

- **create-base-generator**

New file (trimmed edition of element-generator):

```ts
import { formatFiles, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js';
import { Schema } from './base-schema';
import { resolveOptions } from './options';
import adjustProjectJson from './steps/adjust-project-json';
import adjustViteConfig from './steps/adjust-vite-config';

export default async function (tree: Tree, input: Schema) {
    const generatorSrcRoot = __dirname;
    const options = resolveOptions({ ...input, type: 'base' as any });

    await libraryGenerator(tree, {
        name: options.name,
        importPath: `${options.scope}/${options.name}`,
        directory: options.projectDirName,
        linter: 'eslint',
        bundler: 'vite',
        unitTestRunner: 'vitest',
    });

    adjustProjectJson(tree, options);
    adjustViteConfig(tree, options);

    createElementBaseFiles(tree, options, generatorSrcRoot, 'base');

    await formatFiles(tree);
}
```

### src/generators/base-schema.d.ts

**Referenced Tasks**

- **base-generator-schema**

```ts
export interface Schema {
    /** Library name in dashed-case */
    name: string;
}
```

### src/generators/base-schema.json

JSON schema to expose via Nx:

```json
{
    "$schema": "http://json-schema.org/schema",
    "title": "Base library options",
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "Library name"
        }
    },
    "required": ["name"]
}
```

### src/generators/base-generator.spec.ts

**Referenced Tasks**

- **test-base-generator**

```ts
describe.todo('base-generator');
```

### src/generators/steps/create-element-base-files.ts

**Referenced Tasks**

- **adapt-create-files**

Add `'base'` to union type and switch:

```ts
export default function (
  tree: Tree,
  options: ResolvedOptions,
  generatorSrcRoot: string,
  template: 'element' | 'layout' | 'base',   // <-- added
): void {
  ...
}
```

### src/generators/files/base/\*\*

**Referenced Tasks**

- **template-files**

Create same file set as `files/element` but stripped from element-specific prefixes:

```
files/base/index.html
files/base/index.scss
files/base/demo/index.html
files/base/demo/main.ts
files/base/src/styles/index.scss
files/base/src/lib/utils.ts
```

Adjust placeholders to use `<%= name %>` without prefix.

### generators.json

**Referenced Tasks**

- **register-generator**

Add new entry:

```json
"base": {
  "factory": "./src/generators/base-generator",
  "schema": "./src/generators/base-schema.json",
  "description": "Generator for plain base libraries"
}
```

No other files require modification.
