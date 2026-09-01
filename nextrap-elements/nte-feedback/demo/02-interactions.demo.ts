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
        onClick: async (_, env) => {
          await Feedback.loading({ message: 'Die Daten werden vorbereitet …' });
          env.toast.log('loading closed');
        },
      },
      {
        id: 'progress', type: 'button', label: 'Progress 45 %',
        onClick: async (_, env) => {
          await Feedback.progress({ progress: 45, message: 'Dateien werden verarbeitet …', reference: env.query<HTMLElement>('[data-reference]') });
          env.toast.log('progress closed');
        },
      },
      {
        id: 'mock-progress', type: 'button', label: 'Mock Progress 8 s',
        onClick: async (_, env) => {
          await Feedback.progress({
            mode: 'mock',
            durationMs: 8_000,
            message: 'Eine länger laufende Aktion wird simuliert …',
            details: ['Keine echte Prozentangabe verfügbar', { estimatedDurationMs: 8_000 }],
            cancelable: true,
          });
          env.toast.log('mock progress closed');
        },
      },
      {
        id: 'success', type: 'button', label: 'Success',
        onClick: async (_, env) => { await Feedback.success('Vorgang erfolgreich abgeschlossen.'); env.toast.log('success closed'); },
      },
      {
        id: 'error', type: 'button', label: 'Error',
        onClick: async (_, env) => { await Feedback.error({ message: 'Import fehlgeschlagen.', details: 'Zeile 152: Ungültiges Datumsformat.', autoClose: false }); env.toast.log('error closed'); },
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
  html: `
    <main class="nte-feedback-demo">
      <h1>NTE Feedback</h1>
      <p>Die Controls rufen ausschließlich die öffentliche <code>Feedback</code>-API auf.</p>
      <button type="button" class="btn btn-outline-primary" data-reference>Import #2026-08</button>
      <nte-feedback></nte-feedback>
    </main>`,
});
