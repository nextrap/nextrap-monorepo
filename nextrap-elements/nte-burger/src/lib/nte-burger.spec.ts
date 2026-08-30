import { expect } from 'vitest';
import './nte-burger';
import type { NteBurger } from './nte-burger';

describe('nte-burger', () => {
  function renderBurger(markup = '<nte-burger></nte-burger>'): NteBurger {
    document.body.innerHTML = markup;
    return document.querySelector('nte-burger') as NteBurger;
  }

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders an accessible disclosure button', async () => {
    const burger = renderBurger('<nte-burger text="Open navigation" aria-controls="main-navigation"></nte-burger>');
    await burger.updateComplete;

    const button = burger.shadowRoot?.querySelector('button');
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.getAttribute('aria-label')).toBe('Open navigation');
    expect(button?.getAttribute('aria-controls')).toBe('main-navigation');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles open state and aria-expanded on activation', async () => {
    const burger = renderBurger();
    await burger.updateComplete;

    burger.shadowRoot?.querySelector('button')?.click();
    await burger.updateComplete;

    expect(burger.open).toBe(true);
    expect(burger.hasAttribute('open')).toBe(true);
    expect(burger.shadowRoot?.querySelector('button')?.getAttribute('aria-expanded')).toBe('true');
  });

  it('reactively forwards an explicit aria-label', async () => {
    const burger = renderBurger();
    burger.setAttribute('aria-label', 'Open account navigation');
    await burger.updateComplete;

    expect(burger.shadowRoot?.querySelector('button')?.getAttribute('aria-label')).toBe('Open account navigation');
  });

  it('does not toggle while disabled', async () => {
    const burger = renderBurger('<nte-burger disabled></nte-burger>');
    await burger.updateComplete;

    burger.shadowRoot?.querySelector('button')?.click();
    await burger.updateComplete;

    expect(burger.open).toBe(false);
  });
});
