const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      './01-accordion.demo-1YdZNhE9.js',
      './nextrap-element-DeSHPIJn.js',
      './property-C2fH_zxw.js',
      './types-4rIte7rE.js',
      './main-DJlBaRux.js',
      './index-BR6EnczS.js',
      './index-NZ9cz-wL.css',
      './main-BIf4yaEM.css',
      './default-BwsF4NH7.css',
      './default-DpgNaR57.css',
      './02-ntl-2col-pairing.demo-DBDJfown.js',
      './01-data.demo-BatkvBRi.js',
      './nte-table-CxwpBr-M.js',
      './01-overview.demo-DgJThnJW.js',
      './02-hover-style.demo-CZ9vKRje.js',
      './main-NvqPSaEw.js',
      './state-C6dwV5NT.js',
      './index-l0sNRNKZ.js',
      './directive-CJw_OlP2.js',
      './index-K51eAYk-.js',
      './main-BkomUfB9.css',
      './03-form-action.demo-B590AC6d.js',
      './04-form-data.demo-C6Xe2w-y.js',
      './05-validation.demo-C9OFkb5o.js',
      './06-select-radio-vertical.demo-Dfaa66j_.js',
      './01-overview.demo-B-xOu2B4.js',
      './02-horizontal.demo-D83oWlUC.js',
      './main-DR47ULvy.js',
      './main-DB5gMEmW.css',
      './03-vertical.demo-CrcD-UKg.js',
      './04-responsive-order.demo-BsGsdKH7.js',
      './05-variations.demo-CcLS-aTa.js',
      './01-overview.demo-CeTp9POA.js',
      './nte-privacy-consent-D9iLXL-8.js',
      './02-dialog.demo-BZYhm0WE.js',
      './02-dialog-D7AvL1F7.css',
      './01-bars.demo-BJ2kYgPC.js',
      './main-BZQs5zp3.js',
      './02-circles.demo-BsAG5dcM.js',
      './03-interactive.demo-Cl_tQHib.js',
      './01-overview.demo-CgiOpPUU.js',
      './main-BAN3CDRl.js',
      './main-BfODleGo.css',
      './02-interactive.demo-D4HinYvj.js',
      './01-table-viewport.demo-3PFoPjob.js',
      './main-DdSR5ezP.css',
      './02-live-layout.demo-6GqHptaV.js',
      './03-tbody-scroll.demo-xkE9oo5v.js',
      './04-header-styles.demo-BNQgnsZ6.js',
      './05-search-selection.demo-z-ssZgOs.js',
      './06-caption-overflow.demo-V1PUKWTC.js',
      './07-plugins.demo-Bh9fW3uG.js',
      './01-buttons.demo-DIU04Lfz.js',
      './01-buttons-Dz5qLpiw.css',
      './01-overview.demo-DtoCTkOp.js',
      './01-overview-CAeFBW1Z.css',
      './01-switches.demo-DtxHu6pV.js',
      './01-switches-BvxNhFWj.css',
      './01-overview.demo-Ds93UuPS.js',
      './01-overview-a4rCpFNd.css',
    ]),
) => i.map((i) => d[i]);
var xn = Object.defineProperty;
var ct = (i) => {
  throw TypeError(i);
};
var wn = (i, e, t) => (e in i ? xn(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : (i[e] = t));
var O = (i, e, t) => wn(i, typeof e != 'symbol' ? e + '' : e, t),
  Me = (i, e, t) => e.has(i) || ct('Cannot ' + t);
var u = (i, e, t) => (Me(i, e, 'read from private field'), t ? t.call(i) : e.get(i)),
  v = (i, e, t) =>
    e.has(i) ? ct('Cannot add the same private member more than once') : e instanceof WeakSet ? e.add(i) : e.set(i, t),
  x = (i, e, t, n) => (Me(i, e, 'write to private field'), n ? n.call(i, t) : e.set(i, t), t),
  c = (i, e, t) => (Me(i, e, 'access private method'), t);
var ht = (i, e, t, n) => ({
  set _(r) {
    x(i, e, r, t);
  },
  get _() {
    return u(i, e, n);
  },
});
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Ee = globalThis,
  at =
    Ee.ShadowRoot &&
    (Ee.ShadyCSS === void 0 || Ee.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype,
  lt = Symbol(),
  ut = new WeakMap();
let Dt = class {
  constructor(e, t, n) {
    if (((this._$cssResult$ = !0), n !== lt))
      throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    ((this.cssText = e), (this.t = t));
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (at && e === void 0) {
      const n = t !== void 0 && t.length === 1;
      (n && (e = ut.get(t)),
        e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && ut.set(t, e)));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const G = (i) => new Dt(typeof i == 'string' ? i : i + '', void 0, lt),
  En = (i, ...e) => {
    const t =
      i.length === 1
        ? i[0]
        : e.reduce(
            (n, r, s) =>
              n +
              ((o) => {
                if (o._$cssResult$ === !0) return o.cssText;
                if (typeof o == 'number') return o;
                throw Error(
                  "Value passed to 'css' function must be a 'css' function result: " +
                    o +
                    ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.",
                );
              })(r) +
              i[s + 1],
            i[0],
          );
    return new Dt(t, i, lt);
  },
  $n = (i, e) => {
    if (at) i.adoptedStyleSheets = e.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet));
    else
      for (const t of e) {
        const n = document.createElement('style'),
          r = Ee.litNonce;
        (r !== void 0 && n.setAttribute('nonce', r), (n.textContent = t.cssText), i.appendChild(n));
      }
  },
  pt = at
    ? (i) => i
    : (i) =>
        i instanceof CSSStyleSheet
          ? ((e) => {
              let t = '';
              for (const n of e.cssRules) t += n.cssText;
              return G(t);
            })(i)
          : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const {
    is: An,
    defineProperty: kn,
    getOwnPropertyDescriptor: Cn,
    getOwnPropertyNames: Pn,
    getOwnPropertySymbols: Sn,
    getPrototypeOf: On,
  } = Object,
  M = globalThis,
  mt = M.trustedTypes,
  Ln = mt ? mt.emptyScript : '',
  Ne = M.reactiveElementPolyfillSupport,
  ue = (i, e) => i,
  qe = {
    toAttribute(i, e) {
      switch (e) {
        case Boolean:
          i = i ? Ln : null;
          break;
        case Object:
        case Array:
          i = i == null ? i : JSON.stringify(i);
      }
      return i;
    },
    fromAttribute(i, e) {
      let t = i;
      switch (e) {
        case Boolean:
          t = i !== null;
          break;
        case Number:
          t = i === null ? null : Number(i);
          break;
        case Object:
        case Array:
          try {
            t = JSON.parse(i);
          } catch {
            t = null;
          }
      }
      return t;
    },
  },
  jt = (i, e) => !An(i, e),
  ft = { attribute: !0, type: String, converter: qe, reflect: !1, useDefault: !1, hasChanged: jt };
(Symbol.metadata ?? (Symbol.metadata = Symbol('metadata')),
  M.litPropertyMetadata ?? (M.litPropertyMetadata = new WeakMap()));
let Z = class extends HTMLElement {
  static addInitializer(e) {
    (this._$Ei(), (this.l ?? (this.l = [])).push(e));
  }
  static get observedAttributes() {
    return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
  }
  static createProperty(e, t = ft) {
    if (
      (t.state && (t.attribute = !1),
      this._$Ei(),
      this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0),
      this.elementProperties.set(e, t),
      !t.noAccessor)
    ) {
      const n = Symbol(),
        r = this.getPropertyDescriptor(e, n, t);
      r !== void 0 && kn(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, n) {
    const { get: r, set: s } = Cn(this.prototype, e) ?? {
      get() {
        return this[t];
      },
      set(o) {
        this[t] = o;
      },
    };
    return {
      get: r,
      set(o) {
        const l = r == null ? void 0 : r.call(this);
        (s == null || s.call(this, o), this.requestUpdate(e, l, n));
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ft;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ue('elementProperties'))) return;
    const e = On(this);
    (e.finalize(), e.l !== void 0 && (this.l = [...e.l]), (this.elementProperties = new Map(e.elementProperties)));
  }
  static finalize() {
    if (this.hasOwnProperty(ue('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(ue('properties')))) {
      const t = this.properties,
        n = [...Pn(t), ...Sn(t)];
      for (const r of n) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [n, r] of t) this.elementProperties.set(n, r);
    }
    this._$Eh = new Map();
    for (const [t, n] of this.elementProperties) {
      const r = this._$Eu(t, n);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const r of n) t.unshift(pt(r));
    } else e !== void 0 && t.push(pt(e));
    return t;
  }
  static _$Eu(e, t) {
    const n = t.attribute;
    return n === !1 ? void 0 : typeof n == 'string' ? n : typeof e == 'string' ? e.toLowerCase() : void 0;
  }
  constructor() {
    (super(),
      (this._$Ep = void 0),
      (this.isUpdatePending = !1),
      (this.hasUpdated = !1),
      (this._$Em = null),
      this._$Ev());
  }
  _$Ev() {
    var e;
    ((this._$ES = new Promise((t) => (this.enableUpdating = t))),
      (this._$AL = new Map()),
      this._$E_(),
      this.requestUpdate(),
      (e = this.constructor.l) == null || e.forEach((t) => t(this)));
  }
  addController(e) {
    var t;
    ((this._$EO ?? (this._$EO = new Set())).add(e),
      this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e)));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = new Map(),
      t = this.constructor.elementProperties;
    for (const n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ($n(e, this.constructor.elementStyles), e);
  }
  connectedCallback() {
    var e;
    (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()),
      this.enableUpdating(!0),
      (e = this._$EO) == null ||
        e.forEach((t) => {
          var n;
          return (n = t.hostConnected) == null ? void 0 : n.call(t);
        }));
  }
  enableUpdating(e) {}
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null ||
      e.forEach((t) => {
        var n;
        return (n = t.hostDisconnected) == null ? void 0 : n.call(t);
      });
  }
  attributeChangedCallback(e, t, n) {
    this._$AK(e, n);
  }
  _$ET(e, t) {
    var s;
    const n = this.constructor.elementProperties.get(e),
      r = this.constructor._$Eu(e, n);
    if (r !== void 0 && n.reflect === !0) {
      const o = (((s = n.converter) == null ? void 0 : s.toAttribute) !== void 0 ? n.converter : qe).toAttribute(
        t,
        n.type,
      );
      ((this._$Em = e), o == null ? this.removeAttribute(r) : this.setAttribute(r, o), (this._$Em = null));
    }
  }
  _$AK(e, t) {
    var s, o;
    const n = this.constructor,
      r = n._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const l = n.getPropertyOptions(r),
        a =
          typeof l.converter == 'function'
            ? { fromAttribute: l.converter }
            : ((s = l.converter) == null ? void 0 : s.fromAttribute) !== void 0
              ? l.converter
              : qe;
      this._$Em = r;
      const h = a.fromAttribute(t, l.type);
      ((this[r] = h ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? h), (this._$Em = null));
    }
  }
  requestUpdate(e, t, n, r = !1, s) {
    var o;
    if (e !== void 0) {
      const l = this.constructor;
      if (
        (r === !1 && (s = this[e]),
        n ?? (n = l.getPropertyOptions(e)),
        !(
          (n.hasChanged ?? jt)(s, t) ||
          (n.useDefault &&
            n.reflect &&
            s === ((o = this._$Ej) == null ? void 0 : o.get(e)) &&
            !this.hasAttribute(l._$Eu(e, n)))
        ))
      )
        return;
      this.C(e, t, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: n, reflect: r, wrapped: s }, o) {
    (n &&
      !(this._$Ej ?? (this._$Ej = new Map())).has(e) &&
      (this._$Ej.set(e, o ?? t ?? this[e]), s !== !0 || o !== void 0)) ||
      (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)),
      r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return (e != null && (await e), !this.isUpdatePending);
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var n;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if ((this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep)) {
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0)
        for (const [s, o] of r) {
          const { wrapped: l } = o,
            a = this[s];
          l !== !0 || this._$AL.has(s) || a === void 0 || this.C(s, void 0, o, a);
        }
    }
    let e = !1;
    const t = this._$AL;
    try {
      ((e = this.shouldUpdate(t)),
        e
          ? (this.willUpdate(t),
            (n = this._$EO) == null ||
              n.forEach((r) => {
                var s;
                return (s = r.hostUpdate) == null ? void 0 : s.call(r);
              }),
            this.update(t))
          : this._$EM());
    } catch (r) {
      throw ((e = !1), this._$EM(), r);
    }
    e && this._$AE(t);
  }
  willUpdate(e) {}
  _$AE(e) {
    var t;
    ((t = this._$EO) == null ||
      t.forEach((n) => {
        var r;
        return (r = n.hostUpdated) == null ? void 0 : r.call(n);
      }),
      this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(e)),
      this.updated(e));
  }
  _$EM() {
    ((this._$AL = new Map()), (this.isUpdatePending = !1));
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    (this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM());
  }
  updated(e) {}
  firstUpdated(e) {}
};
((Z.elementStyles = []),
  (Z.shadowRootOptions = { mode: 'open' }),
  (Z[ue('elementProperties')] = new Map()),
  (Z[ue('finalized')] = new Map()),
  Ne == null || Ne({ ReactiveElement: Z }),
  (M.reactiveElementVersions ?? (M.reactiveElementVersions = [])).push('2.1.2'));
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const pe = globalThis,
  gt = (i) => i,
  Pe = pe.trustedTypes,
  _t = Pe ? Pe.createPolicy('lit-html', { createHTML: (i) => i }) : void 0,
  Tt = '$lit$',
  I = `lit$${Math.random().toFixed(9).slice(2)}$`,
  It = '?' + I,
  Rn = `<${It}>`,
  J = document,
  fe = () => J.createComment(''),
  ge = (i) => i === null || (typeof i != 'object' && typeof i != 'function'),
  dt = Array.isArray,
  Dn = (i) => dt(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == 'function',
  Ve = `[ 	
\f\r]`,
  le = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  vt = /-->/g,
  bt = />/g,
  V = RegExp(
    `>|${Ve}(?:([^\\s"'>=/]+)(${Ve}*=${Ve}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,
    'g',
  ),
  yt = /'/g,
  xt = /"/g,
  Ht = /^(?:script|style|textarea|title)$/i,
  jn =
    (i) =>
    (e, ...t) => ({ _$litType$: i, strings: e, values: t }),
  E = jn(1),
  ie = Symbol.for('lit-noChange'),
  w = Symbol.for('lit-nothing'),
  wt = new WeakMap(),
  U = J.createTreeWalker(J, 129);
function Mt(i, e) {
  if (!dt(i) || !i.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return _t !== void 0 ? _t.createHTML(e) : e;
}
const Tn = (i, e) => {
  const t = i.length - 1,
    n = [];
  let r,
    s = e === 2 ? '<svg>' : e === 3 ? '<math>' : '',
    o = le;
  for (let l = 0; l < t; l++) {
    const a = i[l];
    let h,
      p,
      m = -1,
      b = 0;
    for (; b < a.length && ((o.lastIndex = b), (p = o.exec(a)), p !== null);)
      ((b = o.lastIndex),
        o === le
          ? p[1] === '!--'
            ? (o = vt)
            : p[1] !== void 0
              ? (o = bt)
              : p[2] !== void 0
                ? (Ht.test(p[2]) && (r = RegExp('</' + p[2], 'g')), (o = V))
                : p[3] !== void 0 && (o = V)
          : o === V
            ? p[0] === '>'
              ? ((o = r ?? le), (m = -1))
              : p[1] === void 0
                ? (m = -2)
                : ((m = o.lastIndex - p[2].length), (h = p[1]), (o = p[3] === void 0 ? V : p[3] === '"' ? xt : yt))
            : o === xt || o === yt
              ? (o = V)
              : o === vt || o === bt
                ? (o = le)
                : ((o = V), (r = void 0)));
    const A = o === V && i[l + 1].startsWith('/>') ? ' ' : '';
    s += o === le ? a + Rn : m >= 0 ? (n.push(h), a.slice(0, m) + Tt + a.slice(m) + I + A) : a + I + (m === -2 ? l : A);
  }
  return [Mt(i, s + (i[t] || '<?>') + (e === 2 ? '</svg>' : e === 3 ? '</math>' : '')), n];
};
class _e {
  constructor({ strings: e, _$litType$: t }, n) {
    let r;
    this.parts = [];
    let s = 0,
      o = 0;
    const l = e.length - 1,
      a = this.parts,
      [h, p] = Tn(e, t);
    if (((this.el = _e.createElement(h, n)), (U.currentNode = this.el.content), t === 2 || t === 3)) {
      const m = this.el.content.firstChild;
      m.replaceWith(...m.childNodes);
    }
    for (; (r = U.nextNode()) !== null && a.length < l;) {
      if (r.nodeType === 1) {
        if (r.hasAttributes())
          for (const m of r.getAttributeNames())
            if (m.endsWith(Tt)) {
              const b = p[o++],
                A = r.getAttribute(m).split(I),
                $ = /([.?@])?(.*)/.exec(b);
              (a.push({
                type: 1,
                index: s,
                name: $[2],
                strings: A,
                ctor: $[1] === '.' ? Hn : $[1] === '?' ? Mn : $[1] === '@' ? Nn : Te,
              }),
                r.removeAttribute(m));
            } else m.startsWith(I) && (a.push({ type: 6, index: s }), r.removeAttribute(m));
        if (Ht.test(r.tagName)) {
          const m = r.textContent.split(I),
            b = m.length - 1;
          if (b > 0) {
            r.textContent = Pe ? Pe.emptyScript : '';
            for (let A = 0; A < b; A++) (r.append(m[A], fe()), U.nextNode(), a.push({ type: 2, index: ++s }));
            r.append(m[b], fe());
          }
        }
      } else if (r.nodeType === 8)
        if (r.data === It) a.push({ type: 2, index: s });
        else {
          let m = -1;
          for (; (m = r.data.indexOf(I, m + 1)) !== -1;) (a.push({ type: 7, index: s }), (m += I.length - 1));
        }
      s++;
    }
  }
  static createElement(e, t) {
    const n = J.createElement('template');
    return ((n.innerHTML = e), n);
  }
}
function se(i, e, t = i, n) {
  var o, l;
  if (e === ie) return e;
  let r = n !== void 0 ? ((o = t._$Co) == null ? void 0 : o[n]) : t._$Cl;
  const s = ge(e) ? void 0 : e._$litDirective$;
  return (
    (r == null ? void 0 : r.constructor) !== s &&
      ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1),
      s === void 0 ? (r = void 0) : ((r = new s(i)), r._$AT(i, t, n)),
      n !== void 0 ? ((t._$Co ?? (t._$Co = []))[n] = r) : (t._$Cl = r)),
    r !== void 0 && (e = se(i, r._$AS(i, e.values), r, n)),
    e
  );
}
class In {
  constructor(e, t) {
    ((this._$AV = []), (this._$AN = void 0), (this._$AD = e), (this._$AM = t));
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const {
        el: { content: t },
        parts: n,
      } = this._$AD,
      r = ((e == null ? void 0 : e.creationScope) ?? J).importNode(t, !0);
    U.currentNode = r;
    let s = U.nextNode(),
      o = 0,
      l = 0,
      a = n[0];
    for (; a !== void 0;) {
      if (o === a.index) {
        let h;
        (a.type === 2
          ? (h = new ae(s, s.nextSibling, this, e))
          : a.type === 1
            ? (h = new a.ctor(s, a.name, a.strings, this, e))
            : a.type === 6 && (h = new Vn(s, this, e)),
          this._$AV.push(h),
          (a = n[++l]));
      }
      o !== (a == null ? void 0 : a.index) && ((s = U.nextNode()), o++);
    }
    return ((U.currentNode = J), r);
  }
  p(e) {
    let t = 0;
    for (const n of this._$AV)
      (n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, t), (t += n.strings.length - 2)) : n._$AI(e[t])), t++);
  }
}
class ae {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, n, r) {
    ((this.type = 2),
      (this._$AH = w),
      (this._$AN = void 0),
      (this._$AA = e),
      (this._$AB = t),
      (this._$AM = n),
      (this.options = r),
      (this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0));
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return (t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e);
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    ((e = se(this, e, t)),
      ge(e)
        ? e === w || e == null || e === ''
          ? (this._$AH !== w && this._$AR(), (this._$AH = w))
          : e !== this._$AH && e !== ie && this._(e)
        : e._$litType$ !== void 0
          ? this.$(e)
          : e.nodeType !== void 0
            ? this.T(e)
            : Dn(e)
              ? this.k(e)
              : this._(e));
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), (this._$AH = this.O(e)));
  }
  _(e) {
    (this._$AH !== w && ge(this._$AH) ? (this._$AA.nextSibling.data = e) : this.T(J.createTextNode(e)),
      (this._$AH = e));
  }
  $(e) {
    var s;
    const { values: t, _$litType$: n } = e,
      r =
        typeof n == 'number'
          ? this._$AC(e)
          : (n.el === void 0 && (n.el = _e.createElement(Mt(n.h, n.h[0]), this.options)), n);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === r) this._$AH.p(t);
    else {
      const o = new In(r, this),
        l = o.u(this.options);
      (o.p(t), this.T(l), (this._$AH = o));
    }
  }
  _$AC(e) {
    let t = wt.get(e.strings);
    return (t === void 0 && wt.set(e.strings, (t = new _e(e))), t);
  }
  k(e) {
    dt(this._$AH) || ((this._$AH = []), this._$AR());
    const t = this._$AH;
    let n,
      r = 0;
    for (const s of e)
      (r === t.length ? t.push((n = new ae(this.O(fe()), this.O(fe()), this, this.options))) : (n = t[r]),
        n._$AI(s),
        r++);
    r < t.length && (this._$AR(n && n._$AB.nextSibling, r), (t.length = r));
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, t); e !== this._$AB;) {
      const r = gt(e).nextSibling;
      (gt(e).remove(), (e = r));
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && ((this._$Cv = e), (t = this._$AP) == null || t.call(this, e));
  }
}
class Te {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, n, r, s) {
    ((this.type = 1),
      (this._$AH = w),
      (this._$AN = void 0),
      (this.element = e),
      (this.name = t),
      (this._$AM = r),
      (this.options = s),
      n.length > 2 || n[0] !== '' || n[1] !== ''
        ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n))
        : (this._$AH = w));
  }
  _$AI(e, t = this, n, r) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) ((e = se(this, e, t, 0)), (o = !ge(e) || (e !== this._$AH && e !== ie)), o && (this._$AH = e));
    else {
      const l = e;
      let a, h;
      for (e = s[0], a = 0; a < s.length - 1; a++)
        ((h = se(this, l[n + a], t, a)),
          h === ie && (h = this._$AH[a]),
          o || (o = !ge(h) || h !== this._$AH[a]),
          h === w ? (e = w) : e !== w && (e += (h ?? '') + s[a + 1]),
          (this._$AH[a] = h));
    }
    o && !r && this.j(e);
  }
  j(e) {
    e === w ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? '');
  }
}
class Hn extends Te {
  constructor() {
    (super(...arguments), (this.type = 3));
  }
  j(e) {
    this.element[this.name] = e === w ? void 0 : e;
  }
}
class Mn extends Te {
  constructor() {
    (super(...arguments), (this.type = 4));
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== w);
  }
}
class Nn extends Te {
  constructor(e, t, n, r, s) {
    (super(e, t, n, r, s), (this.type = 5));
  }
  _$AI(e, t = this) {
    if ((e = se(this, e, t, 0) ?? w) === ie) return;
    const n = this._$AH,
      r = (e === w && n !== w) || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive,
      s = e !== w && (n === w || r);
    (r && this.element.removeEventListener(this.name, this, n),
      s && this.element.addEventListener(this.name, this, e),
      (this._$AH = e));
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == 'function'
      ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e)
      : this._$AH.handleEvent(e);
  }
}
class Vn {
  constructor(e, t, n) {
    ((this.element = e), (this.type = 6), (this._$AN = void 0), (this._$AM = t), (this.options = n));
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    se(this, e);
  }
}
const cr = { I: ae },
  Ue = pe.litHtmlPolyfillSupport;
(Ue == null || Ue(_e, ae), (pe.litHtmlVersions ?? (pe.litHtmlVersions = [])).push('3.3.3'));
const Un = (i, e, t) => {
  const n = (t == null ? void 0 : t.renderBefore) ?? e;
  let r = n._$litPart$;
  if (r === void 0) {
    const s = (t == null ? void 0 : t.renderBefore) ?? null;
    n._$litPart$ = r = new ae(e.insertBefore(fe(), s), s, void 0, t ?? {});
  }
  return (r._$AI(i), r);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const K = globalThis;
class S extends Z {
  constructor() {
    (super(...arguments), (this.renderOptions = { host: this }), (this._$Do = void 0));
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return ((t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e);
  }
  update(e) {
    const t = this.render();
    (this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
      super.update(e),
      (this._$Do = Un(t, this.renderRoot, this.renderOptions)));
  }
  connectedCallback() {
    var e;
    (super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0));
  }
  disconnectedCallback() {
    var e;
    (super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1));
  }
  render() {
    return ie;
  }
}
var Rt;
((S._$litElement$ = !0),
  (S.finalized = !0),
  (Rt = K.litElementHydrateSupport) == null || Rt.call(K, { LitElement: S }));
const ze = K.litElementPolyfillSupport;
ze == null || ze({ LitElement: S });
(K.litElementVersions ?? (K.litElementVersions = [])).push('4.2.2');
const zn =
    ':host{--tj-demo-control-gap: 12px}.controls-builtins{display:flex;flex-wrap:wrap;gap:var(--tj-demo-control-gap)}.controls-builtins:empty{display:none}.controls-builtins>button,.controls-builtins>input,.controls-builtins>select,.controls-builtins>textarea,.controls-builtins>*[data-tj-demo-control]{min-height:40px;padding:10px 14px;border:1px solid #94a3b8;border-radius:10px;background:#fff;color:#111827;font:inherit}.controls-builtins>button,.controls-builtins>select{cursor:pointer}.controls-builtins>textarea{min-width:220px;min-height:96px;resize:vertical}',
  Bn =
    ':host{--tj-demo-controls-rail-height: 38px;--tj-demo-controls-panel-height: 0px;position:fixed;bottom:0;left:0;width:100vw;z-index:15;display:block;color:#111827;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.shell{display:grid;grid-template-rows:minmax(0,var(--tj-demo-controls-panel-height)) var(--tj-demo-controls-rail-height);align-items:end}.shell.is-closed{grid-template-rows:0 var(--tj-demo-controls-rail-height)}.panel-wrapper{overflow:hidden}.panel{overflow:auto;padding:16px 20px;border-top:1px solid #d1d5db;background:#fffffff5;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 -8px 24px #0f172a14}.shell[hidden],.panel[hidden],:host([hidden]){display:none}.panel-content{display:grid;gap:12px}.slot-wrap.hidden{display:none}.rail{display:grid;grid-template-columns:48px 1fr auto;align-items:center;min-height:var(--tj-demo-controls-rail-height);background:#000;color:#fff}.toggle{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;padding:0;border:0;border-radius:0;background:transparent;color:inherit;cursor:pointer}.toggle:hover{background:#111827}.toggle-icon{font-size:18px;line-height:1}.label{padding:0 12px;font-size:.9rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.actions{display:flex;align-items:center;gap:8px;min-height:48px;padding-right:8px}',
  Et = 'tj-demo-controls:open';
var L, ve, f, Nt, be, Ke, Vt, Ge, Ut, zt, Bt, Ft, Je, de, qt, ce, Wt, Q;
const Oe = class Oe extends S {
  constructor() {
    super();
    v(this, f);
    v(this, L);
    v(this, ve);
    v(this, be);
    v(this, Q);
    ((this.controlsOpen = !0),
      (this.hasCustomControls = !1),
      x(this, ve, () => {
        this.controlsOpen = !this.controlsOpen;
      }),
      x(this, be, () => {
        (c(this, f, Ke).call(this), this.requestUpdate());
      }),
      x(this, Q, () => {
        (c(this, f, ce).call(this), c(this, f, de).call(this));
      }),
      (this.controlsOpen = c(this, f, zt).call(this)));
  }
  connectedCallback() {
    (super.connectedCallback(),
      c(this, f, Ft).call(this),
      c(this, f, de).call(this),
      c(this, f, ce).call(this),
      window.addEventListener('resize', u(this, Q)));
  }
  disconnectedCallback() {
    var t;
    (window.removeEventListener('resize', u(this, Q)),
      (t = u(this, L)) == null || t.disconnect(),
      c(this, f, qt).call(this),
      c(this, f, Wt).call(this),
      super.disconnectedCallback());
  }
  updated(t) {
    (super.updated(t),
      t.has('data') && c(this, f, Ge).call(this),
      t.has('controlsOpen') && (c(this, f, Bt).call(this), c(this, f, de).call(this), c(this, f, ce).call(this)));
  }
  render() {
    return E`
      <div class=${c(this, f, Nt).call(this)} ?hidden=${!c(this, f, Vt).call(this)}>
        <div class="panel-wrapper">
          <div class="panel" ?hidden=${!this.controlsOpen}>
            <div class="panel-content">
              <div id="builtin-controls" class="controls-builtins"></div>
              <div class=${this.hasCustomControls ? 'slot-wrap' : 'slot-wrap hidden'}>
                <slot name="controls" @slotchange=${u(this, be)}></slot>
              </div>
            </div>
          </div>
        </div>

        <div class="rail">
          <button
            class="toggle"
            type="button"
            aria-label=${this.controlsOpen ? 'Controls einklappen' : 'Controls ausklappen'}
            aria-expanded=${String(this.controlsOpen)}
            @click=${u(this, ve)}
          >
            <span class="toggle-icon" aria-hidden="true">${this.controlsOpen ? '▾' : '▴'}</span>
          </button>

          <div class="label">Controls</div>
          <div class="actions">
            <slot name="controls-actions"></slot>
          </div>
        </div>
      </div>
    `;
  }
  firstUpdated() {
    (c(this, f, Ke).call(this), c(this, f, Ge).call(this));
  }
};
((L = new WeakMap()),
  (ve = new WeakMap()),
  (f = new WeakSet()),
  (Nt = function () {
    return `shell ${this.controlsOpen ? 'is-open' : 'is-closed'}`;
  }),
  (be = new WeakMap()),
  (Ke = function () {
    const t = this.renderRoot.querySelector('slot[name="controls"]');
    if (!(t instanceof HTMLSlotElement)) {
      this.hasCustomControls = !1;
      return;
    }
    this.hasCustomControls = t.assignedNodes({ flatten: !0 }).some((n) => {
      var r;
      return n.nodeType !== Node.TEXT_NODE || ((r = n.textContent) == null ? void 0 : r.trim());
    });
  }),
  (Vt = function () {
    var t;
    return !!((t = this.data) != null && t.length) || this.hasCustomControls;
  }),
  (Ge = function () {
    const t = this.renderRoot.querySelector('#builtin-controls');
    if (t instanceof HTMLElement) {
      t.replaceChildren();
      for (const n of this.data ?? []) t.append(c(this, f, Ut).call(this, n));
      c(this, f, Je).call(this);
    }
  }),
  (Ut = function (t) {
    const n =
      t.element instanceof HTMLElement
        ? t.element
        : document.createElement(typeof t.element == 'string' ? t.element : 'button');
    if (
      (n.setAttribute('data-tj-demo-control', ''),
      (n.textContent = t.label ?? ''),
      t.info && !n.getAttribute('title') && (n.title = t.info),
      n instanceof HTMLSelectElement && Array.isArray(t.selectOptions))
    ) {
      n.replaceChildren();
      for (const r of t.selectOptions) {
        const s = document.createElement('option');
        (typeof r == 'string'
          ? ((s.value = r), (s.textContent = r))
          : ((s.value = r.value ?? r.label ?? ''),
            (s.textContent = r.label ?? r.value ?? ''),
            (s.disabled = !!r.disabled)),
          n.append(s));
      }
    }
    for (const [r, s] of Object.entries(t)) {
      if (!r.startsWith('on') || typeof s != 'function') continue;
      const o = r.slice(2);
      o && n.addEventListener(o, s);
    }
    if (t.events && typeof t.events == 'object')
      for (const [r, s] of Object.entries(t.events)) typeof s == 'function' && n.addEventListener(r, s);
    return (typeof t.init == 'function' && t.init(n), n);
  }),
  (zt = function () {
    if (typeof sessionStorage > 'u') return !0;
    try {
      const t = sessionStorage.getItem(Et);
      return t === null ? !0 : t === 'true';
    } catch {
      return !0;
    }
  }),
  (Bt = function () {
    if (!(typeof sessionStorage > 'u'))
      try {
        sessionStorage.setItem(Et, String(this.controlsOpen));
      } catch {}
  }),
  (Ft = function () {
    var t;
    typeof ResizeObserver > 'u' ||
      ((t = u(this, L)) == null || t.disconnect(),
      x(
        this,
        L,
        new ResizeObserver(() => {
          (c(this, f, Je).call(this), c(this, f, de).call(this), c(this, f, ce).call(this));
        }),
      ),
      u(this, L).observe(this),
      typeof document < 'u' &&
        (u(this, L).observe(document.documentElement), document.body && u(this, L).observe(document.body)));
  }),
  (Je = function () {
    const t = this.renderRoot.querySelector('.panel'),
      n = (t == null ? void 0 : t.scrollHeight) ?? 0;
    this.style.setProperty('--tj-demo-controls-panel-height', `${n}px`);
  }),
  (de = function () {
    typeof document > 'u' ||
      requestAnimationFrame(() => {
        document.documentElement.style.paddingBottom = `${this.getBoundingClientRect().height}px`;
      });
  }),
  (qt = function () {
    typeof document > 'u' || (document.documentElement.style.paddingBottom = '');
  }),
  (ce = function () {
    if (typeof document > 'u') return;
    const t = document.body;
    t &&
      requestAnimationFrame(() => {
        const n = t.getBoundingClientRect();
        ((this.style.left = `${n.left}px`), (this.style.width = `${n.width}px`));
      });
  }),
  (Wt = function () {
    ((this.style.left = ''), (this.style.width = ''));
  }),
  (Q = new WeakMap()),
  (Oe.properties = { data: { attribute: !1 }, controlsOpen: { state: !0 }, hasCustomControls: { state: !0 } }),
  (Oe.styles = [G(zn), G(Bn)]));
let We = Oe;
typeof customElements < 'u' && !customElements.get('tj-demo-controls') && customElements.define('tj-demo-controls', We);
function j(i) {
  const e = {};
  for (const t of i.kramdown ?? []) {
    if (t.valueType === 'id') {
      e.id = t.value ?? '';
      continue;
    }
    if (t.valueType === 'class') {
      e.class ? (e.class += ' ' + t.value) : (e.class = t.value);
      continue;
    }
    e[t.key] ? (e[t.key] += ' ' + (t.value ?? '')) : (e[t.key] = t.value ?? '');
  }
  return e;
}
function $t(i) {
  const e = {};
  for (const t of i ?? []) {
    if (t.valueType === 'id') {
      e.id = t.value ?? '';
      continue;
    }
    if (t.valueType === 'class') {
      e.class ? (e.class += ' ' + t.value) : (e.class = t.value ?? '');
      continue;
    }
    t.valueType === 'attribute' && (e[t.key] ? (e[t.key] += ' ' + (t.value ?? '')) : (e[t.key] = t.value ?? ''));
  }
  return e;
}
function T(i, e) {
  for (const t in e) i.setAttribute(t, e[t]);
}
function Kt(i) {
  return i.replace(/<[^>]*>/g, '');
}
function Fn(i) {
  return Kt(i)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-')
    .replace(/^-+|-+$/g, '');
}
function D(i = []) {
  const e = (n) =>
    Object.keys(n)
      .map((r) => ` ${r}="${n[r]}"`)
      .join('');
  let t = '';
  for (const n of i)
    switch (n.type) {
      case 'text':
        t += n.content;
        break;
      case 'html':
        t += `<${n.content}>`;
        break;
      case 'link': {
        const r = $t(n.kramdown);
        ((r.href = n.href ?? ''), (t += `<a${e(r)}>${D(n.content)}</a>`));
        break;
      }
      case 'image': {
        const r = $t(n.kramdown);
        ((r.src = n.href ?? ''), (r.alt = Kt(D(n.content))), (t += `<img${e(r)}>`));
        break;
      }
    }
  return t;
}
function Gt(i) {
  const e = i.type === 'o-list' ? 'ol' : 'ul',
    t = document.createElement(e),
    n = i.content;
  for (const r of n) {
    if (r.type !== 'list-item') continue;
    const s = document.createElement('li'),
      o = r.content,
      l = [];
    for (const a of o)
      a.type === 'u-list' || a.type === 'o-list'
        ? (l.length && (s.insertAdjacentHTML('beforeend', D(l)), (l.length = 0)), s.appendChild(Gt(a)))
        : l.push(a);
    (l.length && s.insertAdjacentHTML('beforeend', D(l)), t.appendChild(s));
  }
  return t;
}
function qn(i) {
  const e = document.createElement('table'),
    t = j(i);
  T(e, t);
  const n = i.children;
  let r = 0;
  const s = (o, l) => {
    const a = document.createElement('tr');
    return (
      o.forEach((h) => {
        const p = document.createElement(l);
        ((p.innerHTML = D(h.content)), a.appendChild(p));
      }),
      a
    );
  };
  for (const o of n) {
    if (o.type === 'table-head') {
      const l = document.createElement('thead'),
        a = s(o.content, 'th');
      ((r = o.content.length), l.appendChild(a), e.appendChild(l));
    }
    if (o.type === 'table-body') {
      const l = document.createElement('tbody'),
        a = o.content;
      r === 0 && a.length && (r = a.length);
      for (let h = 0; h < a.length; h += r || 1) {
        const p = a.slice(h, h + r || void 0);
        l.appendChild(s(p, 'td'));
      }
      e.appendChild(l);
    }
  }
  return e;
}
function Wn(i) {
  var t;
  const e = document.createElement('div');
  for (const n of i) {
    switch (n.type) {
      case 'heading': {
        const r = n.heading_level ?? 1,
          s = document.createElement('h' + r),
          o = j(n),
          l = D(n.children);
        if (!o.id) {
          const a = Fn(l);
          a !== '' && (o.id = a);
        }
        (T(s, o), (s.innerHTML = l), e.appendChild(s));
        break;
      }
      case 'hr': {
        const r = document.createElement('hr');
        (T(r, j(n)), e.appendChild(r));
        break;
      }
      case 'paragraph': {
        const r = document.createElement('p');
        (T(r, j(n)), n.children && n.children.length && (r.innerHTML = D(n.children)), e.appendChild(r));
        break;
      }
      case 'list': {
        const r = n.children;
        if (!r || r.length === 0) break;
        for (const s of r) {
          if (s.type !== 'u-list' && s.type !== 'o-list') continue;
          const o = Gt(s);
          (T(o, j(n)), e.appendChild(o));
        }
        break;
      }
      case 'table': {
        const r = qn(n);
        e.appendChild(r);
        break;
      }
      case 'code': {
        const r = document.createElement('pre'),
          s = document.createElement('code');
        (T(r, j(n)),
          (s.textContent = n.children[0].content),
          (t = n.children) != null && t[0].lang && s.setAttribute('class', `language-${n.children[0].lang}`),
          r.appendChild(s),
          e.appendChild(r));
        break;
      }
      case 'quote': {
        const r = document.createElement('blockquote'),
          s = document.createElement('p');
        (T(r, j(n)),
          n.children && n.children.length && (s.innerHTML = D(n.children)),
          r.appendChild(s),
          e.appendChild(r));
        break;
      }
      case 'html': {
        const r = document.createElement('div');
        r.innerHTML = n.children[0].content;
        for (const s of Array.from(r.childNodes)) e.appendChild(s);
        break;
      }
      case 'comment': {
        e.appendChild(document.createComment(n.children[0].content));
        break;
      }
      default: {
        const r = document.createElement('p');
        (T(r, j(n)), n.children && n.children.length && (r.innerHTML = D(n.children)), e.appendChild(r));
      }
    }
    e.appendChild(
      document.createTextNode(
        (n.post_whitespace ?? '') +
          `

`,
      ),
    );
  }
  return e;
}
var $e = ((i) => ((i[(i.Include = 0)] = 'Include'), (i[(i.Exclude = 1)] = 'Exclude'), (i[(i.Peek = 2)] = 'Peek'), i))(
  $e || {},
);
const Kn = { stringDelimiters: ['"', "'"] };
class Jt {
  constructor(e) {
    O(this, '_string', '');
    O(this, '_index', 0);
    O(this, '_curLine', 0);
    O(this, '_curColumn', 0);
    this._string = e;
  }
  get rest() {
    return this._string.substring(this._index);
  }
  get curLine() {
    return this._curLine;
  }
  get curColumn() {
    return this._curColumn;
  }
  get index() {
    return this._index;
  }
  get string() {
    return this._string;
  }
  get length() {
    return this._string.length;
  }
  isEnd() {
    return this._index >= this._string.length;
  }
  hasMore() {
    return this._index < this._string.length;
  }
  readWhiteSpace() {
    const t = this._string.substring(this._index).match(/^\s*/);
    if (!t || t.index === void 0) return '';
    const n = t[0];
    return ((this._index += n.length), n);
  }
  buildRegex(e, t = !1) {
    if (e instanceof RegExp) return e;
    {
      let n = Array.isArray(e) ? '(' + e.map((r) => this.escapeRegExp(r)).join('|') + ')' : this.escapeRegExp(e);
      return (t && (n = '^' + n), new RegExp(n, 's'));
    }
  }
  peek(e) {
    if (Number.isInteger(e)) return this._string.substring(this._index, this._index + e);
    let t = this.buildRegex(e, !0);
    const r = this.rest.match(t);
    return !r || r.index === void 0 ? null : r[0];
  }
  escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  readUntil(e, t = 1) {
    let n = this._string.substring(this._index),
      r = '',
      s = this.buildRegex(e);
    const o = n.match(s);
    return !o || o.index === void 0
      ? ((this._index += n.length), { content: n, match: null })
      : ((r = n.slice(0, o.index)),
        (this._index += o.index),
        t === 0 ? ((r += o[0]), (this._index += o[0].length)) : t === 1 && (this._index += o[0].length),
        { content: r, match: o[0] });
  }
  triggerError(e, t, n, r = '') {
    throw (
      Array.isArray(e) || (e = [e]),
      new Error(`Error at position ${n}: Expected "${e.join(', ')}", found "${t}". ${r}`)
    );
  }
  readPrimitive(e = Kn) {
    const t = e.stringDelimiters ?? [],
      n = e.escapeCharacter,
      r = this.peek(1);
    ((!r || !t.includes(r)) &&
      this.triggerError(t, r ?? '<end of input>', this._index, 'No valid string delimiter found'),
      this.read(1));
    let s = '';
    for (; this.hasMore();) {
      const o = this.read(1);
      if (n && o === n) {
        (this.hasMore() || this.triggerError(n, '<end of string>', this._index, 'Escape character at end of string'),
          (s += this.read(1)));
        continue;
      }
      if (o === r)
        return {
          value: s,
          delimiter: r,
          isMultiline: s.includes(`
`),
        };
      s += o;
    }
    this.triggerError(r, '<end of string>', this._index, 'End of string reached without closing delimiter');
  }
  read(e = 1) {
    let t = this._string.substring(this._index);
    t.length < e && (e = t.length);
    const n = t.slice(0, e);
    return ((this._index += e), n);
  }
}
class Xt {
  constructor(e, t = 1) {
    O(this, '_line');
    O(this, '_index', 0);
    O(this, 'lineNumber');
    ((this._line = e), (this.lineNumber = t));
  }
  get __debugInfo() {
    return { rest: this._line.substring(this.index) };
  }
  get index() {
    return this._index;
  }
  set index(e) {
    this._index = e;
  }
  get line() {
    return this._line;
  }
  isWhitespace(e) {
    return (
      e === ' ' ||
      e === '	' ||
      e === '\r' ||
      e ===
        `
` ||
      e === '\f' ||
      e === '\v' ||
      e === null
    );
  }
  readWhiteSpace(e = !0) {
    let t = '';
    for (
      ;
      !this.isEOF() &&
      !(
        this.peek(1) ===
          `
` && !e
      );
    )
      t += this.readChar();
    return t;
  }
  isEOF() {
    return this._index >= this._line.length;
  }
  more() {
    return this._index < this._line.length;
  }
  readValue(e = ';') {
    if ((this.skipWhitespace(), this.isEOF())) return null;
    const t = { value_str: '', value_number: null, quoted: !1, column: this._index },
      n = this.peekChar();
    if (n === '"' || n === "'") {
      if (
        (this.readChar(),
        (t.value_str = this.readEscapedString(n)),
        (t.quoted = !0),
        this.peekChar(),
        this.isNextChar(n))
      )
        this.readChar();
      else throw new Error(this.failmsg(`Unterminated string starting at index ${this._index}`));
      return t;
    }
    const r = this.readUntil(e);
    t.value_str = r;
    const s = Number(r);
    return (!Number.isNaN(s) && r.trim() !== '' && (t.value_number = s), t);
  }
  peekChar(e = 1) {
    return this.isEOF() ? null : this._line.substr(this._index, e);
  }
  peek(e = 1, t = 0) {
    return this.isEOF() ? null : this._line.substring(this._index + t, this._index + t + e);
  }
  readChar() {
    return this.isEOF() ? null : this._line[this._index++];
  }
  readUntil(e, t = !1) {
    let n = '';
    for (; !this.isEOF();) {
      const r = this.readChar(),
        s = this.peekChar();
      if (((n += r), (typeof e == 'string' && s === e) || (e instanceof RegExp && e.test(s ?? '')))) break;
    }
    return (t && !this.isEOF() && (n += this.readChar()), n);
  }
  escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  readUntilPeekRegex(e, t = !1) {
    let n,
      r = this._line.substring(this._index),
      s = '';
    if (e instanceof RegExp) n = new RegExp(e.source, e.flags.includes('s') ? e.flags : e.flags + 's');
    else {
      const l = Array.isArray(e) ? e.map((a) => this.escapeRegExp(a)).join('|') : this.escapeRegExp(e);
      n = new RegExp(l, 's');
    }
    const o = r.match(n);
    return !o || o.index === void 0
      ? ((this.index += r.length), { content: r, match: null })
      : ((s = r.slice(0, o.index)),
        (this._index += o.index),
        t && ((s += o[0]), (this._index += o[0].length)),
        { content: s, match: o[0] });
  }
  skipWhitespace() {
    for (; !this.isEOF() && /\s/.test(this._line[this._index]);) this._index++;
  }
  readUntilPeek(e, t = !0) {
    let n = '';
    for (; !this.isEOF();) {
      for (const s of e) if (this.peek(s.length) === s) return { value: n, peek: s };
      const r = this.readChar();
      if (
        r ===
          `
` &&
        !t
      )
        break;
      n += r;
    }
    return { value: n, peek: !1 };
  }
  readWord(e = /\w/) {
    if ((this.skipWhitespace(), this.isEOF())) return null;
    let t = '';
    for (; !this.isEOF() && e.test(this._line[this._index]);) t += this._line[this._index++];
    return t;
  }
  readExpression(e = []) {
    if ((this.skipWhitespace(), this.isEOF())) return null;
    this._index;
    let t = null;
    for (let n of e)
      if (this._line.startsWith(n, this._index)) {
        ((t = n), (this._index += t.length));
        break;
      }
    return t;
  }
  readEscapedString(e) {
    let t = !1,
      n = '';
    for (; !this.isEOF() && !(this.peekChar() === e && !t);) {
      const r = this.readChar();
      if (r === '\\' && !t) {
        t = !0;
        continue;
      }
      ((n += r), (t = !1));
    }
    if (t) throw new Error(this.failmsg(`Unterminated string starting at index ${this._index}`));
    return n;
  }
  failmsg(e) {
    return `Line ${this.lineNumber}, Col ${this._index + 1}: ${e}`;
  }
  isNextChar(e) {
    return this.peekChar() === e;
  }
  saveIndex() {
    return this._index;
  }
  restoreIndex(e) {
    this._index = e;
  }
}
function Yt(i) {
  var n;
  const e = new Xt(i),
    t = { elements: [], errors: [], kramdown_length: 0 };
  if (!e.readExpression(['{:'])) throw new Error("parse_kramdown: expected string starting with '{:' - found " + i);
  for (; !e.isEOF();)
    switch ((e.skipWhitespace(), e.peek())) {
      case '}':
        return (e.readChar(), (t.kramdown_length = e.index), t);
      case '#':
      case '.': {
        const r = e.readChar(),
          s = e.readWord(/[a-z0-9_\-:]+/i);
        if (s) t.elements.push({ valueType: r === '#' ? 'id' : 'class', value: s });
        else return (t.errors.push('parse_kramdown: expected class/id - found ' + e.peek()), t);
        break;
      }
      default: {
        const r = e.readWord(/[a-z0-9_\-:]+/i);
        let s;
        r &&
          (e.peek() === '=' && (e.readChar(), (s = (n = e.readValue(/(\s|})/)) == null ? void 0 : n.value_str)),
          t.elements.push({ valueType: 'attribute', value: s, key: r }));
      }
    }
  return (t.errors.push("parse_kramdown: expected '}' - found EOF"), (t.kramdown_length = e.index), t);
}
function Zt(i) {
  const e = i.readExpression(['[', '![']);
  if (e === null) return { type: 'text', content: Qt(i.readUntil(']')) };
  const t = { type: null };
  if (((t.type = e === '[' ? 'link' : 'image'), (t.content = []), i.peekChar() !== ']')) {
    const n = Zt(i);
    t.content = [n];
  }
  if ((i.readChar(), i.peekChar() !== '(')) return { type: 'text', content: t.content };
  if ((i.readChar(), (t.href = i.readUntil(')')), i.readChar(), i.peek() === '{')) {
    const n = Yt(i.line.substring(i.index));
    ((t.kramdown = n.elements), (i.index += n.kramdown_length));
  }
  return t;
}
function Qt(i) {
  return i
    .replace(new RegExp('(?<!\\*)\\*\\*\\*([^\\n]+?)\\*\\*\\*', 'g'), '<strong><em>$1</em></strong>')
    .replace(new RegExp('(?<!\\*)\\*\\*([\\s\\S]+?)\\*\\*', 'g'), '<strong>$1</strong>')
    .replace(new RegExp('(?<!\\*)\\*([\\s\\S]+?)\\*', 'g'), '<em>$1</em>')
    .replace(/__([\s\S]+?)__/g, '<strong>$1</strong>')
    .replace(/_([\s\S]+?)_/g, '<em>$1</em>')
    .replace(/`([\s\S]+?)`/g, '<code>$1</code>')
    .replace(/~~([\s\S]+?)~~/g, '<del>$1</del>');
}
function me(i) {
  const e = [],
    t = new Xt(i);
  for (; t.more();) {
    const n = t.readUntilPeek(['[', '!['], !0);
    (n.value !== '' && e.push({ type: 'text', content: Qt(n.value) }), n.peek !== !1 && e.push(Zt(t)));
  }
  return e;
}
function Gn(i) {
  if (i.type !== 'table') return [];
  const e = i.content_raw
    .replace(
      /\r\n?/g,
      `
`,
    )
    .split(
      `
`,
    )
    .map((a) => a.trim())
    .filter((a) => a !== '');
  if (e.length === 0) return [];
  const t = /^:?-{3,}:?(?:\s*\|\s*:?-{3,}:?)*\s*$/;
  let n = null,
    r = 0;
  const s = (a) => (a.startsWith('|') && (a = a.slice(1)), a.endsWith('|') && (a = a.slice(0, -1)), a.trim());
  e.length >= 2 && t.test(s(e[1])) && ((n = At(e[0])), (r = 2));
  const o = [];
  n && o.push({ type: 'table-head', content: n.map((a) => kt(a.trim())) });
  const l = [];
  for (let a = r; a < e.length; a++) At(e[a]).forEach((p) => l.push(kt(p.trim())));
  return (o.push({ type: 'table-body', content: l }), o);
}
function At(i) {
  return (
    i.startsWith('|') && (i = i.slice(1)),
    i.endsWith('|') && (i = i.slice(0, -1)),
    i.split('|').map((e) => e.trim())
  );
}
function kt(i) {
  return { type: 'table-cell', content: me(i) };
}
function Jn(i) {
  if (i.type !== 'list') return [];
  const e = i.content_raw
      .replace(
        /\r\n?/g,
        `
`,
      )
      .split(
        `
`,
      )
      .filter((o) => o.trim() !== ''),
    t = [],
    n = [],
    r = /^(\s*)([-+*]|(\d+)\.)\s+(.*)$/;
  function s(o, l, a) {
    for (; n.length > 0;) {
      const p = n[n.length - 1];
      if (p.indent === o) {
        if (p.element.type === l && p.element.__marker === a) return p.element;
        n.pop();
        continue;
      }
      if (p.indent > o) {
        n.pop();
        continue;
      }
      break;
    }
    const h = { type: l, content: [] };
    if (((h.__marker = a), n.length === 0)) t.push(h);
    else {
      const m = n[n.length - 1].element.content;
      m.length === 0 && m.push({ type: 'list-item', content: [] });
      const b = m[m.length - 1];
      (Array.isArray(b.content) || (b.content = []), b.content.push(h));
    }
    return (n.push({ element: h, indent: o }), h);
  }
  for (const o of e) {
    const l = o.match(r);
    if (!l) {
      if (n.length > 0) {
        const Ie = n[n.length - 1].element.content;
        if (Ie.length > 0) {
          const He = Ie[Ie.length - 1];
          (Array.isArray(He.content) || (He.content = []), He.content.push({ type: 'text', content: o.trim() }));
        }
      }
      continue;
    }
    const a = l[1] || '',
      h = l[2],
      p = /\d+\./.test(h),
      m = p ? 'o-list' : 'u-list',
      b = l[4],
      A = p ? 'o' : h,
      $ = a.replace(/\t/g, '    ').length,
      N = Math.floor($ / 2),
      Y = s(N, m, A),
      yn = { type: 'list-item', content: me(b) };
    Y.content.push(yn);
  }
  return t;
}
function Xn(i) {
  const e = new Jt(i);
  let t = [],
    n = !0;
  for (; e.hasMore();) {
    let r = e.readUntil(/\n\n(```|<!--|\S)/m, $e.Peek);
    switch (
      (t.push(
        (n
          ? `

`
          : '') + r.content,
      ),
      (n = !1),
      r.match)
    ) {
      case '\n\n```':
        let s = e.read(5);
        ((s += e.readUntil('```', $e.Include).content), t.push(s));
        break;
      case `

<!--`:
        t.push(e.readUntil('-->', $e.Include).content);
        break;
      default:
        e.read(2);
        break;
    }
  }
  return t;
}
function Yn(i) {
  i = i
    .replace(
      /\r\n/g,
      `
`,
    )
    .replace(
      /\r/g,
      `
`,
    );
  const e = [],
    t = Xn(i);
  let n = '';
  for (const r of t) {
    if (r === '') continue;
    if (r.trim() === '') {
      n += r;
      continue;
    }
    const s = new Jt(r),
      o = { type: null, pre_whitespace: n + s.readWhiteSpace(), content_raw: s.rest, post_whitespace: '' };
    n = '';
    let l = s.rest;
    const a = l.match(/^(.*)\n(\{:[^\n]*\})(\s*)$/s);
    if (a) {
      const [, m, b, A] = a;
      ((o.kramdown = Yt(b).elements), (o.post_whitespace = A), (l = m));
    }
    const h = l.split(`
`);
    switch (s.peek(['<!--', '```', '---', '#', '-', '*', '+', '|', '<', '>'])) {
      case '<!--':
        ((o.type = 'comment'), (l = l.substring(4, l.length - 3)), (o.children = [{ type: 'text', content: l }]));
        break;
      case '---':
        o.type = 'hr';
        break;
      case '```':
        o.type = 'code';
        let m = h[0].substring(3).trim();
        (h.shift(),
          h[h.length - 1].endsWith('```') && h.pop(),
          (o.children = [
            {
              type: 'text',
              content: h.join(`
`),
              lang: m,
            },
          ]));
        break;
      case '#':
        ((o.type = 'heading'),
          (o.heading_level = l.split(' ')[0].length),
          (o.children = me(l.substring(o.heading_level).trim())));
        break;
      case '-':
      case '+':
        ((o.type = 'list'), (o.children = Jn(o)));
        break;
      case '|':
        ((o.type = 'table'), (o.children = Gn(o)));
        break;
      case '<':
        ((o.type = 'html'), (o.children = [{ type: 'html', content: l }]));
        break;
      case '>':
        ((o.type = 'quote'),
          (l = l
            .split(
              `
`,
            )
            .map((b) => b.replace(/^>\s*/, '')).join(`
`)),
          (o.children = me(l)));
        break;
      default:
        ((o.type = 'paragraph'), (o.children = me(l)));
    }
    e.push(o);
  }
  return (n !== '' && e.push({ type: 'whitespace', pre_whitespace: n }), e);
}
class Zn {
  constructor() {
    O(this, '_ast', []);
  }
  set markdown(e) {
    this._ast = Yn(e);
  }
  getHTML() {
    return Wn(this._ast);
  }
}
const Xe = 'view';
function Se(i) {
  const e = new URLSearchParams(i).get(Xe);
  return e === 'fullscreen' || e === 'source' ? e : 'default';
}
function Ye(i, e) {
  const t = new URL(i);
  return (e === 'default' ? t.searchParams.delete(Xe) : t.searchParams.set(Xe, e), t.href);
}
const Be =
  'body{margin:0}.tj-demo-renderer-content{padding:15px;color:var(--tj-demo-codestyle-color-text, #0f172a);font:var(--tj-demo-codestyle-font, 15px/1.65 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);text-wrap:pretty}.tj-demo-renderer-content>:first-child{margin-top:0}.tj-demo-renderer-content>:last-child{margin-bottom:0}.tj-demo-renderer-content :where(h1,h2,h3,h4,h5,h6){margin:1.6em 0 .6em;color:var(--tj-demo-codestyle-color-heading, #020617);font-weight:700;line-height:1.2;text-wrap:balance}.tj-demo-renderer-content h1{font-size:clamp(2rem,4vw,2.75rem);letter-spacing:-.03em}.tj-demo-renderer-content h2{font-size:clamp(1.5rem,3vw,2rem);letter-spacing:-.02em}.tj-demo-renderer-content h3{font-size:1.25rem}.tj-demo-renderer-content h4,.tj-demo-renderer-content h5,.tj-demo-renderer-content h6{font-size:1rem}.tj-demo-renderer-content :where(p,ul,ol,blockquote,pre,table,hr){margin:0 0 1.1em}.tj-demo-renderer-content :where(ul,ol){padding-left:1.4em}.tj-demo-renderer-content li+li{margin-top:.3em}.tj-demo-renderer-content a{color:var(--tj-demo-codestyle-color-link, #2563eb);text-decoration-thickness:.08em;text-underline-offset:.18em}.tj-demo-renderer-content a:hover{color:var(--tj-demo-codestyle-color-link-hover, #1d4ed8)}.tj-demo-renderer-content strong{font-weight:700;color:var(--tj-demo-codestyle-color-strong, #020617)}.tj-demo-renderer-content em{color:var(--tj-demo-codestyle-color-emphasis, #334155)}.tj-demo-renderer-content hr{border:0;border-top:1px solid var(--tj-demo-codestyle-color-border, #cbd5e1)}.tj-demo-renderer-content blockquote{padding:.85rem 1rem;border-left:4px solid var(--tj-demo-codestyle-color-quote-border, #94a3b8);border-radius:0 12px 12px 0;background:var(--tj-demo-codestyle-color-quote-bg, #f8fafc);color:var(--tj-demo-codestyle-color-quote-text, #334155)}.tj-demo-renderer-content :where(code,pre){font-family:var(--tj-demo-codestyle-font-mono, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Monaco, monospace)}.tj-demo-renderer-content code{padding:.15em .45em;border:1px solid var(--tj-demo-codestyle-color-inline-code-border, #dbe4f0);border-radius:.45rem;background:var(--tj-demo-codestyle-color-inline-code-bg, #eff6ff);color:var(--tj-demo-codestyle-color-inline-code-text, #1e3a8a);font-size:.92em}.tj-demo-renderer-content pre{overflow-x:auto;padding:1rem 1.1rem;border:1px solid var(--tj-demo-codestyle-color-pre-border, #1e293b);border-radius:14px;background:var(--tj-demo-codestyle-color-pre-bg, #0f172a);color:var(--tj-demo-codestyle-color-pre-text, #e2e8f0);box-shadow:inset 0 1px #ffffff08}.tj-demo-renderer-content pre code{padding:0;border:0;border-radius:0;background:transparent;color:inherit;font-size:.95em}.tj-demo-renderer-content table{width:100%;border-collapse:collapse;overflow:hidden;border:1px solid var(--tj-demo-codestyle-color-border, #cbd5e1);border-radius:12px;background:var(--tj-demo-codestyle-color-table-bg, #fff)}.tj-demo-renderer-content th,.tj-demo-renderer-content td{padding:.75rem .9rem;border-bottom:1px solid var(--tj-demo-codestyle-color-border, #cbd5e1);text-align:left;vertical-align:top}.tj-demo-renderer-content th{background:var(--tj-demo-codestyle-color-table-head-bg, #f8fafc);color:var(--tj-demo-codestyle-color-heading, #020617);font-weight:600}.tj-demo-renderer-content tbody tr:last-child td{border-bottom:0}.tj-demo-renderer-content img,.tj-demo-renderer-content video,.tj-demo-renderer-content canvas,.tj-demo-renderer-content svg{display:block;max-width:100%;height:auto}tj-demo-renderer[view-mode=fullscreen] .tj-demo-renderer-content,tj-demo-renderer[view-mode=source] .tj-demo-renderer-content{box-sizing:border-box;min-height:100dvh}.tj-demo-renderer-source{padding:24px;background:#f8fafc;color:#111827}.tj-demo-renderer-source pre{min-width:max-content;margin:0;font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,monospace;-moz-tab-size:2;tab-size:2}';
var z, ye, B, y, en, tn, nn, Qe, rn, sn, he, Ae, ee, te, ne, oe, on, an;
const k = class k extends S {
  constructor() {
    super(...arguments);
    v(this, y);
    v(this, ee);
    v(this, te);
    v(this, ne);
    ((this.errorMessage = ''),
      (this.viewMode = 'default'),
      x(this, ee, (t) => {
        const n = t.error ? c(this, y, Ae).call(this, t.error) : t.message;
        n && c(this, y, he).call(this, n);
      }),
      x(this, te, (t) => {
        c(this, y, he).call(this, c(this, y, Ae).call(this, t.reason));
      }),
      x(this, ne, (t) => {
        t.key !== 'Escape' ||
          this.viewMode === 'default' ||
          window.location.assign(Ye(window.location.href, 'default'));
      }));
  }
  connectedCallback() {
    var t;
    (super.connectedCallback(),
      (this.viewMode = Se(window.location.search)),
      u(k, z).add(this),
      c((t = k), oe, on).call(t),
      window.addEventListener('error', u(this, ee)),
      window.addEventListener('unhandledrejection', u(this, te)),
      window.addEventListener('keydown', u(this, ne)));
  }
  disconnectedCallback() {
    var t;
    (window.removeEventListener('error', u(this, ee)),
      window.removeEventListener('unhandledrejection', u(this, te)),
      window.removeEventListener('keydown', u(this, ne)),
      u(k, z).delete(this),
      c((t = k), oe, an).call(t),
      super.disconnectedCallback());
  }
  render() {
    return E`
      <slot></slot>
      ${this.errorMessage ? E`<div class="error-indicator">${this.errorMessage}</div>` : null}
    `;
  }
  async showDemo(t) {
    ((this.viewMode = Se(window.location.search)),
      (this.errorMessage = ''),
      this.requestUpdate(),
      this.replaceChildren());
    const n = this.viewMode === 'source' ? [Be] : c(this, y, sn).call(this, t.css);
    for (const s of n) this.append(c(this, y, tn).call(this, s));
    const r = document.createElement('div');
    ((r.className = 'tj-demo-renderer-content'), this.append(r));
    try {
      if (this.viewMode === 'source') {
        c(this, y, en).call(this, r, t.source);
        return;
      }
      if (typeof t.render == 'function') {
        await t.render(r);
        return;
      }
      if (t.wrapper_html && typeof t.wrapper_html == 'string') {
        const s = document.createElement('div');
        ((s.innerHTML = t.wrapper_html.replace('{{content}}', c(this, y, nn).call(this, t))),
          r.append(...Array.from(s.childNodes)));
        return;
      }
      if (t.markdown) {
        const s = c(this, y, Qe).call(this, t.markdown);
        r.append(...Array.from(s.childNodes));
        return;
      }
      if (t.html) {
        const s = document.createElement('div');
        ((s.innerHTML = t.html), r.append(...Array.from(s.childNodes)));
        return;
      }
      r.textContent = 'Demo exportiert keine render(root)-Funktion';
    } catch (s) {
      const o = c(this, y, Ae).call(this, s);
      (c(this, y, he).call(this, o), (r.textContent = o));
    }
  }
};
((z = new WeakMap()),
  (ye = new WeakMap()),
  (B = new WeakMap()),
  (y = new WeakSet()),
  (en = function (t, n) {
    t.classList.add('tj-demo-renderer-source');
    const r = document.createElement('pre'),
      s = document.createElement('code');
    ((s.textContent = n ?? 'Quellcode nicht verfügbar'), r.append(s), t.append(r));
  }),
  (tn = function (t) {
    if (c(this, y, rn).call(this, t)) {
      const r = document.createElement('link');
      return ((r.rel = 'stylesheet'), (r.href = t), r);
    }
    const n = document.createElement('style');
    return ((n.textContent = t), n);
  }),
  (nn = function (t) {
    return typeof t.markdown == 'string' && t.markdown.length > 0
      ? c(this, y, Qe).call(this, t.markdown).innerHTML
      : (t.html ?? '');
  }),
  (Qe = function (t) {
    const n = new Zn();
    return ((n.markdown = t), n.getHTML());
  }),
  (rn = function (t) {
    const n = t.trim();
    return !n ||
      /[{};]/.test(n) ||
      n.includes(`
`)
      ? !1
      : /^(https?:\/\/|\/|\.\/|\.\.\/)/.test(n) || /\.(css|scss|sass|less|styl|stylus)(\?|#|$)/.test(n);
  }),
  (sn = function (t) {
    return t === void 0
      ? [Be]
      : t === null
        ? []
        : (Array.isArray(t) ? t : [t])
            .filter((r) => typeof r == 'string')
            .map((r) => r.trim())
            .filter((r) => r.length > 0)
            .map((r) => (r === 'default' ? Be : r));
  }),
  (he = function (t) {
    ((this.errorMessage = t), this.requestUpdate());
  }),
  (Ae = function (t) {
    return t instanceof Error ? t.message || t.name : String(t);
  }),
  (ee = new WeakMap()),
  (te = new WeakMap()),
  (ne = new WeakMap()),
  (oe = new WeakSet()),
  (on = function () {
    u(this, B) ||
      ((console.error = (...t) => {
        var r;
        u(this, ye).call(this, ...t);
        const n = t
          .map((s) => {
            if (s instanceof Error) return s.message || s.name;
            if (typeof s == 'string') return s;
            try {
              return JSON.stringify(s);
            } catch {
              return String(s);
            }
          })
          .filter(Boolean)
          .join(' ');
        if (n) for (const s of u(this, z)) c((r = s), y, he).call(r, n);
      }),
      x(this, B, !0));
  }),
  (an = function () {
    u(this, z).size > 0 || !u(this, B) || ((console.error = u(this, ye)), x(this, B, !1));
  }),
  v(k, oe),
  (k.properties = { viewMode: { attribute: 'view-mode', reflect: !0 } }),
  (k.styles = En`
    :host {
      display: block;
    }

    :host([view-mode='fullscreen']),
    :host([view-mode='source']) {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      overflow: auto;
      background: #fff;
    }

    .error-indicator {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 10000;
      max-width: min(420px, calc(100vw - 24px));
      padding: 10px 12px;
      border: 1px solid #b91c1c;
      border-radius: 10px;
      background: #dc2626;
      color: #fff;
      box-shadow: 0 10px 30px rgba(127, 29, 29, 0.35);
      font: 12px/1.4 sans-serif;
      white-space: pre-wrap;
      word-break: break-word;
      pointer-events: none;
    }
  `),
  v(k, z, new Set()),
  v(k, ye, console.error),
  v(k, B, !1));
let Ze = k;
typeof customElements < 'u' && !customElements.get('tj-demo-renderer') && customElements.define('tj-demo-renderer', Ze);
const Qn =
  ':host{display:block}ul{list-style:none;margin:0;padding:0}.tree,.branch-children{display:grid;gap:4px}.branch-children{margin-left:12px;padding-left:12px;border-left:1px solid #e5e7eb}.toggle,.link{display:flex;align-items:center;gap:8px;width:100%;min-height:36px;padding:8px 10px;border:0;border-radius:8px;background:transparent;color:inherit;font:inherit;text-align:left;text-decoration:none;cursor:pointer}.toggle:hover,.link:hover{background:#f3f4f6}.chevron{width:1em;color:#6b7280;text-align:center;flex:0 0 auto}.label{min-width:0;word-break:break-word}.link{padding-left:28px}.link.active{background:#e0ecff;color:#0f3d91;font-weight:600}';
var X, tt, ln;
const Le = class Le extends S {
  constructor() {
    super(...arguments);
    v(this, X);
    ((this.activeHref = ''), (this.expandedKeys = []), (this.forcedExpandedKeys = []));
  }
  render() {
    const t = this.nodes ?? [],
      n = new Set(this.expandedKeys),
      r = new Set(this.forcedExpandedKeys);
    return E`
      <ul class="tree">
        ${t.map((s, o) => c(this, X, tt).call(this, s, `${o}:${s.name}`, n, r))}
      </ul>
    `;
  }
};
((X = new WeakSet()),
  (tt = function (t, n, r, s) {
    if ('children' in t) {
      const l = r.has(n) || s.has(n),
        a = t.children ?? [];
      return E`
        <li>
          <button
            class="toggle"
            type="button"
            aria-expanded=${String(l)}
            @click=${() => c(this, X, ln).call(this, n)}
          >
            <span class="chevron">${l ? '▾' : '▸'}</span>
            <span class="label">${t.name}</span>
          </button>

          ${
            l
              ? E`
                <ul class="branch-children">
                  ${a.map((h, p) => c(this, X, tt).call(this, h, `${n}/${p}:${h.name}`, r, s))}
                </ul>
              `
              : w
          }
        </li>
      `;
    }
    const o = this.activeHref === t.href;
    return E`
      <li>
        <a class=${o ? 'link active' : 'link'} href=${t.href}>${t.name}</a>
      </li>
    `;
  }),
  (ln = function (t) {
    this.dispatchEvent(new CustomEvent('toggle-node', { detail: { key: t }, bubbles: !0, composed: !0 }));
  }),
  (Le.properties = {
    nodes: { attribute: !1 },
    activeHref: { attribute: !1 },
    expandedKeys: { attribute: !1 },
    forcedExpandedKeys: { attribute: !1 },
  }),
  (Le.styles = [G(Qn)]));
let et = Le;
typeof customElements < 'u' &&
  !customElements.get('tj-demo-viewer-nav-tree') &&
  customElements.define('tj-demo-viewer-nav-tree', et);
const er =
    ':host{--tj-demo-viewer-nav-rail-width: 34px;--tj-demo-viewer-nav-panel-width: 304px;position:fixed;top:0;left:0;z-index:20;display:block;height:100vh;box-sizing:border-box;overscroll-behavior:contain;color:#1f2937;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.shell{display:grid;grid-template-columns:var(--tj-demo-viewer-nav-rail-width) auto;height:100%}.rail{display:grid;grid-template-rows:auto 1fr;justify-items:center;gap:16px;width:var(--tj-demo-viewer-nav-rail-width);height:100%;padding:0;background:#000;color:#fff}.nav-toggle{display:inline-flex;align-items:center;justify-content:center;width:var(--tj-demo-viewer-nav-rail-width);height:var(--tj-demo-viewer-nav-rail-width);padding:0;border:0;border-radius:0;background:transparent;color:inherit;cursor:pointer}.nav-toggle:hover{background:#111827}.nav-toggle-icon{font-size:18px;line-height:1}.rail-content{display:grid;justify-items:center;align-content:start;width:100%;padding:0 8px 12px}.nav-toggle-label{writing-mode:vertical-rl;transform:rotate(180deg);font-size:.9rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.sidebar-wrapper{width:var(--tj-demo-viewer-nav-panel-width);overflow:hidden;border-right:1px solid #e5e7eb;background:#fff;box-shadow:0 0 24px #0f172a14;transition:width .18s ease}.shell.is-closed .sidebar-wrapper{width:0}.panel{width:var(--tj-demo-viewer-nav-panel-width);min-width:0;height:100%;overflow:auto;overscroll-behavior:contain;padding:20px;background:#fff}.panel[hidden]{display:none}nav{display:grid;gap:16px}header{display:grid;gap:6px}h2{margin:0;font-size:1.1rem}p{margin:0;color:#6b7280;font-size:.92rem}',
  Ct = 'tj-demo-viewer-nav:expanded',
  Pt = 'tj-demo-viewer-nav:open';
var P, F, _, dn, xe, we, cn, rt, hn, un, pn, mn, ke, fn, gn, Ce, re;
const Re = class Re extends S {
  constructor() {
    super();
    v(this, _);
    v(this, P);
    v(this, F);
    v(this, xe);
    v(this, we);
    v(this, re);
    ((this.activeHref = ''),
      (this.navOpen = !0),
      x(this, P, new Set()),
      x(this, xe, () => {
        this.navOpen = !this.navOpen;
      }),
      x(this, we, (t) => {
        c(this, _, dn).call(this, t.detail.key);
      }),
      x(this, re, () => {
        this.activeHref = c(this, _, Ce).call(this);
      }),
      x(this, P, c(this, _, hn).call(this)),
      (this.activeHref = c(this, _, Ce).call(this)),
      (this.navOpen = c(this, _, pn).call(this)));
  }
  connectedCallback() {
    (super.connectedCallback(),
      (this.activeHref = c(this, _, Ce).call(this)),
      c(this, _, gn).call(this),
      c(this, _, ke).call(this),
      window.addEventListener('hashchange', u(this, re)));
  }
  disconnectedCallback() {
    var t;
    ((t = u(this, F)) == null || t.disconnect(),
      c(this, _, fn).call(this),
      window.removeEventListener('hashchange', u(this, re)),
      super.disconnectedCallback());
  }
  updated(t) {
    (super.updated(t), t.has('navOpen') && (c(this, _, mn).call(this), c(this, _, ke).call(this)));
  }
  render() {
    if (!this.data) return E`No Data`;
    const t = c(this, _, cn).call(this, this.data.tree, this.activeHref);
    return E`
      <div class=${this.navOpen ? 'shell is-open' : 'shell is-closed'}>
        <div class="rail">
          <button
            class="nav-toggle"
            type="button"
            aria-label=${this.navOpen ? 'Navigation einklappen' : 'Navigation ausklappen'}
            aria-expanded=${String(this.navOpen)}
            @click=${u(this, xe)}
          >
            <span class="nav-toggle-icon" aria-hidden="true">${this.navOpen ? '◂' : '▸'}</span>
          </button>

          <div class="rail-content">
            <span class="nav-toggle-label">DemoViewer</span>
          </div>
        </div>

        <div class="sidebar-wrapper">
          <div class="panel" ?hidden=${!this.navOpen}>
            <nav aria-label=${this.data.title}>
              <header>
                <h2>${this.data.title}</h2>
                ${this.data.description ? E`<p>${this.data.description}</p>` : w}
              </header>

              <tj-demo-viewer-nav-tree
                .nodes=${this.data.tree}
                .activeHref=${this.activeHref}
                .expandedKeys=${[...u(this, P)]}
                .forcedExpandedKeys=${t}
                @toggle-node=${u(this, we)}
              ></tj-demo-viewer-nav-tree>
            </nav>
          </div>
        </div>
      </div>
    `;
  }
};
((P = new WeakMap()),
  (F = new WeakMap()),
  (_ = new WeakSet()),
  (dn = function (t) {
    (u(this, P).has(t) ? u(this, P).delete(t) : u(this, P).add(t), c(this, _, un).call(this), this.requestUpdate());
  }),
  (xe = new WeakMap()),
  (we = new WeakMap()),
  (cn = function (t, n, r = '') {
    return c(this, _, rt).call(this, t, n, r) ?? [];
  }),
  (rt = function (t, n, r = '') {
    for (const [s, o] of t.entries()) {
      const l = r ? `${r}/${s}:${o.name}` : `${s}:${o.name}`;
      if ('children' in o) {
        const a = c(this, _, rt).call(this, o.children ?? [], n, l);
        if (a) return [l, ...a];
      } else if (o.href === n) return [];
    }
    return null;
  }),
  (hn = function () {
    if (typeof sessionStorage > 'u') return new Set();
    try {
      const t = sessionStorage.getItem(Ct);
      if (!t) return new Set();
      const n = JSON.parse(t);
      return Array.isArray(n) ? new Set(n.filter((r) => typeof r == 'string')) : new Set();
    } catch {
      return new Set();
    }
  }),
  (un = function () {
    if (!(typeof sessionStorage > 'u'))
      try {
        sessionStorage.setItem(Ct, JSON.stringify([...u(this, P)]));
      } catch {}
  }),
  (pn = function () {
    if (typeof sessionStorage > 'u') return !0;
    try {
      const t = sessionStorage.getItem(Pt);
      return t === null ? !0 : t === 'true';
    } catch {
      return !0;
    }
  }),
  (mn = function () {
    if (!(typeof sessionStorage > 'u'))
      try {
        sessionStorage.setItem(Pt, String(this.navOpen));
      } catch {}
  }),
  (ke = function () {
    typeof document > 'u' ||
      requestAnimationFrame(() => {
        document.documentElement.style.paddingLeft = `${this.getBoundingClientRect().width}px`;
      });
  }),
  (fn = function () {
    typeof document > 'u' || (document.documentElement.style.paddingLeft = '');
  }),
  (gn = function () {
    var t;
    typeof ResizeObserver > 'u' ||
      ((t = u(this, F)) == null || t.disconnect(),
      x(
        this,
        F,
        new ResizeObserver(() => {
          c(this, _, ke).call(this);
        }),
      ),
      u(this, F).observe(this));
  }),
  (Ce = function () {
    return typeof window > 'u' ? '' : window.location.hash;
  }),
  (re = new WeakMap()),
  (Re.properties = { data: { attribute: !1 }, activeHref: { state: !0 }, navOpen: { state: !0 } }),
  (Re.styles = [G(er)]));
let nt = Re;
typeof customElements < 'u' &&
  !customElements.get('tj-demo-viewer-nav') &&
  customElements.define('tj-demo-viewer-nav', nt);
const Fe = '#/demo/';
class St {
  constructor(e) {
    this.demos = Array.isArray(e) ? [...e].sort((t, n) => this.compareDemos(t, n)) : [];
  }
  getNavData() {
    const e = [];
    for (const t of this.demos) {
      if (!t.filename) continue;
      const n = [...this.getDemoNavPath(t), t.filename];
      let r = e;
      for (const [s, o] of n.entries()) {
        if (s === n.length - 1) {
          r.push({ name: this.getDemoLabel(t), href: this.getDemoHref(t.filename) });
          continue;
        }
        let a = r.find((h) => 'children' in h && h.name === o);
        (a || ((a = { name: o, children: [] }), r.push(a)), (r = a.children));
      }
    }
    return { title: 'TDemos', description: 'Gefundene Demo-Dateien', tree: e };
  }
  getDemoByHash(e) {
    if (e.startsWith(Fe))
      try {
        return this.getDemoByFilename(decodeURIComponent(e.slice(Fe.length)));
      } catch {
        return;
      }
  }
  getDemoByFilename(e) {
    return this.demos.find((t) => t.filename === e);
  }
  getFirstDemo() {
    return this.demos.find((e) => e.filename);
  }
  getDemoHref(e) {
    const t = typeof e == 'string' ? e : (e.filename ?? '');
    return Fe + encodeURIComponent(t);
  }
  getDemoLabel(e) {
    var t;
    return typeof e == 'string'
      ? e.replace(/\.demo\.ts$/, '')
      : e.title
        ? e.title
        : (((t = (e.filename ?? '').split('/').pop()) == null ? void 0 : t.replace(/\.demo\.ts$/, '')) ?? '');
  }
  getDemoNavPath(e) {
    return e.navPath !== void 0
      ? (Array.isArray(e.navPath) ? e.navPath : e.navPath.split('/')).map((n) => n.trim()).filter(Boolean)
      : e.group
        ? [e.group]
        : (e.filename ?? '').split('/').slice(0, -1);
  }
  compareDemos(e, t) {
    const n = Number.isFinite(e.order) ? e.order : Number.MAX_SAFE_INTEGER,
      r = Number.isFinite(t.order) ? t.order : Number.MAX_SAFE_INTEGER;
    if (n !== r) return n - r;
    const s = [...this.getDemoNavPath(e), this.getDemoLabel(e)],
      o = [...this.getDemoNavPath(t), this.getDemoLabel(t)];
    for (let l = 0; l < Math.max(s.length, o.length); l += 1) {
      if (s[l] === void 0) return -1;
      if (o[l] === void 0) return 1;
      const a = s[l].localeCompare(o[l], void 0, { numeric: !0, sensitivity: 'base' });
      if (a !== 0) return a;
    }
    return (e.filename ?? '').localeCompare(t.filename ?? '', void 0, { numeric: !0 });
  }
}
const tr =
    ':host{display:block;color:#111827;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.demo{min-height:100%;background:#f8fafc}.header{display:grid;grid-template-columns:minmax(0,1fr) auto;align-content:end;align-items:end;gap:16px;min-height:200px;padding:48px 24px 20px;background:#000;color:#fff}.header-copy{display:grid;gap:8px}.title{margin:0;font-size:1.5rem;line-height:1.2}.description{margin:0;color:#fffc}.header-extra{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:12px}.header-extra:empty{display:none}.header-actions{display:flex;flex-wrap:wrap;gap:8px}.header-action{display:inline-flex;align-items:center;gap:7px;min-height:36px;padding:7px 11px;border:1px solid rgba(255,255,255,.35);border-radius:7px;color:#fff;font-weight:600;text-decoration:none;transition:border-color .12s ease,background-color .12s ease}.header-action:hover,.header-action:focus-visible{border-color:#ffffffbf;background:#ffffff1f}.header-action:focus-visible{outline:2px solid #fff;outline-offset:2px}.header-action svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.content{min-width:0;padding:24px}@media(max-width:640px){.header{grid-template-columns:1fr}.header-extra{justify-content:flex-start}}',
  De = class De extends S {
    constructor() {
      (super(), (this.fullscreenHref = ''), (this.sourceHref = ''));
    }
    render() {
      var n, r, s, o;
      const e = ((n = this.data) == null ? void 0 : n.title) ?? '',
        t = ((r = this.data) == null ? void 0 : r.description) ?? '';
      return E`
      <section class="demo">
        <header class="header">
          <div class="header-copy">
            ${e ? E`<h2 class="title">${e}</h2>` : w}
            ${t ? E`<p class="description">${t}</p>` : w}
          </div>

          <div class="header-extra">
            ${
              (s = this.data) != null && s.filename
                ? E`
                  <nav class="header-actions" aria-label="Demo-Aktionen">
                    <a class="header-action" href=${this.fullscreenHref}>
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
                      </svg>
                      <span>View Fullscreen</span>
                    </a>
                    <a class="header-action" href=${this.sourceHref}>
                      <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />
                      </svg>
                      <span>Source</span>
                    </a>
                  </nav>
                `
                : w
            }
            <slot name="header"></slot>
          </div>
        </header>

        <tj-demo-controls .data=${((o = this.data) == null ? void 0 : o.controls) ?? []}>
          <slot name="controls" slot="controls"></slot>
        </tj-demo-controls>
      </section>
    `;
    }
  };
((De.properties = { data: { attribute: !1 }, fullscreenHref: { attribute: !1 }, sourceHref: { attribute: !1 } }),
  (De.styles = [G(tr)]));
let it = De;
typeof customElements < 'u' && !customElements.get('tj-demo') && customElements.define('tj-demo', it);
const nr =
  ':host{display:block;color:#111827;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.viewer{min-height:100%}.content{min-width:0;min-height:100%}';
var q, R, W, H, C, ot, _n, vn, bn;
const je = class je extends S {
  constructor() {
    super(...arguments);
    v(this, C);
    v(this, q);
    v(this, R);
    v(this, W);
    v(this, H);
    ((this.viewMode = 'default'),
      x(this, q, []),
      x(this, R, new St([])),
      x(this, W, 0),
      x(this, H, () => {
        ((this.viewMode = Se(window.location.search)), (this.selectedDemo = c(this, C, ot).call(this)));
      }));
  }
  set demos(t) {
    if (
      (x(this, q, Array.isArray(t) ? t : []),
      x(this, R, new St(u(this, q))),
      (this.navData = u(this, R).getNavData()),
      (this.selectedDemo = c(this, C, ot).call(this)),
      !this.selectedDemo && typeof window < 'u' && !window.location.hash)
    ) {
      const n = u(this, R).getFirstDemo();
      n &&
        (window.history.replaceState(null, '', u(this, R).getDemoHref(n)),
        (this.selectedDemo = n),
        window.dispatchEvent(new Event('hashchange')));
    }
    this.requestUpdate();
  }
  get demos() {
    return u(this, q);
  }
  connectedCallback() {
    (super.connectedCallback(),
      (this.viewMode = Se(window.location.search)),
      window.dispatchEvent(new CustomEvent('tj:viewerReady', { detail: { viewer: this } })),
      window.addEventListener('hashchange', u(this, H)),
      window.addEventListener('popstate', u(this, H)));
  }
  disconnectedCallback() {
    (window.removeEventListener('hashchange', u(this, H)),
      window.removeEventListener('popstate', u(this, H)),
      super.disconnectedCallback());
  }
  updated(t) {
    (super.updated(t), (t.has('selectedDemo') || t.has('navData') || t.has('viewMode')) && c(this, C, _n).call(this));
  }
  render() {
    if (this.viewMode !== 'default') return E``;
    const t = typeof window > 'u' ? '' : window.location.href,
      n = t ? Ye(t, 'fullscreen') : '',
      r = t ? Ye(t, 'source') : '';
    return E`
      <div class="viewer">
        <tj-demo-viewer-nav .data=${this.navData}></tj-demo-viewer-nav>
        <slot name="controls" slot="controls"></slot>
        <main class="content">
          <tj-demo
            id="demo"
            .data=${this.selectedDemo}
            .fullscreenHref=${n}
            .sourceHref=${r}
          ></tj-demo>
        </main>
      </div>
    `;
  }
};
((q = new WeakMap()),
  (R = new WeakMap()),
  (W = new WeakMap()),
  (H = new WeakMap()),
  (C = new WeakSet()),
  (ot = function () {
    const t = typeof window > 'u' ? '' : window.location.hash;
    return u(this, R).getDemoByHash(t);
  }),
  (_n = async function () {
    const t = document.querySelector('tj-demo-renderer');
    if (!t) return;
    const n = ++ht(this, W)._;
    if ((c(this, C, bn).call(this), !this.selectedDemo)) {
      await t.showDemo({
        title: 'Demo auswählen',
        render(r) {
          r.textContent = 'Demo auswählen';
        },
      });
      return;
    }
    if (typeof this.selectedDemo.load == 'function') {
      await t.showDemo({
        title: this.selectedDemo.title ?? 'Demo laden',
        render(s) {
          s.textContent = 'Demo wird geladen …';
        },
      });
      const r = await this.selectedDemo.load();
      if (n !== u(this, W)) return;
      this.selectedDemo = r;
      return;
    }
    (await t.showDemo(this.selectedDemo), n === u(this, W) && c(this, C, vn).call(this, this.selectedDemo));
  }),
  (vn = function (t) {
    if (!t.controls_raw_html) return;
    const n = document.createElement('div');
    ((n.slot = 'controls'), (n.dataset.generatedControls = ''), (n.innerHTML = t.controls_raw_html), this.append(n));
  }),
  (bn = function () {
    for (const t of Array.from(this.querySelectorAll('[data-generated-controls]'))) t.remove();
  }),
  (je.properties = { navData: { state: !0 }, selectedDemo: { state: !0 }, viewMode: { state: !0 } }),
  (je.styles = [G(nr)]));
let st = je;
typeof customElements < 'u' && !customElements.get('tj-demo-viewer') && customElements.define('tj-demo-viewer', st);
const rr = 'modulepreload',
  ir = function (i, e) {
    return new URL(i, e).href;
  },
  Ot = {},
  d = function (e, t, n) {
    let r = Promise.resolve();
    if (t && t.length > 0) {
      let o = function (p) {
        return Promise.all(
          p.map((m) =>
            Promise.resolve(m).then(
              (b) => ({ status: 'fulfilled', value: b }),
              (b) => ({ status: 'rejected', reason: b }),
            ),
          ),
        );
      };
      const l = document.getElementsByTagName('link'),
        a = document.querySelector('meta[property=csp-nonce]'),
        h = (a == null ? void 0 : a.nonce) || (a == null ? void 0 : a.getAttribute('nonce'));
      r = o(
        t.map((p) => {
          if (((p = ir(p, n)), p in Ot)) return;
          Ot[p] = !0;
          const m = p.endsWith('.css'),
            b = m ? '[rel="stylesheet"]' : '';
          if (!!n)
            for (let N = l.length - 1; N >= 0; N--) {
              const Y = l[N];
              if (Y.href === p && (!m || Y.rel === 'stylesheet')) return;
            }
          else if (document.querySelector(`link[href="${p}"]${b}`)) return;
          const $ = document.createElement('link');
          if (
            (($.rel = m ? 'stylesheet' : rr),
            m || ($.as = 'script'),
            ($.crossOrigin = ''),
            ($.href = p),
            h && $.setAttribute('nonce', h),
            document.head.appendChild($),
            m)
          )
            return new Promise((N, Y) => {
              ($.addEventListener('load', N),
                $.addEventListener('error', () => Y(new Error(`Unable to preload CSS for ${p}`))));
            });
        }),
      );
    }
    function s(o) {
      const l = new Event('vite:preloadError', { cancelable: !0 });
      if (((l.payload = o), window.dispatchEvent(l), !l.defaultPrevented)) throw o;
    }
    return r.then((o) => {
      for (const l of o || []) l.status === 'rejected' && s(l.reason);
      return e().catch(s);
    });
  };
function g(i, e, t) {
  const n = e.default ?? e,
    r = typeof n == 'object' && n !== null ? n : {},
    s = typeof r.render == 'function' ? r.render : typeof e.render == 'function' ? e.render : void 0;
  return {
    ...r,
    filename: r.filename ?? i,
    ...(s ? { render: s } : {}),
    ...(typeof t == 'string' ? { source: t } : {}),
  };
}
const sr = [
  {
    title: 'Accordion',
    filename: 'nextrap-elements/nte-accordion/demo/01-accordion.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./01-accordion.demo-1YdZNhE9.js'),
          __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
          import.meta.url,
        ),
        d(() => import('./01-accordion.demo-Eys6SvvY.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-accordion/demo/01-accordion.demo.ts', i, e.default)),
  },
  {
    title: 'Accordion in NTL 2col',
    filename: 'nextrap-elements/nte-accordion/demo/02-ntl-2col-pairing.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./02-ntl-2col-pairing.demo-DBDJfown.js'),
          __vite__mapDeps([10, 1, 2, 3, 5, 6, 4, 7, 8, 9]),
          import.meta.url,
        ),
        d(() => import('./02-ntl-2col-pairing.demo-ZS6R3Ilb.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-accordion/demo/02-ntl-2col-pairing.demo.ts', i, e.default)),
  },
  {
    title: 'Data und View State',
    filename: 'nextrap-elements/nte-data-table/demo/01-data.demo.ts',
    load: () =>
      Promise.all([
        d(() => import('./01-data.demo-BatkvBRi.js'), __vite__mapDeps([11, 3, 12, 1, 2, 5, 6, 8]), import.meta.url),
        d(() => import('./01-data.demo-CeOle-J6.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-data-table/demo/01-data.demo.ts', i, e.default)),
  },
  {
    title: 'Überblick',
    filename: 'nextrap-elements/nte-input/demo/01-overview.demo.ts',
    load: () =>
      Promise.all([
        d(() => import('./01-overview.demo-DgJThnJW.js'), __vite__mapDeps([13, 3]), import.meta.url),
        d(() => import('./01-overview.demo-NzgfW1h8.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-input/demo/01-overview.demo.ts', i, e.default)),
  },
  {
    title: 'Styles & Typen',
    filename: 'nextrap-elements/nte-input/demo/02-hover-style.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./02-hover-style.demo-CZ9vKRje.js'),
          __vite__mapDeps([14, 3, 15, 1, 2, 16, 17, 5, 6, 18, 19, 20]),
          import.meta.url,
        ),
        d(() => import('./02-hover-style.demo-B_ODjEp9.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-input/demo/02-hover-style.demo.ts', i, e.default)),
  },
  {
    title: 'FormData Submit',
    filename: 'nextrap-elements/nte-input/demo/03-form-action.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./03-form-action.demo-B590AC6d.js'),
          __vite__mapDeps([21, 3, 15, 1, 2, 16, 17, 5, 6, 18, 19, 20]),
          import.meta.url,
        ),
        d(() => import('./03-form-action.demo-DWO2to0I.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-input/demo/03-form-action.demo.ts', i, e.default)),
  },
  {
    title: 'FormDataAccessor',
    filename: 'nextrap-elements/nte-input/demo/04-form-data.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./04-form-data.demo-C6Xe2w-y.js'),
          __vite__mapDeps([22, 3, 15, 1, 2, 16, 17, 5, 6, 18, 19, 20]),
          import.meta.url,
        ),
        d(() => import('./04-form-data.demo-Cjogt-vA.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-input/demo/04-form-data.demo.ts', i, e.default)),
  },
  {
    title: 'Validation',
    filename: 'nextrap-elements/nte-input/demo/05-validation.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./05-validation.demo-C9OFkb5o.js'),
          __vite__mapDeps([23, 3, 15, 1, 2, 16, 17, 5, 6, 18, 19, 20]),
          import.meta.url,
        ),
        d(() => import('./05-validation.demo-BcD1RhnO.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-input/demo/05-validation.demo.ts', i, e.default)),
  },
  {
    title: 'Select-Radio Vertical',
    filename: 'nextrap-elements/nte-input/demo/06-select-radio-vertical.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./06-select-radio-vertical.demo-Dfaa66j_.js'),
          __vite__mapDeps([24, 3, 15, 1, 2, 16, 17, 5, 6, 18, 19, 20]),
          import.meta.url,
        ),
        d(() => import('./06-select-radio-vertical.demo-Cbx5Uezo.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-input/demo/06-select-radio-vertical.demo.ts', i, e.default)),
  },
  {
    title: 'API-Entwurf',
    filename: 'nextrap-elements/nte-nav-2/demo/01-overview.demo.ts',
    load: () =>
      Promise.all([
        d(() => import('./01-overview.demo-B-xOu2B4.js'), __vite__mapDeps([25, 3]), import.meta.url),
        d(() => import('./01-overview.demo-7Kw7iFUf.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-nav-2/demo/01-overview.demo.ts', i, e.default)),
  },
  {
    title: 'Horizontal',
    filename: 'nextrap-elements/nte-nav-2/demo/02-horizontal.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./02-horizontal.demo-D83oWlUC.js'),
          __vite__mapDeps([26, 3, 27, 17, 19, 1, 2, 16, 28]),
          import.meta.url,
        ),
        d(() => import('./02-horizontal.demo-BsorH6QP.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-nav-2/demo/02-horizontal.demo.ts', i, e.default)),
  },
  {
    title: 'Vertikal',
    filename: 'nextrap-elements/nte-nav-2/demo/03-vertical.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./03-vertical.demo-CrcD-UKg.js'),
          __vite__mapDeps([29, 3, 27, 17, 19, 1, 2, 16, 28]),
          import.meta.url,
        ),
        d(() => import('./03-vertical.demo-BWmZHtWo.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-nav-2/demo/03-vertical.demo.ts', i, e.default)),
  },
  {
    title: 'Responsive & Order',
    filename: 'nextrap-elements/nte-nav-2/demo/04-responsive-order.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./04-responsive-order.demo-BsGsdKH7.js'),
          __vite__mapDeps([30, 3, 27, 17, 19, 1, 2, 16, 28]),
          import.meta.url,
        ),
        d(() => import('./04-responsive-order.demo-CA3FhXFK.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-nav-2/demo/04-responsive-order.demo.ts', i, e.default)),
  },
  {
    title: 'Variationen',
    filename: 'nextrap-elements/nte-nav-2/demo/05-variations.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./05-variations.demo-CcLS-aTa.js'),
          __vite__mapDeps([31, 3, 27, 17, 19, 1, 2, 16, 28]),
          import.meta.url,
        ),
        d(() => import('./05-variations.demo-DpAcjCLo.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-nav-2/demo/05-variations.demo.ts', i, e.default)),
  },
  {
    title: 'NTE Privacy Consent',
    filename: 'nextrap-elements/nte-privacy-consent/demo/01-overview.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./01-overview.demo-CeTp9POA.js'),
          __vite__mapDeps([32, 3, 33, 1, 2, 5, 6, 18]),
          import.meta.url,
        ),
        d(() => import('./01-overview.demo-B5QBaZCk.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-privacy-consent/demo/01-overview.demo.ts', i, e.default)),
  },
  {
    title: 'Dialog und Einstellungen',
    filename: 'nextrap-elements/nte-privacy-consent/demo/02-dialog.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./02-dialog.demo-BZYhm0WE.js'),
          __vite__mapDeps([34, 17, 3, 33, 1, 2, 5, 6, 18, 35]),
          import.meta.url,
        ),
        d(() => import('./02-dialog.demo-C1phqEdo.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-privacy-consent/demo/02-dialog.demo.ts', i, e.default)),
  },
  {
    title: 'Progress bars',
    order: 10,
    filename: 'nextrap-elements/nte-progress/demo/01-bars.demo.ts',
    load: () =>
      Promise.all([
        d(() => import('./01-bars.demo-BJ2kYgPC.js'), __vite__mapDeps([36, 3, 37, 2, 16, 8, 9]), import.meta.url),
        d(() => import('./01-bars.demo-D_a7VTil.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-progress/demo/01-bars.demo.ts', i, e.default)),
  },
  {
    title: 'Circular progress',
    order: 20,
    filename: 'nextrap-elements/nte-progress/demo/02-circles.demo.ts',
    load: () =>
      Promise.all([
        d(() => import('./02-circles.demo-BsAG5dcM.js'), __vite__mapDeps([38, 3, 37, 2, 16, 8, 9]), import.meta.url),
        d(() => import('./02-circles.demo-FfbKHDr7.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-progress/demo/02-circles.demo.ts', i, e.default)),
  },
  {
    title: 'Interactive API and events',
    order: 30,
    filename: 'nextrap-elements/nte-progress/demo/03-interactive.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./03-interactive.demo-Cl_tQHib.js'),
          __vite__mapDeps([39, 3, 37, 2, 16, 8, 9]),
          import.meta.url,
        ),
        d(() => import('./03-interactive.demo-D2hB36S9.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-progress/demo/03-interactive.demo.ts', i, e.default)),
  },
  {
    title: 'Overview',
    filename: 'nextrap-elements/nte-spinner/demo/01-overview.demo.ts',
    load: () =>
      Promise.all([
        d(() => import('./01-overview.demo-CgiOpPUU.js'), __vite__mapDeps([40, 3, 17, 41, 42]), import.meta.url),
        d(() => import('./01-overview.demo-B9KRKqm-.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-spinner/demo/01-overview.demo.ts', i, e.default)),
  },
  {
    title: 'Interactive states',
    filename: 'nextrap-elements/nte-spinner/demo/02-interactive.demo.ts',
    load: () =>
      Promise.all([
        d(() => import('./02-interactive.demo-D4HinYvj.js'), __vite__mapDeps([43, 3, 17, 41, 42]), import.meta.url),
        d(() => import('./02-interactive.demo-Ck2BffsK.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-spinner/demo/02-interactive.demo.ts', i, e.default)),
  },
  {
    title: 'Scroll-Viewport',
    filename: 'nextrap-elements/nte-table/demo/01-table-viewport.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./01-table-viewport.demo-3PFoPjob.js'),
          __vite__mapDeps([44, 3, 12, 1, 2, 5, 6, 8, 9, 45]),
          import.meta.url,
        ),
        d(() => import('./01-table-viewport.demo-i9LUdYQz.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-table/demo/01-table-viewport.demo.ts', i, e.default)),
  },
  {
    title: 'Live-Layout',
    filename: 'nextrap-elements/nte-table/demo/02-live-layout.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./02-live-layout.demo-6GqHptaV.js'),
          __vite__mapDeps([46, 3, 12, 1, 2, 5, 6, 8, 9, 45]),
          import.meta.url,
        ),
        d(() => import('./02-live-layout.demo-CokNExFa.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-table/demo/02-live-layout.demo.ts', i, e.default)),
  },
  {
    title: 'Nur tbody scrollt',
    filename: 'nextrap-elements/nte-table/demo/03-tbody-scroll.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./03-tbody-scroll.demo-xkE9oo5v.js'),
          __vite__mapDeps([47, 3, 12, 1, 2, 5, 6, 8, 9, 45]),
          import.meta.url,
        ),
        d(() => import('./03-tbody-scroll.demo-Cu2f-xsL.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-table/demo/03-tbody-scroll.demo.ts', i, e.default)),
  },
  {
    title: 'Header-Styles und Zellzustände',
    filename: 'nextrap-elements/nte-table/demo/04-header-styles.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./04-header-styles.demo-BNQgnsZ6.js'),
          __vite__mapDeps([48, 3, 12, 1, 2, 5, 6, 8, 9, 45]),
          import.meta.url,
        ),
        d(() => import('./04-header-styles.demo-CIFiYSb3.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-table/demo/04-header-styles.demo.ts', i, e.default)),
  },
  {
    title: 'Fester Search-Header und Selection Remote',
    filename: 'nextrap-elements/nte-table/demo/05-search-selection.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./05-search-selection.demo-z-ssZgOs.js'),
          __vite__mapDeps([49, 3, 12, 1, 2, 5, 6, 8, 9, 45]),
          import.meta.url,
        ),
        d(() => import('./05-search-selection.demo-jeVuPmLh.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-table/demo/05-search-selection.demo.ts', i, e.default)),
  },
  {
    title: 'Feste Caption, Suche und mobiler Scrollindikator',
    filename: 'nextrap-elements/nte-table/demo/06-caption-overflow.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./06-caption-overflow.demo-V1PUKWTC.js'),
          __vite__mapDeps([50, 3, 12, 1, 2, 5, 6, 8, 9, 45]),
          import.meta.url,
        ),
        d(() => import('./06-caption-overflow.demo-Cy3v7sbk.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-table/demo/06-caption-overflow.demo.ts', i, e.default)),
  },
  {
    title: 'Table-Plugins',
    filename: 'nextrap-elements/nte-table/demo/07-plugins.demo.ts',
    load: () =>
      Promise.all([
        d(
          () => import('./07-plugins.demo-Bh9fW3uG.js'),
          __vite__mapDeps([51, 3, 12, 1, 2, 5, 6, 8, 9, 45]),
          import.meta.url,
        ),
        d(() => import('./07-plugins.demo-DtO3x3TU.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-elements/nte-table/demo/07-plugins.demo.ts', i, e.default)),
  },
  {
    title: 'Buttons',
    group: 'style-button',
    filename: 'nextrap-styles/style-button/demo/01-buttons.demo.ts',
    load: () =>
      Promise.all([
        d(() => import('./01-buttons.demo-DIU04Lfz.js'), __vite__mapDeps([52, 3, 53, 8, 6, 9]), import.meta.url),
        d(() => import('./01-buttons.demo-CHtuF_aT.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-styles/style-button/demo/01-buttons.demo.ts', i, e.default)),
  },
  {
    title: 'Style Elements',
    group: 'style-elements',
    filename: 'nextrap-styles/style-elements/demo/01-overview.demo.ts',
    load: () =>
      Promise.all([
        d(() => import('./01-overview.demo-DtoCTkOp.js'), __vite__mapDeps([54, 3, 55, 8, 6, 9]), import.meta.url),
        d(() => import('./01-overview.demo-B9nBaVw1.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-styles/style-elements/demo/01-overview.demo.ts', i, e.default)),
  },
  {
    title: 'Switches',
    group: 'style-switch',
    filename: 'nextrap-styles/style-switch/demo/01-switches.demo.ts',
    load: () =>
      Promise.all([
        d(() => import('./01-switches.demo-DtxHu6pV.js'), __vite__mapDeps([56, 3, 57, 8, 6, 9]), import.meta.url),
        d(() => import('./01-switches.demo-BwZShZ-8.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-styles/style-switch/demo/01-switches.demo.ts', i, e.default)),
  },
  {
    title: 'Style Utils',
    group: 'style-utils',
    filename: 'nextrap-styles/style-utils/demo/01-overview.demo.ts',
    load: () =>
      Promise.all([
        d(() => import('./01-overview.demo-Ds93UuPS.js'), __vite__mapDeps([58, 3, 59, 8, 6, 9]), import.meta.url),
        d(() => import('./01-overview.demo-CftIcf96.js'), [], import.meta.url),
      ]).then(([i, e]) => g('nextrap-styles/style-utils/demo/01-overview.demo.ts', i, e.default)),
  },
];
function Lt() {
  const i = document.querySelector('tj-demo-viewer');
  return i ? ((i.demos = sr), !0) : !1;
}
Lt() ||
  window.addEventListener(
    'tj:viewerReady',
    () => {
      Lt();
    },
    { once: !0 },
  );
export { w as A, Un as D, ie as E, E as b, jt as f, S as i, cr as j, Dt as n, G as r, qe as u, Z as y };
