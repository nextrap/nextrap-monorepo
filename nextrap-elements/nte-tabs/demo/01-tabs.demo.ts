// Der Demo Viewer rendert die Beispiele über Content Pane.
import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import type { NteTab } from '../index';
import styles from './main.scss?inline';

// Breite, eigener Header und Counter demonstrieren die öffentliche API.
export default defineDemo({
  title: 'Tabs: automatischer Overflow',
  description: 'Tabs mit individuellen Headern, Counter und Dropdown bei Platzmangel.',
  markdown: `## Automatische Sidebar

Ziehe den unteren rechten Rand der Sidebar schmaler oder breiter.
Wechsle den Tab und prüfe, dass die Eingabe erhalten bleibt.

<div class="tabs-demo-resizable">
  <nte-tabs value="files" aria-label="File Explorer">
    <nte-tab name="files" label="All Files">
      <p>index.md, docs/kontakt.md</p>
      <input aria-label="Dateisuche" placeholder="Eingabe bleibt erhalten">
    </nte-tab>
    <nte-tab id="demo-changes" name="changes" label="Change List" count="3">
      <p>Geänderte Dateien</p>
    </nte-tab>
    <span slot="tab-changes"><span aria-hidden="true">✎</span> Change List</span>
    <nte-tab name="history" label="History">Historie</nte-tab>
    <nte-tab name="disabled" label="Disabled" disabled>Nicht auswählbar</nte-tab>
  </nte-tabs>
</div>

## Kompakter Style mit festem Dropdown

<nte-tabs class="style-sm" overflow="dropdown" value="changes">
  <nte-tab name="files">Dateien</nte-tab>
  <nte-tab name="changes" label="Change List" count="0">Keine Änderungen</nte-tab>
  <strong slot="tab-changes">✓ Änderungen</strong>
</nte-tabs>

## Horizontal scrollbare Alternative

<div class="tabs-demo-narrow">
  <nte-tabs overflow="scroll">
    <nte-tab name="files" label="All Files">Dateien</nte-tab>
    <nte-tab name="changes" label="Change List" count="12">Änderungen</nte-tab>
    <nte-tab name="history" label="History">Historie</nte-tab>
  </nte-tabs>
</div>`,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
  css: ['default', styles],
  controls: {
    items: [{
      id: 'increment-count',
      type: 'button',
      label: 'Counter erhöhen',
      onClick(_, env) {
        const tab = env.query<NteTab>('#demo-changes');
        tab.count = (tab.count ?? 0) + 1;
      },
    }, {
      id: 'reset-count',
      type: 'button',
      label: 'Counter auf 0',
      onClick(_, env) {
        env.query<NteTab>('#demo-changes').count = 0;
      },
    }],
  },
});
