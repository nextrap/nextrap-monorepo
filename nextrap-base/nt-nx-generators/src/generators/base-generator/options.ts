import { names } from '@nx/devkit';
import { Schema } from './base-schema';

// Helper to ensure the importPath is always scoped with '@'
function ensureScoped(path: string): string {
  return path.startsWith('@') ? path : `@${path.replace(/^\/+/, '')}`;
}

export function resolveOptions(input: Schema) {
  const name = input.name.trim();
  const path = input.path.trim();
  const preparedNames = names(name);

  const importPath = ensureScoped(name);

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

export type ResolvedOptions = ReturnType<typeof resolveOptions>;
