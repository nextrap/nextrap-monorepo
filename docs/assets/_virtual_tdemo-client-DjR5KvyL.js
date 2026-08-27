const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      './01-overview.demo-d0JYOYuj.js',
      './types-4rIte7rE.js',
      './02-hover-style.demo-BHnM2OEA.js',
      './main-IKWun8z7.js',
      './main-BkomUfB9.css',
      './index-NZ9cz-wL.css',
      './03-form-action.demo-JOgqL4a1.js',
      './04-form-data.demo-DoOIJ7DF.js',
      './05-validation.demo-BZwgVZp0.js',
      './06-select-radio-vertical.demo-D2OT2J-_.js',
      './01-buttons.demo-B-2c-RFl.js',
      './01-buttons-B-QmuC-C.css',
    ]),
) => i.map((i) => d[i]);
var gn = Object.defineProperty;
var it = (r) => {
  throw TypeError(r);
};
var vn = (r, t, e) => (t in r ? gn(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (r[t] = e));
var S = (r, t, e) => vn(r, typeof t != 'symbol' ? t + '' : t, e),
  De = (r, t, e) => t.has(r) || it('Cannot ' + e);
var p = (r, t, e) => (De(r, t, 'read from private field'), e ? e.call(r) : t.get(r)),
  v = (r, t, e) =>
    t.has(r) ? it('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(r) : t.set(r, e),
  x = (r, t, e, n) => (De(r, t, 'write to private field'), n ? n.call(r, e) : t.set(r, e), e),
  d = (r, t, e) => (De(r, t, 'access private method'), e);
var ot = (r, t, e, n) => ({
  set _(s) {
    x(r, t, s, e);
  },
  get _() {
    return p(r, t, n);
  },
});
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const we = globalThis,
  nt =
    we.ShadowRoot &&
    (we.ShadyCSS === void 0 || we.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype,
  st = Symbol(),
  at = new WeakMap();
let jt = class {
  constructor(t, e, n) {
    if (((this._$cssResult$ = !0), n !== st))
      throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    ((this.cssText = t), (this.t = e));
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (nt && t === void 0) {
      const n = e !== void 0 && e.length === 1;
      (n && (t = at.get(e)),
        t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), n && at.set(e, t)));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const W = (r) => new jt(typeof r == 'string' ? r : r + '', void 0, st),
  bn = (r, ...t) => {
    const e =
      r.length === 1
        ? r[0]
        : t.reduce(
            (n, s, i) =>
              n +
              ((o) => {
                if (o._$cssResult$ === !0) return o.cssText;
                if (typeof o == 'number') return o;
                throw Error(
                  "Value passed to 'css' function must be a 'css' function result: " +
                    o +
                    ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.",
                );
              })(s) +
              r[i + 1],
            r[0],
          );
    return new jt(e, r, st);
  },
  yn = (r, t) => {
    if (nt) r.adoptedStyleSheets = t.map((e) => (e instanceof CSSStyleSheet ? e : e.styleSheet));
    else
      for (const e of t) {
        const n = document.createElement('style'),
          s = we.litNonce;
        (s !== void 0 && n.setAttribute('nonce', s), (n.textContent = e.cssText), r.appendChild(n));
      }
  },
  lt = nt
    ? (r) => r
    : (r) =>
        r instanceof CSSStyleSheet
          ? ((t) => {
              let e = '';
              for (const n of t.cssRules) e += n.cssText;
              return W(e);
            })(r)
          : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const {
    is: xn,
    defineProperty: _n,
    getOwnPropertyDescriptor: wn,
    getOwnPropertyNames: $n,
    getOwnPropertySymbols: En,
    getPrototypeOf: kn,
  } = Object,
  P = globalThis,
  dt = P.trustedTypes,
  An = dt ? dt.emptyScript : '',
  Ue = P.reactiveElementPolyfillSupport,
  de = (r, t) => r,
  Be = {
    toAttribute(r, t) {
      switch (t) {
        case Boolean:
          r = r ? An : null;
          break;
        case Object:
        case Array:
          r = r == null ? r : JSON.stringify(r);
      }
      return r;
    },
    fromAttribute(r, t) {
      let e = r;
      switch (t) {
        case Boolean:
          e = r !== null;
          break;
        case Number:
          e = r === null ? null : Number(r);
          break;
        case Object:
        case Array:
          try {
            e = JSON.parse(r);
          } catch {
            e = null;
          }
      }
      return e;
    },
  },
  Ot = (r, t) => !xn(r, t),
  ct = { attribute: !0, type: String, converter: Be, reflect: !1, useDefault: !1, hasChanged: Ot };
(Symbol.metadata ?? (Symbol.metadata = Symbol('metadata')),
  P.litPropertyMetadata ?? (P.litPropertyMetadata = new WeakMap()));
let G = class extends HTMLElement {
  static addInitializer(t) {
    (this._$Ei(), (this.l ?? (this.l = [])).push(t));
  }
  static get observedAttributes() {
    return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
  }
  static createProperty(t, e = ct) {
    if (
      (e.state && (e.attribute = !1),
      this._$Ei(),
      this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0),
      this.elementProperties.set(t, e),
      !e.noAccessor)
    ) {
      const n = Symbol(),
        s = this.getPropertyDescriptor(t, n, e);
      s !== void 0 && _n(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, n) {
    const { get: s, set: i } = wn(this.prototype, t) ?? {
      get() {
        return this[e];
      },
      set(o) {
        this[e] = o;
      },
    };
    return {
      get: s,
      set(o) {
        const l = s == null ? void 0 : s.call(this);
        (i == null || i.call(this, o), this.requestUpdate(t, l, n));
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ct;
  }
  static _$Ei() {
    if (this.hasOwnProperty(de('elementProperties'))) return;
    const t = kn(this);
    (t.finalize(), t.l !== void 0 && (this.l = [...t.l]), (this.elementProperties = new Map(t.elementProperties)));
  }
  static finalize() {
    if (this.hasOwnProperty(de('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(de('properties')))) {
      const e = this.properties,
        n = [...$n(e), ...En(e)];
      for (const s of n) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [n, s] of e) this.elementProperties.set(n, s);
    }
    this._$Eh = new Map();
    for (const [e, n] of this.elementProperties) {
      const s = this._$Eu(e, n);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const n = new Set(t.flat(1 / 0).reverse());
      for (const s of n) e.unshift(lt(s));
    } else t !== void 0 && e.push(lt(t));
    return e;
  }
  static _$Eu(t, e) {
    const n = e.attribute;
    return n === !1 ? void 0 : typeof n == 'string' ? n : typeof t == 'string' ? t.toLowerCase() : void 0;
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
    var t;
    ((this._$ES = new Promise((e) => (this.enableUpdating = e))),
      (this._$AL = new Map()),
      this._$E_(),
      this.requestUpdate(),
      (t = this.constructor.l) == null || t.forEach((e) => e(this)));
  }
  addController(t) {
    var e;
    ((this._$EO ?? (this._$EO = new Set())).add(t),
      this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t)));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = new Map(),
      e = this.constructor.elementProperties;
    for (const n of e.keys()) this.hasOwnProperty(n) && (t.set(n, this[n]), delete this[n]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return (yn(t, this.constructor.elementStyles), t);
  }
  connectedCallback() {
    var t;
    (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()),
      this.enableUpdating(!0),
      (t = this._$EO) == null ||
        t.forEach((e) => {
          var n;
          return (n = e.hostConnected) == null ? void 0 : n.call(e);
        }));
  }
  enableUpdating(t) {}
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null ||
      t.forEach((e) => {
        var n;
        return (n = e.hostDisconnected) == null ? void 0 : n.call(e);
      });
  }
  attributeChangedCallback(t, e, n) {
    this._$AK(t, n);
  }
  _$ET(t, e) {
    var i;
    const n = this.constructor.elementProperties.get(t),
      s = this.constructor._$Eu(t, n);
    if (s !== void 0 && n.reflect === !0) {
      const o = (((i = n.converter) == null ? void 0 : i.toAttribute) !== void 0 ? n.converter : Be).toAttribute(
        e,
        n.type,
      );
      ((this._$Em = t), o == null ? this.removeAttribute(s) : this.setAttribute(s, o), (this._$Em = null));
    }
  }
  _$AK(t, e) {
    var i, o;
    const n = this.constructor,
      s = n._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const l = n.getPropertyOptions(s),
        a =
          typeof l.converter == 'function'
            ? { fromAttribute: l.converter }
            : ((i = l.converter) == null ? void 0 : i.fromAttribute) !== void 0
              ? l.converter
              : Be;
      this._$Em = s;
      const c = a.fromAttribute(e, l.type);
      ((this[s] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(s)) ?? c), (this._$Em = null));
    }
  }
  requestUpdate(t, e, n, s = !1, i) {
    var o;
    if (t !== void 0) {
      const l = this.constructor;
      if (
        (s === !1 && (i = this[t]),
        n ?? (n = l.getPropertyOptions(t)),
        !(
          (n.hasChanged ?? Ot)(i, e) ||
          (n.useDefault &&
            n.reflect &&
            i === ((o = this._$Ej) == null ? void 0 : o.get(t)) &&
            !this.hasAttribute(l._$Eu(t, n)))
        ))
      )
        return;
      this.C(t, e, n);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: n, reflect: s, wrapped: i }, o) {
    (n &&
      !(this._$Ej ?? (this._$Ej = new Map())).has(t) &&
      (this._$Ej.set(t, o ?? e ?? this[t]), i !== !0 || o !== void 0)) ||
      (this._$AL.has(t) || (this.hasUpdated || n || (e = void 0), this._$AL.set(t, e)),
      s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return (t != null && (await t), !this.isUpdatePending);
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var n;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if ((this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep)) {
        for (const [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0)
        for (const [i, o] of s) {
          const { wrapped: l } = o,
            a = this[i];
          l !== !0 || this._$AL.has(i) || a === void 0 || this.C(i, void 0, o, a);
        }
    }
    let t = !1;
    const e = this._$AL;
    try {
      ((t = this.shouldUpdate(e)),
        t
          ? (this.willUpdate(e),
            (n = this._$EO) == null ||
              n.forEach((s) => {
                var i;
                return (i = s.hostUpdate) == null ? void 0 : i.call(s);
              }),
            this.update(e))
          : this._$EM());
    } catch (s) {
      throw ((t = !1), this._$EM(), s);
    }
    t && this._$AE(e);
  }
  willUpdate(t) {}
  _$AE(t) {
    var e;
    ((e = this._$EO) == null ||
      e.forEach((n) => {
        var s;
        return (s = n.hostUpdated) == null ? void 0 : s.call(n);
      }),
      this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
      this.updated(t));
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    (this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM());
  }
  updated(t) {}
  firstUpdated(t) {}
};
((G.elementStyles = []),
  (G.shadowRootOptions = { mode: 'open' }),
  (G[de('elementProperties')] = new Map()),
  (G[de('finalized')] = new Map()),
  Ue == null || Ue({ ReactiveElement: G }),
  (P.reactiveElementVersions ?? (P.reactiveElementVersions = [])).push('2.1.2'));
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const ce = globalThis,
  ht = (r) => r,
  Ce = ce.trustedTypes,
  ut = Ce ? Ce.createPolicy('lit-html', { createHTML: (r) => r }) : void 0,
  Rt = '$lit$',
  H = `lit$${Math.random().toFixed(9).slice(2)}$`,
  Lt = '?' + H,
  Cn = `<${Lt}>`,
  F = document,
  ue = () => F.createComment(''),
  pe = (r) => r === null || (typeof r != 'object' && typeof r != 'function'),
  rt = Array.isArray,
  Sn = (r) => rt(r) || typeof (r == null ? void 0 : r[Symbol.iterator]) == 'function',
  Ne = `[ 	
\f\r]`,
  ie = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  pt = /-->/g,
  ft = />/g,
  D = RegExp(
    `>|${Ne}(?:([^\\s"'>=/]+)(${Ne}*=${Ne}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,
    'g',
  ),
  mt = /'/g,
  gt = /"/g,
  Ht = /^(?:script|style|textarea|title)$/i,
  jn =
    (r) =>
    (t, ...e) => ({ _$litType$: r, strings: t, values: e }),
  w = jn(1),
  ne = Symbol.for('lit-noChange'),
  b = Symbol.for('lit-nothing'),
  vt = new WeakMap(),
  T = F.createTreeWalker(F, 129);
function Pt(r, t) {
  if (!rt(r) || !r.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return ut !== void 0 ? ut.createHTML(t) : t;
}
const On = (r, t) => {
  const e = r.length - 1,
    n = [];
  let s,
    i = t === 2 ? '<svg>' : t === 3 ? '<math>' : '',
    o = ie;
  for (let l = 0; l < e; l++) {
    const a = r[l];
    let c,
      h,
      u = -1,
      g = 0;
    for (; g < a.length && ((o.lastIndex = g), (h = o.exec(a)), h !== null);)
      ((g = o.lastIndex),
        o === ie
          ? h[1] === '!--'
            ? (o = pt)
            : h[1] !== void 0
              ? (o = ft)
              : h[2] !== void 0
                ? (Ht.test(h[2]) && (s = RegExp('</' + h[2], 'g')), (o = D))
                : h[3] !== void 0 && (o = D)
          : o === D
            ? h[0] === '>'
              ? ((o = s ?? ie), (u = -1))
              : h[1] === void 0
                ? (u = -2)
                : ((u = o.lastIndex - h[2].length), (c = h[1]), (o = h[3] === void 0 ? D : h[3] === '"' ? gt : mt))
            : o === gt || o === mt
              ? (o = D)
              : o === pt || o === ft
                ? (o = ie)
                : ((o = D), (s = void 0)));
    const $ = o === D && r[l + 1].startsWith('/>') ? ' ' : '';
    i += o === ie ? a + Cn : u >= 0 ? (n.push(c), a.slice(0, u) + Rt + a.slice(u) + H + $) : a + H + (u === -2 ? l : $);
  }
  return [Pt(r, i + (r[e] || '<?>') + (t === 2 ? '</svg>' : t === 3 ? '</math>' : '')), n];
};
class fe {
  constructor({ strings: t, _$litType$: e }, n) {
    let s;
    this.parts = [];
    let i = 0,
      o = 0;
    const l = t.length - 1,
      a = this.parts,
      [c, h] = On(t, e);
    if (((this.el = fe.createElement(c, n)), (T.currentNode = this.el.content), e === 2 || e === 3)) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (s = T.nextNode()) !== null && a.length < l;) {
      if (s.nodeType === 1) {
        if (s.hasAttributes())
          for (const u of s.getAttributeNames())
            if (u.endsWith(Rt)) {
              const g = h[o++],
                $ = s.getAttribute(u).split(H),
                _ = /([.?@])?(.*)/.exec(g);
              (a.push({
                type: 1,
                index: i,
                name: _[2],
                strings: $,
                ctor: _[1] === '.' ? Ln : _[1] === '?' ? Hn : _[1] === '@' ? Pn : He,
              }),
                s.removeAttribute(u));
            } else u.startsWith(H) && (a.push({ type: 6, index: i }), s.removeAttribute(u));
        if (Ht.test(s.tagName)) {
          const u = s.textContent.split(H),
            g = u.length - 1;
          if (g > 0) {
            s.textContent = Ce ? Ce.emptyScript : '';
            for (let $ = 0; $ < g; $++) (s.append(u[$], ue()), T.nextNode(), a.push({ type: 2, index: ++i }));
            s.append(u[g], ue());
          }
        }
      } else if (s.nodeType === 8)
        if (s.data === Lt) a.push({ type: 2, index: i });
        else {
          let u = -1;
          for (; (u = s.data.indexOf(H, u + 1)) !== -1;) (a.push({ type: 7, index: i }), (u += H.length - 1));
        }
      i++;
    }
  }
  static createElement(t, e) {
    const n = F.createElement('template');
    return ((n.innerHTML = t), n);
  }
}
function se(r, t, e = r, n) {
  var o, l;
  if (t === ne) return t;
  let s = n !== void 0 ? ((o = e._$Co) == null ? void 0 : o[n]) : e._$Cl;
  const i = pe(t) ? void 0 : t._$litDirective$;
  return (
    (s == null ? void 0 : s.constructor) !== i &&
      ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1),
      i === void 0 ? (s = void 0) : ((s = new i(r)), s._$AT(r, e, n)),
      n !== void 0 ? ((e._$Co ?? (e._$Co = []))[n] = s) : (e._$Cl = s)),
    s !== void 0 && (t = se(r, s._$AS(r, t.values), s, n)),
    t
  );
}
class Rn {
  constructor(t, e) {
    ((this._$AV = []), (this._$AN = void 0), (this._$AD = t), (this._$AM = e));
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const {
        el: { content: e },
        parts: n,
      } = this._$AD,
      s = ((t == null ? void 0 : t.creationScope) ?? F).importNode(e, !0);
    T.currentNode = s;
    let i = T.nextNode(),
      o = 0,
      l = 0,
      a = n[0];
    for (; a !== void 0;) {
      if (o === a.index) {
        let c;
        (a.type === 2
          ? (c = new _e(i, i.nextSibling, this, t))
          : a.type === 1
            ? (c = new a.ctor(i, a.name, a.strings, this, t))
            : a.type === 6 && (c = new Mn(i, this, t)),
          this._$AV.push(c),
          (a = n[++l]));
      }
      o !== (a == null ? void 0 : a.index) && ((i = T.nextNode()), o++);
    }
    return ((T.currentNode = F), s);
  }
  p(t) {
    let e = 0;
    for (const n of this._$AV)
      (n !== void 0 && (n.strings !== void 0 ? (n._$AI(t, n, e), (e += n.strings.length - 2)) : n._$AI(t[e])), e++);
  }
}
class _e {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, n, s) {
    ((this.type = 2),
      (this._$AH = b),
      (this._$AN = void 0),
      (this._$AA = t),
      (this._$AB = e),
      (this._$AM = n),
      (this.options = s),
      (this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0));
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return (e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t);
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    ((t = se(this, t, e)),
      pe(t)
        ? t === b || t == null || t === ''
          ? (this._$AH !== b && this._$AR(), (this._$AH = b))
          : t !== this._$AH && t !== ne && this._(t)
        : t._$litType$ !== void 0
          ? this.$(t)
          : t.nodeType !== void 0
            ? this.T(t)
            : Sn(t)
              ? this.k(t)
              : this._(t));
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), (this._$AH = this.O(t)));
  }
  _(t) {
    (this._$AH !== b && pe(this._$AH) ? (this._$AA.nextSibling.data = t) : this.T(F.createTextNode(t)),
      (this._$AH = t));
  }
  $(t) {
    var i;
    const { values: e, _$litType$: n } = t,
      s =
        typeof n == 'number'
          ? this._$AC(t)
          : (n.el === void 0 && (n.el = fe.createElement(Pt(n.h, n.h[0]), this.options)), n);
    if (((i = this._$AH) == null ? void 0 : i._$AD) === s) this._$AH.p(e);
    else {
      const o = new Rn(s, this),
        l = o.u(this.options);
      (o.p(e), this.T(l), (this._$AH = o));
    }
  }
  _$AC(t) {
    let e = vt.get(t.strings);
    return (e === void 0 && vt.set(t.strings, (e = new fe(t))), e);
  }
  k(t) {
    rt(this._$AH) || ((this._$AH = []), this._$AR());
    const e = this._$AH;
    let n,
      s = 0;
    for (const i of t)
      (s === e.length ? e.push((n = new _e(this.O(ue()), this.O(ue()), this, this.options))) : (n = e[s]),
        n._$AI(i),
        s++);
    s < e.length && (this._$AR(n && n._$AB.nextSibling, s), (e.length = s));
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, e); t !== this._$AB;) {
      const s = ht(t).nextSibling;
      (ht(t).remove(), (t = s));
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && ((this._$Cv = t), (e = this._$AP) == null || e.call(this, t));
  }
}
class He {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, n, s, i) {
    ((this.type = 1),
      (this._$AH = b),
      (this._$AN = void 0),
      (this.element = t),
      (this.name = e),
      (this._$AM = s),
      (this.options = i),
      n.length > 2 || n[0] !== '' || n[1] !== ''
        ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n))
        : (this._$AH = b));
  }
  _$AI(t, e = this, n, s) {
    const i = this.strings;
    let o = !1;
    if (i === void 0) ((t = se(this, t, e, 0)), (o = !pe(t) || (t !== this._$AH && t !== ne)), o && (this._$AH = t));
    else {
      const l = t;
      let a, c;
      for (t = i[0], a = 0; a < i.length - 1; a++)
        ((c = se(this, l[n + a], e, a)),
          c === ne && (c = this._$AH[a]),
          o || (o = !pe(c) || c !== this._$AH[a]),
          c === b ? (t = b) : t !== b && (t += (c ?? '') + i[a + 1]),
          (this._$AH[a] = c));
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? '');
  }
}
class Ln extends He {
  constructor() {
    (super(...arguments), (this.type = 3));
  }
  j(t) {
    this.element[this.name] = t === b ? void 0 : t;
  }
}
class Hn extends He {
  constructor() {
    (super(...arguments), (this.type = 4));
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== b);
  }
}
class Pn extends He {
  constructor(t, e, n, s, i) {
    (super(t, e, n, s, i), (this.type = 5));
  }
  _$AI(t, e = this) {
    if ((t = se(this, t, e, 0) ?? b) === ne) return;
    const n = this._$AH,
      s = (t === b && n !== b) || t.capture !== n.capture || t.once !== n.once || t.passive !== n.passive,
      i = t !== b && (n === b || s);
    (s && this.element.removeEventListener(this.name, this, n),
      i && this.element.addEventListener(this.name, this, t),
      (this._$AH = t));
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == 'function'
      ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t)
      : this._$AH.handleEvent(t);
  }
}
class Mn {
  constructor(t, e, n) {
    ((this.element = t), (this.type = 6), (this._$AN = void 0), (this._$AM = e), (this.options = n));
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    se(this, t);
  }
}
const Te = ce.litHtmlPolyfillSupport;
(Te == null || Te(fe, _e), (ce.litHtmlVersions ?? (ce.litHtmlVersions = [])).push('3.3.3'));
const Dn = (r, t, e) => {
  const n = (e == null ? void 0 : e.renderBefore) ?? t;
  let s = n._$litPart$;
  if (s === void 0) {
    const i = (e == null ? void 0 : e.renderBefore) ?? null;
    n._$litPart$ = s = new _e(t.insertBefore(ue(), i), i, void 0, e ?? {});
  }
  return (s._$AI(r), s);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const q = globalThis;
class C extends G {
  constructor() {
    (super(...arguments), (this.renderOptions = { host: this }), (this._$Do = void 0));
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return ((e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t);
  }
  update(t) {
    const e = this.render();
    (this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
      super.update(t),
      (this._$Do = Dn(e, this.renderRoot, this.renderOptions)));
  }
  connectedCallback() {
    var t;
    (super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0));
  }
  disconnectedCallback() {
    var t;
    (super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1));
  }
  render() {
    return ne;
  }
}
var St;
((C._$litElement$ = !0),
  (C.finalized = !0),
  (St = q.litElementHydrateSupport) == null || St.call(q, { LitElement: C }));
const ze = q.litElementPolyfillSupport;
ze == null || ze({ LitElement: C });
(q.litElementVersions ?? (q.litElementVersions = [])).push('4.2.2');
const Un =
    ':host{--tj-demo-control-gap: 12px}.controls-builtins{display:flex;flex-wrap:wrap;gap:var(--tj-demo-control-gap)}.controls-builtins:empty{display:none}.controls-builtins>button,.controls-builtins>input,.controls-builtins>select,.controls-builtins>textarea,.controls-builtins>*[data-tj-demo-control]{min-height:40px;padding:10px 14px;border:1px solid #94a3b8;border-radius:10px;background:#fff;color:#111827;font:inherit}.controls-builtins>button,.controls-builtins>select{cursor:pointer}.controls-builtins>textarea{min-width:220px;min-height:96px;resize:vertical}',
  Nn =
    ':host{--tj-demo-controls-rail-height: 38px;--tj-demo-controls-panel-height: 0px;position:fixed;bottom:0;left:0;width:100vw;z-index:15;display:block;color:#111827;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.shell{display:grid;grid-template-rows:minmax(0,var(--tj-demo-controls-panel-height)) var(--tj-demo-controls-rail-height);align-items:end}.shell.is-closed{grid-template-rows:0 var(--tj-demo-controls-rail-height)}.panel-wrapper{overflow:hidden}.panel{overflow:auto;padding:16px 20px;border-top:1px solid #d1d5db;background:#fffffff5;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 -8px 24px #0f172a14}.shell[hidden],.panel[hidden],:host([hidden]){display:none}.panel-content{display:grid;gap:12px}.slot-wrap.hidden{display:none}.rail{display:grid;grid-template-columns:48px 1fr auto;align-items:center;min-height:var(--tj-demo-controls-rail-height);background:#000;color:#fff}.toggle{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;padding:0;border:0;border-radius:0;background:transparent;color:inherit;cursor:pointer}.toggle:hover{background:#111827}.toggle-icon{font-size:18px;line-height:1}.label{padding:0 12px;font-size:.9rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.actions{display:flex;align-items:center;gap:8px;min-height:48px;padding-right:8px}',
  bt = 'tj-demo-controls:open';
var j, me, f, Mt, ge, We, Dt, Fe, Ut, Nt, Tt, zt, Ke, oe, It, ae, Bt, J;
const Se = class Se extends C {
  constructor() {
    super();
    v(this, f);
    v(this, j);
    v(this, me);
    v(this, ge);
    v(this, J);
    ((this.controlsOpen = !0),
      (this.hasCustomControls = !1),
      x(this, me, () => {
        this.controlsOpen = !this.controlsOpen;
      }),
      x(this, ge, () => {
        (d(this, f, We).call(this), this.requestUpdate());
      }),
      x(this, J, () => {
        (d(this, f, ae).call(this), d(this, f, oe).call(this));
      }),
      (this.controlsOpen = d(this, f, Nt).call(this)));
  }
  connectedCallback() {
    (super.connectedCallback(),
      d(this, f, zt).call(this),
      d(this, f, oe).call(this),
      d(this, f, ae).call(this),
      window.addEventListener('resize', p(this, J)));
  }
  disconnectedCallback() {
    var e;
    (window.removeEventListener('resize', p(this, J)),
      (e = p(this, j)) == null || e.disconnect(),
      d(this, f, It).call(this),
      d(this, f, Bt).call(this),
      super.disconnectedCallback());
  }
  updated(e) {
    (super.updated(e),
      e.has('data') && d(this, f, Fe).call(this),
      e.has('controlsOpen') && (d(this, f, Tt).call(this), d(this, f, oe).call(this), d(this, f, ae).call(this)));
  }
  render() {
    return w`
      <div class=${d(this, f, Mt).call(this)} ?hidden=${!d(this, f, Dt).call(this)}>
        <div class="panel-wrapper">
          <div class="panel" ?hidden=${!this.controlsOpen}>
            <div class="panel-content">
              <div id="builtin-controls" class="controls-builtins"></div>
              <div class=${this.hasCustomControls ? 'slot-wrap' : 'slot-wrap hidden'}>
                <slot name="controls" @slotchange=${p(this, ge)}></slot>
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
            @click=${p(this, me)}
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
    (d(this, f, We).call(this), d(this, f, Fe).call(this));
  }
};
((j = new WeakMap()),
  (me = new WeakMap()),
  (f = new WeakSet()),
  (Mt = function () {
    return `shell ${this.controlsOpen ? 'is-open' : 'is-closed'}`;
  }),
  (ge = new WeakMap()),
  (We = function () {
    const e = this.renderRoot.querySelector('slot[name="controls"]');
    if (!(e instanceof HTMLSlotElement)) {
      this.hasCustomControls = !1;
      return;
    }
    this.hasCustomControls = e.assignedNodes({ flatten: !0 }).some((n) => {
      var s;
      return n.nodeType !== Node.TEXT_NODE || ((s = n.textContent) == null ? void 0 : s.trim());
    });
  }),
  (Dt = function () {
    var e;
    return !!((e = this.data) != null && e.length) || this.hasCustomControls;
  }),
  (Fe = function () {
    const e = this.renderRoot.querySelector('#builtin-controls');
    if (e instanceof HTMLElement) {
      e.replaceChildren();
      for (const n of this.data ?? []) e.append(d(this, f, Ut).call(this, n));
      d(this, f, Ke).call(this);
    }
  }),
  (Ut = function (e) {
    const n =
      e.element instanceof HTMLElement
        ? e.element
        : document.createElement(typeof e.element == 'string' ? e.element : 'button');
    if (
      (n.setAttribute('data-tj-demo-control', ''),
      (n.textContent = e.label ?? ''),
      e.info && !n.getAttribute('title') && (n.title = e.info),
      n instanceof HTMLSelectElement && Array.isArray(e.selectOptions))
    ) {
      n.replaceChildren();
      for (const s of e.selectOptions) {
        const i = document.createElement('option');
        (typeof s == 'string'
          ? ((i.value = s), (i.textContent = s))
          : ((i.value = s.value ?? s.label ?? ''),
            (i.textContent = s.label ?? s.value ?? ''),
            (i.disabled = !!s.disabled)),
          n.append(i));
      }
    }
    for (const [s, i] of Object.entries(e)) {
      if (!s.startsWith('on') || typeof i != 'function') continue;
      const o = s.slice(2);
      o && n.addEventListener(o, i);
    }
    if (e.events && typeof e.events == 'object')
      for (const [s, i] of Object.entries(e.events)) typeof i == 'function' && n.addEventListener(s, i);
    return (typeof e.init == 'function' && e.init(n), n);
  }),
  (Nt = function () {
    if (typeof sessionStorage > 'u') return !0;
    try {
      const e = sessionStorage.getItem(bt);
      return e === null ? !0 : e === 'true';
    } catch {
      return !0;
    }
  }),
  (Tt = function () {
    if (!(typeof sessionStorage > 'u'))
      try {
        sessionStorage.setItem(bt, String(this.controlsOpen));
      } catch {}
  }),
  (zt = function () {
    var e;
    typeof ResizeObserver > 'u' ||
      ((e = p(this, j)) == null || e.disconnect(),
      x(
        this,
        j,
        new ResizeObserver(() => {
          (d(this, f, Ke).call(this), d(this, f, oe).call(this), d(this, f, ae).call(this));
        }),
      ),
      p(this, j).observe(this),
      typeof document < 'u' &&
        (p(this, j).observe(document.documentElement), document.body && p(this, j).observe(document.body)));
  }),
  (Ke = function () {
    const e = this.renderRoot.querySelector('.panel'),
      n = (e == null ? void 0 : e.scrollHeight) ?? 0;
    this.style.setProperty('--tj-demo-controls-panel-height', `${n}px`);
  }),
  (oe = function () {
    typeof document > 'u' ||
      requestAnimationFrame(() => {
        document.documentElement.style.paddingBottom = `${this.getBoundingClientRect().height}px`;
      });
  }),
  (It = function () {
    typeof document > 'u' || (document.documentElement.style.paddingBottom = '');
  }),
  (ae = function () {
    if (typeof document > 'u') return;
    const e = document.body;
    e &&
      requestAnimationFrame(() => {
        const n = e.getBoundingClientRect();
        ((this.style.left = `${n.left}px`), (this.style.width = `${n.width}px`));
      });
  }),
  (Bt = function () {
    ((this.style.left = ''), (this.style.width = ''));
  }),
  (J = new WeakMap()),
  (Se.properties = { data: { attribute: !1 }, controlsOpen: { state: !0 }, hasCustomControls: { state: !0 } }),
  (Se.styles = [W(Un), W(Nn)]));
let qe = Se;
typeof customElements < 'u' && !customElements.get('tj-demo-controls') && customElements.define('tj-demo-controls', qe);
function R(r) {
  const t = {};
  for (const e of r.kramdown ?? []) {
    if (e.valueType === 'id') {
      t.id = e.value ?? '';
      continue;
    }
    if (e.valueType === 'class') {
      t.class ? (t.class += ' ' + e.value) : (t.class = e.value);
      continue;
    }
    t[e.key] ? (t[e.key] += ' ' + (e.value ?? '')) : (t[e.key] = e.value ?? '');
  }
  return t;
}
function yt(r) {
  const t = {};
  for (const e of r ?? []) {
    if (e.valueType === 'id') {
      t.id = e.value ?? '';
      continue;
    }
    if (e.valueType === 'class') {
      t.class ? (t.class += ' ' + e.value) : (t.class = e.value ?? '');
      continue;
    }
    e.valueType === 'attribute' && (t[e.key] ? (t[e.key] += ' ' + (e.value ?? '')) : (t[e.key] = e.value ?? ''));
  }
  return t;
}
function L(r, t) {
  for (const e in t) r.setAttribute(e, t[e]);
}
function qt(r) {
  return r.replace(/<[^>]*>/g, '');
}
function Tn(r) {
  return qt(r)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-')
    .replace(/^-+|-+$/g, '');
}
function O(r = []) {
  const t = (n) =>
    Object.keys(n)
      .map((s) => ` ${s}="${n[s]}"`)
      .join('');
  let e = '';
  for (const n of r)
    switch (n.type) {
      case 'text':
        e += n.content;
        break;
      case 'html':
        e += `<${n.content}>`;
        break;
      case 'link': {
        const s = yt(n.kramdown);
        ((s.href = n.href ?? ''), (e += `<a${t(s)}>${O(n.content)}</a>`));
        break;
      }
      case 'image': {
        const s = yt(n.kramdown);
        ((s.src = n.href ?? ''), (s.alt = qt(O(n.content))), (e += `<img${t(s)}>`));
        break;
      }
    }
  return e;
}
function Wt(r) {
  const t = r.type === 'o-list' ? 'ol' : 'ul',
    e = document.createElement(t),
    n = r.content;
  for (const s of n) {
    if (s.type !== 'list-item') continue;
    const i = document.createElement('li'),
      o = s.content,
      l = [];
    for (const a of o)
      a.type === 'u-list' || a.type === 'o-list'
        ? (l.length && (i.insertAdjacentHTML('beforeend', O(l)), (l.length = 0)), i.appendChild(Wt(a)))
        : l.push(a);
    (l.length && i.insertAdjacentHTML('beforeend', O(l)), e.appendChild(i));
  }
  return e;
}
function zn(r) {
  const t = document.createElement('table'),
    e = R(r);
  L(t, e);
  const n = r.children;
  let s = 0;
  const i = (o, l) => {
    const a = document.createElement('tr');
    return (
      o.forEach((c) => {
        const h = document.createElement(l);
        ((h.innerHTML = O(c.content)), a.appendChild(h));
      }),
      a
    );
  };
  for (const o of n) {
    if (o.type === 'table-head') {
      const l = document.createElement('thead'),
        a = i(o.content, 'th');
      ((s = o.content.length), l.appendChild(a), t.appendChild(l));
    }
    if (o.type === 'table-body') {
      const l = document.createElement('tbody'),
        a = o.content;
      s === 0 && a.length && (s = a.length);
      for (let c = 0; c < a.length; c += s || 1) {
        const h = a.slice(c, c + s || void 0);
        l.appendChild(i(h, 'td'));
      }
      t.appendChild(l);
    }
  }
  return t;
}
function In(r) {
  var e;
  const t = document.createElement('div');
  for (const n of r) {
    switch (n.type) {
      case 'heading': {
        const s = n.heading_level ?? 1,
          i = document.createElement('h' + s),
          o = R(n),
          l = O(n.children);
        if (!o.id) {
          const a = Tn(l);
          a !== '' && (o.id = a);
        }
        (L(i, o), (i.innerHTML = l), t.appendChild(i));
        break;
      }
      case 'hr': {
        const s = document.createElement('hr');
        (L(s, R(n)), t.appendChild(s));
        break;
      }
      case 'paragraph': {
        const s = document.createElement('p');
        (L(s, R(n)), n.children && n.children.length && (s.innerHTML = O(n.children)), t.appendChild(s));
        break;
      }
      case 'list': {
        const s = n.children;
        if (!s || s.length === 0) break;
        for (const i of s) {
          if (i.type !== 'u-list' && i.type !== 'o-list') continue;
          const o = Wt(i);
          (L(o, R(n)), t.appendChild(o));
        }
        break;
      }
      case 'table': {
        const s = zn(n);
        t.appendChild(s);
        break;
      }
      case 'code': {
        const s = document.createElement('pre'),
          i = document.createElement('code');
        (L(s, R(n)),
          (i.textContent = n.children[0].content),
          (e = n.children) != null && e[0].lang && i.setAttribute('class', `language-${n.children[0].lang}`),
          s.appendChild(i),
          t.appendChild(s));
        break;
      }
      case 'quote': {
        const s = document.createElement('blockquote'),
          i = document.createElement('p');
        (L(s, R(n)),
          n.children && n.children.length && (i.innerHTML = O(n.children)),
          s.appendChild(i),
          t.appendChild(s));
        break;
      }
      case 'html': {
        const s = document.createElement('div');
        s.innerHTML = n.children[0].content;
        for (const i of Array.from(s.childNodes)) t.appendChild(i);
        break;
      }
      case 'comment': {
        t.appendChild(document.createComment(n.children[0].content));
        break;
      }
      default: {
        const s = document.createElement('p');
        (L(s, R(n)), n.children && n.children.length && (s.innerHTML = O(n.children)), t.appendChild(s));
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
var $e = ((r) => ((r[(r.Include = 0)] = 'Include'), (r[(r.Exclude = 1)] = 'Exclude'), (r[(r.Peek = 2)] = 'Peek'), r))(
  $e || {},
);
const Bn = { stringDelimiters: ['"', "'"] };
class Ft {
  constructor(t) {
    S(this, '_string', '');
    S(this, '_index', 0);
    S(this, '_curLine', 0);
    S(this, '_curColumn', 0);
    this._string = t;
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
    const n = e[0];
    return ((this._index += n.length), n);
  }
  buildRegex(t, e = !1) {
    if (t instanceof RegExp) return t;
    {
      let n = Array.isArray(t) ? '(' + t.map((s) => this.escapeRegExp(s)).join('|') + ')' : this.escapeRegExp(t);
      return (e && (n = '^' + n), new RegExp(n, 's'));
    }
  }
  peek(t) {
    if (Number.isInteger(t)) return this._string.substring(this._index, this._index + t);
    let e = this.buildRegex(t, !0);
    const s = this.rest.match(e);
    return !s || s.index === void 0 ? null : s[0];
  }
  escapeRegExp(t) {
    return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  readUntil(t, e = 1) {
    let n = this._string.substring(this._index),
      s = '',
      i = this.buildRegex(t);
    const o = n.match(i);
    return !o || o.index === void 0
      ? ((this._index += n.length), { content: n, match: null })
      : ((s = n.slice(0, o.index)),
        (this._index += o.index),
        e === 0 ? ((s += o[0]), (this._index += o[0].length)) : e === 1 && (this._index += o[0].length),
        { content: s, match: o[0] });
  }
  triggerError(t, e, n, s = '') {
    throw (
      Array.isArray(t) || (t = [t]),
      new Error(`Error at position ${n}: Expected "${t.join(', ')}", found "${e}". ${s}`)
    );
  }
  readPrimitive(t = Bn) {
    const e = t.stringDelimiters ?? [],
      n = t.escapeCharacter,
      s = this.peek(1);
    ((!s || !e.includes(s)) &&
      this.triggerError(e, s ?? '<end of input>', this._index, 'No valid string delimiter found'),
      this.read(1));
    let i = '';
    for (; this.hasMore();) {
      const o = this.read(1);
      if (n && o === n) {
        (this.hasMore() || this.triggerError(n, '<end of string>', this._index, 'Escape character at end of string'),
          (i += this.read(1)));
        continue;
      }
      if (o === s)
        return {
          value: i,
          delimiter: s,
          isMultiline: i.includes(`
`),
        };
      i += o;
    }
    this.triggerError(s, '<end of string>', this._index, 'End of string reached without closing delimiter');
  }
  read(t = 1) {
    let e = this._string.substring(this._index);
    e.length < t && (t = e.length);
    const n = e.slice(0, t);
    return ((this._index += t), n);
  }
}
class Kt {
  constructor(t, e = 1) {
    S(this, '_line');
    S(this, '_index', 0);
    S(this, 'lineNumber');
    ((this._line = t), (this.lineNumber = e));
  }
  get __debugInfo() {
    return { rest: this._line.substring(this.index) };
  }
  get index() {
    return this._index;
  }
  set index(t) {
    this._index = t;
  }
  get line() {
    return this._line;
  }
  isWhitespace(t) {
    return (
      t === ' ' ||
      t === '	' ||
      t === '\r' ||
      t ===
        `
` ||
      t === '\f' ||
      t === '\v' ||
      t === null
    );
  }
  readWhiteSpace(t = !0) {
    let e = '';
    for (
      ;
      !this.isEOF() &&
      !(
        this.peek(1) ===
          `
` && !t
      );
    )
      e += this.readChar();
    return e;
  }
  isEOF() {
    return this._index >= this._line.length;
  }
  more() {
    return this._index < this._line.length;
  }
  readValue(t = ';') {
    if ((this.skipWhitespace(), this.isEOF())) return null;
    const e = { value_str: '', value_number: null, quoted: !1, column: this._index },
      n = this.peekChar();
    if (n === '"' || n === "'") {
      if (
        (this.readChar(),
        (e.value_str = this.readEscapedString(n)),
        (e.quoted = !0),
        this.peekChar(),
        this.isNextChar(n))
      )
        this.readChar();
      else throw new Error(this.failmsg(`Unterminated string starting at index ${this._index}`));
      return e;
    }
    const s = this.readUntil(t);
    e.value_str = s;
    const i = Number(s);
    return (!Number.isNaN(i) && s.trim() !== '' && (e.value_number = i), e);
  }
  peekChar(t = 1) {
    return this.isEOF() ? null : this._line.substr(this._index, t);
  }
  peek(t = 1, e = 0) {
    return this.isEOF() ? null : this._line.substring(this._index + e, this._index + e + t);
  }
  readChar() {
    return this.isEOF() ? null : this._line[this._index++];
  }
  readUntil(t, e = !1) {
    let n = '';
    for (; !this.isEOF();) {
      const s = this.readChar(),
        i = this.peekChar();
      if (((n += s), (typeof t == 'string' && i === t) || (t instanceof RegExp && t.test(i ?? '')))) break;
    }
    return (e && !this.isEOF() && (n += this.readChar()), n);
  }
  escapeRegExp(t) {
    return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  readUntilPeekRegex(t, e = !1) {
    let n,
      s = this._line.substring(this._index),
      i = '';
    if (t instanceof RegExp) n = new RegExp(t.source, t.flags.includes('s') ? t.flags : t.flags + 's');
    else {
      const l = Array.isArray(t) ? t.map((a) => this.escapeRegExp(a)).join('|') : this.escapeRegExp(t);
      n = new RegExp(l, 's');
    }
    const o = s.match(n);
    return !o || o.index === void 0
      ? ((this.index += s.length), { content: s, match: null })
      : ((i = s.slice(0, o.index)),
        (this._index += o.index),
        e && ((i += o[0]), (this._index += o[0].length)),
        { content: i, match: o[0] });
  }
  skipWhitespace() {
    for (; !this.isEOF() && /\s/.test(this._line[this._index]);) this._index++;
  }
  readUntilPeek(t, e = !0) {
    let n = '';
    for (; !this.isEOF();) {
      for (const i of t) if (this.peek(i.length) === i) return { value: n, peek: i };
      const s = this.readChar();
      if (
        s ===
          `
` &&
        !e
      )
        break;
      n += s;
    }
    return { value: n, peek: !1 };
  }
  readWord(t = /\w/) {
    if ((this.skipWhitespace(), this.isEOF())) return null;
    let e = '';
    for (; !this.isEOF() && t.test(this._line[this._index]);) e += this._line[this._index++];
    return e;
  }
  readExpression(t = []) {
    if ((this.skipWhitespace(), this.isEOF())) return null;
    this._index;
    let e = null;
    for (let n of t)
      if (this._line.startsWith(n, this._index)) {
        ((e = n), (this._index += e.length));
        break;
      }
    return e;
  }
  readEscapedString(t) {
    let e = !1,
      n = '';
    for (; !this.isEOF() && !(this.peekChar() === t && !e);) {
      const s = this.readChar();
      if (s === '\\' && !e) {
        e = !0;
        continue;
      }
      ((n += s), (e = !1));
    }
    if (e) throw new Error(this.failmsg(`Unterminated string starting at index ${this._index}`));
    return n;
  }
  failmsg(t) {
    return `Line ${this.lineNumber}, Col ${this._index + 1}: ${t}`;
  }
  isNextChar(t) {
    return this.peekChar() === t;
  }
  saveIndex() {
    return this._index;
  }
  restoreIndex(t) {
    this._index = t;
  }
}
function Vt(r) {
  var n;
  const t = new Kt(r),
    e = { elements: [], errors: [], kramdown_length: 0 };
  if (!t.readExpression(['{:'])) throw new Error("parse_kramdown: expected string starting with '{:' - found " + r);
  for (; !t.isEOF();)
    switch ((t.skipWhitespace(), t.peek())) {
      case '}':
        return (t.readChar(), (e.kramdown_length = t.index), e);
      case '#':
      case '.': {
        const s = t.readChar(),
          i = t.readWord(/[a-z0-9_\-:]+/i);
        if (i) e.elements.push({ valueType: s === '#' ? 'id' : 'class', value: i });
        else return (e.errors.push('parse_kramdown: expected class/id - found ' + t.peek()), e);
        break;
      }
      default: {
        const s = t.readWord(/[a-z0-9_\-:]+/i);
        let i;
        s &&
          (t.peek() === '=' && (t.readChar(), (i = (n = t.readValue(/(\s|})/)) == null ? void 0 : n.value_str)),
          e.elements.push({ valueType: 'attribute', value: i, key: s }));
      }
    }
  return (e.errors.push("parse_kramdown: expected '}' - found EOF"), (e.kramdown_length = t.index), e);
}
function Gt(r) {
  const t = r.readExpression(['[', '![']);
  if (t === null) return { type: 'text', content: Jt(r.readUntil(']')) };
  const e = { type: null };
  if (((e.type = t === '[' ? 'link' : 'image'), (e.content = []), r.peekChar() !== ']')) {
    const n = Gt(r);
    e.content = [n];
  }
  if ((r.readChar(), r.peekChar() !== '(')) return { type: 'text', content: e.content };
  if ((r.readChar(), (e.href = r.readUntil(')')), r.readChar(), r.peek() === '{')) {
    const n = Vt(r.line.substring(r.index));
    ((e.kramdown = n.elements), (r.index += n.kramdown_length));
  }
  return e;
}
function Jt(r) {
  return r
    .replace(new RegExp('(?<!\\*)\\*\\*\\*([^\\n]+?)\\*\\*\\*', 'g'), '<strong><em>$1</em></strong>')
    .replace(new RegExp('(?<!\\*)\\*\\*([\\s\\S]+?)\\*\\*', 'g'), '<strong>$1</strong>')
    .replace(new RegExp('(?<!\\*)\\*([\\s\\S]+?)\\*', 'g'), '<em>$1</em>')
    .replace(/__([\s\S]+?)__/g, '<strong>$1</strong>')
    .replace(/_([\s\S]+?)_/g, '<em>$1</em>')
    .replace(/`([\s\S]+?)`/g, '<code>$1</code>')
    .replace(/~~([\s\S]+?)~~/g, '<del>$1</del>');
}
function he(r) {
  const t = [],
    e = new Kt(r);
  for (; e.more();) {
    const n = e.readUntilPeek(['[', '!['], !0);
    (n.value !== '' && t.push({ type: 'text', content: Jt(n.value) }), n.peek !== !1 && t.push(Gt(e)));
  }
  return t;
}
function qn(r) {
  if (r.type !== 'table') return [];
  const t = r.content_raw
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
  if (t.length === 0) return [];
  const e = /^:?-{3,}:?(?:\s*\|\s*:?-{3,}:?)*\s*$/;
  let n = null,
    s = 0;
  const i = (a) => (a.startsWith('|') && (a = a.slice(1)), a.endsWith('|') && (a = a.slice(0, -1)), a.trim());
  t.length >= 2 && e.test(i(t[1])) && ((n = xt(t[0])), (s = 2));
  const o = [];
  n && o.push({ type: 'table-head', content: n.map((a) => _t(a.trim())) });
  const l = [];
  for (let a = s; a < t.length; a++) xt(t[a]).forEach((h) => l.push(_t(h.trim())));
  return (o.push({ type: 'table-body', content: l }), o);
}
function xt(r) {
  return (
    r.startsWith('|') && (r = r.slice(1)),
    r.endsWith('|') && (r = r.slice(0, -1)),
    r.split('|').map((t) => t.trim())
  );
}
function _t(r) {
  return { type: 'table-cell', content: he(r) };
}
function Wn(r) {
  if (r.type !== 'list') return [];
  const t = r.content_raw
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
    e = [],
    n = [],
    s = /^(\s*)([-+*]|(\d+)\.)\s+(.*)$/;
  function i(o, l, a) {
    for (; n.length > 0;) {
      const h = n[n.length - 1];
      if (h.indent === o) {
        if (h.element.type === l && h.element.__marker === a) return h.element;
        n.pop();
        continue;
      }
      if (h.indent > o) {
        n.pop();
        continue;
      }
      break;
    }
    const c = { type: l, content: [] };
    if (((c.__marker = a), n.length === 0)) e.push(c);
    else {
      const u = n[n.length - 1].element.content;
      u.length === 0 && u.push({ type: 'list-item', content: [] });
      const g = u[u.length - 1];
      (Array.isArray(g.content) || (g.content = []), g.content.push(c));
    }
    return (n.push({ element: c, indent: o }), c);
  }
  for (const o of t) {
    const l = o.match(s);
    if (!l) {
      if (n.length > 0) {
        const Pe = n[n.length - 1].element.content;
        if (Pe.length > 0) {
          const Me = Pe[Pe.length - 1];
          (Array.isArray(Me.content) || (Me.content = []), Me.content.push({ type: 'text', content: o.trim() }));
        }
      }
      continue;
    }
    const a = l[1] || '',
      c = l[2],
      h = /\d+\./.test(c),
      u = h ? 'o-list' : 'u-list',
      g = l[4],
      $ = h ? 'o' : c,
      _ = a.replace(/\t/g, '    ').length,
      M = Math.floor(_ / 2),
      V = i(M, u, $),
      mn = { type: 'list-item', content: he(g) };
    V.content.push(mn);
  }
  return e;
}
function Fn(r) {
  const t = new Ft(r);
  let e = [],
    n = !0;
  for (; t.hasMore();) {
    let s = t.readUntil(/\n\n(```|<!--|\S)/m, $e.Peek);
    switch (
      (e.push(
        (n
          ? `

`
          : '') + s.content,
      ),
      (n = !1),
      s.match)
    ) {
      case '\n\n```':
        let i = t.read(5);
        ((i += t.readUntil('```', $e.Include).content), e.push(i));
        break;
      case `

<!--`:
        e.push(t.readUntil('-->', $e.Include).content);
        break;
      default:
        t.read(2);
        break;
    }
  }
  return e;
}
function Kn(r) {
  r = r
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
  const t = [],
    e = Fn(r);
  let n = '';
  for (const s of e) {
    if (s === '') continue;
    if (s.trim() === '') {
      n += s;
      continue;
    }
    const i = new Ft(s),
      o = { type: null, pre_whitespace: n + i.readWhiteSpace(), content_raw: i.rest, post_whitespace: '' };
    n = '';
    let l = i.rest;
    const a = l.match(/^(.*)\n(\{:[^\n]*\})(\s*)$/s);
    if (a) {
      const [, u, g, $] = a;
      ((o.kramdown = Vt(g).elements), (o.post_whitespace = $), (l = u));
    }
    const c = l.split(`
`);
    switch (i.peek(['<!--', '```', '---', '#', '-', '*', '+', '|', '<', '>'])) {
      case '<!--':
        ((o.type = 'comment'), (l = l.substring(4, l.length - 3)), (o.children = [{ type: 'text', content: l }]));
        break;
      case '---':
        o.type = 'hr';
        break;
      case '```':
        o.type = 'code';
        let u = c[0].substring(3).trim();
        (c.shift(),
          c[c.length - 1].endsWith('```') && c.pop(),
          (o.children = [
            {
              type: 'text',
              content: c.join(`
`),
              lang: u,
            },
          ]));
        break;
      case '#':
        ((o.type = 'heading'),
          (o.heading_level = l.split(' ')[0].length),
          (o.children = he(l.substring(o.heading_level).trim())));
        break;
      case '-':
      case '+':
        ((o.type = 'list'), (o.children = Wn(o)));
        break;
      case '|':
        ((o.type = 'table'), (o.children = qn(o)));
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
            .map((g) => g.replace(/^>\s*/, '')).join(`
`)),
          (o.children = he(l)));
        break;
      default:
        ((o.type = 'paragraph'), (o.children = he(l)));
    }
    t.push(o);
  }
  return (n !== '' && t.push({ type: 'whitespace', pre_whitespace: n }), t);
}
class Vn {
  constructor() {
    S(this, '_ast', []);
  }
  set markdown(t) {
    this._ast = Kn(t);
  }
  getHTML() {
    return In(this._ast);
  }
}
const wt =
  'body{margin:0}.tj-demo-renderer-content{padding:15px;color:var(--tj-demo-codestyle-color-text, #0f172a);font:var(--tj-demo-codestyle-font, 15px/1.65 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);text-wrap:pretty}.tj-demo-renderer-content>:first-child{margin-top:0}.tj-demo-renderer-content>:last-child{margin-bottom:0}.tj-demo-renderer-content :where(h1,h2,h3,h4,h5,h6){margin:1.6em 0 .6em;color:var(--tj-demo-codestyle-color-heading, #020617);font-weight:700;line-height:1.2;text-wrap:balance}.tj-demo-renderer-content h1{font-size:clamp(2rem,4vw,2.75rem);letter-spacing:-.03em}.tj-demo-renderer-content h2{font-size:clamp(1.5rem,3vw,2rem);letter-spacing:-.02em}.tj-demo-renderer-content h3{font-size:1.25rem}.tj-demo-renderer-content h4,.tj-demo-renderer-content h5,.tj-demo-renderer-content h6{font-size:1rem}.tj-demo-renderer-content :where(p,ul,ol,blockquote,pre,table,hr){margin:0 0 1.1em}.tj-demo-renderer-content :where(ul,ol){padding-left:1.4em}.tj-demo-renderer-content li+li{margin-top:.3em}.tj-demo-renderer-content a{color:var(--tj-demo-codestyle-color-link, #2563eb);text-decoration-thickness:.08em;text-underline-offset:.18em}.tj-demo-renderer-content a:hover{color:var(--tj-demo-codestyle-color-link-hover, #1d4ed8)}.tj-demo-renderer-content strong{font-weight:700;color:var(--tj-demo-codestyle-color-strong, #020617)}.tj-demo-renderer-content em{color:var(--tj-demo-codestyle-color-emphasis, #334155)}.tj-demo-renderer-content hr{border:0;border-top:1px solid var(--tj-demo-codestyle-color-border, #cbd5e1)}.tj-demo-renderer-content blockquote{padding:.85rem 1rem;border-left:4px solid var(--tj-demo-codestyle-color-quote-border, #94a3b8);border-radius:0 12px 12px 0;background:var(--tj-demo-codestyle-color-quote-bg, #f8fafc);color:var(--tj-demo-codestyle-color-quote-text, #334155)}.tj-demo-renderer-content :where(code,pre){font-family:var(--tj-demo-codestyle-font-mono, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Monaco, monospace)}.tj-demo-renderer-content code{padding:.15em .45em;border:1px solid var(--tj-demo-codestyle-color-inline-code-border, #dbe4f0);border-radius:.45rem;background:var(--tj-demo-codestyle-color-inline-code-bg, #eff6ff);color:var(--tj-demo-codestyle-color-inline-code-text, #1e3a8a);font-size:.92em}.tj-demo-renderer-content pre{overflow-x:auto;padding:1rem 1.1rem;border:1px solid var(--tj-demo-codestyle-color-pre-border, #1e293b);border-radius:14px;background:var(--tj-demo-codestyle-color-pre-bg, #0f172a);color:var(--tj-demo-codestyle-color-pre-text, #e2e8f0);box-shadow:inset 0 1px #ffffff08}.tj-demo-renderer-content pre code{padding:0;border:0;border-radius:0;background:transparent;color:inherit;font-size:.95em}.tj-demo-renderer-content table{width:100%;border-collapse:collapse;overflow:hidden;border:1px solid var(--tj-demo-codestyle-color-border, #cbd5e1);border-radius:12px;background:var(--tj-demo-codestyle-color-table-bg, #fff)}.tj-demo-renderer-content th,.tj-demo-renderer-content td{padding:.75rem .9rem;border-bottom:1px solid var(--tj-demo-codestyle-color-border, #cbd5e1);text-align:left;vertical-align:top}.tj-demo-renderer-content th{background:var(--tj-demo-codestyle-color-table-head-bg, #f8fafc);color:var(--tj-demo-codestyle-color-heading, #020617);font-weight:600}.tj-demo-renderer-content tbody tr:last-child td{border-bottom:0}.tj-demo-renderer-content img,.tj-demo-renderer-content video,.tj-demo-renderer-content canvas,.tj-demo-renderer-content svg{display:block;max-width:100%;height:auto}';
var z, ve, I, y, Xt, Yt, Ge, Zt, Qt, le, Ee, X, Y, re, en, tn;
const E = class E extends C {
  constructor() {
    super(...arguments);
    v(this, y);
    v(this, X);
    v(this, Y);
    ((this.errorMessage = ''),
      x(this, X, (e) => {
        const n = e.error ? d(this, y, Ee).call(this, e.error) : e.message;
        n && d(this, y, le).call(this, n);
      }),
      x(this, Y, (e) => {
        d(this, y, le).call(this, d(this, y, Ee).call(this, e.reason));
      }));
  }
  connectedCallback() {
    var e;
    (super.connectedCallback(),
      p(E, z).add(this),
      d((e = E), re, en).call(e),
      window.addEventListener('error', p(this, X)),
      window.addEventListener('unhandledrejection', p(this, Y)));
  }
  disconnectedCallback() {
    var e;
    (window.removeEventListener('error', p(this, X)),
      window.removeEventListener('unhandledrejection', p(this, Y)),
      p(E, z).delete(this),
      d((e = E), re, tn).call(e),
      super.disconnectedCallback());
  }
  render() {
    return w`
      <slot></slot>
      ${this.errorMessage ? w`<div class="error-indicator">${this.errorMessage}</div>` : null}
    `;
  }
  async showDemo(e) {
    ((this.errorMessage = ''), this.requestUpdate(), this.replaceChildren());
    const n = d(this, y, Qt).call(this, e.css);
    for (const i of n) this.append(d(this, y, Xt).call(this, i));
    const s = document.createElement('div');
    ((s.className = 'tj-demo-renderer-content'), this.append(s));
    try {
      if (typeof e.render == 'function') {
        await e.render(s);
        return;
      }
      if (e.wrapper_html && typeof e.wrapper_html == 'string') {
        const i = document.createElement('div');
        ((i.innerHTML = e.wrapper_html.replace('{{content}}', d(this, y, Yt).call(this, e))),
          s.append(...Array.from(i.childNodes)));
        return;
      }
      if (e.markdown) {
        const i = d(this, y, Ge).call(this, e.markdown);
        s.append(...Array.from(i.childNodes));
        return;
      }
      if (e.html) {
        const i = document.createElement('div');
        ((i.innerHTML = e.html), s.append(...Array.from(i.childNodes)));
        return;
      }
      s.textContent = 'Demo exportiert keine render(root)-Funktion';
    } catch (i) {
      const o = d(this, y, Ee).call(this, i);
      (d(this, y, le).call(this, o), (s.textContent = o));
    }
  }
};
((z = new WeakMap()),
  (ve = new WeakMap()),
  (I = new WeakMap()),
  (y = new WeakSet()),
  (Xt = function (e) {
    if (d(this, y, Zt).call(this, e)) {
      const s = document.createElement('link');
      return ((s.rel = 'stylesheet'), (s.href = e), s);
    }
    const n = document.createElement('style');
    return ((n.textContent = e), n);
  }),
  (Yt = function (e) {
    return typeof e.markdown == 'string' && e.markdown.length > 0
      ? d(this, y, Ge).call(this, e.markdown).innerHTML
      : (e.html ?? '');
  }),
  (Ge = function (e) {
    const n = new Vn();
    return ((n.markdown = e), n.getHTML());
  }),
  (Zt = function (e) {
    const n = e.trim();
    return !n ||
      /[{};]/.test(n) ||
      n.includes(`
`)
      ? !1
      : /^(https?:\/\/|\/|\.\/|\.\.\/)/.test(n) || /\.(css|scss|sass|less|styl|stylus)(\?|#|$)/.test(n);
  }),
  (Qt = function (e) {
    return e === void 0
      ? [wt]
      : e === null
        ? []
        : (Array.isArray(e) ? e : [e])
            .filter((s) => typeof s == 'string')
            .map((s) => s.trim())
            .filter((s) => s.length > 0)
            .map((s) => (s === 'default' ? wt : s));
  }),
  (le = function (e) {
    ((this.errorMessage = e), this.requestUpdate());
  }),
  (Ee = function (e) {
    return e instanceof Error ? e.message || e.name : String(e);
  }),
  (X = new WeakMap()),
  (Y = new WeakMap()),
  (re = new WeakSet()),
  (en = function () {
    p(this, I) ||
      ((console.error = (...e) => {
        var s;
        p(this, ve).call(this, ...e);
        const n = e
          .map((i) => {
            if (i instanceof Error) return i.message || i.name;
            if (typeof i == 'string') return i;
            try {
              return JSON.stringify(i);
            } catch {
              return String(i);
            }
          })
          .filter(Boolean)
          .join(' ');
        if (n) for (const i of p(this, z)) d((s = i), y, le).call(s, n);
      }),
      x(this, I, !0));
  }),
  (tn = function () {
    p(this, z).size > 0 || !p(this, I) || ((console.error = p(this, ve)), x(this, I, !1));
  }),
  v(E, re),
  (E.styles = bn`
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
  v(E, z, new Set()),
  v(E, ve, console.error),
  v(E, I, !1));
let Ve = E;
typeof customElements < 'u' && !customElements.get('tj-demo-renderer') && customElements.define('tj-demo-renderer', Ve);
const Gn =
  ':host{display:block}ul{list-style:none;margin:0;padding:0}.tree,.branch-children{display:grid;gap:4px}.branch-children{margin-left:12px;padding-left:12px;border-left:1px solid #e5e7eb}.toggle,.link{display:flex;align-items:center;gap:8px;width:100%;min-height:36px;padding:8px 10px;border:0;border-radius:8px;background:transparent;color:inherit;font:inherit;text-align:left;text-decoration:none;cursor:pointer}.toggle:hover,.link:hover{background:#f3f4f6}.chevron{width:1em;color:#6b7280;text-align:center;flex:0 0 auto}.label{min-width:0;word-break:break-word}.link{padding-left:28px}.link.active{background:#e0ecff;color:#0f3d91;font-weight:600}';
var K, Xe, nn;
const je = class je extends C {
  constructor() {
    super(...arguments);
    v(this, K);
    ((this.activeHref = ''), (this.expandedKeys = []), (this.forcedExpandedKeys = []));
  }
  render() {
    const e = this.nodes ?? [],
      n = new Set(this.expandedKeys),
      s = new Set(this.forcedExpandedKeys);
    return w`
      <ul class="tree">
        ${e.map((i, o) => d(this, K, Xe).call(this, i, `${o}:${i.name}`, n, s))}
      </ul>
    `;
  }
};
((K = new WeakSet()),
  (Xe = function (e, n, s, i) {
    if ('children' in e) {
      const l = s.has(n) || i.has(n),
        a = e.children ?? [];
      return w`
        <li>
          <button
            class="toggle"
            type="button"
            aria-expanded=${String(l)}
            @click=${() => d(this, K, nn).call(this, n)}
          >
            <span class="chevron">${l ? '▾' : '▸'}</span>
            <span class="label">${e.name}</span>
          </button>

          ${
            l
              ? w`
                <ul class="branch-children">
                  ${a.map((c, h) => d(this, K, Xe).call(this, c, `${n}/${h}:${c.name}`, s, i))}
                </ul>
              `
              : b
          }
        </li>
      `;
    }
    const o = this.activeHref === e.href;
    return w`
      <li>
        <a class=${o ? 'link active' : 'link'} href=${e.href}>${e.name}</a>
      </li>
    `;
  }),
  (nn = function (e) {
    this.dispatchEvent(new CustomEvent('toggle-node', { detail: { key: e }, bubbles: !0, composed: !0 }));
  }),
  (je.properties = {
    nodes: { attribute: !1 },
    activeHref: { attribute: !1 },
    expandedKeys: { attribute: !1 },
    forcedExpandedKeys: { attribute: !1 },
  }),
  (je.styles = [W(Gn)]));
let Je = je;
typeof customElements < 'u' &&
  !customElements.get('tj-demo-viewer-nav-tree') &&
  customElements.define('tj-demo-viewer-nav-tree', Je);
const Jn =
    ':host{--tj-demo-viewer-nav-rail-width: 34px;--tj-demo-viewer-nav-panel-width: 304px;position:fixed;top:0;left:0;z-index:20;display:block;height:100vh;box-sizing:border-box;color:#1f2937;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.shell{display:grid;grid-template-columns:var(--tj-demo-viewer-nav-rail-width) auto;height:100%}.rail{display:grid;grid-template-rows:auto 1fr;justify-items:center;gap:16px;width:var(--tj-demo-viewer-nav-rail-width);height:100%;padding:0;background:#000;color:#fff}.nav-toggle{display:inline-flex;align-items:center;justify-content:center;width:var(--tj-demo-viewer-nav-rail-width);height:var(--tj-demo-viewer-nav-rail-width);padding:0;border:0;border-radius:0;background:transparent;color:inherit;cursor:pointer}.nav-toggle:hover{background:#111827}.nav-toggle-icon{font-size:18px;line-height:1}.rail-content{display:grid;justify-items:center;align-content:start;width:100%;padding:0 8px 12px}.nav-toggle-label{writing-mode:vertical-rl;transform:rotate(180deg);font-size:.9rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.sidebar-wrapper{width:var(--tj-demo-viewer-nav-panel-width);overflow:hidden;border-right:1px solid #e5e7eb;background:#fff;box-shadow:0 0 24px #0f172a14;transition:width .18s ease}.shell.is-closed .sidebar-wrapper{width:0}.panel{width:var(--tj-demo-viewer-nav-panel-width);min-width:0;height:100%;overflow:auto;padding:20px;background:#fff}.panel[hidden]{display:none}nav{display:grid;gap:16px}header{display:grid;gap:6px}h2{margin:0;font-size:1.1rem}p{margin:0;color:#6b7280;font-size:.92rem}',
  $t = 'tj-demo-viewer-nav:expanded',
  Et = 'tj-demo-viewer-nav:open';
var A, B, m, sn, be, ye, rn, Ze, on, an, ln, dn, ke, cn, hn, Ae, Z;
const Oe = class Oe extends C {
  constructor() {
    super();
    v(this, m);
    v(this, A);
    v(this, B);
    v(this, be);
    v(this, ye);
    v(this, Z);
    ((this.activeHref = ''),
      (this.navOpen = !0),
      x(this, A, new Set()),
      x(this, be, () => {
        this.navOpen = !this.navOpen;
      }),
      x(this, ye, (e) => {
        d(this, m, sn).call(this, e.detail.key);
      }),
      x(this, Z, () => {
        this.activeHref = d(this, m, Ae).call(this);
      }),
      x(this, A, d(this, m, on).call(this)),
      (this.activeHref = d(this, m, Ae).call(this)),
      (this.navOpen = d(this, m, ln).call(this)));
  }
  connectedCallback() {
    (super.connectedCallback(),
      (this.activeHref = d(this, m, Ae).call(this)),
      d(this, m, hn).call(this),
      d(this, m, ke).call(this),
      window.addEventListener('hashchange', p(this, Z)));
  }
  disconnectedCallback() {
    var e;
    ((e = p(this, B)) == null || e.disconnect(),
      d(this, m, cn).call(this),
      window.removeEventListener('hashchange', p(this, Z)),
      super.disconnectedCallback());
  }
  updated(e) {
    (super.updated(e), e.has('navOpen') && (d(this, m, dn).call(this), d(this, m, ke).call(this)));
  }
  render() {
    if (!this.data) return w`No Data`;
    const e = d(this, m, rn).call(this, this.data.tree, this.activeHref);
    return w`
      <div class=${this.navOpen ? 'shell is-open' : 'shell is-closed'}>
        <div class="rail">
          <button
            class="nav-toggle"
            type="button"
            aria-label=${this.navOpen ? 'Navigation einklappen' : 'Navigation ausklappen'}
            aria-expanded=${String(this.navOpen)}
            @click=${p(this, be)}
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
                ${this.data.description ? w`<p>${this.data.description}</p>` : b}
              </header>

              <tj-demo-viewer-nav-tree
                .nodes=${this.data.tree}
                .activeHref=${this.activeHref}
                .expandedKeys=${[...p(this, A)]}
                .forcedExpandedKeys=${e}
                @toggle-node=${p(this, ye)}
              ></tj-demo-viewer-nav-tree>
            </nav>
          </div>
        </div>
      </div>
    `;
  }
};
((A = new WeakMap()),
  (B = new WeakMap()),
  (m = new WeakSet()),
  (sn = function (e) {
    (p(this, A).has(e) ? p(this, A).delete(e) : p(this, A).add(e), d(this, m, an).call(this), this.requestUpdate());
  }),
  (be = new WeakMap()),
  (ye = new WeakMap()),
  (rn = function (e, n, s = '') {
    return d(this, m, Ze).call(this, e, n, s) ?? [];
  }),
  (Ze = function (e, n, s = '') {
    for (const [i, o] of e.entries()) {
      const l = s ? `${s}/${i}:${o.name}` : `${i}:${o.name}`;
      if ('children' in o) {
        const a = d(this, m, Ze).call(this, o.children ?? [], n, l);
        if (a) return [l, ...a];
      } else if (o.href === n) return [];
    }
    return null;
  }),
  (on = function () {
    if (typeof sessionStorage > 'u') return new Set();
    try {
      const e = sessionStorage.getItem($t);
      if (!e) return new Set();
      const n = JSON.parse(e);
      return Array.isArray(n) ? new Set(n.filter((s) => typeof s == 'string')) : new Set();
    } catch {
      return new Set();
    }
  }),
  (an = function () {
    if (!(typeof sessionStorage > 'u'))
      try {
        sessionStorage.setItem($t, JSON.stringify([...p(this, A)]));
      } catch {}
  }),
  (ln = function () {
    if (typeof sessionStorage > 'u') return !0;
    try {
      const e = sessionStorage.getItem(Et);
      return e === null ? !0 : e === 'true';
    } catch {
      return !0;
    }
  }),
  (dn = function () {
    if (!(typeof sessionStorage > 'u'))
      try {
        sessionStorage.setItem(Et, String(this.navOpen));
      } catch {}
  }),
  (ke = function () {
    typeof document > 'u' ||
      requestAnimationFrame(() => {
        document.documentElement.style.paddingLeft = `${this.getBoundingClientRect().width}px`;
      });
  }),
  (cn = function () {
    typeof document > 'u' || (document.documentElement.style.paddingLeft = '');
  }),
  (hn = function () {
    var e;
    typeof ResizeObserver > 'u' ||
      ((e = p(this, B)) == null || e.disconnect(),
      x(
        this,
        B,
        new ResizeObserver(() => {
          d(this, m, ke).call(this);
        }),
      ),
      p(this, B).observe(this));
  }),
  (Ae = function () {
    return typeof window > 'u' ? '' : window.location.hash;
  }),
  (Z = new WeakMap()),
  (Oe.properties = { data: { attribute: !1 }, activeHref: { state: !0 }, navOpen: { state: !0 } }),
  (Oe.styles = [W(Jn)]));
let Ye = Oe;
typeof customElements < 'u' &&
  !customElements.get('tj-demo-viewer-nav') &&
  customElements.define('tj-demo-viewer-nav', Ye);
const Ie = '#/demo/';
class kt {
  constructor(t) {
    this.demos = Array.isArray(t) ? [...t] : [];
  }
  getNavData() {
    const t = [];
    for (const e of this.demos) {
      if (!e.filename) continue;
      const n = e.group ? [e.group, e.filename] : e.filename.split('/');
      let s = t;
      for (const [i, o] of n.entries()) {
        if (i === n.length - 1) {
          s.push({ name: this.getDemoLabel(e), href: this.getDemoHref(e.filename) });
          continue;
        }
        let a = s.find((c) => 'children' in c && c.name === o);
        (a || ((a = { name: o, children: [] }), s.push(a)), (s = a.children));
      }
    }
    return { title: 'TDemos', description: 'Gefundene Demo-Dateien', tree: t };
  }
  getDemoByHash(t) {
    if (t.startsWith(Ie))
      try {
        return this.getDemoByFilename(decodeURIComponent(t.slice(Ie.length)));
      } catch {
        return;
      }
  }
  getDemoByFilename(t) {
    return this.demos.find((e) => e.filename === t);
  }
  getDemoHref(t) {
    const e = typeof t == 'string' ? t : (t.filename ?? '');
    return Ie + encodeURIComponent(e);
  }
  getDemoLabel(t) {
    var e;
    return typeof t == 'string'
      ? t.replace(/\.demo\.ts$/, '')
      : t.title
        ? t.title
        : (((e = (t.filename ?? '').split('/').pop()) == null ? void 0 : e.replace(/\.demo\.ts$/, '')) ?? '');
  }
}
const Xn =
    ':host{display:block;color:#111827;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.demo{min-height:100%;background:#f8fafc}.header{display:grid;align-content:end;gap:16px;min-height:200px;padding:48px 24px 20px;background:#000;color:#fff}.header-copy{display:grid;gap:8px}.title{margin:0;font-size:1.5rem;line-height:1.2}.description{margin:0;color:#fffc}.header-extra:empty{display:none}.content{min-width:0;padding:24px}',
  Re = class Re extends C {
    render() {
      var n, s, i;
      const t = ((n = this.data) == null ? void 0 : n.title) ?? '',
        e = ((s = this.data) == null ? void 0 : s.description) ?? '';
      return w`
      <section class="demo">
        <header class="header">
          <div class="header-copy">
            ${t ? w`<h2 class="title">${t}</h2>` : b}
            ${e ? w`<p class="description">${e}</p>` : b}
          </div>

          <div class="header-extra">
            <slot name="header"></slot>
          </div>
        </header>

        <tj-demo-controls .data=${((i = this.data) == null ? void 0 : i.controls) ?? []}>
          <slot name="controls" slot="controls"></slot>
        </tj-demo-controls>
      </section>
    `;
    }
  };
((Re.properties = { data: { attribute: !1 } }), (Re.styles = [W(Xn)]));
let Qe = Re;
typeof customElements < 'u' && !customElements.get('tj-demo') && customElements.define('tj-demo', Qe);
const Yn =
  ':host{display:block;color:#111827;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.viewer{min-height:100%}.content{min-width:0;min-height:100%}';
var Q, ee, te, xe, k, tt, un, pn, fn;
const Le = class Le extends C {
  constructor() {
    super(...arguments);
    v(this, k);
    v(this, Q, []);
    v(this, ee, new kt([]));
    v(this, te, 0);
    v(this, xe, () => {
      this.selectedDemo = d(this, k, tt).call(this);
    });
  }
  set demos(e) {
    (x(this, Q, Array.isArray(e) ? e : []),
      x(this, ee, new kt(p(this, Q))),
      (this.navData = p(this, ee).getNavData()),
      (this.selectedDemo = d(this, k, tt).call(this)),
      this.requestUpdate());
  }
  get demos() {
    return p(this, Q);
  }
  connectedCallback() {
    (super.connectedCallback(),
      window.dispatchEvent(new CustomEvent('tj:viewerReady', { detail: { viewer: this } })),
      window.addEventListener('hashchange', p(this, xe)));
  }
  disconnectedCallback() {
    (window.removeEventListener('hashchange', p(this, xe)), super.disconnectedCallback());
  }
  updated(e) {
    (super.updated(e), (e.has('selectedDemo') || e.has('navData')) && d(this, k, un).call(this));
  }
  render() {
    return w`
      <div class="viewer">
        <tj-demo-viewer-nav .data=${this.navData}></tj-demo-viewer-nav>
        <slot name="controls" slot="controls"></slot>
        <main class="content">
          <tj-demo id="demo" .data=${this.selectedDemo}> </tj-demo>
        </main>
      </div>
    `;
  }
};
((Q = new WeakMap()),
  (ee = new WeakMap()),
  (te = new WeakMap()),
  (xe = new WeakMap()),
  (k = new WeakSet()),
  (tt = function () {
    const e = typeof window > 'u' ? '' : window.location.hash;
    return p(this, ee).getDemoByHash(e);
  }),
  (un = async function () {
    const e = document.querySelector('tj-demo-renderer');
    if (!e) return;
    const n = ++ot(this, te)._;
    if ((d(this, k, fn).call(this), !this.selectedDemo)) {
      await e.showDemo({
        title: 'Demo auswählen',
        render(s) {
          s.textContent = 'Demo auswählen';
        },
      });
      return;
    }
    if (typeof this.selectedDemo.load == 'function') {
      await e.showDemo({
        title: this.selectedDemo.title ?? 'Demo laden',
        render(i) {
          i.textContent = 'Demo wird geladen …';
        },
      });
      const s = await this.selectedDemo.load();
      if (n !== p(this, te)) return;
      this.selectedDemo = s;
      return;
    }
    (await e.showDemo(this.selectedDemo), n === p(this, te) && d(this, k, pn).call(this, this.selectedDemo));
  }),
  (pn = function (e) {
    if (!e.controls_raw_html) return;
    const n = document.createElement('div');
    ((n.slot = 'controls'), (n.dataset.generatedControls = ''), (n.innerHTML = e.controls_raw_html), this.append(n));
  }),
  (fn = function () {
    for (const e of Array.from(this.querySelectorAll('[data-generated-controls]'))) e.remove();
  }),
  (Le.properties = { navData: { state: !0 }, selectedDemo: { state: !0 } }),
  (Le.styles = [W(Yn)]));
let et = Le;
typeof customElements < 'u' && !customElements.get('tj-demo-viewer') && customElements.define('tj-demo-viewer', et);
const Zn = 'modulepreload',
  Qn = function (r, t) {
    return new URL(r, t).href;
  },
  At = {},
  U = function (t, e, n) {
    let s = Promise.resolve();
    if (e && e.length > 0) {
      let o = function (h) {
        return Promise.all(
          h.map((u) =>
            Promise.resolve(u).then(
              (g) => ({ status: 'fulfilled', value: g }),
              (g) => ({ status: 'rejected', reason: g }),
            ),
          ),
        );
      };
      const l = document.getElementsByTagName('link'),
        a = document.querySelector('meta[property=csp-nonce]'),
        c = (a == null ? void 0 : a.nonce) || (a == null ? void 0 : a.getAttribute('nonce'));
      s = o(
        e.map((h) => {
          if (((h = Qn(h, n)), h in At)) return;
          At[h] = !0;
          const u = h.endsWith('.css'),
            g = u ? '[rel="stylesheet"]' : '';
          if (!!n)
            for (let M = l.length - 1; M >= 0; M--) {
              const V = l[M];
              if (V.href === h && (!u || V.rel === 'stylesheet')) return;
            }
          else if (document.querySelector(`link[href="${h}"]${g}`)) return;
          const _ = document.createElement('link');
          if (
            ((_.rel = u ? 'stylesheet' : Zn),
            u || (_.as = 'script'),
            (_.crossOrigin = ''),
            (_.href = h),
            c && _.setAttribute('nonce', c),
            document.head.appendChild(_),
            u)
          )
            return new Promise((M, V) => {
              (_.addEventListener('load', M),
                _.addEventListener('error', () => V(new Error(`Unable to preload CSS for ${h}`))));
            });
        }),
      );
    }
    function i(o) {
      const l = new Event('vite:preloadError', { cancelable: !0 });
      if (((l.payload = o), window.dispatchEvent(l), !l.defaultPrevented)) throw o;
    }
    return s.then((o) => {
      for (const l of o || []) l.status === 'rejected' && i(l.reason);
      return t().catch(i);
    });
  };
function N(r, t) {
  const e = t.default ?? t,
    n = typeof e == 'object' && e !== null ? e : {},
    s = typeof n.render == 'function' ? n.render : typeof t.render == 'function' ? t.render : void 0;
  return { ...n, filename: n.filename ?? r, ...(s ? { render: s } : {}) };
}
const es = [
  {
    filename: 'nextrap-elements/nte-input/demo/01-overview.demo.ts',
    title: '01-overview',
    load: () =>
      U(() => import('./01-overview.demo-d0JYOYuj.js'), __vite__mapDeps([0, 1]), import.meta.url).then((r) =>
        N('nextrap-elements/nte-input/demo/01-overview.demo.ts', r),
      ),
  },
  {
    filename: 'nextrap-elements/nte-input/demo/02-hover-style.demo.ts',
    title: '02-hover-style',
    load: () =>
      U(() => import('./02-hover-style.demo-BHnM2OEA.js'), __vite__mapDeps([2, 1, 3, 4, 5]), import.meta.url).then(
        (r) => N('nextrap-elements/nte-input/demo/02-hover-style.demo.ts', r),
      ),
  },
  {
    filename: 'nextrap-elements/nte-input/demo/03-form-action.demo.ts',
    title: '03-form-action',
    load: () =>
      U(() => import('./03-form-action.demo-JOgqL4a1.js'), __vite__mapDeps([6, 1, 3, 4, 5]), import.meta.url).then(
        (r) => N('nextrap-elements/nte-input/demo/03-form-action.demo.ts', r),
      ),
  },
  {
    filename: 'nextrap-elements/nte-input/demo/04-form-data.demo.ts',
    title: '04-form-data',
    load: () =>
      U(() => import('./04-form-data.demo-DoOIJ7DF.js'), __vite__mapDeps([7, 1, 3, 4, 5]), import.meta.url).then((r) =>
        N('nextrap-elements/nte-input/demo/04-form-data.demo.ts', r),
      ),
  },
  {
    filename: 'nextrap-elements/nte-input/demo/05-validation.demo.ts',
    title: '05-validation',
    load: () =>
      U(() => import('./05-validation.demo-BZwgVZp0.js'), __vite__mapDeps([8, 1, 3, 4, 5]), import.meta.url).then((r) =>
        N('nextrap-elements/nte-input/demo/05-validation.demo.ts', r),
      ),
  },
  {
    filename: 'nextrap-elements/nte-input/demo/06-select-radio-vertical.demo.ts',
    title: '06-select-radio-vertical',
    load: () =>
      U(
        () => import('./06-select-radio-vertical.demo-D2OT2J-_.js'),
        __vite__mapDeps([9, 1, 3, 4, 5]),
        import.meta.url,
      ).then((r) => N('nextrap-elements/nte-input/demo/06-select-radio-vertical.demo.ts', r)),
  },
  {
    filename: 'nextrap-styles/style-button/demo/01-buttons.demo.ts',
    title: '01-buttons',
    load: () =>
      U(() => import('./01-buttons.demo-B-2c-RFl.js'), __vite__mapDeps([10, 1, 11, 5]), import.meta.url).then((r) =>
        N('nextrap-styles/style-button/demo/01-buttons.demo.ts', r),
      ),
  },
];
function Ct() {
  const r = document.querySelector('tj-demo-viewer');
  return r ? ((r.demos = es), !0) : !1;
}
Ct() ||
  window.addEventListener(
    'tj:viewerReady',
    () => {
      Ct();
    },
    { once: !0 },
  );
export { b as A, ne as E, w as b, Ot as f, C as i, W as r, Be as u, G as y };
