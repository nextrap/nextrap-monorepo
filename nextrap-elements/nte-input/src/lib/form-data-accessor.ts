import type { NteInput } from '../components/nte-input/nte-input';

type AccessorValue = boolean | string | string[];

type ValueCarrier = {
  value: AccessorValue;
};

export class FormDataAccessor {
  constructor(protected rootElement: HTMLElement) {}

  get data(): Record<string, AccessorValue> {
    const data: Record<string, AccessorValue> = {};

    this.rootElement.querySelectorAll('[name]').forEach((input) => {
      const name = input.getAttribute('name');
      if (!name || !('value' in input)) {
        return;
      }

      data[name] = (input as ValueCarrier).value;
    });

    return data;
  }

  set data(values: Record<string, AccessorValue>) {
    for (const name in values) {
      const value = values[name];
      const input = this.rootElement.querySelector(`[name="${name}"]`) as NteInput | HTMLInputElement | null;

      if (!input || !('value' in input)) {
        continue;
      }

      (input as ValueCarrier).value = value;
    }
  }
}
