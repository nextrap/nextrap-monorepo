import type { InputOption, InputOptionsType } from './types';

function normalizeOption(option: unknown): InputOption | null {
  if (typeof option === 'string') {
    return { value: option, label: option };
  }

  if (option && typeof option === 'object') {
    const candidate = option as Partial<InputOption> & Record<string, unknown>;

    if (typeof candidate.value === 'string' || typeof candidate.label === 'string') {
      return {
        value: String(candidate.value ?? candidate.label ?? ''),
        label: String(candidate.label ?? candidate.value ?? ''),
        disabled: Boolean(candidate.disabled),
        html: typeof candidate.html === 'string' ? candidate.html : undefined,
      };
    }

    const entry = Object.entries(candidate)[0];
    if (entry && typeof entry[0] === 'string' && typeof entry[1] === 'string') {
      return {
        value: entry[0],
        label: entry[1],
      };
    }
  }

  return null;
}

export function parseInputOptions(value: string | null | undefined): InputOptionsType {
  if (!value) {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;

      if (Array.isArray(parsed)) {
        return parsed.map(normalizeOption).filter((option): option is InputOption => option !== null);
      }

      if (parsed && typeof parsed === 'object') {
        return Object.entries(parsed as Record<string, string>).map(([key, label]) => ({
          value: key,
          label: String(label),
        }));
      }
    } catch (error) {
      console.warn('Invalid data-options JSON:', error);
      return [];
    }
  }

  return trimmed
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [valuePart, labelPart] = entry.split('|').map((part) => part.trim());
      const value = valuePart ?? '';
      const label = labelPart || valuePart || '';

      return {
        value,
        label,
      };
    });
}

export function serializeInputOptions(value: InputOptionsType): string {
  return JSON.stringify(value);
}
