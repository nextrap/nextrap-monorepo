/**
 * Shared utility functions for file operations.
 */
import {
  BreakPointMixin,
  BreakPointMixinInterface,
  EventBindingsMixin,
  LoggerMixinInterface,
  LoggingMixin,
  SlotVisibilityInterface,
  SlotVisibilityMixin,
} from '@trunkjs/browser-utils';
import { LitElement } from 'lit';

export interface NteFeatures {
  logging?: boolean;
  slotVisibility?: boolean;
  eventBinding?: boolean;
  breakpoints?: boolean;
  subLayoutApplyMixin?: boolean;
}

export const defaultNteFeatures: NteFeatures = {
  logging: true,
  slotVisibility: false,
  eventBinding: false,
  breakpoints: false,
  subLayoutApplyMixin: false,
};

export type Ctor<T = object> = abstract new (...args: any[]) => T;

export type InternalNextrapElementType = typeof LitElement &
  Ctor<LoggerMixinInterface> &
  Ctor<SlotVisibilityInterface> &
  Ctor<BreakPointMixinInterface>;

export function nextrap_element(features: NteFeatures = {}) {
  const mergedFeatures = { ...defaultNteFeatures, ...features };

  // Runtime-Konstruktion bleibt identisch; die Typen werden über ComposeNtlMixins abgebildet.
  let constructor = LitElement;

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

class xy extends nextrap_element() {}
