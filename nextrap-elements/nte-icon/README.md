# @nextrap/nte-icon

Quadratische Icons als Bild oder Bootstrap-Icon-Klasse. Die Grundfunktion samt
Glyph-Zuordnungen liegt im Shadow DOM; die Schrift lädt erst beim ersten
verbundenen Font-Icon und wird dokumentweit geteilt.

```ts
import '@nextrap/nte-icon';
```

```html
<nte-icon class="bi bi-house" label="Startseite"></nte-icon>
<nte-icon src="/icons/logo.svg" height="2rem" label="Logo"></nte-icon>
<button type="button"><nte-icon class="bi-download"></nte-icon> Download</button>
```

## API

| Attribut/Property | Verhalten |
| --- | --- |
| `src` | Bild-URL; hat Vorrang vor einer Icon-Klasse und lädt keinen Font. |
| `class` | Eine Bootstrap-Klasse wie `bi-house`; `bi` ist optional. |
| `size` | `xs=.75em`, `sm=.875em`, `md=1em`, `lg=1.25em`, `xl=1.5em`, `xxl=2em`. |
| `height` | Explizite Höhe, z. B. `24px`, `2rem`, `1.5em`; Breite entspricht der Höhe. |
| `label` | Zugängliche Beschriftung. Ohne Label ist das Icon dekorativ. |
| `placeholder` | Text während des Ladens und bei Fehlern; Standard `…`, `""` blendet ihn aus. |
| `loadingState` | Nur lesbar: `empty`, `loading`, `loaded`, `error`; auch als `loading-state`-Attribut. |

`s/small`, `m/medium`, `l/large` und `2xl` sind Größen-Aliase für `sm`, `md`,
`lg` und `xxl`. Ohne Größenanpassung gilt `1em × 1em`; Farbe und Größe richten
sich nach dem umgebenden Text. `height` geht vor `--nte-icon-size` und `size`.
Autorenseitige `aria-label`, `aria-labelledby`, `aria-hidden` und `role` bleiben
maßgeblich. Bei Icon-only-Buttons gehört die Aktionsbeschriftung an den Button.

`nte-icon-load` und `nte-icon-error` blubbern über Shadow-Grenzen. Ihr `detail`
enthält `source: 'font' | 'image'`, im Fehlerfall zusätzlich `error`. Nach einem
Quellenwechsel oder Disconnect werden veraltete Ergebnisse verworfen.

## Font-Quelle

```ts
import { NTE_ICON_CONFIG } from '@nextrap/nte-icon';

// Vor der ersten verbundenen Instanz mit Bootstrap-Klasse setzen.
NTE_ICON_CONFIG.bootstrapIconsFontUrl = '/fonts/bootstrap-icons.woff2';
```

Standard ist
`https://cdn.leuffen.de/hyperpage-components/v1.0/fonts/bootstrap-icons.woff2`.
Konfiguration und Lade-Promise werden auch bei mehrfach eingebundenen
Package-Kopien geteilt. Pro Dokument wird genau ein Download versucht; auch
ein Fehlschlag bleibt gecacht und zeigt den Platzhalter. Die URL ist nach dem
ersten Ladeversuch für dieses Dokument festgelegt. Eine eigene Schriftdatei
muss dieselbe Glyph-Zuordnung besitzen und gegebenenfalls CORS und die
`font-src`-Policy der Anwendung erfüllen. Der Import lädt keinen Font.

Die 1.996 Zuordnungen stammen aus
[ThemeJS2](https://github.com/leuffen/themejs2/blob/main/font/_vendor/font-bootstrap-icons.scss)
und erhalten die Klassennamen von Bootstrap Icons v1.10.0 einschließlich
seiner Aliase. 43 historische Aliase verwenden die unterstützten Codepoints
ihrer kanonischen Entsprechungen; alle Zuordnungen wurden gegen die
tatsächliche CDN-Schrift geprüft. Siehe
[MIT-Lizenz](LICENSE.bootstrap-icons.md). Die Größenstaffel orientiert sich an
[Font Awesome](https://docs.fontawesome.com/web/style/size/).

## Styling

```scss
@use '@nextrap/nte-icon' as icon;

nte-icon.style-default { @include icon.default-style(); }
.toolbar nte-icon { --nte-icon-size: 1.25rem; }
```

Der Sass-Import selbst erzeugt keine Styles. Das Mixin ergänzt die vertikale
Ausrichtung und eine dezente Platzhalterdarstellung. Öffentliche Parts sind
`icon`, `image` und `placeholder`; `--nte-icon-size` steuert beide Dimensionen.
Der Default-Slot ist ausschließlich ein sichtbarer Diagnose-Fallback für
unerwarteten Inhalt. Zusätzliche Icon-Font-Sets und SVG-Inlining sind nicht
Teil dieser API.

Die [Usage-Anleitung](.agents/skills/nte-icon-usage/SKILL.md) und die
[Theming-Anleitung](.agents/skills/nte-icon-theming/SKILL.md) dokumentieren den
Package-Vertrag. Die Demo liegt unter `demo/01-icons.demo.ts`.
