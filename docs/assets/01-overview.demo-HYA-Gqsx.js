import { h as e } from './_virtual_tdemo-client-8tx_scwF.js';
const n =
    '# `nte-nav-2` – API-Entwurf\n\nDas Paket lässt `@nextrap/nte-nav` unverändert und erprobt die spätere reine Navigationskomponente. Eine Navbar ist bewusst nicht Teil dieses Pakets.\n\n```html\n<nte-nav-2 aria-label="Hauptnavigation">\n  <nte-nav-item href="/leistungen">\n    Leistungen\n    <nte-nav-item href="/leistungen/beratung">Beratung</nte-nav-item>\n  </nte-nav-item>\n  <nte-nav-item href="/ueber-uns">Über uns</nte-nav-item>\n</nte-nav-2>\n```\n\n- Der Autor schreibt keinen `ul/li/ul`-Baum mehr.\n- Jedes `nte-nav-item` rendert seinen Link, Disclosure-Button und Submenu-Popover im eigenen Shadow DOM.\n- Direkte verschachtelte `nte-nav-item`-Elemente werden automatisch dem Submenu-Slot zugeordnet.\n- Ein Element mit Link und Unterpunkten erhält getrennte Link- und Disclosure-Aktionen.\n- Die Öffnungslogik nutzt natives `popover="auto"` plus `popovertarget`, also kein eigenes Click-/Outside-/Escape-JavaScript.\n- Die Orientierung wird über SCSS-Mixins und vererbte CSS Custom Properties festgelegt.\n- `order="…"` sortiert die direkten Flex-Items, ohne die DOM- und Tastaturreihenfolge zu verändern.\n\n> Wichtig: Eine visuell abweichende Flex-Reihenfolge verändert nicht die Tab-Reihenfolge. `order` deshalb nur für optionale, nicht semantische Umordnungen einsetzen.\n',
  i = e({
    title: 'API-Entwurf',
    description: 'Komponentenmodell, Accessibility und Styling-Vertrag von nte-nav-2',
    markdown: n,
  });
export { i as default };
