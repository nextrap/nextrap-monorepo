---
name: ntl-spa-header-theming
description: "Theme-SCSS für @nextrap/ntl-spa-header erstellen oder ändern: default-style(), öffentliche Parts, Zeilenhöhen und abstandsfreier Header. Nicht für allgemeine HTML- oder API-Fragen."
---

# SPA Header gestalten

Nutze die öffentliche Sass-API und Parts für die visuelle Gestaltung. Für
Import, HTML und Slot-Zuordnung lies den
[Usage-Skill](../ntl-spa-header-usage/SKILL.md).

```scss
@use '@nextrap/ntl-spa-header' as spaHeader;

// Das Theme stellt die NT-Tokens bereit und materialisiert die Header-Optik.
ntl-spa-header.style-default {
  @include spaHeader.default-style();
  --main-line-height: 4.5rem;
  --sub-line-height: 2rem;
}
```

`index.scss` exportiert nur `default-style()` und gibt beim Import kein CSS aus.
Das Mixin gestaltet Text, hellgraue Fläche im hellen Theme, Schrift und untere
Trennlinie mit `--nt-text`, `--nt-surface-muted`, `--nt-font-family` und
`--nt-border`. Ein sehr dezenter innerer Schatten mit `--nt-black` bildet eine
etwa 1–2px schmale Kante zum Content. Er bleibt innerhalb des Headers und
verschwindet mit ihm beim Scrollen; über dem sticky Workspace bleibt kein
äußerer Schatten stehen. Das Mixin erhöht die Stapelposition des Headers nicht.
Die Fokusmarkierung der Scrollbereiche verwendet `--nt-primary`. Das Mixin
setzt keine Abstände.
Die Tokens kommen vom Anwendungstheme; der Header importiert `style-base` nicht.

| Part | Verantwortung |
|---|---|
| `main-line` | Obere Zeile und ihr nativer Scrollbereich. |
| `brand` | Inhalt am Anfang der oberen Zeile. |
| `main-nav` | Navigation direkt neben dem Brand; nimmt freie Breite auf. |
| `right-nav` | Aktionen am Ende der oberen Zeile. |
| `sub-line` | Zweite Zeile und ihr nativer Scrollbereich. |

| Variable | Default | Bedeutung |
|---|---|---|
| `--main-line-height` | `4.5rem` | Feste Höhe der oberen Zeile. |
| `--sub-line-height` | `2rem` | Feste Höhe der belegten Sub-Line. |

Die untere Default-Trennlinie ist zusätzlich `1px` hoch. Verwende die
vorhandenen Variablen für Instanzhöhen; erzeuge dafür keine eigene Style-Variante.

Erhalte die Grid-Zuordnung und vertikale Zentrierung der Slots. Die Hauptzeile
behält bei knapper Breite die Inhaltsbreiten und lässt sich horizontal scrollen.
Überhoher Inhalt wird vom Anfang der jeweiligen Zeile aus erreichbar gehalten.
Leere Slots werden durch die Nextrap-Basis erkannt und brauchen keinen Platz.
Erhalte die Tastatur-Fokussierbarkeit und sichtbare Fokusmarkierung beider Zeilen.

Setze seitliche Abstände und Abstände zwischen Aktionen an den Light-DOM-Inhalten,
etwa mit `ms-*`, `me-*` oder den Gruppen-Utilities der Anwendung. Füge dem Host,
seinen Zeilen und Slots kein implizites Padding, Gap oder Margin hinzu. Eine
verschachtelte Inhaltsgruppe ist für die Anordnung ihrer eigenen Kinder zuständig.

Pro Instanz ist genau eine `style-*` Klasse vorgesehen; der Header hat keine
zusätzlichen Modifier oder Breakpoints. Halte ihn im normalen Dokumentfluss,
wenn er vor einem sticky SPA-Content aus dem Viewport scrollen soll.
