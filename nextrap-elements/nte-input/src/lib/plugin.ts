import type { NteInput } from '../components/nte-input/nte-input';
import type { InputOptionsType, NteInputRenderContext, NteInputValue } from './types';

export type NteInputFormValue = File | FormData | string | null;

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

  getValue(): NteInputValue {
    return this.host.getAttribute('value') ?? '';
  }

  setValue(value: NteInputValue) {
    if (value === null || value === undefined || value === '') {
      this.host.removeAttribute('value');
      return;
    }

    this.host.setAttribute('value', String(value));
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

  getLabelFor(): string | null {
    return this.host.controlId;
  }

  onHostAttributeChange(_name: string, _oldValue: string | null, _newValue: string | null) {}

  formResetCallback() {}

  formDisabledCallback(_disabled: boolean) {}
}

export abstract class AbstractNteInputPlugin extends NteInputPluginInterface {
  #eventController?: AbortController;
  #observers = new Set<MutationObserver>();

  protected get controlId() {
    return this.host.controlId;
  }

  protected get validationId() {
    return this.host.validationId;
  }

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

  protected setHostStringAttribute(name: string, value: string | null | undefined) {
    if (!value) {
      this.host.removeAttribute(name);
      return;
    }

    this.host.setAttribute(name, value);
  }

  protected setHostBooleanAttribute(name: string, active: boolean) {
    if (active) {
      this.host.setAttribute(name, '');
      return;
    }

    this.host.removeAttribute(name);
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

  protected prepareEventBindings() {
    this.#eventController?.abort();
    this.#eventController = new AbortController();
    return this.#eventController.signal;
  }

  protected bindEvent(
    target: EventTarget | null | undefined,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options: AddEventListenerOptions = {},
  ) {
    if (!target) {
      return;
    }

    if (!this.#eventController) {
      this.#eventController = new AbortController();
    }

    target.addEventListener(type, listener, {
      ...options,
      signal: this.#eventController.signal,
    });
  }

  protected observe(target: Node, options: MutationObserverInit, callback: MutationCallback) {
    const observer = new MutationObserver(callback);
    observer.observe(target, options);
    this.#observers.add(observer);
    return observer;
  }

  protected syncHostState() {
    this.host.syncPluginState();
  }

  override disconnected() {
    this.#eventController?.abort();
    this.#observers.forEach((observer) => observer.disconnect());
    this.#observers.clear();
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
