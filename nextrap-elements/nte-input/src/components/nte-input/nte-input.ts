import { nextrap_element } from '@nextrap/nte-core';
import '@nextrap/style-base';
import { resetStyle } from '@nextrap/style-reset';
import { html, nothing, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { parseInputOptions, serializeInputOptions } from '../../lib/options';
import type { InputOptionsType, NteInputPlugin, NteInputRenderContext } from '../../lib/types';
import style from './nte-input.scss?inline';

type SupportedControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type SupportedControlContainer = HTMLElement;

@customElement('nte-input')
export class NteInput extends nextrap_element() {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  private static readonly plugins = new Map<string, NteInputPlugin>();

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
  #initializedPluginType?: string;
  #controlContainer?: SupportedControlContainer;
  #controlEvents?: AbortController;
  #handleControlStateChange = () => {
    this.#syncValueState();
  };

  static registerPlugin(plugin: NteInputPlugin) {
    for (const rawType of plugin.types) {
      const type = rawType.trim().toLowerCase();

      if (!type) {
        continue;
      }

      if (this.plugins.has(type)) {
        throw new Error(`Plugin for input type "${type}" is already registered.`);
      }

      this.plugins.set(type, plugin);
    }
  }

  static getPlugin(type: string) {
    return this.plugins.get(type.trim().toLowerCase());
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

  override updated(changedProperties: Map<PropertyKey, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('type')) {
      this.#initializedPluginType = undefined;
    }

    this.#runPluginInit();
    this.#syncControl();
  }

  override disconnectedCallback() {
    this.#controlEvents?.abort();
    super.disconnectedCallback();
  }

  override render() {
    const plugin = NteInput.getPlugin(this.#normalizedType);
    const pluginHtml = plugin?.getHtml?.(this.renderContext);

    return html`
      <div id="wrapper" part="wrapper">
        <div id="field" part="field">
          <label
            id="label"
            part="label"
            for=${this.controlId}
            ?hidden=${!this.label || this.#normalizedType === 'checkbox'}
            >${this.label}</label
          >

          <div id="control" part="control">${pluginHtml ?? nothing}</div>
        </div>

        <div id=${this.validationId} part="validation" aria-live="polite">
          <slot name="validation">${this.validationMessage}</slot>
        </div>
      </div>
    `;
  }

  #runPluginInit() {
    const plugin = NteInput.getPlugin(this.#normalizedType);

    if (!plugin?.init || this.#initializedPluginType === this.#normalizedType) {
      return;
    }

    plugin.init(this);
    this.#initializedPluginType = this.#normalizedType;
  }

  #syncControl() {
    const nextControlContainer = this.renderRoot.querySelector('#control') as SupportedControlContainer | null;

    if (nextControlContainer !== this.#controlContainer) {
      this.#controlEvents?.abort();
      this.#controlContainer = nextControlContainer ?? undefined;

      if (this.#controlContainer) {
        this.#controlEvents = new AbortController();
        this.#controlContainer.addEventListener('input', this.#handleControlStateChange, {
          signal: this.#controlEvents.signal,
        });
        this.#controlContainer.addEventListener('change', this.#handleControlStateChange, {
          signal: this.#controlEvents.signal,
        });
      }
    }

    this.#syncValueState();
  }

  #syncValueState() {
    const controls = Array.from(
      this.renderRoot.querySelectorAll('#control input, #control select, #control textarea'),
    ) as SupportedControl[];

    if (controls.length === 0) {
      this.hasValue = false;
      this.hasPlaceholder = this.hasAttribute('placeholder');
      this.#syncHoverlabelState();
      return;
    }

    this.hasPlaceholder =
      this.hasAttribute('placeholder') || controls.some((control) => control.hasAttribute('placeholder'));

    const checkControls = controls.filter(
      (control): control is HTMLInputElement =>
        control instanceof HTMLInputElement && ['checkbox', 'radio'].includes(control.type),
    );

    if (checkControls.length === controls.length) {
      this.hasValue = checkControls.some((control) => control.checked);
      this.#syncHoverlabelState();
      return;
    }

    const control = controls[0];

    if (control instanceof HTMLSelectElement) {
      this.hasValue = control.multiple ? control.selectedOptions.length > 0 : control.value.trim().length > 0;
      this.#syncHoverlabelState();
      return;
    }

    this.hasValue = control.value.trim().length > 0;
    this.#syncHoverlabelState();
  }

  #syncHoverlabelState() {
    const plugin = NteInput.getPlugin(this.#normalizedType);
    this.hoverlabelActive = plugin?.shouldHoverlabelFloat?.(this) ?? false;
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
