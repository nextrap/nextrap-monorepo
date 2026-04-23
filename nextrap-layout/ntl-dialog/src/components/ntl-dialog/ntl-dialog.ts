import { NteModalComponentWrapper } from '@nextrap/nte-dialog';
import { nextrap_layout, NtlFeatures } from '@nextrap/ntl-core';
import { Listen } from '@trunkjs/browser-utils';
import { html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

// Styles for the light DOM
import { resetStyle } from '@nextrap/style-reset';

// Styles for your component's shadow DOM
import style from './ntl-dialog.scss?inline';

// use nextrap_element for pure elements

const features: NtlFeatures = {
  breakpoints: true, // Enables responsive design features
  subLayoutApply: true, // For NTL only: Enable <slot data-query= support for sub-layouts
  slotVisibility: false, // quick fix for marking empty slots (unless CSS Standard supports :empty for slots)
  eventBinding: true, // Switch event binding using @Listen decorators
};

@customElement('ntl-dialog')
export class NtlDialogElement extends NteModalComponentWrapper(nextrap_layout(features)) {
  static override styles = [unsafeCSS(style), unsafeCSS(resetStyle)];

  constructor() {
    super();
    this.dialogClass = ['dialog-fullsize', 'dialog-floating-header'];
  }

  // Example of listening to window scroll events
  @Listen('click', { target: 'window', options: { passive: true } })
  private onScroll(e: Event) {
    this.debug('Click event', e);
  }

  @Listen('cancel', { target: 'host' })
  private onClode(e: Event) {
    if (this.templateContent) {
      this.debug('Removing template content');
      this.removeChild(this.templateContent);
    }
  }

  private templateContent: any = null;

  override open() {
    super.open();

    // Check for Template
    const template = this.querySelector('template');
    if (template) {
      const content = (this.templateContent = template.content.cloneNode(true));
      this.appendChild(content);
    }
  }

  override render() {
    return super.wrap(html`
      <slot slot="title" name="title" data-query=":scope > h1, :scope > h2, :scope > h3, :scope > h4"></slot>
      <slot></slot>
      <slot slot="footer" name="footer" data-query=":scope > .footer"></slot>
    `);
  }

  override firstUpdated(changedProperties: Map<string, unknown>) {
    super.firstUpdated(changedProperties);
  }
}
