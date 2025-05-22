import { NtSimpleElement } from '@nextrap/framework';
import style from './hamburger.scss?inline';
import { unsafeCSS } from '@nextrap/framework';
import { customElement, property } from '@nextrap/framework';


const html = `
<div id="wrapper">
  <button id="button" class="hamburger">
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
  </button>
</div>
`;



@customElement('nt-burger')
export class NtElementBurger extends NtSimpleElement<["wrapper", "button"]> {

  @property({type: Boolean, attribute: "open", reflect: true}) open = false;

  constructor() {
    super(html);
  }

  override get css() {
    return unsafeCSS(style);
  }

}