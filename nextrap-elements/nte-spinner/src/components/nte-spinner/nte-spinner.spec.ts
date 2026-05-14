import { expect } from 'vitest';
import { NteSpinnerElement } from './nte-spinner';

describe('nte-spinner', () => {
  it('registers the custom element', () => {
    expect(customElements.get('nte-spinner')).toBe(NteSpinnerElement);
  });

  it('creates the element instance', () => {
    const el = document.createElement('nte-spinner');
    expect(el).toBeInstanceOf(NteSpinnerElement);
  });

  it('renders the spinner markup in shadow dom', () => {
    const el = document.createElement('nte-spinner');
    document.body.appendChild(el);

    expect(el.shadowRoot?.querySelector('#spinner')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('#spinner-circle')).toBeTruthy();

    el.remove();
  });
});
