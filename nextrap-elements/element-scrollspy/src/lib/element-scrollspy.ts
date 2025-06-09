import { LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './element-scrollspy.scss?inline';

export type NavigationItem = {
  id: string; // The ID of the element to scroll to
  label: string; // The label to display in the navigation
  href?: string; // Optional href for the navigation item
  active?: boolean; // Whether the item is currently active
};

export type ElementConfig = {
  classes?: string[]; // Set Classes directly on the element
  attributes?: {
    dataOwner?: string;
  };
  innerHTML?: string | DocumentFragment; // Set innerHTML directly on the element
  data?: NavigationItem[];
};

@customElement('nte-scrollspy')
export class NtScrollSpyElement extends LitElement {
  static css = [unsafeCSS(style)];

  public constructor(config?: ElementConfig) {
    super();
  }

  static get is() {
    return 'nte-scrollspy';
  }
}
