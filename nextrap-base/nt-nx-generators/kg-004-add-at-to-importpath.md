---
slugName: add-at-to-importpath
includeFiles:
    - ./src/generators/base-generator/base-generator.ts
    - ./src/generators/base-generator/options.ts
    - ./src/generators/base-generator/steps/adjust-project-json.ts
    - ./README.md
editFiles:
    - ./src/generators/base-generator/options.ts
    - ./src/generators/base-generator/base-generator.ts
    - ./src/generators/base-generator/steps/adjust-project-json.ts
    - ./README.md
original_prompt: The generator creates the project in main /tsconfig.base.json without
    a trailing @ in the project name.
---

# Prepare Fix missing “@” in generated package names

The base generator currently creates libraries whose package name and `importPath`
lack the leading “@” that marks an NPM scope  
(e.g. `nextrap-layout/ntl-demo` instead of **`@nextrap-layout/ntl-demo`**).
This causes wrong paths inside  
`tsconfig.base.json`, `package.json` and any workspace-wide tooling.

## Tasks

- **derive-importpath** Ensure `resolveOptions` always produces `importPath`
  that starts with `@`, falling back to the provided value if already scoped.
- **use-importpath** Replace all hard-coded `options.path` usages that should
  reference the scoped package name with the new `options.importPath`.
- **update-projectjson** Store the scoped package name in `project.json`
  (`name` field) so Nx and release tooling use the correct value.
- **docs** Add a note to the README that `--path` should be passed without a
  leading “@”; the generator adds it automatically.

## Overview: File changes

- **src/generators/base-generator/options.ts**
  Add `importPath` helper that prefixes “@” if missing.
- **src/generators/base-generator/base-generator.ts**
  Pass the new `options.importPath` to `libraryGenerator` and
  remove the previous manual composition.
- **src/generators/base-generator/steps/adjust-project-json.ts**
  Write `options.importPath` to the `name` field.
- **README.md**
  Document the new behaviour and give usage example.

## Detail changes

### src/generators/base-generator/options.ts

**Referenced Tasks**

- **derive-importpath**

Add new property `importPath` to the returned options object.

```ts
// after imports

function ensureScoped(path: string): string {
    return path.startsWith('@') ? path : `@${path.replace(/^\/+/, '')}`;
}

export function resolveOptions(input: Schema) {
    const name = input.name.trim();
    const path = input.path.trim();
    const preparedNames = names(name);

    const importPath = ensureScoped(path);

    return {
        ...input,
        name,
        path,
        importPath, // NEW
        className: preparedNames.className,
        elementClassName: preparedNames.className + 'Element',
        mixinClassName: preparedNames.className + 'Mixin',
        preparedNames,
    };
}
```

### src/generators/base-generator/base-generator.ts

**Referenced Tasks**

- **use-importpath**

Replace usage of `${options.path}` with `options.importPath`
when calling `libraryGenerator`:

```ts
await libraryGenerator(tree, {
  name: options.name,
  importPath: options.importPath,        // changed
  directory: options.path,
  ...
});
```

### src/generators/base-generator/steps/adjust-project-json.ts

**Referenced Tasks**

- **update-projectjson**

Update the `name` field to use the scoped name:

```ts
updateJson(tree, projectJsonPath, (json) => {
  json['name'] = options.importPath;   // changed
  json['release'] = { ... };
  return json;
});
```

### README.md

**Referenced Tasks**

- **docs**

Add under “Usage”:

> The generator automatically prefixes the provided `--path`
> with “@”.  
> Example:  
> `nx g @nextrap/nt-nx-generators:base --name ntl-demo --path nextrap-layout/ntl-demo`  
> produces a package named **@nextrap-layout/ntl-demo**.

## Missing Information

None – implementation is straight-forward.
