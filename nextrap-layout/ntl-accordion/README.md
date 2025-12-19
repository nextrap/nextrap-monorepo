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

| Attribut             | Typ                  | Beschreibung                                      | Default     |
| -------------------- | -------------------- | ------------------------------------------------- | ----------- |
| `exclusive`          | boolean              | Nur ein Item kann gleichzeitig geöffnet sein      | `false`     |
| `initial-open-index` | number               | Index des initial geöffneten Items (0-basiert)    | `undefined` |
| `marker-icon`        | `'chevron'` \| `'plus'` | Icon-Typ für alle Items                        | `'chevron'` |
| `marker-position`    | `'start'` \| `'end'` | Position des Markers (links oder rechts)          | `'end'`     |

## ntl-accordion-item

Einzelnes Accordion-Item (wird automatisch aus `###`-Überschriften generiert).

| Attribut          | Typ                  | Beschreibung                              | Default     |
| ----------------- | -------------------- | ----------------------------------------- | ----------- |
| `open`            | boolean              | Ob das Item geöffnet ist                  | `false`     |
| `marker-position` | `'start'` \| `'end'` | Position des Markers (überschreibt Parent)| `'end'`     |

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

### Plus/Minus Icons

```markdown
## Accordion
{: layout="ntl-accordion[marker-icon='plus']"}

### Plus Item
Verwendet + / - statt Chevron
```

## CSS Custom Properties

Styling kann über CSS Custom Properties angepasst werden:

| Property            | Beschreibung                     |
| ------------------- | -------------------------------- |
| `--marker-icon`     | Icon-Typ (`chevron` oder `plus`) |

### Individuelles Item-Styling

Einzelne Items können individuell gestylt werden:

```markdown
### Item mit Plus-Icon
{: style="--marker-icon: plus"}

### Item mit Marker links
{: marker-position="start"}
```

## Events

| Event              | Detail          | Beschreibung                        |
| ------------------ | --------------- | ----------------------------------- |
| `accordion-toggle` | `{ open: boolean }` | Wird beim Öffnen/Schließen gefeuert |
