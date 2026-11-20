// Lädt für die eigenständige HTML-Seite Header, Workspace, Icons und ihr explizites Demo-Theme.
import '@nextrap/nte-icon';
import '@nextrap/ntl-spa-header';
import '../index';
import './ntl-spa-content.scss';

// Schließt nach der Auswahl; Fragmentnavigation und Formular-Reset bleiben native Aktionen.
document.querySelector<HTMLElement>('#spa-content-actions-menu')!.addEventListener('click', (event) => {
  const target = event.target as Element;
  if (target.closest('a, button')) {
    (event.currentTarget as HTMLElement).hidePopover();
  }
});
