import { ReactiveElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FormDataMapper } from './FormDataMapper';

@customElement('nt-scope')
export class NtScope extends ReactiveElement {
  static get is() {
    return 'nt-scope';
  }

  private _formDataMapper: FormDataMapper = new FormDataMapper(this);

  @property({ type: Boolean, reflect: true })
  public debug = false;

  public get data(): object {
    return this._formDataMapper.getData();
  }

  public set data(data: object) {
    this._formDataMapper.setData(data);
  }

  override createRenderRoot() {
    // Use the light DOM instead of shadow DOM
    return this;
  }

  private dispatchValueChangedEvent() {
    const e = new CustomEvent('value-changed', {
      bubbles: true,
      composed: true,
      detail: { value: this.data },
    });
    if (this.debug) {
      console.log('nt-scope:', this, 'value-changed', e);
    }
    this.dispatchEvent(e);
  }

  constructor() {
    super();
    this.addEventListener('input', () => {
      this.dispatchValueChangedEvent();
    });
  }

  override connectedCallback() {
    super.connectedCallback();

    // Add any event listeners or initial setup here
  }
}
