import { describe, expect } from 'vitest';
import '../nte-input/nte-input';
import { NteInputControl } from './nte-input-control';

describe('NteInputControl', () => {
  it('creates an element', () => {
    const el = new NteInputControl();
    expect(el).toBeInstanceOf(NteInputControl);
  });

  it('renders a label from the attribute when no label slot is provided', async () => {
    const element = new NteInputControl();
    element.label = 'Email';
    const input = document.createElement('input');
    input.classList.add('form-control');
    element.appendChild(input);

    document.body.appendChild(element);
    await element.updateComplete;

    const label = element.shadowRoot?.querySelector('label.form-label');
    expect(label?.textContent).toContain('Email');

    document.body.removeChild(element);
  });

  it('shows invalid styling when the slotted input is marked invalid even if not required', async () => {
    const element = new NteInputControl();
    element.invalidFeedback = 'Something went wrong';

    const input = document.createElement('input');
    input.classList.add('form-control');
    element.appendChild(input);

    document.body.appendChild(element);
    await element.updateComplete;

    input.classList.add('is-invalid');
    input.dispatchEvent(new Event('input'));
    await element.updateComplete;

    const invalidFeedback = element.shadowRoot?.querySelector('.invalid-feedback') as HTMLElement | null;
    expect(invalidFeedback).not.toBeNull();
    expect(invalidFeedback?.style.display).toBe('block');

    document.body.removeChild(element);
  });

  it('derives a label from the input attributes when none is provided on the component', async () => {
    const element = new NteInputControl();
    const input = document.createElement('input');
    input.classList.add('form-control');
    input.setAttribute('name', 'fullName');
    element.appendChild(input);

    document.body.appendChild(element);
    await element.updateComplete;
    await element.updateComplete;

    const label = element.shadowRoot?.querySelector('label.form-label');
    expect(label?.textContent ?? '').toContain('fullName');

    document.body.removeChild(element);
  });

  it('can style a nested nte-input by reading its internal control', async () => {
    const element = new NteInputControl();
    element.label = 'Wrapped';
    element.invalidFeedback = 'Fehler';

    const nteInput = document.createElement('nte-input');
    nteInput.setAttribute('type', 'text');
    element.appendChild(nteInput);

    document.body.appendChild(element);
    await element.updateComplete;
    await nteInput.updateComplete;

    const innerInput = nteInput.querySelector('input') as HTMLInputElement | null;
    expect(innerInput).not.toBeNull();

    innerInput?.setAttribute('aria-invalid', 'true');
    innerInput?.dispatchEvent(new Event('input'));
    await element.updateComplete;

    const invalidFeedback = element.shadowRoot?.querySelector('.invalid-feedback') as HTMLElement | null;
    expect(invalidFeedback?.style.display).toBe('block');

    document.body.removeChild(element);
  });
});
