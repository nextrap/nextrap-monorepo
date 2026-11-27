// Die Demo nutzt dieselbe Responsive- und Content-Pane-Integration wie Websites.
import '@trunkjs/content-pane';
import '@trunkjs/responsive';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import markdown from './base.md?raw';
import './demo.scss';

// Die Viewport-Breite schaltet Desktop, Reverse und Preserve separat.
export default defineDemo({
  title: 'Columns: responsive Start-, Center- und End-Spalten',
  description: 'Mobile, Desktop, Reverse, leere Slots, d-none und eigene Gewichte.',
  markdown,
  wrapper_html: '<tj-responsive><tj-content-pane>{{content}}</tj-content-pane></tj-responsive>',
});
