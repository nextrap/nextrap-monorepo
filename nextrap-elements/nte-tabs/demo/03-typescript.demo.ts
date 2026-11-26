// Die TypeScript-Demo verwendet die öffentliche API direkt in einem Lit-Template.
import { defineDemo } from '@trunkjs/demo-viewer';
import { html, render } from 'lit';
import '../index';
import type { NteTab, NteTabs } from '../index';
import styles from './main.scss?inline';

export default defineDemo({
  title: 'Tabs mit TypeScript',
  description: 'Programmatische Auswahl, Counter, Header-Slot und verschachteltes Layout.',
  css: ['default', styles],
  render(root) {
    render(html`
      <style>${styles}</style>
      <div class="tabs-demo-resizable">
        <nte-tabs value="files" aria-label="Datei-Explorer">
          <nte-tab name="files">
            <section layout=".tabs-demo-panel">
              <h3>Dateien</h3>
              <input aria-label="Dateisuche" placeholder="Dateien filtern">
            </section>
          </nte-tab>
          <nte-tab name="changes" label="Änderungen" count="3">
            <section slot="content" layout=".tabs-demo-panel">
              <h3>Änderungen</h3>
              <p>index.md, kontakt.md, main.scss</p>
            </section>
          </nte-tab>
          <span slot="tab-changes">✎ Änderungen</span>
        </nte-tabs>
      </div>
      <p>Aktiver Tab: <output>files</output></p>
      <button type="button" data-select>Änderungen anzeigen</button>
      <button type="button" data-count>Counter erhöhen</button>
    `, root);

    // Properties steuern dieselben Elemente, ohne Panels neu zu rendern.
    const tabs = root.querySelector<NteTabs>('nte-tabs')!;
    const changes = tabs.querySelector<NteTab>('nte-tab[name="changes"]')!;
    const output = root.querySelector('output')!;
    root.querySelector('[data-select]')!.addEventListener('click', () => {
      tabs.value = 'changes';
      output.value = tabs.value;
    });
    root.querySelector('[data-count]')!.addEventListener('click', () => {
      changes.count = (changes.count ?? 0) + 1;
    });

    // Benutzerwechsel melden den ausgewählten Namen.
    tabs.addEventListener('change', event => {
      if (event.target === tabs) output.value = (event as CustomEvent<string>).detail;
    });
  },
});
