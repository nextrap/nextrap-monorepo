import type { NteInput } from '../components/nte-input/nte-input';
import { NTE_INPUT_CONTROL_ID, type InputOptionsType, type NteInputRenderContext, type NteInputValue } from './types';

export type NteInputFormValue = File | FormData | string | null;
export type NteInputPluginStyleSheet = CSSStyleSheet | string;

export interface NteInputPluginClass {
  readonly types: string[];
  new (host: NteInput): NteInputPluginInterface;
}

export abstract class NteInputPluginInterface {
  constructor(protected readonly host: NteInput) {}

  abstract render(context: NteInputRenderContext): unknown;

  connected() {}

  disconnected() {}

  updated(_changedProperties: Map<PropertyKey, unknown>) {}

  onClick(e: Event) {}

  onInput(e: Event) {}

  /**
   * Returns the actual form element that is associated with this plugin.
   */
  getFormElement(): HTMLElement | null {
    return null;
  }

  getValue(): NteInputValue {
    return this.host.value;
  }

  setValue(value: NteInputValue) {
    this.host.value = value;
  }

  getStyleSheet(): NteInputPluginStyleSheet | null {
    return null;
  }

  getFormValue(): NteInputFormValue | undefined {
    return undefined;
  }

  getSelectedOptions(): InputOptionsType {
    return [];
  }

  hasValue(): boolean {
    return false;
  }

  hasPlaceholder(): boolean {
    return false;
  }

  isHoverlabelActive(): boolean {
    return false;
  }

  isLabelHidden(): boolean {
    return false;
  }

  getControlId(): string {
    return this.getFormElement()?.id || NTE_INPUT_CONTROL_ID;
  }

  getLabelFor(): string {
    return this.getControlId();
  }

  isValid(): boolean | null {
    return null;
  }

  onChange(newValue: any): void {}

  /**
   * Called once on startup to determine the initial value of the value propierty.
   *
   * Will normaly return the value or the Property value
   */
  getInitValue(): NteInputValue {
    return this.host.getAttribute('value') ?? null;
  }

  onHostAttributeChange(_name: string, _oldValue: string | null, _newValue: string | null) {}

  formResetCallback() {}

  formDisabledCallback(_disabled: boolean) {}
}

export abstract class AbstractNteInputPlugin extends NteInputPluginInterface {
  #eventController?: AbortController;

  protected query<T extends Element>(selector: string) {
    return (this.host.renderRoot?.querySelector(selector) as T | null) ?? null;
  }

  protected queryAll<T extends Element>(selector: string) {
    return Array.from(this.host.renderRoot?.querySelectorAll(selector) ?? []) as T[];
  }

  protected getHostAttribute(name: string, fallback = '') {
    return this.host.getAttribute(name) ?? fallback;
  }

  protected hasHostAttribute(name: string) {
    return this.host.hasAttribute(name);
  }

  protected normalizeStringValue(value: NteInputValue) {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value);
  }

  protected createFormData(values: string[]) {
    if (!this.host.name || values.length === 0) {
      return null;
    }

    const formData = new FormData();
    values.forEach((value) => {
      formData.append(this.host.name, value);
    });
    return formData;
  }

  protected syncHostState() {
    this.host.syncPluginState();
  }

  override disconnected() {
    this.#eventController?.abort();
  }

  override getFormValue(): NteInputFormValue {
    const value = this.getValue();

    if (Array.isArray(value)) {
      return this.createFormData(value);
    }

    if (typeof value === 'boolean') {
      return value ? this.getHostAttribute('value', 'on') : null;
    }

    if (value === null || value === undefined) {
      return null;
    }

    return String(value);
  }

  override hasValue() {
    const value = this.getValue();

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    return this.normalizeStringValue(value).trim().length > 0;
  }

  override hasPlaceholder() {
    return this.hasHostAttribute('placeholder');
  }

  override isHoverlabelActive() {
    return this.hasPlaceholder() || this.hasValue();
  }
}
