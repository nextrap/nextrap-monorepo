// CodeMirror stellt den Editor; Nextrap ergänzt Lifecycle, Formularwert und Theme-API.
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import {
  defaultKeymap,
  history,
  historyField,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import {
  bracketMatching,
  codeFolding,
  foldAll as foldAllCode,
  foldGutter,
  foldKeymap,
  HighlightStyle,
  indentOnInput,
  syntaxHighlighting,
  unfoldAll as unfoldAllCode,
} from '@codemirror/language';
import {
  getOriginalDoc,
  MergeView,
  originalDocChangeEffect,
  unifiedMergeView,
} from '@codemirror/merge';
import type { MergeConfig } from '@codemirror/merge';
import type { EditorStateConfig, Extension, StateEffect } from '@codemirror/state';
import {
  Annotation,
  ChangeSet,
  Compartment,
  EditorState,
  Transaction,
} from '@codemirror/state';
import type { ViewUpdate } from '@codemirror/view';
import {
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import { tags } from '@lezer/highlight';
import { nextrap_element } from '@nextrap/nt-core';
import type { PropertyValues } from 'lit';
import { html, unsafeCSS } from 'lit';
import { createLanguageSupport } from '../../lib/languages';
import { aiExtensions, triggerCompletion, triggerEdit } from '../../lib/ai';
import type {
  CodeEditorDiffMode,
  CodeEditorDiffOrientation,
  CodeEditorHtmlElement,
  CodeEditorLanguage,
  CodeEditorInlineCompletionCallback,
  CodeEditorInlineEditCallback,
  CodeEditorRevertControls,
} from '../../lib/types';
import style from './nte-code-editor.scss?inline';

// Programmatische Wertzuweisungen bleiben wie bei einem nativen Textfeld ereignislos.
const assignedValue = Annotation.define<boolean>();

// Syntaxfarben werden vom äußeren Sass-Mixin geliefert und bleiben im Theme anpassbar.
const tokenHighlighting = HighlightStyle.define([
  { tag: tags.keyword, color: 'var(--nte-code-editor-keyword)' },
  {
    tag: [tags.string, tags.attributeValue],
    color: 'var(--nte-code-editor-string)',
  },
  {
    tag: [tags.number, tags.bool, tags.null],
    color: 'var(--nte-code-editor-number)',
  },
  { tag: [tags.comment, tags.meta], color: 'var(--nte-code-editor-comment)' },
  { tag: [tags.tagName, tags.typeName], color: 'var(--nte-code-editor-tag)' },
  {
    tag: [tags.attributeName, tags.propertyName],
    color: 'var(--nte-code-editor-attribute)',
  },
  { tag: tags.heading, fontWeight: 'bold' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.link, textDecoration: 'underline' },
]);

// value bleibt die Arbeitsfassung, auch wenn der Vergleich zwei Editoren anzeigt.
export class NteCodeEditor extends nextrap_element({ logging: false }) {
  static formAssociated = true;
  static override styles = unsafeCSS(style);
  static override properties = {
    value: { attribute: false, noAccessor: true },
    language: { type: String },
    folding: {
      converter: {
        fromAttribute: (value: string | null) => value !== 'false',
        toAttribute: (value: boolean) => String(value),
      },
      reflect: true,
    },
    disabled: { type: Boolean, reflect: true },
    readOnly: { type: Boolean, attribute: 'readonly', reflect: true },
    label: { type: String },
    htmlElements: { attribute: false },
    classNames: { attribute: false },
    originalValue: { attribute: false },
    diffMode: { type: String, attribute: 'diff-mode', reflect: true },
    diffOrientation: {
      type: String,
      attribute: 'diff-orientation',
      reflect: true,
    },
    revertControls: {
      type: String,
      attribute: 'revert-controls',
      reflect: true,
    },
    extensions: { attribute: false },
    inlineCompletion: { attribute: false },
    inlineEdit: { attribute: false },
    inlineCompletionAutomatic: { type: Boolean, attribute: false },
    inlineCompletionDelay: { type: Number, attribute: false },
    inlineCompletionKey: { attribute: false },
    inlineEditKey: { attribute: false },
  };

  // Das value-Attribut ist der Reset-Wert; die Property ist der aktuelle Formularwert.
  static override get observedAttributes(): string[] {
    return [...super.observedAttributes, 'value'];
  }

  language: CodeEditorLanguage = 'html';
  folding = true;
  disabled = false;
  readOnly = false;
  label = 'Code editor';
  htmlElements: readonly CodeEditorHtmlElement[] = [];
  classNames: readonly string[] = [];
  originalValue: string | undefined;
  diffMode: CodeEditorDiffMode = 'unified';
  diffOrientation: CodeEditorDiffOrientation = 'original-first';
  revertControls: CodeEditorRevertControls = 'original-to-modified';
  extensions: Extension = [];

  // Ohne Callback bleibt die jeweilige KI-Funktion vollständig deaktiviert.
  inlineCompletion?: CodeEditorInlineCompletionCallback;
  inlineEdit?: CodeEditorInlineEditCallback;
  inlineCompletionAutomatic = true;
  inlineCompletionDelay = 400;
  inlineCompletionKey = 'Mod-Shift-Space';
  inlineEditKey = 'Mod-k';

  // Compartments erlauben Konfigurationswechsel ohne Verlust von Cursor und Undo-History.
  readonly #language = new Compartment();
  readonly #folding = new Compartment();
  readonly #editing = new Compartment();
  readonly #extensions = new Compartment();
  readonly #diff = new Compartment();
  readonly #ai = new Compartment();
  readonly #internals = this.attachInternals();
  #view?: EditorView;
  #merge?: MergeView;
  #savedState?: EditorState;
  #savedOriginalState?: EditorState;
  #savedSplit = false;
  #savedScroll = { top: 0, left: 0, originalLeft: 0 };
  #value = '';
  #dirtyValue = false;
  #committedValue = '';
  #formDisabled = false;
  #diffOriginal: string | undefined;

  // Die Property ist unmittelbar lesbar, auch vor dem ersten Rendern oder ohne Verbindung.
  get value(): string {
    return this.#value;
  }

  // Wie bei textarea erzeugt eine Zuweisung weder input noch change.
  set value(value: string) {
    this.#setValue(String(value ?? ''), true);
  }

  // name und form werden direkt durch ElementInternals mit dem Formular verbunden.
  get name(): string {
    return this.getAttribute('name') ?? '';
  }

  // Eine Namensänderung ist sofort auch in new FormData(form) sichtbar.
  set name(value: string) {
    this.setAttribute('name', value);
  }

  // Der Browser berücksichtigt auch das form-Attribut und deaktivierte Fieldsets.
  get form(): HTMLFormElement | null {
    return this.#internals.form;
  }

  // defaultValue folgt dem value-Attribut, unabhängig von zwischenzeitlichen Eingaben.
  get defaultValue(): string {
    return this.getAttribute('value') ?? '';
  }

  // Ein unberührter Editor übernimmt neue Defaults; ein bearbeiteter erst beim Reset.
  set defaultValue(value: string) {
    this.setAttribute('value', value);
  }

  // Die aktive View gehört auch im Split-Modus immer zur bearbeitbaren Arbeitsfassung.
  get editorView(): EditorView | undefined {
    return this.#view;
  }

  // Im Split-Modus sind beide CodeMirror-Views für gezielte Erweiterungen erreichbar.
  get mergeView(): MergeView | undefined {
    return this.#merge;
  }

  // Der Parent verarbeitet seine reaktiven Attribute; value behält native Reset-Semantik.
  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'value' && !this.#dirtyValue) {
      this.#setValue(newValue ?? '', false);
    }
  }

  // Eine wieder eingehängte Komponente erzeugt eine neue View mit dem gesicherten State.
  override connectedCallback(): void {
    super.connectedCallback();
    this.#internals.setFormValue(this.#value);
    if (this.hasUpdated) this.requestUpdate();
  }

  // DOM-Listener und Observer der View werden entfernt; Dokument und History bleiben erhalten.
  override disconnectedCallback(): void {
    this.#destroyEditor();
    super.disconnectedCallback();
  }

  // Lit besitzt nur den Mount-Punkt; CodeMirror verwaltet dessen interne DOM-Knoten.
  protected override render() {
    return html`${super.render()}
      <div
        id="editor"
        part="container"
        @input=${this.#stopInnerEvent}
        @change=${this.#stopInnerEvent}
      ></div>
      <slot NO-DEFAULT-SLOT></slot>`;
  }

  // Wertänderungen lassen die Konfiguration unangetastet; nur geänderte Optionen werden ersetzt.
  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (!this.isConnected) return;
    const split =
      this.diffMode === 'side-by-side' && this.originalValue !== undefined;
    if (this.#view && Boolean(this.#merge) !== split) this.#destroyEditor();
    const created = !this.#view;
    if (created) this.#createEditor(split);
    this.#configure(changed, created);
  }

  // Fokus wird in das eigentliche Textfeld delegiert, nicht auf den äußeren Host.
  override focus(options?: FocusOptions): void {
    if (this.disabled || this.#formDisabled) return;
    if (this.#view) this.#view.contentDOM.focus(options);
    else super.focus(options);
  }

  // Öffentliche Folding-Aktionen respektieren die ausgeschaltete Folding-Funktion.
  foldAll(): boolean {
    return Boolean(this.folding && this.#view && foldAllCode(this.#view));
  }

  // Beim deaktivierten Folding kann kein Befehl die entfernte Erweiterung reaktivieren.
  unfoldAll(): boolean {
    return Boolean(this.folding && this.#view && unfoldAllCode(this.#view));
  }

  // Externe Buttons können auch bei ausgeschalteter Automatik einen Vorschlag anfordern.
  triggerInlineCompletion(): boolean {
    return Boolean(this.#view && triggerCompletion(this.#view));
  }

  // Öffnet die Anweisung für die aktuelle Auswahl in der Arbeitsfassung.
  triggerInlineEdit(): boolean {
    return Boolean(this.#view && triggerEdit(this.#view));
  }

  // Ein nativer form.reset() stellt den Default ohne synthetische Nutzereingabe wieder her.
  formResetCallback(): void {
    this.#dirtyValue = false;
    this.#setValue(this.defaultValue, false);
  }

  // Deaktivierte Fieldsets und das disabled-Attribut sperren auch die CodeMirror-View.
  formDisabledCallback(disabled: boolean): void {
    const previous = this.#formDisabled;
    this.#formDisabled = disabled;
    this.requestUpdate('formDisabled', previous);
  }

  // Browser-Wiederherstellung verwendet denselben stillen Wertpfad wie die öffentliche API.
  formStateRestoreCallback(state: string | File | FormData | null): void {
    if (typeof state === 'string') this.#setValue(state, true);
  }

  // Native Contenteditable-Ereignisse werden durch genau ein synchronisiertes Host-Event ersetzt.
  #stopInnerEvent(event: Event): void {
    event.stopPropagation();
  }

  // CodeMirror und textarea verwenden normalisierte Zeilenumbrüche im Formularwert.
  #setValue(value: string, dirty: boolean): void {
    const next = value.replace(/\r\n?/g, '\n');
    const previous = this.#value;
    this.#dirtyValue = dirty || this.#dirtyValue;
    this.#value = next;
    this.#committedValue = next;
    this.#internals.setFormValue(next);
    if (this.#view && this.#view.state.doc.toString() !== next) {
      this.#view.dispatch({
        changes: { from: 0, to: this.#view.state.doc.length, insert: next },
        annotations: [
          assignedValue.of(true),
          Transaction.addToHistory.of(false),
        ],
      });
    }
    this.requestUpdate('value', previous);
  }

  // MergeView verwaltet und entfernt beide Views gemeinsam.
  #destroyEditor(): void {
    if (!this.#view) return;
    // KI-Vorschau und laufende Requests gehören nicht zum gespeicherten EditorState.
    this.#view.dispatch({ effects: this.#ai.reconfigure([]) });
    this.#savedState = this.#view.state;
    this.#savedSplit = Boolean(this.#merge);
    this.#savedScroll = {
      top: (this.#merge?.dom ?? this.#view.scrollDOM).scrollTop,
      left: this.#view.scrollDOM.scrollLeft,
      originalLeft: this.#merge?.a.scrollDOM.scrollLeft ?? 0,
    };
    if (this.#merge) {
      this.#savedOriginalState = this.#merge.a.state;
      this.#merge.destroy();
      this.#merge = undefined;
    } else {
      this.#view.destroy();
    }
    this.#view = undefined;
  }

  // Zwischen Disconnect und Reconnect gesetzte Werte mappen auch Auswahl und History.
  #restoreState(
    state: EditorState | undefined,
    doc: string,
  ): EditorState | undefined {
    if (!state || state.doc.toString() === doc) return state;
    return state.update({
      changes: { from: 0, to: state.doc.length, insert: doc },
      annotations: [assignedValue.of(true), Transaction.addToHistory.of(false)],
    }).state;
  }

  // Nur öffentliche Zustände übernehmen: MergeView benötigt eigene Diff-Felder und Dispatches.
  #stateConfig(original: boolean, saved?: EditorState): EditorStateConfig {
    const doc = original
      ? (this.originalValue ?? '').replace(/\r\n?/g, '\n')
      : this.#value;
    const state = this.#restoreState(saved, doc);
    const savedHistory = state?.field(historyField, false);
    return {
      doc,
      selection: state?.selection,
      extensions: [
        this.#baseExtensions(original),
        savedHistory === undefined ? [] : historyField.init(() => savedHistory),
      ],
    };
  }

  // A bleibt das Original, B die Arbeitsfassung; die visuelle Reihenfolge ist davon unabhängig.
  #createEditor(split: boolean): void {
    const parent = this.renderRoot.querySelector<HTMLElement>('#editor')!;
    const root = this.renderRoot as ShadowRoot;
    if (split) {
      this.#diffOriginal = undefined;
      this.#merge = new MergeView({
        a: this.#stateConfig(true, this.#savedOriginalState),
        b: this.#stateConfig(false, this.#savedState),
        ...this.#mergeOptions(),
        parent,
        root,
      });
      this.#view = this.#merge.b;
      this.#merge.dom.setAttribute('part', 'editor merge-view');
      this.#merge.a.dom.setAttribute('part', 'original-editor');
      this.#view.dom.setAttribute('part', 'modified-editor');
      this.#savedOriginalState = undefined;
    } else {
      let state = this.#savedSplit
        ? undefined
        : this.#restoreState(this.#savedState, this.#value);
      if (!state) {
        this.#diffOriginal = undefined;
        state = EditorState.create(this.#stateConfig(false, this.#savedState));
      }
      this.#view = new EditorView({ state, parent, root });
      this.#view.dom.setAttribute('part', 'editor');
    }
    this.#savedState = undefined;
    const view = this.#view;
    const scroll = this.#savedScroll;
    view.requestMeasure({
      read: () => null,
      write: () => {
        if (this.#view !== view) return;
        (this.#merge?.dom ?? view.scrollDOM).scrollTop = scroll.top;
        view.scrollDOM.scrollLeft = scroll.left;
        if (this.#merge) this.#merge.a.scrollDOM.scrollLeft = scroll.originalLeft;
      },
    });
  }

  // Die Standardfunktionen werden einzeln eingebunden, damit Folding vollständig abschaltbar ist.
  #baseExtensions(original: boolean): Extension {
    return [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      dropCursor(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      highlightActiveLine(),
      syntaxHighlighting(tokenHighlighting),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...completionKeymap,
        // Tab und Shift+Tab bearbeiten die Einrückung, statt den Editor zu verlassen.
        indentWithTab,
      ]),
      this.#language.of([]),
      this.#folding.of([]),
      this.#editing.of([]),
      this.#extensions.of([]),
      this.#diff.of([]),
      this.#ai.of([]),
      EditorView.updateListener.of((update) =>
        original ? this.#onOriginalUpdate(update) : this.#onEditorUpdate(update),
      ),
      original
        ? []
        : EditorView.domEventObservers({
            focus: () => {
              this.#committedValue = this.#value;
            },
            blur: () => this.#commitChange(),
          }),
    ];
  }

  // Compartments erhalten die View; insbesondere verändert ein Sprachwechsel nicht den Text.
  #configure(changed: PropertyValues, all: boolean): void {
    this.#configureView(this.#view!, false, changed, all);
    if (!this.#merge) return;
    this.#configureView(this.#merge.a, true, changed, all);
    if (all || changed.has('originalValue')) {
      const original = (this.originalValue ?? '').replace(/\r\n?/g, '\n');
      const view = this.#merge.a;
      if (view.state.doc.toString() !== original) {
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: original },
          annotations: [assignedValue.of(true), Transaction.addToHistory.of(false)],
        });
      }
    }
    if (
      all ||
      changed.has('diffOrientation') ||
      changed.has('revertControls') ||
      changed.has('disabled') ||
      changed.has('readOnly') ||
      changed.has('formDisabled')
    ) {
      this.#merge.reconfigure(this.#mergeOptions());
    }
  }

  // Sprache und Folding gelten für beide Seiten; Extensions und Formular-Events für die Arbeitsfassung.
  #configureView(
    view: EditorView,
    original: boolean,
    changed: PropertyValues,
    all: boolean,
  ): void {
    const effects: StateEffect<unknown>[] = [];
    if (
      all ||
      changed.has('language') ||
      changed.has('htmlElements') ||
      changed.has('classNames')
    ) {
      effects.push(
        this.#language.reconfigure(
          createLanguageSupport(
            this.language,
            this.htmlElements,
            this.classNames,
          ),
        ),
      );
    }
    if (all || changed.has('folding')) {
      effects.push(
        this.#folding.reconfigure(
          this.folding
            ? [codeFolding(), foldGutter(), keymap.of(foldKeymap)]
            : [],
        ),
      );
    }
    if (
      all ||
      changed.has('disabled') ||
      changed.has('readOnly') ||
      changed.has('formDisabled') ||
      changed.has('label')
    ) {
      const disabled = this.disabled || this.#formDisabled;
      const readOnly = original || disabled || this.readOnly;
      const role = original ? 'original' : 'modified';
      effects.push(
        this.#editing.reconfigure([
          EditorState.readOnly.of(readOnly),
          EditorView.editable.of(!disabled && !original),
          EditorView.contentAttributes.of({
            part: this.#merge ? `content ${role}-content` : 'content',
            'aria-label': this.#merge
              ? `${this.label} – ${original ? 'Original' : 'Arbeitsfassung'}`
              : this.label,
            'aria-multiline': 'true',
            'aria-disabled': String(disabled),
            'aria-readonly': String(readOnly),
            tabindex: disabled ? '-1' : '0',
          }),
        ]),
      );
    }
    if (!original && (all || changed.has('extensions')))
      effects.push(this.#extensions.reconfigure(this.extensions));
    // KI-Extensions laufen nur auf der editierbaren Arbeitsfassung.
    if (!original && (all || changed.has('inlineCompletion') || changed.has('inlineEdit') ||
        changed.has('inlineCompletionAutomatic') || changed.has('inlineCompletionDelay') ||
        changed.has('inlineCompletionKey') || changed.has('inlineEditKey') || changed.has('language') ||
        changed.has('disabled') || changed.has('readOnly') || changed.has('formDisabled'))) {
      const canEdit = () => this.isConnected && !this.disabled && !this.#formDisabled && !this.readOnly;
      const completion = this.inlineCompletion;
      const edit = this.inlineEdit;
      effects.push(this.#ai.reconfigure(canEdit() && (completion || edit) ? aiExtensions({
        completion, edit,
        automatic: this.inlineCompletionAutomatic,
        delay: this.inlineCompletionDelay,
        completionKey: this.inlineCompletionKey,
        editKey: this.inlineEditKey,
        language: () => this.language,
        canEdit: () => canEdit() && completion === this.inlineCompletion && edit === this.inlineEdit,
      }) : []));
    }
    if (!this.#merge && (all || changed.has('originalValue')))
      this.#configureDiff(effects);
    if (effects.length) view.dispatch({ effects });
    const role = original ? 'original' : 'modified';
    view.scrollDOM.setAttribute(
      'part',
      this.#merge ? `scroller ${role}-scroller` : 'scroller',
    );
    view.dom.querySelector('.cm-gutters')?.setAttribute(
      'part',
      this.#merge ? `gutters ${role}-gutters` : 'gutters',
    );
  }

  // Read-only sperrt auch explizite Übernahmen, unabhängig von deren Richtung.
  #mergeOptions(): MergeConfig {
    const locked = this.disabled || this.#formDisabled || this.readOnly;
    return {
      orientation: this.diffOrientation === 'modified-first' ? 'b-a' : 'a-b',
      revertControls:
        locked || this.revertControls === 'none'
          ? undefined
          : this.revertControls === 'modified-to-original'
            ? 'b-to-a'
            : 'a-to-b',
      renderRevertControl: () => this.#renderRevertControl(),
    };
  }

  // Die Pfeile folgen dem Ziel; CodeMirror übernimmt den zugehörigen Diff-Block.
  #renderRevertControl(): HTMLElement {
    const button = document.createElement('button');
    const toOriginal = this.revertControls === 'modified-to-original';
    const toLeft = toOriginal === (this.diffOrientation !== 'modified-first');
    const label = toOriginal
      ? 'Änderung in das Original übernehmen'
      : 'Änderung durch das Original ersetzen';
    button.type = 'button';
    button.setAttribute('part', 'revert-control');
    button.setAttribute('aria-label', label);
    button.title = label;
    button.textContent = toLeft ? '←' : '→';
    // Sperrt auch den kurzen Zeitraum vor dem nächsten reaktiven Update.
    const guard = (event: Event) => {
      if (
        this.disabled || this.#formDisabled || this.readOnly ||
        this.revertControls === 'none'
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    button.addEventListener('mousedown', guard, { capture: true });
    button.addEventListener('click', guard, { capture: true });
    // CodeMirror hört auf mousedown; Tastatur und Assistenztechnik lösen dagegen click aus.
    button.addEventListener('click', (event) => {
      if (event.detail !== 0) return;
      event.preventDefault();
      button.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      }));
    });
    return button;
  }

  // Bei einer neuen Baseline muss auch das bestehende Original-Document-Feld aktualisiert werden.
  #configureDiff(effects: StateEffect<unknown>[]): void {
    const next = this.originalValue?.replace(/\r\n?/g, '\n');
    if (next === this.#diffOriginal) return;
    if (next !== undefined && this.#diffOriginal !== undefined) {
      const original = getOriginalDoc(this.#view!.state);
      const changes = ChangeSet.of(
        { from: 0, to: original.length, insert: next },
        original.length,
      );
      effects.push(originalDocChangeEffect(this.#view!.state, changes));
    } else {
      effects.push(
        this.#diff.reconfigure(
          next === undefined
            ? []
            : unifiedMergeView({ original: next, mergeControls: false }),
        ),
      );
    }
    this.#diffOriginal = next;
  }

  // Formularwert und Property sind bereits aktuell, wenn ein input-Handler aufgerufen wird.
  #onEditorUpdate(update: ViewUpdate): void {
    if (!update.docChanged) return;
    const previous = this.#value;
    this.#value = update.state.doc.toString();
    this.#internals.setFormValue(this.#value);
    this.requestUpdate('value', previous);
    if (
      update.transactions.some(
        (transaction) =>
          transaction.docChanged && !transaction.annotation(assignedValue),
      )
    ) {
      this.#dirtyValue = true;
      this.dispatchEvent(
        new InputEvent('input', { bubbles: true, composed: true }),
      );
      if (update.transactions.some((transaction) => transaction.isUserEvent('revert')))
        this.#commitChange();
    }
  }

  // Eine bewusste Übernahme ins Original verändert niemals den Formularwert.
  #onOriginalUpdate(update: ViewUpdate): void {
    if (
      !update.docChanged ||
      !update.transactions.some(
        (transaction) =>
          transaction.docChanged && !transaction.annotation(assignedValue),
      )
    ) return;
    this.originalValue = update.state.doc.toString();
    this.dispatchEvent(new CustomEvent<{ value: string }>('original-change', {
      detail: { value: this.originalValue },
      bubbles: true,
      composed: true,
    }));
  }

  // change schließt eine Bearbeitung beim Blur oder eine blockweise Übernahme ab.
  #commitChange(): void {
    if (this.#committedValue === this.#value) return;
    this.#committedValue = this.#value;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
}

// Der öffentliche Import registriert genau dieses Custom Element.
if (!customElements.get('nte-code-editor'))
  customElements.define('nte-code-editor', NteCodeEditor);

// DOM-Abfragen und createElement erhalten den konkreten Property-Vertrag.
declare global {
  interface HTMLElementTagNameMap {
    'nte-code-editor': NteCodeEditor;
  }
}
