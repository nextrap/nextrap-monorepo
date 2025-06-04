import {
  customElement,
  NtSimpleElement,
  property,
  unsafeCSS,
} from '@nextrap/nt-framework';
import style from './hamburger.scss?inline';

const html = `
<div id="wrapper">
  <button id="button" class="hamburger">
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
  </button>
</div>
`;

@customElement('nte-burger')
export class NteBurger extends NtSimpleElement<['wrapper', 'button']> {
  @property({ type: Boolean, attribute: 'open', reflect: true }) open = false;

  constructor() {
    super(html);
  }

  override get css() {
    return unsafeCSS(style);
  }
}
