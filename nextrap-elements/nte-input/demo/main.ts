import '@nextrap/nte-demo-viewer';
import '@nextrap/style-base';
import '@nextrap/style-typography';
import '@nextrap/style-utils';
import '../index.ts';
import './main.scss';

import type { NteInput } from '../src/index';

type JsonRecord = Record<string, unknown>;

type SupportedDemoControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function getNamedInputs(form: HTMLFormElement) {
  return Array.from(form.querySelectorAll('nte-input[name]')) as NteInput[];
}

function getControl(element: NteInput) {
  return element.shadowRoot?.querySelector('input, select, textarea') as SupportedDemoControl | null;
}

function getGroupInputs(element: NteInput) {
  return Array.from(
    element.shadowRoot?.querySelectorAll('input[type="checkbox"], input[type="radio"]') ?? [],
  ) as HTMLInputElement[];
}

function isDisabled(element: NteInput) {
  const control = getControl(element);
  return element.hasAttribute('disabled') || Boolean(control?.disabled);
}

function appendElementValue(formData: FormData, element: NteInput) {
  const name = element.getAttribute('name');
  if (!name || isDisabled(element)) {
    return;
  }

  const type = element.type.trim().toLowerCase();

  if (type === 'checkbox') {
    const input = element.shadowRoot?.querySelector('input[type="checkbox"]');

    if (input instanceof HTMLInputElement && input.checked) {
      formData.append(name, input.value || 'on');
    }

    return;
  }

  if (type === 'select-radio') {
    const checkedInputs = getGroupInputs(element).filter((input) => input.checked);

    checkedInputs.forEach((input) => {
      formData.append(name, input.value);
    });

    return;
  }

  const control = getControl(element);
  if (!control) {
    return;
  }

  formData.append(name, control.value);
}

function formDataToObject(formData: FormData) {
  const result: JsonRecord = {};

  for (const [key, value] of formData.entries()) {
    const nextValue = String(value);
    const currentValue = result[key];

    if (currentValue === undefined) {
      result[key] = nextValue;
      continue;
    }

    if (Array.isArray(currentValue)) {
      result[key] = [...currentValue, nextValue];
      continue;
    }

    result[key] = [String(currentValue), nextValue];
  }

  return result;
}

function normalizeStringValue(value: unknown) {
  if (Array.isArray(value)) {
    return value[0] ? String(value[0]) : '';
  }

  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function normalizeArrayValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry));
  }

  if (value === null || value === undefined || value === '') {
    return [];
  }

  return [String(value)];
}

function normalizeBooleanValue(value: unknown) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return ['true', '1', 'on', 'yes'].includes(value.toLowerCase());
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  return Boolean(value);
}

function dispatchControlEvent(control: EventTarget, type: 'input' | 'change') {
  control.dispatchEvent(new Event(type, { bubbles: true, composed: true }));
}

function updateTextLikeElement(element: NteInput, value: unknown) {
  const nextValue = normalizeStringValue(value);
  const control = getControl(element);

  if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) {
    return;
  }

  control.value = nextValue;

  if (nextValue) {
    element.setAttribute('value', nextValue);
  } else {
    element.removeAttribute('value');
  }

  dispatchControlEvent(control, 'input');
}

function updateSelectElement(element: NteInput, value: unknown) {
  const control = getControl(element);
  const nextValue = normalizeStringValue(value);

  if (!(control instanceof HTMLSelectElement)) {
    return;
  }

  control.value = nextValue;

  if (nextValue) {
    element.setAttribute('value', nextValue);
  } else {
    element.removeAttribute('value');
  }

  dispatchControlEvent(control, 'change');
}

function updateCheckboxElement(element: NteInput, value: unknown) {
  const control = element.shadowRoot?.querySelector('input[type="checkbox"]');
  const nextValue = normalizeBooleanValue(value);

  if (!(control instanceof HTMLInputElement)) {
    return;
  }

  control.checked = nextValue;

  if (nextValue) {
    element.setAttribute('checked', '');
  } else {
    element.removeAttribute('checked');
  }

  dispatchControlEvent(control, 'change');
}

function updateSelectRadioElement(element: NteInput, value: unknown) {
  const inputs = getGroupInputs(element);
  if (inputs.length === 0) {
    return;
  }

  if (element.multiple) {
    const values = new Set(normalizeArrayValue(value));

    inputs.forEach((input) => {
      input.checked = values.has(input.value);
    });

    if (values.size > 0) {
      element.setAttribute('value', JSON.stringify(Array.from(values)));
    } else {
      element.removeAttribute('value');
    }
  } else {
    const nextValue = normalizeStringValue(value);

    inputs.forEach((input) => {
      input.checked = input.value === nextValue;
    });

    if (nextValue) {
      element.setAttribute('value', nextValue);
    } else {
      element.removeAttribute('value');
    }
  }

  dispatchControlEvent(inputs[0], 'change');
}

function applyJsonToForm(form: HTMLFormElement, data: JsonRecord) {
  getNamedInputs(form).forEach((element) => {
    const name = element.getAttribute('name');
    if (!name) {
      return;
    }

    const nextValue = data[name];
    const type = element.type.trim().toLowerCase();

    if (type === 'checkbox') {
      updateCheckboxElement(element, nextValue);
      return;
    }

    if (type === 'select-radio') {
      updateSelectRadioElement(element, nextValue);
      return;
    }

    if (type === 'select') {
      updateSelectElement(element, nextValue);
      return;
    }

    updateTextLikeElement(element, nextValue);
  });
}

function setupFormDataDemo() {
  const form = document.getElementById('formdata-demo-form');
  const jsonField = document.getElementById('formdata-json');

  if (!(form instanceof HTMLFormElement) || !(jsonField instanceof HTMLTextAreaElement)) {
    return;
  }

  const renderFormData = () => {
    const formData = new FormData(form);

    getNamedInputs(form).forEach((element) => {
      appendElementValue(formData, element);
    });

    jsonField.value = JSON.stringify(formDataToObject(formData), null, 2);
    jsonField.dataset.invalid = 'false';
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderFormData();
  });

  jsonField.addEventListener('input', () => {
    try {
      const parsed = JSON.parse(jsonField.value) as unknown;

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('JSON must be an object');
      }

      applyJsonToForm(form, parsed as JsonRecord);
      jsonField.dataset.invalid = 'false';
    } catch {
      jsonField.dataset.invalid = 'true';
    }
  });

  renderFormData();
}

setupFormDataDemo();
