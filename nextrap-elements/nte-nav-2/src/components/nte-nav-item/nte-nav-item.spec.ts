import { describe, expect, it } from 'vitest';

import '../../../index';
import { NteNavItem } from './nte-nav-item';

describe('NteNavItem', () => {
  it('renders link attributes inside its shadow root', async () => {
    const element = document.createElement('nte-nav-item') as NteNavItem;
    element.href = '/leistungen';
    element.current = 'page';
    element.textContent = 'Leistungen';
    document.body.appendChild(element);

    await element.updateComplete;

    const link = element.shadowRoot?.getElementById('link');

    expect(link?.getAttribute('href')).toBe('/leistungen');
    expect(link?.getAttribute('aria-current')).toBe('page');
    expect(element.getAttribute('role')).toBe('listitem');

    element.remove();
  });

  it('maps nested nav items to the submenu slot and renders a native popover disclosure', async () => {
    const element = document.createElement('nte-nav-item') as NteNavItem;
    element.href = '/leistungen';
    element.append('Leistungen');

    const child = document.createElement('nte-nav-item');
    child.setAttribute('href', '/leistungen/beratung');
    child.textContent = 'Beratung';
    element.appendChild(child);
    document.body.appendChild(element);

    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 0));
    await element.updateComplete;

    const toggle = element.shadowRoot?.getElementById('toggle');
    const submenu = element.shadowRoot?.getElementById('submenu');

    expect(child.getAttribute('slot')).toBe('submenu');
    expect(toggle?.getAttribute('popovertarget')).toBe('submenu');
    expect(submenu?.hasAttribute('popover')).toBe(true);

    element.remove();
  });

  it('reflects numeric order into the flex item style', async () => {
    const element = document.createElement('nte-nav-item') as NteNavItem;
    element.order = 20;
    document.body.appendChild(element);

    await element.updateComplete;

    expect(element.style.order).toBe('20');

    element.remove();
  });
});
