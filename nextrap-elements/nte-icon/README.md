# @nextrap/nte-icon

Ein quadratisches Inline-Icon mit genau einer Property: `src`. Ohne Bildquelle
wählen die Klassen am Host das Bootstrap-Glyph direkt per CSS.

```ts
import '@nextrap/nte-icon';
```

```html
<nte-icon class="bi bi-house" role="img" aria-label="Startseite"></nte-icon>
<nte-icon src="/icons/logo.svg" style="--nte-icon-size: 2rem" aria-hidden="true"></nte-icon>
<button type="button"><nte-icon class="bi bi-download" aria-hidden="true"></nte-icon> Download</button>
```

Die Basisgröße ist `1em × 1em`. Farbe wird geerbt; die Größe steuern
`font-size` oder `--nte-icon-size`. Optionale Größenklassen werden vom Theme
im Light DOM eingebunden:

```scss
@use '@nextrap/nte-icon' as icon;
nte-icon { @include icon.sizes(); }
```

`size-xs`, `size-sm`, `size-md`, `size-lg`, `size-xl`, `size-xxl` entsprechen
`.75`, `.875`, `1`, `1.25`, `1.5`, `2em`. Es gibt kein `size`-Attribut und
keine Properties für Label, Höhe, Platzhalter oder Ladezustände. Beschriftung
und dekorative Verwendung erfolgen über native ARIA-Attribute. `src` hat
Vorrang vor einem Font-Glyph; Bilder bleiben über `::part(image)` erreichbar.

```ts
import { NTE_ICON_CONFIG } from '@nextrap/nte-icon';
// Vor der ersten Instanz setzen.
NTE_ICON_CONFIG.bootstrapIconsFontUrl = '/fonts/bootstrap-icons.woff2';
```

Standard:
`https://cdn.leuffen.de/hyperpage-components/v1.0/fonts/bootstrap-icons.woff2`.
Die erste Instanz registriert die Schrift einmal in `document.fonts`; der
Browser lädt sie erst, wenn CSS tatsächlich ein Font-Glyph darstellt.
Bild-Icons benötigen keinen Font-Download. Es gibt keine zusätzliche
Ladezustands-, Placeholder- oder Event-API.

Die statische [Bootstrap-CSS](src/components/nte-icon/bootstrap-icons.css)
enthält 1.996 Klassennamen aus ThemeJS2. 43 historische Aliase nutzen die
vorhandenen Codepoints der CDN-Schrift. Keine Sass-Map und kein Generator;
Lizenz: [MIT](LICENSE.bootstrap-icons.md).
