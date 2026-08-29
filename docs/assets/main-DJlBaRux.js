import { r as H, b as ne } from './_virtual_tdemo-client-CxMeb5Rk.js';
import { r as oe } from './index-BR6EnczS.js';
import { n as re, S as ye } from './nextrap-element-DeSHPIJn.js';
import { t as ae, n as I } from './property-C2fH_zxw.js'; /* empty css              */
const Ee =
  ':host{display:block}#details{display:flex;overflow:hidden;flex-direction:column}#summary{order:0;display:flex;align-items:center;cursor:pointer;-webkit-user-select:none;user-select:none;list-style:none}#summary::-webkit-details-marker{display:none}#summary::marker{display:none;content:""}#content-wrap{height:0;overflow:hidden;transition:height var(--transition-duration, .35s) ease}#title{flex:1;min-width:0}#marker{display:flex;align-items:center;justify-content:center;width:var(--marker-size, 1.25rem);height:var(--marker-size, 1.25rem);flex-shrink:0;color:var(--marker-color, currentColor)}#marker:before{content:"";display:block;width:100%;height:100%;background-color:currentColor;mask-size:contain;mask-repeat:no-repeat;mask-position:center;mask-image:var(--marker-icon-closed, none);-webkit-mask-size:contain;-webkit-mask-repeat:no-repeat;-webkit-mask-position:center;-webkit-mask-image:var(--marker-icon-closed, none)}:host([open]) #marker:before{mask-image:var(--marker-icon-open, var(--marker-icon-closed, none));-webkit-mask-image:var(--marker-icon-open, var(--marker-icon-closed, none))}:host([marker-icon=plus]) #marker:before{mask-image:var(--marker-icon-plus, var(--marker-icon-closed, none));-webkit-mask-image:var(--marker-icon-plus, var(--marker-icon-closed, none))}:host([marker-icon=plus][open]) #marker:before{mask-image:var(--marker-icon-minus, var(--marker-icon-open, none));-webkit-mask-image:var(--marker-icon-minus, var(--marker-icon-open, none))}:host([marker-position=start]) #marker{order:-1}#summary:focus-visible{outline:var(--focus-outline, 2px solid currentColor);outline-offset:-2px}';
var we = Object.create,
  q = Object.defineProperty,
  Ie = Object.getOwnPropertyDescriptor,
  se = (t, e) => ((e = Symbol[t]) ? e : Symbol.for('Symbol.' + t)),
  x = (t) => {
    throw TypeError(t);
  },
  Se = (t, e, i) => (e in t ? q(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : (t[e] = i)),
  Y = (t, e) => q(t, 'name', { value: e, configurable: !0 }),
  xe = (t) => [, , , we((t == null ? void 0 : t[se('metadata')]) ?? null)],
  le = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  O = (t) => (t !== void 0 && typeof t != 'function' ? x('Function expected') : t),
  be = (t, e, i, n, a) => ({
    kind: le[t],
    name: e,
    metadata: n,
    addInitializer: (o) => (i._ ? x('Already initialized') : a.push(O(o || null))),
  }),
  Ce = (t, e) => Se(e, se('metadata'), t[3]),
  w = (t, e, i, n) => {
    for (var a = 0, o = t[e >> 1], p = o && o.length; a < p; a++) e & 1 ? o[a].call(i) : (n = o[a].call(i, n));
    return n;
  },
  N = (t, e, i, n, a, o) => {
    var p,
      l,
      C,
      m,
      k,
      r = e & 7,
      f = !!(e & 8),
      d = !!(e & 16),
      g = r > 3 ? t.length + 1 : r ? (f ? 1 : 2) : 0,
      $ = le[r + 5],
      A = r > 3 && (t[g - 1] = []),
      M = t[g] || (t[g] = []),
      c =
        r &&
        (!d && !f && (a = a.prototype),
        r < 5 &&
          (r > 3 || !d) &&
          Ie(
            r < 4
              ? a
              : {
                  get [i]() {
                    return Z(this, o);
                  },
                  set [i](s) {
                    return j(this, o, s);
                  },
                },
            i,
          ));
    r ? d && r < 4 && Y(o, (r > 2 ? 'set ' : r > 1 ? 'get ' : '') + i) : Y(a, i);
    for (var y = n.length - 1; y >= 0; y--)
      ((m = be(r, i, (C = {}), t[3], M)),
        r &&
          ((m.static = f),
          (m.private = d),
          (k = m.access = { has: d ? (s) => $e(a, s) : (s) => i in s }),
          r ^ 3 && (k.get = d ? (s) => (r ^ 1 ? Z : Ae)(s, a, r ^ 4 ? o : c.get) : (s) => s[i]),
          r > 2 && (k.set = d ? (s, E) => j(s, a, E, r ^ 4 ? o : c.set) : (s, E) => (s[i] = E))),
        (l = (0, n[y])(r ? (r < 4 ? (d ? o : c[$]) : r > 4 ? void 0 : { get: c.get, set: c.set }) : a, m)),
        (C._ = 1),
        r ^ 4 || l === void 0
          ? O(l) && (r > 4 ? A.unshift(l) : r ? (d ? (o = l) : (c[$] = l)) : (a = l))
          : typeof l != 'object' || l === null
            ? x('Object expected')
            : (O((p = l.get)) && (c.get = p), O((p = l.set)) && (c.set = p), O((p = l.init)) && A.unshift(p)));
    return (r || Ce(t, a), c && q(a, i, c), d ? (r ^ 4 ? o : c) : a);
  },
  L = (t, e, i) => e.has(t) || x('Cannot ' + i),
  $e = (t, e) => (Object(e) !== e ? x('Cannot use the "in" operator on this value') : t.has(e)),
  Z = (t, e, i) => (L(t, e, 'read from private field'), i ? i.call(t) : e.get(t)),
  F = (t, e, i) =>
    e.has(t) ? x('Cannot add the same private member more than once') : e instanceof WeakSet ? e.add(t) : e.set(t, i),
  j = (t, e, i, n) => (L(t, e, 'write to private field'), n ? n.call(t, i) : e.set(t, i), i),
  Ae = (t, e, i) => (L(t, e, 'access private method'), i),
  ce,
  de,
  pe,
  R,
  he,
  _,
  B,
  D,
  U;
he = [ae('nte-accordion-item')];
class S extends ((R = ye(re({ slotVisibility: !1, eventBinding: !1 }))),
(pe = [I({ type: Boolean, reflect: !0 })]),
(de = [I({ type: String, reflect: !0, attribute: 'marker-position' })]),
(ce = [I({ type: String, reflect: !0, attribute: 'marker-icon' })]),
R) {
  constructor() {
    (super(...arguments),
      F(this, B, w(_, 8, this, !1)),
      w(_, 11, this),
      F(this, D, w(_, 12, this, 'end')),
      w(_, 15, this),
      F(this, U, w(_, 16, this, null)),
      w(_, 19, this),
      (this._detailsElement = null),
      (this._contentWrapElement = null),
      (this._transitionEndHandler = null),
      (this._animationFrame = 0),
      (this._isReady = !1));
  }
  firstUpdated(e) {
    var i, n;
    (super.firstUpdated(e),
      (this._detailsElement = ((i = this.shadowRoot) == null ? void 0 : i.querySelector('#details')) ?? null),
      (this._contentWrapElement = ((n = this.shadowRoot) == null ? void 0 : n.querySelector('#content-wrap')) ?? null),
      (this._isReady = !0),
      this._applyOpenState(!1));
  }
  updated(e) {
    (super.updated(e), e.has('open') && this._isReady && (this._applyOpenState(!0), this._dispatchToggle()));
  }
  disconnectedCallback() {
    (this._clearAnimationState(), super.disconnectedCallback());
  }
  _onSummaryClick(e) {
    (e.preventDefault(), (this.open = !this.open));
  }
  _applyOpenState(e) {
    if (this.open) {
      this._expandContent(e);
      return;
    }
    this._collapseContent(e);
  }
  _expandContent(e) {
    if (!this._detailsElement || !this._contentWrapElement) return;
    const i = this._detailsElement,
      n = this._contentWrapElement;
    if ((this._clearAnimationState(), (i.open = !0), !e)) {
      n.style.height = 'auto';
      return;
    }
    const a = n.getBoundingClientRect().height;
    ((n.style.height = `${a}px`), n.offsetHeight);
    const o = n.scrollHeight;
    if (Math.abs(o - a) < 1) {
      n.style.height = 'auto';
      return;
    }
    ((this._animationFrame = requestAnimationFrame(() => {
      n.style.height = `${o}px`;
    })),
      (this._transitionEndHandler = (p) => {
        p.target !== n || p.propertyName !== 'height' || (this._clearAnimationState(), (n.style.height = 'auto'));
      }),
      n.addEventListener('transitionend', this._transitionEndHandler));
  }
  _collapseContent(e) {
    if (!this._detailsElement || !this._contentWrapElement) return;
    const i = this._detailsElement,
      n = this._contentWrapElement;
    if ((this._clearAnimationState(), !e)) {
      ((i.open = !1), (n.style.height = '0px'));
      return;
    }
    if (!i.open) {
      n.style.height = '0px';
      return;
    }
    const a = n.getBoundingClientRect().height || n.scrollHeight;
    ((n.style.height = `${a}px`),
      n.offsetHeight,
      (this._animationFrame = requestAnimationFrame(() => {
        n.style.height = '0px';
      })),
      (this._transitionEndHandler = (o) => {
        o.target !== n ||
          o.propertyName !== 'height' ||
          (this._clearAnimationState(), (i.open = !1), (n.style.height = '0px'));
      }),
      n.addEventListener('transitionend', this._transitionEndHandler));
  }
  _clearAnimationState() {
    (this._animationFrame && (cancelAnimationFrame(this._animationFrame), (this._animationFrame = 0)),
      this._contentWrapElement &&
        this._transitionEndHandler &&
        (this._contentWrapElement.removeEventListener('transitionend', this._transitionEndHandler),
        (this._transitionEndHandler = null)));
  }
  _dispatchToggle() {
    this.dispatchEvent(new CustomEvent('accordion-toggle', { detail: { open: this.open }, bubbles: !0, composed: !0 }));
  }
  render() {
    return ne`
      <details id="details" part="details">
        <summary id="summary" part="summary" @click=${this._onSummaryClick}>
          <span id="title" part="title">
            <slot
              name="title"
              data-query=":scope > h1,:scope > h2,:scope > h3,:scope > h4,:scope > h5,:scope > h6"
            ></slot>
          </span>
          <span id="marker" part="marker"></span>
        </summary>
        <div id="content-wrap">
          <div id="content" part="content">
            <slot></slot>
          </div>
        </div>
      </details>
    `;
  }
}
_ = xe(R);
B = new WeakMap();
D = new WeakMap();
U = new WeakMap();
N(_, 4, 'open', pe, S, B);
N(_, 4, 'markerPosition', de, S, D);
N(_, 4, 'markerIcon', ce, S, U);
S = N(_, 0, 'NteAccordionItemElement', he, S);
S.styles = [H(oe), H(Ee)];
w(_, 1, S);
const Oe = ':host{display:block}#accordion{display:block}';
var Pe = Object.create,
  G = Object.defineProperty,
  ze = Object.getOwnPropertyDescriptor,
  _e = (t, e) => ((e = Symbol[t]) ? e : Symbol.for('Symbol.' + t)),
  b = (t) => {
    throw TypeError(t);
  },
  We = (t, e, i) => (e in t ? G(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : (t[e] = i)),
  ee = (t, e) => G(t, 'name', { value: e, configurable: !0 }),
  He = (t) => [, , , Pe((t == null ? void 0 : t[_e('metadata')]) ?? null)],
  me = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  P = (t) => (t !== void 0 && typeof t != 'function' ? b('Function expected') : t),
  Ne = (t, e, i, n, a) => ({
    kind: me[t],
    name: e,
    metadata: n,
    addInitializer: (o) => (i._ ? b('Already initialized') : a.push(P(o || null))),
  }),
  Me = (t, e) => We(e, _e('metadata'), t[3]),
  u = (t, e, i, n) => {
    for (var a = 0, o = t[e >> 1], p = o && o.length; a < p; a++) e & 1 ? o[a].call(i) : (n = o[a].call(i, n));
    return n;
  },
  z = (t, e, i, n, a, o) => {
    var p,
      l,
      C,
      m,
      k,
      r = e & 7,
      f = !!(e & 8),
      d = !!(e & 16),
      g = r > 3 ? t.length + 1 : r ? (f ? 1 : 2) : 0,
      $ = me[r + 5],
      A = r > 3 && (t[g - 1] = []),
      M = t[g] || (t[g] = []),
      c =
        r &&
        (!d && !f && (a = a.prototype),
        r < 5 &&
          (r > 3 || !d) &&
          ze(
            r < 4
              ? a
              : {
                  get [i]() {
                    return te(this, o);
                  },
                  set [i](s) {
                    return ie(this, o, s);
                  },
                },
            i,
          ));
    r ? d && r < 4 && ee(o, (r > 2 ? 'set ' : r > 1 ? 'get ' : '') + i) : ee(a, i);
    for (var y = n.length - 1; y >= 0; y--)
      ((m = Ne(r, i, (C = {}), t[3], M)),
        r &&
          ((m.static = f),
          (m.private = d),
          (k = m.access = { has: d ? (s) => Fe(a, s) : (s) => i in s }),
          r ^ 3 && (k.get = d ? (s) => (r ^ 1 ? te : Re)(s, a, r ^ 4 ? o : c.get) : (s) => s[i]),
          r > 2 && (k.set = d ? (s, E) => ie(s, a, E, r ^ 4 ? o : c.set) : (s, E) => (s[i] = E))),
        (l = (0, n[y])(r ? (r < 4 ? (d ? o : c[$]) : r > 4 ? void 0 : { get: c.get, set: c.set }) : a, m)),
        (C._ = 1),
        r ^ 4 || l === void 0
          ? P(l) && (r > 4 ? A.unshift(l) : r ? (d ? (o = l) : (c[$] = l)) : (a = l))
          : typeof l != 'object' || l === null
            ? b('Object expected')
            : (P((p = l.get)) && (c.get = p), P((p = l.set)) && (c.set = p), P((p = l.init)) && A.unshift(p)));
    return (r || Me(t, a), c && G(a, i, c), d ? (r ^ 4 ? o : c) : a);
  },
  V = (t, e, i) => e.has(t) || b('Cannot ' + i),
  Fe = (t, e) => (Object(e) !== e ? b('Cannot use the "in" operator on this value') : t.has(e)),
  te = (t, e, i) => (V(t, e, 'read from private field'), i ? i.call(t) : e.get(t)),
  W = (t, e, i) =>
    e.has(t) ? b('Cannot add the same private member more than once') : e instanceof WeakSet ? e.add(t) : e.set(t, i),
  ie = (t, e, i, n) => (V(t, e, 'write to private field'), n ? n.call(t, i) : e.set(t, i), i),
  Re = (t, e, i) => (V(t, e, 'access private method'), i),
  ue,
  ve,
  ke,
  fe,
  T,
  ge,
  h,
  J,
  K,
  Q,
  X;
const Te = {
  fromAttribute(t) {
    if (t === null) return;
    if (t === '') return 0;
    const e = parseInt(t, 10);
    return isNaN(e) ? void 0 : e;
  },
  toAttribute(t) {
    return t !== void 0 ? String(t) : null;
  },
};
ge = [ae('nte-accordion')];
class v extends ((T = re({ slotVisibility: !1, eventBinding: !1, subLayoutApply: !0 })),
(fe = [I({ type: Boolean, reflect: !0 })]),
(ke = [I({ converter: Te, attribute: 'initial-open-index' })]),
(ve = [I({ type: String, reflect: !0, attribute: 'marker-position' })]),
(ue = [I({ type: String, reflect: !0, attribute: 'marker-icon' })]),
T) {
  constructor() {
    (super(...arguments),
      W(this, J, u(h, 8, this, !0)),
      u(h, 11, this),
      W(this, K, u(h, 12, this, 0)),
      u(h, 15, this),
      W(this, Q, u(h, 16, this, null)),
      u(h, 19, this),
      W(this, X, u(h, 20, this, null)),
      u(h, 23, this),
      (this._initialized = !1),
      (this._onSlotChange = () => {
        (this._propagateProperties(), this._applyInitialOpenIndex());
      }),
      (this._onItemToggle = (e) => {
        if (!this.exclusive || !e.detail.open) return;
        const i = e.target;
        for (const n of this._getAccordionItems()) n !== i && n.open && (n.open = !1);
      }));
  }
  connectedCallback() {
    (super.connectedCallback(), this.classList.add('nte-accordion'));
  }
  firstUpdated(e) {
    (super.firstUpdated(e), this.addEventListener('accordion-toggle', this._onItemToggle), this._onSlotChange());
  }
  _propagateProperties() {
    for (const e of this._getAccordionItems())
      (this.markerPosition && !e.hasAttribute('marker-position') && (e.markerPosition = this.markerPosition),
        this.markerIcon && !e.hasAttribute('marker-icon') && (e.markerIcon = this.markerIcon));
  }
  _applyInitialOpenIndex() {
    if (this._initialized || this.initialOpenIndex === void 0) return;
    this._initialized = !0;
    const e = this._getAccordionItems();
    this.initialOpenIndex >= 0 && this.initialOpenIndex < e.length && (e[this.initialOpenIndex].open = !0);
  }
  _getAccordionItems() {
    var i;
    const e = (i = this.shadowRoot) == null ? void 0 : i.querySelector('slot:not([name])');
    return e ? e.assignedElements({ flatten: !0 }).filter((n) => n.tagName === 'NTE-ACCORDION-ITEM') : [];
  }
  render() {
    return ne`
      <div id="accordion" part="accordion">
        <slot
          data-query=":scope > section:not(.keep)"
          data-set-attribute-layout="nte-accordion-item"
          @slotchange=${this._onSlotChange}
        ></slot>
      </div>
    `;
  }
}
h = He(T);
J = new WeakMap();
K = new WeakMap();
Q = new WeakMap();
X = new WeakMap();
z(h, 4, 'exclusive', fe, v, J);
z(h, 4, 'initialOpenIndex', ke, v, K);
z(h, 4, 'markerPosition', ve, v, Q);
z(h, 4, 'markerIcon', ue, v, X);
v = z(h, 0, 'NteAccordionElement', ge, v);
v.styles = [H(oe), H(Oe)];
u(h, 1, v);
