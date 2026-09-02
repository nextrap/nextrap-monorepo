import { defineDemo } from '@trunkjs/demo-viewer';

import markdown from './01-overview.md?raw';
import './main';

export default defineDemo({
  title: 'NTE Navbar',
  description: 'Mehrzeilige Navbar mit Start-, Center- und End-Regionen',
  markdown,
});
