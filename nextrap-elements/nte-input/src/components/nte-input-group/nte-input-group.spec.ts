import { describe, expect } from 'vitest';
import { NteInputGroup } from './nte-input-group';

describe('NteInputGroup', () => {
  it('should create an element', () => {
    const el = new NteInputGroup();
    expect(el).toBeInstanceOf(NteInputGroup);
  });

  it('renders with default properties', async () => {
    const element = document.createElement('nte-input-group') as NteInputGroup;
    document.body.appendChild(element);
    await element.updateComplete;

    const formGroupDiv = element.shadowRoot?.querySelector('.form-group');
    expect(formGroupDiv).not.toBeNull();
    expect(element.gap).toBe(1);
    expect(element.alignItems).toBe('stretch');
    expect(element.cols).toBe('1-2-3');

    document.body.removeChild(element);
  });

  it('renders with custom properties', async () => {
    const element = document.createElement('nte-input-group') as NteInputGroup;
    element.gap = 2;
    element.alignItems = 'center';
    element.cols = '1-2-4';
    document.body.appendChild(element);
    await element.updateComplete;

    const formGroupDiv = element.shadowRoot?.querySelector('.form-group');
    expect(formGroupDiv).not.toBeNull();
    expect(element.gap).toBe(2);
    expect(element.alignItems).toBe('center');
    expect(element.cols).toBe('1-2-4');

    // Check if CSS variables are set in the style attribute
    const styleAttribute = formGroupDiv!.getAttribute('style');
    expect(styleAttribute).toContain('--gap: 2rem');
    expect(styleAttribute).toContain('--align-items: center');
    expect(styleAttribute).toContain('--cols-sm: 1');
    expect(styleAttribute).toContain('--cols-md: 2');
    expect(styleAttribute).toContain('--cols-lg: 4');

    document.body.removeChild(element);
  });

  it('slots content', async () => {
    const element = document.createElement('nte-input-group') as NteInputGroup;
    const slottedDiv = document.createElement('div');
    slottedDiv.textContent = 'Slotted Content';
    element.appendChild(slottedDiv);
    document.body.appendChild(element);
    await element.updateComplete;

    const slot = element.shadowRoot?.querySelector('slot');
    expect(slot).not.toBeNull();
    expect(element.textContent).toContain('Slotted Content');

    document.body.removeChild(element);
  });
});
