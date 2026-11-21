# NTE Code Editor

`@nextrap/nte-code-editor` stellt CodeMirror 6 als formularfähige Web Component
bereit. Code wird über `value` gesetzt und gelesen. HTML, Markdown, CSS,
JavaScript, TypeScript und SCSS stehen ohne weitere Sprachkonfiguration bereit.

## 1. Code setzen, bearbeiten und als Formularwert lesen

Dieses eigenständige Beispiel verwendet die HTML-Standardkonfiguration. Die
Anwendung importiert das Package und bindet den visuellen Default separat ein.

```ts
import '@nextrap/nte-code-editor';

const form = document.createElement('form');
const editor = document.createElement('nte-code-editor');
editor.name = 'source';
editor.label = 'HTML-Quelltext';
editor.defaultValue = '<div class="container">Hallo Nextrap</div>';
form.append(editor);
document.body.append(form);

editor.value = '<div class="container">Geänderter Code</div>';
console.log(editor.value);
// <div class="container">Geänderter Code</div>

editor.addEventListener('input', () => console.log(editor.value));
editor.addEventListener('change', () => console.log('Bearbeitung abgeschlossen'));

const data = new FormData(form);
console.log(data.get('source')); // Enthält den aktuellen Code als String.
form.reset(); // Stellt editor.defaultValue wieder her.
```

`value` ist sofort lesbar, auch vor dem ersten Rendern und ohne DOM-Verbindung.
Eine Zuweisung erzeugt keine `input`-/`change`-Events. Benutzereingaben erzeugen
ein `input` am Host; `change` folgt beim Verlassen eines geänderten Editors.
`value`-Attribut und `defaultValue` bestimmen den Reset-Wert. Nach einer
Wertzuweisung oder Benutzereingabe verändern neue Defaults den laufenden Wert
erst wieder bei `form.reset()`. Zeilenumbrüche werden auf `\n` normalisiert.

`name`, das native `form`-Attribut, `disabled` und deaktivierte Fieldsets werden
über `ElementInternals` berücksichtigt. `readonly` erlaubt weiterhin Auswahl
und Übertragung des Formularwerts. Es wird ein Browser mit Unterstützung für
form-associated Custom Elements benötigt.

Für die Darstellung bindet die Anwendung das öffentliche Sass-Mixin ein:

```scss
@use '@nextrap/nte-code-editor' as editor;

nte-code-editor.style-default {
  @include editor.default-style();
}
```

Der Nextrap-Default-Style wird automatisch als Klasse gesetzt. Der JavaScript-
Import injiziert keine Light-DOM-Styles. CodeMirror verwaltet seine internen
Styles im Shadow Root; Syntaxfarben und öffentliche Parts bleiben anpassbar.

## 2. Sprache wählen

Die folgenden Ausschnitte verwenden `editor` aus dem ersten Beispiel.

```ts
editor.language = 'scss';
editor.value = '$accent: #0969da;\n.card { &:hover { color: $accent; } }';
```

| `language` | Enthaltene Unterstützung |
|---|---|
| `html` (Default) | HTML, Attribute sowie JavaScript/CSS in script/style |
| `markdown` | Markdown, eingebettetes HTML und Sprach-Fences |
| `css` | CSS |
| `javascript` | JavaScript mit lokaler Completion |
| `typescript` | TypeScript-Syntax mit lokaler Completion |
| `scss` | SCSS über den offiziellen Sass-Parser |
| `text` | Reiner Text ohne sprachspezifisches Highlighting |

Markdown-Fences erkennen `html`, `css`, `javascript`/`js`, `typescript`/`ts`,
`scss` und `markdown`/`md`. TypeScript-Completion umfasst die CodeMirror-
Sprachunterstützung; eine TypeScript-Language-Server-Anbindung ist nicht enthalten.

## 3. Eigene HTML-Elemente und Klassen anbieten

Die Konfiguration ergänzt Standard-HTML. Neue Arrays setzen aktualisierte
Vorgaben; bereits bestehende Klassen bleiben beim Einfügen eines weiteren
Klassennamens erhalten.

```ts
editor.htmlElements = [
  'app-icon',
  { name: 'app-card', attributes: { variant: ['standard', 'highlight'] } },
];
editor.classNames = ['container', 'card', 'card-title', 'btn', 'btn-primary'];
editor.value = '<app-card class="container ca"></app-card>';
```

Beim Tippen oder über `Ctrl+Space` erscheinen passende Vorschläge. Dasselbe
`htmlElements`-/`classNames`-Array gilt bei `language = 'markdown'` für
eingebettetes HTML, unvollständige HTML-Tags und HTML-Code-Fences. In Markdown-
Code-Spans oder JavaScript-Strings werden keine HTML-Vorschläge eingeblendet.

## 4. Folding umschalten

```ts
editor.folding = true; // Default; Attribut folding="false" schaltet es aus.
await editor.updateComplete;
editor.foldAll();
editor.unfoldAll();
editor.folding = false; // Entfernt auch vorhandene Faltungen und ihre Keybindings.
```

Sprach- und Optionswechsel erhalten die View, den Dokumenttext, die Auswahl
und die Undo-History. `foldAll()` und `unfoldAll()` liefern `false`, wenn Folding
deaktiviert ist oder noch keine View existiert. Ohne `indentWithTab` bleibt
Tab für den regulären Fokuswechsel verfügbar.

## 5. Diffs anzeigen

```ts
editor.language = 'html';
editor.originalValue = '<div>Vorher</div>';
editor.value = '<div>Nachher</div>';

editor.originalValue = '<div>Neuer Vergleichsstand</div>';
editor.originalValue = undefined; // Diff-Ansicht ausschalten.
```

Die Unified-Diff-Ansicht stellt den Originaltext als nicht bearbeitbare
Vergleichsbasis dar. Nur der aktuelle Code gehört zu `value` und `FormData`.
Ein leerer Originalstring aktiviert ebenfalls den Vergleich. Accept-/Reject-
Buttons sind für diese reine Vergleichsansicht ausgeschaltet.

## 6. CodeMirror gezielt erweitern

```ts
import { EditorView } from '@codemirror/view';

editor.extensions = [EditorView.lineWrapping];
await editor.updateComplete;
editor.editorView?.focus();
```

`extensions` ist der öffentliche CodeMirror-Erweiterungspunkt. `editorView`
liefert nach `updateComplete` die aktive View und nach dem Entfernen des
Elements `undefined`. Beim erneuten Einhängen werden Text und EditorState
wiederhergestellt. Zusätzliche Extensions sollen die vom Wrapper verwalteten
Sprach-, Folding-, Diff- und Formularzustände nicht nochmals konfigurieren.

## Demos und Entwicklung

Die fünf `.demo.ts`-Dateien unter `demo/` zeigen diese Abläufe mit sichtbaren
Controls. Der Einstieg verwendet Markdown/Kramdown und `tj-content-pane`;
Quelltext gelangt über `value` in den Editor, nicht über einen Slot.

```sh
npx nx dev nte-code-editor
npx nx build nte-code-editor
```

Alle direkt verwendeten Libraries sind Peers; die lokale Installation liegt
im Root-`package.json`. Das neue Package wird zunächst als npm-Workspace
verwendet. Versionierung und Veröffentlichung erfolgen durch den Maintainer.

Die package-spezifischen Verträge stehen in
[Usage](.agents/skills/nte-code-editor-usage/SKILL.md) und
[Theming](.agents/skills/nte-code-editor-theming/SKILL.md).
