// CodeMirror stellt den Editor; Nextrap ergänzt Lifecycle, Formularwert und Theme-API.
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
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
  originalDocChangeEffect,
  unifiedMergeView,
} from '@codemirror/merge';
import type { Extension, StateEffect } from '@codemirror/state';
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
import type {
  CodeEditorHtmlElement,
  CodeEditorLanguage,
} from '../../lib/types';
import style from './ntl-code-editor.scss?inline';

// Programmatische Wertzuweisungen bleiben wie bei einem nativen Textfeld ereignislos.
const assignedValue = Annotation.define<boolean>();

// Syntaxfarben werden vom äußeren Sass-Mixin geliefert und bleiben im Theme anpassbar.
const tokenHighlighting = HighlightStyle.define([
  { tag: tags.keyword, color: 'var(--ntl-code-editor-keyword)' },
  {
    tag: [tags.string, tags.attributeValue],
    color: 'var(--ntl-code-editor-string)',
  },
  {
    tag: [tags.number, tags.bool, tags.null],
    color: 'var(--ntl-code-editor-number)',
  },
  { tag: [tags.comment, tags.meta], color: 'var(--ntl-code-editor-comment)' },
  { tag: [tags.tagName, tags.typeName], color: 'var(--ntl-code-editor-tag)' },
  {
    tag: [tags.attributeName, tags.propertyName],
    color: 'var(--ntl-code-editor-attribute)',
  },
  { tag: tags.heading, fontWeight: 'bold' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.link, textDecoration: 'underline' },
]);

// Ein einzelner Editor behält seinen Zustand auch beim Umschalten der Optionen.
export class NtlCodeEditor extends nextrap_element({ logging: false }) {
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
    extensions: { attribute: false },
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
  extensions: Extension = [];

  // Compartments erlauben Konfigurationswechsel ohne Verlust von Cursor und Undo-History.
  readonly #language = new Compartment();
  readonly #folding = new Compartment();
  readonly #editing = new Compartment();
  readonly #extensions = new Compartment();
  readonly #diff = new Compartment();
  readonly #internals = this.attachInternals();
  #view?: EditorView;
  #savedState?: EditorState;
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

  // Für CodeMirror-Erweiterungen steht die aktive View nach updateComplete bereit.
  get editorView(): EditorView | undefined {
    return this.#view;
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
    if (this.#view) {
      this.#savedState = this.#view.state;
      this.#view.destroy();
      this.#view = undefined;
    }
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
    const created = !this.#view;
    if (created) this.#createEditor();
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

  // Ein Initialwert wird vor dem Anlegen der View in den State übernommen.
  #createEditor(): void {
    const parent = this.renderRoot.querySelector<HTMLElement>('#editor')!;
    let state = this.#savedState;
    if (state && state.doc.toString() !== this.#value) {
      state = state.update({
        changes: { from: 0, to: state.doc.length, insert: this.#value },
        annotations: Transaction.addToHistory.of(false),
      }).state;
    }
    if (!state) {
      this.#diffOriginal = undefined;
      state = EditorState.create({
        doc: this.#value,
        extensions: this.#baseExtensions(),
      });
    }
    this.#savedState = undefined;
    this.#view = new EditorView({
      state,
      parent,
      root: this.renderRoot as ShadowRoot,
    });
    this.#view.dom.setAttribute('part', 'editor');
    this.#view.scrollDOM.setAttribute('part', 'scroller');
  }

  // Die Standardfunktionen werden einzeln eingebunden, damit Folding vollständig abschaltbar ist.
  #baseExtensions(): Extension {
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
      ]),
      this.#language.of([]),
      this.#folding.of([]),
      this.#editing.of([]),
      this.#extensions.of([]),
      this.#diff.of([]),
      EditorView.updateListener.of((update) => this.#onEditorUpdate(update)),
      EditorView.domEventObservers({
        focus: () => {
          this.#committedValue = this.#value;
        },
        blur: () => this.#commitChange(),
      }),
    ];
  }

  // Compartments erhalten die View; insbesondere verändert ein Sprachwechsel nicht den Text.
  #configure(changed: PropertyValues, all: boolean): void {
    const view = this.#view!;
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
      effects.push(
        this.#editing.reconfigure([
          EditorState.readOnly.of(disabled || this.readOnly),
          EditorView.editable.of(!disabled),
          EditorView.contentAttributes.of({
            part: 'content',
            'aria-label': this.label,
            'aria-multiline': 'true',
            'aria-disabled': String(disabled),
            'aria-readonly': String(disabled || this.readOnly),
            tabindex: disabled ? '-1' : '0',
          }),
        ]),
      );
    }
    if (all || changed.has('extensions'))
      effects.push(this.#extensions.reconfigure(this.extensions));
    if (all || changed.has('originalValue')) this.#configureDiff(effects);
    if (effects.length) view.dispatch({ effects });
    view.dom.querySelector('.cm-gutters')?.setAttribute('part', 'gutters');
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
    }
  }

  // change bezeichnet wie bei textarea den Abschluss einer geänderten Eingabe beim Blur.
  #commitChange(): void {
    if (this.#committedValue === this.#value) return;
    this.#committedValue = this.#value;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }
}

// Der öffentliche Import registriert genau dieses Custom Element.
if (!customElements.get('ntl-code-editor'))
  customElements.define('ntl-code-editor', NtlCodeEditor);

// DOM-Abfragen und createElement erhalten den konkreten Property-Vertrag.
declare global {
  interface HTMLElementTagNameMap {
    'ntl-code-editor': NtlCodeEditor;
  }
}
