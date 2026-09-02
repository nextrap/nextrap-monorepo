import { describe, expect, it } from 'vitest';

import '../../../index';
import { NteNav } from './nte-nav';

describe('NteNav', () => {
  it('updates submenu-popover when slotted items move between horizontal and vertical navs', async () => {
    const horizontal = document.createElement('nte-nav') as NteNav;
    horizontal.style.setProperty('--nte-nav-flow', 'row');
    const vertical = document.createElement('nte-nav') as NteNav;
    vertical.style.setProperty('--nte-nav-flow', 'column');
    const parent = document.createElement('nte-nav-item');
    parent.append('Site');
    parent.append(document.createElement('nte-nav-item'));
    horizontal.append(parent);
    document.body.append(horizontal, vertical);

    await horizontal.updateComplete;
    await vertical.updateComplete;
    await Promise.resolve();

    expect(parent.hasAttribute('submenu-popover')).toBe(true);

    vertical.append(parent);
    await Promise.resolve();

    expect(parent.hasAttribute('submenu-popover')).toBe(false);

    horizontal.remove();
    vertical.remove();
  });

  it('renders a named navigation landmark and list', async () => {
    const element = document.createElement('nte-nav') as NteNav;
    element.ariaLabel = 'Hauptnavigation';
    document.body.appendChild(element);

    await element.updateComplete;

    const nav = element.shadowRoot?.getElementById('nav');
    const list = element.shadowRoot?.getElementById('list');

    expect(nav?.getAttribute('aria-label')).toBe('Hauptnavigation');
    expect(list?.getAttribute('role')).toBe('list');

    element.remove();
  });
});
