// Registriert die Komponenten und stellt die Light-DOM-Typografie und Buttons für diese Demo bereit.
import '@nextrap/ntl-2col';
import '@nextrap/style-button/default';
import '@nextrap/style-typography/default';
import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';

// Lädt das Markdown und die inspizierbare Sass-Quelle über die öffentlichen Viewer-Einstiege.
import '../index';
import style from './main.scss?inline';
import markdown from './pairing-ntl-2col.md?raw';
import { wrapperHtml } from './setup';

// Lässt den Viewer das Markdown rendern und Content Pane die Layouts und Slots zuordnen.
export default defineDemo({
  title: 'Consent Blocker in NTL 2col',
  description: 'Consent Blocker als Aside und Top im Zweispalten-Layout',
  order: 2,
  markdown,
  wrapper_html: wrapperHtml,
  css: ['default', style],
});
