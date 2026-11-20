# @nextrap/ntl-spa-header

Ein zweizeiliger Header für SPA-Seiten. Die obere Zeile enthält Brand,
Hauptnavigation und rechte Aktionen; die optionale Sub-Line enthält ergänzende
Navigation oder Text. Alle direkt zugewiesenen Inhalte sind vertikal zentriert.
Das Package setzt weder Padding noch Gap oder Margin.

## HTML verwenden

```ts
// Registriert das Custom Element; das Theme bindet die Optik separat ein.
import '@nextrap/ntl-spa-header';
```

```html
<!-- Abstände gehören den Inhalten; mehrere rechte Aktionen teilen denselben Slot. -->
<ntl-spa-header role="banner">
  <a slot="brand" class="ms-4 me-3" href="#ueberblick">NEXTRAP</a>
  <nav slot="main-nav" aria-label="Hauptnavigation">
    <a href="#ueberblick">Übersicht</a>
  </nav>
  <a slot="right-nav" class="btn btn-neutral ms-3" href="#hinweise">Hilfe</a>
  <a slot="right-nav" class="btn btn-primary ms-2 me-4" href="#kompakt">Beispiel</a>
  <p slot="sub-line" class="m-0 mx-4 small">Mein Workspace</p>
</ntl-spa-header>
```

Die vollständige [HTML-Demo](demo/index.html) enthält die zugehörigen Ziele und
das Style-Setup. Die Klassen für Abstände und Buttons stammen aus den vorhandenen
Nextrap-Style-Packages. Bei einer Gruppe mit mehreren verschachtelten Elementen
ordnet die Gruppe ihre Kinder selbst an, etwa mit `d-flex align-items-center`.

| Slot | Position |
|---|---|
| `brand` | Anfang der oberen Zeile. |
| `main-nav` | Direkt neben dem Brand, mit der verbleibenden freien Breite. |
| `right-nav` | Ende der oberen Zeile; auch mehrere direkte Kinder möglich. |
| `sub-line` | Optionale zweite Zeile über die gesamte Breite. |

Leere Slots verschwinden; ohne belegten oberen Slot entfällt auch die obere
Zeile. Nicht benannte Inhalte erscheinen sichtbar als Diagnose für fehlende
Slot-Zuordnungen. Ein zugewiesener leerer Wrapper gilt weiterhin als Belegung.

## Styling und Höhen

```scss
@use '@nextrap/ntl-spa-header' as spaHeader;

// Optik explizit einbinden; die Komponente ergänzt style-default automatisch.
ntl-spa-header.style-default {
  @include spaHeader.default-style();
}
```

Setze `--main-line-height` und `--sub-line-height` am Host. Die Defaults sind
`4.5rem` und `2rem`; die Default-Trennlinie kommt zusätzlich hinzu. Für eine
kompakte Instanz genügt beispielsweise `style="--main-line-height: 3.5rem"`.
Eine nicht belegte Sub-Line benötigt unabhängig von ihrem Höhenwert keinen Platz.

Die Höhen bleiben fest. Bei knapper Breite scrollt die obere Zeile horizontal,
anstatt Navigation und Aktionen zu überlagern. Zu großer Inhalt in einer Zeile
bleibt über deren fokussierbaren nativen Scrollbereich erreichbar. Es gibt keine eigene
Scroll-, Resize-, Breakpoint- oder Menülogik.

Setze seitliche Abstände an Brand, Aktionen und Sub-Line-Inhalt, etwa mit
`ms-4`, `me-4` oder `mx-4`. Die öffentlichen Parts heißen `main-line`, `brand`,
`main-nav`, `right-nav` und `sub-line`; Details stehen im
[Theming-Skill](.agents/skills/ntl-spa-header-theming/SKILL.md).

Vor `<ntl-spa-content>` bleibt der Header im normalen Dokumentfluss und scrollt
mit der Seite aus dem Bildschirm. Das Content-Layout übernimmt anschließend
seine eigene Sticky-Position und Höhenanpassung. Einbindung und vollständige Seite:
[SPA-Content-Demo](../ntl-spa-content/demo/index.html).

## Demo starten

```sh
npx nx dev ntl-spa-header
```

Der Package-Viewer liegt auf `/`, die vollständige Seite auf `/demo/index.html`.
