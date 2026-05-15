import { nextrap_element } from '@nextrap/nte-core';
import '@nextrap/style-base';
import { resetStyle } from '@nextrap/style-reset';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { parseInputOptions, serializeInputOptions } from '../../lib/options';
import type { NteInputPluginClass, NteInputPluginInterface } from '../../lib/plugin';
import type { InputOptionsType, NteInputRenderContext, NteInputValue } from '../../lib/types';
import style from './nte-input.scss?inline';

@customElement('nte-input')
export class NteInput extends nextrap_element() {
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
  @property({ type: String, attribute: 'validation-message' }) accessor validationMessage = '';
  @property({ type: Boolean, reflect: true }) accessor invalid = false;
  @property({ type: Boolean, reflect: true, attribute: 'has-value' }) accessor hasValue = false;
  @property({ type: Boolean, reflect: true, attribute: 'has-placeholder' }) accessor hasPlaceholder = false;
  @property({ type: Boolean, reflect: true, attribute: 'hoverlabel-active' }) accessor hoverlabelActive = false;

  #generatedId = `nte-input-${Math.random().toString(36).slice(2, 9)}`;
  #plugin?: NteInputPluginInterface;
  #resolvedPluginType?: string;
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

  override connectedCallback() {
    super.connectedCallback();
    this.#getPlugin()?.connected();
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
    this.#getPlugin()?.updated(changedProperties);
    this.syncPluginState();
  }

  override render() {
    const plugin = this.#getPlugin();
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
          <slot name="validation">${this.validationMessage}</slot>
        </div>
      </div>
    `;
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
      type: this.#resolvedPluginType ?? this.#normalizedType,
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
    return this.#getPlugin()?.getValue() ?? this.getAttribute('value') ?? '';
  }

  set value(value: NteInputValue) {
    this.#getPlugin()?.setValue(value);
    this.syncPluginState();
  }

  get selectedOptions(): InputOptionsType {
    return this.#getPlugin()?.getSelectedOptions() ?? [];
  }

  syncPluginState() {
    const plugin = this.#getPlugin();

    this.hasValue = plugin?.hasValue() ?? false;
    this.hasPlaceholder = plugin?.hasPlaceholder() ?? this.hasAttribute('placeholder');
    this.hoverlabelActive = plugin?.isHoverlabelActive() ?? false;
    this.#syncFormValue();
  }

  formResetCallback() {
    this.#getPlugin()?.formResetCallback();
    this.syncPluginState();
  }

  formDisabledCallback(disabled: boolean) {
    this.#getPlugin()?.formDisabledCallback(disabled);
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

    this.#internals.setFormValue(this.#getPlugin()?.getFormValue() ?? null);
  }

  #getPlugin() {
    if (!this.#plugin) {
      const pluginClass = NteInput.getPlugin(this.#normalizedType);

      if (!pluginClass) {
        return undefined;
      }

      this.#resolvedPluginType = this.#normalizedType;
      this.#plugin = new pluginClass(this);
    }

    return this.#plugin;
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
