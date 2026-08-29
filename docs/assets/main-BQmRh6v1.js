var kt = (i) => {
  throw TypeError(i);
};
var re = (i, t, e) => t.has(i) || kt('Cannot ' + e);
var xt = (i, t, e) => (re(i, t, 'read from private field'), e ? e.call(i) : t.get(i)),
  It = (i, t, e) =>
    t.has(i) ? kt('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(i) : t.set(i, e);
import { A as $, r as Et, E as ne, b as y } from './_virtual_tdemo-client-Pi1VR-d9.js';
import { t as de, i as he, e as ue } from './directive-CJw_OlP2.js';
import { r as oe } from './index-BR6EnczS.js';
import { o as q } from './index-D4PUARzf.js';
import './index-l0sNRNKZ.js'; /* empty css              */
import { n as ae, L as M, w as se } from './nextrap-element-CnNsmvMM.js';
import { t as le, n as S } from './property-BLTBoP6p.js';
import { r as Ct } from './state-CNjn0hWp.js';
function ce(i) {
  if (typeof i == 'string') return { value: i, label: i };
  if (i && typeof i == 'object') {
    const t = i;
    if (typeof t.value == 'string' || typeof t.label == 'string')
      return {
        value: String(t.value ?? t.label ?? ''),
        label: String(t.label ?? t.value ?? ''),
        disabled: !!t.disabled,
        html: typeof t.html == 'string' ? t.html : void 0,
      };
    const e = Object.entries(t)[0];
    if (e && typeof e[0] == 'string' && typeof e[1] == 'string') return { value: e[0], label: e[1] };
  }
  return null;
}
function pe(i) {
  if (!i) return [];
  const t = i.trim();
  if (!t) return [];
  if (t.startsWith('[') || t.startsWith('{'))
    try {
      const e = JSON.parse(t);
      if (Array.isArray(e)) return e.map(ce).filter((r) => r !== null);
      if (e && typeof e == 'object') return Object.entries(e).map(([r, a]) => ({ value: r, label: String(a) }));
    } catch (e) {
      return (console.warn('Invalid data-options JSON:', e), []);
    }
  return t
    .split(';')
    .map((e) => e.trim())
    .filter(Boolean)
    .map((e) => {
      const [r, a] = e.split('|').map((d) => d.trim());
      return { value: r ?? '', label: a || r || '' };
    });
}
function me(i) {
  return JSON.stringify(i);
}
const v = 'main-control',
  x = 'validation-content',
  be =
    ':host{display:block}:where(#wrapper),:where(#field){display:grid;gap:.5rem}:where(#label){margin:0;font-weight:600}:where(#label[hidden]){display:none}:where(#control-shell){display:flex;align-items:stretch;gap:.5rem;min-height:2.75rem;border:1px solid #ced4da}:where(#control){display:flex;flex:1 1 auto;align-items:stretch;min-width:0;padding:.625rem .75rem}:where(#control-input){display:flex;flex:1 1 auto;align-items:stretch;min-width:0}:where(#control-input)>*{flex:1 1 auto;min-width:0}:where(#start),:where(#end){display:flex;flex:0 0 auto;align-items:stretch;align-self:stretch}:where(#start.slot-empty),:where(#end.slot-empty){display:none}:where(#start)::slotted(*),:where(#end)::slotted(*){display:inline-flex;align-items:center;justify-content:center;align-self:stretch;box-sizing:border-box;height:100%;max-height:100%}:where(#control-shell:focus-within){border-color:#0d6efd}:where(#validation){display:none;grid-template-rows:1fr;padding-top:.375rem}:where(#validation slot){display:contents}:where(#validation-inner){min-height:0;overflow:visible}:where(#validation-bubble){position:relative}:where(#validation-arrow){position:absolute;top:0;left:.75rem;display:block;width:.625rem;height:.625rem;background:#fff;border-top:1px solid #dc3545;border-left:1px solid #dc3545;transform:translateY(-50%) rotate(45deg)}:where(#validation-content){display:block;border:1px solid #dc3545}:host([invalid]) :where(#validation:has(slot:not(.slot-empty))){display:grid;padding-top:.175rem}:where(#input-aid){display:none;grid-template-rows:0fr}:where(#input-aid slot){display:contents}:where(#input-aid-inner){min-height:0;overflow:visible}:where(#input-aid-bubble){position:relative;opacity:0}:where(#input-aid-arrow){position:absolute;top:0;left:.75rem;display:block;width:.625rem;height:.625rem;background:#fff;border-top:1px solid #0d6efd;border-left:1px solid #0d6efd;transform:translateY(-50%) rotate(45deg)}:where(#input-aid-content){display:block;border:1px solid #0d6efd}:where(#input-aid:has(slot:not(.slot-empty))){display:grid}:host(:focus-within) :where(#input-aid:has(slot:not(.slot-empty))){grid-template-rows:1fr;padding-top:.375rem}:host(:focus-within) :where(#input-aid:has(slot:not(.slot-empty))) :where(#input-aid-bubble){opacity:1;transform:translateY(0)}';
var ve = Object.create,
  it = Object.defineProperty,
  fe = Object.getOwnPropertyDescriptor,
  Ft = (i, t) => ((t = Symbol[i]) ? t : Symbol.for('Symbol.' + i)),
  H = (i) => {
    throw TypeError(i);
  },
  ge = (i, t, e) => (t in i ? it(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (i[t] = e)),
  Ht = (i, t) => it(i, 'name', { value: t, configurable: !0 }),
  ye = (i) => [, , , ve((i == null ? void 0 : i[Ft('metadata')]) ?? null)],
  Ot = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  L = (i) => (i !== void 0 && typeof i != 'function' ? H('Function expected') : i),
  we = (i, t, e, r, a) => ({
    kind: Ot[i],
    name: t,
    metadata: r,
    addInitializer: (n) => (e._ ? H('Already initialized') : a.push(L(n || null))),
  }),
  Se = (i, t) => ge(t, Ft('metadata'), i[3]),
  u = (i, t, e, r) => {
    for (var a = 0, n = i[t >> 1], o = n && n.length; a < o; a++) t & 1 ? n[a].call(e) : (r = n[a].call(e, r));
    return r;
  },
  b = (i, t, e, r, a, n) => {
    var o,
      d,
      I,
      V,
      E,
      h = t & 7,
      B = !!(t & 8),
      _ = !!(t & 16),
      J = h > 3 ? i.length + 1 : h ? (B ? 1 : 2) : 0,
      $t = Ot[h + 5],
      Vt = h > 3 && (i[J - 1] = []),
      ie = i[J] || (i[J] = []),
      w =
        h &&
        (!_ && !B && (a = a.prototype),
        h < 5 &&
          (h > 3 || !_) &&
          fe(
            h < 4
              ? a
              : {
                  get [e]() {
                    return l(this, n);
                  },
                  set [e](g) {
                    return k(this, n, g);
                  },
                },
            e,
          ));
    h ? _ && h < 4 && Ht(n, (h > 2 ? 'set ' : h > 1 ? 'get ' : '') + e) : Ht(a, e);
    for (var R = r.length - 1; R >= 0; R--)
      ((V = we(h, e, (I = {}), i[3], ie)),
        h &&
          ((V.static = B),
          (V.private = _),
          (E = V.access = { has: _ ? (g) => _e(a, g) : (g) => e in g }),
          h ^ 3 && (E.get = _ ? (g) => (h ^ 1 ? l : N)(g, a, h ^ 4 ? n : w.get) : (g) => g[e]),
          h > 2 && (E.set = _ ? (g, j) => k(g, a, j, h ^ 4 ? n : w.set) : (g, j) => (g[e] = j))),
        (d = (0, r[R])(h ? (h < 4 ? (_ ? n : w[$t]) : h > 4 ? void 0 : { get: w.get, set: w.set }) : a, V)),
        (I._ = 1),
        h ^ 4 || d === void 0
          ? L(d) && (h > 4 ? Vt.unshift(d) : h ? (_ ? (n = d) : (w[$t] = d)) : (a = d))
          : typeof d != 'object' || d === null
            ? H('Object expected')
            : (L((o = d.get)) && (w.get = o), L((o = d.set)) && (w.set = o), L((o = d.init)) && Vt.unshift(o)));
    return (h || Se(i, a), w && it(a, e, w), _ ? (h ^ 4 ? n : w) : a);
  },
  rt = (i, t, e) => t.has(i) || H('Cannot ' + e),
  _e = (i, t) => (Object(t) !== t ? H('Cannot use the "in" operator on this value') : i.has(t)),
  l = (i, t, e) => (rt(i, t, 'read from private field'), e ? e.call(i) : t.get(i)),
  m = (i, t, e) =>
    t.has(i) ? H('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(i) : t.set(i, e),
  k = (i, t, e, r) => (rt(i, t, 'write to private field'), r ? r.call(i, e) : t.set(i, e), e),
  N = (i, t, e) => (rt(i, t, 'access private method'), e),
  Mt,
  Lt,
  Nt,
  qt,
  zt,
  Dt,
  Pt,
  Tt,
  Wt,
  Bt,
  Jt,
  Rt,
  jt,
  Yt,
  Kt,
  Ut,
  Gt,
  Y,
  Qt,
  s,
  at,
  st,
  nt,
  lt,
  ot,
  ut,
  ht,
  dt,
  ct,
  pt,
  mt,
  bt,
  vt,
  p,
  z,
  C,
  f,
  A,
  Xt,
  K,
  Zt,
  D;
Qt = [le('nte-input')];
let c = class te extends ((Y = ae({ eventBinding: !0, slotVisibility: !0 })),
(Gt = [S({ type: String, reflect: !0 })]),
(Ut = [S({ type: String })]),
(Kt = [S({ type: String })]),
(Yt = [S({ attribute: 'data-options', converter: { fromAttribute: (t) => pe(t), toAttribute: (t) => me(t) } })]),
(jt = [S({ type: Boolean })]),
(Rt = [S({ type: String, attribute: 'validation-message', reflect: !0 })]),
(Jt = [S({ type: Boolean, reflect: !0 })]),
(Bt = [S({ type: Boolean, reflect: !0 })]),
(Wt = [S({ type: Boolean, reflect: !0, attribute: 'has-value' })]),
(Tt = [S({ type: Boolean, reflect: !0, attribute: 'has-placeholder' })]),
(Pt = [S({ type: Boolean, reflect: !0, attribute: 'hoverlabel-active' })]),
(Dt = [Ct()]),
(zt = [Ct()]),
(qt = [M('input', { target: 'host' }), M('invalid', { target: 'host' })]),
(Nt = [M('click')]),
(Lt = [M('change')]),
(Mt = [M('input')]),
Y) {
  constructor() {
    (super(),
      u(s, 5, this),
      m(this, A),
      m(this, at, u(s, 8, this, 'text')),
      u(s, 11, this),
      m(this, st, u(s, 12, this, '')),
      u(s, 15, this),
      m(this, nt, u(s, 16, this, '')),
      u(s, 19, this),
      m(this, lt, u(s, 20, this, null)),
      u(s, 23, this),
      m(this, ot, u(s, 24, this, !1)),
      u(s, 27, this),
      m(this, ut, u(s, 28, this, '')),
      u(s, 31, this),
      m(this, ht, u(s, 32, this, !1)),
      u(s, 35, this),
      m(this, dt, u(s, 36, this, !1)),
      u(s, 39, this),
      m(this, ct, u(s, 40, this, !1)),
      u(s, 43, this),
      m(this, pt, u(s, 44, this, !1)),
      u(s, 47, this),
      m(this, mt, u(s, 48, this, !1)),
      u(s, 51, this),
      m(this, bt, u(s, 52, this)),
      u(s, 55, this),
      m(this, vt, u(s, 56, this, v)),
      u(s, 59, this),
      m(this, p),
      m(this, z),
      m(this, C),
      m(this, f, null),
      typeof this.attachInternals == 'function' && k(this, f, this.attachInternals()));
  }
  static registerPlugin(t) {
    for (const e of t.types) {
      const r = e.trim().toLowerCase();
      if (r) {
        if (this.plugins.has(r)) throw new Error(`Plugin for input type "${r}" is already registered.`);
        this.plugins.set(r, t);
      }
    }
  }
  static getPlugin(t) {
    return this.plugins.get(t.trim().toLowerCase());
  }
  async connectedCallback() {
    var e, r, a;
    await se();
    const t = te.getPlugin(l(this, A, D));
    if (!t) throw new Error(`No plugin for type ${l(this, A, D)}`);
    (k(this, p, new t(this)),
      this._value === void 0 && (this._value = (e = l(this, p)) == null ? void 0 : e.getInitValue()),
      N(this, A, K).call(this) &&
        typeof ((r = l(this, f)) == null ? void 0 : r.setValidity) == 'function' &&
        l(this, f).setValidity({ customError: !0, badInput: !0 }, 'Invalid value'),
      super.connectedCallback(),
      N(this, A, Zt).call(this, l(this, p).getStyleSheet()),
      (a = l(this, p)) == null || a.connected());
  }
  disconnectedCallback() {
    var t;
    ((t = l(this, p)) == null || t.disconnected(), super.disconnectedCallback());
  }
  attributeChangedCallback(t, e, r) {
    var a;
    (super.attributeChangedCallback(t, e, r), (a = l(this, p)) == null || a.onHostAttributeChange(t, e, r));
  }
  updated(t) {
    var e;
    (super.updated(t), (e = l(this, p)) == null || e.updated(t), this.syncPluginState());
  }
  render() {
    const t = l(this, p),
      e = this.classList.contains('hoverlabel'),
      r = t == null ? void 0 : t.render(this.renderContext),
      a = y`
      <label id="label" part="label" for=${this._labelFor} ?hidden=${!this.label || !!(t != null && t.isLabelHidden())}>
        ${this.label}
      </label>
    `;
    return y`
      <div id="wrapper" part="wrapper">
        <div id="field" part="field">
          ${e ? $ : a}

          <div id="control-shell" part="control">
            <slot id="start" name="start" part="start"></slot>
            <div id="control" part="control-inner">
              ${e ? a : $}
              <div id="control-input" part="control-input">${r ?? $}</div>
            </div>
            <slot id="end" name="end" part="end"></slot>
          </div>
        </div>

        <div id="validation" part="validation" aria-live="polite">
          <div id="validation-inner" part="validation-inner">
            <div id="validation-bubble" part="validation-bubble">
              <span id="validation-arrow" part="validation-arrow" aria-hidden="true"></span>
              <div id="validation-content" part="validation-content">
                <slot name="validation">${this.validationMessage}</slot>
              </div>
            </div>
          </div>
        </div>

        <div id="input-aid" part="input-aid">
          <div id="input-aid-inner" part="input-aid-inner">
            <div id="input-aid-bubble" part="input-aid-bubble">
              <span id="input-aid-arrow" part="input-aid-arrow" aria-hidden="true"></span>
              <div id="input-aid-content" part="input-aid-content">
                <slot name="input-aid"></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  update(t) {
    super.update(t);
  }
  get renderContext() {
    return { element: this, type: l(this, A, D) };
  }
  get form() {
    var t;
    return ((t = l(this, f)) == null ? void 0 : t.form) ?? null;
  }
  get name() {
    return this.getAttribute('name') ?? '';
  }
  get value() {
    return this._value;
  }
  set value(t) {
    ((this._value = t), this.syncPluginState());
  }
  get selectedOptions() {
    var t;
    return ((t = l(this, p)) == null ? void 0 : t.getSelectedOptions()) ?? [];
  }
  syncPluginState() {
    const t = l(this, p);
    ((this.hasValue = (t == null ? void 0 : t.hasValue()) ?? !1),
      (this.hasPlaceholder = (t == null ? void 0 : t.hasPlaceholder()) ?? this.hasAttribute('placeholder')),
      (this.hoverlabelActive = (t == null ? void 0 : t.isHoverlabelActive()) ?? !1),
      (this._labelFor = (t == null ? void 0 : t.getLabelFor()) ?? v),
      N(this, A, Xt).call(this));
  }
  formResetCallback() {
    var t;
    ((t = l(this, p)) == null || t.formResetCallback(), this.syncPluginState());
  }
  formDisabledCallback(t) {
    var e;
    ((e = l(this, p)) == null || e.formDisabledCallback(t), this.syncPluginState());
  }
  onMustRevalidateInternal() {
    var t, e, r;
    N(this, A, K).call(this) &&
      (((t = l(this, p)) == null ? void 0 : t.isValid()) === !0
        ? (typeof ((e = l(this, f)) == null ? void 0 : e.setValidity) == 'function' && l(this, f).setValidity({}),
          this.removeAttribute('invalid'),
          this.setAttribute('valid', ''))
        : (typeof ((r = l(this, f)) == null ? void 0 : r.setValidity) == 'function' &&
            l(this, f).setValidity({ customError: !0, badInput: !0 }, 'Invalid value'),
          this.setAttribute('invalid', ''),
          this.removeAttribute('valid')));
  }
  onClick(t) {
    var e, r, a;
    ((e = l(this, p)) == null || e.onClick(t),
      !this.hasAttribute('disabled') &&
        ((a = (r = l(this, p)) == null ? void 0 : r.getFormElement()) == null || a.focus()));
  }
  onChange(t) {
    var e;
    (e = l(this, p)) == null || e.onChange(t);
  }
  onInput(t) {
    var e;
    (e = l(this, p)) == null || e.onInput(t);
  }
};
s = ye(Y);
at = new WeakMap();
st = new WeakMap();
nt = new WeakMap();
lt = new WeakMap();
ot = new WeakMap();
ut = new WeakMap();
ht = new WeakMap();
dt = new WeakMap();
ct = new WeakMap();
pt = new WeakMap();
mt = new WeakMap();
bt = new WeakMap();
vt = new WeakMap();
p = new WeakMap();
z = new WeakMap();
C = new WeakMap();
f = new WeakMap();
A = new WeakSet();
Xt = function () {
  var i;
  if (!(!l(this, f) || typeof l(this, f).setFormValue != 'function')) {
    if (!this.name || this.hasAttribute('disabled')) {
      l(this, f).setFormValue(null);
      return;
    }
    l(this, f).setFormValue(((i = l(this, p)) == null ? void 0 : i.getFormValue()) ?? null);
  }
};
K = function () {
  return !!(this.hasAttribute('required') && !this.hasAttribute('disabled'));
};
Zt = function (i) {
  var r;
  const t = this.renderRoot;
  if (
    !(t instanceof ShadowRoot) ||
    (l(this, C) &&
      'adoptedStyleSheets' in t &&
      ((t.adoptedStyleSheets = t.adoptedStyleSheets.filter((a) => a !== l(this, C))), k(this, C, void 0)),
    (r = l(this, z)) == null || r.remove(),
    k(this, z, void 0),
    !i)
  )
    return;
  if (typeof CSSStyleSheet < 'u' && i instanceof CSSStyleSheet && 'adoptedStyleSheets' in t) {
    ((t.adoptedStyleSheets = [...t.adoptedStyleSheets, i]), k(this, C, i));
    return;
  }
  const e = document.createElement('style');
  (e.setAttribute('data-plugin-style', l(this, A, D)),
    (e.textContent =
      typeof i == 'string'
        ? i
        : Array.from(i.cssRules, (a) => a.cssText).join(`
`)),
    t.append(e),
    k(this, z, e));
};
D = function () {
  return this.type.trim().toLowerCase() || 'text';
};
b(s, 4, 'type', Gt, c, at);
b(s, 4, 'label', Ut, c, st);
b(s, 4, 'placeholder', Kt, c, nt);
b(s, 4, 'options', Yt, c, lt);
b(s, 4, 'multiple', jt, c, ot);
b(s, 4, 'validationMessage', Rt, c, ut);
b(s, 4, 'invalid', Jt, c, ht);
b(s, 4, 'valid', Bt, c, dt);
b(s, 4, 'hasValue', Wt, c, ct);
b(s, 4, 'hasPlaceholder', Tt, c, pt);
b(s, 4, 'hoverlabelActive', Pt, c, mt);
b(s, 4, '_value', Dt, c, bt);
b(s, 4, '_labelFor', zt, c, vt);
b(s, 1, 'onMustRevalidateInternal', qt, c);
b(s, 1, 'onClick', Nt, c);
b(s, 1, 'onChange', Lt, c);
b(s, 1, 'onInput', Mt, c);
c = b(s, 0, 'NteInput', Qt, c);
c.formAssociated = !0;
c.styles = [Et(be), Et(oe)];
c.plugins = new Map();
u(s, 1, c);
let F = c;
class Ae {
  constructor(t) {
    this.rootElement = t;
  }
  get data() {
    const t = {};
    return (
      this.rootElement.querySelectorAll('[name]').forEach((e) => {
        const r = e.getAttribute('name');
        !r || !('value' in e) || (t[r] = e.value);
      }),
      t
    );
  }
  set data(t) {
    for (const e in t) {
      const r = t[e],
        a = this.rootElement.querySelector(`[name="${e}"]`);
      !a || !('value' in a) || (a.value = r);
    }
  }
}
class $e {
  constructor(t) {
    this.host = t;
  }
  connected() {}
  disconnected() {}
  updated(t) {}
  onClick(t) {}
  onInput(t) {}
  getFormElement() {
    return null;
  }
  getValue() {
    return this.host.value;
  }
  setValue(t) {
    this.host.value = t;
  }
  getStyleSheet() {
    return null;
  }
  getFormValue() {}
  getSelectedOptions() {
    return [];
  }
  hasValue() {
    return !1;
  }
  hasPlaceholder() {
    return !1;
  }
  isHoverlabelActive() {
    return !1;
  }
  isLabelHidden() {
    return !1;
  }
  getControlId() {
    var t;
    return ((t = this.getFormElement()) == null ? void 0 : t.id) || v;
  }
  getLabelFor() {
    return this.getControlId();
  }
  isValid() {
    return null;
  }
  onChange(t) {}
  getInitValue() {
    return this.host.getAttribute('value') ?? null;
  }
  onHostAttributeChange(t, e, r) {}
  formResetCallback() {}
  formDisabledCallback(t) {}
}
var W;
class O extends $e {
  constructor() {
    super(...arguments);
    It(this, W);
  }
  query(e) {
    var r;
    return ((r = this.host.renderRoot) == null ? void 0 : r.querySelector(e)) ?? null;
  }
  queryAll(e) {
    var r;
    return Array.from(((r = this.host.renderRoot) == null ? void 0 : r.querySelectorAll(e)) ?? []);
  }
  getHostAttribute(e, r = '') {
    return this.host.getAttribute(e) ?? r;
  }
  hasHostAttribute(e) {
    return this.host.hasAttribute(e);
  }
  normalizeStringValue(e) {
    return e == null ? '' : String(e);
  }
  createFormData(e) {
    if (!this.host.name || e.length === 0) return null;
    const r = new FormData();
    return (
      e.forEach((a) => {
        r.append(this.host.name, a);
      }),
      r
    );
  }
  syncHostState() {
    this.host.syncPluginState();
  }
  disconnected() {
    var e;
    (e = xt(this, W)) == null || e.abort();
  }
  getFormValue() {
    const e = this.getValue();
    return Array.isArray(e)
      ? this.createFormData(e)
      : typeof e == 'boolean'
        ? e
          ? this.getHostAttribute('value', 'on')
          : null
        : e == null
          ? null
          : String(e);
  }
  hasValue() {
    const e = this.getValue();
    return Array.isArray(e) ? e.length > 0 : typeof e == 'boolean' ? e : this.normalizeStringValue(e).trim().length > 0;
  }
  hasPlaceholder() {
    return this.hasHostAttribute('placeholder');
  }
  isHoverlabelActive() {
    return this.hasPlaceholder() || this.hasValue();
  }
}
W = new WeakMap();
const Ve = '',
  gt = class gt extends O {
    getStyleSheet() {
      return Ve;
    }
    get checkbox() {
      return this.query('input[type="checkbox"]');
    }
    getFormElement() {
      return this.checkbox;
    }
    getInitValue() {
      return this.host.hasAttribute('checked');
    }
    onInput() {
      var t;
      this.host.value = (t = this.checkbox) == null ? void 0 : t.checked;
    }
    render(t) {
      const { element: e } = t;
      return y`
      <label part="checkbox-label" for=${v}>
        <input
          id=${v}
          part="checkbox-input"
          type="checkbox"
          aria-describedby=${x}
          name=${e.getAttribute('name') ?? ''}
          value=${e.getAttribute('value') ?? 'on'}
          ?checked=${this.host.value === !0}
          ?disabled=${e.hasAttribute('disabled')}
          ?required=${e.hasAttribute('required')}
        />
        <span part="checkbox-text">${e.label}</span>
      </label>
    `;
    }
    isValid() {
      var t;
      return ((t = this.checkbox) == null ? void 0 : t.checkValidity()) ?? null;
    }
    getSelectedOptions() {
      var t;
      return this.getValue()
        ? [
            {
              value: this.getHostAttribute('value', ((t = this.checkbox) == null ? void 0 : t.value) ?? 'on'),
              label: this.host.label || this.getHostAttribute('value', 'on'),
            },
          ]
        : [];
    }
    hasPlaceholder() {
      return !1;
    }
    isHoverlabelActive() {
      return !1;
    }
    isLabelHidden() {
      return !0;
    }
  };
gt.types = ['checkbox'];
let U = gt;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ class G extends he {
  constructor(t) {
    if ((super(t), (this.it = $), t.type !== de.CHILD))
      throw Error(this.constructor.directiveName + '() can only be used in child bindings');
  }
  render(t) {
    if (t === $ || t == null) return ((this._t = void 0), (this.it = t));
    if (t === ne) return t;
    if (typeof t != 'string') throw Error(this.constructor.directiveName + '() called with a non-string value');
    if (t === this.it) return this._t;
    this.it = t;
    const e = [t];
    return ((e.raw = e), (this._t = { _$litType$: this.constructor.resultType, strings: e, values: [] }));
  }
}
((G.directiveName = 'unsafeHTML'), (G.resultType = 1));
const ft = ue(G);
function ke(i) {
  const t = i.querySelector('options');
  return t instanceof HTMLElement
    ? Array.from(t.querySelectorAll('option')).map((e) => ({
        value: e.value,
        label: e.label || e.textContent || e.value,
        disabled: e.disabled,
        html: e.innerHTML || void 0,
      }))
    : [];
}
function P(i) {
  return i.options && i.options.length > 0 ? i.options : ke(i);
}
function xe(i) {
  const t = i.trim();
  if (!t) return [];
  if (t.startsWith('['))
    try {
      const e = JSON.parse(t);
      if (Array.isArray(e)) return e.map((r) => String(r));
    } catch {}
  return t
    .split(/[;,]/)
    .map((e) => e.trim())
    .filter(Boolean);
}
function T(i) {
  return Array.isArray(i)
    ? i.map((t) => String(t)).filter(Boolean)
    : typeof i == 'boolean'
      ? i
        ? ['true']
        : []
      : i == null
        ? []
        : xe(String(i));
}
function ee(i, t) {
  const e = new Set(Array.from(t).map((r) => String(r)));
  return P(i).filter((r) => e.has(r.value));
}
const Ie = 'select{width:100%;min-width:0;color:inherit;font:inherit;background:transparent;border:0;outline:0}',
  yt = class yt extends O {
    getStyleSheet() {
      return Ie;
    }
    get select() {
      return this.query('select');
    }
    getFormElement() {
      return this.select;
    }
    render(t) {
      const { element: e } = t,
        r = P(e),
        a = T(this.host.value)[0] ?? '';
      return y`
      <select
        id=${v}
        part="select"
        name=${e.getAttribute('name') ?? ''}
        aria-describedby=${x}
        ?disabled=${e.hasAttribute('disabled')}
        ?required=${e.hasAttribute('required')}
      >
        ${r.map(
          (n) => y`
            <option
              value=${n.value}
              ?disabled=${!!n.disabled}
              ?selected=${n.value === a}
            >
              ${this.renderOptionLabel(n) ?? $}
            </option>
          `,
        )}
      </select>
    `;
    }
    onInput() {
      var t;
      this.host.value = ((t = this.select) == null ? void 0 : t.value) ?? '';
    }
    onChange() {
      this.onInput();
    }
    isValid() {
      var t;
      return ((t = this.select) == null ? void 0 : t.checkValidity()) ?? null;
    }
    getValue() {
      return this.host.value;
    }
    getSelectedOptions() {
      return ee(this.host, T(this.host.value));
    }
    renderOptionLabel(t) {
      return t.html ? ft(t.html) : t.label;
    }
  };
yt.types = ['select'];
let Q = yt;
const Ee = '[part~=option-list]{width:100%}',
  wt = class wt extends O {
    getStyleSheet() {
      return Ee;
    }
    get inputs() {
      return this.queryAll('#control input');
    }
    getFormElement() {
      return this.inputs[0] ?? null;
    }
    getInitValue() {
      return this.normalizeSelectedValues(this.host.getAttribute('value'));
    }
    render(t) {
      const { element: e } = t,
        r = P(e),
        a = new Set(this.normalizeSelectedValues(this.host.value)),
        n = e.multiple ? 'checkbox' : 'radio',
        o = e.getAttribute('name') ?? `${v}-group`,
        d = e.multiple ? 'group' : 'radiogroup';
      return y`
      <div
        id=${`${v}-group`}
        part="option-list"
        role=${d}
        aria-describedby=${x}
      >
        ${r.map((I, V) => {
          const E = V === 0 ? v : `${v}-${V}`;
          return y`
            <label part="option-label" for=${E}>
              <input
                id=${E}
                part="option-input"
                type=${n}
                name=${o}
                value=${I.value}
                aria-describedby=${x}
                ?checked=${a.has(I.value)}
                ?disabled=${!!I.disabled || e.hasAttribute('disabled')}
                ?required=${!e.multiple && e.hasAttribute('required')}
              />
              <span part="option-text">${this.renderOptionLabel(I) ?? $}</span>
            </label>
          `;
        })}
      </div>
    `;
    }
    onInput() {
      this.host.value = this.getSelectedValuesFromInputs();
    }
    onChange() {
      this.onInput();
    }
    getValue() {
      return this.host.value;
    }
    getFormValue() {
      return this.createFormData(this.normalizeSelectedValues(this.host.value));
    }
    getSelectedOptions() {
      return ee(this.host, this.normalizeSelectedValues(this.host.value));
    }
    hasPlaceholder() {
      return !1;
    }
    isHoverlabelActive() {
      return this.hasValue();
    }
    normalizeSelectedValues(t) {
      const e = T(t);
      return this.host.multiple ? e : e.slice(0, 1);
    }
    getSelectedValuesFromInputs() {
      return this.inputs.filter((t) => t.checked).map((t) => t.value);
    }
    renderOptionLabel(t) {
      return t.html ? ft(t.html) : t.label;
    }
  };
wt.types = ['select-radio'];
let X = wt;
const Ce = 'input{width:100%;min-width:0;color:inherit;font:inherit;background:transparent;border:0;outline:0}',
  St = class St extends O {
    getStyleSheet() {
      return Ce;
    }
    get input() {
      return this.query('input');
    }
    getFormElement() {
      return this.input;
    }
    onInput() {
      var t;
      this.host.value = (t = this.input) == null ? void 0 : t.value;
    }
    render(t) {
      const { element: e, type: r } = t;
      return y`
      <input
        id=${v}
        part="input"
        type=${r}
        name=${e.getAttribute('name') ?? ''}
        .value=${this.normalizeStringValue(this.host.value)}
        placeholder=${e.getAttribute('placeholder') ?? ''}
        aria-describedby=${x}
        pattern=${q(e.getAttribute('pattern') ?? void 0)}
        minlength=${q(e.getAttribute('minlength') ?? void 0)}
        maxlength=${q(e.getAttribute('maxlength') ?? void 0)}
        ?disabled=${e.hasAttribute('disabled')}
        ?readonly=${e.hasAttribute('readonly')}
        ?required=${e.hasAttribute('required')}
      />
    `;
    }
    isValid() {
      return this.query('input').checkValidity();
    }
    getValue() {
      var t;
      return (t = this.input) == null ? void 0 : t.value;
    }
  };
St.types = ['text', 'email', 'password'];
let Z = St;
const He =
    'textarea{width:100%;min-width:0;color:inherit;font:inherit;background:transparent;border:0;outline:0;overflow-y:hidden;resize:none}',
  _t = class _t extends O {
    getStyleSheet() {
      return He;
    }
    get textarea() {
      return this.query('textarea');
    }
    getFormElement() {
      return this.textarea;
    }
    render(t) {
      const { element: e } = t;
      return y`
      <textarea
        id=${v}
        part="textarea"
        rows=${e.getAttribute('rows') ?? '3'}
        name=${e.getAttribute('name') ?? ''}
        .value=${this.normalizeStringValue(this.host.value)}
        placeholder=${e.getAttribute('placeholder') ?? ''}
        aria-describedby=${x}
        minlength=${q(e.getAttribute('minlength') ?? void 0)}
        maxlength=${q(e.getAttribute('maxlength') ?? void 0)}
        ?disabled=${e.hasAttribute('disabled')}
        ?readonly=${e.hasAttribute('readonly')}
        ?required=${e.hasAttribute('required')}
      ></textarea>
    `;
    }
    updated() {
      this.clampHeight();
    }
    onInput() {
      var t;
      ((this.host.value = ((t = this.textarea) == null ? void 0 : t.value) ?? ''), this.clampHeight());
    }
    getValue() {
      return this.host.value;
    }
    isValid() {
      var t;
      return ((t = this.textarea) == null ? void 0 : t.checkValidity()) ?? null;
    }
    clampHeight() {
      const t = this.textarea;
      if (!t) return;
      t.style.height = 'auto';
      const e = getComputedStyle(t),
        r = this.parsePixelValue(t.style.minHeight || e.minHeight) ?? 0,
        a = this.parsePixelValue(t.style.maxHeight || e.maxHeight) ?? Number.POSITIVE_INFINITY,
        n = Math.min(Math.max(t.scrollHeight, r), a);
      ((t.style.height = `${n}px`), (t.style.overflowY = t.scrollHeight > a ? 'auto' : 'hidden'));
    }
    parsePixelValue(t) {
      const e = Number.parseFloat(t);
      return Number.isFinite(e) ? e : void 0;
    }
  };
_t.types = ['textarea'];
let tt = _t;
const Fe = '[part~=token-list]{display:flex;flex-wrap:wrap;width:100%}[part~=token-input]{min-width:0}',
  At = class At extends O {
    constructor() {
      (super(...arguments),
        (this.handleDraftInput = () => {
          this.syncHostState();
        }),
        (this.handleDraftCommit = () => {
          this.commitDraftValue();
        }),
        (this.handleKeydown = (t) => {
          var e;
          if (t.key === 'Enter' || t.key === ',' || t.key === ';') {
            (t.preventDefault(), this.commitDraftValue());
            return;
          }
          if (t.key === 'Backspace' && !((e = this.input) != null && e.value)) {
            const r = this.normalizeSelectedValues(this.host.value),
              a = r[r.length - 1];
            a && (t.preventDefault(), this.removeToken(a));
          }
        }));
    }
    getStyleSheet() {
      return Fe;
    }
    get input() {
      return this.query('input[type="text"]');
    }
    getFormElement() {
      return this.input;
    }
    get isStrict() {
      return this.host.hasAttribute('strict');
    }
    getInitValue() {
      return this.normalizeSelectedValues(this.host.getAttribute('value'));
    }
    render(t) {
      const { element: e } = t,
        r = this.normalizeSelectedValues(this.host.value),
        a = this.getAvailableOptions(r);
      return y`
      <div part="token-list" aria-describedby=${x}>
        ${r.map((n) => {
          const o = this.resolveOption(n),
            d = o != null && o.html ? ft(o.html) : ((o == null ? void 0 : o.label) ?? n);
          return y`
            <span part="token">
              <span part="token-text">${d ?? $}</span>
              <button
                type="button"
                part="token-remove"
                aria-label=${`Token "${(o == null ? void 0 : o.label) ?? n}" entfernen`}
                ?disabled=${e.hasAttribute('disabled') || e.hasAttribute('readonly')}
                @click=${() => this.removeToken(n)}
              >
                ×
              </button>
            </span>
          `;
        })}

        <input
          id=${v}
          part="token-input"
          type="text"
          list=${a.length > 0 ? `${v}-options` : ''}
          placeholder=${e.getAttribute('placeholder') ?? ''}
          aria-describedby=${x}
          ?disabled=${e.hasAttribute('disabled')}
          ?readonly=${e.hasAttribute('readonly')}
          @input=${this.handleDraftInput}
          @change=${this.handleDraftCommit}
          @blur=${this.handleDraftCommit}
          @keydown=${this.handleKeydown}
        />
      </div>

      ${
        a.length > 0
          ? y`
            <datalist id=${`${v}-options`}>
              ${a.map((n) => y`<option value=${n.value}>${n.label}</option>`)}
            </datalist>
          `
          : $
      }
    `;
    }
    onInput(t) {
      t.target === this.input && this.syncHostState();
    }
    onChange(t) {
      t.target === this.input && this.commitDraftValue();
    }
    getValue() {
      return this.normalizeSelectedValues(this.host.value);
    }
    getSelectedOptions() {
      return this.normalizeSelectedValues(this.host.value).map((t) => this.resolveOption(t) ?? { value: t, label: t });
    }
    isValid() {
      return !this.host.hasAttribute('required') || this.host.hasAttribute('disabled')
        ? !0
        : this.normalizeSelectedValues(this.host.value).length > 0;
    }
    isHoverlabelActive() {
      var t;
      return (
        this.hasValue() ||
        this.getDraftValue().length > 0 ||
        ((t = this.host.shadowRoot) == null ? void 0 : t.activeElement) === this.input
      );
    }
    formResetCallback() {
      ((this.host.value = this.getInitValue()), this.clearDraftValue());
    }
    updated() {
      const t = this.normalizeSelectedValues(this.host.value);
      this.areValuesEqual(this.host.value, t) || (this.host.value = t);
    }
    normalizeSelectedValues(t) {
      const e = Array.from(new Set(T(t)));
      return this.isStrict ? e.filter((r) => this.resolveOption(r)) : e;
    }
    getDraftValue() {
      var t;
      return ((t = this.input) == null ? void 0 : t.value.trim()) ?? '';
    }
    clearDraftValue() {
      this.input && (this.input.value = '');
    }
    commitDraftValue() {
      this.addTokens(this.getDraftValue());
    }
    addTokens(t) {
      if (!t || this.host.hasAttribute('disabled') || this.host.hasAttribute('readonly')) return;
      const e = this.normalizeSelectedValues([
        ...this.normalizeSelectedValues(this.host.value),
        ...t
          .split(/[;,\n]/)
          .map((r) => r.trim())
          .filter(Boolean),
      ]);
      ((this.host.value = e), this.clearDraftValue(), this.dispatchValueEvents());
    }
    removeToken(t) {
      var e;
      this.host.hasAttribute('disabled') ||
        this.host.hasAttribute('readonly') ||
        ((this.host.value = this.normalizeSelectedValues(this.host.value).filter((r) => r !== t)),
        this.dispatchValueEvents(),
        (e = this.input) == null || e.focus());
    }
    getAvailableOptions(t) {
      const e = new Set(t);
      return P(this.host).filter((r) => !r.disabled && !e.has(r.value));
    }
    resolveOption(t) {
      return P(this.host).find((e) => e.value === t) ?? null;
    }
    areValuesEqual(t, e) {
      const r = T(t);
      return r.length === e.length && r.every((a, n) => a === e[n]);
    }
    dispatchValueEvents() {
      (this.host.dispatchEvent(new InputEvent('input', { bubbles: !0, composed: !0 })),
        this.host.dispatchEvent(new Event('change', { bubbles: !0, composed: !0 })));
    }
  };
At.types = ['token-input'];
let et = At;
F.registerPlugin(Z);
F.registerPlugin(tt);
F.registerPlugin(Q);
F.registerPlugin(X);
F.registerPlugin(U);
F.registerPlugin(et);
function je(i, t, e) {
  const r = new DOMParser().parseFromString(t, 'text/html'),
    a = r.body,
    n = r.querySelector('main'),
    o = document.createElement('div');
  ((o.className = 'nte-input-demo'),
    a.className.trim() && o.classList.add(...a.className.trim().split(/\s+/)),
    a.querySelectorAll('script').forEach((d) => d.remove()),
    (o.innerHTML = n ? n.outerHTML : a.innerHTML),
    i.replaceChildren(o),
    e == null || e(o));
}
function Oe(i = document) {
  const t = i.querySelector('#formdata-demo-form'),
    e = i.querySelector('#formdata-json');
  !(t instanceof HTMLFormElement) ||
    !(e instanceof HTMLTextAreaElement) ||
    t.addEventListener('submit', (r) => {
      r.preventDefault();
      const a = Array.from(new FormData(t).entries()).map(([n, o]) => ({ key: n, value: String(o) }));
      e.value = JSON.stringify(a, null, 2);
    });
}
function Me(i = document) {
  const t = i.querySelector('#form-data-demo'),
    e = i.querySelector('#form-data-json');
  if (!(t instanceof HTMLElement) || !(e instanceof HTMLTextAreaElement)) return;
  const r = new Ae(t);
  let a = !1;
  const n = () => {
      a || ((e.value = JSON.stringify(r.data, null, 2)), (e.dataset.invalid = 'false'));
    },
    o = () => {
      try {
        const d = JSON.parse(e.value);
        if (!d || typeof d != 'object' || Array.isArray(d)) throw new Error('JSON must be an object');
        ((a = !0), (r.data = d), (a = !1), (e.dataset.invalid = 'false'), (e.value = JSON.stringify(r.data, null, 2)));
      } catch {
        ((a = !1), (e.dataset.invalid = 'true'));
      }
    };
  (t.addEventListener('input', () => {
    n();
  }),
    t.addEventListener('change', () => {
      n();
    }),
    e.addEventListener('input', () => {
      o();
    }),
    n());
}
function Le(i = document) {
  const t = i.querySelector('form[action="/demo/05-validation.html"]');
  t instanceof HTMLFormElement &&
    t.addEventListener('submit', (e) => {
      e.preventDefault();
    });
}
Oe();
Me();
Le();
export { Me as a, Le as b, je as r, Oe as s };
