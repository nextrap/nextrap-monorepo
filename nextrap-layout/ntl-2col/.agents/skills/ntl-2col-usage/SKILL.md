---
name: ntl-2col-usage
description: "@nextrap/ntl-2col korrekt importieren und in HTML oder trunkjs/content-pane Markdown mit den passenden Content-Bereichen verwenden."
---

# NTL 2Col Usage

Nutze diesen Skill für Markup, Content-Zuordnung und Beispiele. Für Theme-SCSS nutze `ntl-2col-theming`.

## Import

```ts
import '@nextrap/ntl-2col';
```

## Bereiche

Die Komponente bietet `header`, `top`, `main`, `aside`, `bottom` und `footer`:

- `header` und `footer` liegen außerhalb des gerahmten `wrapper`.
- `top` und `bottom` liegen im `wrapper` und gehen dort über die volle Breite.
- `main` und `aside` bilden im Desktop-Modus die beiden Spalten.
- Direkte Light-DOM-Kinder mit `.header`, `.top`, `.aside`, `.bottom` oder `.footer` werden automatisch zugeordnet.
- Direkte Bildabsätze können automatisch in `aside` verschoben werden.

Bereichsklassen müssen am direkten Light-DOM-Kind von `ntl-2col` stehen. Wenn ein Entwickler `header` oder `footer` sagt und die Ebene unklar ist, kläre, ob der äußere Bereich oder `top` beziehungsweise `bottom` im Wrapper gemeint ist.

## Markdown-Beispiele

Für besondere Slot-Anordnungen, insbesondere `top` als Desktop-Spalte, lies [references/examples.md](references/examples.md).

Standard mit acht von zwölf Spalten für `main`:

```markdown
## Behandlungsschwerpunkt
{: layout="ntl-2col" section-style="--cols: 8;"}

Der Hauptinhalt bleibt in `main`.

![Diagnostik](./diagnostik.jpg)
```

Überschrift als linke Spalte:

```markdown
## Behandlungsschwerpunkt
{: layout="ntl-2col.reverse" .aside section-style="--cols: 8;"}

Der Hauptinhalt bleibt in `main`.
```

Nutze immer die `trunkjs/content-pane`-Notation `{: layout="..."}`. Die Default-Style-Klasse wird automatisch ergänzt, wenn keine `style-*` Klasse gesetzt ist.

## Relevante Konfiguration

- `--cols`: Breite von `main` im Desktop-Zwölfersystem, standardmäßig `6`
- `--breakpoint`: Umschaltpunkt, standardmäßig `md`
- `--container-width`: Containerbreite
- `--gap`: Abstand zwischen den Spalten
- `.reverse`: tauscht `main` und `aside`
- `.reverse-desktop`: tauscht sie nur im Desktop-Modus
- `.breakout-start` / `.breakout-end`: aktiviert Desktop-Breakouts
