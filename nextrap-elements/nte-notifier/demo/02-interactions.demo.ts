import '@nextrap/style-base/default';
import '@nextrap/style-button/default';
import '@nextrap/style-typography/default';
import '@nextrap/style-utils/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import type {
  NextrapConfirmDetail,
  NextrapFailDetail,
  NextrapInfoDetail,
  NextrapLoadingDetail,
  NextrapProgressDetail,
  NextrapSuccessDetail,
  NteNotifier,
} from '../index';
import './main.scss';

let demoRoot: HTMLElement | null = null;
const timers = new Set<number>();

const log = (message: string) => {
  const output = demoRoot?.querySelector<HTMLOutputElement>('[data-event-log]');
  if (!output) return;
  const line = `[${new Date().toLocaleTimeString()}] ${message}`;
  output.value = output.value ? `${line}\n${output.value}` : line;
};

const dispatch = <T>(name: string, detail: T) => {
  log(`${name} ${JSON.stringify(detail, (_key, value) => (typeof value === 'function' ? '[callback]' : value))}`);
  window.dispatchEvent(new CustomEvent<T>(name, { detail }));
};

const clearTimers = () => {
  timers.forEach((timer) => window.clearTimeout(timer));
  timers.clear();
};

const later = (delay: number, callback: () => void) => {
  const timer = window.setTimeout(() => {
    timers.delete(timer);
    callback();
  }, delay);
  timers.add(timer);
};

const loading = () =>
  dispatch<NextrapLoadingDetail>('nextrap:loading', {
    message: 'Die Daten werden vorbereitet ...',
    onAbort: () => dispatch<NextrapFailDetail>('nextrap:fail', { message: 'Vorgang abgebrochen.', autoClose: false }),
  });

const progress = (value = 45) =>
  dispatch<NextrapProgressDetail>('nextrap:progress', {
    progress: value,
    message: 'Dateien werden verarbeitet ...',
    reference: demoRoot?.querySelector<HTMLElement>('[data-reference]') ?? 'Import #2026-08',
    onAbort: () => dispatch<NextrapFailDetail>('nextrap:fail', { message: 'Import abgebrochen.', autoClose: false }),
  });

const success = () =>
  dispatch<NextrapSuccessDetail>('nextrap:success', {
    message: 'Vorgang erfolgreich abgeschlossen.',
    autoClose: true,
  });

const fail = () =>
  dispatch<NextrapFailDetail>('nextrap:fail', {
    message: 'Import fehlgeschlagen.',
    details: 'Zeile 152: Ungültiges Datumsformat in Spalte "deliveryDate".',
    autoClose: false,
  });

const info = () =>
  dispatch<NextrapInfoDetail>('nextrap:info', {
    message: 'Die Verarbeitung kann im Hintergrund fortgesetzt werden.',
    onConfirm: () => log('Info bestätigt'),
  });

const confirm = () =>
  dispatch<NextrapConfirmDetail>('nextrap:confirm', {
    message: 'Wie soll der Beispielprozess enden?',
    html: '<p>Die Auswahl löst direkt den nächsten Notifier-Status aus.</p>',
    actions: [
      { label: 'Erfolgreich', variant: 'primary', callback: success },
      { label: 'Fehler', variant: 'danger', callback: fail },
      { label: 'Schließen', variant: 'secondary' },
    ],
  });

export default defineDemo({
  title: 'Notifier-Interaktionen',
  description: 'Status-Events, Callbacks und Sequenzen über die Demo-Controls',
  controls: [
    { label: 'Loading', element: 'button', onclick: loading },
    { label: 'Progress', element: 'button', onclick: () => progress() },
    { label: 'Success', element: 'button', onclick: success },
    { label: 'Fail', element: 'button', onclick: fail },
    { label: 'Info', element: 'button', onclick: info },
    { label: 'Confirm', element: 'button', onclick: confirm },
    {
      label: 'Ablauf starten',
      element: 'button',
      onclick: () => {
        clearTimers();
        loading();
        later(900, () => progress(35));
        later(1800, () => progress(75));
        later(2700, success);
      },
    },
    {
      label: 'Schließen',
      element: 'button',
      onclick: () => demoRoot?.querySelector<NteNotifier>('nte-notifier')?.close(),
    },
    {
      label: 'Log leeren',
      element: 'button',
      onclick: () => {
        const output = demoRoot?.querySelector<HTMLOutputElement>('[data-event-log]');
        if (output) output.value = '';
      },
    },
  ],
  render(root) {
    clearTimers();
    demoRoot = root;
    root.innerHTML = `
      <main class="nte-notifier-demo">
        <h1>NTE Notifier</h1>
        <p>Öffne die Controls-Leiste unten und löse einzelne Zustände oder einen vollständigen Ablauf aus.</p>
        <section>
          <h2>Referenzziel</h2>
          <button type="button" class="btn btn-outline-primary" data-reference>Import #2026-08</button>
        </section>
        <section>
          <h2>Gesendete Events</h2>
          <output data-event-log aria-live="polite">Noch kein Event gesendet.</output>
        </section>
        <nte-notifier></nte-notifier>
      </main>
    `;
  },
});
