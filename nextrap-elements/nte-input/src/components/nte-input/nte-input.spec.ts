import { html } from 'lit';
import { describe, expect, it, vi } from 'vitest';

import '../../index';
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
      NteInput.registerPlugin({
        types: [type],
        getHtml: () => html`<input id="plugin-control" />`,
      });
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
      NteInput.registerPlugin({
        types: [type],
      });
    }

    expect(() =>
      NteInput.registerPlugin({
        types: [type],
      }),
    ).toThrow(`Plugin for input type "${type}" is already registered.`);
  });

  it('runs plugin init once per type', async () => {
    const type = 'spec-init';
    const init = vi.fn();

    if (!NteInput.getPlugin(type)) {
      NteInput.registerPlugin({
        types: [type],
        getHtml: () => html`<input />`,
        init,
      });
    }

    const element = document.createElement('nte-input') as NteInput;
    element.type = type;
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    expect(init).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledWith(element);

    element.remove();
  });

  it('reflects has-value when the rendered control changes', async () => {
    const type = 'spec-value';

    if (!NteInput.getPlugin(type)) {
      NteInput.registerPlugin({
        types: [type],
        getHtml: () => html`<input />`,
      });
    }

    const element = document.createElement('nte-input') as NteInput;
    element.type = type;
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
      NteInput.registerPlugin({
        types: [type],
        getHtml: () => html`<input />`,
        shouldHoverlabelFloat: () => true,
      });
    }

    const element = document.createElement('nte-input') as NteInput;
    element.type = type;
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    expect(element.hasAttribute('hoverlabel-active')).toBe(true);

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

      expect(element.getAttribute('value')).toBe('A lot more text');
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

  it('default select-radio plugin renders radios and syncs the selected value', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'select-radio';
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

    const radios = Array.from(element.shadowRoot?.querySelectorAll('input[type="radio"]') ?? []);

    expect(radios).toHaveLength(2);
    expect((radios[1] as HTMLInputElement).checked).toBe(true);
    expect(element.hasAttribute('has-value')).toBe(true);

    (radios[0] as HTMLInputElement).checked = true;
    (radios[0] as HTMLInputElement).dispatchEvent(new Event('change', { bubbles: true, composed: true }));

    expect(element.getAttribute('value')).toBe('draft');

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
    element.setAttribute('value', '["draft"]');
    document.body.appendChild(element);

    await element.updateComplete;
    await element.updateComplete;

    const checkboxes = Array.from(element.shadowRoot?.querySelectorAll('input[type="checkbox"]') ?? []);

    expect(checkboxes).toHaveLength(2);
    expect((checkboxes[0] as HTMLInputElement).checked).toBe(true);
    expect((checkboxes[1] as HTMLInputElement).checked).toBe(false);

    (checkboxes[1] as HTMLInputElement).checked = true;
    (checkboxes[1] as HTMLInputElement).dispatchEvent(new Event('change', { bubbles: true, composed: true }));

    expect(JSON.parse(element.getAttribute('value') ?? '[]')).toEqual(['draft', 'active']);
    expect(element.hasAttribute('has-value')).toBe(true);

    element.remove();
  });

  it('default checkbox plugin renders label text next to the checkbox', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.type = 'checkbox';
    element.label = 'AGB akzeptieren';
    element.setAttribute('checked', '');
    document.body.appendChild(element);

    await element.updateComplete;

    const checkbox = element.shadowRoot?.querySelector('input[type="checkbox"]');
    const checkboxText = element.shadowRoot?.querySelector('[part="checkbox-text"]');
    const topLabel = element.shadowRoot?.getElementById('label');

    expect(checkbox).toBeInstanceOf(HTMLInputElement);
    expect((checkbox as HTMLInputElement).checked).toBe(true);
    expect(checkboxText?.textContent?.trim()).toBe('AGB akzeptieren');
    expect(topLabel?.hasAttribute('hidden')).toBe(true);

    element.remove();
  });
});
