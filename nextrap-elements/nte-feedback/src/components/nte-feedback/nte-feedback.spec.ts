import { vi } from 'vitest';
import { Feedback } from '../../lib/feedback';
import { NTE_FEEDBACK_DEFAULT_AUTO_CLOSE_MS } from '../../lib/types';
import { NteFeedback } from './nte-feedback';

describe('nte-feedback', () => {
  afterEach(() => {
    Feedback.close();
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('registers the custom element', () => {
    expect(customElements.get('nte-feedback')).toBe(NteFeedback);
  });

  it('renders a custom title and progress in the spinner only', async () => {
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
    const spinner = el.shadowRoot?.querySelector('#spinner') as HTMLElement | null;

    expect(dialog?.getAttribute('role')).toBe('dialog');
    expect(dialog?.getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot?.querySelector('#headline')?.textContent).toBe('Datei-Upload');
    expect(el.shadowRoot?.querySelector('#message')?.textContent).toBe('Dateien werden verarbeitet...');
    expect(spinner?.getAttribute('style')).toContain('--percentage: 45');
    expect(spinner?.getAttribute('style')).toContain("--percentage-txt: '45%'");
    expect(el.shadowRoot?.querySelector('#progress')).toBeFalsy();
    expect(el.shadowRoot?.querySelector('#progress-bar')).toBeFalsy();
    expect(el.shadowRoot?.querySelector('#assistive-context')?.textContent).toContain('Wartedialog');
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

  it('renders string details inside a code block', async () => {
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
    expect(el.shadowRoot?.querySelector('#details-content code')?.textContent).toContain('Zeile 12');
  });

  it('renders array details for non-error feedback as formatted code', async () => {
    const el = new NteFeedback();
    document.body.appendChild(el);
    await el.updateComplete;

    window.dispatchEvent(
      new CustomEvent('nextrap:success', {
        detail: {
          message: 'Import abgeschlossen',
          details: [{ file: 'users.csv', imported: 24 }, '2 Datensätze übersprungen'],
          autoClose: false,
        },
      }),
    );

    await el.updateComplete;

    const code = el.shadowRoot?.querySelector('#details-content code')?.textContent ?? '';
    expect(el.shadowRoot?.querySelector('details#details')).toBeTruthy();
    expect(code).toContain('"file": "users.csv"');
    expect(code).toContain('"imported": 24');
    expect(code).toContain('2 Datensätze übersprungen');
  });

  it('simulates mock progress quickly at first and closes at the configured duration', async () => {
    vi.useFakeTimers();

    const el = new NteFeedback();
    document.body.appendChild(el);
    await el.updateComplete;

    let resolved = false;
    const closed = Feedback.progress({ mode: 'mock', durationMs: 10_000, message: 'Analysiere Daten...' });
    void closed.then(() => { resolved = true; });
    await el.updateComplete;

    const dialog = el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement;
    const spinner = el.shadowRoot?.querySelector('#spinner') as HTMLElement;
    expect(dialog.open).toBe(true);

    vi.advanceTimersByTime(1_000);
    await Promise.resolve();
    await el.updateComplete;

    expect(spinner.getAttribute('style')).toContain('--percentage: 55');
    expect(dialog.open).toBe(true);
    expect(resolved).toBe(false);

    vi.advanceTimersByTime(8_000);
    await Promise.resolve();
    await el.updateComplete;

    const lateProgress = Number(spinner.getAttribute('style')?.match(/--percentage: ([\d.]+)/)?.[1]);
    expect(lateProgress).toBeGreaterThanOrEqual(97);
    expect(lateProgress).toBeLessThan(100);
    expect(dialog.open).toBe(true);

    vi.advanceTimersByTime(1_000);
    await closed;
    await el.updateComplete;

    expect(resolved).toBe(true);
    expect(dialog.open).toBe(false);
  });

  it('fulfills mock progress early when it is closed explicitly', async () => {
    vi.useFakeTimers();

    const el = new NteFeedback();
    document.body.appendChild(el);
    await el.updateComplete;

    const closed = Feedback.progress({ mode: 'mock', durationMs: 60_000, message: 'Bitte warten...' });
    await el.updateComplete;

    vi.advanceTimersByTime(1_000);
    Feedback.close();
    await closed;
    await el.updateComplete;

    expect((el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement | null)?.open).toBe(false);
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
