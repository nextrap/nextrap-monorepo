import { html } from 'lit';
import { expect } from 'vitest';
import { render } from 'vitest-browser-lit'; // Removed screen as it's not exported
import { NxaFormInput } from './nxa-form-input';

describe('NxaFormInput', () => {
  it('should create an element', () => {
    const el = new NxaFormInput();
    expect(el).toBeInstanceOf(NxaFormInput);
  });

  it('renders a basic input', async () => {
    const { container } = render(html`
      <nxa-form-input data-testid="form-input"></nxa-form-input>
    `);
    // Use container to query for the element
    const element = container.querySelector('[data-testid="form-input"]');
    expect(element).not.toBeNull();
    await expect(element).toBeInTheDocument();
    // Check if the default slotted input is created
    const inputElement = element!.shadowRoot
      ?.querySelector('slot[name="input"]')
      ?.assignedElements()[0] as HTMLInputElement;
    expect(inputElement).toBeInstanceOf(HTMLInputElement);
  });

  it('renders with a label', async () => {
    const labelText = 'Test Label';
    const { container } = render(html`
      <nxa-form-input
        data-testid="form-input-with-label"
        label="${labelText}"
      ></nxa-form-input>
    `);
    const element = container.querySelector(
      '[data-testid="form-input-with-label"]'
    );
    expect(element).not.toBeNull();
    await expect(element).toBeInTheDocument();
    const labelElement = element!.shadowRoot?.querySelector('label.form-label');
    expect(labelElement).not.toBeNull();
    expect(labelElement?.textContent).toContain(labelText);
  });

  it('renders a checkbox input', async () => {
    const { container } = render(html`
      <nxa-form-input
        type="checkbox"
        data-testid="checkbox-input"
        label="Checkbox Test"
      ></nxa-form-input>
    `);
    const element = container.querySelector('[data-testid="checkbox-input"]');
    expect(element).not.toBeNull();
    await expect(element).toBeInTheDocument();
    const inputElement = element!.shadowRoot
      ?.querySelector('slot[name="input"]')
      ?.assignedElements()[0] as HTMLInputElement;
    expect(inputElement.type).toBe('checkbox');
    const labelElement = element!.shadowRoot?.querySelector(
      'label.form-check-label'
    );
    expect(labelElement).not.toBeNull();
    expect(labelElement?.textContent).toContain('Checkbox Test');
  });
});
