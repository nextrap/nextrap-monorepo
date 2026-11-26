// Deklarative Layout-Demo im Content Pane.
import { defineDemo } from '@trunkjs/demo-viewer';
import markdown from './01-overview.md?raw';
import styles from './main.scss?inline';
import '@trunkjs/content-pane';
import '../index';

export default defineDemo({
  title: 'Tabs als Layout',
  description: 'Deklarative Tabs und Panels im Content-Pane-Markdown.',
  markdown,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
  css: ['default', styles],
});
