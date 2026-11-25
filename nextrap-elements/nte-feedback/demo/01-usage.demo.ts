import { defineDemo } from '@trunkjs/demo-viewer';

import markdown from './01-usage.md?raw';

export default defineDemo({
  title: 'SPA: API-Stub und Feedback',
  description: 'Zentrale API-Stub-Konfiguration mit Mini-Ladebalken, Dialog und Fehlerdetails',
  markdown,
});
