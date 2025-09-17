import { describe, expect } from 'vitest';
import { NteFormInput } from './nte-form-input';

describe('NteFormInput', () => {
  it('should create an element', () => {
    const el = new NteFormInput();
    expect(el).toBeInstanceOf(NteFormInput);
  });

  it('renders a basic input', async () => {
    const element = document.createElement('nte-form-input') as NteFormInput;
    document.body.appendChild(element);
    await element.updateComplete;

    const inputSlot = element.shadowRoot?.querySelector('slot[name="input"]');
    expect(inputSlot).not.toBeNull();

    document.body.removeChild(element);
  });

  it('renders with a label', async () => {
    const labelText = 'Test Label';
    const element = document.createElement('nte-form-input') as NteFormInput;
    element.label = labelText;
    document.body.appendChild(element);
    await element.updateComplete;

    const labelElement = element.shadowRoot?.querySelector('label.form-label');
    expect(labelElement).not.toBeNull();
    expect(labelElement?.textContent).toContain(labelText);

    document.body.removeChild(element);
  });

  it('renders a checkbox input', async () => {
    const element = document.createElement('nte-form-input') as NteFormInput;
    element.type = 'checkbox';
    element.label = 'Checkbox Test';
    document.body.appendChild(element);
    await element.updateComplete;

    const labelElement = element.shadowRoot?.querySelector('label.form-check-label');
    expect(labelElement).not.toBeNull();
    expect(labelElement?.textContent).toContain('Checkbox Test');

    document.body.removeChild(element);
  });
});
