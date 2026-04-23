# ntl-accordion

Ein flexibles Accordion-Layout für Nextrap. Wandelt Markdown-Überschriften (`###`) automatisch in klappbare Accordion-Items um.

## Installation

```typescript
import '@nextrap/ntl-accordion';
```

## Grundlegende Verwendung

In Kramdown-Markdown mit dem `layout`-Attribut:

```markdown
## Mein Accordion
{: layout="ntl-accordion"}

### Titel 1

Inhalt für Item 1

### Titel 2

Inhalt für Item 2
```

## ntl-accordion

Container-Komponente für das Accordion-Layout.

| Attribut             | Typ                        | Beschreibung                                      | Default     |
| -------------------- | -------------------------- | ------------------------------------------------- | ----------- |
| `exclusive`          | boolean                    | Nur ein Item kann gleichzeitig geöffnet sein      | `false`     |
| `initial-open-index` | number                     | Index des initial geöffneten Items (0-basiert)    | `undefined` |
| `marker-position`    | `'start'` \| `'end'`      | Position des Markers (links oder rechts)          | `'end'`     |
| `marker-icon`        | `'chevron'` \| `'plus'`   | Icon-Variante für den Marker                      | `'chevron'` |

## ntl-accordion-item

Einzelnes Accordion-Item (wird automatisch aus `###`-Überschriften generiert).

| Attribut          | Typ                        | Beschreibung                              | Default     |
| ----------------- | -------------------------- | ----------------------------------------- | ----------- |
| `open`            | boolean                    | Ob das Item geöffnet ist                  | `false`     |
| `marker-position` | `'start'` \| `'end'`      | Position des Markers (überschreibt Parent)| `'end'`     |
| `marker-icon`     | `'chevron'` \| `'plus'`   | Icon-Variante (überschreibt Parent)       | `'chevron'` |

## Beispiele

### Exclusive Accordion

Nur ein Item kann gleichzeitig geöffnet sein:

```markdown
## Exclusive Accordion
{: layout="ntl-accordion[exclusive='true']"}

### Item 1
Inhalt 1

### Item 2
Inhalt 2
```

### Initial geöffnetes Item

Das zweite Item (Index 1) ist initial geöffnet:

```markdown
## Accordion
{: layout="ntl-accordion[initial-open-index='1']"}

### Erstes Element
Geschlossen

### Zweites Element
Initial geöffnet
```

### Marker links positioniert

```markdown
## Accordion
{: layout="ntl-accordion[marker-position='start']"}

### Item mit Marker links
Der Chevron ist links positioniert
```

## CSS Custom Properties

| Variable                       | Beschreibung                                    | Default                  |
| ------------------------------ | ----------------------------------------------- | ------------------------ |
| `--marker-icon-closed`         | Icon im geschlossenen Zustand (Data-URL)        | SVG Chevron Down         |
| `--marker-icon-open`           | Icon im geöffneten Zustand (Data-URL)           | SVG Chevron Up           |
| `--marker-size`                | Größe des Marker-Icons                          | `1.5rem`                 |
| `--border-color`               | Farbe der Trennlinien                           | `#e5e7eb`                |
| `--background-color-heading`   | Hintergrundfarbe der Überschrift                | `var(--nt-light-subtle)` |

### Beispiel: Plus/Minus Icons in Markdown

Über das `marker-icon` Attribut auf dem Accordion-Container:

```markdown
## Accordion mit Plus/Minus Icons
{: layout="ntl-accordion[marker-icon='plus']"}

### Item 1
Inhalt 1

### Item 2
Inhalt 2
```

Einzelnes Item mit `section-marker-icon` überschreiben:

```markdown
### Plus/Minus Item
{: section-marker-icon="plus"}
```

### Eigene Icons via CSS

Eigene SVG-Icons können über CSS-Variablen auf dem `ntl-accordion-item` Element gesetzt werden:

```css
ntl-accordion-item.custom-icon {
  --marker-icon-closed: url("data:image/svg+xml,...");
  --marker-icon-open: url("data:image/svg+xml,...");
}
```

### Styling mit ::part()

Das Marker-Element kann von außen über `::part(marker)` gestylt werden:

```css
ntl-accordion-item::part(marker) {
  color: blue;
  width: 2rem;
  height: 2rem;
}
```

## Events

| Event              | Detail          | Beschreibung                        |
| ------------------ | --------------- | ----------------------------------- |
| `accordion-toggle` | `{ open: boolean }` | Wird beim Öffnen/Schließen gefeuert |
