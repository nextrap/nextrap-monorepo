import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import style from './nte-input-control.scss?inline';

type SupportedControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

@customElement('nte-input-control')
export class NteInputControl extends LitElement {
  static override styles = [unsafeCSS(style)];

  @property() label = '';
  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) floating = false;
  @property() helperText = '';
  @property() invalidFeedback = '';
  @property() validFeedback = '';
  @property() switchStyle: 'classic' | 'modern' = 'classic';
  @property() type: string = 'text';

  @state() private hasLabelSlot = false;
  @state() private effectiveRequired = false;
  @state() private showInvalid = false;
  @state() private showValid = false;
  @state() private isFilled = false;

  private inputElement: SupportedControl | null = null;
  private mutationObserver?: MutationObserver;
  private generatedId = `nte-input-control-${Math.random().toString(36).substring(2, 9)}`;
  private recheckScheduled = false;

  override createRenderRoot() {
    const root = super.createRenderRoot();
    root.addEventListener('click', (event) => {
      // Check if the clicked element is a label within this component's shadow DOM
      if ((event.target as HTMLElement).tagName === 'LABEL') {
        const labelFor = (event.target as HTMLLabelElement).htmlFor;
        if (labelFor && this.inputElement && this.inputElement.id === labelFor) {
          this.inputElement.focus();
          if (
            this.inputElement instanceof HTMLInputElement &&
            (this.inputElement.type === 'checkbox' || this.inputElement.type === 'radio')
          ) {
            this.inputElement.click(); // Programmatically click for check/radio
          }
        }
      }
    });
    return root;
  }

  override firstUpdated() {
    const inputSlot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement | null;
    inputSlot?.addEventListener('slotchange', this.handleInputSlotChange);
    this.handleInputSlotChange();

    const labelSlot = this.shadowRoot?.querySelector('slot[name="label"]') as HTMLSlotElement | null;
    labelSlot?.addEventListener('slotchange', this.handleLabelSlotChange);
    this.hasLabelSlot = !!labelSlot && labelSlot.assignedNodes({ flatten: true }).length > 0;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.teardownInputListeners();
  }

  private handleLabelSlotChange = (event?: Event) => {
    const slot =
      (event?.target as HTMLSlotElement) ??
      (this.shadowRoot?.querySelector('slot[name="label"]') as HTMLSlotElement | null);
    this.hasLabelSlot = !!slot && slot.assignedNodes({ flatten: true }).length > 0;
  };

  private handleInputSlotChange = (event?: Event) => {
    const slot =
      (event?.target as HTMLSlotElement) ??
      (this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement | null);
    const assigned = slot ? slot.assignedElements({ flatten: true }) : [];

    this.applyControlStylesToNestedNteInputs(assigned);

    const control = this.findControl(assigned);
    this.attachToControl(control);

    if (!control) {
      this.scheduleDeferredControlRecheck(assigned);
    }
  };

  private scheduleDeferredControlRecheck(assigned: Element[]) {
    if (this.recheckScheduled) return;

    this.recheckScheduled = true;
    const waitFor: Promise<unknown>[] = [];

    for (const element of assigned) {
      const localName = element.localName;
      if (localName.includes('-')) {
        waitFor.push(
          customElements.whenDefined(localName).then(() => {
            const updateComplete = (element as unknown as { updateComplete?: Promise<unknown> }).updateComplete;
            return updateComplete && typeof updateComplete.then === 'function' ? updateComplete : undefined;
          }),
        );
        continue;
      }

      const updateComplete = (element as unknown as { updateComplete?: Promise<unknown> }).updateComplete;
      if (updateComplete && typeof updateComplete.then === 'function') {
        waitFor.push(updateComplete);
      }
    }

    if (waitFor.length === 0) {
      this.recheckScheduled = false;
      return;
    }

    Promise.allSettled(waitFor).finally(() => {
      this.recheckScheduled = false;
      this.handleInputSlotChange();
    });
  }

  private syncNestedNteInputClasses(node: Element) {
    if (node.tagName !== 'NTE-INPUT') return;

    const sizeClass = Array.from(this.classList).find((token) => token.startsWith('size-'));
    const modernClassFromClassList = Array.from(this.classList).find(
      (token) => token === 'style-modern' || token === 'modern',
    );
    const modernClass = modernClassFromClassList ?? (this.hasAttribute('modern') ? 'style-modern' : undefined);

    if (sizeClass) {
      node.classList.remove('size-sm', 'size-md', 'size-lg');
      node.classList.add(sizeClass);
    }

    if (modernClass) {
      node.classList.add(modernClass);
    } else {
      node.classList.remove('style-modern', 'modern');
    }
  }

  private applyControlStylesToNestedNteInputs(nodes: Element[]) {
    for (const node of nodes) {
      if (node.tagName === 'NTE-INPUT') {
        (node as unknown as { controlStyleText?: string }).controlStyleText = style;
        this.syncNestedNteInputClasses(node);
      }

      if ('querySelectorAll' in node) {
        node.querySelectorAll('nte-input').forEach((el) => {
          (el as unknown as { controlStyleText?: string }).controlStyleText = style;
          this.syncNestedNteInputClasses(el);
        });
      }
    }
  }

  private findControl(nodes: Element[]): SupportedControl | null {
    for (const node of nodes) {
      if (node instanceof HTMLSlotElement) {
        const nested = this.findControl(node.assignedElements({ flatten: true }));
        if (nested) return nested;
      }

      if (this.isControl(node)) return node as SupportedControl;

      if (node.shadowRoot) {
        // Handle components that expose their control via a slot (e.g., nte-input)
        const slot = node.shadowRoot.querySelector('slot:not([name])') as HTMLSlotElement | null;
        if (slot) {
          const slotted = slot.assignedElements({ flatten: true });
          const nestedFromSlot = this.findControl(slotted);
          if (nestedFromSlot) return nestedFromSlot;
        }

        const shadowControl = node.shadowRoot.querySelector('input, select, textarea');
        if (shadowControl && this.isControl(shadowControl)) {
          return shadowControl as SupportedControl;
        }
      }

      if ('querySelector' in node) {
        const descendant = (node as Element).querySelector('input, select, textarea');
        if (descendant && this.isControl(descendant)) {
          return descendant as SupportedControl;
        }
      }
    }
    return null;
  }

  private isControl(el: Element): el is SupportedControl {
    return el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement;
  }

  private attachToControl(control: SupportedControl | null) {
    this.teardownInputListeners();
    this.inputElement = control;

    if (!control) {
      this.effectiveRequired = this.required;
      this.showInvalid = false;
      this.showValid = false;
      this.isFilled = false;
      return;
    }

    if (!control.id) {
      control.id = this.generatedId;
    } else {
      this.generatedId = control.id;
    }

    this.updateRequiredState();
    this.updateValueState();
    this.updateValidationState();

    control.addEventListener('input', this.handleInputValueChange);
    control.addEventListener('change', this.handleInputValueChange);

    this.mutationObserver = new MutationObserver(() => {
      this.updateRequiredState();
      this.updateValidationState();
    });
    this.mutationObserver.observe(control, {
      attributes: true,
      attributeFilter: ['class', 'aria-invalid', 'required'],
    });

    this.requestUpdate();
  }

  private teardownInputListeners() {
    if (this.inputElement) {
      this.inputElement.removeEventListener('input', this.handleInputValueChange);
      this.inputElement.removeEventListener('change', this.handleInputValueChange);
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = undefined;
    }
  }

  private handleInputValueChange = () => {
    this.updateValueState();
    this.updateValidationState();
  };

  private updateRequiredState() {
    const controlRequired = this.inputElement?.hasAttribute('required') ?? false;
    this.effectiveRequired = this.required || controlRequired;
  }

  private updateValueState() {
    const control = this.inputElement;
    if (!control) {
      this.isFilled = false;
      return;
    }

    if (control instanceof HTMLInputElement && (control.type === 'checkbox' || control.type === 'radio')) {
      this.isFilled = control.checked;
    } else {
      this.isFilled = !!control.value;
    }
  }

  private updateValidationState() {
    const control = this.inputElement;
    const invalid =
      !!control && (control.classList.contains('is-invalid') || control.getAttribute('aria-invalid') === 'true');
    const valid = !!control && control.classList.contains('is-valid');

    this.showInvalid = invalid;
    this.showValid = this.effectiveRequired && valid && !invalid;
  }

  private get controlId() {
    return this.inputElement?.id || this.generatedId;
  }

  private fallbackLabel(): string {
    if (this.label) return this.label;
    const control = this.inputElement;
    if (!control) return '';

    return control.getAttribute('name') || '';
  }

  private renderRequiredIndicator() {
    return this.effectiveRequired ? html`<span class="required-indicator">*</span>` : null;
  }

  private renderHelperText() {
    return this.helperText ? html`<div class="form-text">${this.helperText}</div>` : null;
  }

  private renderInvalid() {
    if (!this.invalidFeedback) return null;
    return html`
      <div class="invalid-feedback" style="display: ${this.showInvalid ? 'block' : 'none'}">
        ${this.invalidFeedback}
      </div>
    `;
  }

  private renderValid() {
    if (!this.validFeedback) return null;
    return html`
      <div class="valid-feedback" style="display: ${this.showValid ? 'block' : 'none'}">${this.validFeedback}</div>
    `;
  }

  private renderCheckLabel() {
    const content = this.hasLabelSlot
      ? html`<slot name="label"></slot>`
      : this.fallbackLabel()
        ? html`${this.fallbackLabel()}`
        : null;

    if (!content) return null;

    return html`
      <label class="form-check-label" for="${this.controlId}"> ${content}${this.renderRequiredIndicator()} </label>
    `;
  }

  private renderStandardLabel() {
    if (this.hasLabelSlot) {
      return html`
        <label class="form-label" for="${this.controlId}">
          <slot name="label"></slot>${this.renderRequiredIndicator()}
        </label>
      `;
    }

    const fallback = this.fallbackLabel();
    if (!fallback) return null;

    return html`
      <label class="form-label" for="${this.controlId}"> ${fallback}${this.renderRequiredIndicator()} </label>
    `;
  }

  private renderFloatingLabel() {
    if (this.hasLabelSlot) {
      return html`
        <label class="form-label" for="${this.controlId}">
          <slot name="label"></slot>${this.renderRequiredIndicator()}
        </label>
      `;
    }

    const fallback = this.fallbackLabel();
    if (!fallback) return null;

    return html`
      <label class="form-label" for="${this.controlId}"> ${fallback}${this.renderRequiredIndicator()} </label>
    `;
  }

  private renderCheck() {
    const classes = classMap({
      'form-check': true,
      'form-switch': this.switchStyle === 'modern',
      'is-invalid': this.showInvalid,
      'is-valid': this.showValid,
    });

    return html`
      <div class="${classes}">
        <slot></slot>
        ${this.renderCheckLabel()} ${this.renderHelperText()} ${this.renderInvalid()} ${this.renderValid()}
      </div>
    `;
  }

  private renderFloatingField() {
    const floatingClasses = classMap({
      'form-floating': true,
      'has-value': this.isFilled,
      'is-invalid': this.showInvalid,
      'is-valid': this.showValid,
    });

    return html`
      <div class="${floatingClasses}">
        <slot></slot>
        ${this.renderFloatingLabel()} ${this.renderHelperText()} ${this.renderInvalid()} ${this.renderValid()}
      </div>
    `;
  }

  private renderField() {
    return html`
      <div class="form-inline">
        ${this.renderStandardLabel()}
        <div class="control-wrapper">
          <slot></slot>
        </div>
        <div class="messages">${this.renderHelperText()} ${this.renderInvalid()} ${this.renderValid()}</div>
      </div>
    `;
  }

  override render() {
    const controlType = this.type || (this.inputElement instanceof HTMLInputElement ? this.inputElement.type : 'text');

    if (controlType === 'checkbox' || controlType === 'radio') {
      return this.renderCheck();
    }

    if (this.floating) {
      return this.renderFloatingField();
    }

    return this.renderField();
  }
}
