import { nextrap_layout, NtlFeatures } from '@nextrap/ntl-core';
import { html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import { Listen } from '@trunkjs/browser-utils';
import { NtlFormStepperStepElement } from '../ntl-form-stepper-step/ntl-form-stepper-step';
import style from './ntl-form-stepper.scss?inline';

// use nextrap_element for pure elements

const features: NtlFeatures = {
  breakpoints: true, // Enables responsive design features
  subLayoutApply: true, // For NTL only: Enable <slot data-query= support for sub-layouts
  slotVisibility: false, // quick fix for marking empty slots (unless CSS Standard supports :empty for slots)
  eventBinding: true, // Switch event binding using @Listen decorators
};

@customElement('ntl-form-stepper')
export class NtlFormStepperElement extends nextrap_layout(features) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  @property({ type: Boolean, reflect: true })
  public accessor open = true;

  /**
   * Cache der aktuell zugewiesenen Step-Elemente (aus dem `steps`-Slot).
   * (Nicht als @state, da wir aktuell nur Attribute/Klassen setzen und nicht re-rendern müssen.)
   */
  private _stepElements: NtlFormStepperStepElement[] = [];

  @state()
  private accessor _activeElement: NtlFormStepperStepElement | null = null;

  private _onStepsSlotChange = (e: Event) => {
    this._stepElements = [];
    this.querySelectorAll(':scope > ntl-form-stepper-step').forEach((stepEl) => {
      this._stepElements.push(stepEl as NtlFormStepperStepElement);
    });

    if (!this._activeElement) this._activeElement = this._stepElements.length > 0 ? this._stepElements[0] : null;
  };

  private getNextElement() {
    if (!this._activeElement) return null;
    let found = false;
    for (const stepEl of this._stepElements) {
      if (stepEl === this._activeElement) {
        found = true;
        continue;
      }
      if (found) return stepEl;
    }
    return null;
  }

  @Listen('click', { target: 'host' })
  private onScroll(e: Event) {
    // fix the closest

    if (!e.target?.closest('button')?.matches('[data-option="next"]')) return;

    this._activeElement = this.getNextElement();
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    this.classList.toggle('open', this.open);
    let prev = true;
    for (const stepEl of this._stepElements) {
      if (stepEl === this._activeElement) {
        prev = false;
        stepEl.classList.add('active');
        continue;
      }
      stepEl.classList.remove('active');
      stepEl.classList.toggle('prev', prev);
      stepEl.classList.toggle('next', !prev);
    }
  }

  override render() {
    return html`
      <div id="backdrop"></div>
      <div id="wrapper">
        <div id="offcanvas" part="offcanvas">
          <div id="header" part="header">
            <div id="title">
              <slot name="header" data-query=":scope > h2"></slot>
              <p id="subheader" part="subheader">
                ${this._activeElement?.querySelector("[slot='header']")?.textContent}
              </p>
            </div>

            <button id="close-button" @click="${() => (this.open = false)}" aria-label="Close">&times;</button>
          </div>
          <div id="indicator"></div>
          <div id="content" part="content">
            <slot
              name="steps"
              data-query=":scope > section"
              data-set-attribute-layout="ntl-form-stepper-step"
              @slotchange=${this._onStepsSlotChange}
            ></slot>
          </div>
        </div>
      </div>
    `;
  }
}
