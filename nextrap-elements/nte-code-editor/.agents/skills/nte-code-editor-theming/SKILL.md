---
name: nte-code-editor-theming
description: Verwende diesen Skill ausschließlich beim Erstellen oder Ändern eines Themes für nte-code-editor. Er beschreibt Sass-Mixins, öffentliche Parts und Syntaxfarben; verwende für Markup und API den nte-code-editor-usage Skill.
---

# NTE Code Editor gestalten

Materialisiere `default-style()` unter genau einer `style-*`-Klasse. Der
Sass-Entrypoint erzeugt beim Import keine CSS-Ausgabe; der Runtime-Entrypoint
importiert keine Light-DOM-Styles.

```scss
@use '@nextrap/nte-code-editor' as editor;

nte-code-editor.style-default {
  @include editor.default-style();
}

/* Eine konkrete Instanz darf ihren Scrollport über den öffentlichen Part anpassen. */
nte-code-editor.large-source::part(editor) {
  max-height: 40rem;
}
```

## Öffentliche Oberfläche

| Part | Verantwortung |
|---|---|
| `container` | Mount-Punkt der CodeMirror-View |
| `editor` | Rahmen, Fläche, Fokusdarstellung und Höhenbegrenzung |
| `scroller` | Scrollport und Monospace-Typografie |
| `content` | Eingabebereich und vertikale Textabstände |
| `gutters` | Zeilennummern und Folding-Bereich |

Passe Höhen am Part `editor` an, damit der innere Scrollport wirksam bleibt.
Vermeide eine kleinere maximale Höhe nur am Host; dadurch könnte die View den
reservierten Layoutbereich überschreiten. Schmale Container werden durch
`min-width: 0` und internes Scrollen unterstützt; die Komponente besitzt keine
eigenen Breakpoints oder Media Queries.

Das äußere Mixin definiert folgende Syntaxfarben; überschreibe sie bei Bedarf
am Host derselben Style-Klasse:

- `--nte-code-editor-keyword`
- `--nte-code-editor-string`
- `--nte-code-editor-number`
- `--nte-code-editor-comment`
- `--nte-code-editor-tag`
- `--nte-code-editor-attribute`

Das Mixin konsumiert `--nt-text`, `--nt-bg`, `--nt-border-color`,
`--nt-border-radius`, `--nt-primary`, `--nt-text-muted` und `--nt-bg-secondary`
mit seinen dokumentierten Default-Werten. Syntaxfarben werden im Shadow Root
nur gelesen, nicht erneut definiert.

CodeMirror verwaltet die funktionalen internen Styles sowie Completion- und
Diff-Dekorationen. Verwende für eine zusätzliche CodeMirror-Theme-Extension
die öffentliche `extensions`-Property. Überschreibe nicht per DOM-Manipulation
die Editorstruktur, Selection-Layer oder Contenteditable-Verwaltung.

Es gibt keine visuellen Modifier und keine Inhalte für den Default-Slot.
Für Markup, Formulare und Optionen lies
[nte-code-editor-usage](../nte-code-editor-usage/SKILL.md).
