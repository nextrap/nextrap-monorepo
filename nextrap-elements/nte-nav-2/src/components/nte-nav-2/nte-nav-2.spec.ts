import { describe, expect, it } from 'vitest';

import '../../../index';
import { NteNav2 } from './nte-nav-2';

describe('NteNav2', () => {
  it('renders a named navigation landmark and list', async () => {
    const element = document.createElement('nte-nav-2') as NteNav2;
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
