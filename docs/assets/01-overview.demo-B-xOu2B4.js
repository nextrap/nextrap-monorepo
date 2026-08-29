import './_virtual_tdemo-client-CxMeb5Rk.js';
import { d as e } from './types-4rIte7rE.js';
const n =
    '# `nte-nav-2` – API-Entwurf\n\nDas Paket lässt `@nextrap/nte-nav` unverändert und erprobt die spätere reine Navigationskomponente. Eine Navbar ist bewusst nicht Teil dieses Pakets.\n\n```html\n<nte-nav-2 aria-label="Hauptnavigation">\n  <nte-nav-item>\n    Leistungen\n    <nte-nav-item href="/leistungen/beratung">Beratung</nte-nav-item>\n  </nte-nav-item>\n  <nte-nav-item href="/ueber-uns">Über uns</nte-nav-item>\n</nte-nav-2>\n```\n\n- Der Autor schreibt keinen `ul/li/ul`-Baum mehr.\n- Jedes `nte-nav-item` rendert Link, natives `details`/`summary` und Untermenü im eigenen Shadow DOM.\n- Direkte verschachtelte `nte-nav-item`-Elemente werden automatisch dem Submenu-Slot zugeordnet.\n- Ein Elternpunkt ohne `href` ist vollständig als Disclosure bedienbar; mit `href` erhält er getrennte Link- und Disclosure-Aktionen.\n- Die Öffnungslogik nutzt natives `details`/`summary`, also keinen eigenen Click-State-Handler.\n- Horizontal wird das Untermenü als Popup positioniert; vertikal slidet es im Navigationsfluss unter dem Elternpunkt auf und zu.\n- Leere Icon-Slots werden durch `nextrap_element({ slotVisibility: true })` mit `.slot-empty` markiert und ausgeblendet.\n- Die Orientierung wird über SCSS-Mixins und vererbte CSS Custom Properties festgelegt.\n- `order="…"` sortiert die direkten Flex-Items, ohne die DOM- und Tastaturreihenfolge zu verändern.\n\n> Wichtig: Eine visuell abweichende Flex-Reihenfolge verändert nicht die Tab-Reihenfolge. `order` deshalb nur für optionale, nicht semantische Umordnungen einsetzen.\n',
  r = e({
    title: 'API-Entwurf',
    description: 'Komponentenmodell, Accessibility und Styling-Vertrag von nte-nav-2',
    markdown: n,
  });
export { r as default };
