// Registriert Content Pane für die Layout-Attribute der Markdown-Demo.
import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';

import '@nextrap/style-base/default';
import '@nextrap/style-reset';
import '@nextrap/style-typography/default';
import '../default.scss';

import markdown from './01-overview.md?raw';

// Verarbeitet das bestehende Markdown einschließlich seiner Layout-Zuordnung.
export default defineDemo({
  title: 'Style Elements',
  group: 'style-elements',
  description: 'Prose, Tabellen, Listen, List Groups, Bilder, Container und Close-Buttons',
  css: ['default'],
  markdown,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
});
