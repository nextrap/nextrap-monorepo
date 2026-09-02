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

  it('maps nested nav items to the submenu slot and renders a native details disclosure', async () => {
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

    const details = element.shadowRoot?.getElementById('details');
    const toggle = element.shadowRoot?.getElementById('toggle');
    const submenu = element.shadowRoot?.getElementById('submenu');

    expect(child.getAttribute('slot')).toBe('submenu');
    expect(details).toBeInstanceOf(HTMLDetailsElement);
    expect(toggle).toBeInstanceOf(HTMLElement);
    expect(toggle?.tagName).toBe('SUMMARY');
    expect(submenu?.hasAttribute('popover')).toBe(false);

    element.remove();
  });

  it('uses the whole label as the accessible disclosure when a parent has no href', async () => {
    const element = document.createElement('nte-nav-item') as NteNavItem;
    element.append('Produkte');

    const child = document.createElement('nte-nav-item');
    child.setAttribute('href', '/produkte/a');
    child.textContent = 'Produkt A';
    element.appendChild(child);
    document.body.appendChild(element);

    await element.updateComplete;

    const disclosure = element.shadowRoot?.getElementById('disclosure');
    const labelSlot = disclosure?.querySelector<HTMLSlotElement>('slot:not([name])');
    const assignedLabel = labelSlot
      ?.assignedNodes({ flatten: true })
      .map((node) => node.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ');

    expect(element.shadowRoot?.getElementById('link')).toBeNull();
    expect(disclosure?.tagName).toBe('SUMMARY');
    expect(assignedLabel).toContain('Produkte');

    element.remove();
  });

  it('keeps the submenu out of the Popover top layer when the disclosure opens', async () => {
    const element = document.createElement('nte-nav-item') as NteNavItem;
    element.append('Produkte');

    const child = document.createElement('nte-nav-item');
    child.textContent = 'Produkt A';
    element.appendChild(child);
    document.body.appendChild(element);

    await element.updateComplete;

    const details = element.shadowRoot?.getElementById('details') as HTMLDetailsElement | null;
    const disclosure = element.shadowRoot?.getElementById('disclosure');
    const submenu = element.shadowRoot?.getElementById('submenu');

    disclosure?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    details!.open = true;

    expect(details?.open).toBe(true);
    expect(submenu?.hasAttribute('popover')).toBe(false);
    expect(disclosure?.hasAttribute('popovertarget')).toBe(false);

    element.remove();
  });

  it('maps the manual submenu-popover attribute to declarative Popover markup', async () => {
    const element = document.createElement('nte-nav-item') as NteNavItem;
    element.setAttribute('submenu-popover', '');
    element.append('Produkte');

    const child = document.createElement('nte-nav-item');
    child.textContent = 'Produkt A';
    element.appendChild(child);
    document.body.appendChild(element);

    await element.updateComplete;

    const details = element.shadowRoot?.getElementById('details');
    const disclosure = element.shadowRoot?.getElementById('disclosure');
    const submenu = element.shadowRoot?.getElementById('submenu');

    expect(details).toBeNull();
    expect(disclosure?.tagName).toBe('BUTTON');
    expect(disclosure?.getAttribute('popovertarget')).toBe('submenu');
    expect(submenu?.getAttribute('popover')).toBe('auto');

    element.removeAttribute('submenu-popover');
    await element.updateComplete;

    expect(element.shadowRoot?.getElementById('details')).toBeInstanceOf(HTMLDetailsElement);
    expect(element.shadowRoot?.getElementById('submenu')?.hasAttribute('popover')).toBe(false);

    element.remove();
  });

  it('marks an empty icon slot through nextrap element slot visibility', async () => {
    const element = document.createElement('nte-nav-item') as NteNavItem;
    element.textContent = 'Kontakt';
    document.body.appendChild(element);

    await element.updateComplete;

    const iconSlot = element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="icon"]');

    expect(iconSlot?.classList.contains('slot-empty')).toBe(true);

    element.remove();
  });

  it('uses the CSS custom property for flex item order', () => {
    const element = document.createElement('nte-nav-item') as NteNavItem;
    element.style.setProperty('--order', '20');
    document.body.appendChild(element);

    expect(element.style.getPropertyValue('--order')).toBe('20');

    element.remove();
  });
});
