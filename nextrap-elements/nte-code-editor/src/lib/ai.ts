// CodeMirror verwaltet Vorschau und Panel; nur eine bestätigte Änderung wird zum Dokument.
import { presentableDiff } from '@codemirror/merge';
import { Facet, Prec, StateEffect, StateField } from '@codemirror/state';
import type { Extension } from '@codemirror/state';
import {
  Decoration, EditorView, keymap, logException, showPanel, ViewPlugin, WidgetType,
} from '@codemirror/view';
import type { Panel, ViewUpdate } from '@codemirror/view';
import type {
  CodeEditorInlineCompletionCallback, CodeEditorInlineEditCallback, CodeEditorLanguage,
} from './types';

// Die Optionen bleiben unabhängig vom konkreten KI-Dienst und von der Editor-Ansicht.
interface AiOptions {
  completion?: CodeEditorInlineCompletionCallback;
  edit?: CodeEditorInlineEditCallback;
  automatic: boolean;
  delay: number;
  completionKey: string;
  editKey: string;
  language: () => CodeEditorLanguage;
  canEdit: () => boolean;
}

type Edit = { kind: 'edit'; from: number; to: number; original: string; replacement?: string };
type Suggestion = { kind: 'completion'; from: number; text: string } | Edit;

const options = Facet.define<AiOptions, AiOptions | undefined>({ combine: values => values[0] });
const show = StateEffect.define<Suggestion | null>();

// Der Ghost-Text ist eine Dekoration und damit weder Formularwert noch Undo-Eintrag.
class GhostText extends WidgetType {
  constructor(readonly text: string) { super(); }
  eq(other: GhostText): boolean { return this.text === other.text; }
  get lineBreaks(): number { return this.text.split('\n').length - 1; }
  toDOM(view: EditorView): HTMLElement {
    const span = view.dom.ownerDocument.createElement('span');
    span.setAttribute('part', 'ai-suggestion');
    span.setAttribute('aria-hidden', 'true');
    span.style.opacity = '0.45';
    span.style.whiteSpace = 'pre-wrap';
    span.textContent = this.text;
    return span;
  }
}

// Änderungen an Dokument, Auswahl oder Konfiguration machen alte Vorschläge ungültig.
const suggestion = StateField.define<Suggestion | null>({
  create: () => null,
  update(value, tr) {
    if (tr.docChanged || !tr.startState.selection.eq(tr.state.selection) ||
        tr.startState.facet(options) !== tr.state.facet(options)) return null;
    for (const effect of tr.effects) if (effect.is(show)) return effect.value;
    return value;
  },
  provide: field => [
    EditorView.decorations.from(field, value => value?.kind === 'completion'
      ? Decoration.set([Decoration.widget({ widget: new GhostText(value.text), side: 1 }).range(value.from)])
      : Decoration.none),
    showPanel.from(field, value => value?.kind === 'edit' ? createEditPanel : null),
  ],
});

// Pro View koordiniert ein Plugin Debounce, Abbruch und den Dokument-Snapshot.
class AiRequests {
  private timer?: ReturnType<typeof setTimeout>;
  private controller?: AbortController;

  constructor(private readonly view: EditorView) {}

  // Auch vor dem nächsten Lit-Update respektieren Befehle den aktuellen Sperrzustand.
  private get config(): AiOptions | undefined {
    const config = this.view.state.facet(options);
    return config?.canEdit() && !this.view.state.readOnly ? config : undefined;
  }

  // Beim Wechsel von Dokument, Auswahl oder Provider wird die alte Anfrage abgebrochen.
  update(update: ViewUpdate): void {
    const changed = update.docChanged || !update.startState.selection.eq(update.state.selection) ||
      update.startState.facet(options) !== update.state.facet(options);
    if (changed) this.cancel();
    if (update.focusChanged && !this.view.hasFocus &&
        update.state.field(suggestion)?.kind !== 'edit') {
      this.cancel();
    }
    if (update.docChanged && this.view.hasFocus && this.config?.automatic &&
        update.transactions.some(tr => tr.isUserEvent('input.type') || tr.isUserEvent('delete'))) {
      this.complete(false);
    }
  }

  // Abbruch ist auch dann möglich, wenn ein Backend das Signal ignoriert.
  cancel(): boolean {
    const pending = this.timer !== undefined || this.controller !== undefined;
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
    this.controller?.abort();
    this.controller = undefined;
    return pending;
  }

  // Manuelle Anfragen laufen sofort; automatische erst nach dem Debounce.
  complete(manual: boolean): boolean {
    const config = this.config;
    const { state } = this.view;
    if (!config?.completion || !state.selection.main.empty ||
        state.selection.ranges.length !== 1 || state.field(suggestion)?.kind === 'edit') return false;
    this.cancel();
    const run = () => {
      this.timer = undefined;
      void this.requestCompletion(config.completion!);
    };
    if (manual) {
      this.view.dispatch({ effects: show.of(null) });
      run();
    } else {
      this.timer = setTimeout(run, Math.max(0, config.delay));
    }
    return true;
  }

  // Kontext und Cursor werden gemeinsam erfasst; verspätete Ergebnisse bleiben unsichtbar.
  private async requestCompletion(callback: CodeEditorInlineCompletionCallback): Promise<void> {
    const config = this.config;
    if (config?.completion !== callback) return;
    const { state } = this.view;
    const cursor = state.selection.main.head;
    const controller = new AbortController();
    this.controller = controller;
    try {
      const result = await callback({
        language: config.language(),
        codeBefore: state.sliceDoc(0, cursor),
        codeAfter: state.sliceDoc(cursor),
        cursor,
        signal: controller.signal,
      });
      if (this.isCurrent(controller, state) && result?.text) {
        this.view.dispatch({ effects: show.of({
          kind: 'completion', from: cursor, text: result.text.replace(/\r\n?/g, '\n'),
        }) });
      }
    } catch (error) {
      if (!controller.signal.aborted) logException(this.view.state, error, 'Inline completion');
    } finally {
      if (this.controller === controller) this.controller = undefined;
    }
  }

  // Die Auswahl wird exakt übernommen, ohne die umliegenden Zeilen zu erweitern.
  openEdit(): boolean {
    const { state } = this.view;
    const { from, to } = state.selection.main;
    if (!this.config?.edit || from === to || state.selection.ranges.length !== 1) return false;
    this.cancel();
    this.view.dispatch({ effects: show.of({
      kind: 'edit', from, to, original: state.sliceDoc(from, to),
    }) });
    return true;
  }

  // Die Antwort wird zunächst nur im Panel dargestellt; auch Löschen ist ein gültiger Vorschlag.
  async requestEdit(prompt: string): Promise<void> {
    const config = this.config;
    const { state } = this.view;
    const edit = state.field(suggestion);
    if (!config?.edit || edit?.kind !== 'edit' || edit.replacement !== undefined || !prompt.trim()) return;
    this.cancel();
    const controller = new AbortController();
    this.controller = controller;
    try {
      const result = await config.edit({
        language: config.language(),
        codeBefore: state.sliceDoc(0, edit.from),
        selection: edit.original,
        codeAfter: state.sliceDoc(edit.to),
        from: edit.from,
        to: edit.to,
        prompt: prompt.trim(),
        signal: controller.signal,
      });
      if (this.isCurrent(controller, state) && this.view.state.field(suggestion) === edit && result) {
        this.view.dispatch({ effects: show.of({
          ...edit, replacement: result.text.replace(/\r\n?/g, '\n'),
        }) });
      }
    } catch (error) {
      if (!controller.signal.aborted) logException(this.view.state, error, 'Inline edit');
    } finally {
      if (this.controller === controller) this.controller = undefined;
    }
  }

  // Identität von Dokument und Auswahl verhindert das Anwenden veralteter Antworten.
  private isCurrent(controller: AbortController, state: EditorView['state']): boolean {
    return this.controller === controller && !controller.signal.aborted && Boolean(this.config) &&
      this.view.state.doc === state.doc && this.view.state.selection.eq(state.selection) &&
      this.view.state.facet(options) === state.facet(options);
  }

  // Escape verwirft Vorschau oder laufende Anfrage, ohne den Dokumentwert zu ändern.
  reject(): boolean {
    const pending = this.cancel();
    if (!this.view.state.field(suggestion)) return pending;
    this.view.dispatch({ effects: show.of(null) });
    return true;
  }

  // Nur die bestätigte Aktion erzeugt eine normale, rückgängig machbare Textänderung.
  accept(kind: Suggestion['kind']): boolean {
    const value = this.view.state.field(suggestion);
    if (!this.config || !value || value.kind !== kind) return false;
    const text = value.kind === 'completion' ? value.text : value.replacement;
    if (text === undefined) return false;
    this.cancel();
    const to = value.kind === 'completion' ? value.from : value.to;
    this.view.dispatch({
      changes: { from: value.from, to, insert: text },
      selection: { anchor: value.from + text.length },
      effects: show.of(null),
      userEvent: 'input.complete',
    });
    this.view.focus();
    return true;
  }

  // Disconnect und Reconfiguration hinterlassen weder Timer noch laufende Requests.
  destroy(): void { this.cancel(); }
}

const requests = ViewPlugin.fromClass(AiRequests);

// CodeMirror-Panels liegen innerhalb der View und außerhalb des Contenteditable-Bereichs.
function createEditPanel(view: EditorView): Panel {
  const doc = view.dom.ownerDocument;
  const dom = doc.createElement('div');
  dom.setAttribute('part', 'ai-panel');
  const input = doc.createElement('input');
  input.type = 'text';
  input.placeholder = 'Describe the change';
  input.setAttribute('aria-label', 'AI editing instructions');
  input.setAttribute('part', 'ai-prompt');

  // Native Buttons dürfen insbesondere in einem formularfähigen Editor nicht submitten.
  const button = (label: string, action: () => void): HTMLButtonElement => {
    const element = doc.createElement('button');
    element.type = 'button';
    element.textContent = label;
    element.setAttribute('part', 'ai-button');
    element.addEventListener('click', action);
    return element;
  };
  const reject = () => {
    view.plugin(requests)?.reject();
    view.focus();
  };
  const generate = () => { void view.plugin(requests)?.requestEdit(input.value); };
  input.addEventListener('input', () => view.plugin(requests)?.cancel());
  dom.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      reject();
    } else if (event.key === 'Enter' && event.target === input) {
      event.preventDefault();
      event.stopPropagation();
      generate();
    }
  });

  // Die vorhandene Merge-Library berechnet die exakten geänderten Zeichenbereiche.
  function render(value: Edit): void {
    if (value.replacement === undefined) {
      dom.replaceChildren(input, button('Generate', generate), button('Cancel', reject));
      return;
    }
    const preview = doc.createElement('pre');
    preview.setAttribute('part', 'ai-preview');
    preview.setAttribute('aria-label', 'Proposed changes');
    preview.style.whiteSpace = 'pre-wrap';
    preview.style.overflowWrap = 'anywhere';
    let pos = 0;
    for (const change of presentableDiff(value.original, value.replacement)) {
      preview.append(doc.createTextNode(value.original.slice(pos, change.fromA)));
      if (change.fromA !== change.toA) {
        const removed = doc.createElement('del');
        removed.setAttribute('part', 'ai-delete');
        removed.textContent = value.original.slice(change.fromA, change.toA);
        preview.append(removed);
      }
      if (change.fromB !== change.toB) {
        const inserted = doc.createElement('ins');
        inserted.setAttribute('part', 'ai-insert');
        inserted.textContent = value.replacement.slice(change.fromB, change.toB);
        preview.append(inserted);
      }
      pos = change.toA;
    }
    preview.append(doc.createTextNode(value.original.slice(pos)));
    const accept = button('Accept', () => view.plugin(requests)?.accept('edit'));
    dom.replaceChildren(preview, accept, button('Reject', reject));
    accept.focus();
  }

  const initial = view.state.field(suggestion);
  if (initial?.kind === 'edit') render(initial);
  return {
    dom,
    top: true,
    mount: () => input.focus(),
    update(update) {
      const value = update.state.field(suggestion, false);
      if (value?.kind === 'edit' && value !== update.startState.field(suggestion, false)) render(value);
    },
  };
}

// KI-Keybindings haben Vorrang nur solange ein entsprechender Vorschlag vorhanden ist.
export function aiExtensions(config: AiOptions): Extension {
  return [
    options.of(config), suggestion, requests,
    Prec.highest(keymap.of([
      ...(config.completion ? [
        { key: config.completionKey, run: triggerCompletion },
        { key: 'Tab', run: (view: EditorView) => view.plugin(requests)?.accept('completion') ?? false },
      ] : []),
      ...(config.edit ? [{ key: config.editKey, run: triggerEdit }] : []),
      { key: 'Escape', run: (view: EditorView) => view.plugin(requests)?.reject() ?? false },
    ])),
  ];
}

// Öffentliche Editor-Methoden und Keybindings verwenden dieselben Befehle.
export function triggerCompletion(view: EditorView): boolean {
  return view.plugin(requests)?.complete(true) ?? false;
}

export function triggerEdit(view: EditorView): boolean {
  return view.plugin(requests)?.openEdit() ?? false;
}
