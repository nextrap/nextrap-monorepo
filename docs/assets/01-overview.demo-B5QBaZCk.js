const e = `import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import markdown from './01-overview.md?raw';

export default defineDemo({
  title: 'NTE Privacy Consent',
  description: 'HTML-first API für ein einmaliges Datenschutz-Modal und optionale externe Dienste',
  markdown,
});
`;
export { e as default };
