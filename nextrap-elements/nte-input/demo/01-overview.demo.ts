import { defineDemo } from '@trunkjs/demo-viewer';

import markdown from './01-overview.md?raw';

export default defineDemo({
  title: 'Überblick',
  description: 'Kurzer Einstieg in Architektur, Features und Demo-Fahrplan',
  markdown,
});
