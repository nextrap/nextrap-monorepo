import { b as _, r as oe, A as Se } from './_virtual_tdemo-client-Pi1VR-d9.js';
import { o as N } from './index-D4PUARzf.js';
import './index-l0sNRNKZ.js';
import { n as ae } from './nextrap-element-CnNsmvMM.js';
import { n as g, t as le } from './property-BLTBoP6p.js';
import { r as j } from './state-CNjn0hWp.js';
const ze =
  '*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;width:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}img,picture,video,canvas,svg{display:block;max-width:100%}input,button,textarea,select{font:inherit;color:inherit;background:none;border:none;outline:none}a,i{color:inherit;text-decoration:none}ul,ol{list-style:none}table{border-collapse:collapse;border-spacing:0}slot{display:contents}:host{--nte-nav-flow: row;--nte-nav-align: stretch;--nte-nav-justify: flex-start;--nte-nav-gap: 0;display:block}#nav{display:block}#list{display:flex;flex-flow:var(--nte-nav-flow) nowrap;align-items:var(--nte-nav-align);justify-content:var(--nte-nav-justify);gap:var(--nte-nav-gap);min-inline-size:0}#list>slot{display:contents}';
var Oe = Object.create,
  R = Object.defineProperty,
  Ie = Object.getOwnPropertyDescriptor,
  ue = (t, e) => ((e = Symbol[t]) ? e : Symbol.for('Symbol.' + t)),
  S = (t) => {
    throw TypeError(t);
  },
  Ce = (t, e, n) => (e in t ? R(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (t[e] = n)),
  ee = (t, e) => R(t, 'name', { value: e, configurable: !0 }),
  Ne = (t) => [, , , Oe((t == null ? void 0 : t[ue('metadata')]) ?? null)],
  de = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  E = (t) => (t !== void 0 && typeof t != 'function' ? S('Function expected') : t),
  Ee = (t, e, n, s, i) => ({
    kind: de[t],
    name: e,
    metadata: s,
    addInitializer: (a) => (n._ ? S('Already initialized') : i.push(E(a || null))),
  }),
  Le = (t, e) => Ce(e, ue('metadata'), t[3]),
  A = (t, e, n, s) => {
    for (var i = 0, a = t[e >> 1], v = a && a.length; i < v; i++) e & 1 ? a[i].call(n) : (s = a[i].call(n, s));
    return s;
  },
  ce = (t, e, n, s, i, a) => {
    var v,
      u,
      O,
      h,
      y,
      r = e & 7,
      k = !!(e & 8),
      c = !!(e & 16),
      w = r > 3 ? t.length + 1 : r ? (k ? 1 : 2) : 0,
      I = de[r + 5],
      C = r > 3 && (t[w - 1] = []),
      D = t[w] || (t[w] = []),
      d =
        r &&
        (!c && !k && (i = i.prototype),
        r < 5 &&
          (r > 3 || !c) &&
          Ie(
            r < 4
              ? i
              : {
                  get [n]() {
                    return te(this, a);
                  },
                  set [n](l) {
                    return ne(this, a, l);
                  },
                },
            n,
          ));
    r ? c && r < 4 && ee(a, (r > 2 ? 'set ' : r > 1 ? 'get ' : '') + n) : ee(i, n);
    for (var $ = s.length - 1; $ >= 0; $--)
      ((h = Ee(r, n, (O = {}), t[3], D)),
        r &&
          ((h.static = k),
          (h.private = c),
          (y = h.access = { has: c ? (l) => Me(i, l) : (l) => n in l }),
          r ^ 3 && (y.get = c ? (l) => (r ^ 1 ? te : Ae)(l, i, r ^ 4 ? a : d.get) : (l) => l[n]),
          r > 2 && (y.set = c ? (l, x) => ne(l, i, x, r ^ 4 ? a : d.set) : (l, x) => (l[n] = x))),
        (u = (0, s[$])(r ? (r < 4 ? (c ? a : d[I]) : r > 4 ? void 0 : { get: d.get, set: d.set }) : i, h)),
        (O._ = 1),
        r ^ 4 || u === void 0
          ? E(u) && (r > 4 ? C.unshift(u) : r ? (c ? (a = u) : (d[I] = u)) : (i = u))
          : typeof u != 'object' || u === null
            ? S('Object expected')
            : (E((v = u.get)) && (d.get = v), E((v = u.set)) && (d.set = v), E((v = u.init)) && C.unshift(v)));
    return (r || Le(t, i), d && R(i, n, d), c ? (r ^ 4 ? a : d) : i);
  },
  B = (t, e, n) => e.has(t) || S('Cannot ' + n),
  Me = (t, e) => (Object(e) !== e ? S('Cannot use the "in" operator on this value') : t.has(e)),
  te = (t, e, n) => (B(t, e, 'read from private field'), n ? n.call(t) : e.get(t)),
  De = (t, e, n) =>
    e.has(t) ? S('Cannot add the same private member more than once') : e instanceof WeakSet ? e.add(t) : e.set(t, n),
  ne = (t, e, n, s) => (B(t, e, 'write to private field'), s ? s.call(t, n) : e.set(t, n), n),
  Ae = (t, e, n) => (B(t, e, 'access private method'), n),
  pe,
  T,
  ve,
  P,
  F;
ve = [le('nte-nav-2')];
class M extends ((T = ae()), (pe = [g({ type: String, reflect: !0, attribute: 'aria-label' })]), T) {
  constructor() {
    (super(...arguments), De(this, F, A(P, 8, this, '')), A(P, 11, this));
  }
  render() {
    return _`
      <nav id="nav" part="nav" aria-label=${N(this.ariaLabel || void 0)}>
        <div id="list" part="list" role="list">
          <slot></slot>
        </div>
      </nav>
    `;
  }
}
P = Ne(T);
F = new WeakMap();
ce(P, 4, 'ariaLabel', pe, M, F);
M = ce(P, 0, 'NteNav2', ve, M);
M.styles = [oe(ze)];
A(P, 1, M);
const Te =
  '*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;width:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}img,picture,video,canvas,svg{display:block;max-width:100%}input,button,textarea,select{font:inherit;color:inherit;background:none;border:none;outline:none}a,i{color:inherit;text-decoration:none}ul,ol{list-style:none}table{border-collapse:collapse;border-spacing:0}slot{display:contents}:host{--nte-nav-item-order: 0;--nte-nav-item-gap: .5rem;--nte-nav-submenu-gap: .25rem;--nte-nav-submenu-min-inline-size: 12rem;--nte-nav-submenu-inline-size: max(100%, var(--nte-nav-submenu-min-inline-size));--nte-nav-submenu-max-block-size: min(70vh, 32rem);--nte-nav-submenu-position: absolute;--nte-nav-submenu-inset-block-start: 100%;--nte-nav-submenu-inset-inline-start: 0;--nte-nav-nested-submenu-inset-block-start: 0;--nte-nav-nested-submenu-inset-inline-start: 100%;--nte-nav-submenu-position-area: block-end span-inline-end;--nte-nav-nested-submenu-position-area: inline-end span-block-end;--nte-nav-submenu-enter-transform: translateY(-.35rem);--nte-nav-nested-submenu-enter-transform: translateX(-.35rem);--nte-nav-transition-duration: .16s;display:block;position:relative;order:var(--nte-nav-item-order);min-inline-size:0}#link,#text,#disclosure,#toggle{display:flex;align-items:center}#item{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:stretch;min-block-size:100%}#details{display:contents}#link,#text,#disclosure{flex:1 1 auto;min-inline-size:0;gap:var(--nte-nav-item-gap)}#link,#text,#disclosure{grid-column:1/-1;grid-row:1}#item:has(#toggle)>#link{grid-column:1}#toggle{grid-column:2;grid-row:1;flex:0 0 auto;justify-content:center}#disclosure,#toggle{anchor-name:--nte-nav-submenu-anchor;list-style:none}#disclosure::-webkit-details-marker,#toggle::-webkit-details-marker{display:none}#icon:has(>slot.slot-empty){display:none!important}#icon,#indicator{flex:0 0 auto}#indicator{inline-size:1em;block-size:1em;transition:transform var(--nte-nav-transition-duration) ease}#details[open] #indicator{transform:rotate(180deg)}#submenu{z-index:10;display:grid;grid-column:1/-1;grid-row:2;grid-template-rows:0fr;inline-size:var(--nte-nav-submenu-inline-size);min-inline-size:var(--nte-nav-submenu-min-inline-size);max-block-size:var(--nte-nav-submenu-max-block-size);margin:0;padding:0;overflow:hidden;position:var(--nte-nav-submenu-position);inset-block-start:var(--nte-nav-submenu-inset-block-start);inset-inline-start:var(--nte-nav-submenu-inset-inline-start);opacity:0;transform:var(--nte-nav-submenu-enter-transform);visibility:hidden;pointer-events:none;transition:grid-template-rows var(--nte-nav-transition-duration) ease,opacity var(--nte-nav-transition-duration) ease,transform var(--nte-nav-transition-duration) ease,visibility var(--nte-nav-transition-duration) allow-discrete}#details[open] #submenu{grid-template-rows:1fr;margin-block-start:var(--nte-nav-submenu-gap);opacity:1;transform:none;visibility:visible;pointer-events:auto}#submenu[popover]{inline-size:max-content;max-inline-size:calc(100vw - 2rem);margin:var(--nte-nav-submenu-gap) 0 0;overflow:hidden;position:fixed;position-anchor:--nte-nav-submenu-anchor;position-area:var(--nte-nav-submenu-position-area);position-try-fallbacks:flip-block,flip-inline;inset:auto;transition:opacity var(--nte-nav-transition-duration) ease,transform var(--nte-nav-transition-duration) ease,display var(--nte-nav-transition-duration) allow-discrete,overlay var(--nte-nav-transition-duration) allow-discrete}@supports (inline-size: anchor-size(inline)){#submenu[popover]{inline-size:max(anchor-size(inline),var(--nte-nav-submenu-min-inline-size))}}#submenu[popover]:not(:popover-open){display:none}#submenu[popover]:popover-open{display:grid;opacity:1;transform:none;visibility:visible;pointer-events:auto}@starting-style{#submenu[popover]:popover-open{opacity:0;transform:var(--nte-nav-submenu-enter-transform)}}#submenu-inner{min-block-size:0;overflow:auto}#submenu slot{display:flex;flex-direction:column;align-items:stretch}#submenu slot::slotted(nte-nav-item){--nte-nav-submenu-inset-block-start: var(--nte-nav-nested-submenu-inset-block-start);--nte-nav-submenu-inset-inline-start: var(--nte-nav-nested-submenu-inset-inline-start);--nte-nav-submenu-position-area: var(--nte-nav-nested-submenu-position-area);--nte-nav-submenu-enter-transform: var(--nte-nav-nested-submenu-enter-transform)}@media(prefers-reduced-motion:reduce){#indicator,#submenu{transition-duration:.01ms}}';
var We = Object.create,
  H = Object.defineProperty,
  Re = Object.getOwnPropertyDescriptor,
  me = (t, e) => ((e = Symbol[t]) ? e : Symbol.for('Symbol.' + t)),
  z = (t) => {
    throw TypeError(t);
  },
  Be = (t, e, n) => (e in t ? H(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (t[e] = n)),
  ie = (t, e) => H(t, 'name', { value: e, configurable: !0 }),
  Fe = (t) => [, , , We((t == null ? void 0 : t[me('metadata')]) ?? null)],
  he = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  L = (t) => (t !== void 0 && typeof t != 'function' ? z('Function expected') : t),
  He = (t, e, n, s, i) => ({
    kind: he[t],
    name: e,
    metadata: s,
    addInitializer: (a) => (n._ ? z('Already initialized') : i.push(L(a || null))),
  }),
  qe = (t, e) => Be(e, me('metadata'), t[3]),
  p = (t, e, n, s) => {
    for (var i = 0, a = t[e >> 1], v = a && a.length; i < v; i++) e & 1 ? a[i].call(n) : (s = a[i].call(n, s));
    return s;
  },
  b = (t, e, n, s, i, a) => {
    var v,
      u,
      O,
      h,
      y,
      r = e & 7,
      k = !!(e & 8),
      c = !!(e & 16),
      w = r > 3 ? t.length + 1 : r ? (k ? 1 : 2) : 0,
      I = he[r + 5],
      C = r > 3 && (t[w - 1] = []),
      D = t[w] || (t[w] = []),
      d =
        r &&
        (!c && !k && (i = i.prototype),
        r < 5 &&
          (r > 3 || !c) &&
          Re(
            r < 4
              ? i
              : {
                  get [n]() {
                    return re(this, a);
                  },
                  set [n](l) {
                    return se(this, a, l);
                  },
                },
            n,
          ));
    r ? c && r < 4 && ie(a, (r > 2 ? 'set ' : r > 1 ? 'get ' : '') + n) : ie(i, n);
    for (var $ = s.length - 1; $ >= 0; $--)
      ((h = He(r, n, (O = {}), t[3], D)),
        r &&
          ((h.static = k),
          (h.private = c),
          (y = h.access = { has: c ? (l) => Ge(i, l) : (l) => n in l }),
          r ^ 3 && (y.get = c ? (l) => (r ^ 1 ? re : Ue)(l, i, r ^ 4 ? a : d.get) : (l) => l[n]),
          r > 2 && (y.set = c ? (l, x) => se(l, i, x, r ^ 4 ? a : d.set) : (l, x) => (l[n] = x))),
        (u = (0, s[$])(r ? (r < 4 ? (c ? a : d[I]) : r > 4 ? void 0 : { get: d.get, set: d.set }) : i, h)),
        (O._ = 1),
        r ^ 4 || u === void 0
          ? L(u) && (r > 4 ? C.unshift(u) : r ? (c ? (a = u) : (d[I] = u)) : (i = u))
          : typeof u != 'object' || u === null
            ? z('Object expected')
            : (L((v = u.get)) && (d.get = v), L((v = u.set)) && (d.set = v), L((v = u.init)) && C.unshift(v)));
    return (r || qe(t, i), d && H(i, n, d), c ? (r ^ 4 ? a : d) : i);
  },
  q = (t, e, n) => e.has(t) || z('Cannot ' + n),
  Ge = (t, e) => (Object(e) !== e ? z('Cannot use the "in" operator on this value') : t.has(e)),
  re = (t, e, n) => (q(t, e, 'read from private field'), n ? n.call(t) : e.get(t)),
  f = (t, e, n) =>
    e.has(t) ? z('Cannot add the same private member more than once') : e instanceof WeakSet ? e.add(t) : e.set(t, n),
  se = (t, e, n, s) => (q(t, e, 'write to private field'), s ? s.call(t, n) : e.set(t, n), n),
  Ue = (t, e, n) => (q(t, e, 'access private method'), n),
  _e,
  be,
  fe,
  ge,
  ye,
  ke,
  we,
  $e,
  xe,
  W,
  Pe,
  o,
  G,
  U,
  V,
  X,
  Y,
  J,
  K,
  Q,
  Z;
Pe = [le('nte-nav-item')];
class m extends ((W = ae({ slotVisibility: !0 })),
(xe = [g({ type: String, reflect: !0 })]),
($e = [g({ type: String, reflect: !0 })]),
(we = [g({ type: String, reflect: !0 })]),
(ke = [g({ type: String, reflect: !0 })]),
(ye = [g({ type: String, reflect: !0 })]),
(ge = [g({ type: Number, reflect: !0 })]),
(fe = [g({ type: String, attribute: 'submenu-label' })]),
(be = [j()]),
(_e = [j()]),
W) {
  constructor() {
    (super(...arguments),
      (this._presentationObserver = void 0),
      (this._lastInlinePresentation = void 0),
      (this._preserveDetailsOnPopoverClose = !1),
      f(this, G, p(o, 8, this, '')),
      p(o, 11, this),
      f(this, U, p(o, 12, this, '')),
      p(o, 15, this),
      f(this, V, p(o, 16, this, '')),
      p(o, 19, this),
      f(this, X, p(o, 20, this, '')),
      p(o, 23, this),
      f(this, Y, p(o, 24, this, '')),
      p(o, 27, this),
      f(this, J, p(o, 28, this)),
      p(o, 31, this),
      f(this, K, p(o, 32, this, 'Untermenü')),
      p(o, 35, this),
      f(this, Q, p(o, 36, this, !1)),
      p(o, 39, this),
      f(this, Z, p(o, 40, this, '')),
      p(o, 43, this));
  }
  connectedCallback() {
    (super.connectedCallback(),
      this.hasAttribute('role') || this.setAttribute('role', 'listitem'),
      this._assignNestedItems(),
      this.hasUpdated && queueMicrotask(() => this._startPresentationObserver()));
  }
  disconnectedCallback() {
    var e;
    ((e = this._presentationObserver) == null || e.disconnect(), super.disconnectedCallback());
  }
  updated(e) {
    (super.updated(e),
      this._presentationObserver || this._startPresentationObserver(),
      e.has('order') &&
        (this.order === void 0 || Number.isNaN(this.order)
          ? this.style.removeProperty('order')
          : (this.style.order = String(this.order))));
  }
  render() {
    const e = this._renderLabel();
    return _`
      <div id="item" part="item">
        ${
          this._hasSubmenu
            ? _`
                ${this.href ? this._renderLink(e) : Se}
                <details id="details" part="details">
                  ${this.href ? this._renderIconOnlyDisclosure() : this._renderLabelDisclosure(e)}
                  ${this._renderSubmenu()}
                </details>
              `
            : this.href
              ? this._renderLink(e)
              : _`<span id="text" part="text">${e}</span>`
        }
      </div>
    `;
  }
  _renderLink(e) {
    return _`
      <a
        id="link"
        part="link"
        href=${this.href}
        target=${N(this.target || void 0)}
        rel=${N(this.rel || void 0)}
        download=${N(this.hasAttribute('download') ? this.download : void 0)}
        aria-current=${N(this.current || void 0)}
      >
        ${e}
      </a>
    `;
  }
  _renderLabel() {
    return _`
      <span id="icon" part="icon">
        <slot name="icon"></slot>
      </span>
      <span id="label" part="label">
        <slot @slotchange=${this._onLabelSlotChange}></slot>
      </span>
    `;
  }
  _renderIconOnlyDisclosure() {
    return _`
      <summary
        id="toggle"
        part="toggle"
        aria-label=${this._submenuAccessibleName()}
        @click=${this._onDisclosureClick}
      >
        ${this._renderIndicator()}
      </summary>
    `;
  }
  _renderLabelDisclosure(e) {
    return _`<summary id="disclosure" part="disclosure" @click=${this._onDisclosureClick}>${e} ${this._renderIndicator()}</summary>`;
  }
  _renderSubmenu() {
    return _`
      <div
        id="submenu"
        part="submenu"
        role="list"
        aria-label=${this._submenuAccessibleName()}
        @toggle=${this._onPopoverToggle}
      >
        <div id="submenu-inner" part="submenu-inner">
          <slot name="submenu" @slotchange=${this._onSubmenuSlotChange}></slot>
        </div>
      </div>
    `;
  }
  _renderIndicator() {
    return _`
      <svg id="indicator" part="indicator" aria-hidden="true" viewBox="0 0 16 16">
        <path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
      </svg>
    `;
  }
  _submenuAccessibleName() {
    return this._labelText ? `${this.submenuLabel}: ${this._labelText}` : this.submenuLabel;
  }
  _onLabelSlotChange(e) {
    const s = e.currentTarget.assignedNodes({ flatten: !0 });
    (this._assignNestedItems(),
      (this._labelText = s
        .filter((i) => !(i instanceof HTMLElement && i.matches('nte-nav-item')))
        .map((i) => {
          var a;
          return ((a = i.textContent) == null ? void 0 : a.trim()) ?? '';
        })
        .filter(Boolean)
        .join(' ')));
  }
  _onSubmenuSlotChange(e) {
    const n = e.currentTarget;
    this._hasSubmenu = n.assignedElements({ flatten: !0 }).some((s) => s.matches('nte-nav-item'));
  }
  _onDisclosureClick(e) {
    const n = this._submenuElement();
    if (n) {
      if (this._usesInlinePresentation()) {
        n.removeAttribute('popover');
        return;
      }
      if (this._supportsPopover(n)) {
        if ((e.preventDefault(), this._isPopoverOpen(n))) {
          n.hidePopover();
          return;
        }
        this._showPopover(n, e.currentTarget);
      }
    }
  }
  _onPopoverToggle(e) {
    var a;
    if (e.newState !== 'closed') return;
    const s = e.currentTarget,
      i = (a = this.shadowRoot) == null ? void 0 : a.getElementById('details');
    if ((s.removeAttribute('popover'), this._preserveDetailsOnPopoverClose)) {
      ((this._preserveDetailsOnPopoverClose = !1), i && (i.open = !0));
      return;
    }
    i && (i.open = !1);
  }
  _startPresentationObserver() {
    !this.isConnected ||
      typeof ResizeObserver > 'u' ||
      (this._presentationObserver ??
        (this._presentationObserver = new ResizeObserver(() => this._syncSubmenuPresentation())),
      this._presentationObserver.disconnect(),
      this._presentationObserver.observe(this),
      this._presentationObserver.observe(document.documentElement),
      this._syncSubmenuPresentation());
  }
  _syncSubmenuPresentation() {
    var i;
    const e = this._usesInlinePresentation();
    if (e === this._lastInlinePresentation) return;
    this._lastInlinePresentation = e;
    const n = this._submenuElement(),
      s = (i = this.shadowRoot) == null ? void 0 : i.getElementById('details');
    if (!(!n || !s)) {
      if (e) {
        this._supportsPopover(n) && this._isPopoverOpen(n)
          ? ((this._preserveDetailsOnPopoverClose = s.open), n.hidePopover())
          : n.removeAttribute('popover');
        return;
      }
      this._supportsPopover(n) && s.open && this._showPopover(n);
    }
  }
  _showPopover(e, n = this._disclosureElement()) {
    var i;
    const s = (i = this.shadowRoot) == null ? void 0 : i.getElementById('details');
    if (!(!s || !this._supportsPopover(e))) {
      ((s.open = !0), e.setAttribute('popover', 'auto'));
      try {
        e.showPopover({ source: n ?? void 0 });
      } catch {
        e.removeAttribute('popover');
      }
    }
  }
  _usesInlinePresentation() {
    return getComputedStyle(this).getPropertyValue('--nte-nav-submenu-position').trim() === 'static';
  }
  _submenuElement() {
    var e;
    return ((e = this.shadowRoot) == null ? void 0 : e.getElementById('submenu')) ?? null;
  }
  _disclosureElement() {
    var e;
    return ((e = this.shadowRoot) == null ? void 0 : e.querySelector('#toggle, #disclosure')) ?? null;
  }
  _supportsPopover(e) {
    return typeof e.showPopover == 'function' && typeof e.hidePopover == 'function';
  }
  _isPopoverOpen(e) {
    try {
      return e.matches(':popover-open');
    } catch {
      return !1;
    }
  }
  _assignNestedItems() {
    const e = Array.from(this.children).filter((n) => n.matches('nte-nav-item'));
    (e.forEach((n) => n.setAttribute('slot', 'submenu')), (this._hasSubmenu = e.length > 0));
  }
}
o = Fe(W);
G = new WeakMap();
U = new WeakMap();
V = new WeakMap();
X = new WeakMap();
Y = new WeakMap();
J = new WeakMap();
K = new WeakMap();
Q = new WeakMap();
Z = new WeakMap();
b(o, 4, 'href', xe, m, G);
b(o, 4, 'target', $e, m, U);
b(o, 4, 'rel', we, m, V);
b(o, 4, 'download', ke, m, X);
b(o, 4, 'current', ye, m, Y);
b(o, 4, 'order', ge, m, J);
b(o, 4, 'submenuLabel', fe, m, K);
b(o, 4, '_hasSubmenu', be, m, Q);
b(o, 4, '_labelText', _e, m, Z);
m = b(o, 0, 'NteNavItem', Pe, m);
m.styles = [oe(Te)];
p(o, 1, m);
function Ze(t, e) {
  var i;
  const n = new DOMParser().parseFromString(e, 'text/html'),
    s = document.createElement('div');
  ((s.className = 'nte-nav-2-demo'),
    (s.innerHTML = ((i = n.querySelector('main')) == null ? void 0 : i.outerHTML) ?? n.body.innerHTML),
    t.replaceChildren(s));
}
export { Ze as r };
