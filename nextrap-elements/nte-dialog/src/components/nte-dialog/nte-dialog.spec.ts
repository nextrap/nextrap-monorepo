import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import './nte-dialog';
import { NteDialog } from './nte-dialog';

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');

describe('nte-dialog', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();

    if (originalShowModal) {
      Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal);
    } else {
      delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal;
    }
  });

  it('opens from its launcher', async () => {
    const showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      writable: true,
      value: showModal,
    });

    const el = document.createElement('nte-dialog') as NteDialog;
    el.innerHTML = '<button class="launcher">Open</button><p>Content</p>';
    document.body.append(el);
    await el.updateComplete;

    (el.querySelector('.launcher') as HTMLButtonElement).click();

    expect(el.mode).toBe('open');
    expect(showModal).toHaveBeenCalledOnce();
  });
});
