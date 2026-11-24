// Eigenständige CodeMirror-Extension für promptgesteuerte Änderungen und Einfügungen.
import { unifiedMergeView } from '@codemirror/merge';
import { EditorState, Facet, Prec, StateEffect, StateField } from '@codemirror/state';
import type { Extension } from '@codemirror/state';
import { EditorView, keymap, repositionTooltips, showTooltip } from '@codemirror/view';
import type { Tooltip, TooltipView } from '@codemirror/view';
import type { CodeEditorInlineEditCallback, CodeEditorLanguage } from '../types';

// Die Extension kennt ausschließlich den Callback, nicht den KI-Dienst.
interface InlineEditOptions {
  edit: CodeEditorInlineEditCallback;
  language: () => CodeEditorLanguage;
  canEdit: () => boolean;
  key: string;
}

const options = Facet.define<InlineEditOptions, InlineEditOptions | undefined>({
  combine: values => values[0],
});
const setPrompt = StateEffect.define<Tooltip | null>();

// Dokumentwechsel oder Neukonfiguration verwerfen die noch nicht übernommene Vorschau.
const promptState = StateField.define<Tooltip | null>({
  create: () => null,
  update(value, transaction) {
    if (transaction.docChanged || transaction.reconfigured) return null;
    for (const effect of transaction.effects) {
      if (effect.is(setPrompt)) value = effect.value;
    }
    return value;
  },
  provide: field => showTooltip.from(field),
});

// Automatische Vervollständigung bleibt während einer expliziten Aktion aus.
export function isInlineEditActive(view: EditorView): boolean {
  return Boolean(view.state.field(promptState, false));
}

// Markierungen behalten den Zeilenvertrag; leere Selections bleiben exakte Cursorpositionen.
export function openInlineEdit(view: EditorView): boolean {
  const config = view.state.facet(options);
  if (!config || !config.canEdit() || view.state.readOnly || isInlineEditActive(view)) return false;
  const { state } = view;
  const selection = state.selection.main;
  const from = selection.empty ? selection.from : state.doc.lineAt(selection.from).from;
  const to = selection.empty ? selection.to : state.doc.lineAt(selection.to).to;

  view.dispatch({
    selection: state.selection,
    effects: setPrompt.of({
      pos: from,
      above: true,
      arrow: true,
      create: editor => createPrompt(editor, config, from, to),
    }),
  });
  return true;
}

// Der Tooltip besitzt den Request und die getrennte, schreibgeschützte Merge-Vorschau.
function createPrompt(view: EditorView, config: InlineEditOptions, from: number, to: number): TooltipView {
  const source = view.state.doc;
  const selection = source.sliceString(from, to);
  const controller = new AbortController();
  let preview: EditorView | undefined;
  let pending = false;
  const dom = view.dom.ownerDocument.createElement('div');
  dom.className = 'cm-ai-edit-prompt';
  dom.setAttribute('role', 'dialog');
  dom.setAttribute('aria-label', selection ? 'Edit with AI' : 'Insert with AI');
  const input = dom.appendChild(view.dom.ownerDocument.createElement('input'));
  input.type = 'text';
  input.placeholder = selection ? 'Edit with AI…' : 'Insert with AI…';
  input.setAttribute('aria-label', input.placeholder);
  input.setAttribute('part', 'ai-prompt-input');

  // Native Buttons werden nicht zu Submit-Controls des umgebenden Formulars.
  const button = (label: string, action: () => void): HTMLButtonElement => {
    const element = view.dom.ownerDocument.createElement('button');
    element.type = 'button';
    element.textContent = label;
    element.addEventListener('click', action);
    return element;
  };

  // Erst Accept schreibt eine normale, rückgängig machbare Editor-Transaktion.
  const close = (replacement?: string): void => {
    if (controller.signal.aborted || !isInlineEditActive(view)) return;
    if (replacement !== undefined && config.canEdit() && !view.state.readOnly && view.state.doc === source) {
      view.dispatch({
        changes: { from, to, insert: replacement },
        effects: setPrompt.of(null),
        userEvent: 'input.complete',
      });
    } else {
      view.dispatch({ effects: setPrompt.of(null) });
    }
    view.focus();
  };

  // Request-Abbruch und Dokumentidentität schützen die Auswahl vor verspäteten Antworten.
  const submit = async (): Promise<void> => {
    const prompt = input.value.trim();
    if (!prompt || pending || preview || controller.signal.aborted || !config.canEdit()) return;
    pending = true;
    try {
      const response = await config.edit({
        language: config.language(), prompt, selection,
        codeBefore: source.sliceString(0, from), codeAfter: source.sliceString(to),
        from, to, signal: controller.signal,
      });
      if (controller.signal.aborted || view.state.doc !== source || !config.canEdit()) return;
      if (!response?.text || response.text === selection) return;

      // CodeMirror Merge rendert den Diff auf einer isolierten View, ohne das Original zu ändern.
      const previewHost = view.dom.ownerDocument.createElement('div');
      previewHost.className = 'cm-ai-edit-preview';
      previewHost.setAttribute('part', 'ai-edit-preview');
      dom.replaceChildren(previewHost, button('Accept', () => close(response.text)), button('Reject', () => close()));
      preview = new EditorView({
        parent: previewHost,
        state: EditorState.create({
          doc: response.text,
          extensions: [
            EditorState.readOnly.of(true),
            EditorView.editable.of(false),
            EditorView.lineWrapping,
            unifiedMergeView({ original: selection, mergeControls: false, gutter: false, allowInlineDiffs: true }),
          ],
        }),
      });
      dom.querySelector('button')?.focus();
      repositionTooltips(view);
    } catch (error) {
      if (!controller.signal.aborted) console.error(error);
    } finally {
      pending = false;
    }
  };

  // Enter sendet, Escape verwirft; die Eingabe bleibt bei einer leeren Antwort erhalten.
  dom.append(button('Generate', () => { void submit(); }), button('Cancel', () => close()));
  dom.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === 'Enter' && event.target === input && !event.isComposing) {
      event.preventDefault();
      event.stopPropagation();
      void submit();
    }
  });

  return {
    dom,
    mount: () => input.focus(),
    destroy: () => {
      controller.abort();
      preview?.destroy();
    },
  };
}

// Funktionales Layout der CodeMirror-internen Oberfläche, ohne globale Styles.
const promptTheme = EditorView.baseTheme({
  '.cm-ai-edit-prompt': { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px', padding: '4px' },
  '.cm-ai-edit-prompt input': { flex: '1 1 12rem', minWidth: '0' },
  '.cm-ai-edit-preview': { flex: '1 0 100%', minWidth: '0', maxHeight: '18rem', overflow: 'auto' },
});

// Installation und Shortcut sind unabhängig von der automatischen Completion.
export function inlineEditExtension(config: InlineEditOptions): Extension {
  return [
    options.of(config),
    promptState,
    promptTheme,
    Prec.highest(keymap.of([
      { key: config.key, run: openInlineEdit },
      {
        key: 'Escape',
        run: view => {
          if (!isInlineEditActive(view)) return false;
          view.dispatch({ effects: setPrompt.of(null) });
          return true;
        },
      },
    ])),
  ];
}
