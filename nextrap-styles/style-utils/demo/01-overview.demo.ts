import { defineDemo } from '@trunkjs/demo-viewer';

import '@nextrap/style-base/default';
import '@nextrap/style-reset';
import '@nextrap/style-typography/default';
import '../default.scss';

import markdown from './01-overview.md?raw';

export default defineDemo({
  title: 'Style Utils',
  group: 'style-utils',
  description: 'Grid, Flex, Spacing, Farben, Flächen, Borders, Text und Dimensionen',
  css: ['default'],
  markdown,
});
