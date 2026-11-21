---
name: ntl-code-editor-usage
description: Verwende diesen Skill für Markup, Auswahl und API-Integration von ntl-code-editor, insbesondere value, Formulare, Sprachen, HTML-Completion, Folding und Diffs. Verwende für Theme-Änderungen den separaten ntl-code-editor-theming Skill.
---

# NTL Code Editor verwenden

Importiere `@nextrap/ntl-code-editor`. Das Package registriert `ntl-code-editor`
und exportiert `NtlCodeEditor`, `CodeEditorLanguage` und `CodeEditorHtmlElement`.
Verwende es für bearbeitbaren Quelltext und Unified-Diffs. HTML im Editor ist
Quelltext und wird nicht als Vorschau ausgeführt.

## Einstieg über Content Pane

Importiere zusätzlich `@trunkjs/content-pane`, wenn Markdown/Kramdown den
Editor in ein Layout einsetzt. Verwende einen leeren Layout-Container:

```markdown
---
{: layout="ntl-code-editor#source[language=html][name=source]"}

---
{: layout="/;"}
```

Setze den Code anschließend über die Property der erzeugten Instanz:

```ts
const editor = document.querySelector('ntl-code-editor')!;
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
| `disabled` | Eingabe gesperrt, kein erfolgreicher Formularwert |
| `readOnly` / `readonly` | Auswahl und Formularübertragung bleiben möglich |
| `label` | Zugänglicher Name des inneren Textfelds |
| `language` | `html`, `markdown`, `css`, `javascript`, `typescript`, `scss`, `text` |
| `folding` | Default `true`; Property `false` oder Attribut `folding="false"` |
| `htmlElements` | Zusätzliche Tag-Namen oder Objekte mit `name`/`attributes` |
| `classNames` | Verfügbare Klassen als String-Array |
| `originalValue` | Vergleichsbasis; `undefined` beendet den Unified-Diff |
| `extensions` | Zusätzliche CodeMirror-Extensions |
| `editorView` | Aktive CodeMirror-View nach `await editor.updateComplete` |
| `input` | Bubbling/Composed-Event nach einer tatsächlichen Textänderung |
| `change` | Bubbling/Composed-Event beim Blur eines geänderten Editors |

Verwende für neue Completion-Vorgaben neue Arrays. Die HTML-Vorgaben gelten
auch innerhalb von Markdown und in HTML-Fences. Klassen-Completion ersetzt
nur das aktuelle Token. `htmlElements` ergänzt Standard-HTML-Tags.

Rufe `foldAll()`/`unfoldAll()` nach `updateComplete` auf. Beide Methoden
respektieren `folding = false`. CodeMirror-Standardfunktionen liefern Undo/Redo,
Bracket Matching und Completion; eine Language-Server-Anbindung ist nicht
enthalten. Tab bleibt ein Fokuswechsel.

Erwarte form-associated Custom Elements mit `ElementInternals`. Die Komponente
berücksichtigt deaktivierte Fieldsets und Browser-Wiederherstellung. Nach
Disconnect ist `editorView` nicht verfügbar; der EditorState wird beim
Reconnect wiederverwendet.

Nutze die nummerierten Demos für komplette, ausführbare Beispiele. Für Styles
lies [ntl-code-editor-theming](../ntl-code-editor-theming/SKILL.md).
