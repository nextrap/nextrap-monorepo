import { html } from 'lit';
import { describe, expect, it, vi } from 'vitest';

import '../../index';
import { AbstractNteInputPlugin } from '../../lib/plugin';
import type { NteInputValue } from '../../lib/types';
import { NteInput } from './nte-input';

describe('NteInput', () => {
  it('should create an element', () => {
    const element = new NteInput();

    expect(element).toBeInstanceOf(NteInput);
  });

  it('renders label and validation message box', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.label = 'E-Mail';
    element.validationMessage = 'Pflichtfeld';
    document.body.appendChild(element);

    await element.updateComplete;

    expect(element.shadowRoot?.getElementById('label')?.textContent?.trim()).toBe('E-Mail');
    expect(element.shadowRoot?.querySelector('[part="validation"]')?.textContent?.trim()).toContain('Pflichtfeld');

    element.remove();
  });

  it('renders plugin html for the matching type', async () => {
    const type = 'spec-text';

    if (!NteInput.getPlugin(type)) {
      class SpecTextPlugin extends AbstractNteInputPlugin {
        static readonly types = [type];

        override render() {
          return html`<input id="plugin-control" />`;
        }
      }

      NteInput.registerPlugin(SpecTextPlugin);
    }

    const element = document.createElement('nte-input') as NteInput;
    element.type = type;
    document.body.appendChild(element);

    await element.updateComplete;

    expect(element.shadowRoot?.getElementById('plugin-control')).toBeInstanceOf(HTMLInputElement);

    element.remove();
  });

  it('throws when a type is registered twice', () => {
    const type = 'spec-duplicate';

    if (!NteInput.getPlugin(type)) {
      class SpecDuplicatePlugin extends AbstractNteInputPlugin {
        static readonly types = [type];

        override render() {
          return html``;
        }
      }

      NteInput.registerPlugin(SpecDuplicatePlugin);
    }

    class SpecDuplicatePluginAgain extends AbstractNteInputPlugin {
      static readonly types = [type];

      override render() {
        return html``;
      }
    }

    expect(() => NteInput.registerPlugin(SpecDuplicatePluginAgain)).toThrow(
      `Plugin for input type "${type}" is already registered.`,
    );
  });

  it('calls plugin connected once per element lifecycle', async () => {
    const type = 'spec-init';
    const connected = vi.fn();

    if (!NteInput.getPlugin(type)) {
      class SpecInitPlugin extends AbstractNteInputPlugin {
        static readonly types = [type];

        override render() {
          return html`<input />`;
        }

        override connected() {
          connected();
        }
      }

      NteInput.registerPlugin(SpecInitPlugin);
    }

    const element = document.createElement('nte-input') as NteInput;
    element.type = type;
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    expect(connected).toHaveBeenCalledTimes(1);

    element.remove();
  });

  it('reflects has-value when the rendered control changes', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'text';
    document.body.appendChild(element);

    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input');
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(element.hasAttribute('has-value')).toBe(false);

    if (input instanceof HTMLInputElement) {
      input.value = 'abc';
      input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }

    await element.updateComplete;

    expect(element.hasAttribute('has-value')).toBe(true);

    element.remove();
  });

  it('lets the plugin request an active hoverlabel state', async () => {
    const type = 'spec-hoverlabel';

    if (!NteInput.getPlugin(type)) {
      class SpecHoverlabelPlugin extends AbstractNteInputPlugin {
        static readonly types = [type];

        override render() {
          return html`<input />`;
        }

        override isHoverlabelActive() {
          return true;
        }
      }

      NteInput.registerPlugin(SpecHoverlabelPlugin);
    }

    const element = document.createElement('nte-input') as NteInput;
    element.type = type;
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    expect(element.hasAttribute('hoverlabel-active')).toBe(true);

    element.remove();
  });

  it('forwards plugin value accessors and selectedOptions via the host element', async () => {
    const type = 'spec-accessors';

    if (!NteInput.getPlugin(type)) {
      class SpecAccessorsPlugin extends AbstractNteInputPlugin {
        static readonly types = [type];

        override render() {
          return html`<input />`;
        }

        override getValue() {
          return this.host.getAttribute('data-value') ?? '';
        }

        override setValue(value: NteInputValue) {
          if (value === null || value === undefined || value === '') {
            this.host.removeAttribute('data-value');
          } else {
            this.host.setAttribute('data-value', String(value));
          }
        }

        override getSelectedOptions() {
          return [{ value: 'one', label: 'One' }];
        }
      }

      NteInput.registerPlugin(SpecAccessorsPlugin);
    }

    const element = document.createElement('nte-input') as NteInput;
    element.type = type;
    document.body.appendChild(element);

    await element.updateComplete;

    element.value = 'abc';

    expect(element.value).toBe('abc');
    expect(element.selectedOptions.map((option) => option.value)).toEqual(['one']);

    element.remove();
  });

  it('does not switch the plugin instance after the first resolution', async () => {
    const firstType = 'spec-fixed-plugin-a';
    const secondType = 'spec-fixed-plugin-b';

    if (!NteInput.getPlugin(firstType)) {
      class SpecFixedPluginA extends AbstractNteInputPlugin {
        static readonly types = [firstType];

        override render() {
          return html`<input data-plugin="a" />`;
        }
      }

      NteInput.registerPlugin(SpecFixedPluginA);
    }

    if (!NteInput.getPlugin(secondType)) {
      class SpecFixedPluginB extends AbstractNteInputPlugin {
        static readonly types = [secondType];

        override render() {
          return html`<textarea data-plugin="b"></textarea>`;
        }
      }

      NteInput.registerPlugin(SpecFixedPluginB);
    }

    const element = document.createElement('nte-input') as NteInput;
    element.type = firstType;
    document.body.appendChild(element);

    await element.updateComplete;

    element.type = secondType;
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('input[data-plugin="a"]')).toBeInstanceOf(HTMLInputElement);
    expect(element.shadowRoot?.querySelector('textarea[data-plugin="b"]')).toBeNull();

    element.remove();
  });

  it('default select plugin copies wrapped options and selects the current value', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'select';
    element.setAttribute('value', 'inprogress');
    element.innerHTML = `
      <options>
        <option value="draft">Entwurf</option>
        <option value="inprogress">In Bearbeitung</option>
      </options>
    `;
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    const select = element.shadowRoot?.querySelector('select');
    expect(select).toBeInstanceOf(HTMLSelectElement);
    expect(select?.options).toHaveLength(2);
    expect(select?.value).toBe('inprogress');
    expect(element.value).toBe('inprogress');
    expect(element.selectedOptions.map((option) => option.value)).toEqual(['inprogress']);

    element.remove();
  });

  it('default select plugin prefers data-options over wrapped options', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'select';
    element.setAttribute('data-options', 'draft|Entwurf;active|Aktiv');
    element.setAttribute('value', 'active');
    element.innerHTML = `
      <options>
        <option value="ignored">Ignored</option>
      </options>
    `;
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    const select = element.shadowRoot?.querySelector('select');
    expect(select).toBeInstanceOf(HTMLSelectElement);
    expect(Array.from(select?.options ?? []).map((option) => option.value)).toEqual(['draft', 'active']);
    expect(select?.value).toBe('active');

    element.remove();
  });

  it('default textarea plugin syncs value and grows up to the configured max height', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'textarea';
    element.setAttribute('value', 'Initial text');
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    const textarea = element.shadowRoot?.querySelector('textarea');
    expect(textarea).toBeInstanceOf(HTMLTextAreaElement);
    expect((textarea as HTMLTextAreaElement).value).toBe('Initial text');

    if (textarea instanceof HTMLTextAreaElement) {
      textarea.style.minHeight = '40px';
      textarea.style.maxHeight = '100px';
      Object.defineProperty(textarea, 'scrollHeight', {
        configurable: true,
        get: () => 200,
      });

      textarea.value = 'A lot more text';
      textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

      expect(element.value).toBe('A lot more text');
      expect(textarea.style.height).toBe('100px');
      expect(textarea.style.overflowY).toBe('auto');
    }

    element.remove();
  });

  it('default textarea plugin respects the configured minimum height', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'textarea';
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    const textarea = element.shadowRoot?.querySelector('textarea');
    expect(textarea).toBeInstanceOf(HTMLTextAreaElement);

    if (textarea instanceof HTMLTextAreaElement) {
      textarea.style.minHeight = '48px';
      textarea.style.maxHeight = '120px';
      Object.defineProperty(textarea, 'scrollHeight', {
        configurable: true,
        get: () => 20,
      });

      textarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

      expect(textarea.style.height).toBe('48px');
      expect(textarea.style.overflowY).toBe('hidden');
    }

    element.remove();
  });

  it('default select-radio plugin returns an array value and selected options', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'select-radio';
    element.value = ['inprogress'];
    element.innerHTML = `
      <options>
        <option value="draft">Entwurf</option>
        <option value="inprogress">In Bearbeitung</option>
      </options>
    `;
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    const radios = Array.from(element.shadowRoot?.querySelectorAll('input[type="radio"]') ?? []);

    expect(radios).toHaveLength(2);
    expect((radios[1] as HTMLInputElement).checked).toBe(true);
    expect(element.hasAttribute('has-value')).toBe(true);
    expect(element.value).toEqual(['inprogress']);
    expect(element.selectedOptions.map((option) => option.value)).toEqual(['inprogress']);

    element.value = ['draft'];
    await element.updateComplete;

    expect((radios[0] as HTMLInputElement).checked).toBe(true);
    expect(element.value).toEqual(['draft']);

    element.remove();
  });

  it('default select-radio plugin renders checkboxes for multiple and syncs selected values', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'select-radio';
    element.multiple = true;
    element.options = [
      { value: 'draft', label: 'Entwurf' },
      { value: 'active', label: 'Aktiv' },
    ];
    element.value = ['draft'];
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    const checkboxes = Array.from(element.shadowRoot?.querySelectorAll('input[type="checkbox"]') ?? []);

    expect(checkboxes).toHaveLength(2);
    expect((checkboxes[0] as HTMLInputElement).checked).toBe(true);
    expect((checkboxes[1] as HTMLInputElement).checked).toBe(false);
    expect(element.value).toEqual(['draft']);

    (checkboxes[1] as HTMLInputElement).checked = true;
    (checkboxes[1] as HTMLInputElement).dispatchEvent(new Event('change', { bubbles: true, composed: true }));

    expect(element.value).toEqual(['draft', 'active']);
    expect(element.selectedOptions.map((option) => option.value)).toEqual(['draft', 'active']);
    expect(element.hasAttribute('has-value')).toBe(true);

    element.remove();
  });

  it('default token-input plugin keeps an array value and supports add/remove interactions', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'token-input';
    element.options = [
      { value: 'news', label: 'News' },
      { value: 'events', label: 'Events' },
    ];
    element.value = ['news'];
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    const input = element.shadowRoot?.querySelector('input[type="text"]');
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(element.value).toEqual(['news']);
    expect(element.selectedOptions.map((option) => option.value)).toEqual(['news']);

    if (input instanceof HTMLInputElement) {
      input.value = 'events';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    }

    await element.updateComplete;

    expect(element.value).toEqual(['news', 'events']);
    expect(element.selectedOptions.map((option) => option.value)).toEqual(['news', 'events']);
    expect(element.hasAttribute('has-value')).toBe(true);

    const removeButton = element.shadowRoot?.querySelector('[part="token-remove"]');
    expect(removeButton).toBeInstanceOf(HTMLButtonElement);

    if (removeButton instanceof HTMLButtonElement) {
      removeButton.click();
    }

    await element.updateComplete;

    expect(element.value).toEqual(['events']);
    expect(element.selectedOptions.map((option) => option.value)).toEqual(['events']);

    element.remove();
  });

  it('default token-input plugin can restrict values to configured options via strict', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'token-input';
    element.setAttribute('strict', '');
    element.options = [
      { value: 'news', label: 'News' },
      { value: 'events', label: 'Events' },
    ];
    element.value = ['news', 'custom'];
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    expect(element.value).toEqual(['news']);

    const input = element.shadowRoot?.querySelector('input[type="text"]');
    expect(input).toBeInstanceOf(HTMLInputElement);

    if (input instanceof HTMLInputElement) {
      input.value = 'custom';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    }

    await element.updateComplete;

    expect(element.value).toEqual(['news']);

    if (input instanceof HTMLInputElement) {
      input.value = 'events';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    }

    await element.updateComplete;

    expect(element.value).toEqual(['news', 'events']);

    element.remove();
  });

  it('default token-input plugin validates required by token count', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'token-input';
    element.setAttribute('required', '');
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    expect(element.hasAttribute('invalid')).toBe(false);

    element.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.hasAttribute('invalid')).toBe(true);

    element.value = ['alpha'];
    element.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(element.hasAttribute('valid')).toBe(true);

    element.remove();
  });

  it('default checkbox plugin uses boolean values via the host value accessor', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'checkbox';
    element.label = 'AGB akzeptieren';
    element.setAttribute('value', 'yes');
    element.value = true;
    document.body.appendChild(element);

    await element.updateComplete;

    const checkbox = element.shadowRoot?.querySelector('input[type="checkbox"]');
    const checkboxText = element.shadowRoot?.querySelector('[part="checkbox-text"]');
    const topLabel = element.shadowRoot?.getElementById('label');

    expect(checkbox).toBeInstanceOf(HTMLInputElement);
    expect((checkbox as HTMLInputElement).checked).toBe(true);
    expect(element.value).toBe(true);
    expect(element.selectedOptions.map((option) => option.value)).toEqual(['yes']);
    expect(checkboxText?.textContent?.trim()).toBe('AGB akzeptieren');
    expect(topLabel?.hasAttribute('hidden')).toBe(true);

    element.value = false;
    await element.updateComplete;

    expect((checkbox as HTMLInputElement).checked).toBe(false);
    expect(element.value).toBe(false);
    expect(element.selectedOptions).toEqual([]);

    element.remove();
  });

  it('exposes the name accessor used by form-associated integration', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'text';
    element.setAttribute('name', 'name');
    element.value = 'Max';
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    expect(element.name).toBe('name');
    expect(element.value).toBe('Max');

    element.remove();
  });
});
