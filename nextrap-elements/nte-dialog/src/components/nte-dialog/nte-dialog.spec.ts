import { beforeEach, describe, expect, it, vi } from 'vitest';
import './nte-dialog';
import { NteDialog } from './nte-dialog';

describe('nte-dialog', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.history.replaceState(null, '', '/');
  });

  it('opens from its launcher', async () => {
    const showModal = vi
      .spyOn(HTMLDialogElement.prototype, 'showModal')
      .mockImplementation(function (this: HTMLDialogElement) {
        this.setAttribute('open', '');
      });

    const el = document.createElement('nte-dialog') as NteDialog;
    el.innerHTML = '<button class="launcher">Open</button><p>Content</p>';
    document.body.append(el);
    await el.updateComplete;

    (el.querySelector('.launcher') as HTMLButtonElement).click();

    expect(el.mode).toBe('open');
    expect(showModal).toHaveBeenCalledOnce();
  });

  it('creates a lazy unwrapped include for src', async () => {
    const originalIntersectionObserver = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = class IntersectionObserver {
      readonly root = null;
      readonly rootMargin = '0px';
      readonly thresholds = [0];
      disconnect() {}
      observe() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
      unobserve() {}
    } as typeof IntersectionObserver;

    try {
      const el = document.createElement('nte-dialog') as NteDialog;
      el.src = '/dialog.html';
      document.body.append(el);
      await el.updateComplete;

      const include = el.querySelector('tj-include');
      expect(include?.getAttribute('src')).toBe('/dialog.html');
      expect(include?.hasAttribute('lazy')).toBe(true);
      expect(include?.hasAttribute('unwrap')).toBe(true);
    } finally {
      globalThis.IntersectionObserver = originalIntersectionObserver;
    }
  });
});
