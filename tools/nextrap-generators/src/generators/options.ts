import { nextrap, nextrapScope, PackageType } from '@nextrap/nextrap-constants';
import { names } from '@nx/devkit';
import { Schema } from './schema';

export function resolveOptions(input: Schema) {
  const preparedNames = names(input.name.trim());
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
  const projectDirName = `${groupDirectoryName}/${prefix}${preparedNames.fileName}`;
  return {
    ...input,
    scope: nextrapScope,
    name: preparedNames.fileName,
    prefix,
    /**
     * @example nextrap-elements/nte-test-element
     */
    projectDirName,
    prefixedClassName: names(`${prefix}${preparedNames.className}`).className,
  };
}

export type ResolvedOptions = ReturnType<typeof resolveOptions>;
