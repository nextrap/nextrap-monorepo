// Registriert den Header und verwendet dieselbe HTML-Seite wie die eigenständige Demo.
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import pageHtml from './index.html?raw';
import css from './ntl-spa-header.scss?inline';

// Ein eigener Viewport zeigt beide Header mit den Styles der vollständigen Seite.
export default defineDemo({
  title: 'SPA Header: Navigation und Sub-Line',
  navPath: ['Layouts', 'SPA Header'],
  description:
    'HTML-Header mit getrennten Slots, vertikal zentrierten Inhalten und frei gewählten Abständen.',
  iframe: true,
  css,
  html: pageHtml,
  // Übernimmt den Body; der HTML-Source-Tab enthält weiterhin die komplette Seite.
  render(root) {
    const page = new DOMParser().parseFromString(pageHtml, 'text/html');
    root.replaceChildren(...Array.from(page.body.childNodes));
  },
});
