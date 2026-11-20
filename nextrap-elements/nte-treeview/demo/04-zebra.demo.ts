import { defineDemo } from '@trunkjs/demo-viewer';
import { html, render } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { TreeModel } from '../index';
import markup from './04-zebra.demo.html?raw';
import styles from './main.scss?inline';

// Derselbe Baum zeigt die rahmenlose Baseline und die optionale Zebra-Klasse im direkten Wechsel.
export default defineDemo({
  title: 'TreeView: optionale Zebra-Streifen',
  description: 'Volle Zeilenbreite, verschachtelte Ordner und Zebra über die Klasse with-zebra',
  render(root) {
    render(html`<style>${styles}</style>${unsafeHTML(markup)}`, root);

    // Mehrere geöffnete Ebenen und ein geschlossener Zweig machen die sichtbare Reihenfolge nachvollziehbar.
    const tree = new TreeModel([
      {
        id: 'project', label: 'Website', data: { expanded: true },
        children: [
          {
            id: 'src', label: 'src', data: { expanded: true },
            children: [
              {
                id: 'components', label: 'components', data: { expanded: true },
                children: [
                  { id: 'button', label: 'Button.ts', data: { selected: true, type: 'TypeScript', size: '4 KB' } },
                  { id: 'treeview', label: 'TreeView.ts', data: { type: 'TypeScript', size: '8 KB' } },
                ],
              },
              { id: 'index', label: 'index.ts', data: { type: 'TypeScript', size: '2 KB' } },
            ],
          },
          {
            id: 'styles', label: 'styles',
            children: [
              { id: 'theme', label: 'theme.scss', data: { type: 'Sass', size: '3 KB' } },
            ],
          },
          { id: 'readme', label: 'README.md', data: { type: 'Markdown', size: '1 KB' } },
        ],
      },
      { id: 'package', label: 'package.json', data: { type: 'JSON', size: '2 KB' } },
    ]);

    // Zebra wird über die Klasse gesteuert und braucht keine zusätzlichen Modellfelder.
    const view = root.querySelector('nte-treeview')!;
    view.renderer = (node) => html`
      ${node.label}
      <span slot="center">${node.children?.length ? 'Ordner' : node.data?.['type'] ?? ''}</span>
      <span slot="end">${node.data?.['size'] ?? '—'}</span>
    `;
    view.setData(tree);
    const checkbox = root.querySelector<HTMLInputElement>('[data-action="zebra"]')!;
    checkbox.addEventListener('change', () => {
      view.classList.toggle('with-zebra', checkbox.checked);
    });
  },
});
