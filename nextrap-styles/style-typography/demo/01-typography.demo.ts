// Registriert die Markdown-Layout-Verarbeitung und die expliziten Demo-Styles.
import '@nextrap/style-base/default';
import '@nextrap/style-elements/default';
import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';
import css from '../default.scss?inline';
import markdown from './typography.md?raw';

// Verwendet das vorhandene Typografie-Beispiel im zentralen und paketlokalen Viewer.
export default defineDemo({
  title: 'Typografie',
  group: 'style-typography',
  description: 'Überschriften, Text, Listen, Zitate und Code mit dem Nextrap-Textrhythmus',
  css,
  markdown,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
});
