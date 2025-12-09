import { describe, expect } from 'vitest';
import { NteInput } from './nte-input';

describe('NteInput', () => {
  it('should create an element', () => {
    const el = new NteInput();
    expect(el).toBeInstanceOf(NteInput);
  });

  it('renders a basic input', async () => {
    const element = document.createElement('nte-input') as NteInput;
    document.body.appendChild(element);
    await element.updateComplete;

    const inputSlot = element.shadowRoot?.querySelector('slot:not([name])');
    expect(inputSlot).not.toBeNull();

    document.body.removeChild(element);
  });

  it('does not render styling elements (handled by nte-input-control)', async () => {
    const element = document.createElement('nte-input') as NteInput;
    element.setAttribute('label', 'Unused Label');
    document.body.appendChild(element);
    await element.updateComplete;

    const labelElement = element.shadowRoot?.querySelector('label');
    expect(labelElement).toBeNull();

    document.body.removeChild(element);
  });
});
