import { FormDataAccessor } from '@nextrap/nte-input';
import '@nextrap/style-base';
import '@nextrap/style-typography';
import '@nextrap/style-utils';
import '../index.ts';
import './main.scss';

type DemoValue = boolean | string | string[];

type DemoData = Record<string, DemoValue>;

export function renderDocumentDemo(
  root: HTMLElement,
  documentHtml: string,
  onReady?: (container: HTMLElement) => void,
) {
  const parsed = new DOMParser().parseFromString(documentHtml, 'text/html');
  const body = parsed.body;
  const main = parsed.querySelector('main');
  const wrapper = document.createElement('div');

  wrapper.className = 'nte-input-demo';

  if (body.className.trim()) {
    wrapper.classList.add(...body.className.trim().split(/\s+/));
  }

  body.querySelectorAll('script').forEach((script) => script.remove());
  wrapper.innerHTML = main ? main.outerHTML : body.innerHTML;
  root.replaceChildren(wrapper);

  onReady?.(wrapper);
}

export function setupFormDataDemo(root: ParentNode = document) {
  const form = root.querySelector('#formdata-demo-form');
  const output = root.querySelector('#formdata-json');

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

export function setupFormDataAccessorDemo(root: ParentNode = document) {
  const formRoot = root.querySelector('#form-data-demo');
  const output = root.querySelector('#form-data-json');

  if (!(formRoot instanceof HTMLElement) || !(output instanceof HTMLTextAreaElement)) {
    return;
  }

  const accessor = new FormDataAccessor(formRoot);
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

  formRoot.addEventListener('input', () => {
    syncOutput();
  });

  formRoot.addEventListener('change', () => {
    syncOutput();
  });

  output.addEventListener('input', () => {
    applyJson();
  });

  syncOutput();
}

export function setupValidationDemo(root: ParentNode = document) {
  const form = root.querySelector('form[action="/demo/05-validation.html"]');

  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });
}

setupFormDataDemo();
setupFormDataAccessorDemo();
setupValidationDemo();
