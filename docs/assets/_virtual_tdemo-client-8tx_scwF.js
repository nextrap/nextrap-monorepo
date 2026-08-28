const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      './02-hover-style.demo-B1QIo3nP.js',
      './main-Bjch26BO.js',
      './index-D64-0tiN.js',
      './main-BkomUfB9.css',
      './index-NZ9cz-wL.css',
      './03-form-action.demo-DRRId1H5.js',
      './04-form-data.demo-B_hbCK-D.js',
      './05-validation.demo-DSf_VrrD.js',
      './06-select-radio-vertical.demo-GkMZo216.js',
      './02-horizontal.demo-DE6Zmbzo.js',
      './main-Cazcs_VE.js',
      './main-kdjNNg6E.css',
      './03-vertical.demo-0oRGleO5.js',
      './04-responsive-order.demo-BLxeRy0A.js',
      './01-buttons.demo-9oIaug5Y.js',
      './01-buttons-B-QmuC-C.css',
    ]),
) => i.map((i) => d[i]);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const ve = globalThis,
  et =
    ve.ShadowRoot &&
    (ve.ShadyCSS === void 0 || ve.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype,
  tt = Symbol(),
  rt = new WeakMap();
let Mt = class {
  constructor(e, t, n) {
    if (((this._$cssResult$ = !0), n !== tt))
      throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    ((this.cssText = e), (this.t = t));
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (et && e === void 0) {
      const n = t !== void 0 && t.length === 1;
      (n && (e = rt.get(t)),
        e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && rt.set(t, e)));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const V = (i) => new Mt(typeof i == 'string' ? i : i + '', void 0, tt),
  vn = (i, ...e) => {
    const t =
      i.length === 1
        ? i[0]
        : e.reduce(
            (n, s, o) =>
              n +
              ((r) => {
                if (r._$cssResult$ === !0) return r.cssText;
                if (typeof r == 'number') return r;
                throw Error(
                  "Value passed to 'css' function must be a 'css' function result: " +
                    r +
                    ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.",
                );
              })(s) +
              i[o + 1],
            i[0],
          );
    return new Mt(t, i, tt);
  },
  bn = (i, e) => {
    if (et) i.adoptedStyleSheets = e.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet));
    else
      for (const t of e) {
        const n = document.createElement('style'),
          s = ve.litNonce;
        (s !== void 0 && n.setAttribute('nonce', s), (n.textContent = t.cssText), i.appendChild(n));
      }
  },
  ot = et
    ? (i) => i
    : (i) =>
        i instanceof CSSStyleSheet
          ? ((e) => {
              let t = '';
              for (const n of e.cssRules) t += n.cssText;
              return V(t);
            })(i)
          : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const {
    is: _n,
    defineProperty: yn,
    getOwnPropertyDescriptor: wn,
    getOwnPropertyNames: xn,
    getOwnPropertySymbols: $n,
    getPrototypeOf: En,
  } = Object,
  L = globalThis,
  at = L.trustedTypes,
  kn = at ? at.emptyScript : '',
  Me = L.reactiveElementPolyfillSupport,
  ae = (i, e) => i,
  Ue = {
    toAttribute(i, e) {
      switch (e) {
        case Boolean:
          i = i ? kn : null;
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
  Dt = (i, e) => !_n(i, e),
  lt = { attribute: !0, type: String, converter: Ue, reflect: !1, useDefault: !1, hasChanged: Dt };
(Symbol.metadata ?? (Symbol.metadata = Symbol('metadata')),
  L.litPropertyMetadata ?? (L.litPropertyMetadata = new WeakMap()));
let K = class extends HTMLElement {
  static addInitializer(e) {
    (this._$Ei(), (this.l ?? (this.l = [])).push(e));
  }
  static get observedAttributes() {
    return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
  }
  static createProperty(e, t = lt) {
    if (
      (t.state && (t.attribute = !1),
      this._$Ei(),
      this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0),
      this.elementProperties.set(e, t),
      !t.noAccessor)
    ) {
      const n = Symbol(),
        s = this.getPropertyDescriptor(e, n, t);
      s !== void 0 && yn(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, n) {
    const { get: s, set: o } = wn(this.prototype, e) ?? {
      get() {
        return this[t];
      },
      set(r) {
        this[t] = r;
      },
    };
    return {
      get: s,
      set(r) {
        const l = s == null ? void 0 : s.call(this);
        (o == null || o.call(this, r), this.requestUpdate(e, l, n));
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? lt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ae('elementProperties'))) return;
    const e = En(this);
    (e.finalize(), e.l !== void 0 && (this.l = [...e.l]), (this.elementProperties = new Map(e.elementProperties)));
  }
  static finalize() {
    if (this.hasOwnProperty(ae('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(ae('properties')))) {
      const t = this.properties,
        n = [...xn(t), ...$n(t)];
      for (const s of n) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [n, s] of t) this.elementProperties.set(n, s);
    }
    this._$Eh = new Map();
    for (const [t, n] of this.elementProperties) {
      const s = this._$Eu(t, n);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const n = new Set(e.flat(1 / 0).reverse());
      for (const s of n) t.unshift(ot(s));
    } else e !== void 0 && t.push(ot(e));
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
    return (bn(e, this.constructor.elementStyles), e);
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
    var o;
    const n = this.constructor.elementProperties.get(e),
      s = this.constructor._$Eu(e, n);
    if (s !== void 0 && n.reflect === !0) {
      const r = (((o = n.converter) == null ? void 0 : o.toAttribute) !== void 0 ? n.converter : Ue).toAttribute(
        t,
        n.type,
      );
      ((this._$Em = e), r == null ? this.removeAttribute(s) : this.setAttribute(s, r), (this._$Em = null));
    }
  }
  _$AK(e, t) {
    var o, r;
    const n = this.constructor,
      s = n._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const l = n.getPropertyOptions(s),
        a =
          typeof l.converter == 'function'
            ? { fromAttribute: l.converter }
            : ((o = l.converter) == null ? void 0 : o.fromAttribute) !== void 0
              ? l.converter
              : Ue;
      this._$Em = s;
      const h = a.fromAttribute(t, l.type);
      ((this[s] = h ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? h), (this._$Em = null));
    }
  }
  requestUpdate(e, t, n, s = !1, o) {
    var r;
    if (e !== void 0) {
      const l = this.constructor;
      if (
        (s === !1 && (o = this[e]),
        n ?? (n = l.getPropertyOptions(e)),
        !(
          (n.hasChanged ?? Dt)(o, t) ||
          (n.useDefault &&
            n.reflect &&
            o === ((r = this._$Ej) == null ? void 0 : r.get(e)) &&
            !this.hasAttribute(l._$Eu(e, n)))
        ))
      )
        return;
      this.C(e, t, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: n, reflect: s, wrapped: o }, r) {
    (n &&
      !(this._$Ej ?? (this._$Ej = new Map())).has(e) &&
      (this._$Ej.set(e, r ?? t ?? this[e]), o !== !0 || r !== void 0)) ||
      (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)),
      s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = new Set())).add(e));
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
        for (const [o, r] of this._$Ep) this[o] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0)
        for (const [o, r] of s) {
          const { wrapped: l } = r,
            a = this[o];
          l !== !0 || this._$AL.has(o) || a === void 0 || this.C(o, void 0, r, a);
        }
    }
    let e = !1;
    const t = this._$AL;
    try {
      ((e = this.shouldUpdate(t)),
        e
          ? (this.willUpdate(t),
            (n = this._$EO) == null ||
              n.forEach((s) => {
                var o;
                return (o = s.hostUpdate) == null ? void 0 : o.call(s);
              }),
            this.update(t))
          : this._$EM());
    } catch (s) {
      throw ((e = !1), this._$EM(), s);
    }
    e && this._$AE(t);
  }
  willUpdate(e) {}
  _$AE(e) {
    var t;
    ((t = this._$EO) == null ||
      t.forEach((n) => {
        var s;
        return (s = n.hostUpdated) == null ? void 0 : s.call(n);
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
((K.elementStyles = []),
  (K.shadowRootOptions = { mode: 'open' }),
  (K[ae('elementProperties')] = new Map()),
  (K[ae('finalized')] = new Map()),
  Me == null || Me({ ReactiveElement: K }),
  (L.reactiveElementVersions ?? (L.reactiveElementVersions = [])).push('2.1.2'));
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const le = globalThis,
  dt = (i) => i,
  ke = le.trustedTypes,
  ct = ke ? ke.createPolicy('lit-html', { createHTML: (i) => i }) : void 0,
  Rt = '$lit$',
  D = `lit$${Math.random().toFixed(9).slice(2)}$`,
  Lt = '?' + D,
  An = `<${Lt}>`,
  F = document,
  me = () => F.createComment(''),
  fe = (i) => i === null || (typeof i != 'object' && typeof i != 'function'),
  nt = Array.isArray,
  Cn = (i) => nt(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == 'function',
  De = `[ 	
\f\r]`,
  ee = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  ht = /-->/g,
  ut = />/g,
  H = RegExp(
    `>|${De}(?:([^\\s"'>=/]+)(${De}*=${De}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,
    'g',
  ),
  pt = /'/g,
  mt = /"/g,
  Tt = /^(?:script|style|textarea|title)$/i,
  Sn =
    (i) =>
    (e, ...t) => ({ _$litType$: i, strings: e, values: t }),
  x = Sn(1),
  Q = Symbol.for('lit-noChange'),
  g = Symbol.for('lit-nothing'),
  ft = new WeakMap(),
  I = F.createTreeWalker(F, 129);
function Ht(i, e) {
  if (!nt(i) || !i.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return ct !== void 0 ? ct.createHTML(e) : e;
}
const jn = (i, e) => {
  const t = i.length - 1,
    n = [];
  let s,
    o = e === 2 ? '<svg>' : e === 3 ? '<math>' : '',
    r = ee;
  for (let l = 0; l < t; l++) {
    const a = i[l];
    let h,
      c,
      p = -1,
      _ = 0;
    for (; _ < a.length && ((r.lastIndex = _), (c = r.exec(a)), c !== null);)
      ((_ = r.lastIndex),
        r === ee
          ? c[1] === '!--'
            ? (r = ht)
            : c[1] !== void 0
              ? (r = ut)
              : c[2] !== void 0
                ? (Tt.test(c[2]) && (s = RegExp('</' + c[2], 'g')), (r = H))
                : c[3] !== void 0 && (r = H)
          : r === H
            ? c[0] === '>'
              ? ((r = s ?? ee), (p = -1))
              : c[1] === void 0
                ? (p = -2)
                : ((p = r.lastIndex - c[2].length), (h = c[1]), (r = c[3] === void 0 ? H : c[3] === '"' ? mt : pt))
            : r === mt || r === pt
              ? (r = H)
              : r === ht || r === ut
                ? (r = ee)
                : ((r = H), (s = void 0)));
    const E = r === H && i[l + 1].startsWith('/>') ? ' ' : '';
    o += r === ee ? a + An : p >= 0 ? (n.push(h), a.slice(0, p) + Rt + a.slice(p) + D + E) : a + D + (p === -2 ? l : E);
  }
  return [Ht(i, o + (i[t] || '<?>') + (e === 2 ? '</svg>' : e === 3 ? '</math>' : '')), n];
};
let Ie = class Nt {
  constructor({ strings: e, _$litType$: t }, n) {
    let s;
    this.parts = [];
    let o = 0,
      r = 0;
    const l = e.length - 1,
      a = this.parts,
      [h, c] = jn(e, t);
    if (((this.el = Nt.createElement(h, n)), (I.currentNode = this.el.content), t === 2 || t === 3)) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (s = I.nextNode()) !== null && a.length < l;) {
      if (s.nodeType === 1) {
        if (s.hasAttributes())
          for (const p of s.getAttributeNames())
            if (p.endsWith(Rt)) {
              const _ = c[r++],
                E = s.getAttribute(p).split(D),
                $ = /([.?@])?(.*)/.exec(_);
              (a.push({
                type: 1,
                index: o,
                name: $[2],
                strings: E,
                ctor: $[1] === '.' ? Pn : $[1] === '?' ? Mn : $[1] === '@' ? Dn : je,
              }),
                s.removeAttribute(p));
            } else p.startsWith(D) && (a.push({ type: 6, index: o }), s.removeAttribute(p));
        if (Tt.test(s.tagName)) {
          const p = s.textContent.split(D),
            _ = p.length - 1;
          if (_ > 0) {
            s.textContent = ke ? ke.emptyScript : '';
            for (let E = 0; E < _; E++) (s.append(p[E], me()), I.nextNode(), a.push({ type: 2, index: ++o }));
            s.append(p[_], me());
          }
        }
      } else if (s.nodeType === 8)
        if (s.data === Lt) a.push({ type: 2, index: o });
        else {
          let p = -1;
          for (; (p = s.data.indexOf(D, p + 1)) !== -1;) (a.push({ type: 7, index: o }), (p += D.length - 1));
        }
      o++;
    }
  }
  static createElement(e, t) {
    const n = F.createElement('template');
    return ((n.innerHTML = e), n);
  }
};
function Y(i, e, t = i, n) {
  var r, l;
  if (e === Q) return e;
  let s = n !== void 0 ? ((r = t._$Co) == null ? void 0 : r[n]) : t._$Cl;
  const o = fe(e) ? void 0 : e._$litDirective$;
  return (
    (s == null ? void 0 : s.constructor) !== o &&
      ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1),
      o === void 0 ? (s = void 0) : ((s = new o(i)), s._$AT(i, t, n)),
      n !== void 0 ? ((t._$Co ?? (t._$Co = []))[n] = s) : (t._$Cl = s)),
    s !== void 0 && (e = Y(i, s._$AS(i, e.values), s, n)),
    e
  );
}
let On = class {
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
        s = ((e == null ? void 0 : e.creationScope) ?? F).importNode(t, !0);
      I.currentNode = s;
      let o = I.nextNode(),
        r = 0,
        l = 0,
        a = n[0];
      for (; a !== void 0;) {
        if (r === a.index) {
          let h;
          (a.type === 2
            ? (h = new it(o, o.nextSibling, this, e))
            : a.type === 1
              ? (h = new a.ctor(o, a.name, a.strings, this, e))
              : a.type === 6 && (h = new Rn(o, this, e)),
            this._$AV.push(h),
            (a = n[++l]));
        }
        r !== (a == null ? void 0 : a.index) && ((o = I.nextNode()), r++);
      }
      return ((I.currentNode = F), s);
    }
    p(e) {
      let t = 0;
      for (const n of this._$AV)
        (n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, t), (t += n.strings.length - 2)) : n._$AI(e[t])), t++);
    }
  },
  it = class Ut {
    get _$AU() {
      var e;
      return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
    }
    constructor(e, t, n, s) {
      ((this.type = 2),
        (this._$AH = g),
        (this._$AN = void 0),
        (this._$AA = e),
        (this._$AB = t),
        (this._$AM = n),
        (this.options = s),
        (this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0));
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
      ((e = Y(this, e, t)),
        fe(e)
          ? e === g || e == null || e === ''
            ? (this._$AH !== g && this._$AR(), (this._$AH = g))
            : e !== this._$AH && e !== Q && this._(e)
          : e._$litType$ !== void 0
            ? this.$(e)
            : e.nodeType !== void 0
              ? this.T(e)
              : Cn(e)
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
      (this._$AH !== g && fe(this._$AH) ? (this._$AA.nextSibling.data = e) : this.T(F.createTextNode(e)),
        (this._$AH = e));
    }
    $(e) {
      var o;
      const { values: t, _$litType$: n } = e,
        s =
          typeof n == 'number'
            ? this._$AC(e)
            : (n.el === void 0 && (n.el = Ie.createElement(Ht(n.h, n.h[0]), this.options)), n);
      if (((o = this._$AH) == null ? void 0 : o._$AD) === s) this._$AH.p(t);
      else {
        const r = new On(s, this),
          l = r.u(this.options);
        (r.p(t), this.T(l), (this._$AH = r));
      }
    }
    _$AC(e) {
      let t = ft.get(e.strings);
      return (t === void 0 && ft.set(e.strings, (t = new Ie(e))), t);
    }
    k(e) {
      nt(this._$AH) || ((this._$AH = []), this._$AR());
      const t = this._$AH;
      let n,
        s = 0;
      for (const o of e)
        (s === t.length ? t.push((n = new Ut(this.O(me()), this.O(me()), this, this.options))) : (n = t[s]),
          n._$AI(o),
          s++);
      s < t.length && (this._$AR(n && n._$AB.nextSibling, s), (t.length = s));
    }
    _$AR(e = this._$AA.nextSibling, t) {
      var n;
      for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, t); e !== this._$AB;) {
        const s = dt(e).nextSibling;
        (dt(e).remove(), (e = s));
      }
    }
    setConnected(e) {
      var t;
      this._$AM === void 0 && ((this._$Cv = e), (t = this._$AP) == null || t.call(this, e));
    }
  },
  je = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(e, t, n, s, o) {
      ((this.type = 1),
        (this._$AH = g),
        (this._$AN = void 0),
        (this.element = e),
        (this.name = t),
        (this._$AM = s),
        (this.options = o),
        n.length > 2 || n[0] !== '' || n[1] !== ''
          ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n))
          : (this._$AH = g));
    }
    _$AI(e, t = this, n, s) {
      const o = this.strings;
      let r = !1;
      if (o === void 0) ((e = Y(this, e, t, 0)), (r = !fe(e) || (e !== this._$AH && e !== Q)), r && (this._$AH = e));
      else {
        const l = e;
        let a, h;
        for (e = o[0], a = 0; a < o.length - 1; a++)
          ((h = Y(this, l[n + a], t, a)),
            h === Q && (h = this._$AH[a]),
            r || (r = !fe(h) || h !== this._$AH[a]),
            h === g ? (e = g) : e !== g && (e += (h ?? '') + o[a + 1]),
            (this._$AH[a] = h));
      }
      r && !s && this.j(e);
    }
    j(e) {
      e === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? '');
    }
  },
  Pn = class extends je {
    constructor() {
      (super(...arguments), (this.type = 3));
    }
    j(e) {
      this.element[this.name] = e === g ? void 0 : e;
    }
  },
  Mn = class extends je {
    constructor() {
      (super(...arguments), (this.type = 4));
    }
    j(e) {
      this.element.toggleAttribute(this.name, !!e && e !== g);
    }
  },
  Dn = class extends je {
    constructor(e, t, n, s, o) {
      (super(e, t, n, s, o), (this.type = 5));
    }
    _$AI(e, t = this) {
      if ((e = Y(this, e, t, 0) ?? g) === Q) return;
      const n = this._$AH,
        s = (e === g && n !== g) || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive,
        o = e !== g && (n === g || s);
      (s && this.element.removeEventListener(this.name, this, n),
        o && this.element.addEventListener(this.name, this, e),
        (this._$AH = e));
    }
    handleEvent(e) {
      var t;
      typeof this._$AH == 'function'
        ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e)
        : this._$AH.handleEvent(e);
    }
  },
  Rn = class {
    constructor(e, t, n) {
      ((this.element = e), (this.type = 6), (this._$AN = void 0), (this._$AM = t), (this.options = n));
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(e) {
      Y(this, e);
    }
  };
const Re = le.litHtmlPolyfillSupport;
(Re == null || Re(Ie, it), (le.litHtmlVersions ?? (le.litHtmlVersions = [])).push('3.3.3'));
const Ln = (i, e, t) => {
  const n = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = n._$litPart$;
  if (s === void 0) {
    const o = (t == null ? void 0 : t.renderBefore) ?? null;
    n._$litPart$ = s = new it(e.insertBefore(me(), o), o, void 0, t ?? {});
  }
  return (s._$AI(i), s);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const W = globalThis;
class A extends K {
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
      (this._$Do = Ln(t, this.renderRoot, this.renderOptions)));
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
    return Q;
  }
}
var Pt;
((A._$litElement$ = !0),
  (A.finalized = !0),
  (Pt = W.litElementHydrateSupport) == null || Pt.call(W, { LitElement: A }));
const Le = W.litElementPolyfillSupport;
Le == null || Le({ LitElement: A });
(W.litElementVersions ?? (W.litElementVersions = [])).push('4.2.2');
var Tn = Object.defineProperty,
  Hn = (i, e, t) => (e in i ? Tn(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : (i[e] = t)),
  R = (i, e, t) => Hn(i, typeof e != 'symbol' ? e + '' : e, t);
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
function gt(i) {
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
function O(i, e) {
  for (const t in e) i.setAttribute(t, e[t]);
}
function It(i) {
  return i.replace(/<[^>]*>/g, '');
}
function Nn(i) {
  return It(i)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-')
    .replace(/^-+|-+$/g, '');
}
function S(i = []) {
  const e = (n) =>
    Object.keys(n)
      .map((s) => ` ${s}="${n[s]}"`)
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
        const s = gt(n.kramdown);
        ((s.href = n.href ?? ''), (t += `<a${e(s)}>${S(n.content)}</a>`));
        break;
      }
      case 'image': {
        const s = gt(n.kramdown);
        ((s.src = n.href ?? ''), (s.alt = It(S(n.content))), (t += `<img${e(s)}>`));
        break;
      }
    }
  return t;
}
function zt(i) {
  const e = i.type === 'o-list' ? 'ol' : 'ul',
    t = document.createElement(e),
    n = i.content;
  for (const s of n) {
    if (s.type !== 'list-item') continue;
    const o = document.createElement('li'),
      r = s.content,
      l = [];
    for (const a of r)
      a.type === 'u-list' || a.type === 'o-list'
        ? (l.length && (o.insertAdjacentHTML('beforeend', S(l)), (l.length = 0)), o.appendChild(zt(a)))
        : l.push(a);
    (l.length && o.insertAdjacentHTML('beforeend', S(l)), t.appendChild(o));
  }
  return t;
}
function Un(i) {
  const e = document.createElement('table'),
    t = j(i);
  O(e, t);
  const n = i.children;
  let s = 0;
  const o = (r, l) => {
    const a = document.createElement('tr');
    return (
      r.forEach((h) => {
        const c = document.createElement(l);
        ((c.innerHTML = S(h.content)), a.appendChild(c));
      }),
      a
    );
  };
  for (const r of n) {
    if (r.type === 'table-head') {
      const l = document.createElement('thead'),
        a = o(r.content, 'th');
      ((s = r.content.length), l.appendChild(a), e.appendChild(l));
    }
    if (r.type === 'table-body') {
      const l = document.createElement('tbody'),
        a = r.content;
      s === 0 && a.length && (s = a.length);
      for (let h = 0; h < a.length; h += s || 1) {
        const c = a.slice(h, h + s || void 0);
        l.appendChild(o(c, 'td'));
      }
      e.appendChild(l);
    }
  }
  return e;
}
function In(i) {
  var e;
  const t = document.createElement('div');
  for (const n of i) {
    switch (n.type) {
      case 'heading': {
        const s = n.heading_level ?? 1,
          o = document.createElement('h' + s),
          r = j(n),
          l = S(n.children);
        if (!r.id) {
          const a = Nn(l);
          a !== '' && (r.id = a);
        }
        (O(o, r), (o.innerHTML = l), t.appendChild(o));
        break;
      }
      case 'hr': {
        const s = document.createElement('hr');
        (O(s, j(n)), t.appendChild(s));
        break;
      }
      case 'paragraph': {
        const s = document.createElement('p');
        (O(s, j(n)), n.children && n.children.length && (s.innerHTML = S(n.children)), t.appendChild(s));
        break;
      }
      case 'list': {
        const s = n.children;
        if (!s || s.length === 0) break;
        for (const o of s) {
          if (o.type !== 'u-list' && o.type !== 'o-list') continue;
          const r = zt(o);
          (O(r, j(n)), t.appendChild(r));
        }
        break;
      }
      case 'table': {
        const s = Un(n);
        t.appendChild(s);
        break;
      }
      case 'code': {
        const s = document.createElement('pre'),
          o = document.createElement('code');
        (O(s, j(n)),
          (o.textContent = n.children[0].content),
          (e = n.children) != null && e[0].lang && o.setAttribute('class', `language-${n.children[0].lang}`),
          s.appendChild(o),
          t.appendChild(s));
        break;
      }
      case 'quote': {
        const s = document.createElement('blockquote'),
          o = document.createElement('p');
        (O(s, j(n)),
          n.children && n.children.length && (o.innerHTML = S(n.children)),
          s.appendChild(o),
          t.appendChild(s));
        break;
      }
      case 'html': {
        const s = document.createElement('div');
        s.innerHTML = n.children[0].content;
        for (const o of Array.from(s.childNodes)) t.appendChild(o);
        break;
      }
      case 'comment': {
        t.appendChild(document.createComment(n.children[0].content));
        break;
      }
      default: {
        const s = document.createElement('p');
        (O(s, j(n)), n.children && n.children.length && (s.innerHTML = S(n.children)), t.appendChild(s));
      }
    }
    t.appendChild(
      document.createTextNode(
        (n.post_whitespace ?? '') +
          `

`,
      ),
    );
  }
  return t;
}
var be = ((i) => ((i[(i.Include = 0)] = 'Include'), (i[(i.Exclude = 1)] = 'Exclude'), (i[(i.Peek = 2)] = 'Peek'), i))(
  be || {},
);
const zn = { stringDelimiters: ['"', "'"] };
let Wt = class {
  constructor(e) {
    (R(this, '_string', ''),
      R(this, '_index', 0),
      R(this, '_curLine', 0),
      R(this, '_curColumn', 0),
      (this._string = e));
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
    const e = this._string.substring(this._index).match(/^\s*/);
    if (!e || e.index === void 0) return '';
    const t = e[0];
    return ((this._index += t.length), t);
  }
  buildRegex(e, t = !1) {
    if (e instanceof RegExp) return e;
    {
      let n = Array.isArray(e) ? '(' + e.map((s) => this.escapeRegExp(s)).join('|') + ')' : this.escapeRegExp(e);
      return (t && (n = '^' + n), new RegExp(n, 's'));
    }
  }
  peek(e) {
    if (Number.isInteger(e)) return this._string.substring(this._index, this._index + e);
    let t = this.buildRegex(e, !0);
    const n = this.rest.match(t);
    return !n || n.index === void 0 ? null : n[0];
  }
  escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  readUntil(e, t = 1) {
    let n = this._string.substring(this._index),
      s = '',
      o = this.buildRegex(e);
    const r = n.match(o);
    return !r || r.index === void 0
      ? ((this._index += n.length), { content: n, match: null })
      : ((s = n.slice(0, r.index)),
        (this._index += r.index),
        t === 0 ? ((s += r[0]), (this._index += r[0].length)) : t === 1 && (this._index += r[0].length),
        { content: s, match: r[0] });
  }
  triggerError(e, t, n, s = '') {
    throw (
      Array.isArray(e) || (e = [e]),
      new Error(`Error at position ${n}: Expected "${e.join(', ')}", found "${t}". ${s}`)
    );
  }
  readPrimitive(e = zn) {
    const t = e.stringDelimiters ?? [],
      n = e.escapeCharacter,
      s = this.peek(1);
    ((!s || !t.includes(s)) &&
      this.triggerError(t, s ?? '<end of input>', this._index, 'No valid string delimiter found'),
      this.read(1));
    let o = '';
    for (; this.hasMore();) {
      const r = this.read(1);
      if (n && r === n) {
        (this.hasMore() || this.triggerError(n, '<end of string>', this._index, 'Escape character at end of string'),
          (o += this.read(1)));
        continue;
      }
      if (r === s)
        return {
          value: o,
          delimiter: s,
          isMultiline: o.includes(`
`),
        };
      o += r;
    }
    this.triggerError(s, '<end of string>', this._index, 'End of string reached without closing delimiter');
  }
  read(e = 1) {
    let t = this._string.substring(this._index);
    t.length < e && (e = t.length);
    const n = t.slice(0, e);
    return ((this._index += e), n);
  }
};
class Vt {
  constructor(e, t = 1) {
    (R(this, '_line'), R(this, '_index', 0), R(this, 'lineNumber'), (this._line = e), (this.lineNumber = t));
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
    const s = this.readUntil(e);
    t.value_str = s;
    const o = Number(s);
    return (!Number.isNaN(o) && s.trim() !== '' && (t.value_number = o), t);
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
      const s = this.readChar(),
        o = this.peekChar();
      if (((n += s), (typeof e == 'string' && o === e) || (e instanceof RegExp && e.test(o ?? '')))) break;
    }
    return (t && !this.isEOF() && (n += this.readChar()), n);
  }
  escapeRegExp(e) {
    return e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  readUntilPeekRegex(e, t = !1) {
    let n,
      s = this._line.substring(this._index),
      o = '';
    if (e instanceof RegExp) n = new RegExp(e.source, e.flags.includes('s') ? e.flags : e.flags + 's');
    else {
      const l = Array.isArray(e) ? e.map((a) => this.escapeRegExp(a)).join('|') : this.escapeRegExp(e);
      n = new RegExp(l, 's');
    }
    const r = s.match(n);
    return !r || r.index === void 0
      ? ((this.index += s.length), { content: s, match: null })
      : ((o = s.slice(0, r.index)),
        (this._index += r.index),
        t && ((o += r[0]), (this._index += r[0].length)),
        { content: o, match: r[0] });
  }
  skipWhitespace() {
    for (; !this.isEOF() && /\s/.test(this._line[this._index]);) this._index++;
  }
  readUntilPeek(e, t = !0) {
    let n = '';
    for (; !this.isEOF();) {
      for (const o of e) if (this.peek(o.length) === o) return { value: n, peek: o };
      const s = this.readChar();
      if (
        s ===
          `
` &&
        !t
      )
        break;
      n += s;
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
      const s = this.readChar();
      if (s === '\\' && !t) {
        t = !0;
        continue;
      }
      ((n += s), (t = !1));
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
function Ft(i) {
  var e;
  const t = new Vt(i),
    n = { elements: [], errors: [], kramdown_length: 0 };
  if (!t.readExpression(['{:'])) throw new Error("parse_kramdown: expected string starting with '{:' - found " + i);
  for (; !t.isEOF();)
    switch ((t.skipWhitespace(), t.peek())) {
      case '}':
        return (t.readChar(), (n.kramdown_length = t.index), n);
      case '#':
      case '.': {
        const s = t.readChar(),
          o = t.readWord(/[a-z0-9_\-:]+/i);
        if (o) n.elements.push({ valueType: s === '#' ? 'id' : 'class', value: o });
        else return (n.errors.push('parse_kramdown: expected class/id - found ' + t.peek()), n);
        break;
      }
      default: {
        const s = t.readWord(/[a-z0-9_\-:]+/i);
        let o;
        s &&
          (t.peek() === '=' && (t.readChar(), (o = (e = t.readValue(/(\s|})/)) == null ? void 0 : e.value_str)),
          n.elements.push({ valueType: 'attribute', value: o, key: s }));
      }
    }
  return (n.errors.push("parse_kramdown: expected '}' - found EOF"), (n.kramdown_length = t.index), n);
}
function qt(i) {
  const e = i.readExpression(['[', '![']);
  if (e === null) return { type: 'text', content: Bt(i.readUntil(']')) };
  const t = { type: null };
  if (((t.type = e === '[' ? 'link' : 'image'), (t.content = []), i.peekChar() !== ']')) {
    const n = qt(i);
    t.content = [n];
  }
  if ((i.readChar(), i.peekChar() !== '(')) return { type: 'text', content: t.content };
  if ((i.readChar(), (t.href = i.readUntil(')')), i.readChar(), i.peek() === '{')) {
    const n = Ft(i.line.substring(i.index));
    ((t.kramdown = n.elements), (i.index += n.kramdown_length));
  }
  return t;
}
function Bt(i) {
  return i
    .replace(new RegExp('(?<!\\*)\\*\\*\\*([^\\n]+?)\\*\\*\\*', 'g'), '<strong><em>$1</em></strong>')
    .replace(new RegExp('(?<!\\*)\\*\\*([\\s\\S]+?)\\*\\*', 'g'), '<strong>$1</strong>')
    .replace(new RegExp('(?<!\\*)\\*([\\s\\S]+?)\\*', 'g'), '<em>$1</em>')
    .replace(/__([\s\S]+?)__/g, '<strong>$1</strong>')
    .replace(/_([\s\S]+?)_/g, '<em>$1</em>')
    .replace(/`([\s\S]+?)`/g, '<code>$1</code>')
    .replace(/~~([\s\S]+?)~~/g, '<del>$1</del>');
}
function de(i) {
  const e = [],
    t = new Vt(i);
  for (; t.more();) {
    const n = t.readUntilPeek(['[', '!['], !0);
    (n.value !== '' && e.push({ type: 'text', content: Bt(n.value) }), n.peek !== !1 && e.push(qt(t)));
  }
  return e;
}
function Wn(i) {
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
    s = 0;
  const o = (a) => (a.startsWith('|') && (a = a.slice(1)), a.endsWith('|') && (a = a.slice(0, -1)), a.trim());
  e.length >= 2 && t.test(o(e[1])) && ((n = vt(e[0])), (s = 2));
  const r = [];
  n && r.push({ type: 'table-head', content: n.map((a) => bt(a.trim())) });
  const l = [];
  for (let a = s; a < e.length; a++) vt(e[a]).forEach((h) => l.push(bt(h.trim())));
  return (r.push({ type: 'table-body', content: l }), r);
}
function vt(i) {
  return (
    i.startsWith('|') && (i = i.slice(1)),
    i.endsWith('|') && (i = i.slice(0, -1)),
    i.split('|').map((e) => e.trim())
  );
}
function bt(i) {
  return { type: 'table-cell', content: de(i) };
}
function Vn(i) {
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
      .filter((r) => r.trim() !== ''),
    t = [],
    n = [],
    s = /^(\s*)([-+*]|(\d+)\.)\s+(.*)$/;
  function o(r, l, a) {
    for (; n.length > 0;) {
      const c = n[n.length - 1];
      if (c.indent === r) {
        if (c.element.type === l && c.element.__marker === a) return c.element;
        n.pop();
        continue;
      }
      if (c.indent > r) {
        n.pop();
        continue;
      }
      break;
    }
    const h = { type: l, content: [] };
    if (((h.__marker = a), n.length === 0)) t.push(h);
    else {
      const c = n[n.length - 1].element.content;
      c.length === 0 && c.push({ type: 'list-item', content: [] });
      const p = c[c.length - 1];
      (Array.isArray(p.content) || (p.content = []), p.content.push(h));
    }
    return (n.push({ element: h, indent: r }), h);
  }
  for (const r of e) {
    const l = r.match(s);
    if (!l) {
      if (n.length > 0) {
        const Oe = n[n.length - 1].element.content;
        if (Oe.length > 0) {
          const Pe = Oe[Oe.length - 1];
          (Array.isArray(Pe.content) || (Pe.content = []), Pe.content.push({ type: 'text', content: r.trim() }));
        }
      }
      continue;
    }
    const a = l[1] || '',
      h = l[2],
      c = /\d+\./.test(h),
      p = c ? 'o-list' : 'u-list',
      _ = l[4],
      E = c ? 'o' : h,
      $ = a.replace(/\t/g, '    ').length,
      T = Math.floor($ / 2),
      q = o(T, p, E),
      gn = { type: 'list-item', content: de(_) };
    q.content.push(gn);
  }
  return t;
}
function Fn(i) {
  const e = new Wt(i);
  let t = [],
    n = !0;
  for (; e.hasMore();) {
    let s = e.readUntil(/\n\n(```|<!--|\S)/m, be.Peek);
    switch (
      (t.push(
        (n
          ? `

`
          : '') + s.content,
      ),
      (n = !1),
      s.match)
    ) {
      case '\n\n```':
        let o = e.read(5);
        ((o += e.readUntil('```', be.Include).content), t.push(o));
        break;
      case `

<!--`:
        t.push(e.readUntil('-->', be.Include).content);
        break;
      default:
        e.read(2);
        break;
    }
  }
  return t;
}
function qn(i) {
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
    t = Fn(i);
  let n = '';
  for (const s of t) {
    if (s === '') continue;
    if (s.trim() === '') {
      n += s;
      continue;
    }
    const o = new Wt(s),
      r = { type: null, pre_whitespace: n + o.readWhiteSpace(), content_raw: o.rest, post_whitespace: '' };
    n = '';
    let l = o.rest;
    const a = l.match(/^(.*)\n(\{:[^\n]*\})(\s*)$/s);
    if (a) {
      const [, c, p, _] = a;
      ((r.kramdown = Ft(p).elements), (r.post_whitespace = _), (l = c));
    }
    const h = l.split(`
`);
    switch (o.peek(['<!--', '```', '---', '#', '-', '*', '+', '|', '<', '>'])) {
      case '<!--':
        ((r.type = 'comment'), (l = l.substring(4, l.length - 3)), (r.children = [{ type: 'text', content: l }]));
        break;
      case '---':
        r.type = 'hr';
        break;
      case '```':
        r.type = 'code';
        let c = h[0].substring(3).trim();
        (h.shift(),
          h[h.length - 1].endsWith('```') && h.pop(),
          (r.children = [
            {
              type: 'text',
              content: h.join(`
`),
              lang: c,
            },
          ]));
        break;
      case '#':
        ((r.type = 'heading'),
          (r.heading_level = l.split(' ')[0].length),
          (r.children = de(l.substring(r.heading_level).trim())));
        break;
      case '-':
      case '+':
        ((r.type = 'list'), (r.children = Vn(r)));
        break;
      case '|':
        ((r.type = 'table'), (r.children = Wn(r)));
        break;
      case '<':
        ((r.type = 'html'), (r.children = [{ type: 'html', content: l }]));
        break;
      case '>':
        ((r.type = 'quote'),
          (l = l
            .split(
              `
`,
            )
            .map((p) => p.replace(/^>\s*/, '')).join(`
`)),
          (r.children = de(l)));
        break;
      default:
        ((r.type = 'paragraph'), (r.children = de(l)));
    }
    e.push(r);
  }
  return (n !== '' && e.push({ type: 'whitespace', pre_whitespace: n }), e);
}
let Bn = class {
  constructor() {
    R(this, '_ast', []);
  }
  set markdown(e) {
    this._ast = qn(e);
  }
  getHTML() {
    return In(this._ast);
  }
};
var Kt = (i) => {
    throw TypeError(i);
  },
  st = (i, e, t) => e.has(i) || Kt('Cannot ' + t),
  u = (i, e, t) => (st(i, e, 'read from private field'), t ? t.call(i) : e.get(i)),
  m = (i, e, t) =>
    e.has(i) ? Kt('Cannot add the same private member more than once') : e instanceof WeakSet ? e.add(i) : e.set(i, t),
  b = (i, e, t, n) => (st(i, e, 'write to private field'), e.set(i, t), t),
  d = (i, e, t) => (st(i, e, 'access private method'), t),
  Kn = (i, e, t, n) => ({
    set _(s) {
      b(i, e, s);
    },
    get _() {
      return u(i, e, n);
    },
  });
const Gn =
    ':host{--tj-demo-control-gap: 12px}.controls-builtins{display:flex;flex-wrap:wrap;gap:var(--tj-demo-control-gap)}.controls-builtins:empty{display:none}.controls-builtins>button,.controls-builtins>input,.controls-builtins>select,.controls-builtins>textarea,.controls-builtins>*[data-tj-demo-control]{min-height:40px;padding:10px 14px;border:1px solid #94a3b8;border-radius:10px;background:#fff;color:#111827;font:inherit}.controls-builtins>button,.controls-builtins>select{cursor:pointer}.controls-builtins>textarea{min-width:220px;min-height:96px;resize:vertical}',
  Jn =
    ':host{--tj-demo-controls-rail-height: 38px;--tj-demo-controls-panel-height: 0px;position:fixed;bottom:0;left:0;width:100vw;z-index:15;display:block;color:#111827;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.shell{display:grid;grid-template-rows:minmax(0,var(--tj-demo-controls-panel-height)) var(--tj-demo-controls-rail-height);align-items:end}.shell.is-closed{grid-template-rows:0 var(--tj-demo-controls-rail-height)}.panel-wrapper{overflow:hidden}.panel{overflow:auto;padding:16px 20px;border-top:1px solid #d1d5db;background:#fffffff5;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 -8px 24px #0f172a14}.shell[hidden],.panel[hidden],:host([hidden]){display:none}.panel-content{display:grid;gap:12px}.slot-wrap.hidden{display:none}.rail{display:grid;grid-template-columns:48px 1fr auto;align-items:center;min-height:var(--tj-demo-controls-rail-height);background:#000;color:#fff}.toggle{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;padding:0;border:0;border-radius:0;background:transparent;color:inherit;cursor:pointer}.toggle:hover{background:#111827}.toggle-icon{font-size:18px;line-height:1}.label{padding:0 12px;font-size:.9rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.actions{display:flex;align-items:center;gap:8px;min-height:48px;padding-right:8px}',
  _t = 'tj-demo-controls:open';
var P, _e, f, Gt, ye, ze, Jt, We, yt, Zt, Xt, Qt, Te, ce, Yt, he, en, te;
const Ve = class extends A {
  constructor() {
    (super(),
      m(this, f),
      m(this, P),
      m(this, _e),
      m(this, ye),
      m(this, te),
      (this.controlsOpen = !0),
      (this.hasCustomControls = !1),
      b(this, _e, () => {
        this.controlsOpen = !this.controlsOpen;
      }),
      b(this, ye, () => {
        (d(this, f, ze).call(this), this.requestUpdate());
      }),
      b(this, te, () => {
        (d(this, f, he).call(this), d(this, f, ce).call(this));
      }),
      (this.controlsOpen = d(this, f, Zt).call(this)));
  }
  connectedCallback() {
    (super.connectedCallback(),
      d(this, f, Qt).call(this),
      d(this, f, ce).call(this),
      d(this, f, he).call(this),
      window.addEventListener('resize', u(this, te)));
  }
  disconnectedCallback() {
    var e;
    (window.removeEventListener('resize', u(this, te)),
      (e = u(this, P)) == null || e.disconnect(),
      d(this, f, Yt).call(this),
      d(this, f, en).call(this),
      super.disconnectedCallback());
  }
  updated(e) {
    (super.updated(e),
      e.has('data') && d(this, f, We).call(this),
      e.has('controlsOpen') && (d(this, f, Xt).call(this), d(this, f, ce).call(this), d(this, f, he).call(this)));
  }
  render() {
    return x`
      <div class=${d(this, f, Gt).call(this)} ?hidden=${!d(this, f, Jt).call(this)}>
        <div class="panel-wrapper">
          <div class="panel" ?hidden=${!this.controlsOpen}>
            <div class="panel-content">
              <div id="builtin-controls" class="controls-builtins"></div>
              <div class=${this.hasCustomControls ? 'slot-wrap' : 'slot-wrap hidden'}>
                <slot name="controls" @slotchange=${u(this, ye)}></slot>
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
            @click=${u(this, _e)}
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
    (d(this, f, ze).call(this), d(this, f, We).call(this));
  }
};
((P = new WeakMap()),
  (_e = new WeakMap()),
  (f = new WeakSet()),
  (Gt = function () {
    return `shell ${this.controlsOpen ? 'is-open' : 'is-closed'}`;
  }),
  (ye = new WeakMap()),
  (ze = function () {
    const i = this.renderRoot.querySelector('slot[name="controls"]');
    if (!(i instanceof HTMLSlotElement)) {
      this.hasCustomControls = !1;
      return;
    }
    this.hasCustomControls = i.assignedNodes({ flatten: !0 }).some((e) => {
      var t;
      return e.nodeType !== Node.TEXT_NODE || ((t = e.textContent) == null ? void 0 : t.trim());
    });
  }),
  (Jt = function () {
    var i;
    return !!((i = this.data) != null && i.length) || this.hasCustomControls;
  }),
  (We = function () {
    const i = this.renderRoot.querySelector('#builtin-controls');
    if (i instanceof HTMLElement) {
      i.replaceChildren();
      for (const e of this.data ?? []) i.append(d(this, f, yt).call(this, e));
      d(this, f, Te).call(this);
    }
  }),
  (yt = function (i) {
    const e =
      i.element instanceof HTMLElement
        ? i.element
        : document.createElement(typeof i.element == 'string' ? i.element : 'button');
    if (
      (e.setAttribute('data-tj-demo-control', ''),
      (e.textContent = i.label ?? ''),
      i.info && !e.getAttribute('title') && (e.title = i.info),
      e instanceof HTMLSelectElement && Array.isArray(i.selectOptions))
    ) {
      e.replaceChildren();
      for (const t of i.selectOptions) {
        const n = document.createElement('option');
        (typeof t == 'string'
          ? ((n.value = t), (n.textContent = t))
          : ((n.value = t.value ?? t.label ?? ''),
            (n.textContent = t.label ?? t.value ?? ''),
            (n.disabled = !!t.disabled)),
          e.append(n));
      }
    }
    for (const [t, n] of Object.entries(i)) {
      if (!t.startsWith('on') || typeof n != 'function') continue;
      const s = t.slice(2);
      s && e.addEventListener(s, n);
    }
    if (i.events && typeof i.events == 'object')
      for (const [t, n] of Object.entries(i.events)) typeof n == 'function' && e.addEventListener(t, n);
    return (typeof i.init == 'function' && i.init(e), e);
  }),
  (Zt = function () {
    if (typeof sessionStorage > 'u') return !0;
    try {
      const i = sessionStorage.getItem(_t);
      return i === null ? !0 : i === 'true';
    } catch {
      return !0;
    }
  }),
  (Xt = function () {
    if (!(typeof sessionStorage > 'u'))
      try {
        sessionStorage.setItem(_t, String(this.controlsOpen));
      } catch {}
  }),
  (Qt = function () {
    var i;
    typeof ResizeObserver > 'u' ||
      ((i = u(this, P)) == null || i.disconnect(),
      b(
        this,
        P,
        new ResizeObserver(() => {
          (d(this, f, Te).call(this), d(this, f, ce).call(this), d(this, f, he).call(this));
        }),
      ),
      u(this, P).observe(this),
      typeof document < 'u' &&
        (u(this, P).observe(document.documentElement), document.body && u(this, P).observe(document.body)));
  }),
  (Te = function () {
    const i = this.renderRoot.querySelector('.panel'),
      e = (i == null ? void 0 : i.scrollHeight) ?? 0;
    this.style.setProperty('--tj-demo-controls-panel-height', `${e}px`);
  }),
  (ce = function () {
    typeof document > 'u' ||
      requestAnimationFrame(() => {
        document.documentElement.style.paddingBottom = `${this.getBoundingClientRect().height}px`;
      });
  }),
  (Yt = function () {
    typeof document > 'u' || (document.documentElement.style.paddingBottom = '');
  }),
  (he = function () {
    if (typeof document > 'u') return;
    const i = document.body;
    i &&
      requestAnimationFrame(() => {
        const e = i.getBoundingClientRect();
        ((this.style.left = `${e.left}px`), (this.style.width = `${e.width}px`));
      });
  }),
  (en = function () {
    ((this.style.left = ''), (this.style.width = ''));
  }),
  (te = new WeakMap()),
  (Ve.properties = { data: { attribute: !1 }, controlsOpen: { state: !0 }, hasCustomControls: { state: !0 } }),
  (Ve.styles = [V(Gn), V(Jn)]));
let Zn = Ve;
typeof customElements < 'u' && !customElements.get('tj-demo-controls') && customElements.define('tj-demo-controls', Zn);
const Fe = 'view';
function Ae(i) {
  const e = new URLSearchParams(i).get(Fe);
  return e === 'fullscreen' || e === 'source' ? e : 'default';
}
function qe(i, e) {
  const t = new URL(i);
  return (e === 'default' ? t.searchParams.delete(Fe) : t.searchParams.set(Fe, e), t.href);
}
const Be =
  'body{margin:0}.tj-demo-renderer-content{padding:15px;color:var(--tj-demo-codestyle-color-text, #0f172a);font:var(--tj-demo-codestyle-font, 15px/1.65 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);text-wrap:pretty}.tj-demo-renderer-content>:first-child{margin-top:0}.tj-demo-renderer-content>:last-child{margin-bottom:0}.tj-demo-renderer-content :where(h1,h2,h3,h4,h5,h6){margin:1.6em 0 .6em;color:var(--tj-demo-codestyle-color-heading, #020617);font-weight:700;line-height:1.2;text-wrap:balance}.tj-demo-renderer-content h1{font-size:clamp(2rem,4vw,2.75rem);letter-spacing:-.03em}.tj-demo-renderer-content h2{font-size:clamp(1.5rem,3vw,2rem);letter-spacing:-.02em}.tj-demo-renderer-content h3{font-size:1.25rem}.tj-demo-renderer-content h4,.tj-demo-renderer-content h5,.tj-demo-renderer-content h6{font-size:1rem}.tj-demo-renderer-content :where(p,ul,ol,blockquote,pre,table,hr){margin:0 0 1.1em}.tj-demo-renderer-content :where(ul,ol){padding-left:1.4em}.tj-demo-renderer-content li+li{margin-top:.3em}.tj-demo-renderer-content a{color:var(--tj-demo-codestyle-color-link, #2563eb);text-decoration-thickness:.08em;text-underline-offset:.18em}.tj-demo-renderer-content a:hover{color:var(--tj-demo-codestyle-color-link-hover, #1d4ed8)}.tj-demo-renderer-content strong{font-weight:700;color:var(--tj-demo-codestyle-color-strong, #020617)}.tj-demo-renderer-content em{color:var(--tj-demo-codestyle-color-emphasis, #334155)}.tj-demo-renderer-content hr{border:0;border-top:1px solid var(--tj-demo-codestyle-color-border, #cbd5e1)}.tj-demo-renderer-content blockquote{padding:.85rem 1rem;border-left:4px solid var(--tj-demo-codestyle-color-quote-border, #94a3b8);border-radius:0 12px 12px 0;background:var(--tj-demo-codestyle-color-quote-bg, #f8fafc);color:var(--tj-demo-codestyle-color-quote-text, #334155)}.tj-demo-renderer-content :where(code,pre){font-family:var(--tj-demo-codestyle-font-mono, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Monaco, monospace)}.tj-demo-renderer-content code{padding:.15em .45em;border:1px solid var(--tj-demo-codestyle-color-inline-code-border, #dbe4f0);border-radius:.45rem;background:var(--tj-demo-codestyle-color-inline-code-bg, #eff6ff);color:var(--tj-demo-codestyle-color-inline-code-text, #1e3a8a);font-size:.92em}.tj-demo-renderer-content pre{overflow-x:auto;padding:1rem 1.1rem;border:1px solid var(--tj-demo-codestyle-color-pre-border, #1e293b);border-radius:14px;background:var(--tj-demo-codestyle-color-pre-bg, #0f172a);color:var(--tj-demo-codestyle-color-pre-text, #e2e8f0);box-shadow:inset 0 1px #ffffff08}.tj-demo-renderer-content pre code{padding:0;border:0;border-radius:0;background:transparent;color:inherit;font-size:.95em}.tj-demo-renderer-content table{width:100%;border-collapse:collapse;overflow:hidden;border:1px solid var(--tj-demo-codestyle-color-border, #cbd5e1);border-radius:12px;background:var(--tj-demo-codestyle-color-table-bg, #fff)}.tj-demo-renderer-content th,.tj-demo-renderer-content td{padding:.75rem .9rem;border-bottom:1px solid var(--tj-demo-codestyle-color-border, #cbd5e1);text-align:left;vertical-align:top}.tj-demo-renderer-content th{background:var(--tj-demo-codestyle-color-table-head-bg, #f8fafc);color:var(--tj-demo-codestyle-color-heading, #020617);font-weight:600}.tj-demo-renderer-content tbody tr:last-child td{border-bottom:0}.tj-demo-renderer-content img,.tj-demo-renderer-content video,.tj-demo-renderer-content canvas,.tj-demo-renderer-content svg{display:block;max-width:100%;height:auto}tj-demo-renderer[view-mode=fullscreen] .tj-demo-renderer-content,tj-demo-renderer[view-mode=source] .tj-demo-renderer-content{box-sizing:border-box;min-height:100dvh}.tj-demo-renderer-source{padding:24px;background:#f8fafc;color:#111827}.tj-demo-renderer-source pre{min-width:max-content;margin:0;font:13px/1.6 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,monospace;-moz-tab-size:2;tab-size:2}';
var J, ge, B, w, tn, nn, sn, Ke, wt, rn, ue, we, ne, ie, se, Ce, on, an;
const N = class re extends A {
  constructor() {
    (super(...arguments),
      m(this, w),
      m(this, ne),
      m(this, ie),
      m(this, se),
      (this.errorMessage = ''),
      (this.viewMode = 'default'),
      b(this, ne, (e) => {
        const t = e.error ? d(this, w, we).call(this, e.error) : e.message;
        t && d(this, w, ue).call(this, t);
      }),
      b(this, ie, (e) => {
        d(this, w, ue).call(this, d(this, w, we).call(this, e.reason));
      }),
      b(this, se, (e) => {
        e.key !== 'Escape' ||
          this.viewMode === 'default' ||
          window.location.assign(qe(window.location.href, 'default'));
      }));
  }
  connectedCallback() {
    var e;
    (super.connectedCallback(),
      (this.viewMode = Ae(window.location.search)),
      u(re, J).add(this),
      d((e = re), Ce, on).call(e),
      window.addEventListener('error', u(this, ne)),
      window.addEventListener('unhandledrejection', u(this, ie)),
      window.addEventListener('keydown', u(this, se)));
  }
  disconnectedCallback() {
    var e;
    (window.removeEventListener('error', u(this, ne)),
      window.removeEventListener('unhandledrejection', u(this, ie)),
      window.removeEventListener('keydown', u(this, se)),
      u(re, J).delete(this),
      d((e = re), Ce, an).call(e),
      super.disconnectedCallback());
  }
  render() {
    return x`
      <slot></slot>
      ${this.errorMessage ? x`<div class="error-indicator">${this.errorMessage}</div>` : null}
    `;
  }
  async showDemo(e) {
    ((this.viewMode = Ae(window.location.search)),
      (this.errorMessage = ''),
      this.requestUpdate(),
      this.replaceChildren());
    const t = this.viewMode === 'source' ? [Be] : d(this, w, rn).call(this, e.css);
    for (const s of t) this.append(d(this, w, nn).call(this, s));
    const n = document.createElement('div');
    ((n.className = 'tj-demo-renderer-content'), this.append(n));
    try {
      if (this.viewMode === 'source') {
        d(this, w, tn).call(this, n, e.source);
        return;
      }
      if (typeof e.render == 'function') {
        await e.render(n);
        return;
      }
      if (e.wrapper_html && typeof e.wrapper_html == 'string') {
        const s = document.createElement('div');
        ((s.innerHTML = e.wrapper_html.replace('{{content}}', d(this, w, sn).call(this, e))),
          n.append(...Array.from(s.childNodes)));
        return;
      }
      if (e.markdown) {
        const s = d(this, w, Ke).call(this, e.markdown);
        n.append(...Array.from(s.childNodes));
        return;
      }
      if (e.html) {
        const s = document.createElement('div');
        ((s.innerHTML = e.html), n.append(...Array.from(s.childNodes)));
        return;
      }
      n.textContent = 'Demo exportiert keine render(root)-Funktion';
    } catch (s) {
      const o = d(this, w, we).call(this, s);
      (d(this, w, ue).call(this, o), (n.textContent = o));
    }
  }
};
((J = new WeakMap()),
  (ge = new WeakMap()),
  (B = new WeakMap()),
  (w = new WeakSet()),
  (tn = function (i, e) {
    i.classList.add('tj-demo-renderer-source');
    const t = document.createElement('pre'),
      n = document.createElement('code');
    ((n.textContent = e ?? 'Quellcode nicht verfügbar'), t.append(n), i.append(t));
  }),
  (nn = function (i) {
    if (d(this, w, wt).call(this, i)) {
      const t = document.createElement('link');
      return ((t.rel = 'stylesheet'), (t.href = i), t);
    }
    const e = document.createElement('style');
    return ((e.textContent = i), e);
  }),
  (sn = function (i) {
    return typeof i.markdown == 'string' && i.markdown.length > 0
      ? d(this, w, Ke).call(this, i.markdown).innerHTML
      : (i.html ?? '');
  }),
  (Ke = function (i) {
    const e = new Bn();
    return ((e.markdown = i), e.getHTML());
  }),
  (wt = function (i) {
    const e = i.trim();
    return !e ||
      /[{};]/.test(e) ||
      e.includes(`
`)
      ? !1
      : /^(https?:\/\/|\/|\.\/|\.\.\/)/.test(e) || /\.(css|scss|sass|less|styl|stylus)(\?|#|$)/.test(e);
  }),
  (rn = function (i) {
    return i === void 0
      ? [Be]
      : i === null
        ? []
        : (Array.isArray(i) ? i : [i])
            .filter((e) => typeof e == 'string')
            .map((e) => e.trim())
            .filter((e) => e.length > 0)
            .map((e) => (e === 'default' ? Be : e));
  }),
  (ue = function (i) {
    ((this.errorMessage = i), this.requestUpdate());
  }),
  (we = function (i) {
    return i instanceof Error ? i.message || i.name : String(i);
  }),
  (ne = new WeakMap()),
  (ie = new WeakMap()),
  (se = new WeakMap()),
  (Ce = new WeakSet()),
  (on = function () {
    u(this, B) ||
      ((console.error = (...i) => {
        var e;
        u(this, ge).call(this, ...i);
        const t = i
          .map((n) => {
            if (n instanceof Error) return n.message || n.name;
            if (typeof n == 'string') return n;
            try {
              return JSON.stringify(n);
            } catch {
              return String(n);
            }
          })
          .filter(Boolean)
          .join(' ');
        if (t) for (const n of u(this, J)) d((e = n), w, ue).call(e, t);
      }),
      b(this, B, !0));
  }),
  (an = function () {
    u(this, J).size > 0 || !u(this, B) || ((console.error = u(this, ge)), b(this, B, !1));
  }),
  m(N, Ce),
  (N.properties = { viewMode: { attribute: 'view-mode', reflect: !0 } }),
  (N.styles = vn`
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
  m(N, J, new Set()),
  m(N, ge, console.error),
  m(N, B, !1));
let Xn = N;
typeof customElements < 'u' && !customElements.get('tj-demo-renderer') && customElements.define('tj-demo-renderer', Xn);
const Qn =
  ':host{display:block}ul{list-style:none;margin:0;padding:0}.tree,.branch-children{display:grid;gap:4px}.branch-children{margin-left:12px;padding-left:12px;border-left:1px solid #e5e7eb}.toggle,.link{display:flex;align-items:center;gap:8px;width:100%;min-height:36px;padding:8px 10px;border:0;border-radius:8px;background:transparent;color:inherit;font:inherit;text-align:left;text-decoration:none;cursor:pointer}.toggle:hover,.link:hover{background:#f3f4f6}.chevron{width:1em;color:#6b7280;text-align:center;flex:0 0 auto}.label{min-width:0;word-break:break-word}.link{padding-left:28px}.link.active{background:#e0ecff;color:#0f3d91;font-weight:600}';
var pe, Ge, xt;
const Je = class extends A {
  constructor() {
    (super(...arguments),
      m(this, pe),
      (this.activeHref = ''),
      (this.expandedKeys = []),
      (this.forcedExpandedKeys = []));
  }
  render() {
    const e = this.nodes ?? [],
      t = new Set(this.expandedKeys),
      n = new Set(this.forcedExpandedKeys);
    return x`
      <ul class="tree">
        ${e.map((s, o) => d(this, pe, Ge).call(this, s, `${o}:${s.name}`, t, n))}
      </ul>
    `;
  }
};
((pe = new WeakSet()),
  (Ge = function (i, e, t, n) {
    if ('children' in i) {
      const o = t.has(e) || n.has(e),
        r = i.children ?? [];
      return x`
        <li>
          <button
            class="toggle"
            type="button"
            aria-expanded=${String(o)}
            @click=${() => d(this, pe, xt).call(this, e)}
          >
            <span class="chevron">${o ? '▾' : '▸'}</span>
            <span class="label">${i.name}</span>
          </button>

          ${
            o
              ? x`
                <ul class="branch-children">
                  ${r.map((l, a) => d(this, pe, Ge).call(this, l, `${e}/${a}:${l.name}`, t, n))}
                </ul>
              `
              : g
          }
        </li>
      `;
    }
    const s = this.activeHref === i.href;
    return x`
      <li>
        <a class=${s ? 'link active' : 'link'} href=${i.href}>${i.name}</a>
      </li>
    `;
  }),
  (xt = function (i) {
    this.dispatchEvent(new CustomEvent('toggle-node', { detail: { key: i }, bubbles: !0, composed: !0 }));
  }),
  (Je.properties = {
    nodes: { attribute: !1 },
    activeHref: { attribute: !1 },
    expandedKeys: { attribute: !1 },
    forcedExpandedKeys: { attribute: !1 },
  }),
  (Je.styles = [V(Qn)]));
let Yn = Je;
typeof customElements < 'u' &&
  !customElements.get('tj-demo-viewer-nav-tree') &&
  customElements.define('tj-demo-viewer-nav-tree', Yn);
const ei =
    ':host{--tj-demo-viewer-nav-rail-width: 34px;--tj-demo-viewer-nav-panel-width: 304px;position:fixed;top:0;left:0;z-index:20;display:block;height:100vh;box-sizing:border-box;overscroll-behavior:contain;color:#1f2937;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.shell{display:grid;grid-template-columns:var(--tj-demo-viewer-nav-rail-width) auto;height:100%}.rail{display:grid;grid-template-rows:auto 1fr;justify-items:center;gap:16px;width:var(--tj-demo-viewer-nav-rail-width);height:100%;padding:0;background:#000;color:#fff}.nav-toggle{display:inline-flex;align-items:center;justify-content:center;width:var(--tj-demo-viewer-nav-rail-width);height:var(--tj-demo-viewer-nav-rail-width);padding:0;border:0;border-radius:0;background:transparent;color:inherit;cursor:pointer}.nav-toggle:hover{background:#111827}.nav-toggle-icon{font-size:18px;line-height:1}.rail-content{display:grid;justify-items:center;align-content:start;width:100%;padding:0 8px 12px}.nav-toggle-label{writing-mode:vertical-rl;transform:rotate(180deg);font-size:.9rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.sidebar-wrapper{width:var(--tj-demo-viewer-nav-panel-width);overflow:hidden;border-right:1px solid #e5e7eb;background:#fff;box-shadow:0 0 24px #0f172a14;transition:width .18s ease}.shell.is-closed .sidebar-wrapper{width:0}.panel{width:var(--tj-demo-viewer-nav-panel-width);min-width:0;height:100%;overflow:auto;overscroll-behavior:contain;padding:20px;background:#fff}.panel[hidden]{display:none}nav{display:grid;gap:16px}header{display:grid;gap:6px}h2{margin:0;font-size:1.1rem}p{margin:0;color:#6b7280;font-size:.92rem}',
  $t = 'tj-demo-viewer-nav:expanded',
  Et = 'tj-demo-viewer-nav:open';
var C, Z, y, ln, xe, $e, dn, He, cn, kt, hn, un, Se, pn, mn, Ee, oe;
const Ze = class extends A {
  constructor() {
    (super(),
      m(this, y),
      m(this, C),
      m(this, Z),
      m(this, xe),
      m(this, $e),
      m(this, oe),
      (this.activeHref = ''),
      (this.navOpen = !0),
      b(this, C, new Set()),
      b(this, xe, () => {
        this.navOpen = !this.navOpen;
      }),
      b(this, $e, (e) => {
        d(this, y, ln).call(this, e.detail.key);
      }),
      b(this, oe, () => {
        this.activeHref = d(this, y, Ee).call(this);
      }),
      b(this, C, d(this, y, cn).call(this)),
      (this.activeHref = d(this, y, Ee).call(this)),
      (this.navOpen = d(this, y, hn).call(this)));
  }
  connectedCallback() {
    (super.connectedCallback(),
      (this.activeHref = d(this, y, Ee).call(this)),
      d(this, y, mn).call(this),
      d(this, y, Se).call(this),
      window.addEventListener('hashchange', u(this, oe)));
  }
  disconnectedCallback() {
    var e;
    ((e = u(this, Z)) == null || e.disconnect(),
      d(this, y, pn).call(this),
      window.removeEventListener('hashchange', u(this, oe)),
      super.disconnectedCallback());
  }
  updated(e) {
    (super.updated(e), e.has('navOpen') && (d(this, y, un).call(this), d(this, y, Se).call(this)));
  }
  render() {
    if (!this.data) return x`No Data`;
    const e = d(this, y, dn).call(this, this.data.tree, this.activeHref);
    return x`
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
                ${this.data.description ? x`<p>${this.data.description}</p>` : g}
              </header>

              <tj-demo-viewer-nav-tree
                .nodes=${this.data.tree}
                .activeHref=${this.activeHref}
                .expandedKeys=${[...u(this, C)]}
                .forcedExpandedKeys=${e}
                @toggle-node=${u(this, $e)}
              ></tj-demo-viewer-nav-tree>
            </nav>
          </div>
        </div>
      </div>
    `;
  }
};
((C = new WeakMap()),
  (Z = new WeakMap()),
  (y = new WeakSet()),
  (ln = function (i) {
    (u(this, C).has(i) ? u(this, C).delete(i) : u(this, C).add(i), d(this, y, kt).call(this), this.requestUpdate());
  }),
  (xe = new WeakMap()),
  ($e = new WeakMap()),
  (dn = function (i, e, t = '') {
    return d(this, y, He).call(this, i, e, t) ?? [];
  }),
  (He = function (i, e, t = '') {
    for (const [n, s] of i.entries()) {
      const o = t ? `${t}/${n}:${s.name}` : `${n}:${s.name}`;
      if ('children' in s) {
        const r = d(this, y, He).call(this, s.children ?? [], e, o);
        if (r) return [o, ...r];
      } else if (s.href === e) return [];
    }
    return null;
  }),
  (cn = function () {
    if (typeof sessionStorage > 'u') return new Set();
    try {
      const i = sessionStorage.getItem($t);
      if (!i) return new Set();
      const e = JSON.parse(i);
      return Array.isArray(e) ? new Set(e.filter((t) => typeof t == 'string')) : new Set();
    } catch {
      return new Set();
    }
  }),
  (kt = function () {
    if (!(typeof sessionStorage > 'u'))
      try {
        sessionStorage.setItem($t, JSON.stringify([...u(this, C)]));
      } catch {}
  }),
  (hn = function () {
    if (typeof sessionStorage > 'u') return !0;
    try {
      const i = sessionStorage.getItem(Et);
      return i === null ? !0 : i === 'true';
    } catch {
      return !0;
    }
  }),
  (un = function () {
    if (!(typeof sessionStorage > 'u'))
      try {
        sessionStorage.setItem(Et, String(this.navOpen));
      } catch {}
  }),
  (Se = function () {
    typeof document > 'u' ||
      requestAnimationFrame(() => {
        document.documentElement.style.paddingLeft = `${this.getBoundingClientRect().width}px`;
      });
  }),
  (pn = function () {
    typeof document > 'u' || (document.documentElement.style.paddingLeft = '');
  }),
  (mn = function () {
    var i;
    typeof ResizeObserver > 'u' ||
      ((i = u(this, Z)) == null || i.disconnect(),
      b(
        this,
        Z,
        new ResizeObserver(() => {
          d(this, y, Se).call(this);
        }),
      ),
      u(this, Z).observe(this));
  }),
  (Ee = function () {
    return typeof window > 'u' ? '' : window.location.hash;
  }),
  (oe = new WeakMap()),
  (Ze.properties = { data: { attribute: !1 }, activeHref: { state: !0 }, navOpen: { state: !0 } }),
  (Ze.styles = [V(ei)]));
let ti = Ze;
typeof customElements < 'u' &&
  !customElements.get('tj-demo-viewer-nav') &&
  customElements.define('tj-demo-viewer-nav', ti);
const Ne = '#/demo/';
class At {
  constructor(e) {
    this.demos = Array.isArray(e) ? [...e].sort((t, n) => this.compareDemos(t, n)) : [];
  }
  getNavData() {
    const e = [];
    for (const t of this.demos) {
      if (!t.filename) continue;
      const n = [...this.getDemoNavPath(t), t.filename];
      let s = e;
      for (const [o, r] of n.entries()) {
        if (o === n.length - 1) {
          s.push({ name: this.getDemoLabel(t), href: this.getDemoHref(t.filename) });
          continue;
        }
        let l = s.find((a) => 'children' in a && a.name === r);
        (l || ((l = { name: r, children: [] }), s.push(l)), (s = l.children));
      }
    }
    return { title: 'TDemos', description: 'Gefundene Demo-Dateien', tree: e };
  }
  getDemoByHash(e) {
    if (e.startsWith(Ne))
      try {
        return this.getDemoByFilename(decodeURIComponent(e.slice(Ne.length)));
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
    return Ne + encodeURIComponent(t);
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
      ? (Array.isArray(e.navPath) ? e.navPath : e.navPath.split('/')).map((t) => t.trim()).filter(Boolean)
      : e.group
        ? [e.group]
        : (e.filename ?? '').split('/').slice(0, -1);
  }
  compareDemos(e, t) {
    const n = Number.isFinite(e.order) ? e.order : Number.MAX_SAFE_INTEGER,
      s = Number.isFinite(t.order) ? t.order : Number.MAX_SAFE_INTEGER;
    if (n !== s) return n - s;
    const o = [...this.getDemoNavPath(e), this.getDemoLabel(e)],
      r = [...this.getDemoNavPath(t), this.getDemoLabel(t)];
    for (let l = 0; l < Math.max(o.length, r.length); l += 1) {
      if (o[l] === void 0) return -1;
      if (r[l] === void 0) return 1;
      const a = o[l].localeCompare(r[l], void 0, { numeric: !0, sensitivity: 'base' });
      if (a !== 0) return a;
    }
    return (e.filename ?? '').localeCompare(t.filename ?? '', void 0, { numeric: !0 });
  }
}
const ni =
    ':host{display:block;color:#111827;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.demo{min-height:100%;background:#f8fafc}.header{display:grid;grid-template-columns:minmax(0,1fr) auto;align-content:end;align-items:end;gap:16px;min-height:200px;padding:48px 24px 20px;background:#000;color:#fff}.header-copy{display:grid;gap:8px}.title{margin:0;font-size:1.5rem;line-height:1.2}.description{margin:0;color:#fffc}.header-extra{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:12px}.header-extra:empty{display:none}.header-actions{display:flex;flex-wrap:wrap;gap:8px}.header-action{display:inline-flex;align-items:center;gap:7px;min-height:36px;padding:7px 11px;border:1px solid rgba(255,255,255,.35);border-radius:7px;color:#fff;font-weight:600;text-decoration:none;transition:border-color .12s ease,background-color .12s ease}.header-action:hover,.header-action:focus-visible{border-color:#ffffffbf;background:#ffffff1f}.header-action:focus-visible{outline:2px solid #fff;outline-offset:2px}.header-action svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.content{min-width:0;padding:24px}@media(max-width:640px){.header{grid-template-columns:1fr}.header-extra{justify-content:flex-start}}',
  Xe = class extends A {
    constructor() {
      (super(), (this.fullscreenHref = ''), (this.sourceHref = ''));
    }
    render() {
      var e, t, n, s;
      const o = ((e = this.data) == null ? void 0 : e.title) ?? '',
        r = ((t = this.data) == null ? void 0 : t.description) ?? '';
      return x`
      <section class="demo">
        <header class="header">
          <div class="header-copy">
            ${o ? x`<h2 class="title">${o}</h2>` : g}
            ${r ? x`<p class="description">${r}</p>` : g}
          </div>

          <div class="header-extra">
            ${
              (n = this.data) != null && n.filename
                ? x`
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
                : g
            }
            <slot name="header"></slot>
          </div>
        </header>

        <tj-demo-controls .data=${((s = this.data) == null ? void 0 : s.controls) ?? []}>
          <slot name="controls" slot="controls"></slot>
        </tj-demo-controls>
      </section>
    `;
    }
  };
((Xe.properties = { data: { attribute: !1 }, fullscreenHref: { attribute: !1 }, sourceHref: { attribute: !1 } }),
  (Xe.styles = [V(ni)]));
let ii = Xe;
typeof customElements < 'u' && !customElements.get('tj-demo') && customElements.define('tj-demo', ii);
const si =
  ':host{display:block;color:#111827;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.viewer{min-height:100%}.content{min-width:0;min-height:100%}';
var G, M, X, U, z, Qe, fn, Ct, St;
const Ye = class extends A {
  constructor() {
    (super(...arguments),
      m(this, z),
      m(this, G),
      m(this, M),
      m(this, X),
      m(this, U),
      (this.viewMode = 'default'),
      b(this, G, []),
      b(this, M, new At([])),
      b(this, X, 0),
      b(this, U, () => {
        ((this.viewMode = Ae(window.location.search)), (this.selectedDemo = d(this, z, Qe).call(this)));
      }));
  }
  set demos(e) {
    if (
      (b(this, G, Array.isArray(e) ? e : []),
      b(this, M, new At(u(this, G))),
      (this.navData = u(this, M).getNavData()),
      (this.selectedDemo = d(this, z, Qe).call(this)),
      !this.selectedDemo && typeof window < 'u' && !window.location.hash)
    ) {
      const t = u(this, M).getFirstDemo();
      t &&
        (window.history.replaceState(null, '', u(this, M).getDemoHref(t)),
        (this.selectedDemo = t),
        window.dispatchEvent(new Event('hashchange')));
    }
    this.requestUpdate();
  }
  get demos() {
    return u(this, G);
  }
  connectedCallback() {
    (super.connectedCallback(),
      (this.viewMode = Ae(window.location.search)),
      window.dispatchEvent(new CustomEvent('tj:viewerReady', { detail: { viewer: this } })),
      window.addEventListener('hashchange', u(this, U)),
      window.addEventListener('popstate', u(this, U)));
  }
  disconnectedCallback() {
    (window.removeEventListener('hashchange', u(this, U)),
      window.removeEventListener('popstate', u(this, U)),
      super.disconnectedCallback());
  }
  updated(e) {
    (super.updated(e), (e.has('selectedDemo') || e.has('navData') || e.has('viewMode')) && d(this, z, fn).call(this));
  }
  render() {
    if (this.viewMode !== 'default') return x``;
    const e = typeof window > 'u' ? '' : window.location.href,
      t = e ? qe(e, 'fullscreen') : '',
      n = e ? qe(e, 'source') : '';
    return x`
      <div class="viewer">
        <tj-demo-viewer-nav .data=${this.navData}></tj-demo-viewer-nav>
        <slot name="controls" slot="controls"></slot>
        <main class="content">
          <tj-demo
            id="demo"
            .data=${this.selectedDemo}
            .fullscreenHref=${t}
            .sourceHref=${n}
          ></tj-demo>
        </main>
      </div>
    `;
  }
};
((G = new WeakMap()),
  (M = new WeakMap()),
  (X = new WeakMap()),
  (U = new WeakMap()),
  (z = new WeakSet()),
  (Qe = function () {
    const i = typeof window > 'u' ? '' : window.location.hash;
    return u(this, M).getDemoByHash(i);
  }),
  (fn = async function () {
    const i = document.querySelector('tj-demo-renderer');
    if (!i) return;
    const e = ++Kn(this, X)._;
    if ((d(this, z, St).call(this), !this.selectedDemo)) {
      await i.showDemo({
        title: 'Demo auswählen',
        render(t) {
          t.textContent = 'Demo auswählen';
        },
      });
      return;
    }
    if (typeof this.selectedDemo.load == 'function') {
      await i.showDemo({
        title: this.selectedDemo.title ?? 'Demo laden',
        render(n) {
          n.textContent = 'Demo wird geladen …';
        },
      });
      const t = await this.selectedDemo.load();
      if (e !== u(this, X)) return;
      this.selectedDemo = t;
      return;
    }
    (await i.showDemo(this.selectedDemo), e === u(this, X) && d(this, z, Ct).call(this, this.selectedDemo));
  }),
  (Ct = function (i) {
    if (!i.controls_raw_html) return;
    const e = document.createElement('div');
    ((e.slot = 'controls'), (e.dataset.generatedControls = ''), (e.innerHTML = i.controls_raw_html), this.append(e));
  }),
  (St = function () {
    for (const i of Array.from(this.querySelectorAll('[data-generated-controls]'))) i.remove();
  }),
  (Ye.properties = { navData: { state: !0 }, selectedDemo: { state: !0 }, viewMode: { state: !0 } }),
  (Ye.styles = [V(si)]));
let ri = Ye;
typeof customElements < 'u' && !customElements.get('tj-demo-viewer') && customElements.define('tj-demo-viewer', ri);
function Ei(i) {
  return i;
}
const oi = 'modulepreload',
  ai = function (i, e) {
    return new URL(i, e).href;
  },
  jt = {},
  v = function (e, t, n) {
    let s = Promise.resolve();
    if (t && t.length > 0) {
      let r = function (c) {
        return Promise.all(
          c.map((p) =>
            Promise.resolve(p).then(
              (_) => ({ status: 'fulfilled', value: _ }),
              (_) => ({ status: 'rejected', reason: _ }),
            ),
          ),
        );
      };
      const l = document.getElementsByTagName('link'),
        a = document.querySelector('meta[property=csp-nonce]'),
        h = (a == null ? void 0 : a.nonce) || (a == null ? void 0 : a.getAttribute('nonce'));
      s = r(
        t.map((c) => {
          if (((c = ai(c, n)), c in jt)) return;
          jt[c] = !0;
          const p = c.endsWith('.css'),
            _ = p ? '[rel="stylesheet"]' : '';
          if (!!n)
            for (let T = l.length - 1; T >= 0; T--) {
              const q = l[T];
              if (q.href === c && (!p || q.rel === 'stylesheet')) return;
            }
          else if (document.querySelector(`link[href="${c}"]${_}`)) return;
          const $ = document.createElement('link');
          if (
            (($.rel = p ? 'stylesheet' : oi),
            p || ($.as = 'script'),
            ($.crossOrigin = ''),
            ($.href = c),
            h && $.setAttribute('nonce', h),
            document.head.appendChild($),
            p)
          )
            return new Promise((T, q) => {
              ($.addEventListener('load', T),
                $.addEventListener('error', () => q(new Error(`Unable to preload CSS for ${c}`))));
            });
        }),
      );
    }
    function o(r) {
      const l = new Event('vite:preloadError', { cancelable: !0 });
      if (((l.payload = r), window.dispatchEvent(l), !l.defaultPrevented)) throw r;
    }
    return s.then((r) => {
      for (const l of r || []) l.status === 'rejected' && o(l.reason);
      return e().catch(o);
    });
  };
function k(i, e, t) {
  const n = e.default ?? e,
    s = typeof n == 'object' && n !== null ? n : {},
    o = typeof s.render == 'function' ? s.render : typeof e.render == 'function' ? e.render : void 0;
  return {
    ...s,
    filename: s.filename ?? i,
    ...(o ? { render: o } : {}),
    ...(typeof t == 'string' ? { source: t } : {}),
  };
}
const li = [
  {
    title: 'Überblick',
    filename: 'nextrap-elements/nte-input/demo/01-overview.demo.ts',
    load: () =>
      Promise.all([
        v(() => import('./01-overview.demo-U0uWi2lO.js'), [], import.meta.url),
        v(() => import('./01-overview.demo-NzgfW1h8.js'), [], import.meta.url),
      ]).then(([i, e]) => k('nextrap-elements/nte-input/demo/01-overview.demo.ts', i, e.default)),
  },
  {
    title: 'Styles & Typen',
    filename: 'nextrap-elements/nte-input/demo/02-hover-style.demo.ts',
    load: () =>
      Promise.all([
        v(() => import('./02-hover-style.demo-B1QIo3nP.js'), __vite__mapDeps([0, 1, 2, 3, 4]), import.meta.url),
        v(() => import('./02-hover-style.demo-B_ODjEp9.js'), [], import.meta.url),
      ]).then(([i, e]) => k('nextrap-elements/nte-input/demo/02-hover-style.demo.ts', i, e.default)),
  },
  {
    title: 'FormData Submit',
    filename: 'nextrap-elements/nte-input/demo/03-form-action.demo.ts',
    load: () =>
      Promise.all([
        v(() => import('./03-form-action.demo-DRRId1H5.js'), __vite__mapDeps([5, 1, 2, 3, 4]), import.meta.url),
        v(() => import('./03-form-action.demo-DWO2to0I.js'), [], import.meta.url),
      ]).then(([i, e]) => k('nextrap-elements/nte-input/demo/03-form-action.demo.ts', i, e.default)),
  },
  {
    title: 'FormDataAccessor',
    filename: 'nextrap-elements/nte-input/demo/04-form-data.demo.ts',
    load: () =>
      Promise.all([
        v(() => import('./04-form-data.demo-B_hbCK-D.js'), __vite__mapDeps([6, 1, 2, 3, 4]), import.meta.url),
        v(() => import('./04-form-data.demo-Cjogt-vA.js'), [], import.meta.url),
      ]).then(([i, e]) => k('nextrap-elements/nte-input/demo/04-form-data.demo.ts', i, e.default)),
  },
  {
    title: 'Validation',
    filename: 'nextrap-elements/nte-input/demo/05-validation.demo.ts',
    load: () =>
      Promise.all([
        v(() => import('./05-validation.demo-DSf_VrrD.js'), __vite__mapDeps([7, 1, 2, 3, 4]), import.meta.url),
        v(() => import('./05-validation.demo-BcD1RhnO.js'), [], import.meta.url),
      ]).then(([i, e]) => k('nextrap-elements/nte-input/demo/05-validation.demo.ts', i, e.default)),
  },
  {
    title: 'Select-Radio Vertical',
    filename: 'nextrap-elements/nte-input/demo/06-select-radio-vertical.demo.ts',
    load: () =>
      Promise.all([
        v(
          () => import('./06-select-radio-vertical.demo-GkMZo216.js'),
          __vite__mapDeps([8, 1, 2, 3, 4]),
          import.meta.url,
        ),
        v(() => import('./06-select-radio-vertical.demo-Cbx5Uezo.js'), [], import.meta.url),
      ]).then(([i, e]) => k('nextrap-elements/nte-input/demo/06-select-radio-vertical.demo.ts', i, e.default)),
  },
  {
    title: 'API-Entwurf',
    filename: 'nextrap-elements/nte-nav-2/demo/01-overview.demo.ts',
    load: () =>
      Promise.all([
        v(() => import('./01-overview.demo-HYA-Gqsx.js'), [], import.meta.url),
        v(() => import('./01-overview.demo-7Kw7iFUf.js'), [], import.meta.url),
      ]).then(([i, e]) => k('nextrap-elements/nte-nav-2/demo/01-overview.demo.ts', i, e.default)),
  },
  {
    title: 'Horizontal',
    filename: 'nextrap-elements/nte-nav-2/demo/02-horizontal.demo.ts',
    load: () =>
      Promise.all([
        v(() => import('./02-horizontal.demo-DE6Zmbzo.js'), __vite__mapDeps([9, 10, 2, 11]), import.meta.url),
        v(() => import('./02-horizontal.demo-FibmPRcb.js'), [], import.meta.url),
      ]).then(([i, e]) => k('nextrap-elements/nte-nav-2/demo/02-horizontal.demo.ts', i, e.default)),
  },
  {
    title: 'Vertikal',
    filename: 'nextrap-elements/nte-nav-2/demo/03-vertical.demo.ts',
    load: () =>
      Promise.all([
        v(() => import('./03-vertical.demo-0oRGleO5.js'), __vite__mapDeps([12, 10, 2, 11]), import.meta.url),
        v(() => import('./03-vertical.demo-BmanNjPC.js'), [], import.meta.url),
      ]).then(([i, e]) => k('nextrap-elements/nte-nav-2/demo/03-vertical.demo.ts', i, e.default)),
  },
  {
    title: 'Responsive & Order',
    filename: 'nextrap-elements/nte-nav-2/demo/04-responsive-order.demo.ts',
    load: () =>
      Promise.all([
        v(() => import('./04-responsive-order.demo-BLxeRy0A.js'), __vite__mapDeps([13, 10, 2, 11]), import.meta.url),
        v(() => import('./04-responsive-order.demo-CA3FhXFK.js'), [], import.meta.url),
      ]).then(([i, e]) => k('nextrap-elements/nte-nav-2/demo/04-responsive-order.demo.ts', i, e.default)),
  },
  {
    title: 'Buttons',
    group: 'style-button',
    filename: 'nextrap-styles/style-button/demo/01-buttons.demo.ts',
    load: () =>
      Promise.all([
        v(() => import('./01-buttons.demo-9oIaug5Y.js'), __vite__mapDeps([14, 15, 4]), import.meta.url),
        v(() => import('./01-buttons.demo-Cyrld2ht.js'), [], import.meta.url),
      ]).then(([i, e]) => k('nextrap-styles/style-button/demo/01-buttons.demo.ts', i, e.default)),
  },
];
function Ot() {
  const i = document.querySelector('tj-demo-viewer');
  return i ? ((i.demos = li), !0) : !1;
}
Ot() ||
  window.addEventListener(
    'tj:viewerReady',
    () => {
      Ot();
    },
    { once: !0 },
  );
export { g as A, Q as E, x as b, Dt as f, Ei as h, A as i, V as r, Ue as u, K as y };
