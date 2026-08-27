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

## Verbindliche Content-Zuordnung

Ordne Inhalte zuerst nach ihrer Rolle zu. Eine gewünschte Position allein ist kein Grund, einen anderen Slot zu verwenden oder eine neue Style-Variante anzulegen.

| Inhalt | Bereich |
|---|---|
| Haupttext und primärer Content | `main` |
| Zweite Spalte, Bild oder seitlicher Zusatzinhalt | `aside` |
| Volle Breite innerhalb des gerahmten Wrappers | `top` oder `bottom` |
| Volle Breite außerhalb des Wrappers | `header` oder `footer` |

- `main` und `aside` bilden im Desktop-Modus die beiden Spalten.
- `top` und `bottom` liegen im `wrapper` und gehen dort über die volle Breite.
- `header` und `footer` liegen außerhalb des `wrapper` und bleiben über die volle Containerbreite.
- Direkte Light-DOM-Kinder mit `.header`, `.top`, `.aside`, `.bottom` oder `.footer` werden automatisch zugeordnet.
- Direkte Bildabsätze können automatisch in `aside` verschoben werden.

Bereichsklassen müssen am direkten Light-DOM-Kind von `ntl-2col` stehen. Verwende `header` nicht, um eine normale Überschrift lediglich als linke oder rechte Spalte zu positionieren. Ordne eine solche Überschrift `aside` zu und ändere ihre visuelle Position mit `.reverse` oder `.reverse-desktop`.

Wenn ein Entwickler `header` oder `footer` sagt und die Ebene unklar ist, kläre, ob der äußere Bereich oder `top` beziehungsweise `bottom` im Wrapper gemeint ist.

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

`.reverse` stellt die Aside-Überschrift auf Desktop nach links und mobil vor den Hauptinhalt. Verwende `.reverse-desktop` nur, wenn der Aside-Inhalt mobil bewusst nach dem Hauptinhalt stehen soll.

Weitere direkte Children mit `.aside` können dieselbe Seitenspalte ergänzen. Lege dafür keine positionsspezifische `style-*`-Variante an.

Nutze immer die `trunkjs/content-pane`-Notation `{: layout="..."}`. Die Default-Style-Klasse wird automatisch ergänzt, wenn keine `style-*` Klasse gesetzt ist.

## Relevante Konfiguration

- `--cols`: Breite von `main` im Desktop-Zwölfersystem, standardmäßig `6`; normalerweise pro Instanz über `section-style` setzen
- `--breakpoint`: Umschaltpunkt, standardmäßig `md`
- `--container-width`: Containerbreite
- `--gap`: Abstand zwischen den Spalten
- `.surface-*`: Section-Fläche mit passenden semantischen Textfarben
- `.bg-*`: reiner Section-Background
- `.reverse`: tauscht `main` und `aside`
- `.reverse-desktop`: tauscht sie nur im Desktop-Modus
- `.breakout-start` / `.breakout-end`: aktiviert Desktop-Breakouts
