import {
  Listen,
  customElement,
  html,
  nextrap_element,
  nothing,
  property,
  state,
  unsafeCSS,
  waitForDomContentLoaded,
} from '@nextrap/nte-core';
import '@nextrap/style-base';
import { resetStyle } from '@nextrap/style-reset';

import { PropertyValues } from 'lit';
import { parseInputOptions, serializeInputOptions } from '../../lib/options';
import type { NteInputPluginClass, NteInputPluginInterface, NteInputPluginStyleSheet } from '../../lib/plugin';
import type { InputOptionsType, NteInputRenderContext, NteInputValue } from '../../lib/types';
import style from './nte-input.scss?inline';

@customElement('nte-input')
export class NteInput extends nextrap_element({
  eventBinding: true,
  slotVisibility: true, // This will add .slot-empty to empty slot elements. Rely on this to detect empty slots in css.
}) {
  static formAssociated = true;
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  private static readonly plugins = new Map<string, NteInputPluginClass>();

  @property({ type: String, reflect: true }) accessor type = 'text';
  @property({ type: String }) accessor label = '';
  @property({ type: String }) accessor placeholder = '';
  @property({
    attribute: 'data-options',
    converter: {
      fromAttribute: (value: string | null) => parseInputOptions(value),
      toAttribute: (value: InputOptionsType) => serializeInputOptions(value),
    },
  })
  accessor options: InputOptionsType | null = null;
  @property({ type: Boolean }) accessor multiple = false;
  @property({ type: String, attribute: 'validation-message', reflect: true }) accessor validationMessage = '';
  @property({ type: Boolean, reflect: true }) accessor invalid = false;
  @property({ type: Boolean, reflect: true }) accessor valid = false;
  @property({ type: Boolean, reflect: true, attribute: 'has-value' }) accessor hasValue = false;
  @property({ type: Boolean, reflect: true, attribute: 'has-placeholder' }) accessor hasPlaceholder = false;
  @property({ type: Boolean, reflect: true, attribute: 'hoverlabel-active' }) accessor hoverlabelActive = false;

  @state()
  protected accessor _value: NteInputValue | undefined = undefined;

  #generatedId = `nte-input-${Math.random().toString(36).slice(2, 9)}`;
  #plugin?: NteInputPluginInterface;
  #pluginStyleElement?: HTMLStyleElement;
  #pluginConstructableStyleSheet?: CSSStyleSheet;
  #internals: ElementInternals | null = null;

  constructor() {
    super();

    if (typeof this.attachInternals === 'function') {
      this.#internals = this.attachInternals();
    }
  }

  static registerPlugin(pluginClass: NteInputPluginClass) {
    for (const rawType of pluginClass.types) {
      const type = rawType.trim().toLowerCase();

      if (!type) {
        continue;
      }

      if (this.plugins.has(type)) {
        throw new Error(`Plugin for input type "${type}" is already registered.`);
      }

      this.plugins.set(type, pluginClass);
    }
  }

  static getPlugin(type: string) {
    return this.plugins.get(type.trim().toLowerCase());
  }

  override async connectedCallback() {
    await waitForDomContentLoaded();

    const pluginClass = NteInput.getPlugin(this.#normalizedType);

    if (!pluginClass) {
      throw new Error(`No plugin for type ${this.#normalizedType}`);
    }
    this.#plugin = new pluginClass(this);

    if (this._value === undefined) {
      this._value = this.#plugin?.getInitValue();
    }

    if (this.#willValidate() && typeof this.#internals?.setValidity === 'function') {
      this.#internals.setValidity({ customError: true, badInput: true }, 'Invalid value');
    }

    super.connectedCallback();

    this.#applyPluginStyleSheet(this.#plugin.getStyleSheet());
    this.#plugin?.connected();
  }

  override disconnectedCallback() {
    this.#plugin?.disconnected();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    this.#plugin?.onHostAttributeChange(name, oldValue, newValue);
  }

  override updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);
    this.#plugin?.updated(changedProperties);
    this.syncPluginState();
  }

  override render() {
    const plugin = this.#plugin;

    const pluginHtml = plugin?.render(this.renderContext);

    return html`
      <div id="wrapper" part="wrapper">
        <div id="field" part="field">
          <label
            id="label"
            part="label"
            for=${plugin?.getLabelFor() ?? this.controlId}
            ?hidden=${!this.label || Boolean(plugin?.isLabelHidden())}
          >
            ${this.label}
          </label>

          <div id="control" part="control">${pluginHtml ?? nothing}</div>
        </div>

        <div id=${this.validationId} part="validation" aria-live="polite">
          <div id="validation-inner" part="validation-inner">
            <div id="validation-bubble" part="validation-bubble">
              <span id="validation-arrow" part="validation-arrow" aria-hidden="true"></span>
              <div id="validation-content" part="validation-content">
                <slot name="validation">${this.validationMessage}</slot>
              </div>
            </div>
          </div>
        </div>

        <div id="input-aid" part="input-aid">
          <div id="input-aid-inner" part="input-aid-inner">
            <div id="input-aid-bubble" part="input-aid-bubble">
              <span id="input-aid-arrow" part="input-aid-arrow" aria-hidden="true"></span>
              <div id="input-aid-content" part="input-aid-content">
                <slot name="input-aid"></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  protected override update(changedProperties: PropertyValues) {
    super.update(changedProperties);
  }

  get controlId() {
    return `${this.#baseId}-control`;
  }

  get validationId() {
    return `${this.#baseId}-validation`;
  }

  get renderContext(): NteInputRenderContext {
    return {
      element: this,
      type: this.#normalizedType,
      controlId: this.controlId,
      validationId: this.validationId,
    };
  }

  get form() {
    return this.#internals?.form ?? null;
  }

  get name() {
    return this.getAttribute('name') ?? '';
  }

  get value(): NteInputValue {
    return this._value;
  }

  set value(value: NteInputValue) {
    this._value = value;
    this.syncPluginState();
  }

  get selectedOptions(): InputOptionsType {
    return this.#plugin?.getSelectedOptions() ?? [];
  }

  syncPluginState() {
    const plugin = this.#plugin;

    this.hasValue = plugin?.hasValue() ?? false;
    this.hasPlaceholder = plugin?.hasPlaceholder() ?? this.hasAttribute('placeholder');
    this.hoverlabelActive = plugin?.isHoverlabelActive() ?? false;
    this.#syncFormValue();
  }

  formResetCallback() {
    this.#plugin?.formResetCallback();
    this.syncPluginState();
  }

  formDisabledCallback(disabled: boolean) {
    this.#plugin?.formDisabledCallback(disabled);
    this.syncPluginState();
  }

  #syncFormValue() {
    if (!this.#internals || typeof this.#internals.setFormValue !== 'function') {
      return;
    }

    if (!this.name || this.hasAttribute('disabled')) {
      this.#internals.setFormValue(null);
      return;
    }

    this.#internals.setFormValue(this.#plugin?.getFormValue() ?? null);
  }

  @Listen('input', { target: 'host' })
  @Listen('invalid', { target: 'host' })
  onMustRevalidateInternal() {
    if (!this.#willValidate()) {
      return;
    }
    if (this.#plugin?.isValid() === true) {
      if (typeof this.#internals?.setValidity === 'function') {
        this.#internals.setValidity({});
      }
      this.removeAttribute('invalid');
      this.setAttribute('valid', '');
    } else {
      if (typeof this.#internals?.setValidity === 'function') {
        this.#internals.setValidity({ customError: true, badInput: true }, 'Invalid value');
      }
      this.setAttribute('invalid', '');
      this.removeAttribute('valid');
    }
  }

  @Listen('click')
  onClick(e: Event) {
    this.#plugin?.onClick(e);

    if (this.hasAttribute('disabled')) {
      return;
    }
    this.#plugin?.getFormElement()?.focus();
  }

  @Listen('change')
  onChange(e: Event) {
    this.#plugin?.onChange(e);
  }

  @Listen('input')
  onInput(e: Event) {
    this.#plugin?.onInput(e);
  }

  #willValidate() {
    if (this.hasAttribute('required') && !this.hasAttribute('disabled')) {
      return true;
    }
    return false;
  }

  #applyPluginStyleSheet(styleSheet: NteInputPluginStyleSheet | null) {
    const renderRoot = this.renderRoot;

    if (!(renderRoot instanceof ShadowRoot)) {
      return;
    }

    if (this.#pluginConstructableStyleSheet && 'adoptedStyleSheets' in renderRoot) {
      renderRoot.adoptedStyleSheets = renderRoot.adoptedStyleSheets.filter(
        (sheet) => sheet !== this.#pluginConstructableStyleSheet,
      );
      this.#pluginConstructableStyleSheet = undefined;
    }

    this.#pluginStyleElement?.remove();
    this.#pluginStyleElement = undefined;

    if (!styleSheet) {
      return;
    }

    if (
      typeof CSSStyleSheet !== 'undefined' &&
      styleSheet instanceof CSSStyleSheet &&
      'adoptedStyleSheets' in renderRoot
    ) {
      renderRoot.adoptedStyleSheets = [...renderRoot.adoptedStyleSheets, styleSheet];
      this.#pluginConstructableStyleSheet = styleSheet;
      return;
    }

    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-plugin-style', this.#normalizedType);
    styleElement.textContent =
      typeof styleSheet === 'string' ? styleSheet : Array.from(styleSheet.cssRules, (rule) => rule.cssText).join('\n');

    renderRoot.append(styleElement);
    this.#pluginStyleElement = styleElement;
  }

  get #baseId() {
    return this.id || this.#generatedId;
  }

  get #normalizedType() {
    return this.type.trim().toLowerCase() || 'text';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-input': NteInput;
  }
}
