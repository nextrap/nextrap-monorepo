import { expect } from 'vitest';
import { NteCardElement } from './nte-card';

describe('nte-card', () => {
  it('should create an element', () => {
    const el = new NteCardElement();
    expect(el).toBeInstanceOf(NteCardElement);
  });

  it('renders basic structure', async () => {
    const el = new NteCardElement();
    document.body.appendChild(el);
    await el.updateComplete;

    const sr = el.shadowRoot!;
    expect(!!sr.querySelector('.card')).toBe(true);
    expect(!!sr.querySelector('.card-body')).toBe(true);
    // Header and footer should be hidden by default
    const header = sr.querySelector('.card-header') as HTMLElement;
    const footer = sr.querySelector('.card-footer') as HTMLElement;
    expect(header.hasAttribute('hidden')).toBe(true);
    expect(footer.hasAttribute('hidden')).toBe(true);
  });

  it('reflects fill attribute', async () => {
    const el = new NteCardElement();
    el.fill = true;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.hasAttribute('fill')).toBe(true);
  });
});
