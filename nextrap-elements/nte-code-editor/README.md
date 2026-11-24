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
Eine Zuweisung erzeugt keine `input`-/`change`-Events. Texteingaben erzeugen
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

Sprachwechsel und Folding-Konfiguration erhalten die View, den Dokumenttext,
die Auswahl und die Undo-History. Im zweispaltigen Vergleich gilt `folding`
für beide Seiten; `foldAll()` und `unfoldAll()` steuern die Arbeitsfassung.
Beide Methoden liefern `false`, wenn Folding deaktiviert ist oder noch keine
View existiert. Ohne `indentWithTab` bleibt Tab für den regulären Fokuswechsel
verfügbar.

## 5. Unified-Diff anzeigen

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

## 6. Versionen nebeneinander vergleichen und übernehmen

Dieses eigenständige Beispiel öffnet das Original links und die Arbeitsfassung
rechts. Binde für die Darstellung das Sass-Mixin wie in Abschnitt 1 ein.
Die Buttons zwischen den Seiten setzen den jeweiligen geänderten Block in
der Arbeitsfassung auf seinen Originalzustand zurück.

```ts
import '@nextrap/nte-code-editor';

const editor = document.createElement('nte-code-editor');
editor.label = 'HTML-Versionen vergleichen';
editor.diffMode = 'side-by-side';
editor.originalValue = '<article>\n  <h1>Willkommen</h1>\n</article>';
editor.value = '<article>\n  <h1>Willkommen bei Nextrap</h1>\n</article>';
editor.addEventListener('input', () => console.log(editor.value));
document.body.append(editor);
```

`originalValue` ist stets das Original (CodeMirror-Seite A), `value` stets die
Arbeitsfassung (Seite B). Nur `value` wird als Formularwert übertragen. Das
Original bleibt für direkte Texteingaben schreibgeschützt. Die gemeinsame
vertikale Scrollfläche hält zusammengehörige Zeilen beider Dokumente auf
gleicher Höhe; zusätzliche oder entfernte Zeilen werden entsprechend
ausgeglichen. Eine Höhenbegrenzung am öffentlichen Part `editor` begrenzt den
gesamten Vergleich, nicht jede Seite einzeln.

| API | Verhalten |
|---|---|
| `originalValue: string \| undefined` | Vergleichsbasis; `undefined` beendet jeden Diff, `''` ist ein gültiges leeres Original |
| `diffMode` / `diff-mode` | `unified` (Default) oder `side-by-side`; ohne `originalValue` bleibt ein einzelner Editor |
| `diffOrientation` / `diff-orientation` | `original-first` (Default): Original links; `modified-first`: Arbeitsfassung links |
| `revertControls` / `revert-controls` | Nur Split: `original-to-modified` (Default), `modified-to-original` oder `none` |
| `editorView` | Immer die View der Arbeitsfassung, unabhängig von der Seitenanordnung |
| `mergeView` | Nur im aktiven Split: `a` ist das Original, `b` die Arbeitsfassung |
| `input` / `change` | Eine Chunk-Kopie vom Original in `value` erzeugt `input` und unmittelbar danach `change` |
| `original-change` | Eine Chunk-Kopie in das Original erzeugt `CustomEvent<{ value: string }>` mit dem neuen Original in `detail.value` |

Die folgenden Einstellungen verändern den gerade erzeugten Vergleich. Die
Seitenanordnung bestimmt ausschließlich die Darstellung; die Kopierrichtung
bezieht sich weiterhin auf Original und Arbeitsfassung:

```ts
editor.diffOrientation = 'modified-first'; // Arbeitsfassung links, Original rechts.
editor.revertControls = 'modified-to-original'; // Buttons übernehmen neue Blöcke ins Original.

editor.addEventListener('original-change', (event) => {
  const { value } = (event as CustomEvent<{ value: string }>).detail;
  console.log(value); // Neue Vergleichsbasis; editor.value bleibt unverändert.
});
```

`revertControls = 'none'` blendet die Buttons aus. `disabled`, ein deaktiviertes
Fieldset und `readOnly` verhindern ebenfalls Chunk-Kopien in beide Richtungen.
Zuweisungen an `value` oder `originalValue` bleiben ereignislos. Eine Kopie
nach `originalValue` verändert weder `value` noch den Formularwert; verwende
dafür das eigene Ereignis `original-change`.

Seitenanordnung und Übernahme-Controls werden ohne neue Editor-Views
umgeschaltet. Ein Wechsel zwischen Einzel- und Split-Ansicht erhält Dokument,
Auswahl und Undo-Verlauf. Zusätzliche StateFields eigener Extensions werden
bei diesem Wechsel neu initialisiert.

## 7. CodeMirror gezielt erweitern

```ts
import { EditorView } from '@codemirror/view';

editor.extensions = [EditorView.lineWrapping];
await editor.updateComplete;
editor.editorView?.focus();
```

`extensions` ist der öffentliche CodeMirror-Erweiterungspunkt für die
Arbeitsfassung; im Split wird diese Konfiguration ausschließlich auf Seite B
angewendet. Sprache, HTML-Completion-Vorgaben und Folding konfiguriert der
Wrapper für beide Seiten.

`editorView` liefert nach `updateComplete` immer die View der Arbeitsfassung.
`mergeView` liefert nur bei aktivem Split den Vergleich mit `a` (Original) und
`b` (Arbeitsfassung). Nach dem Entfernen des Elements sind beide Getter
`undefined`. Im Einzelmodus wird beim erneuten Einhängen der gespeicherte
EditorState wiederverwendet. Bei einer Split-Ansicht werden Dokument, Auswahl
und Undo-Verlauf beider Seiten übernommen; zusätzliche StateFields eigener
Extensions werden neu initialisiert. Zusätzliche Extensions sollen die vom
Wrapper verwalteten Sprach-, Folding-, Diff- und Formularzustände nicht
nochmals konfigurieren.

## 8. KI-Vervollständigung und markierten Text bearbeiten

Die beiden Funktionen sind unabhängig und standardmäßig ohne Callback inaktiv.
Die Anwendung stellt den asynchronen KI-Dienst selbst bereit; der Editor enthält
keine API-Keys und sendet keine Requests an einen fest eingebauten Dienst.

```ts
import type {
  CodeEditorInlineCompletionCallback, CodeEditorInlineEditCallback,
} from '@nextrap/nte-code-editor';

// editor ist die Instanz aus Abschnitt 1. Dieses Beispiel arbeitet ohne Netzwerk.
const completion: CodeEditorInlineCompletionCallback = async request => {
  const { codeBefore, signal } = request;
  if (signal.aborted || !codeBefore.endsWith('Hello')) return null;
  return { text: ' world!' };
};
const edit: CodeEditorInlineEditCallback = async request => {
  const { selection, prompt, signal } = request;
  if (signal.aborted || prompt !== 'uppercase') return null;
  return { text: selection.toUpperCase() };
};
editor.inlineCompletion = completion;
editor.inlineEdit = edit;
editor.inlineCompletionAutomatic = true;
editor.inlineCompletionDelay = 400;
await editor.updateComplete;
```

Setze den Cursor nach `Hello`: Der Vorschlag ` world!` erscheint als Ghost-Text.
Mit Tab wird er eingefügt, mit Escape verworfen. Strg+Umschalt+Leertaste
(`Mod-Shift-Space`) oder `editor.triggerInlineCompletion()` starten sofort
eine Anfrage, auch bei `inlineCompletionAutomatic = false`. Strg+Leertaste
bleibt für die vorhandene CodeMirror-Autocompletion reserviert.

Markiere `Hello`, drücke Strg+K (`Mod-k`) oder rufe `editor.triggerInlineEdit()`
auf. Gib `uppercase` ein und bestätige mit Enter. Das Panel zeigt einen Diff
von `Hello` zu `HELLO`; erst Accept verändert `value`. Reject oder Escape
verwerfen den Vorschlag. Die umliegenden Zeichen bleiben unverändert.

| API | Verhalten |
|---|---|
| `inlineCompletion` | Async-Callback oder `undefined` |
| `inlineEdit` | Async-Callback oder `undefined` |
| `inlineCompletionAutomatic` | Default `true`; `false` erlaubt nur manuelle Anfragen |
| `inlineCompletionDelay` | Debounce in Millisekunden, Default `400` |
| `inlineCompletionKey` / `inlineEditKey` | CodeMirror-Keynamen; Default `Mod-Shift-Space` / `Mod-k` |
| `triggerInlineCompletion()` / `triggerInlineEdit()` | `true` wenn gestartet, sonst `false` |

Die exportierten Request-/Response-Typen ermöglichen eine typisierte Anbindung:

| Request | Felder |
|---|---|
| `CodeEditorInlineCompletionRequest` | `language`, `codeBefore`, `codeAfter`, `cursor`, `signal` |
| `CodeEditorInlineEditRequest` | `language`, `codeBefore`, `selection`, `codeAfter`, `from`, `to`, `prompt`, `signal` |

`cursor`, `from` und `to` sind UTF-16-Offsets im aktuellen Dokument. Beide
Responses enthalten ausschließlich `{ text: string }` oder der Callback
liefert `null` für keinen Vorschlag. Beim Edit ist `text: ''` eine Löschung.
Das `AbortSignal` kann direkt an `fetch` übergeben werden. Geänderte Auswahl,
Dokument, Konfiguration oder Disconnect verwerfen laufende Anfragen.
Bei `disabled`, `readOnly` oder deaktiviertem Fieldset sind beide Funktionen
gesperrt; im Split gelten sie ausschließlich für die Arbeitsfassung.
Die bestätigte Änderung nimmt wie eine gewöhnliche Eingabe an Undo und den
bestehenden `input`-/`change`-Events teil.

## Demos und Entwicklung

Die sieben `.demo.ts`-Dateien unter `demo/` zeigen diese Abläufe mit sichtbaren
Controls. Der Einstieg verwendet Markdown/Kramdown und `tj-content-pane`;
Quelltext gelangt über `value` in den Editor, nicht über einen Slot.
`05-diff.demo.ts` zeigt den Unified-Diff. `06-side-by-side.demo.ts` zeigt den
zweispaltigen Vergleich mit Seitenwechsel, beiden Kopierrichtungen,
ausblendbaren Buttons, Reset und Live-Ausgaben beider Dokumente.
`07-ai.demo.ts` zeigt die beiden KI-Callbacks mit simulierten Antworten,
Request-/Response-Ausgaben und dem bestätigten Formularwert.

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
