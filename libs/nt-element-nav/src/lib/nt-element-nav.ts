import {
  customElement,
  isBiggerThanBreakpoint,
  NtElementDefinition,
  NtSimpleElement,
  property,
  unsafeCSS,
} from '@nextrap/framework';
import style from './nav.scss?inline';

// Minimal CSS for the nav element

const html = `
<nav>  
  <slot name="burger" id="burger" class="burger">
    <!-- fallback icon -->
    <nte-burger id="open-burger"></nte-burger>
  </slot>
  <div id="backdrop"></div>
  <div class="nt-nav-links" id="main" part="main">
    <slot class="burger" name="burger" id="burger-header"><nte-burger id="close-burger" open></nte-burger></slot>
    <slot></slot>
  </div>
</nav>
`;

/**
 * <nt-nav>
 *   <span slot="brand">Brand</span>
 *   <a slot="links" href="/">Home</a>
 *   ...
 *   [optionally:] <nte-burger slot="burger"></nte-burger>
 * </nt-nav>
 */
@customElement('nt-nav')
export class NtElementNav extends NtSimpleElement<
  ['main', 'open-burger', 'close-burger', 'backdrop']
> {
  static override DEFINITION: NtElementDefinition = {
    classes: ['align-left', 'align-right', 'align-center'],
    attributes: {},
  };

  @property({ type: String, reflect: true }) mode: 'row' | 'sidebar' =
    'sidebar';
  // Only for mode "sidebar"
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String, reflect: true }) breakpoint: string | number = '';

  constructor() {
    super(html);
    this.$['open-burger'].onclick = () => {
      this.open = true;
    };
    this.$['close-burger'].onclick = () => {
      this.open = false;
    };
    this.$['backdrop'].onclick = () => {
      this.open = false;
    };
  }

  override update(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.update(changedProperties);
    this.$['open-burger'].open = this.open;
  }

  get css() {
    return unsafeCSS(style);
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.breakpoint !== '') {
      if (isBiggerThanBreakpoint(this.breakpoint)) {
        this.mode = 'row';
      }
      window.addEventListener('breakpoint-changed', (event: Event) => {
        if (isBiggerThanBreakpoint(this.breakpoint)) {
          this.mode = 'row';
        } else {
          this.mode = 'sidebar';
        }
      });
    }
  }
}
