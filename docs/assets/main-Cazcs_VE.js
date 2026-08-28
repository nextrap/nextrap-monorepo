import { A as Ce, r as de, b as g } from './_virtual_tdemo-client-8tx_scwF.js';
import { r as A, a as f, o as L, t as le, n as oe } from './index-D64-0tiN.js';
const Ie =
  '*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;width:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}img,picture,video,canvas,svg{display:block;max-width:100%}input,button,textarea,select{font:inherit;color:inherit;background:none;border:none;outline:none}a,i{color:inherit;text-decoration:none}ul,ol{list-style:none}table{border-collapse:collapse;border-spacing:0}slot{display:contents}:host{--nte-nav-flow: row;--nte-nav-align: stretch;--nte-nav-justify: flex-start;--nte-nav-gap: 0;display:block}#nav{display:block}#list{display:flex;flex-flow:var(--nte-nav-flow) nowrap;align-items:var(--nte-nav-align);justify-content:var(--nte-nav-justify);gap:var(--nte-nav-gap);min-inline-size:0}#list>slot{display:contents}';
var Me = Object.create,
  H = Object.defineProperty,
  Le = Object.getOwnPropertyDescriptor,
  ce = (e, t) => ((t = Symbol[e]) ? t : Symbol.for('Symbol.' + e)),
  N = (e) => {
    throw TypeError(e);
  },
  Oe = (e, t, n) => (t in e ? H(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n)),
  te = (e, t) => H(e, 'name', { value: t, configurable: !0 }),
  Te = (e) => [, , , Me((e == null ? void 0 : e[ce('metadata')]) ?? null)],
  ue = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  O = (e) => (e !== void 0 && typeof e != 'function' ? N('Function expected') : e),
  Ee = (e, t, n, a, i) => ({
    kind: ue[e],
    name: t,
    metadata: a,
    addInitializer: (s) => (n._ ? N('Already initialized') : i.push(O(s || null))),
  }),
  We = (e, t) => Oe(t, ce('metadata'), e[3]),
  D = (e, t, n, a) => {
    for (var i = 0, s = e[t >> 1], h = s && s.length; i < h; i++) t & 1 ? s[i].call(n) : (a = s[i].call(n, a));
    return a;
  },
  pe = (e, t, n, a, i, s) => {
    var h,
      d,
      C,
      _,
      y,
      r = t & 7,
      w = !!(t & 8),
      u = !!(t & 16),
      k = r > 3 ? e.length + 1 : r ? (w ? 1 : 2) : 0,
      I = ue[r + 5],
      M = r > 3 && (e[k - 1] = []),
      W = e[k] || (e[k] = []),
      c =
        r &&
        (!u && !w && (i = i.prototype),
        r < 5 &&
          (r > 3 || !u) &&
          Le(
            r < 4
              ? i
              : {
                  get [n]() {
                    return ne(this, s);
                  },
                  set [n](l) {
                    return re(this, s, l);
                  },
                },
            n,
          ));
    r ? u && r < 4 && te(s, (r > 2 ? 'set ' : r > 1 ? 'get ' : '') + n) : te(i, n);
    for (var $ = a.length - 1; $ >= 0; $--)
      ((_ = Ee(r, n, (C = {}), e[3], W)),
        r &&
          ((_.static = w),
          (_.private = u),
          (y = _.access = { has: u ? (l) => Ae(i, l) : (l) => n in l }),
          r ^ 3 && (y.get = u ? (l) => (r ^ 1 ? ne : Pe)(l, i, r ^ 4 ? s : c.get) : (l) => l[n]),
          r > 2 && (y.set = u ? (l, x) => re(l, i, x, r ^ 4 ? s : c.set) : (l, x) => (l[n] = x))),
        (d = (0, a[$])(r ? (r < 4 ? (u ? s : c[I]) : r > 4 ? void 0 : { get: c.get, set: c.set }) : i, _)),
        (C._ = 1),
        r ^ 4 || d === void 0
          ? O(d) && (r > 4 ? M.unshift(d) : r ? (u ? (s = d) : (c[I] = d)) : (i = d))
          : typeof d != 'object' || d === null
            ? N('Object expected')
            : (O((h = d.get)) && (c.get = h), O((h = d.set)) && (c.set = h), O((h = d.init)) && M.unshift(h)));
    return (r || We(e, i), c && H(i, n, c), u ? (r ^ 4 ? s : c) : i);
  },
  B = (e, t, n) => t.has(e) || N('Cannot ' + n),
  Ae = (e, t) => (Object(t) !== t ? N('Cannot use the "in" operator on this value') : e.has(t)),
  ne = (e, t, n) => (B(e, t, 'read from private field'), n ? n.call(e) : t.get(e)),
  De = (e, t, n) =>
    t.has(e) ? N('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(e) : t.set(e, n),
  re = (e, t, n, a) => (B(e, t, 'write to private field'), a ? a.call(e, n) : t.set(e, n), n),
  Pe = (e, t, n) => (B(e, t, 'access private method'), n),
  he,
  P,
  ve,
  S,
  G;
ve = [le('nte-nav-2')];
class E extends ((P = oe()), (he = [f({ type: String, reflect: !0, attribute: 'aria-label' })]), P) {
  constructor() {
    (super(...arguments), De(this, G, D(S, 8, this, '')), D(S, 11, this));
  }
  render() {
    return g`
      <nav id="nav" part="nav" aria-label=${L(this.ariaLabel || void 0)}>
        <div id="list" part="list" role="list">
          <slot></slot>
        </div>
      </nav>
    `;
  }
}
S = Te(P);
G = new WeakMap();
pe(S, 4, 'ariaLabel', he, E, G);
E = pe(S, 0, 'NteNav2', ve, E);
E.styles = [de(Ie)];
D(S, 1, E);
const Fe =
  '*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;width:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}img,picture,video,canvas,svg{display:block;max-width:100%}input,button,textarea,select{font:inherit;color:inherit;background:none;border:none;outline:none}a,i{color:inherit;text-decoration:none}ul,ol{list-style:none}table{border-collapse:collapse;border-spacing:0}slot{display:contents}:host{--nte-nav-item-order: 0;--nte-nav-item-gap: .5rem;--nte-nav-submenu-gap: .25rem;--nte-nav-submenu-min-inline-size: 12rem;--nte-nav-submenu-max-block-size: min(70vh, 32rem);--nte-nav-submenu-position-area: block-end span-inline-end;--nte-nav-nested-submenu-position-area: inline-end span-block-end;--nte-nav-submenu-enter-transform: translateY(-.35rem);--nte-nav-transition-duration: .16s;display:block;position:relative;order:var(--nte-nav-item-order);min-inline-size:0}#item,#link,#text,#disclosure,#toggle{display:flex;align-items:center}#item{min-block-size:100%}#link,#text,#disclosure{flex:1 1 auto;min-inline-size:0;gap:var(--nte-nav-item-gap)}#toggle{flex:0 0 auto;justify-content:center}#icon[hidden]{display:none}#icon,#indicator{flex:0 0 auto}#indicator{inline-size:1em;block-size:1em;transition:transform var(--nte-nav-transition-duration) ease}#item:has(#submenu:popover-open) #indicator{transform:rotate(180deg)}#submenu{min-inline-size:var(--nte-nav-submenu-min-inline-size);max-block-size:var(--nte-nav-submenu-max-block-size);margin:var(--nte-nav-submenu-gap) 0 0;padding:0;overflow:auto;position-area:var(--nte-nav-submenu-position-area);position-try-fallbacks:flip-block,flip-inline;opacity:0;transform:var(--nte-nav-submenu-enter-transform);transition:opacity var(--nte-nav-transition-duration) ease,transform var(--nte-nav-transition-duration) ease,display var(--nte-nav-transition-duration) allow-discrete,overlay var(--nte-nav-transition-duration) allow-discrete}#submenu:popover-open{opacity:1;transform:none}@starting-style{#submenu:popover-open{opacity:0;transform:var(--nte-nav-submenu-enter-transform)}}#submenu>slot{display:flex;flex-direction:column;align-items:stretch}#submenu>slot::slotted(nte-nav-item){--nte-nav-submenu-position-area: var(--nte-nav-nested-submenu-position-area)}@media(prefers-reduced-motion:reduce){#indicator,#submenu{transition-duration:.01ms}}';
var He = Object.create,
  V = Object.defineProperty,
  Be = Object.getOwnPropertyDescriptor,
  _e = (e, t) => ((t = Symbol[e]) ? t : Symbol.for('Symbol.' + e)),
  z = (e) => {
    throw TypeError(e);
  },
  Ge = (e, t, n) => (t in e ? V(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n)),
  ie = (e, t) => V(e, 'name', { value: t, configurable: !0 }),
  Ve = (e) => [, , , He((e == null ? void 0 : e[_e('metadata')]) ?? null)],
  me = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  T = (e) => (e !== void 0 && typeof e != 'function' ? z('Function expected') : e),
  qe = (e, t, n, a, i) => ({
    kind: me[e],
    name: t,
    metadata: a,
    addInitializer: (s) => (n._ ? z('Already initialized') : i.push(T(s || null))),
  }),
  Ue = (e, t) => Ge(t, _e('metadata'), e[3]),
  p = (e, t, n, a) => {
    for (var i = 0, s = e[t >> 1], h = s && s.length; i < h; i++) t & 1 ? s[i].call(n) : (a = s[i].call(n, a));
    return a;
  },
  m = (e, t, n, a, i, s) => {
    var h,
      d,
      C,
      _,
      y,
      r = t & 7,
      w = !!(t & 8),
      u = !!(t & 16),
      k = r > 3 ? e.length + 1 : r ? (w ? 1 : 2) : 0,
      I = me[r + 5],
      M = r > 3 && (e[k - 1] = []),
      W = e[k] || (e[k] = []),
      c =
        r &&
        (!u && !w && (i = i.prototype),
        r < 5 &&
          (r > 3 || !u) &&
          Be(
            r < 4
              ? i
              : {
                  get [n]() {
                    return ae(this, s);
                  },
                  set [n](l) {
                    return se(this, s, l);
                  },
                },
            n,
          ));
    r ? u && r < 4 && ie(s, (r > 2 ? 'set ' : r > 1 ? 'get ' : '') + n) : ie(i, n);
    for (var $ = a.length - 1; $ >= 0; $--)
      ((_ = qe(r, n, (C = {}), e[3], W)),
        r &&
          ((_.static = w),
          (_.private = u),
          (y = _.access = { has: u ? (l) => Ye(i, l) : (l) => n in l }),
          r ^ 3 && (y.get = u ? (l) => (r ^ 1 ? ae : Je)(l, i, r ^ 4 ? s : c.get) : (l) => l[n]),
          r > 2 && (y.set = u ? (l, x) => se(l, i, x, r ^ 4 ? s : c.set) : (l, x) => (l[n] = x))),
        (d = (0, a[$])(r ? (r < 4 ? (u ? s : c[I]) : r > 4 ? void 0 : { get: c.get, set: c.set }) : i, _)),
        (C._ = 1),
        r ^ 4 || d === void 0
          ? T(d) && (r > 4 ? M.unshift(d) : r ? (u ? (s = d) : (c[I] = d)) : (i = d))
          : typeof d != 'object' || d === null
            ? z('Object expected')
            : (T((h = d.get)) && (c.get = h), T((h = d.set)) && (c.set = h), T((h = d.init)) && M.unshift(h)));
    return (r || Ue(e, i), c && V(i, n, c), u ? (r ^ 4 ? s : c) : i);
  },
  q = (e, t, n) => t.has(e) || z('Cannot ' + n),
  Ye = (e, t) => (Object(t) !== t ? z('Cannot use the "in" operator on this value') : e.has(t)),
  ae = (e, t, n) => (q(e, t, 'read from private field'), n ? n.call(e) : t.get(e)),
  b = (e, t, n) =>
    t.has(e) ? z('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(e) : t.set(e, n),
  se = (e, t, n, a) => (q(e, t, 'write to private field'), a ? a.call(e, n) : t.set(e, n), n),
  Je = (e, t, n) => (q(e, t, 'access private method'), n),
  be,
  fe,
  ge,
  ye,
  we,
  ke,
  $e,
  xe,
  Se,
  Ne,
  F,
  ze,
  o,
  U,
  Y,
  J,
  K,
  Q,
  R,
  X,
  Z,
  j,
  ee;
ze = [le('nte-nav-item')];
class v extends ((F = oe()),
(Ne = [f({ type: String, reflect: !0 })]),
(Se = [f({ type: String, reflect: !0 })]),
(xe = [f({ type: String, reflect: !0 })]),
($e = [f({ type: String, reflect: !0 })]),
(ke = [f({ type: String, reflect: !0 })]),
(we = [f({ type: Number, reflect: !0 })]),
(ye = [f({ type: String, attribute: 'submenu-label' })]),
(ge = [A()]),
(fe = [A()]),
(be = [A()]),
F) {
  constructor() {
    (super(...arguments),
      b(this, U, p(o, 8, this, '')),
      p(o, 11, this),
      b(this, Y, p(o, 12, this, '')),
      p(o, 15, this),
      b(this, J, p(o, 16, this, '')),
      p(o, 19, this),
      b(this, K, p(o, 20, this, '')),
      p(o, 23, this),
      b(this, Q, p(o, 24, this, '')),
      p(o, 27, this),
      b(this, R, p(o, 28, this)),
      p(o, 31, this),
      b(this, X, p(o, 32, this, 'Untermenü')),
      p(o, 35, this),
      b(this, Z, p(o, 36, this, !1)),
      p(o, 39, this),
      b(this, j, p(o, 40, this, !1)),
      p(o, 43, this),
      b(this, ee, p(o, 44, this, '')),
      p(o, 47, this));
  }
  connectedCallback() {
    (super.connectedCallback(), this.hasAttribute('role') || this.setAttribute('role', 'listitem'));
  }
  updated(t) {
    (super.updated(t),
      t.has('order') &&
        (this.order === void 0 || Number.isNaN(this.order)
          ? this.style.removeProperty('order')
          : (this.style.order = String(this.order))));
  }
  render() {
    const t = this._renderLabel();
    return g`
      <div id="item" part="item">
        ${
          this.href
            ? g`
                <a
                  id="link"
                  part="link"
                  href=${this.href}
                  target=${L(this.target || void 0)}
                  rel=${L(this.rel || void 0)}
                  download=${L(this.hasAttribute('download') ? this.download : void 0)}
                  aria-current=${L(this.current || void 0)}
                >
                  ${t}
                </a>
                ${this._hasSubmenu ? this._renderIconOnlyDisclosure() : Ce}
              `
            : this._hasSubmenu
              ? this._renderLabelDisclosure(t)
              : g`<span id="text" part="text">${t}</span>`
        }

        <div id="submenu" part="submenu" role="list" aria-label=${this._submenuAccessibleName()} popover="auto">
          <slot name="submenu" @slotchange=${this._onSubmenuSlotChange}></slot>
        </div>
      </div>
    `;
  }
  _renderLabel() {
    return g`
      <span id="icon" part="icon" ?hidden=${!this._hasIcon}>
        <slot name="icon" @slotchange=${this._onIconSlotChange}></slot>
      </span>
      <span id="label" part="label">
        <slot @slotchange=${this._onLabelSlotChange}></slot>
      </span>
    `;
  }
  _renderIconOnlyDisclosure() {
    return g`
      <button
        id="toggle"
        part="toggle"
        type="button"
        popovertarget="submenu"
        aria-controls="submenu"
        aria-label=${this._submenuAccessibleName()}
      >
        ${this._renderIndicator()}
      </button>
    `;
  }
  _renderLabelDisclosure(t) {
    return g`
      <button id="disclosure" part="disclosure" type="button" popovertarget="submenu" aria-controls="submenu">
        ${t} ${this._renderIndicator()}
      </button>
    `;
  }
  _renderIndicator() {
    return g`
      <svg id="indicator" part="indicator" aria-hidden="true" viewBox="0 0 16 16">
        <path d="m3 6 5 5 5-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
      </svg>
    `;
  }
  _submenuAccessibleName() {
    return this._labelText ? `${this.submenuLabel}: ${this._labelText}` : this.submenuLabel;
  }
  _onIconSlotChange(t) {
    const n = t.currentTarget;
    this._hasIcon = n.assignedNodes({ flatten: !0 }).some((a) => this._hasVisibleContent(a));
  }
  _onLabelSlotChange(t) {
    const a = t.currentTarget.assignedNodes({ flatten: !0 });
    (a.forEach((i) => {
      i instanceof HTMLElement && i.matches('nte-nav-item') && i.setAttribute('slot', 'submenu');
    }),
      (this._labelText = a
        .filter((i) => !(i instanceof HTMLElement && i.matches('nte-nav-item')))
        .map((i) => {
          var s;
          return ((s = i.textContent) == null ? void 0 : s.trim()) ?? '';
        })
        .filter(Boolean)
        .join(' ')));
  }
  _onSubmenuSlotChange(t) {
    const n = t.currentTarget;
    this._hasSubmenu = n.assignedElements({ flatten: !0 }).some((a) => a.matches('nte-nav-item'));
  }
  _hasVisibleContent(t) {
    var n;
    return t.nodeType === Node.ELEMENT_NODE || !!((n = t.textContent) != null && n.trim());
  }
}
o = Ve(F);
U = new WeakMap();
Y = new WeakMap();
J = new WeakMap();
K = new WeakMap();
Q = new WeakMap();
R = new WeakMap();
X = new WeakMap();
Z = new WeakMap();
j = new WeakMap();
ee = new WeakMap();
m(o, 4, 'href', Ne, v, U);
m(o, 4, 'target', Se, v, Y);
m(o, 4, 'rel', xe, v, J);
m(o, 4, 'download', $e, v, K);
m(o, 4, 'current', ke, v, Q);
m(o, 4, 'order', we, v, R);
m(o, 4, 'submenuLabel', ye, v, X);
m(o, 4, '_hasIcon', ge, v, Z);
m(o, 4, '_hasSubmenu', fe, v, j);
m(o, 4, '_labelText', be, v, ee);
v = m(o, 0, 'NteNavItem', ze, v);
v.styles = [de(Fe)];
p(o, 1, v);
function Re(e, t) {
  var i;
  const n = new DOMParser().parseFromString(t, 'text/html'),
    a = document.createElement('div');
  ((a.className = 'nte-nav-2-demo'),
    (a.innerHTML = ((i = n.querySelector('main')) == null ? void 0 : i.outerHTML) ?? n.body.innerHTML),
    e.replaceChildren(a));
}
export { Re as r };
