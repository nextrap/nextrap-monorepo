import '@nextrap/style-base/default';
import '@nextrap/style-button/default';
import '@nextrap/style-typography/default';
import '@nextrap/style-utils/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import { Feedback } from '../index';
import '../index';
import './main.scss';

export default defineDemo({
  title: 'Feedback API',
  description: 'Awaitable Feedback-Shortcuts ohne manuelles Dispatchen von Window-Events',
  controls: {
    items: [
      {
        id: 'loading', type: 'button', label: 'Loading',
        onClick: (_, env) => {
          void Feedback.loading({ message: 'Die Daten werden vorbereitet …' }).then(() => env.toast.log('loading closed'));
        },
      },
      {
        id: 'progress', type: 'button', label: 'Progress 45 %',
        onClick: (_, env) => {
          void Feedback.progress({ progress: 45, message: 'Dateien werden verarbeitet …', reference: env.query<HTMLElement>('[data-reference]') }).then(() => env.toast.log('progress closed'));
        },
      },
      {
        id: 'success', type: 'button', label: 'Success',
        onClick: (_, env) => { void Feedback.success('Vorgang erfolgreich abgeschlossen.').then(() => env.toast.log('success closed')); },
      },
      {
        id: 'error', type: 'button', label: 'Error',
        onClick: (_, env) => { void Feedback.error({ message: 'Import fehlgeschlagen.', details: 'Zeile 152: Ungültiges Datumsformat.', autoClose: false }).then(() => env.toast.log('error closed')); },
      },
      {
        id: 'alert', type: 'button', label: 'Alert',
        onClick: async (_, env) => { await Feedback.alert('Die Verarbeitung kann fortgesetzt werden.'); env.toast.show('Alert bestätigt'); },
      },
      {
        id: 'confirm', type: 'button', label: 'Confirm',
        onClick: async (_, env) => { const accepted = await Feedback.confirm({ message: 'Beispielprozess fortsetzen?', confirmLabel: 'Fortsetzen' }); env.toast.show(accepted ? 'Bestätigt' : 'Abgebrochen'); },
      },
      { id: 'close', type: 'button', label: 'Schließen', onClick: () => Feedback.close() },
    ],
  },
  render(root) {
    root.innerHTML = `
      <main class="nte-feedback-demo">
        <h1>NTE Feedback</h1>
        <p>Die Controls rufen ausschließlich die öffentliche <code>Feedback</code>-API auf.</p>
        <button type="button" class="btn btn-outline-primary" data-reference>Import #2026-08</button>
        <nte-feedback class="style-default"></nte-feedback>
      </main>`;
  },
});
