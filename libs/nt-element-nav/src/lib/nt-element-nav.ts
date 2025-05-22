import { NtSimpleElement } from '@nextrap/framework';
import { unsafeCSS } from '@nextrap/framework';
import { customElement, property } from '@nextrap/framework';
import style from './nav.scss?inline';

// Minimal CSS for the nav element

const html = `
<nav>  
  <slot name="burger" id="burger" class="burger">
    <!-- fallback icon -->
    <nt-burger id="open-burger"></nt-burger>
  </slot>
  <div id="backdrop"></div>
  <div class="nt-nav-links" id="main">
    <slot class="burger" name="burger"><nt-burger id="close-burger" open></nt-burger></slot>
    <slot></slot>
  </div>
</nav>
`;

/**
 * <nt-nav>
 *   <span slot="brand">Brand</span>
 *   <a slot="links" href="/">Home</a>
 *   ...
 *   [optionally:] <nt-burger slot="burger"></nt-burger>
 * </nt-nav>
 */
@customElement('nt-nav')
export class NtElementNav extends NtSimpleElement< ['main', 'open-burger', 'close-burger', 'backdrop'] > {
  @property({ type: String, reflect: true }) mode : "row" | "sidebar" = "sidebar";
  // Only for mode "sidebar"
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String, reflect: true }) breakpoint = '700px';

  constructor() {
    super(html);
    this.$["open-burger"].onclick = () => {
      this.open = true;
    }
    this.$['close-burger'].onclick = () => {
      this.open = false;
    }
    this.$['backdrop'].onclick = () => {
      this.open = false;
    }
  }

  get css() {
    return unsafeCSS(style);
  }

}

