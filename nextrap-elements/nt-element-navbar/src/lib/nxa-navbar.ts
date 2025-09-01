import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleHamburger } from '../../../nt-element-burger/src/lib/hamburger.scss?inline';
import { styleNavbar } from './style-navbar.scss?inline';

type NavbarSlot = 'left' | 'center' | 'right';

type NavbarConfig = {
  style: 'fixed' | 'default';
  stickyOnScroll?: boolean;
  hideOnScroll?: boolean;
  hideThreshold?: number;
  showOnScrollUp?: boolean;
  hideTopbarOnScroll?: boolean;
  alwaysShowMobileNav?: boolean;
  hamburgerPosition?: 'left' | 'middle' | 'right';
  menuDirection?: 'left' | 'right';
  slotInMenu?: NavbarSlot;
  overlapNextElement?: boolean;
  spanLeftSlot?: boolean;
};

const defaultConfig: NavbarConfig = {
  style: 'default',
  stickyOnScroll: false,
  hideOnScroll: false,
  hideThreshold: 100,
  showOnScrollUp: true,
  hideTopbarOnScroll: false,
  alwaysShowMobileNav: false,
  hamburgerPosition: 'right',
  menuDirection: 'right',
  slotInMenu: 'center',
  overlapNextElement: false,
  spanLeftSlot: false,
};

@customElement('nxa-navbar')
export class NxaNavbar extends LitElement {
  private _config: NavbarConfig = defaultConfig;
  private lastScrollTop = 0;
  @state()
  private _menuOpen = false;
  @state()
  private _isScrolling = false;

  @property({ type: Object })
  get config(): NavbarConfig {
    return this._config;
  }

  set config(value: Partial<NavbarConfig>) {
    const mergedConfig = { ...defaultConfig, ...value };
    const oldValue = this._config;
    this._config = mergedConfig;
    this.requestUpdate('config', oldValue);
    if (this._config.stickyOnScroll) {
      this.setupScrollListener();
    }
  }

  @property({ type: String })
  get scrollContainerSelector(): HTMLElement | Window {
    return this.scrollContainer;
  }

  set scrollContainerSelector(value: string) {
    const scrollContainer = document.querySelector(value);
    if (scrollContainer) {
      this.scrollContainer = scrollContainer as HTMLElement;
    } else {
      console.error('Scroll container not found', value);
    }
  }

  static styles = [styleNavbar, styleHamburger];

  private scrollListener: () => void;
  private scrollContainer: HTMLElement | Window = window; // necessary for fullscreen preview

  constructor() {
    super();
    this.scrollListener = this.handleScroll.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.parseDataConfig();
    if (this.config.stickyOnScroll) {
      this.setupScrollListener();
    }
    this.injectGlobalStyles();
    this.applyMissingClasses();
  }

  disconnectedCallback() {
    this.scrollContainer.removeEventListener('scroll', this.scrollListener);

    super.disconnectedCallback();
  }

  setupScrollListener() {
    this.scrollContainer.addEventListener('scroll', this.scrollListener);
  }

  parseDataConfig() {
    const dataConfig = this.getAttribute('data-config');
    if (dataConfig) {
      try {
        const parsedConfig = JSON.parse(dataConfig);
        this.config = parsedConfig;
      } catch (e) {
        console.error('Invalid JSON in data-config attribute', e);
      }
    }
  }

  handleScroll() {
    const rect = this.getBoundingClientRect();
    const scrollTop = this.scrollContainer instanceof Window ? window.scrollY : this.scrollContainer.scrollTop;

    if (this.config.stickyOnScroll) {
      if (rect.top <= 0) {
        this.shadowRoot.querySelector('#nxa-navbar-header').classList.add('fixed');
        this._isScrolling = true;
      } else {
        this.shadowRoot.querySelector('#nxa-navbar-header').classList.remove('fixed');
        this._isScrolling = false;
      }
    }

    if (this.config.hideOnScroll) {
      if (scrollTop > this.lastScrollTop && scrollTop > this.config.hideThreshold) {
        if (rect.top <= 0) {
          this.shadowRoot.querySelector('#nxa-navbar-header').classList.add('hidden');
        }
      } else {
        if (this.config.showOnScrollUp) {
          this.shadowRoot.querySelector('#nxa-navbar-header').classList.remove('hidden');
        }
      }
    }

    if (this.config.hideTopbarOnScroll) {
      if (scrollTop > this.lastScrollTop && scrollTop > this.config.hideThreshold) {
        if (rect.top <= 0) {
          this.shadowRoot.querySelector('#nxa-navbar-topbar').classList.add('hidden');
        }
      } else {
        if (rect.top >= 0) {
          this.shadowRoot.querySelector('#nxa-navbar-topbar').classList.remove('hidden');
        }
      }
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  }

  toggleMenu() {
    this._menuOpen = !this._menuOpen;
    const menu = this.shadowRoot.querySelector('.menu');
    const hamburger = this.shadowRoot.querySelector('.hamburger');
    if (this._menuOpen) {
      menu.classList.add('open');
      hamburger.classList.add('open');
    } else {
      menu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  }

  applyMissingClasses() {
    const slots = ['left', 'center', 'right'];
    slots.forEach((slot) => {
      const slotElement = this.querySelector(`nav[slot="${slot}"]`);

      if (slotElement) {
        if (!slotElement.classList.contains('nxa-navigation')) {
          slotElement.classList.add('nxa-navigation');
        }
      }
    });
  }

  #renderHamburger() {
    const { alwaysShowMobileNav } = this.config;

    const classes = alwaysShowMobileNav ? 'always-visible' : '';

    return html`
      <button class="hamburger ${classes}" @click="${this.toggleMenu}">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </button>
    `;
  }

  #renderSlot(slot: NavbarSlot) {
    const { hamburgerPosition, slotInMenu, alwaysShowMobileNav } = this.config;

    const hamburger = html`${hamburgerPosition === slot ? this.#renderHamburger() : ''}`;

    const scrollingContentOrDefault = html`${this._isScrolling && this.querySelector(`[slot="scroll-${slot}"]`)
      ? html`<slot name="scroll-${slot}"></slot>`
      : html`<slot name="${slot}"></slot>`}`;

    const slotContent = html`${slotInMenu === slot && (this._menuOpen || alwaysShowMobileNav)
      ? html``
      : html` ${scrollingContentOrDefault} `}`;

    return html`${hamburger} ${slotContent}`;
  }

  #renderTopbar() {
    return html`${this.querySelector('[slot="topbar"]')
      ? html`<div id="nxa-navbar-topbar" class="topbar">
          <slot name="topbar"></slot>
        </div>`
      : ``}`;
  }

  #renderBottombar() {
    return html`${this.querySelector('[slot="bottombar"]')
      ? html`<div id="nxa-navbar-bottombar" class="bottombar">
          <slot name="bottombar"></slot>
        </div>`
      : ``}`;
  }

  #renderMenu() {
    const { alwaysShowMobileNav, menuDirection, slotInMenu } = this.config;
    return html`<div class="menu ${menuDirection}">
        <button class="menu-btn-close" @click="${this.toggleMenu}">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </button>
        ${slotInMenu === 'left' && (this._menuOpen || alwaysShowMobileNav) ? html`<slot name="left"></slot>` : ''}
        ${slotInMenu === 'center' && (this._menuOpen || alwaysShowMobileNav) ? html`<slot name="center"></slot>` : ''}
        ${slotInMenu === 'right' && (this._menuOpen || alwaysShowMobileNav) ? html`<slot name="right"></slot>` : ''}
      </div>
      <div class="menu-overlay" @click="${this.toggleMenu}"></div>`;
  }

  injectGlobalStyles() {
    if (document.getElementById(`nxa-navbar-style`)) {
      return;
    }
    const style = document.createElement('style');
    style.textContent = styleLightDom;
    style.id = `nxa-navbar-style`;

    document.head.appendChild(style);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('_isScrolling')) {
      this.classList.toggle('nxa-navbar--scrolling', this._isScrolling);
    }
  }

  render() {
    const { style, overlapNextElement, spanLeftSlot } = this.config;

    let headerStyle = style;
    if (overlapNextElement) {
      headerStyle += ' overlap';
    }
    if (spanLeftSlot) {
      headerStyle += ' span-slot--left';
    }

    return html`
      <header id="nxa-navbar-header" class="header ${headerStyle} ">
        ${this.#renderTopbar()}

        <div id="nxa-navbar-main" class="main">
          ${this.#renderSlot('left')} ${this.#renderSlot('center')} ${this.#renderSlot('right')}
        </div>
        ${this.#renderBottombar()} ${this.#renderMenu()}
      </header>
    `;
  }
}
