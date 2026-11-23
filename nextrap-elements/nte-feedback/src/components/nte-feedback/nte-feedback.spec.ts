import { vi } from 'vitest';
import { NTE_FEEDBACK_DEFAULT_AUTO_CLOSE_MS } from '../../lib/types';
import { NteFeedback } from './nte-feedback';

describe('nte-feedback', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('registers the custom element', () => {
    expect(customElements.get('nte-feedback')).toBe(NteFeedback);
  });

  it('renders a custom title from the event detail', async () => {
    const el = new NteFeedback();
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
    expect(el.shadowRoot?.querySelector('#assistive-context')?.textContent).toContain('Wartedialog');
  });

  // Ein Statuswechsel muss Feedback erneut vor zwischenzeitlich geöffneten Dialogen platzieren.
  it('reopens an existing feedback dialog when loading changes to an error', async () => {
    const el = new NteFeedback();
    document.body.appendChild(el);
    await el.updateComplete;
    const dialog = el.shadowRoot!.querySelector('#dialog') as HTMLDialogElement;
    const order: string[] = [];
    const showModal = vi.fn(() => { order.push('show'); dialog.setAttribute('open', ''); });
    const close = vi.fn(() => { order.push('close'); dialog.removeAttribute('open'); });
    dialog.showModal = showModal;
    dialog.close = close;
    const feedbackClosed = vi.fn();
    window.addEventListener('nextrap:feedback-closed', feedbackClosed);
    try {
      window.dispatchEvent(new CustomEvent('nextrap:loading'));
      await el.updateComplete;
      order.push('application-dialog');
      window.dispatchEvent(new CustomEvent('nextrap:fail', { detail: { message: 'Fehler', autoClose: false } }));
      await el.updateComplete;
      expect(order).toEqual(['show', 'application-dialog', 'close', 'show']);
      expect(dialog.open).toBe(true);
      expect(dialog.textContent).toContain('Fehler');
      expect(feedbackClosed).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener('nextrap:feedback-closed', feedbackClosed);
    }
  });

  it('falls back to the default title when no title is provided', async () => {
    const el = new NteFeedback();
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
    const el = new NteFeedback();
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
    const el = new NteFeedback();
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(new CustomEvent('nextrap:loading', { detail: { message: 'Bitte warten' } }));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('#close')).toBeFalsy();

    window.dispatchEvent(
      new CustomEvent('nextrap:loading', { detail: { message: 'Bitte warten', cancelable: true } }),
    );
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('#close')).toBeTruthy();
  });

  // Finale Fehler bleiben ohne Schließen-Button, bei Escape und bei Hintergrundklicks offen.
  it('keeps non-cancelable errors open until explicitly closed by the application', async () => {
    vi.useFakeTimers();
    const el = new NteFeedback();
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(new CustomEvent('nextrap:fail', {
      detail: { message: 'Start fehlgeschlagen', cancelable: false, autoClose: false },
    }));
    await el.updateComplete;

    const dialog = el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement;
    expect(el.shadowRoot?.querySelector('#close')).toBeFalsy();
    expect(el.shadowRoot?.querySelector('#actions')).toBeFalsy();
    expect(el.shadowRoot?.querySelector('button')).toBeFalsy();
    const cancel = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancel);
    expect(cancel.defaultPrevented).toBe(true);
    await el.updateComplete;
    expect(dialog.open).toBe(true);

    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 10, clientY: 10 }));
    await el.updateComplete;
    expect(dialog.open).toBe(true);
    expect(dialog.classList.contains('shake')).toBe(true);

    vi.advanceTimersByTime(NTE_FEEDBACK_DEFAULT_AUTO_CLOSE_MS * 2);
    window.dispatchEvent(new CustomEvent('nextrap:ready'));
    await el.updateComplete;
    expect(dialog.open).toBe(true);

    el.close();
    await el.updateComplete;
    expect(dialog.open).toBe(false);
  });

  // Normale Fehler bleiben weiterhin vom Benutzer schließbar.
  it('closes cancelable errors on backdrop clicks', async () => {
    const el = new NteFeedback();
    document.body.appendChild(el);
    await el.updateComplete;
    window.dispatchEvent(new CustomEvent('nextrap:fail', {
      detail: { message: 'Fehler', autoClose: false },
    }));
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('#close')).toBeTruthy();
    expect(el.shadowRoot?.querySelector('#actions button')?.textContent).toBe('Close');
    const dialog = el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement;
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 10, clientY: 10 }));
    await el.updateComplete;
    expect(dialog.open).toBe(false);
  });

  it('auto closes success dialogs by default', async () => {
    vi.useFakeTimers();

    const el = new NteFeedback();
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(new CustomEvent('nextrap:success', { detail: { message: 'Fertig' } }));
    await el.updateComplete;
    expect((el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement | null)?.open).toBe(true);

    vi.advanceTimersByTime(NTE_FEEDBACK_DEFAULT_AUTO_CLOSE_MS);
    await Promise.resolve();
    await el.updateComplete;

    expect((el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement | null)?.open).toBe(false);
    expect(el.shadowRoot?.querySelector('#headline')).toBeFalsy();
  });

  it('calls confirm callbacks and closes afterwards', async () => {
    const callback = vi.fn();
    const el = new NteFeedback();
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

  it('shakes instead of closing when a backdrop click requires a selection', async () => {
    vi.useFakeTimers();
    const el = new NteFeedback();
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(
      new CustomEvent('nextrap:confirm', {
        detail: {
          message: 'Bitte auswählen',
          actions: [{ label: 'Bestätigen' }],
        },
      }),
    );
    await el.updateComplete;

    const dialog = el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement;
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 10, clientY: 10 }));

    expect(dialog.open).toBe(true);
    expect(dialog.classList.contains('shake')).toBe(true);

    vi.advanceTimersByTime(350);
    expect(dialog.classList.contains('shake')).toBe(false);
  });

  it('closes passive notifications when their backdrop is clicked', async () => {
    const el = new NteFeedback();
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(
      new CustomEvent('nextrap:success', {
        detail: { message: 'Gespeichert', autoClose: false },
      }),
    );
    await el.updateComplete;

    const dialog = el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement;
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 10, clientY: 10 }));
    await el.updateComplete;

    expect(dialog.open).toBe(false);
  });
});
