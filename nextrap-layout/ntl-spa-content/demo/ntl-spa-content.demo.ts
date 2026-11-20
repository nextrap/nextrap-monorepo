// Registriert die Komponente und verwendet dieselbe HTML-Seite wie die eigenständige Demo.
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import pageHtml from './index.html?raw';
import css from './ntl-spa-content.scss?inline';

// Ein eigener Viewport hält das Scrollverhalten der Navbar vom Demo-Viewer getrennt.
export default defineDemo({
  title: 'SPA Content: HTML-Workspace mit Navbar',
  navPath: ['Layouts', 'SPA Content'],
  description:
    'Vollständige HTML-Seite mit Navigation links, Aktionen rechts und unabhängig scrollenden Spalten.',
  iframe: true,
  css,
  html: pageHtml,
  // Übernimmt nur den Body; der HTML-Source-Tab zeigt weiterhin die vollständige Seite.
  render(root) {
    const page = new DOMParser().parseFromString(pageHtml, 'text/html');
    root.replaceChildren(...Array.from(page.body.childNodes));
  },
});
