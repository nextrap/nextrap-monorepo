import { NtSimpleElement, tpl } from '@nextrap/framework';
import style from './hamburger.scss?inline';
import { unsafeCSS } from '@nextrap/framework';
import { customElement, property } from '@nextrap/framework';


const html = tpl(`
<div id="wrapper">
  <button id="button" class="hamburger">
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
  </button>
</div>
`, ["wrapper", "button"]);



@customElement('nt-burger')
export class NtElementBurger extends NtSimpleElement {

  @property({type: Boolean, attribute: "open", reflect: true}) open = false;

  constructor() {
    super(html);

  }

  override get css() {
    return unsafeCSS(style);
  }

}