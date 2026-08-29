import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import markdown from './01-accordion.md?raw';
import './main.scss';

export default defineDemo({
  title: 'Accordion',
  description: 'Grundverhalten, Initialzustand, exklusives Öffnen und Marker-Varianten',
  markdown,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
});
