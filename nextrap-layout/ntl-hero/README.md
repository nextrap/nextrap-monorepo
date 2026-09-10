# ntl-hero

Hero-Layout mit einer Hintergrundebene und vier vertikal angeordneten Inhaltsbereichen.

## Einbindung und Styling

Die Registrierung erfolgt über `import '@nextrap/ntl-hero'` und lädt keine Hero-Light-DOM-Styles. Wie bei `ntl-2col` und `ntl-card-row` stellt `index.scss` ausschließlich eine Sass-API bereit. Das Theme bindet die vollständige visuelle Baseline explizit ein:

```scss
@use '@nextrap/ntl-hero' as hero;

// Verknüpft die Standarddarstellung mit der automatisch gesetzten Style-Klasse.
ntl-hero.style-default {
  @include hero.default-style();
}
```

`nt-core` setzt `style-default` automatisch, solange keine andere `style-*` Klasse vorhanden ist. Pro Element gilt genau eine solche Klasse. Eigene Varianten müssen ihre vollständige Baseline selbst einbinden:

```scss
// Gibt einer eigenständigen Variante eine vollständige, konfigurierbare Baseline.
ntl-hero.style-campaign {
  @include hero.default-style($background: var(--nt-primary), $min-height: 480px);
}
```

Ohne eingebundene Baseline bleiben nur die funktionale Ebenen-/Slot-Struktur und das Ausblenden leerer Bereiche aktiv. Viewport-Höhe, Zentrierung, Hintergrundfarbe und Bildanpassung gehören zum Mixin. `tj-responsive` wird vom Theme bereitgestellt; die Komponente verwendet dessen vorhandene Responsive-API.

## Slots und Parts

| Slot | Part | Zweck |
|---|---|---|
| `bg` | `background` | Hintergrund hinter dem Inhalt; überstehende Medien werden abgeschnitten |
| `top-title` | `top-title` | Inhalt oberhalb des Titels |
| `title` | `title` | Haupttitel |
| unbenannt | `content` | Hauptinhalt |
| `footer` | `footer` | Abschließender Inhalt innerhalb des Hero |

Zusätzliche Parts: `root` für die gesamte Hero-Fläche und `wrapper` für den Inhaltsrahmen. Benannte Slots werden explizit zugewiesen; die Slot-Namen und ihre Reihenfolge bleiben unverändert.

## Content-Pane-Beispiel

```markdown
---
{: layout="1;ntl-hero" section-style="--min-height: 480px;"}

Unser Angebot
{: section-slot="top-title"}

# Willkommen
{: section-slot="title"}

Ein kurzer Einstieg in das Thema.

[Mehr erfahren](/angebot)
{: section-slot="footer"}
```

## Konfiguration

`default-style()` akzeptiert folgende Theme-Vorgaben. Die Variablen können am Host, etwa über `section-style`, pro Instanz überschrieben werden.

| Sass-Parameter | CSS-Variable | Standard |
|---|---|---|
| `$background` | `--bg-color` | `var(--nt-body-teritary, #e4e6ef)` |
| `$container-width` | `--container-width` | `var(--nt-container-width, 100%)` |
| `$min-height` | `--min-height` | `600px` |
| `$max-height` | `--max-height` | `1800px` |
| `$top-offset` | `--top-offset` | `0px` |

Der bestehende Hintergrund-Tokenname `--nt-body-teritary` bleibt zur Kompatibilität erhalten; Themes können stattdessen `$background` oder `--bg-color` explizit setzen.

Die Baseline berechnet die Höhe mit `calc(100vh - var(--height-offset, 0px))`, begrenzt durch Mindest- und Maximalhöhe. Die Komponente schreibt `--height-offset` nach ihrem Update aus `offsetTop`; dieser Wert ist daher keine dauerhafte manuelle Konfiguration. `--breakpoint` behält den Standard `xl`. Die bestehende Slot-Reihenfolge gilt in beiden Modes; eigene Desktop-Varianten werden auf `[mode='desktop']` begrenzt.

Das Mixin passt direkte `p[slot='bg'] > img` mit `object-fit: cover` ein. Andere Hintergrundkomponenten steuern ihre Darstellung selbst. Textkontrast, Alternativtexte und sichtbare Fokuszustände verantwortet das verwendende Theme beziehungsweise Markup.

## Migration

| Old | New |
|---|---|
| Hero-CSS automatisch durch den TypeScript-Import | `default-style()` im Theme an `ntl-hero.style-default` binden |
| CSS-Ausgabe durch `@use '@nextrap/ntl-hero'` | Ausgabefreie API; Ausgabe erst durch `@include` |
| Implizite visuelle Baseline im Shadow DOM | Explizite Baseline über öffentliche Parts und CSS-Variablen |

## Prüfung

`nx build ntl-hero` baut das Package. `demo/main.scss` zeigt die Default-Anbindung; `demo/base.md` enthält das bestehende Content-Pane-Beispiel.
