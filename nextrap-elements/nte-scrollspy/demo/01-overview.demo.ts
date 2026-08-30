import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../src';
import markdown from './01-overview.md?raw';
import './main.scss';

export default defineDemo({
  title: 'ScrollSpy overview',
  description: 'Generated navigation, active-section tracking and scroll progress in a bounded container.',
  order: 10,
  markdown,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
});
