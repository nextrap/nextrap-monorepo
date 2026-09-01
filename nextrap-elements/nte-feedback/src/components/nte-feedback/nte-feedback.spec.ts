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
    window.dispatchEvent(new CustomEvent('nextrap:progress', { detail: { title: 'Datei-Upload', progress: 45, message: 'Dateien werden verarbeitet...' } }));
    await el.updateComplete;
    const dialog = el.shadowRoot?.querySelector('#dialog') as HTMLDialogElement | null;
    expect(dialog?.getAttribute('role')).toBe('dialog');
    expect(dialog?.getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot?.querySelector('#headline')?.textContent).toBe('Datei-Upload');
    expect(el.shadowRoot?.querySelector('#message')?.textContent).toBe('Dateien werden verarbeitet...');
    expect(el.shadowRoot?.querySelector('[part="progress-percent"]')?.textContent).toBe('45%');
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
  });
});
