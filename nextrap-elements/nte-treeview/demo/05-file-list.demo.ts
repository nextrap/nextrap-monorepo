import { defineDemo } from '@trunkjs/demo-viewer';
import { html, render } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../index';
import markup from './05-file-list.demo.html?raw';
import styles from './main.scss?inline';

// Die Demo bindet eine flache Dateiliste und wechselt Styles und Filter an derselben Instanz.
export default defineDemo({
  title: 'TreeView: Dateiliste, Filter und Styles',
  description: 'Dateibaum aus Pfaden, Wildcards oder Callback und vier Darstellungsvarianten',
  render(root) {
    render(html`<style>${styles}</style>${unsafeHTML(markup)}`, root);
    const view = root.querySelector('nte-treeview')!;
    view.setFileList([
      'index.md', 'README.md',
      'de/leistungen.md', 'en/services.md',
      '_layouts/default.html', '_layouts/article.html',
      '_sass/main.scss', '_sass/components/header.scss',
      'assets/site.css', 'assets/logo.svg',
    ]);
    view.expandedState = { 'de/': true, '_layouts/': true, '_sass/': true };

    // Der Stylewechsel ändert ausschließlich die externe CSS-Klasse, nicht das Modell.
    const style = root.querySelector<HTMLSelectElement>('[data-style]')!;
    style.addEventListener('change', () => {
      view.className = style.value;
    });

    // Callback und Wildcards ersetzen einander über dieselbe Property.
    const mode = root.querySelector<HTMLSelectElement>('[data-filter-mode]')!;
    const input = root.querySelector<HTMLInputElement>('[data-filter]')!;
    const updateFilter = () => {
      const query = input.value.trim();
      if (!query) view.filter = undefined;
      else if (mode.value === 'callback') {
        view.filter = (node) => node.data?.['kind'] === 'file'
          && node.label.toLowerCase().includes(query.toLowerCase());
      } else {
        view.filter = query.split(',').map((pattern) => pattern.trim()).filter(Boolean);
      }
    };
    mode.addEventListener('change', updateFilter);
    input.addEventListener('input', updateFilter);
    root.querySelector('[data-clear]')!.addEventListener('click', () => {
      input.value = '';
      updateFilter();
    });

    // Die vollständige Pfad-ID bleibt auch bei gefilterten oder kompakten Ansichten verfügbar.
    view.addEventListener('selection-change', ({ detail }) => {
      root.querySelector('[data-selection]')!.textContent = detail?.id || '–';
    });
  },
});
