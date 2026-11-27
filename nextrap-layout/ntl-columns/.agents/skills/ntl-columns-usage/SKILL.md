---
name: ntl-columns-usage
description: "@nextrap/ntl-columns für Content-Pane-Markup, Slots, responsive Klassen und Spaltengewichte verwenden."
---

# NTL Columns Usage

Verwende dieses Layout für Seiten mit Hauptinhalt und bis zu zwei optionalen
Seitenspalten. Für Themes siehe [ntl-columns-theming](../ntl-columns-theming/SKILL.md).

Importiere `@nextrap/ntl-columns`. Die Website stellt bei responsiven
Klassen `@trunkjs/responsive` und einen umgebenden `tj-responsive` bereit.

```markdown
# Seitenlayout
{: layout="ntl-columns" section-class="lg:desktop xxl:preserve-empty" section-style="--center-cols: 6;"}

## Hauptinhalt

Der normale Seiteninhalt.

## Hinweisbox
{: section-class="aside"}

Zusätzliche Informationen.
```

- Default-Slot: Center; `section-slot="start"` und `section-slot="end"`
  weisen Bereiche explizit zu. Wenn End anfangs unbelegt ist, werden direkte
  Kinder mit `.aside` per `data-query` automatisch End zugewiesen.
- Ohne explizite Klasse schaltet `--breakpoint` (Default `lg`) automatisch
  zwischen gestapeltem Mobile- und horizontalem Desktop-Layout um.
  Zwei Werte wie `md, xl` ergeben zusätzlich `mode="tablet"` (gestapelt).
- `desktop` erzwingt horizontale Spalten, `mobile` erzwingt gestapelte
  Spalten; `mobile` hat Vorrang, falls beide Klassen gesetzt sind.
- `reverse`: kehrt die sichtbare Reihenfolge auf beiden Achsen um.
- `preserve-empty`: behält auch leere Regionen bei.
- Eine Region mit ausschließlich `d-none`-Elementen wird ausgeblendet,
  sofern kein `preserve-empty` gesetzt ist. Verwende elementbasierte Inhalte.
- `--start-cols`, `--center-cols` und `--end-cols` am Layout setzen die
  Spaltengewichte (Defaults 4:6:4). `--grid-cols` am Part überschreibt sie.

Die Gewichte werden proportional auf sichtbare Regionen normiert.
Responsive Klassen werden vom umgebenden TJ Responsive aufgelöst.
