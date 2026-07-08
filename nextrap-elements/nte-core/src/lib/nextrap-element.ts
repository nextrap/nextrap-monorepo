/**
 * Shared utility functions for file operations.
 */
import {
  BreakPointMixin,
  BreakPointMixinInterface,
  EventBindingsMixin,
  LoaderMixin,
  LoggerMixinInterface,
  LoggingMixin,
  SlotVisibilityInterface,
  SlotVisibilityMixin,
} from '@trunkjs/browser-utils';
import { LitElement } from 'lit';
import { SetDefaultStyleMixin, SetDefaultStyleMixinInterface } from './SetDefaultStyleMixin';

export interface NteFeatures {
  logging?: boolean;
  slotVisibility?: boolean;
  eventBinding?: boolean;
  breakpoints?: boolean;
  setDefaultStyle?: boolean;
}

export const defaultNteFeatures: NteFeatures = {
  logging: true,
  slotVisibility: false,
  eventBinding: false,
  breakpoints: false,
  setDefaultStyle: true,
};

export type Ctor<T = object> = abstract new (...args: any[]) => T;

export type InternalNextrapElementType = typeof LitElement &
  Ctor<LoggerMixinInterface> &
  Ctor<SlotVisibilityInterface> &
  Ctor<BreakPointMixinInterface> &
  Ctor<SetDefaultStyleMixinInterface>;

export function nextrap_element(features: NteFeatures = {}) {
  const mergedFeatures = { ...defaultNteFeatures, ...features };

  // Runtime-Konstruktion bleibt identisch; die Typen werden über ComposeNtlMixins abgebildet.
  let constructor = LitElement;

  // Always add the loader
  constructor = LoaderMixin(constructor);

  if (mergedFeatures.setDefaultStyle) {
    constructor = SetDefaultStyleMixin(constructor);
  }

  if (mergedFeatures.logging) {
    constructor = LoggingMixin(constructor);
  }
  if (mergedFeatures.slotVisibility) {
    constructor = SlotVisibilityMixin(constructor);
  }
  if (mergedFeatures.breakpoints) {
    constructor = BreakPointMixin(constructor);
  }
  if (mergedFeatures.eventBinding) {
    constructor = EventBindingsMixin(constructor);
  }

  return constructor as InternalNextrapElementType;
}
