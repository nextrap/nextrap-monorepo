---
name: ntl-spa-content-usage
description: "@nextrap/ntl-spa-content für SPA-Workspaces verwenden: Import, NtlSpaContent, direkte HTML-Einbindung und Slot-Zuordnung. Nicht für Theme-SCSS."
---

# SPA Content verwenden

Nutze dieses Layout für einen Viewport-hohen Arbeitsbereich mit Navigation,
Editorinhalt und optionalem Inspector. Für normale fließende Seiteninhalte
verwende ein Dokumentlayout. Für visuelle Anpassungen lies den
[Theming-Skill](../ntl-spa-content-theming/SKILL.md).

## Import und Einstieg

```ts
// Der Import registriert das Custom Element; das Anwendungstheme liefert die Optik.
import '@nextrap/ntl-spa-content';
```

Verwende `<ntl-spa-content>` direkt im HTML. Benannte Inhalte sind direkte Kinder
mit `slot="…"`; Kinder ohne `slot` bilden den mittleren, scrollenden Inhalt.
Ein Content-Pane-Wrapper oder Markdown ist für diese Verwendung nicht nötig.

```html
<!-- Die äußere Navbar scrollt mit der Seite nach oben aus dem Viewport. -->
<header class="demo-navbar demo-toolbar">
  <nav class="demo-toolbar-start" aria-label="Hauptnavigation">
    <strong>NEXTRAP</strong>
    <a href="#workspace">Workspace</a>
  </nav>
  <div class="demo-actions">
    <a class="demo-button" href="#editor-notes">Hilfe</a>
  </div>
</header>

<!-- Direkte Kinder belegen die Slots; die Sidebars behalten die volle Höhe. -->
<ntl-spa-content id="workspace">
  <h2 slot="sidebar-left-header">Dateien</h2>
  <nav slot="sidebar-left" aria-label="Projektdateien">
    <a href="#editor-document" aria-current="page">README.md</a>
  </nav>

  <!-- Das Anwendungstheme richtet den Titel links und die Aktionen rechts aus. -->
  <header slot="header" class="demo-toolbar">
    <div class="demo-toolbar-start">
      <div class="demo-title">
        <strong>README.md</strong>
        <span>Workspace / docs</span>
      </div>
    </div>
    <div class="demo-actions">
      <button type="reset" form="workspace-form">Zurücksetzen</button>
      <a class="demo-button" href="#editor-notes">Hilfe</a>
    </div>
  </header>

  <!-- Das Formular liegt im Default-Slot; der Reset-Button bleibt im Header. -->
  <form id="workspace-form">
    <label for="editor-document">Dokument</label>
    <textarea id="editor-document" name="document" rows="24"># Mein Workspace</textarea>
  </form>

  <!-- Die Hilfelinks führen zu den Hinweisen im selben scrollenden Inhalt. -->
  <section id="editor-notes" aria-label="Hinweise zum Workspace">
    <p>Die Sidebars und der Dokumentbereich scrollen unabhängig voneinander.</p>
  </section>
  <footer slot="footer">Markdown · UTF-8 · Lokale Vorschau</footer>

  <h2 slot="sidebar-right-header">Inspector</h2>
  <section slot="sidebar-right" aria-label="Dokumenteigenschaften">
    <p>README.md</p>
    <p>Projekt: Mein Workspace</p>
  </section>
</ntl-spa-content>
```

Die Klassen im Beispiel gehören zur Anwendung. Die vollständige Demo gestaltet
Navbar und Header als Flex-Zeilen mit einer linken Inhaltsgruppe und einer
rechten Aktionsgruppe. Die Komponente selbst ordnet nur ihre Slots an.

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
ein Element zugewiesen ist; ihr Header allein öffnet sie nicht.
Die Nextrap-Basis ignoriert Whitespace und Kommentare. Ein zugewiesener leerer
oder versteckter Wrapper zählt dagegen als Belegung; entferne ihn, wenn die
Sidebar verschwinden soll. Native Slotwechsel aktualisieren die Darstellung.

Die Komponente ergänzt automatisch `style-default`, solange keine andere
`style-*` Klasse gesetzt ist. Sie exportiert `NtlSpaContent` und benötigt keine
eigene Initialisierung, Properties, Attribute oder Events.

## Navbar und Scrollen

Platziere die Navbar als vorheriges Geschwister im normalen Dokumentfluss.
Die [vollständige HTML-Seite](https://github.com/nextrap/nextrap-monorepo/blob/main/nextrap-layout/ntl-spa-content/demo/index.html)
enthält das Dokument mit Navbar, Workspace und allen sieben Slots. Ihr
Module-Entry lädt die Komponente und das Demo-SCSS; die `.demo.ts` übernimmt
denselben HTML-Inhalt in einen eigenen Viewport des Demo-Viewers.

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
