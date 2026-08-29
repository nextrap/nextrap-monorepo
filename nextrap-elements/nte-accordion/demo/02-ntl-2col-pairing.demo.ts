import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '@nextrap/ntl-2col';
import '../index';
import markdown from './02-ntl-2col-pairing.md?raw';
import './main.scss';

export default defineDemo({
  title: 'Accordion in NTL 2col',
  description: 'Pairing des Accordions in der Haupt- und Seitenspalte eines Zweispalten-Layouts',
  markdown,
});
