import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NteNavbar } from './nte-navbar';

const setScrollY = (value: number) => {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value,
  });
};

const nextMutation = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe('nte-navbar', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    setScrollY(0);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    setScrollY(0);
  });

  it('registers and renders the navbar element', async () => {
    expect(customElements.get('nte-navbar')).toBe(NteNavbar);

    const navbar = document.createElement('nte-navbar') as NteNavbar;
    document.body.append(navbar);
    await navbar.updateComplete;

    expect(navbar.shadowRoot?.querySelector('#navbar')).toBeTruthy();
    expect(navbar.shadowRoot?.querySelector('slot')).toBeTruthy();
  });

  it('reads the scroll threshold from the effective component style', async () => {
    const navbar = document.createElement('nte-navbar') as NteNavbar;
    navbar.style.setProperty('--nte-navbar-scroll-threshold', '24');
    document.body.append(navbar);

    setScrollY(24);
    window.dispatchEvent(new Event('scroll'));
    expect(navbar.classList.contains('is-below-threshold')).toBe(false);

    setScrollY(25);
    window.dispatchEvent(new Event('scroll'));
    expect(navbar.classList.contains('is-below-threshold')).toBe(true);
  });

  it('falls back safely for invalid and negative threshold values', () => {
    const navbar = document.createElement('nte-navbar') as NteNavbar;
    navbar.style.setProperty('--nte-navbar-scroll-threshold', 'invalid');
    document.body.append(navbar);

    setScrollY(1);
    navbar.refreshComponentStyle();
    expect(navbar.classList.contains('is-below-threshold')).toBe(false);

    setScrollY(2);
    window.dispatchEvent(new Event('scroll'));
    expect(navbar.classList.contains('is-below-threshold')).toBe(true);

    navbar.style.setProperty('--nte-navbar-scroll-threshold', '-100');
    navbar.refreshComponentStyle();
    setScrollY(1);
    window.dispatchEvent(new Event('scroll'));
    expect(navbar.classList.contains('is-below-threshold')).toBe(true);
  });

  it('re-reads component style after style attribute changes', async () => {
    const navbar = document.createElement('nte-navbar') as NteNavbar;
    navbar.style.setProperty('--nte-navbar-scroll-threshold', '100');
    document.body.append(navbar);

    setScrollY(50);
    window.dispatchEvent(new Event('scroll'));
    expect(navbar.classList.contains('is-below-threshold')).toBe(false);

    navbar.style.setProperty('--nte-navbar-scroll-threshold', '10');
    await nextMutation();

    expect(navbar.classList.contains('is-below-threshold')).toBe(true);
  });

  it('re-reads component style after class attribute changes', async () => {
    const style = document.createElement('style');
    style.textContent = '.low-threshold { --nte-navbar-scroll-threshold: 5; }';
    document.head.append(style);

    const navbar = document.createElement('nte-navbar') as NteNavbar;
    navbar.style.setProperty('--nte-navbar-scroll-threshold', '100');
    document.body.append(navbar);

    setScrollY(10);
    window.dispatchEvent(new Event('scroll'));
    expect(navbar.classList.contains('is-below-threshold')).toBe(false);

    navbar.style.removeProperty('--nte-navbar-scroll-threshold');
    navbar.classList.add('low-threshold');
    await nextMutation();

    expect(navbar.classList.contains('is-below-threshold')).toBe(true);
    style.remove();
  });

  it('tracks whether the page is scrolled independently of the threshold', () => {
    const navbar = document.createElement('nte-navbar') as NteNavbar;
    navbar.style.setProperty('--nte-navbar-scroll-threshold', '100');
    document.body.append(navbar);

    setScrollY(1);
    window.dispatchEvent(new Event('scroll'));
    expect(navbar.classList.contains('is-scrolled')).toBe(true);
    expect(navbar.classList.contains('is-below-threshold')).toBe(false);

    setScrollY(0);
    window.dispatchEvent(new Event('scroll'));
    expect(navbar.classList.contains('is-scrolled')).toBe(false);
    expect(navbar.classList.contains('is-below-threshold')).toBe(false);
  });
});
