---
name: ntl-spa-content-usage
description: "@nextrap/ntl-spa-content für SPA-Workspaces verwenden: Import, NtlSpaContent, direkte HTML-Einbindung und Slot-Zuordnung. Nicht für Theme-SCSS."
---

# SPA Content verwenden

Nutze dieses Layout für einen dokument-scrollenden Arbeitsbereich mit sticky
Content-Header und optionalen fensterhohen sticky Sidebars. Für visuelle Anpassungen lies den
[Theming-Skill](../ntl-spa-content-theming/SKILL.md).

## Import und Einstieg

```ts
// Die Imports registrieren Workspace und äußere Navbar; das Anwendungstheme liefert die Optik.
import '@nextrap/ntl-spa-content';
import '@nextrap/ntl-spa-header';
```

Verwende `<ntl-spa-content>` direkt im HTML. Benannte Inhalte sind direkte Kinder
mit `slot="…"`; Kinder ohne `slot` bilden den mittleren Inhalt im Dokumentfluss.
Ein Content-Pane-Wrapper oder Markdown ist für diese Verwendung nicht nötig.

```html
<!-- Der Header ordnet seine Slots an; nur die eingesetzten Inhalte setzen Abstände. -->
<ntl-spa-header role="banner">
  <a slot="brand" class="ms-4 me-3 fw-bold text-primary text-decoration-none"
     href="#workspace">NEXTRAP</a>
  <nav slot="main-nav" class="d-flex align-items-center gap-3"
       aria-label="Hauptnavigation">
    <a href="#workspace">Workspace</a>
  </nav>
  <!-- Direkt belegte Aktionsslots benötigen keinen Flex-Wrapper zur Zentrierung. -->
  <a slot="right-nav" class="btn btn-neutral ms-3" href="#editor-notes">Hilfe</a>
  <a slot="right-nav" class="btn btn-primary ms-2 me-4" href="#workspace">Zum Workspace</a>
  <p slot="sub-line" class="m-0 mx-4 small text-body-secondary">
    Die Navbar scrollt aus dem Bild; der Workspace nutzt danach die volle Höhe.
  </p>
</ntl-spa-header>

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
      <button class="btn btn-neutral" type="reset"
              form="workspace-form">Zurücksetzen</button>
      <a class="btn btn-primary" href="#editor-notes">Hilfe</a>
    </div>
  </header>

  <!-- Das Formular liegt im Default-Slot; der Reset-Button bleibt im Header. -->
  <form id="workspace-form">
    <label for="editor-document">Dokument</label>
    <textarea id="editor-document" name="document" rows="24"># Mein Workspace</textarea>
  </form>

  <!-- Die Hilfelinks führen zu den Hinweisen im selben scrollenden Inhalt. -->
  <section id="editor-notes" aria-label="Hinweise zum Workspace">
    <p>Der Dokumentbereich scrollt mit der Seite; überlange Sidebars scrollen intern.</p>
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
Neutrale Nebenaktionen verwenden `btn-neutral`. Die Header-Buttons nutzen die
Standardgröße und die normale Schriftstärke von `style-button`.

Der äußere SPA-Header ordnet Brand, Hauptnavigation und rechte Aktionen selbst
an und zentriert die eingesetzten Elemente vertikal. Er setzt kein Padding
und keine Zwischenräume; Abstände gehören den Inhalten, etwa durch `ms-4`,
`me-3`, `ms-2`, `me-4` oder `mx-4`. Seine Zeilenhöhen sind über
`--main-line-height` und `--sub-line-height` steuerbar; die Defaults sind
`4.5rem` und `2rem`. Das Anwendungstheme bindet auch für den Header dessen
`default-style()` ein; siehe die
[Header-Komponente](../../../../ntl-spa-header/README.md).

Im mittleren Editor-Header ordnen weiterhin Flex- und Abstands-Utilities die
Inhalte an. `demo-toolbar-start` ergänzt dort `min-inline-size: 0`, damit die
linke Gruppe schrumpfen kann. Ein zusätzlicher Responsive-Wrapper ist nicht
nötig. Die vollständige Demo zeigt die Style-Einbindung und die kleinen
verbleibenden Formular-Korrekturen.

## Slots

| Slot | Verhalten |
|---|---|
| Default | Hauptinhalt bestimmt die Dokumenthöhe, ohne eigenen Scrollport. |
| `header` | Sticky am oberen Viewport-Rand, ausschließlich in der Mitte. |
| `footer` | Folgt dem Hauptinhalt im Dokumentfluss. |
| `sidebar-left` | Inhalt der fensterhohen sticky linken Sidebar. |
| `sidebar-left-header` | Header innerhalb der gemeinsam scrollenden linken Sidebar. |
| `sidebar-right` | Rechte Sidebar, spiegelbildlich zur linken. |
| `sidebar-right-header` | Header innerhalb der gemeinsam scrollenden rechten Sidebar. |

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
enthält das Dokument mit SPA Header, Workspace und allen sieben Content-Slots.
Beide Demo-Entrys registrieren `ntl-spa-header` und `ntl-spa-content`; das
Demo-SCSS materialisiert beide öffentlichen Style-Mixins. Die `.demo.ts`
übernimmt denselben HTML-Inhalt in einen eigenen Viewport des Demo-Viewers.

Beim Seitenscrollen verschwindet die Navbar. Der Hauptinhalt bestimmt die
Dokumenthöhe; sein Header bleibt ab dem oberen Viewport-Rand sticky. Der Footer
folgt dem Inhalt und ist nicht am Fensterrand fixiert. Die Breite entspricht dem
umgebenden Container.

Beide Sidebars bleiben ebenfalls am oberen Viewport-Rand sticky und sind
`100dvh` hoch (`100vh` als Fallback). Überlanger Sidebar-Inhalt scrollt innerhalb
der gesamten Spalte einschließlich ihres Headers. View-Timelines oder
Scroll-Listener sind nicht erforderlich.

Prüfe die Bildschirmhöhe auf `/demo/index.html` oder in der Fullscreen-Ansicht
des Demo-Viewers. Die eingebettete Vorschau hat einen eigenen Viewport und kann
unter dem Viewer-Header selbst teilweise außerhalb des Browserbereichs liegen.

Nur überlange Sidebars und eingesetzte Komponenten wie Tabellen besitzen eigene
Scrollports. An deren Grenzen darf das Scrollen an das Dokument weitergehen.
Der mittlere Content-Slot öffnet keinen weiteren Scrollbereich.

Sticky bleibt durch den umgebenden Container begrenzt. Vermeide einen
unbeabsichtigten `overflow: auto/hidden` an Vorfahren, wenn der Dokument-Viewport
maßgeblich sein soll. Der Host wächst mit seinem Inhalt und begrenzt den
Sticky-Bereich seiner Spalten.

## Breiten

Setze `--sidebar-left-width` und `--sidebar-right-width` am Host oder im Theme.
Die Defaults sind `16rem` und `18rem`. Jede Sidebar ist auf 35% der Layoutbreite
begrenzt, damit die Mitte auch in schmalen Ansichten sichtbar bleibt. Es gibt
keinen automatischen Drawer, keine Media Queries und keine Resize-Logik.
