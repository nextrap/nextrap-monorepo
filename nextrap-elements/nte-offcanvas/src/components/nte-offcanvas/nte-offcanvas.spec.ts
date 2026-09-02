import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../nte-offcanvas-pane/nte-offcanvas-pane';
import type { NteOffcanvasPane } from '../nte-offcanvas-pane/nte-offcanvas-pane';
import './nte-offcanvas';
import { NTE_OFFCANVAS_EVENTS, NteOffcanvas, NteOffcanvasEventDetail } from './nte-offcanvas';

const originalShow = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'show');
const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal');
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close');
const originalGetAnimations = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'getAnimations');

function defineDialogMethod(name: 'show' | 'showModal' | 'close', method: (this: HTMLDialogElement) => void): void {
  Object.defineProperty(HTMLDialogElement.prototype, name, { configurable: true, writable: true, value: method });
}

function restoreProperty(target: object, name: string, descriptor?: PropertyDescriptor): void {
  if (descriptor) Object.defineProperty(target, name, descriptor);
  else delete (target as Record<string, unknown>)[name];
}

function eventDetail(overrides: Partial<NteOffcanvasEventDetail> = {}): NteOffcanvasEventDetail {
  return {
    id: 'surface-a',
    placement: 'left',
    mode: 'push',
    openGroup: '',
    layoutGroup: 'shell',
    modal: false,
    size: '12rem',
    duration: '200ms',
    easing: 'ease',
    ...overrides,
  };
}

describe('nte-offcanvas architecture contracts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    defineDialogMethod('show', function () {
      this.setAttribute('open', '');
    });
    defineDialogMethod('showModal', function () {
      this.setAttribute('open', '');
    });
    defineDialogMethod('close', function () {
      this.removeAttribute('open');
    });
    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      writable: true,
      value: () => [],
    });
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
    restoreProperty(HTMLDialogElement.prototype, 'show', originalShow);
    restoreProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal);
    restoreProperty(HTMLDialogElement.prototype, 'close', originalClose);
    restoreProperty(HTMLElement.prototype, 'getAnimations', originalGetAnimations);
  });

  it('keeps modal surfaces at different placements independent', async () => {
    const first = document.createElement('nte-offcanvas') as NteOffcanvas;
    const second = document.createElement('nte-offcanvas') as NteOffcanvas;
    first.style.setProperty('--nte-offcanvas-placement', 'left');
    second.style.setProperty('--nte-offcanvas-placement', 'right');
    document.body.append(first, second);

    await first.open();
    await second.open();

    expect(first.opened).toBe(true);
    expect(second.opened).toBe(true);
  });

  it('keeps non-modal surfaces at the same placement independent', async () => {
    const first = document.createElement('nte-offcanvas') as NteOffcanvas;
    const second = document.createElement('nte-offcanvas') as NteOffcanvas;
    first.style.setProperty('--nte-offcanvas-modal', '0');
    second.style.setProperty('--nte-offcanvas-modal', '0');
    document.body.append(first, second);

    await first.open();
    await second.open();

    expect(first.opened).toBe(true);
    expect(second.opened).toBe(true);
  });

  it('waits for a modal at the same placement to close before opening the next one', async () => {
    const first = document.createElement('nte-offcanvas') as NteOffcanvas;
    const second = document.createElement('nte-offcanvas') as NteOffcanvas;
    document.body.append(first, second);
    await first.open();

    const lifecycle: string[] = [];
    const onClosed = () => lifecycle.push('closed');
    const onOpened = () => lifecycle.push('opened');
    window.addEventListener(NTE_OFFCANVAS_EVENTS.closed, onClosed);
    window.addEventListener(NTE_OFFCANVAS_EVENTS.opened, onOpened);
    await second.open();
    window.removeEventListener(NTE_OFFCANVAS_EVENTS.closed, onClosed);
    window.removeEventListener(NTE_OFFCANVAS_EVENTS.opened, onOpened);

    expect(first.opened).toBe(false);
    expect(second.opened).toBe(true);
    expect(lifecycle).toEqual(['closed', 'opened']);
  });

  it('does not show the next same-placement modal before the close animation finishes', async () => {
    const first = document.createElement('nte-offcanvas') as NteOffcanvas;
    const second = document.createElement('nte-offcanvas') as NteOffcanvas;
    document.body.append(first, second);
    await first.open();

    const firstDialog = first.shadowRoot?.querySelector<HTMLDialogElement>('#dialog');
    const secondDialog = second.shadowRoot?.querySelector<HTMLDialogElement>('#dialog');
    if (!firstDialog || !secondDialog) throw new Error('Expected offcanvas dialogs');

    let frameId = 0;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frameId += 1;
      callback(0);
      return frameId;
    });
    let finishClose = () => undefined;
    const closeFinished = new Promise<void>((resolve) => {
      finishClose = () => resolve();
    });
    vi.spyOn(firstDialog, 'getAnimations').mockReturnValue([{ finished: closeFinished } as Animation]);

    expect(firstDialog.open).toBe(true);
    expect(secondDialog.open).toBe(false);
    const secondOpen = second.open();
    await vi.waitFor(() => expect(firstDialog.getAnimations).toHaveBeenCalled());
    expect(first.opened).toBe(false);
    expect(secondDialog.open).toBe(false);

    finishClose();
    await secondOpen;
    expect(secondDialog.open).toBe(true);
  });

  it('closes another member of the same open group', async () => {
    const first = document.createElement('nte-offcanvas') as NteOffcanvas;
    const second = document.createElement('nte-offcanvas') as NteOffcanvas;
    first.openGroup = 'navigation';
    second.openGroup = 'navigation';
    document.body.append(first, second);

    await first.open();
    await second.open();

    expect(first.opened).toBe(false);
    expect(second.opened).toBe(true);
  });

  it('closes through the built-in shadow DOM control', async () => {
    const offcanvas = document.createElement('nte-offcanvas') as NteOffcanvas;
    document.body.append(offcanvas);
    await offcanvas.open();

    offcanvas.shadowRoot?.querySelector<HTMLButtonElement>('#default-close')?.click();
    await vi.waitFor(() => expect(offcanvas.opened).toBe(false));
  });

  it('provides an accessible built-in close button for every presentation', async () => {
    const offcanvas = document.createElement('nte-offcanvas') as NteOffcanvas;
    offcanvas.style.setProperty('--nte-offcanvas-placement', 'right');
    offcanvas.style.setProperty('--nte-offcanvas-modal', '0');
    document.body.append(offcanvas);
    await offcanvas.open();

    const closeButton = offcanvas.shadowRoot?.querySelector<HTMLButtonElement>('#default-close');
    expect(closeButton?.getAttribute('aria-label')).toBe('Close');
    expect(closeButton?.childElementCount).toBe(0);
  });

  it('normalizes fullscreen presentation to overlay mode', async () => {
    const offcanvas = document.createElement('nte-offcanvas') as NteOffcanvas;
    offcanvas.style.setProperty('--nte-offcanvas-placement', 'fullscreen');
    offcanvas.style.setProperty('--nte-offcanvas-mode', 'push');
    document.body.append(offcanvas);

    const opening = new Promise<NteOffcanvasEventDetail>((resolve) => {
      window.addEventListener(
        NTE_OFFCANVAS_EVENTS.opening,
        (event) => resolve((event as CustomEvent<NteOffcanvasEventDetail>).detail),
        { once: true },
      );
    });
    await offcanvas.open();

    expect((await opening).mode).toBe('overlay');
  });

  it('measures intrinsic top and bottom surfaces before announcing push geometry', async () => {
    const offcanvas = document.createElement('nte-offcanvas') as NteOffcanvas;
    offcanvas.layoutGroup = 'shell';
    offcanvas.style.setProperty('--nte-offcanvas-placement', 'bottom');
    offcanvas.style.setProperty('--nte-offcanvas-mode', 'push');
    document.body.append(offcanvas);
    await offcanvas.updateComplete;
    const dialog = offcanvas.shadowRoot?.querySelector<HTMLDialogElement>('#dialog');
    if (dialog === null || dialog === undefined) throw new Error('Expected offcanvas dialog');
    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
      width: 320,
      height: 180,
      top: 0,
      right: 320,
      bottom: 180,
      left: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    const opening = new Promise<NteOffcanvasEventDetail>((resolve) => {
      window.addEventListener(
        NTE_OFFCANVAS_EVENTS.opening,
        (event) => resolve((event as CustomEvent<NteOffcanvasEventDetail>).detail),
        { once: true },
      );
    });
    await offcanvas.open();

    expect((await opening).size).toBe('180px');
  });

  it('filters pane updates by layout group and restores the previous inset', async () => {
    const pane = document.createElement('nte-offcanvas-pane') as NteOffcanvasPane;
    pane.layoutGroup = 'shell tools';
    document.body.append(pane);
    await pane.updateComplete;

    window.dispatchEvent(new CustomEvent(NTE_OFFCANVAS_EVENTS.opening, { detail: eventDetail() }));
    expect(pane.style.getPropertyValue('--nte-offcanvas-pane-left')).toBe('12rem');

    window.dispatchEvent(
      new CustomEvent(NTE_OFFCANVAS_EVENTS.opening, {
        detail: eventDetail({ id: 'surface-b', size: '20rem', layoutGroup: 'other' }),
      }),
    );
    expect(pane.style.getPropertyValue('--nte-offcanvas-pane-left')).toBe('12rem');

    window.dispatchEvent(
      new CustomEvent(NTE_OFFCANVAS_EVENTS.opening, {
        detail: eventDetail({ id: 'surface-b', size: '20rem', layoutGroup: 'tools' }),
      }),
    );
    expect(pane.style.getPropertyValue('--nte-offcanvas-pane-left')).toBe('20rem');

    window.dispatchEvent(
      new CustomEvent(NTE_OFFCANVAS_EVENTS.closed, {
        detail: eventDetail({ id: 'surface-b', size: '20rem', layoutGroup: 'tools' }),
      }),
    );
    expect(pane.style.getPropertyValue('--nte-offcanvas-pane-left')).toBe('12rem');
  });

  it('ignores push events when the pane has no layout group', async () => {
    const pane = document.createElement('nte-offcanvas-pane') as NteOffcanvasPane;
    document.body.append(pane);
    await pane.updateComplete;

    window.dispatchEvent(new CustomEvent(NTE_OFFCANVAS_EVENTS.opening, { detail: eventDetail() }));

    expect(pane.style.getPropertyValue('--nte-offcanvas-pane-left')).toBe('0px');
  });
});
