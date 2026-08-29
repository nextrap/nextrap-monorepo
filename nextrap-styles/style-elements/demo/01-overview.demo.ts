import { defineDemo } from '@trunkjs/demo-viewer';

import '@nextrap/style-base/default';
import '@nextrap/style-reset';
import '@nextrap/style-typography/default';
import '../default.scss';

import markdown from './01-overview.md?raw';

export default defineDemo({
  title: 'Style Elements',
  group: 'style-elements',
  description: 'Prose, Tabellen, Listen, List Groups, Bilder und Container',
  css: ['default'],
  markdown,
});
