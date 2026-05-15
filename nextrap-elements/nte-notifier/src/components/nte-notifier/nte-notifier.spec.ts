import { vi } from 'vitest';
import { NTE_NOTIFIER_DEFAULT_AUTO_CLOSE_MS } from '../../lib/types';
import { NteNotifier } from './nte-notifier';

describe('nte-notifier', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('registers the custom element', () => {
    expect(customElements.get('nte-notifier')).toBe(NteNotifier);
  });

  it('renders a custom title from the event detail', async () => {
    const el = new NteNotifier();
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(
      new CustomEvent('nextrap:progress', {
        detail: {
          title: 'Datei-Upload',
          progress: 45,
          message: 'Dateien werden verarbeitet...',
        },
      }),
    );

    await el.updateComplete;

    const dialog = el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement | null;

    expect(dialog?.getAttribute('role')).toBe('dialog');
    expect(dialog?.getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot?.querySelector('#headline')?.textContent).toBe('Datei-Upload');
    expect(el.shadowRoot?.querySelector('#message')?.textContent).toBe('Dateien werden verarbeitet...');
    expect(el.shadowRoot?.querySelector('[part="progress-percent"]')?.textContent).toBe('45%');
    expect(el.shadowRoot?.querySelector('#assistive-context')?.textContent).toContain('Wartedialog');
  });

  it('falls back to the default title when no title is provided', async () => {
    const el = new NteNotifier();
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(
      new CustomEvent('nextrap:progress', {
        detail: {
          progress: 45,
          message: 'Dateien werden verarbeitet...',
        },
      }),
    );

    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('#headline')?.textContent).toBe('Progress');
  });

  it('renders fail details inside details summary', async () => {
    const el = new NteNotifier();
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(
      new CustomEvent('nextrap:fail', {
        detail: {
          message: 'Import fehlgeschlagen',
          details: 'Zeile 12: Ungültiger Wert',
          autoClose: false,
        },
      }),
    );

    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('details#details')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('#details-summary')?.textContent).toContain('Details anzeigen');
    expect(el.shadowRoot?.querySelector('#details-content')?.textContent).toContain('Zeile 12');
  });

  it('shows a close button only for cancelable dialogs', async () => {
    const el = new NteNotifier();
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(
      new CustomEvent('nextrap:loading', {
        detail: {
          message: 'Bitte warten',
        },
      }),
    );

    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('#close')).toBeFalsy();

    window.dispatchEvent(
      new CustomEvent('nextrap:loading', {
        detail: {
          message: 'Bitte warten',
          cancelable: true,
        },
      }),
    );

    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('#close')).toBeTruthy();
  });

  it('auto closes success dialogs by default', async () => {
    vi.useFakeTimers();

    const el = new NteNotifier();
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(
      new CustomEvent('nextrap:success', {
        detail: {
          message: 'Fertig',
        },
      }),
    );

    await el.updateComplete;
    expect((el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement | null)?.open).toBe(true);

    vi.advanceTimersByTime(NTE_NOTIFIER_DEFAULT_AUTO_CLOSE_MS);
    await Promise.resolve();
    await el.updateComplete;

    expect((el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement | null)?.open).toBe(false);
    expect(el.shadowRoot?.querySelector('#headline')).toBeFalsy();
  });

  it('calls confirm callbacks and closes afterwards', async () => {
    const callback = vi.fn();
    const el = new NteNotifier();
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(
      new CustomEvent('nextrap:confirm', {
        detail: {
          message: 'Wirklich löschen?',
          actions: [{ label: 'Löschen', variant: 'danger', callback }],
        },
      }),
    );

    await el.updateComplete;

    const dialog = el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement | null;
    const button = el.shadowRoot?.querySelector('button[part~="button-danger"]') as HTMLButtonElement;

    expect(dialog?.getAttribute('role')).toBe('alertdialog');
    expect(el.shadowRoot?.querySelector('#assistive-context')?.textContent).toContain('Nachfragedialog');

    button.click();
    await el.updateComplete;

    expect(callback).toHaveBeenCalledTimes(1);
    expect(dialog?.open).toBe(false);
  });
});
