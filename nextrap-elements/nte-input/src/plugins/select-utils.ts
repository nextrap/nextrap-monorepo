import type { NteInput } from '../components/nte-input/nte-input';
import type { InputOption, InputOptionsType, NteInputValue } from '../lib/types';

export function getWrappedOptions(element: NteInput): InputOptionsType {
  const optionsWrapper = element.querySelector('options');

  if (!(optionsWrapper instanceof HTMLElement)) {
    return [];
  }

  return Array.from(optionsWrapper.querySelectorAll('option')).map(
    (sourceOption): InputOption => ({
      value: sourceOption.value,
      label: sourceOption.label || sourceOption.textContent || sourceOption.value,
      disabled: sourceOption.disabled,
      html: sourceOption.innerHTML || undefined,
    }),
  );
}

export function resolveInputOptions(element: NteInput): InputOptionsType {
  return element.options && element.options.length > 0 ? element.options : getWrappedOptions(element);
}

export function parseMultipleValues(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item));
      }
    } catch {
      // fall back to string splitting
    }
  }

  return trimmed
    .split(/[;,]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function normalizeValueArray(value: NteInputValue): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === 'boolean') {
    return value ? ['true'] : [];
  }

  if (value === null || value === undefined) {
    return [];
  }

  return parseMultipleValues(String(value));
}

export function resolveSelectedInputOptions(element: NteInput, selectedValues: Iterable<string>): InputOptionsType {
  const valueSet = new Set(Array.from(selectedValues).map((value) => String(value)));

  return resolveInputOptions(element).filter((option) => valueSet.has(option.value));
}
