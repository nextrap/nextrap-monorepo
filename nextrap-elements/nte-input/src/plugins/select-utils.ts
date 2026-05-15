import type { NteInput } from '../components/nte-input/nte-input';
import type { InputOption, InputOptionsType } from '../lib/types';

export function getSelect(element: NteInput) {
  return element.renderRoot.querySelector('select');
}

export function createOptionsFromData(dataOptions: InputOptionsType): HTMLOptionElement[] {
  return dataOptions.map((item) => {
    const option = document.createElement('option');
    option.value = item.value;
    option.label = item.label;
    option.disabled = Boolean(item.disabled);

    if (item.html) {
      option.innerHTML = item.html;
    } else {
      option.textContent = item.label;
    }

    return option;
  });
}

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

export function syncSelectedValue(element: NteInput, select: HTMLSelectElement) {
  const value = element.getAttribute('value');

  if (value === null) {
    return;
  }

  if (select.multiple) {
    const selectedValues = new Set(parseMultipleValues(value));
    Array.from(select.options).forEach((option) => {
      option.selected = selectedValues.has(option.value);
    });
    return;
  }

  select.value = value;

  if (select.value !== value) {
    const fallback = Array.from(select.options).find((option) => option.value === value);
    if (fallback) {
      fallback.selected = true;
    }
  }
}

export function syncOptions(element: NteInput) {
  const select = getSelect(element);
  if (!(select instanceof HTMLSelectElement)) {
    return;
  }

  const options = createOptionsFromData(resolveInputOptions(element));
  select.replaceChildren(...options);

  syncSelectedValue(element, select);
}
