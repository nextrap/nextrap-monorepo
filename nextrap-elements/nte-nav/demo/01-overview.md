# `@nextrap/nte-nav` – Navigation

Das Paket stellt die reine Navigationskomponente bereit. Eine Navbar ist bewusst nicht Teil dieses Pakets.

```html
<nte-nav aria-label="Hauptnavigation">
  <nte-nav-item>
    Leistungen
    <nte-nav-item href="/leistungen/beratung">Beratung</nte-nav-item>
  </nte-nav-item>
  <nte-nav-item href="/ueber-uns">Über uns</nte-nav-item>
</nte-nav>
```

- Der Autor schreibt keinen `ul/li/ul`-Baum mehr.
- Jedes `nte-nav-item` rendert Link, natives `details`/`summary` und Untermenü im eigenen Shadow DOM.
- Direkte verschachtelte `nte-nav-item`-Elemente werden automatisch dem Submenu-Slot zugeordnet.
- Ein Elternpunkt ohne `href` ist vollständig als Disclosure bedienbar; mit `href` erhält er getrennte Link- und Disclosure-Aktionen.
- Die Öffnungslogik nutzt natives `details`/`summary`, also keinen eigenen Click-State-Handler.
- Horizontal wird das Untermenü als Popup positioniert; vertikal slidet es im Navigationsfluss unter dem Elternpunkt auf und zu.
- Leere Icon-Slots werden durch `nextrap_element({ slotVisibility: true })` mit `.slot-empty` markiert und ausgeblendet.
- Die Orientierung wird über SCSS-Mixins und vererbte CSS Custom Properties festgelegt.
- `style="--order: …"` sortiert die direkten Flex-Items, ohne die DOM- und Tastaturreihenfolge zu verändern.
- Visuelle Varianten wie `style-bordered` erweitern `default-style()` über ein eigenes Mixin und stylen die öffentlichen Parts.

> Wichtig: Eine visuell abweichende Flex-Reihenfolge verändert nicht die Tab-Reihenfolge. `--order` deshalb nur für optionale, nicht semantische Umordnungen einsetzen.
