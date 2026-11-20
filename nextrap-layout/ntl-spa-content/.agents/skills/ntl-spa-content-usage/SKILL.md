---
name: ntl-spa-content-usage
description: "@nextrap/ntl-spa-content für SPA-Workspaces verwenden: Import, NtlSpaContent, Slot-Zuordnung und trunkjs/content-pane Markdown. Nicht für Theme-SCSS."
---

# SPA Content verwenden

Nutze dieses Layout für einen Viewport-hohen Arbeitsbereich mit Navigation,
Editorinhalt und optionalem Inspector. Für normale fließende Seiteninhalte
verwende ein Dokumentlayout. Für visuelle Anpassungen lies den
[Theming-Skill](../ntl-spa-content-theming/SKILL.md).

## Import und Einstieg

```ts
import '@trunkjs/content-pane';
import '@nextrap/ntl-spa-content';
```

Lass folgendes Markdown innerhalb von `tj-content-pane` verarbeiten. Die
Abschnitte werden direkte Kinder des Layouts; `section-slot` benennt deren Slot.

```markdown
---
{: layout="1;ntl-spa-content"}

## Dateien
{: section-slot="sidebar-left-header"}

## Projekt
{: section-slot="sidebar-left"}

- README.md
- src/app.ts

## README.md
{: section-slot="header"}

## Dokument

Hier steht der unabhängig scrollende Hauptinhalt.

## Gespeichert
{: section-slot="footer"}
```

## Slots

| Slot | Verhalten |
|---|---|
| Default | Füllt die verbleibende Mitte und scrollt standardmäßig zweiachsig. |
| `header` | Fester Bereich über dem Default-Inhalt, nur in der Mitte. |
| `footer` | Fester Bereich unter dem Default-Inhalt, nur in der Mitte. |
| `sidebar-left` | Linke Sidebar mit eigenem Scrollport über die verbleibende Spaltenhöhe. |
| `sidebar-left-header` | Fester Header innerhalb der linken Sidebar. |
| `sidebar-right` | Rechte Sidebar, spiegelbildlich zur linken. |
| `sidebar-right-header` | Fester Header innerhalb der rechten Sidebar. |

Lass unbenutzte Slots weg. Eine Sidebar erscheint nur, wenn ihrem Inhaltsslot
ein Element oder Text zugewiesen ist; ihr Header allein öffnet sie nicht.
Die Nextrap-Basis ignoriert Whitespace und Kommentare. Ein zugewiesener leerer
oder versteckter Wrapper zählt dagegen als Belegung; entferne ihn, wenn die
Sidebar verschwinden soll. Native Slotwechsel aktualisieren die Darstellung.

Die Komponente ergänzt automatisch `style-default`, solange keine andere
`style-*` Klasse gesetzt ist. Sie exportiert `NtlSpaContent` und benötigt keine
eigene Initialisierung, Properties, Attribute oder Events.

## Navbar und Scrollen

Platziere die Navbar als vorheriges Geschwister im normalen Dokumentfluss.
Die [vollständige Demo](../../../demo/ntl-spa-content.demo.ts) zeigt die
Markdown-Struktur mit `layout="1;nav.demo-navbar"` vor dem SPA-Layout.

Beim äußeren Seitenscrollen verschwindet die Navbar und das Layout erreicht
den oberen Viewport-Rand. Die Breite entspricht dem umgebenden Container;
verwende für volle Bildschirmbreite einen unbeschränkten Seitencontainer.
Die Höhe beträgt `100dvh`, mit `100vh` als Fallback.

Scrollen über einem inneren Scrollport bewegt zuerst dessen Inhalt. An dessen
Grenzen darf das Scrollen an die Seite weitergehen; dadurch kann beim
Hochscrollen auch die Navbar zurückkehren. Über den festen Leisten lässt sich
direkt die äußere Seite scrollen. Eine erzwungene Reihenfolge der Scrollports
ist nicht Teil der API.

Sticky bleibt durch den umgebenden Container begrenzt. Vermeide einen
unbeabsichtigten `overflow: auto/hidden` an Vorfahren, wenn der Dokument-Viewport
maßgeblich sein soll. Vor dem Wegscrollen der Navbar liegt das untere Ende des
bereits Viewport-hohen Layouts entsprechend unterhalb des sichtbaren Bereichs.

## Breiten

Setze `--sidebar-left-width` und `--sidebar-right-width` am Host oder im Theme.
Die Defaults sind `16rem` und `18rem`. Jede Sidebar ist auf 35% der Layoutbreite
begrenzt, damit die Mitte auch in schmalen Ansichten sichtbar bleibt. Es gibt
keinen automatischen Drawer, keine Media Queries und keine Resize-Logik.
