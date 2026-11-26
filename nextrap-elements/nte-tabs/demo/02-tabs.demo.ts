// HTML-Demo für Overflow-Modi und dynamische Counter.
import { html, render } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import markup from './02-tabs.demo.html?raw';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import type { NteTab } from '../index';
import styles from './main.scss?inline';

// Breite, eigener Header und Counter demonstrieren die öffentliche API.
export default defineDemo({
  title: 'Tabs: automatischer Overflow',
  description: 'Tabs mit individuellen Headern, Counter und Dropdown bei Platzmangel.',
  render(root) {
    render(html`<style>${styles}</style>${unsafeHTML(markup)}`, root);
  },
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
