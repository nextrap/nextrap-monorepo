// Registriert Komponenten und Icons, da der Viewer nur die Body-Knoten der HTML-Seite übernimmt.
import { defineDemo } from '@trunkjs/demo-viewer';
import '@nextrap/nte-icon';
import '@nextrap/ntl-spa-header';
import '../index';
import pageHtml from './index.html?raw';
import css from './ntl-spa-content.scss?inline';

// Ein eigener Viewport hält das Scrollverhalten der Navbar vom Demo-Viewer getrennt.
export default defineDemo({
  title: 'SPA Content: HTML-Workspace mit SPA Header',
  navPath: ['Layouts', 'SPA Content'],
  description:
    'Vollständige HTML-Seite mit SPA Header, Cloud-Aktionsmenü und unabhängig scrollenden Spalten.',
  iframe: true,
  css,
  html: pageHtml,
  // Übernimmt nur den Body; der HTML-Source-Tab zeigt weiterhin die vollständige Seite.
  render(root) {
    const page = new DOMParser().parseFromString(pageHtml, 'text/html');
    root.replaceChildren(...Array.from(page.body.childNodes));

    // Schließt nach der Auswahl, ohne Fragmentnavigation oder den nativen Reset zu ersetzen.
    root.querySelector<HTMLElement>('#spa-content-actions-menu')!.addEventListener('click', (event) => {
      const target = event.target as Element;
      if (target.closest('a, button')) {
        (event.currentTarget as HTMLElement).hidePopover();
      }
    });
  },
});
