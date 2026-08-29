const e = `import { defineDemo } from '@trunkjs/demo-viewer';
import markdown from './01-overview.md?raw';
import './main';

export default defineDemo({
  title: 'Overview',
  description: 'Loading, determinate progress and all status variants',
  markdown,
});
`;
export { e as default };
