import { defineDemo } from '@trunkjs/demo-viewer';

import markdown from './01-usage.md?raw';

export default defineDemo({
  title: 'Feedback API verwenden',
  description: 'Mounting und awaitbare Feedback-Shortcuts für Alert, Confirm, Loading, Progress und Statusmeldungen',
  markdown,
});
