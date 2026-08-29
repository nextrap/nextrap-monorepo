import { defineDemo } from '@trunkjs/demo-viewer';
import markdown from './01-overview.md?raw';
import './main';

export default defineDemo({
  title: 'Overview',
  description: 'Accessible menu buttons in responsive sizes and states',
  order: 10,
  markdown,
});
