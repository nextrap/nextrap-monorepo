---
name: nte-code-editor-usage
description: Verwende diesen Skill für Markup, Auswahl und API-Integration von nte-code-editor, insbesondere value, Formulare, Sprachen, HTML-Completion, Folding sowie Unified- und Side-by-side-Diffs mit Chunk-Übernahme. Verwende für Theme-Änderungen den separaten nte-code-editor-theming Skill.
---

# NTE Code Editor verwenden

Importiere `@nextrap/nte-code-editor`. Das Package registriert `nte-code-editor`
und exportiert `NteCodeEditor`, `CodeEditorLanguage`, `CodeEditorHtmlElement`,
`CodeEditorDiffMode`, `CodeEditorDiffOrientation` und `CodeEditorRevertControls`.
Verwende es für bearbeitbaren Quelltext, Unified-Diffs und zweispaltige
Vergleiche mit Chunk-Übernahme. HTML im Editor ist Quelltext und wird nicht
als Vorschau ausgeführt.

## Einstieg über HTML

Der Code-Editor ist ein App-Control, kein Website-Layout. Verwende direktes
HTML-Markup ohne `tj-content-pane` oder Kramdown-Layout-Notation. Auch alle
Demos und Usage-Beispiele verwenden diese Form der Einbindung.

```html
<nte-code-editor id="source" language="html" name="source"></nte-code-editor>
```

Setze den Code anschließend über die Property der erzeugten Instanz:

```ts
const editor = document.querySelector('nte-code-editor')!;
editor.label = 'HTML-Quelltext';
editor.defaultValue = '<div>Ausgangswert</div>';
editor.value = '<div>Aktueller Code</div>';
console.log(editor.value);
```

Übergib keinen Inhalt an Slots. Der Default-Slot trägt `NO-DEFAULT-SLOT` und
macht falsch zugeordneten Inhalt sichtbar; Code gehört ausschließlich in
`value` bzw. in das `value`-Attribut als Default.

## Property- und Ereignisvertrag

| API | Verhalten |
|---|---|
| `value: string` | Aktueller Wert, synchron setzen/lesen; Zuweisungen ohne Events |
| `defaultValue` / `value`-Attribut | Ausgangswert und Ziel für `form.reset()` |
| `name`, `form`-Attribut | Native Zuordnung zum Formular und zu `FormData` |
| `disabled` | Eingabe und Chunk-Kopien gesperrt, kein erfolgreicher Formularwert |
| `readOnly` / `readonly` | Eingabe und Chunk-Kopien gesperrt; Auswahl und Formularübertragung bleiben möglich |
| `label` | Zugänglicher Name des inneren Textfelds |
| `language` | `html`, `markdown`, `css`, `javascript`, `typescript`, `scss`, `text` |
| `folding` | Default `true`; Property `false` oder Attribut `folding="false"` |
| `htmlElements` | Zusätzliche Tag-Namen oder Objekte mit `name`/`attributes` |
| `classNames` | Verfügbare Klassen als String-Array |
| `originalValue` | Original; `undefined` beendet jeden Diff, `''` ist eine gültige Vergleichsbasis |
| `diffMode` / `diff-mode` | `unified` (Default) oder `side-by-side`; ohne Original bleibt ein einzelner Editor |
| `diffOrientation` / `diff-orientation` | `original-first` (Default) oder `modified-first`; ändert nur die Seitenanordnung |
| `revertControls` / `revert-controls` | Nur Split: `original-to-modified` (Default), `modified-to-original` oder `none` |
| `extensions` | Zusätzliche CodeMirror-Extensions ausschließlich für die Arbeitsfassung |
| `editorView` | Nach `await editor.updateComplete` immer die View der Arbeitsfassung |
| `mergeView` | Nur im aktiven Split; `a` ist das Original, `b` die Arbeitsfassung |
| `input` | Bubbling/Composed-Event nach Texteingabe oder Chunk-Kopie in `value` |
| `change` | Bubbling/Composed-Event beim Blur eines geänderten Editors; nach Chunk-Kopie in `value` unmittelbar |
| `original-change` | Nach Chunk-Kopie ins Original: `CustomEvent<{ value: string }>` mit `detail.value`; Formularwert unverändert |

## Zweispaltiger Vergleich

Die Instanz aus dem Einstieg kann denselben Quelltext neben seiner
Vergleichsbasis anzeigen:

```ts
editor.diffMode = 'side-by-side';
editor.originalValue = '<div>Original</div>';
editor.value = '<div>Arbeitsfassung</div>';
editor.diffOrientation = 'modified-first';
```

Hier steht die Arbeitsfassung links. `originalValue` bleibt immer
CodeMirror-Seite A und für Texteingaben schreibgeschützt; `value` bleibt
Seite B und der Formularwert. Die gemeinsame vertikale Scrollfläche hält
zusammengehörige Zeilen auf gleicher Höhe.

Standardmäßig kopieren die Buttons Originalblöcke in die Arbeitsfassung und
setzen damit einzelne Änderungen zurück.
`revertControls = 'modified-to-original'` kehrt die Richtung um und verändert
die Vergleichsbasis. `revertControls = 'none'` blendet die Buttons aus. `disabled`,
deaktivierte Fieldsets und `readOnly` sperren Kopien in beide Richtungen.
Zuweisungen an `value` und `originalValue` bleiben ereignislos.

Seitenwechsel und Controls-Konfiguration erhalten die Editor-Views. Beim
Wechsel zwischen Einzel- und Split-Ansicht bleiben Dokument, Auswahl und
Undo-Verlauf erhalten; zusätzliche StateFields eigener Extensions werden
neu initialisiert.

## Sprachen, Folding und Lifecycle

Verwende für neue Completion-Vorgaben neue Arrays. Die HTML-Vorgaben gelten
auch innerhalb von Markdown und in HTML-Fences. Klassen-Completion ersetzt
nur das aktuelle Token. `htmlElements` ergänzt Standard-HTML-Tags.

Sprache, Completion-Vorgaben und `folding` gelten im Split für beide Seiten.
Rufe `foldAll()`/`unfoldAll()` nach `updateComplete` auf; diese Methoden steuern
die Arbeitsfassung und respektieren `folding = false`.
CodeMirror-Standardfunktionen liefern Undo/Redo, Bracket Matching und
Completion; eine Language-Server-Anbindung ist nicht enthalten. Ein sichtbarer
KI-Vorschlag kann mit Tab angenommen werden; ohne Vorschlag bleibt die bisherige
Tab-Belegung erhalten.

Erwarte form-associated Custom Elements mit `ElementInternals`. Die Komponente
berücksichtigt deaktivierte Fieldsets und Browser-Wiederherstellung. Nach
Disconnect sind `editorView` und `mergeView` nicht verfügbar. Beim Reconnect
eines Einzel-Editors wird der gespeicherte EditorState wiederverwendet. Beim
Split-Reconnect werden Dokument, Auswahl und Undo-Verlauf beider Seiten
übernommen; zusätzliche StateFields eigener Extensions werden neu
initialisiert.

## Optionale KI-Callbacks

Setze `inlineCompletion` und/oder `inlineEdit` auf einen asynchronen Callback.
Beide erhalten `language`, `codeBefore`, `codeAfter` und `signal`; Completion
zusätzlich `cursor`, Edit zusätzlich `selection`, `from`, `to` und `prompt`.
Der Callback liefert `{ text: string }` oder `null`. Der Text ist nur die
Ergänzung bzw. der vollständige Ersatz der Auswahl; `''` löscht beim Edit.

Mit `inlineCompletionAutomatic = false` bleiben manuelle Anfragen möglich.
`inlineCompletionDelay` beträgt standardmäßig 400 ms. Manuelle Auslösung über
`Mod-Shift-Space`/`triggerInlineCompletion()`, Edit über
`Mod-k`/`triggerInlineEdit()`; die beiden Key-Properties sind konfigurierbar.
Tab übernimmt den Ghost-Text, Escape verwirft ihn. Edit zeigt einen Diff vor
Accept/Reject und verändert `value` erst bei Accept. Die Originalseite und
schreibgeschützte Editoren führen keine KI-Aktionen aus.
Siehe README Abschnitt 8 und `07-ai.demo.ts` für typisierte Beispiele.

Nutze die sieben nummerierten Demos für komplette, ausführbare Beispiele:
Demo 05 zeigt den Unified-Diff, Demo 06 die Split-Ansicht mit Seitenwechsel,
Kopierrichtungen, gemeinsamem Scrollen und Live-Ausgaben. Für Styles lies
[nte-code-editor-theming](../nte-code-editor-theming/SKILL.md).

