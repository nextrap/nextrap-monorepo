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
<!-- Die äußere Navbar scrollt mit der Seite; Utilities ordnen ihre Gruppen an. -->
<header class="d-flex flex-wrap align-items-center gap-3">
  <nav class="demo-toolbar-start d-flex flex-wrap align-items-center flex-fill gap-3"
       aria-label="Hauptnavigation">
    <strong>NEXTRAP</strong>
    <a href="#workspace">Workspace</a>
  </nav>
  <div class="d-flex flex-wrap align-items-center justify-content-end gap-2 ms-auto">
    <a class="btn btn-sm btn-outline-secondary" href="#editor-notes">Hilfe</a>
  </div>
</header>

<!-- Direkte Kinder belegen die Slots; die Sidebars füllen die sichtbare Höhe. -->
<ntl-spa-content id="workspace">
  <h2 slot="sidebar-left-header" class="h6 m-0">Dateien</h2>
  <nav slot="sidebar-left" aria-label="Projektdateien">
    <ul class="list-group list-group-flush">
      <li><a href="#editor-document" aria-current="page">README.md</a></li>
    </ul>
  </nav>

  <!-- Nextrap-Utilities richten den Titel links und die Button-Gruppe rechts aus. -->
  <header slot="header" class="d-flex flex-wrap align-items-center gap-3">
    <div class="demo-toolbar-start d-flex flex-wrap align-items-center flex-fill gap-3">
      <h1 class="h6 m-0">README.md</h1>
      <span class="small text-body-secondary">Workspace / docs</span>
      <span class="badge">Markdown</span>
    </div>
    <div class="d-flex flex-wrap align-items-center justify-content-end gap-2 ms-auto">
      <button class="btn btn-sm btn-outline-secondary" type="reset"
              form="workspace-form">Zurücksetzen</button>
      <a class="btn btn-sm btn-primary" href="#editor-notes">Hilfe</a>
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
  <footer slot="footer" class="d-flex flex-wrap justify-content-between gap-2 m-0 small">
    <span>Markdown · UTF-8</span>
    <span class="text-body-secondary">Lokale Vorschau</span>
  </footer>

  <h2 slot="sidebar-right-header" class="h6 m-0">Inspector</h2>
  <section slot="sidebar-right" aria-label="Dokumenteigenschaften">
    <p>README.md</p>
    <p>Projekt: Mein Workspace</p>
  </section>
</ntl-spa-content>
```

Das Anwendungstheme stellt Runtime-Tokens aus `@nextrap/style-base` bereit und
materialisiert die Utilities über `style-utils()` aus `@nextrap/style-utils`.
Die Default-Styles von `@nextrap/style-typography`, `@nextrap/style-elements` und
`@nextrap/style-button` liefern Typografie, List Groups, Badges und Buttons.

Die Flex- und Abstands-Utilities ordnen die linke Inhaltsgruppe und die rechte
Aktionsgruppe an. Nur `demo-toolbar-start` ergänzt in der Demo
`min-inline-size: 0`, damit die linke Gruppe schrumpfen kann. Die Komponente
selbst ordnet ihre Slots an; ein zusätzlicher Responsive-Wrapper ist nicht
nötig. Die vollständige Demo zeigt die Einbindung der Styles und die kleinen
verbleibenden Formular-Korrekturen.

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
Der Host bleibt `100dvh` hoch, mit `100vh` als Fallback. Dadurch bleibt der äußere
Scrollweg erhalten, während die sichtbare Höhe seiner drei Spalten variiert.

Die Spalten füllen zunächst nur den sichtbaren Platz unter der Navbar. Beim
Wegscrollen der Navbar wachsen sie bis zur vollen Viewport-Höhe. Der mittlere
Footer bleibt am unteren Viewport-Rand sichtbar; der Default-Inhalt erhält
jeweils den verbleibenden Platz zwischen Header und Footer. Die Sidebars passen
sich gemeinsam mit der mittleren Spalte an.

Dieses Verhalten benötigt CSS-Unterstützung für `view-timeline`,
`animation-timeline` und `animation-range`; siehe die
[Browser-Kompatibilität von CSS-Animation-Timelines](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline).
Ohne diese Unterstützung bleiben die Spalten vollständig Viewport-hoch.
Dann liegt der Footer zunächst unterhalb des sichtbaren Bereichs und wird erst
sichtbar, nachdem die Navbar weggescrollt ist.

Prüfe die Bildschirmhöhe auf `/demo/index.html` oder in der Fullscreen-Ansicht
des Demo-Viewers. Die eingebettete Vorschau hat einen eigenen Viewport und kann
unter dem Viewer-Header selbst teilweise außerhalb des Browserbereichs liegen.

Scrollen über einem inneren Scrollport bewegt zuerst dessen Inhalt. An dessen
Grenzen darf das Scrollen an die Seite weitergehen; dadurch kann beim
Hochscrollen auch die Navbar zurückkehren. Über den festen Leisten lässt sich
direkt die äußere Seite scrollen. Eine erzwungene Reihenfolge der Scrollports
ist nicht Teil der API.

Sticky bleibt durch den umgebenden Container begrenzt. Vermeide einen
unbeabsichtigten `overflow: auto/hidden` an Vorfahren, wenn der Dokument-Viewport
maßgeblich sein soll. Die Höhenanpassung verändert nur die Spalten, nicht die
äußere Größe des Hosts.

## Breiten

Setze `--sidebar-left-width` und `--sidebar-right-width` am Host oder im Theme.
Die Defaults sind `16rem` und `18rem`. Jede Sidebar ist auf 35% der Layoutbreite
begrenzt, damit die Mitte auch in schmalen Ansichten sichtbar bleibt. Es gibt
keinen automatischen Drawer, keine Media Queries und keine Resize-Logik.
