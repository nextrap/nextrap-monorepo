/**
 * Shared utility functions for file operations.
 */
import { defaultNteFeatures, InternalNextrapElementType, nextrap_element, NteFeatures } from '@nextrap/nte-core';
import { SubLayoutApplyMixin } from '@trunkjs/content-pane';

export interface NtlFeatures extends NteFeatures {
  subLayoutApply?: boolean;
}

export const defaultNtlFeatures: NtlFeatures = {
  ...defaultNteFeatures,
  subLayoutApply: false,
};

type CTor<T = object> = abstract new (...args: unknown[]) => T;

export function nextrap_layout(features: NtlFeatures = {}) {
  const mergedFeatures = { ...defaultNtlFeatures, ...features };

  let c = nextrap_element(mergedFeatures);
  if (mergedFeatures.subLayoutApply) {
    c = SubLayoutApplyMixin(c);
  }
  return c as InternalNextrapElementType;
}
