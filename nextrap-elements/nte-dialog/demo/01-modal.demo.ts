import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import '@trunkjs/content-pane';
import type { TDemoEnvironment } from '@trunkjs/demo-viewer';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../default.scss';
import '../index';
import type { NteDialog } from '../index';
import markdown from './01-modal.md?raw';

const recordEvent = (env: TDemoEnvironment, name: string, detail?: unknown): void => {
  const previous = env.state.get('modal-events');
  const events = Array.isArray(previous) ? (previous as string[]) : [];
  const entry = detail === undefined ? name : `${name}: ${JSON.stringify(detail)}`;
  const next = [...events, entry].slice(-8);

  env.state.set('modal-events', next);
  env.controls.setValue('event-list', next.join('\n'));
  env.toast.show(entry, { title: 'Dialog-Event' });
};

export default defineDemo({
  title: 'Modaler Dialog',
  description: 'Markdown-Inhalt, modales Öffnen und animiertes Schließen',
  navPath: ['NTE Dialog'],
  order: 10,
  tags: ['public'],
  markdown,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
  controls: {
    items: [
      {
        id: 'open-modal',
        type: 'button',
        label: 'Modal öffnen',
        onClick(_, env) {
          env.query<NteDialog>('#modal-demo').showModal();
          recordEvent(env, 'showModal()');
        },
      },
      {
        id: 'close-modal',
        type: 'button',
        label: 'Modal schließen',
        onClick(_, env) {
          void env.query<NteDialog>('#modal-demo').close();
        },
      },
      {
        id: 'event-list',
        type: 'output',
        label: 'Eventliste',
        value: 'Noch kein Dialog-Event.',
      },
    ],
  },
  afterRender(env) {
    const dialog = env.query<NteDialog>('#modal-demo');
    const onDismiss = (event: Event) => recordEvent(env, 'dismiss', (event as CustomEvent).detail);
    const onClosed = () => recordEvent(env, 'closed');

    // Output controls live in Demo Viewer's persistent logging toast rather than in the toolbar.
    dialog.addEventListener('dismiss', onDismiss);
    dialog.addEventListener('closed', onClosed);

    return () => {
      dialog.removeEventListener('dismiss', onDismiss);
      dialog.removeEventListener('closed', onClosed);
    };
  },
});
