// Registriert die Komponenten und stellt die Light-DOM-Typografie und Buttons für diese Demo bereit.
import '@nextrap/style-button/default';
import '@nextrap/style-typography/default';
import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';

// Lädt das Markdown und die inspizierbare Sass-Quelle über die öffentlichen Viewer-Einstiege.
import '../index';
import markdown from './base.md?raw';
import style from './main.scss?inline';
import { wrapperHtml } from './setup';

// Lässt den Viewer das Markdown rendern und Content Pane die Layouts und Slots zuordnen.
export default defineDemo({
  title: 'Consent Blocker',
  description: 'Standarddarstellung, gemeinsame Vorlagen und individuelles Seitenverhältnis',
  order: 1,
  markdown,
  wrapper_html: wrapperHtml,
  css: ['default', style],
});
