# `nte-nav-2` – API-Entwurf

Das Paket lässt `@nextrap/nte-nav` unverändert und erprobt die spätere reine Navigationskomponente. Eine Navbar ist bewusst nicht Teil dieses Pakets.

```html
<nte-nav-2 aria-label="Hauptnavigation">
  <nte-nav-item href="/leistungen">
    Leistungen
    <nte-nav-item href="/leistungen/beratung">Beratung</nte-nav-item>
  </nte-nav-item>
  <nte-nav-item href="/ueber-uns">Über uns</nte-nav-item>
</nte-nav-2>
```

- Der Autor schreibt keinen `ul/li/ul`-Baum mehr.
- Jedes `nte-nav-item` rendert seinen Link, Disclosure-Button und Submenu-Popover im eigenen Shadow DOM.
- Direkte verschachtelte `nte-nav-item`-Elemente werden automatisch dem Submenu-Slot zugeordnet.
- Ein Element mit Link und Unterpunkten erhält getrennte Link- und Disclosure-Aktionen.
- Die Öffnungslogik nutzt natives `popover="auto"` plus `popovertarget`, also kein eigenes Click-/Outside-/Escape-JavaScript.
- Die Orientierung wird über SCSS-Mixins und vererbte CSS Custom Properties festgelegt.
- `order="…"` sortiert die direkten Flex-Items, ohne die DOM- und Tastaturreihenfolge zu verändern.

> Wichtig: Eine visuell abweichende Flex-Reihenfolge verändert nicht die Tab-Reihenfolge. `order` deshalb nur für optionale, nicht semantische Umordnungen einsetzen.
