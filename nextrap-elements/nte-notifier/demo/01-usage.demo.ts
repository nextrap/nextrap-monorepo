import { defineDemo } from '@trunkjs/demo-viewer';

import markdown from './01-usage.md?raw';

export default defineDemo({
  title: 'Verwendung und Events',
  description: 'Einmaliges Mounting und die sechs globalen nextrap:*-Events',
  markdown,
});
