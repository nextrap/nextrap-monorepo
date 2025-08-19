import { create_element } from '@trunkjs/browser-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NteSplitViewElement } from './nte-split-view';

describe('nte-split-view', () => {
  beforeEach(() => {
    // ensure custom element is defined (import side-effect)
    // @ts-ignore
    customElements.get('nte-split-view') || customElements.define('nte-split-view', NteSplitViewElement);
  });

  it('uses a single, unnamed slot', async () => {
    const el = document.createElement('nte-split-view') as NteSplitViewElement;
    document.body.appendChild(el);
    await el.updateComplete;

    const slots = el.shadowRoot!.querySelectorAll('slot');
    expect(slots.length).toBe(1);
    expect(slots[0].getAttribute('name')).toBe(null);
  });

  it('warns if more than two children are provided', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const el = document.createElement('nte-split-view') as NteSplitViewElement;

    // 3 children
    el.appendChild(create_element('div', {}, 'A'));
    el.appendChild(create_element('div', {}, 'B'));
    el.appendChild(create_element('div', {}, 'C'));

    document.body.appendChild(el);
    await el.updateComplete;

    // slotchange occurs on append; allow microtask
    await Promise.resolve();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('splitter is focusable only when resizable', async () => {
    const el = document.createElement('nte-split-view') as NteSplitViewElement;
    el.appendChild(create_element('div', {}, 'A'));
    el.appendChild(create_element('div', {}, 'B'));
    document.body.appendChild(el);
    await el.updateComplete;

    let splitter = el.shadowRoot!.getElementById('splitter')!;
    expect(splitter.getAttribute('tabindex')).toBe('-1');

    el.setAttribute('resizable', '');
    await el.updateComplete;
    splitter = el.shadowRoot!.getElementById('splitter')!;
    expect(splitter.getAttribute('tabindex')).toBe('0');
  });
});
