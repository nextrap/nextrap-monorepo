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
{: layout="ntl-columns" section-class="lg:desktop xxl:preserve-empty"}

## Hauptinhalt
{: section-style="--grid-cols: 6"}

Der normale Seiteninhalt.

## Hinweisbox
{: section-class="aside"}

Zusätzliche Informationen.
```

- Default-Slot: Center; `section-slot="start"` und `section-slot="end"`
  weisen Bereiche explizit zu. Direkte Kinder mit `.aside` ohne expliziten
  Slot landen automatisch in End.
- `desktop`: nebeneinander, sonst Start, Center, End untereinander.
- `reverse`: kehrt die sichtbare Reihenfolge auf beiden Achsen um.
- `preserve-empty`: behält auch leere Regionen bei.
- `d-none` auf einem zugewiesenen Kind zählt nicht als sichtbarer Inhalt.
- `--grid-cols` auf einem Kind setzt das Gewicht seiner Region; der erste
  sichtbare Inhalt mit positivem numerischem Wert gewinnt. Defaults 4:6:4.

Die Gewichte werden proportional auf sichtbare Regionen normiert.
Responsive Klassen werden vom umgebenden TJ Responsive aufgelöst.
