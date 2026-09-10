# nte-consent-blocker

`nte-consent-blocker` zeigt eine Vorschau und einen Freigabebutton für externe Embeds wie Google Maps.
Erst nach dem Klick wird der Inhalt eines inerten Templates in den Slot `consented-content` kopiert.

## Einbindung

```ts
// Registriert die Komponente ohne Light-DOM-Styles.
import '@nextrap/nte-consent-blocker';
```

Das Theme stellt ein dokumentweites `<template id="map-template">` mit dem gewünschten Embed bereit.
Das Template muss bei der Initialisierung vorhanden sein; eine iframe-URL gehört ausschließlich in
seinen inerten Inhalt, damit das Embed erst nach der Freigabe geladen wird.

```md
---
{: layout="nte-consent-blocker" section-style="--default-template-selector: #map-template;"}
```

Ohne explizite Slot-Inhalte ergänzt die Komponente die eingebaute Maps-Vorschau und den Consent-Hinweis
als Light-DOM-Elemente. Das Vorschaubild selbst wird bereits vor der Freigabe von `cdn.leuffen.de` geladen;
die Sperre betrifft den Embed-Inhalt. Ein vollständiges Theme-Setup steht in [demo/setup.ts](demo/setup.ts),
die Content-Beispiele in [demo/base.md](demo/base.md).

## Wiederverwendbare Inhalte und Slots

| Konfiguration | Wirkung |
|---|---|
| `--default-template-selector` | Kopiert ein dokumentweites Template als direktes Embed-Template, falls keines vorhanden ist |
| `--default-background-selector` | Wählt ein Template für den fehlenden `background`-Slot |
| `--default-pre-consent-selector` | Wählt ein Template für den fehlenden `pre-consent`-Slot |
| Direktes `<template>` | Hat Vorrang vor dem globalen Embed-Template |
| Direkte Kinder mit `slot="background"` / `slot="pre-consent"` | Haben Vorrang vor den jeweiligen Defaults |
| Direkte `.background`-Kinder oder `p:has(img:not(.keep))` | Werden automatisch dem `background`-Slot zugeordnet |
| Button mit `data-action="consent"` | Gibt den Template-Inhalt für diese Instanz frei |

Selector-Werte wie `#map-template` werden bei der Initialisierung ausgewertet. Quellen bleiben erhalten
und können von mehreren Instanzen verwendet werden. Die Selector-Konfiguration gehört ins Theme oder
als `section-style` an die Instanz, nicht in eingebettete `<style>`-Blöcke im Markdown.

## Styling

```scss
// Das Theme lädt die Tokens einmal und materialisiert die visuelle Baseline explizit.
@use '@nextrap/style-base/default';
@use '@nextrap/nte-consent-blocker' as consentBlocker;

// Die Basiskomponente ergänzt diese Klasse automatisch, wenn keine style-* Klasse vorhanden ist.
nte-consent-blocker.style-default {
  @include consentBlocker.default-style();
}
```

`index.scss` stellt ausschließlich die Mixin-API bereit und erzeugt keine CSS-Ausgabe.
Alternativ materialisiert `@use '@nextrap/nte-consent-blocker/default';` dieselbe Baseline für
`nte-consent-blocker.style-default`. Beide Wege sind Alternativen; nicht doppelt einbinden.
Die Button-Klassen `btn btn-primary` im Light DOM gestaltet das Theme mit `@nextrap/style-button`.

Der Shadow DOM enthält nur Layering, Flächengrößen und funktionale Zustandswechsel. Seitenverhältnis,
Ausrichtung, Übergänge, Rahmen und Embed-/Vorschau-Styles liegen vollständig in `default-style()`.
Eine eigene `style-*`-Variante muss ihre vollständige Baseline selbst bereitstellen; pro Instanz wird
genau eine Style-Klasse verwendet.

| Öffentlicher Part | Verantwortung des Themes |
|---|---|
| `wrapper` | Rahmenform und Clipping |
| `background` | Übergang der Vorschau |
| `pre-consent` | Overlay-Fläche, Padding und Ausrichtung |
| `consented-content` | Übergang zum freigegebenen Inhalt |
| `loading-text` | Darstellung und Ausrichtung des Ladehinweises |

| Variable | Standard / Zweck |
|---|---|
| `--aspect-ratio` | `16 / 9`, bei `[mode='mobile']` `1 / 1`; pro Instanz überschreibbar |
| `--breakpoint` | `lg`; vorhandene Responsive-Zustände steuern den Modus |
| `--border-radius` | `var(--nt-border-radius)` |
| `--overlay-background` | `rgba(255, 255, 255, 0.82)` |
| `--pre-consent-padding` | `var(--nt-space-3)` |

`default-style()` unterstützt weiterhin die optionalen Parameter `$default-background-selector`,
`$default-pre-consent-selector`, `$border-radius`, `$overlay-background` und `$pre-consent-padding`.
Instanzwerte werden über `section-style` gesetzt und können damit auch den mobilen Standard überschreiben.

## Pairing mit ntl-2col

Das Theme ergänzt innerhalb seiner Blocker-Style-Klasse
`@include consentBlocker.pairing-ntl-2col-in-nte-consent-blocker();` nach `default-style()`.
Direkte Blocker mit `.aside` oder `.top` werden von `ntl-2col` zugeordnet. Im Top-Slot setzt das Pairing
`--aspect-ratio: 21 / 9` in allen Modi; `$top-aspect-ratio` konfiguriert diesen Wert.
Siehe [demo/pairing-ntl-2col.md](demo/pairing-ntl-2col.md) für beide Markdown-Anordnungen.

## Migration

| Old | New |
|---|---|
| Theme-Selektor `nte-consent-blocker.default` | `nte-consent-blocker.style-default` |
| Explizite `.default` in Content-Beispielen | Entfällt; `.style-default` wird automatisch ergänzt |
| Visuelle Vorgaben aus dem Shadow DOM | `default-style()` im Theme einbinden |
| Duplizierte HTML-Embeds und Inline-Styles in Markdown-Demos | Gemeinsame Templates in `demo/setup.ts`, Konfiguration in `demo/main.scss` |

## Demos im Demo Viewer

Aus dem Repository-Root startet `npm run demo` den gemeinsamen `@trunkjs/demo-viewer`.
Der vorhandene Vite-Plugin-Glob erkennt [base.demo.ts](demo/base.demo.ts) und
[pairing-ntl-2col.demo.ts](demo/pairing-ntl-2col.demo.ts) automatisch.

Beide Definitionen laden ihr Markdown mit `?raw` und rendern es über `wrapper_html` in
`<tj-content-pane>`. [demo/setup.ts](demo/setup.ts) liefert vorher die gemeinsamen inerten Templates,
sodass jede Demo direkt und nach einem Wechsel funktioniert. `demo/main.scss?inline` bindet die
Styles über `css` ein und macht die Sass-Quelle im **Show code**-Tab sichtbar.
Der bisherige Package-Einstieg über `index.html` und `demo/main.ts` entfällt.
