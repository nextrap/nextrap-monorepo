---
name: ntl-spa-header-usage
description: "@nextrap/ntl-spa-header in SPA-Seiten verwenden: Import, NtlSpaHeader, HTML-Slots, Zeilenhöhen und Kombination mit ntl-spa-content. Nicht für Theme-SCSS."
---

# SPA Header verwenden

Verwende den Header für Brand, Navigation und Aktionen oberhalb eines
SPA-Workspaces. Er ordnet vorhandene Inhalte an; Routing und Menüverhalten
bleiben bei der Anwendung. Für visuelle Anpassungen lies den
[Theming-Skill](../ntl-spa-header-theming/SKILL.md).

## Import und HTML

```ts
// Registriert das Element; das Anwendungstheme stellt Styles separat bereit.
import '@nextrap/ntl-spa-header';
```

```html
<!-- Margins an den Inhalten bestimmen die Abstände zu den Seiten und zueinander. -->
<ntl-spa-header role="banner">
  <a slot="brand" class="ms-4 me-3" href="#ueberblick">NEXTRAP</a>
  <nav slot="main-nav" aria-label="Hauptnavigation">
    <a href="#ueberblick">Übersicht</a>
  </nav>
  <a slot="right-nav" class="btn btn-neutral ms-3 me-4" href="#hinweise">Hilfe</a>
  <p slot="sub-line" class="m-0 mx-4 small">Mein Workspace</p>
</ntl-spa-header>
```

Nutze direkte Kinder mit den Slot-Namen `brand`, `main-nav`, `right-nav` und
`sub-line`. Mehrere Kinder desselben Slots stehen nebeneinander und sind
vertikal zentriert. Ein Wrapper ordnet seine eigenen Nachfahren selbst an,
beispielsweise mit `d-flex align-items-center gap-2` aus den Style-Utils.
Der Header setzt selbst weder Padding noch Gap oder Margin.

Lass unbenutzte Slots weg. Die Sub-Line und eine vollständig leere obere Zeile
belegen keinen Platz. Whitespace und Kommentare gelten als leer; ein
zugewiesener leerer oder versteckter Wrapper zählt als Belegung. Inhalte ohne
Slot-Namen erscheinen sichtbar als Diagnose und müssen korrekt zugeordnet werden.

## Höhen und Einbindung

Setze `--main-line-height` und `--sub-line-height` am Host; die Defaults sind
`4.5rem` und `2rem`. Die Höhen bleiben fest. Bei überlangem Inhalt wird die
jeweilige Zeile nativ scrollbar; die obere Navigation überlagert dabei ihre
Nachbarn nicht. Es gibt keine automatische mobile Menü- oder Drawer-Variante.
Beide Zeilen sind für die Bedienung ihres Scrollbereichs per Tastatur fokussierbar.

Platziere den Header als vorheriges Geschwister von `<ntl-spa-content>`, wenn
er beim Seitenscrollen verschwinden soll. Er ist selbst weder fixed noch sticky.
Die Anwendung entscheidet über semantische Rollen und die Beschriftung ihrer
`nav`-Elemente. Die vollständige Integration steht in der
[HTML-Demo von SPA Content](../../../../ntl-spa-content/demo/index.html).

`NtlSpaHeader` ist der öffentliche Typ. Eigene Properties oder Events gibt es
nicht. Ohne andere `style-*` Klasse ergänzt die Nextrap-Basis `style-default`;
das Anwendungstheme muss das dazugehörige Mixin explizit materialisieren.
