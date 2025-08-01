import { names } from '@nx/devkit';
import { nextrap, nextrapScope, PackageType } from 'nextrap-base/nt-meta/src';
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
  const prefixedName = `${prefix}${preparedNames.fileName}`;
  const projectDirName = `${groupDirectoryName}/${prefixedName}`;
  return {
    ...input,
    packageTypeEnumProp: input.type.toUpperCase(),
    scope: nextrapScope,
    /**
     * @example test-element
     */
    name: preparedNames.fileName,
    /**
     * @example nte-
     */
    prefix,
    /**
     * @example nte-test-element
     */
    prefixedName,
    /**
     * @example nextrap-elements
     */
    groupDirectoryName,
    /**
     * @example nextrap-elements/nte-test-element
     */
    projectDirName,
    prefixedClassName: names(`${prefix}${preparedNames.className}`).className,
  };
}

export type ResolvedOptions = ReturnType<typeof resolveOptions>;
