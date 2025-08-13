import { names } from '@nx/devkit';
import { Schema } from './base-schema';

export function resolveOptions(input: Schema) {
  const name = input.name.trim();
  const path = input.path.trim();
  const preparedNames = names(input.name.trim());

  return {
    ...input,

    name,
    path,
    className: preparedNames.className,
    elementClassName: preparedNames.className + 'Element',

    mixinClassName: preparedNames.className + 'Mixin',
    preparedNames,
  };
}

export type ResolvedOptions = ReturnType<typeof resolveOptions>;
