import '@nextrap/nte-demo-viewer';
import '@nextrap/style-base';
import '@nextrap/style-typography';
import '@nextrap/style-utils';
import '../index.ts';
import { FormDataAccessor } from '../src/lib/form-data-accessor';
import './main.scss';

type DemoValue = boolean | string | string[];

type DemoData = Record<string, DemoValue>;

function setupFormDataDemo() {
  const form = document.getElementById('formdata-demo-form');
  const output = document.getElementById('formdata-json');

  if (!(form instanceof HTMLFormElement) || !(output instanceof HTMLTextAreaElement)) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const entries = Array.from(new FormData(form).entries()).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    output.value = JSON.stringify(entries, null, 2);
  });
}

function setupFormDataAccessorDemo() {
  const root = document.getElementById('form-data-demo');
  const output = document.getElementById('form-data-json');

  if (!(root instanceof HTMLElement) || !(output instanceof HTMLTextAreaElement)) {
    return;
  }

  const accessor = new FormDataAccessor(root);
  let syncingFromJson = false;

  const syncOutput = () => {
    if (syncingFromJson) {
      return;
    }

    output.value = JSON.stringify(accessor.data, null, 2);
    output.dataset.invalid = 'false';
  };

  const applyJson = () => {
    try {
      const parsed = JSON.parse(output.value) as unknown;

      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('JSON must be an object');
      }

      syncingFromJson = true;
      accessor.data = parsed as DemoData;
      syncingFromJson = false;
      output.dataset.invalid = 'false';
      output.value = JSON.stringify(accessor.data, null, 2);
    } catch {
      syncingFromJson = false;
      output.dataset.invalid = 'true';
    }
  };

  root.addEventListener('input', () => {
    syncOutput();
  });

  root.addEventListener('change', () => {
    syncOutput();
  });

  output.addEventListener('input', () => {
    applyJson();
  });

  syncOutput();
}

setupFormDataDemo();
setupFormDataAccessorDemo();
