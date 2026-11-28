# NTE Code Editor

`@nextrap/nte-code-editor` stellt CodeMirror 6 als formularfähige Web Component
bereit. Code wird über `value` gesetzt und gelesen. HTML, Markdown, CSS,
JavaScript, TypeScript und SCSS stehen ohne weitere Sprachkonfiguration bereit.

## Fehleransicht

`errorMessage` (`error-message`) aktiviert bei nichtleerem Text eine horizontal
und vertikal zentrierte Fehleransicht anstelle der CodeMirror-Ansicht.
`errorDescription` (`error-description`) ergänzt die Beschreibung.
Die Parts `error`, `error-message` und `error-description` erlauben das Styling;
der Fehlercontainer trägt zusätzlich `editor` für die bestehende Höhensteuerung.
Code und Undo-Verlauf bleiben erhalten. Jede Zuweisung von `value` löscht beide
Fehlertexte, auch bei identischem oder leerem Inhalt. Alternativ beendet
`errorMessage = ''` die Fehleransicht ohne Inhaltsänderung.

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

In bearbeitbaren CSS- und SCSS-Ansichten erscheinen bei erkannten konkreten
Farbwerten kleine Farbquadrate. Ein Klick öffnet den nativen Color Picker;
die Auswahl ändert den Quelltext und nimmt an Undo/Redo teil. Der Picker
ist in schreibgeschützten oder deaktivierten Ansichten sowie auf der
Originalseite eines Vergleichs ausgeschaltet. SCSS-Variablen werden nicht
aufgelöst. Die erkannten Farbformate bestimmt die UIW-Extension.

In allen Sprachmodi ist eine rechteckige Spaltenauswahl möglich: Ziehe mit
gehaltener mittlerer Maustaste oder mit Alt + linker Maustaste über mehrere
Zeilen. Jede Zeile erhält eine eigene Auswahl beziehungsweise einen Cursor;
anschließende Texteingaben bearbeiten alle ausgewählten Bereiche gleichzeitig.

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

Die Variable `editor` bezeichnet die Nextrap-Web-Component. Verwende deren
`value`-Property, um den gesamten Text zu lesen oder zu ersetzen. Für
CodeMirror-spezifische Operationen ist `editorView` zuständig. Ihr
`state` ist ein unveränderlicher Snapshot von Dokument, Auswahl und
Extensions. `dispatch()` übergibt eine Transaktion an die View und
aktualisiert damit den State und die Darstellung:

```ts
await editor.updateComplete;
const view = editor.editorView;
if (view) {
  console.log(view.state.doc.toString()); // Gesamter Dokumenttext.
  view.dispatch({ selection: { anchor: 0 } }); // Cursor an den Anfang.
}
```

`editorView` liefert nach `updateComplete` immer die View der Arbeitsfassung.
`mergeView` liefert nur bei aktivem Split den Vergleich mit `a` (Original) und
`b` (Arbeitsfassung). Nach dem Entfernen des Elements sind beide Getter
`undefined`. Im Einzelmodus wird beim erneuten Einhängen der gespeicherte
EditorState wiederverwendet. Bei einer Split-Ansicht werden Dokument, Auswahl
und Undo-Verlauf beider Seiten übernommen; zusätzliche StateFields eigener
Extensions werden neu initialisiert. Zusätzliche Extensions sollen die vom
Wrapper verwalteten Sprach-, Folding-, Diff- und Formularzustände nicht
nochmals konfigurieren.

## 8. KI-Vervollständigung, Bearbeiten und Einfügen

Die automatische Vervollständigung verwendet `@marimo-team/codemirror-ai`.
Inline Edit und Insert nutzen eine separate Extension mit `@codemirror/merge`.
Beide Funktionen sind unabhängig und ohne Callback inaktiv.
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
  if (signal?.aborted || prompt !== 'uppercase') return null;
  return { text: selection ? selection.toUpperCase() : 'NEW TEXT' };
};
editor.inlineCompletion = completion;
editor.inlineEdit = edit;
editor.inlineCompletionAutomatic = true;
editor.inlineCompletionDelay = 400;
await editor.updateComplete;
```

Tippe `Hello`: Der Vorschlag ` world!` erscheint nach dem Debounce als Ghost-Text.
Tab fügt ihn ein, Escape verwirft ihn. Das Plugin bietet keinen öffentlichen
manuellen Completion-Trigger. Strg+Leertaste bleibt für die vorhandene
CodeMirror-Autocompletion reserviert.

Markiere `Hello`, drücke Strg+K (`Mod-k`) oder rufe `editor.triggerInlineEdit()`
auf. Gib `uppercase` ein und bestätige mit Enter. Das Plugin erweitert die
Auswahl auf vollständige Zeilen. Ohne Markierung öffnet sich dasselbe Feld
am Cursor; `selection` ist leer und `from === to`. Die separate Diff-Vorschau
ändert `value` erst bei Accept. Reject oder Escape verwirft den Vorschlag.

| API | Verhalten |
|---|---|
| `inlineCompletion` | Async-Callback oder `undefined` |
| `inlineEdit` | Async-Callback oder `undefined` |
| `inlineCompletionAutomatic` | Default `true`; `false` deaktiviert die Completion |
| `inlineCompletionDelay` | Debounce in Millisekunden, Default `400` |
| `inlineEditKey` | CodeMirror-Keyname; Default `Mod-k` |
| `triggerInlineEdit()` | `true` wenn geöffnet, sonst `false` |

Die exportierten Request-/Response-Typen ermöglichen eine typisierte Anbindung:

### `CodeEditorInlineCompletionRequest`

Beispiel: Das Dokument ist `Hello\nMark this text to edit.`, der Cursor steht
nach `Hello`.

| Property / Typ | Bedeutung | Beispielwert |
|---|---|---|
| `language: CodeEditorLanguage` | Aktive Sprache; mögliche Werte siehe Abschnitt 2 | `'text'`, `'html'`, `'typescript'` |
| `codeBefore: string` | Gesamter Dokumenttext vor dem Cursor | `'Hello'` |
| `codeAfter: string` | Gesamter Dokumenttext nach dem Cursor | `'\nMark this text to edit.'` |
| `cursor: number` | Nullbasierter Cursor-Offset | `5` |
| `signal: AbortSignal` | Abbruchsignal für den laufenden Request | `signal.aborted === false` |

`CodeEditorInlineCompletionResponse`: `{ text: ' world!' }` ist ausschließlich
die einzufügende Ergänzung. `null` zeigt keinen Vorschlag an.

### `CodeEditorInlineEditRequest`

Beispiel: Nach Übernahme der Completion enthält das Dokument
`Hello world!\nMark this text to edit.`. Bearbeitet wird die zweite Zeile.

| Property / Typ | Bedeutung | Beispielwert |
|---|---|---|
| `language: CodeEditorLanguage` | Aktive Sprache wie bei Completion | `'text'` |
| `codeBefore: string` | Dokumenttext vor dem Edit-Bereich | `'Hello world!\n'` |
| `selection: string` | Zeilenbereich oder `''` bei Einfügung | `'Mark this text to edit.'` |
| `codeAfter: string` | Dokumenttext nach dem Edit-Bereich | `''` |
| `from: number` | Inklusiver Startoffset | `13` |
| `to: number` | Exklusiver Endoffset | `36` |
| `prompt: string` | Freitextanweisung des Benutzers | `'uppercase'` |
| `signal?: AbortSignal` | Optionales Abbruchsignal | `undefined` oder `signal.aborted === false` |

`CodeEditorInlineEditResponse`: `{ text: 'MARK THIS TEXT TO EDIT.' }`
ersetzt den Bereich `[from, to)`, nicht den gesamten Dokumenttext.


`cursor`, `from` und `to` sind nullbasierte UTF-16-Offsets im aktuellen
Dokument (keine Zeilennummern). Beide
Responses enthalten ausschließlich `{ text: string }` oder der Callback
liefert `null` für keinen Vorschlag. Beim Edit wird bei `null` oder `text: ''`
das Dokument nicht geändert. Das `AbortSignal` (beim Edit optional) kann direkt an `fetch`
übergeben werden. Request-Abbruch und Vorschau verwaltet das Plugin.
Bei `disabled`, `readOnly` oder deaktiviertem Fieldset sind beide Funktionen
gesperrt; im Split gelten sie ausschließlich für die Arbeitsfassung.
Dokumentänderungen durch das Plugin nehmen wie gewöhnliche Eingaben an Undo
und den bestehenden `input`-/`change`-Events teil.

## Demos und Entwicklung

Die sieben `.demo.ts`-Dateien unter `demo/` zeigen diese Abläufe mit sichtbaren
Controls. Alle Demos verwenden direktes HTML-Markup ohne Content Pane oder
Layout-Notation. Quelltext gelangt über `value` in den Editor, nicht über einen
Slot.
`05-diff.demo.ts` zeigt den Unified-Diff. `06-side-by-side.demo.ts` zeigt den
zweispaltigen Vergleich mit Seitenwechsel, beiden Kopierrichtungen,
ausblendbaren Buttons, Reset und Live-Ausgaben beider Dokumente.
`07-ai.demo.ts` zeigt die beiden KI-Callbacks mit simulierten Antworten,
Request-/Response-Ausgaben und dem aktuellen Formularwert.

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
