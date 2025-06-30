import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleFormGroup } from './style-form-group';

@customElement('nxa-form-group')
export class NxaFormGroup extends LitElement {
  static override styles = styleFormGroup;

  @property({ type: Number }) gap = 1;
  @property() alignItems: 'start' | 'center' | 'end' | 'stretch' = 'stretch';
  @property() cols = '1-2-3'; // Format: "sm-md-lg" e.g., "1-2-3" means 1 column on small, 2 on medium, 3 on large

  override render() {
    return html`
      <div
        class="form-group"
        style="
                    --gap: ${this.gap}rem;
                    --align-items: ${this.alignItems};
                    --cols-sm: ${this.cols.split('-')[0] || 1};
                    --cols-md: ${this.cols.split('-')[1] ||
        this.cols.split('-')[0] ||
        1};
                    --cols-lg: ${this.cols.split('-')[2] ||
        this.cols.split('-')[1] ||
        this.cols.split('-')[0] ||
        1};
                "
      >
        <slot></slot>
      </div>
    `;
  }
}
