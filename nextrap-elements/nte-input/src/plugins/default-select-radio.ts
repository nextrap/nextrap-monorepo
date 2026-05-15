import { html, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import type { NteInput } from '../components/nte-input/nte-input';
import type { InputOption, NteInputPlugin, NteInputRenderContext } from '../lib/types';
import { parseMultipleValues, resolveInputOptions } from './select-utils';

const changeControllers = new WeakMap<NteInput, AbortController>();
const valueObservers = new WeakMap<NteInput, MutationObserver>();

function getGroupInputs(element: NteInput) {
  return Array.from(element.renderRoot.querySelectorAll('#control input')) as HTMLInputElement[];
}

function getSelectedValues(element: NteInput) {
  const value = element.getAttribute('value');

  if (element.multiple) {
    return new Set(value ? parseMultipleValues(value) : []);
  }

  return new Set(value ? [value] : []);
}

function renderOptionLabel(option: InputOption) {
  return option.html ? unsafeHTML(option.html) : option.label;
}

function syncInputsFromValue(element: NteInput) {
  const selectedValues = getSelectedValues(element);
  const inputs = getGroupInputs(element);

  inputs.forEach((input) => {
    input.checked = selectedValues.has(input.value);
  });

  element.hasValue = inputs.some((input) => input.checked);
}

function syncValueFromInputs(element: NteInput) {
  const inputs = getGroupInputs(element);
  const checkedInputs = inputs.filter((input) => input.checked);

  if (element.multiple) {
    if (checkedInputs.length > 0) {
      element.setAttribute('value', JSON.stringify(checkedInputs.map((input) => input.value)));
    } else {
      element.removeAttribute('value');
    }

    element.hasValue = checkedInputs.length > 0;
    return;
  }

  const checkedInput = checkedInputs[0];

  if (checkedInput) {
    element.setAttribute('value', checkedInput.value);
  } else {
    element.removeAttribute('value');
  }

  element.hasValue = Boolean(checkedInput);
}

export const defaultSelectRadioPlugin: NteInputPlugin = {
  types: ['select-radio'],
  getHtml: (context) => {
    const { element, controlId, validationId } = context as NteInputRenderContext;
    const options = resolveInputOptions(element);
    const selectedValues = getSelectedValues(element);
    const inputType = element.multiple ? 'checkbox' : 'radio';
    const groupName = element.getAttribute('name') ?? controlId;
    const role = element.multiple ? 'group' : 'radiogroup';

    return html`
      <div id=${`${controlId}-group`} part="option-list" role=${role} aria-describedby=${validationId}>
        ${options.map((option, index) => {
          const optionId = index === 0 ? controlId : `${controlId}-${index}`;

          return html`
            <label part="option-label" for=${optionId}>
              <input
                id=${optionId}
                part="option-input"
                type=${inputType}
                name=${groupName}
                value=${option.value}
                aria-describedby=${validationId}
                ?checked=${selectedValues.has(option.value)}
                ?disabled=${Boolean(option.disabled) || element.hasAttribute('disabled')}
                ?required=${!element.multiple && element.hasAttribute('required')}
              />
              <span part="option-text">${renderOptionLabel(option) ?? nothing}</span>
            </label>
          `;
        })}
      </div>
    `;
  },
  init: (element) => {
    changeControllers.get(element)?.abort();
    valueObservers.get(element)?.disconnect();

    const controller = new AbortController();
    const control = element.renderRoot.querySelector('#control');

    control?.addEventListener(
      'change',
      (event) => {
        const target = event.target;

        if (!(target instanceof HTMLInputElement)) {
          return;
        }

        if (!['radio', 'checkbox'].includes(target.type)) {
          return;
        }

        syncValueFromInputs(element);
      },
      { signal: controller.signal },
    );

    changeControllers.set(element, controller);

    const observer = new MutationObserver(() => {
      void element.updateComplete.then(() => {
        syncInputsFromValue(element);
      });
    });

    observer.observe(element, {
      attributes: true,
      attributeFilter: ['value', 'multiple', 'data-options'],
    });

    valueObservers.set(element, observer);

    void element.updateComplete.then(() => {
      syncInputsFromValue(element);
    });
  },
  shouldHoverlabelFloat: (element) => element.hasValue,
};
