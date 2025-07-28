import { nextrap, nextrapScope, PackageType } from '@nextrap/nextrap-constants';
import { names } from '@nx/devkit';
import { Schema } from './schema';

export function resolveOptions(input: Schema) {
  const name = names(input.name.trim()).fileName;
  const prefix = (() => {
    switch (input.type) {
      case PackageType.ELEMENTS:
        return 'nte-';
      case PackageType.LAYOUT:
        return 'ntl-';
      default:
        return '';
    }
  })();
  const groupDirectoryName = `${nextrap}-${input.type}`;
  const projectDirName = `${groupDirectoryName}/${prefix}${name}`;
  return {
    ...input,
    scope: nextrapScope,
    name,
    prefix,
    projectDirName,
  };
}

export type ResolvedOptions = ReturnType<typeof resolveOptions>;
