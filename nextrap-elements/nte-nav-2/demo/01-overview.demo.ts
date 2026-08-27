import { defineDemo } from '@trunkjs/demo-viewer';

import markdown from './01-overview.md?raw';

export default defineDemo({
  title: 'API-Entwurf',
  description: 'Komponentenmodell, Accessibility und Styling-Vertrag von nte-nav-2',
  markdown,
});
