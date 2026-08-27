var Jr = Object.defineProperty;
var zn = (i) => {
  throw TypeError(i);
};
var Zr = (i, e, t) => (e in i ? Jr(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : (i[e] = t));
var L = (i, e, t) => Zr(i, typeof e != 'symbol' ? e + '' : e, t),
  At = (i, e, t) => e.has(i) || zn('Cannot ' + t);
var p = (i, e, t) => (At(i, e, 'read from private field'), t ? t.call(i) : e.get(i)),
  v = (i, e, t) =>
    e.has(i) ? zn('Cannot add the same private member more than once') : e instanceof WeakSet ? e.add(i) : e.set(i, t),
  S = (i, e, t, n) => (At(i, e, 'write to private field'), n ? n.call(i, t) : e.set(i, t), t),
  h = (i, e, t) => (At(i, e, 'access private method'), t);
var Vn = (i, e, t, n) => ({
  set _(r) {
    S(i, e, r, t);
  },
  get _() {
    return p(i, e, n);
  },
});
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const ot = globalThis,
  sn =
    ot.ShadowRoot &&
    (ot.ShadyCSS === void 0 || ot.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype,
  on = Symbol(),
  Rn = new WeakMap();
let vi = class {
  constructor(e, t, n) {
    if (((this._$cssResult$ = !0), n !== on))
      throw Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
    ((this.cssText = e), (this.t = t));
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (sn && e === void 0) {
      const n = t !== void 0 && t.length === 1;
      (n && (e = Rn.get(t)),
        e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && Rn.set(t, e)));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const U = (i) => new vi(typeof i == 'string' ? i : i + '', void 0, on),
  Yr = (i, ...e) => {
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
    return new vi(t, i, on);
  },
  Xr = (i, e) => {
    if (sn) i.adoptedStyleSheets = e.map((t) => (t instanceof CSSStyleSheet ? t : t.styleSheet));
    else
      for (const t of e) {
        const n = document.createElement('style'),
          r = ot.litNonce;
        (r !== void 0 && n.setAttribute('nonce', r), (n.textContent = t.cssText), i.appendChild(n));
      }
  },
  Fn = sn
    ? (i) => i
    : (i) =>
        i instanceof CSSStyleSheet
          ? ((e) => {
              let t = '';
              for (const n of e.cssRules) t += n.cssText;
              return U(t);
            })(i)
          : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const {
    is: Qr,
    defineProperty: es,
    getOwnPropertyDescriptor: ts,
    getOwnPropertyNames: ns,
    getOwnPropertySymbols: is,
    getPrototypeOf: rs,
  } = Object,
  Q = globalThis,
  Bn = Q.trustedTypes,
  ss = Bn ? Bn.emptyScript : '',
  St = Q.reactiveElementPolyfillSupport,
  ze = (i, e) => i,
  mt = {
    toAttribute(i, e) {
      switch (e) {
        case Boolean:
          i = i ? ss : null;
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
  an = (i, e) => !Qr(i, e),
  Wn = { attribute: !0, type: String, converter: mt, reflect: !1, useDefault: !1, hasChanged: an };
(Symbol.metadata ?? (Symbol.metadata = Symbol('metadata')),
  Q.litPropertyMetadata ?? (Q.litPropertyMetadata = new WeakMap()));
let re = class extends HTMLElement {
  static addInitializer(e) {
    (this._$Ei(), (this.l ?? (this.l = [])).push(e));
  }
  static get observedAttributes() {
    return (this.finalize(), this._$Eh && [...this._$Eh.keys()]);
  }
  static createProperty(e, t = Wn) {
    if (
      (t.state && (t.attribute = !1),
      this._$Ei(),
      this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0),
      this.elementProperties.set(e, t),
      !t.noAccessor)
    ) {
      const n = Symbol(),
        r = this.getPropertyDescriptor(e, n, t);
      r !== void 0 && es(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, n) {
    const { get: r, set: s } = ts(this.prototype, e) ?? {
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
        const a = r == null ? void 0 : r.call(this);
        (s == null || s.call(this, o), this.requestUpdate(e, a, n));
      },
      configurable: !0,
      enumerable: !0,
    };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Wn;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ze('elementProperties'))) return;
    const e = rs(this);
    (e.finalize(), e.l !== void 0 && (this.l = [...e.l]), (this.elementProperties = new Map(e.elementProperties)));
  }
  static finalize() {
    if (this.hasOwnProperty(ze('finalized'))) return;
    if (((this.finalized = !0), this._$Ei(), this.hasOwnProperty(ze('properties')))) {
      const t = this.properties,
        n = [...ns(t), ...is(t)];
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
      for (const r of n) t.unshift(Fn(r));
    } else e !== void 0 && t.push(Fn(e));
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
    return (Xr(e, this.constructor.elementStyles), e);
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
      const o = (((s = n.converter) == null ? void 0 : s.toAttribute) !== void 0 ? n.converter : mt).toAttribute(
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
      const a = n.getPropertyOptions(r),
        d =
          typeof a.converter == 'function'
            ? { fromAttribute: a.converter }
            : ((s = a.converter) == null ? void 0 : s.fromAttribute) !== void 0
              ? a.converter
              : mt;
      this._$Em = r;
      const c = d.fromAttribute(t, a.type);
      ((this[r] = c ?? ((o = this._$Ej) == null ? void 0 : o.get(r)) ?? c), (this._$Em = null));
    }
  }
  requestUpdate(e, t, n, r = !1, s) {
    var o;
    if (e !== void 0) {
      const a = this.constructor;
      if (
        (r === !1 && (s = this[e]),
        n ?? (n = a.getPropertyOptions(e)),
        !(
          (n.hasChanged ?? an)(s, t) ||
          (n.useDefault &&
            n.reflect &&
            s === ((o = this._$Ej) == null ? void 0 : o.get(e)) &&
            !this.hasAttribute(a._$Eu(e, n)))
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
          const { wrapped: a } = o,
            d = this[s];
          a !== !0 || this._$AL.has(s) || d === void 0 || this.C(s, void 0, o, d);
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
((re.elementStyles = []),
  (re.shadowRootOptions = { mode: 'open' }),
  (re[ze('elementProperties')] = new Map()),
  (re[ze('finalized')] = new Map()),
  St == null || St({ ReactiveElement: re }),
  (Q.reactiveElementVersions ?? (Q.reactiveElementVersions = [])).push('2.1.2'));
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Ve = globalThis,
  qn = (i) => i,
  ft = Ve.trustedTypes,
  Un = ft ? ft.createPolicy('lit-html', { createHTML: (i) => i }) : void 0,
  yi = '$lit$',
  Y = `lit$${Math.random().toFixed(9).slice(2)}$`,
  wi = '?' + Y,
  os = `<${wi}>`,
  ce = document,
  qe = () => ce.createComment(''),
  Ue = (i) => i === null || (typeof i != 'object' && typeof i != 'function'),
  ln = Array.isArray,
  as = (i) => ln(i) || typeof (i == null ? void 0 : i[Symbol.iterator]) == 'function',
  Et = `[ 	
\f\r]`,
  Oe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
  Kn = /-->/g,
  Gn = />/g,
  ne = RegExp(
    `>|${Et}(?:([^\\s"'>=/]+)(${Et}*=${Et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,
    'g',
  ),
  Jn = /'/g,
  Zn = /"/g,
  _i = /^(?:script|style|textarea|title)$/i,
  ls =
    (i) =>
    (e, ...t) => ({ _$litType$: i, strings: e, values: t }),
  A = ls(1),
  ue = Symbol.for('lit-noChange'),
  x = Symbol.for('lit-nothing'),
  Yn = new WeakMap(),
  se = ce.createTreeWalker(ce, 129);
function xi(i, e) {
  if (!ln(i) || !i.hasOwnProperty('raw')) throw Error('invalid template strings array');
  return Un !== void 0 ? Un.createHTML(e) : e;
}
const ds = (i, e) => {
  const t = i.length - 1,
    n = [];
  let r,
    s = e === 2 ? '<svg>' : e === 3 ? '<math>' : '',
    o = Oe;
  for (let a = 0; a < t; a++) {
    const d = i[a];
    let c,
      u,
      l = -1,
      f = 0;
    for (; f < d.length && ((o.lastIndex = f), (u = o.exec(d)), u !== null);)
      ((f = o.lastIndex),
        o === Oe
          ? u[1] === '!--'
            ? (o = Kn)
            : u[1] !== void 0
              ? (o = Gn)
              : u[2] !== void 0
                ? (_i.test(u[2]) && (r = RegExp('</' + u[2], 'g')), (o = ne))
                : u[3] !== void 0 && (o = ne)
          : o === ne
            ? u[0] === '>'
              ? ((o = r ?? Oe), (l = -1))
              : u[1] === void 0
                ? (l = -2)
                : ((l = o.lastIndex - u[2].length), (c = u[1]), (o = u[3] === void 0 ? ne : u[3] === '"' ? Zn : Jn))
            : o === Zn || o === Jn
              ? (o = ne)
              : o === Kn || o === Gn
                ? (o = Oe)
                : ((o = ne), (r = void 0)));
    const m = o === ne && i[a + 1].startsWith('/>') ? ' ' : '';
    s += o === Oe ? d + os : l >= 0 ? (n.push(c), d.slice(0, l) + yi + d.slice(l) + Y + m) : d + Y + (l === -2 ? a : m);
  }
  return [xi(i, s + (i[t] || '<?>') + (e === 2 ? '</svg>' : e === 3 ? '</math>' : '')), n];
};
class Ke {
  constructor({ strings: e, _$litType$: t }, n) {
    let r;
    this.parts = [];
    let s = 0,
      o = 0;
    const a = e.length - 1,
      d = this.parts,
      [c, u] = ds(e, t);
    if (((this.el = Ke.createElement(c, n)), (se.currentNode = this.el.content), t === 2 || t === 3)) {
      const l = this.el.content.firstChild;
      l.replaceWith(...l.childNodes);
    }
    for (; (r = se.nextNode()) !== null && d.length < a;) {
      if (r.nodeType === 1) {
        if (r.hasAttributes())
          for (const l of r.getAttributeNames())
            if (l.endsWith(yi)) {
              const f = u[o++],
                m = r.getAttribute(l).split(Y),
                C = /([.?@])?(.*)/.exec(f);
              (d.push({
                type: 1,
                index: s,
                name: C[2],
                strings: m,
                ctor: C[1] === '.' ? us : C[1] === '?' ? hs : C[1] === '@' ? ps : kt,
              }),
                r.removeAttribute(l));
            } else l.startsWith(Y) && (d.push({ type: 6, index: s }), r.removeAttribute(l));
        if (_i.test(r.tagName)) {
          const l = r.textContent.split(Y),
            f = l.length - 1;
          if (f > 0) {
            r.textContent = ft ? ft.emptyScript : '';
            for (let m = 0; m < f; m++) (r.append(l[m], qe()), se.nextNode(), d.push({ type: 2, index: ++s }));
            r.append(l[f], qe());
          }
        }
      } else if (r.nodeType === 8)
        if (r.data === wi) d.push({ type: 2, index: s });
        else {
          let l = -1;
          for (; (l = r.data.indexOf(Y, l + 1)) !== -1;) (d.push({ type: 7, index: s }), (l += Y.length - 1));
        }
      s++;
    }
  }
  static createElement(e, t) {
    const n = ce.createElement('template');
    return ((n.innerHTML = e), n);
  }
}
function we(i, e, t = i, n) {
  var o, a;
  if (e === ue) return e;
  let r = n !== void 0 ? ((o = t._$Co) == null ? void 0 : o[n]) : t._$Cl;
  const s = Ue(e) ? void 0 : e._$litDirective$;
  return (
    (r == null ? void 0 : r.constructor) !== s &&
      ((a = r == null ? void 0 : r._$AO) == null || a.call(r, !1),
      s === void 0 ? (r = void 0) : ((r = new s(i)), r._$AT(i, t, n)),
      n !== void 0 ? ((t._$Co ?? (t._$Co = []))[n] = r) : (t._$Cl = r)),
    r !== void 0 && (e = we(i, r._$AS(i, e.values), r, n)),
    e
  );
}
class cs {
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
      r = ((e == null ? void 0 : e.creationScope) ?? ce).importNode(t, !0);
    se.currentNode = r;
    let s = se.nextNode(),
      o = 0,
      a = 0,
      d = n[0];
    for (; d !== void 0;) {
      if (o === d.index) {
        let c;
        (d.type === 2
          ? (c = new it(s, s.nextSibling, this, e))
          : d.type === 1
            ? (c = new d.ctor(s, d.name, d.strings, this, e))
            : d.type === 6 && (c = new ms(s, this, e)),
          this._$AV.push(c),
          (d = n[++a]));
      }
      o !== (d == null ? void 0 : d.index) && ((s = se.nextNode()), o++);
    }
    return ((se.currentNode = ce), r);
  }
  p(e) {
    let t = 0;
    for (const n of this._$AV)
      (n !== void 0 && (n.strings !== void 0 ? (n._$AI(e, n, t), (t += n.strings.length - 2)) : n._$AI(e[t])), t++);
  }
}
class it {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, n, r) {
    ((this.type = 2),
      (this._$AH = x),
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
    ((e = we(this, e, t)),
      Ue(e)
        ? e === x || e == null || e === ''
          ? (this._$AH !== x && this._$AR(), (this._$AH = x))
          : e !== this._$AH && e !== ue && this._(e)
        : e._$litType$ !== void 0
          ? this.$(e)
          : e.nodeType !== void 0
            ? this.T(e)
            : as(e)
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
    (this._$AH !== x && Ue(this._$AH) ? (this._$AA.nextSibling.data = e) : this.T(ce.createTextNode(e)),
      (this._$AH = e));
  }
  $(e) {
    var s;
    const { values: t, _$litType$: n } = e,
      r =
        typeof n == 'number'
          ? this._$AC(e)
          : (n.el === void 0 && (n.el = Ke.createElement(xi(n.h, n.h[0]), this.options)), n);
    if (((s = this._$AH) == null ? void 0 : s._$AD) === r) this._$AH.p(t);
    else {
      const o = new cs(r, this),
        a = o.u(this.options);
      (o.p(t), this.T(a), (this._$AH = o));
    }
  }
  _$AC(e) {
    let t = Yn.get(e.strings);
    return (t === void 0 && Yn.set(e.strings, (t = new Ke(e))), t);
  }
  k(e) {
    ln(this._$AH) || ((this._$AH = []), this._$AR());
    const t = this._$AH;
    let n,
      r = 0;
    for (const s of e)
      (r === t.length ? t.push((n = new it(this.O(qe()), this.O(qe()), this, this.options))) : (n = t[r]),
        n._$AI(s),
        r++);
    r < t.length && (this._$AR(n && n._$AB.nextSibling, r), (t.length = r));
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var n;
    for ((n = this._$AP) == null ? void 0 : n.call(this, !1, !0, t); e !== this._$AB;) {
      const r = qn(e).nextSibling;
      (qn(e).remove(), (e = r));
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && ((this._$Cv = e), (t = this._$AP) == null || t.call(this, e));
  }
}
class kt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, n, r, s) {
    ((this.type = 1),
      (this._$AH = x),
      (this._$AN = void 0),
      (this.element = e),
      (this.name = t),
      (this._$AM = r),
      (this.options = s),
      n.length > 2 || n[0] !== '' || n[1] !== ''
        ? ((this._$AH = Array(n.length - 1).fill(new String())), (this.strings = n))
        : (this._$AH = x));
  }
  _$AI(e, t = this, n, r) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) ((e = we(this, e, t, 0)), (o = !Ue(e) || (e !== this._$AH && e !== ue)), o && (this._$AH = e));
    else {
      const a = e;
      let d, c;
      for (e = s[0], d = 0; d < s.length - 1; d++)
        ((c = we(this, a[n + d], t, d)),
          c === ue && (c = this._$AH[d]),
          o || (o = !Ue(c) || c !== this._$AH[d]),
          c === x ? (e = x) : e !== x && (e += (c ?? '') + s[d + 1]),
          (this._$AH[d] = c));
    }
    o && !r && this.j(e);
  }
  j(e) {
    e === x ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? '');
  }
}
class us extends kt {
  constructor() {
    (super(...arguments), (this.type = 3));
  }
  j(e) {
    this.element[this.name] = e === x ? void 0 : e;
  }
}
class hs extends kt {
  constructor() {
    (super(...arguments), (this.type = 4));
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== x);
  }
}
class ps extends kt {
  constructor(e, t, n, r, s) {
    (super(e, t, n, r, s), (this.type = 5));
  }
  _$AI(e, t = this) {
    if ((e = we(this, e, t, 0) ?? x) === ue) return;
    const n = this._$AH,
      r = (e === x && n !== x) || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive,
      s = e !== x && (n === x || r);
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
class ms {
  constructor(e, t, n) {
    ((this.element = e), (this.type = 6), (this._$AN = void 0), (this._$AM = t), (this.options = n));
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    we(this, e);
  }
}
const Ct = Ve.litHtmlPolyfillSupport;
(Ct == null || Ct(Ke, it), (Ve.litHtmlVersions ?? (Ve.litHtmlVersions = [])).push('3.3.3'));
const fs = (i, e, t) => {
  const n = (t == null ? void 0 : t.renderBefore) ?? e;
  let r = n._$litPart$;
  if (r === void 0) {
    const s = (t == null ? void 0 : t.renderBefore) ?? null;
    n._$litPart$ = r = new it(e.insertBefore(qe(), s), s, void 0, t ?? {});
  }
  return (r._$AI(i), r);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const de = globalThis;
let z = class extends re {
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
      (this._$Do = fs(t, this.renderRoot, this.renderOptions)));
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
    return ue;
  }
};
var gi;
((z._$litElement$ = !0),
  (z.finalized = !0),
  (gi = de.litElementHydrateSupport) == null || gi.call(de, { LitElement: z }));
const Mt = de.litElementPolyfillSupport;
Mt == null || Mt({ LitElement: z });
(de.litElementVersions ?? (de.litElementVersions = [])).push('4.2.2');
const bs =
    ':host{--tj-demo-control-gap: 12px}.controls-builtins{display:flex;flex-wrap:wrap;gap:var(--tj-demo-control-gap)}.controls-builtins:empty{display:none}.controls-builtins>button,.controls-builtins>input,.controls-builtins>select,.controls-builtins>textarea,.controls-builtins>*[data-tj-demo-control]{min-height:40px;padding:10px 14px;border:1px solid #94a3b8;border-radius:10px;background:#fff;color:#111827;font:inherit}.controls-builtins>button,.controls-builtins>select{cursor:pointer}.controls-builtins>textarea{min-width:220px;min-height:96px;resize:vertical}',
  gs =
    ':host{--tj-demo-controls-rail-height: 38px;--tj-demo-controls-panel-height: 0px;position:fixed;bottom:0;left:0;width:100vw;z-index:15;display:block;color:#111827;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.shell{display:grid;grid-template-rows:minmax(0,var(--tj-demo-controls-panel-height)) var(--tj-demo-controls-rail-height);align-items:end}.shell.is-closed{grid-template-rows:0 var(--tj-demo-controls-rail-height)}.panel-wrapper{overflow:hidden}.panel{overflow:auto;padding:16px 20px;border-top:1px solid #d1d5db;background:#fffffff5;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 -8px 24px #0f172a14}.shell[hidden],.panel[hidden],:host([hidden]){display:none}.panel-content{display:grid;gap:12px}.slot-wrap.hidden{display:none}.rail{display:grid;grid-template-columns:48px 1fr auto;align-items:center;min-height:var(--tj-demo-controls-rail-height);background:#000;color:#fff}.toggle{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;padding:0;border:0;border-radius:0;background:transparent;color:inherit;cursor:pointer}.toggle:hover{background:#111827}.toggle-icon{font-size:18px;line-height:1}.label{padding:0 12px;font-size:.9rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.actions{display:flex;align-items:center;gap:8px;min-height:48px;padding-right:8px}',
  Xn = 'tj-demo-controls:open';
var K, Ze, w, $i, Ye, Tt, ki, Dt, Ai, Si, Ei, Ci, Nt, Ie, Mi, Te, Oi, me;
const vt = class vt extends z {
  constructor() {
    super();
    v(this, w);
    v(this, K);
    v(this, Ze);
    v(this, Ye);
    v(this, me);
    ((this.controlsOpen = !0),
      (this.hasCustomControls = !1),
      S(this, Ze, () => {
        this.controlsOpen = !this.controlsOpen;
      }),
      S(this, Ye, () => {
        (h(this, w, Tt).call(this), this.requestUpdate());
      }),
      S(this, me, () => {
        (h(this, w, Te).call(this), h(this, w, Ie).call(this));
      }),
      (this.controlsOpen = h(this, w, Si).call(this)));
  }
  connectedCallback() {
    (super.connectedCallback(),
      h(this, w, Ci).call(this),
      h(this, w, Ie).call(this),
      h(this, w, Te).call(this),
      window.addEventListener('resize', p(this, me)));
  }
  disconnectedCallback() {
    var t;
    (window.removeEventListener('resize', p(this, me)),
      (t = p(this, K)) == null || t.disconnect(),
      h(this, w, Mi).call(this),
      h(this, w, Oi).call(this),
      super.disconnectedCallback());
  }
  updated(t) {
    (super.updated(t),
      t.has('data') && h(this, w, Dt).call(this),
      t.has('controlsOpen') && (h(this, w, Ei).call(this), h(this, w, Ie).call(this), h(this, w, Te).call(this)));
  }
  render() {
    return A`
      <div class=${h(this, w, $i).call(this)} ?hidden=${!h(this, w, ki).call(this)}>
        <div class="panel-wrapper">
          <div class="panel" ?hidden=${!this.controlsOpen}>
            <div class="panel-content">
              <div id="builtin-controls" class="controls-builtins"></div>
              <div class=${this.hasCustomControls ? 'slot-wrap' : 'slot-wrap hidden'}>
                <slot name="controls" @slotchange=${p(this, Ye)}></slot>
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
            @click=${p(this, Ze)}
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
    (h(this, w, Tt).call(this), h(this, w, Dt).call(this));
  }
};
((K = new WeakMap()),
  (Ze = new WeakMap()),
  (w = new WeakSet()),
  ($i = function () {
    return `shell ${this.controlsOpen ? 'is-open' : 'is-closed'}`;
  }),
  (Ye = new WeakMap()),
  (Tt = function () {
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
  (ki = function () {
    var t;
    return !!((t = this.data) != null && t.length) || this.hasCustomControls;
  }),
  (Dt = function () {
    const t = this.renderRoot.querySelector('#builtin-controls');
    if (t instanceof HTMLElement) {
      t.replaceChildren();
      for (const n of this.data ?? []) t.append(h(this, w, Ai).call(this, n));
      h(this, w, Nt).call(this);
    }
  }),
  (Ai = function (t) {
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
  (Si = function () {
    if (typeof sessionStorage > 'u') return !0;
    try {
      const t = sessionStorage.getItem(Xn);
      return t === null ? !0 : t === 'true';
    } catch {
      return !0;
    }
  }),
  (Ei = function () {
    if (!(typeof sessionStorage > 'u'))
      try {
        sessionStorage.setItem(Xn, String(this.controlsOpen));
      } catch {}
  }),
  (Ci = function () {
    var t;
    typeof ResizeObserver > 'u' ||
      ((t = p(this, K)) == null || t.disconnect(),
      S(
        this,
        K,
        new ResizeObserver(() => {
          (h(this, w, Nt).call(this), h(this, w, Ie).call(this), h(this, w, Te).call(this));
        }),
      ),
      p(this, K).observe(this),
      typeof document < 'u' &&
        (p(this, K).observe(document.documentElement), document.body && p(this, K).observe(document.body)));
  }),
  (Nt = function () {
    const t = this.renderRoot.querySelector('.panel'),
      n = (t == null ? void 0 : t.scrollHeight) ?? 0;
    this.style.setProperty('--tj-demo-controls-panel-height', `${n}px`);
  }),
  (Ie = function () {
    typeof document > 'u' ||
      requestAnimationFrame(() => {
        document.documentElement.style.paddingBottom = `${this.getBoundingClientRect().height}px`;
      });
  }),
  (Mi = function () {
    typeof document > 'u' || (document.documentElement.style.paddingBottom = '');
  }),
  (Te = function () {
    if (typeof document > 'u') return;
    const t = document.body;
    t &&
      requestAnimationFrame(() => {
        const n = t.getBoundingClientRect();
        ((this.style.left = `${n.left}px`), (this.style.width = `${n.width}px`));
      });
  }),
  (Oi = function () {
    ((this.style.left = ''), (this.style.width = ''));
  }),
  (me = new WeakMap()),
  (vt.properties = { data: { attribute: !1 }, controlsOpen: { state: !0 }, hasCustomControls: { state: !0 } }),
  (vt.styles = [U(bs), U(gs)]));
let It = vt;
typeof customElements < 'u' && !customElements.get('tj-demo-controls') && customElements.define('tj-demo-controls', It);
function J(i) {
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
function Qn(i) {
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
function Z(i, e) {
  for (const t in e) i.setAttribute(t, e[t]);
}
function Li(i) {
  return i.replace(/<[^>]*>/g, '');
}
function vs(i) {
  return Li(i)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-')
    .replace(/^-+|-+$/g, '');
}
function G(i = []) {
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
        const r = Qn(n.kramdown);
        ((r.href = n.href ?? ''), (t += `<a${e(r)}>${G(n.content)}</a>`));
        break;
      }
      case 'image': {
        const r = Qn(n.kramdown);
        ((r.src = n.href ?? ''), (r.alt = Li(G(n.content))), (t += `<img${e(r)}>`));
        break;
      }
    }
  return t;
}
function Ii(i) {
  const e = i.type === 'o-list' ? 'ol' : 'ul',
    t = document.createElement(e),
    n = i.content;
  for (const r of n) {
    if (r.type !== 'list-item') continue;
    const s = document.createElement('li'),
      o = r.content,
      a = [];
    for (const d of o)
      d.type === 'u-list' || d.type === 'o-list'
        ? (a.length && (s.insertAdjacentHTML('beforeend', G(a)), (a.length = 0)), s.appendChild(Ii(d)))
        : a.push(d);
    (a.length && s.insertAdjacentHTML('beforeend', G(a)), t.appendChild(s));
  }
  return t;
}
function ys(i) {
  const e = document.createElement('table'),
    t = J(i);
  Z(e, t);
  const n = i.children;
  let r = 0;
  const s = (o, a) => {
    const d = document.createElement('tr');
    return (
      o.forEach((c) => {
        const u = document.createElement(a);
        ((u.innerHTML = G(c.content)), d.appendChild(u));
      }),
      d
    );
  };
  for (const o of n) {
    if (o.type === 'table-head') {
      const a = document.createElement('thead'),
        d = s(o.content, 'th');
      ((r = o.content.length), a.appendChild(d), e.appendChild(a));
    }
    if (o.type === 'table-body') {
      const a = document.createElement('tbody'),
        d = o.content;
      r === 0 && d.length && (r = d.length);
      for (let c = 0; c < d.length; c += r || 1) {
        const u = d.slice(c, c + r || void 0);
        a.appendChild(s(u, 'td'));
      }
      e.appendChild(a);
    }
  }
  return e;
}
function ws(i) {
  var t;
  const e = document.createElement('div');
  for (const n of i) {
    switch (n.type) {
      case 'heading': {
        const r = n.heading_level ?? 1,
          s = document.createElement('h' + r),
          o = J(n),
          a = G(n.children);
        if (!o.id) {
          const d = vs(a);
          d !== '' && (o.id = d);
        }
        (Z(s, o), (s.innerHTML = a), e.appendChild(s));
        break;
      }
      case 'hr': {
        const r = document.createElement('hr');
        (Z(r, J(n)), e.appendChild(r));
        break;
      }
      case 'paragraph': {
        const r = document.createElement('p');
        (Z(r, J(n)), n.children && n.children.length && (r.innerHTML = G(n.children)), e.appendChild(r));
        break;
      }
      case 'list': {
        const r = n.children;
        if (!r || r.length === 0) break;
        for (const s of r) {
          if (s.type !== 'u-list' && s.type !== 'o-list') continue;
          const o = Ii(s);
          (Z(o, J(n)), e.appendChild(o));
        }
        break;
      }
      case 'table': {
        const r = ys(n);
        e.appendChild(r);
        break;
      }
      case 'code': {
        const r = document.createElement('pre'),
          s = document.createElement('code');
        (Z(r, J(n)),
          (s.textContent = n.children[0].content),
          (t = n.children) != null && t[0].lang && s.setAttribute('class', `language-${n.children[0].lang}`),
          r.appendChild(s),
          e.appendChild(r));
        break;
      }
      case 'quote': {
        const r = document.createElement('blockquote'),
          s = document.createElement('p');
        (Z(r, J(n)),
          n.children && n.children.length && (s.innerHTML = G(n.children)),
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
        (Z(r, J(n)), n.children && n.children.length && (r.innerHTML = G(n.children)), e.appendChild(r));
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
var at = ((i) => ((i[(i.Include = 0)] = 'Include'), (i[(i.Exclude = 1)] = 'Exclude'), (i[(i.Peek = 2)] = 'Peek'), i))(
  at || {},
);
const _s = { stringDelimiters: ['"', "'"] };
class Ti {
  constructor(e) {
    L(this, '_string', '');
    L(this, '_index', 0);
    L(this, '_curLine', 0);
    L(this, '_curColumn', 0);
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
  readPrimitive(e = _s) {
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
class Di {
  constructor(e, t = 1) {
    L(this, '_line');
    L(this, '_index', 0);
    L(this, 'lineNumber');
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
      const a = Array.isArray(e) ? e.map((d) => this.escapeRegExp(d)).join('|') : this.escapeRegExp(e);
      n = new RegExp(a, 's');
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
function Ni(i) {
  var n;
  const e = new Di(i),
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
function ji(i) {
  const e = i.readExpression(['[', '![']);
  if (e === null) return { type: 'text', content: Pi(i.readUntil(']')) };
  const t = { type: null };
  if (((t.type = e === '[' ? 'link' : 'image'), (t.content = []), i.peekChar() !== ']')) {
    const n = ji(i);
    t.content = [n];
  }
  if ((i.readChar(), i.peekChar() !== '(')) return { type: 'text', content: t.content };
  if ((i.readChar(), (t.href = i.readUntil(')')), i.readChar(), i.peek() === '{')) {
    const n = Ni(i.line.substring(i.index));
    ((t.kramdown = n.elements), (i.index += n.kramdown_length));
  }
  return t;
}
function Pi(i) {
  return i
    .replace(new RegExp('(?<!\\*)\\*\\*\\*([^\\n]+?)\\*\\*\\*', 'g'), '<strong><em>$1</em></strong>')
    .replace(new RegExp('(?<!\\*)\\*\\*([\\s\\S]+?)\\*\\*', 'g'), '<strong>$1</strong>')
    .replace(new RegExp('(?<!\\*)\\*([\\s\\S]+?)\\*', 'g'), '<em>$1</em>')
    .replace(/__([\s\S]+?)__/g, '<strong>$1</strong>')
    .replace(/_([\s\S]+?)_/g, '<em>$1</em>')
    .replace(/`([\s\S]+?)`/g, '<code>$1</code>')
    .replace(/~~([\s\S]+?)~~/g, '<del>$1</del>');
}
function Re(i) {
  const e = [],
    t = new Di(i);
  for (; t.more();) {
    const n = t.readUntilPeek(['[', '!['], !0);
    (n.value !== '' && e.push({ type: 'text', content: Pi(n.value) }), n.peek !== !1 && e.push(ji(t)));
  }
  return e;
}
function xs(i) {
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
    .map((d) => d.trim())
    .filter((d) => d !== '');
  if (e.length === 0) return [];
  const t = /^:?-{3,}:?(?:\s*\|\s*:?-{3,}:?)*\s*$/;
  let n = null,
    r = 0;
  const s = (d) => (d.startsWith('|') && (d = d.slice(1)), d.endsWith('|') && (d = d.slice(0, -1)), d.trim());
  e.length >= 2 && t.test(s(e[1])) && ((n = ei(e[0])), (r = 2));
  const o = [];
  n && o.push({ type: 'table-head', content: n.map((d) => ti(d.trim())) });
  const a = [];
  for (let d = r; d < e.length; d++) ei(e[d]).forEach((u) => a.push(ti(u.trim())));
  return (o.push({ type: 'table-body', content: a }), o);
}
function ei(i) {
  return (
    i.startsWith('|') && (i = i.slice(1)),
    i.endsWith('|') && (i = i.slice(0, -1)),
    i.split('|').map((e) => e.trim())
  );
}
function ti(i) {
  return { type: 'table-cell', content: Re(i) };
}
function $s(i) {
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
  function s(o, a, d) {
    for (; n.length > 0;) {
      const u = n[n.length - 1];
      if (u.indent === o) {
        if (u.element.type === a && u.element.__marker === d) return u.element;
        n.pop();
        continue;
      }
      if (u.indent > o) {
        n.pop();
        continue;
      }
      break;
    }
    const c = { type: a, content: [] };
    if (((c.__marker = d), n.length === 0)) t.push(c);
    else {
      const l = n[n.length - 1].element.content;
      l.length === 0 && l.push({ type: 'list-item', content: [] });
      const f = l[l.length - 1];
      (Array.isArray(f.content) || (f.content = []), f.content.push(c));
    }
    return (n.push({ element: c, indent: o }), c);
  }
  for (const o of e) {
    const a = o.match(r);
    if (!a) {
      if (n.length > 0) {
        const D = n[n.length - 1].element.content;
        if (D.length > 0) {
          const g = D[D.length - 1];
          (Array.isArray(g.content) || (g.content = []), g.content.push({ type: 'text', content: o.trim() }));
        }
      }
      continue;
    }
    const d = a[1] || '',
      c = a[2],
      u = /\d+\./.test(c),
      l = u ? 'o-list' : 'u-list',
      f = a[4],
      m = u ? 'o' : c,
      C = d.replace(/\t/g, '    ').length,
      H = Math.floor(C / 2),
      B = s(H, l, m),
      te = { type: 'list-item', content: Re(f) };
    B.content.push(te);
  }
  return t;
}
function ks(i) {
  const e = new Ti(i);
  let t = [],
    n = !0;
  for (; e.hasMore();) {
    let r = e.readUntil(/\n\n(```|<!--|\S)/m, at.Peek);
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
        ((s += e.readUntil('```', at.Include).content), t.push(s));
        break;
      case `

<!--`:
        t.push(e.readUntil('-->', at.Include).content);
        break;
      default:
        e.read(2);
        break;
    }
  }
  return t;
}
function As(i) {
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
    t = ks(i);
  let n = '';
  for (const r of t) {
    if (r === '') continue;
    if (r.trim() === '') {
      n += r;
      continue;
    }
    const s = new Ti(r),
      o = { type: null, pre_whitespace: n + s.readWhiteSpace(), content_raw: s.rest, post_whitespace: '' };
    n = '';
    let a = s.rest;
    const d = a.match(/^(.*)\n(\{:[^\n]*\})(\s*)$/s);
    if (d) {
      const [, l, f, m] = d;
      ((o.kramdown = Ni(f).elements), (o.post_whitespace = m), (a = l));
    }
    const c = a.split(`
`);
    switch (s.peek(['<!--', '```', '---', '#', '-', '*', '+', '|', '<', '>'])) {
      case '<!--':
        ((o.type = 'comment'), (a = a.substring(4, a.length - 3)), (o.children = [{ type: 'text', content: a }]));
        break;
      case '---':
        o.type = 'hr';
        break;
      case '```':
        o.type = 'code';
        let l = c[0].substring(3).trim();
        (c.shift(),
          c[c.length - 1].endsWith('```') && c.pop(),
          (o.children = [
            {
              type: 'text',
              content: c.join(`
`),
              lang: l,
            },
          ]));
        break;
      case '#':
        ((o.type = 'heading'),
          (o.heading_level = a.split(' ')[0].length),
          (o.children = Re(a.substring(o.heading_level).trim())));
        break;
      case '-':
      case '+':
        ((o.type = 'list'), (o.children = $s(o)));
        break;
      case '|':
        ((o.type = 'table'), (o.children = xs(o)));
        break;
      case '<':
        ((o.type = 'html'), (o.children = [{ type: 'html', content: a }]));
        break;
      case '>':
        ((o.type = 'quote'),
          (a = a
            .split(
              `
`,
            )
            .map((f) => f.replace(/^>\s*/, '')).join(`
`)),
          (o.children = Re(a)));
        break;
      default:
        ((o.type = 'paragraph'), (o.children = Re(a)));
    }
    e.push(o);
  }
  return (n !== '' && e.push({ type: 'whitespace', pre_whitespace: n }), e);
}
class Ss {
  constructor() {
    L(this, '_ast', []);
  }
  set markdown(e) {
    this._ast = As(e);
  }
  getHTML() {
    return ws(this._ast);
  }
}
const ni =
  'body{margin:0}.tj-demo-renderer-content{padding:15px;color:var(--tj-demo-codestyle-color-text, #0f172a);font:var(--tj-demo-codestyle-font, 15px/1.65 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);text-wrap:pretty}.tj-demo-renderer-content>:first-child{margin-top:0}.tj-demo-renderer-content>:last-child{margin-bottom:0}.tj-demo-renderer-content :where(h1,h2,h3,h4,h5,h6){margin:1.6em 0 .6em;color:var(--tj-demo-codestyle-color-heading, #020617);font-weight:700;line-height:1.2;text-wrap:balance}.tj-demo-renderer-content h1{font-size:clamp(2rem,4vw,2.75rem);letter-spacing:-.03em}.tj-demo-renderer-content h2{font-size:clamp(1.5rem,3vw,2rem);letter-spacing:-.02em}.tj-demo-renderer-content h3{font-size:1.25rem}.tj-demo-renderer-content h4,.tj-demo-renderer-content h5,.tj-demo-renderer-content h6{font-size:1rem}.tj-demo-renderer-content :where(p,ul,ol,blockquote,pre,table,hr){margin:0 0 1.1em}.tj-demo-renderer-content :where(ul,ol){padding-left:1.4em}.tj-demo-renderer-content li+li{margin-top:.3em}.tj-demo-renderer-content a{color:var(--tj-demo-codestyle-color-link, #2563eb);text-decoration-thickness:.08em;text-underline-offset:.18em}.tj-demo-renderer-content a:hover{color:var(--tj-demo-codestyle-color-link-hover, #1d4ed8)}.tj-demo-renderer-content strong{font-weight:700;color:var(--tj-demo-codestyle-color-strong, #020617)}.tj-demo-renderer-content em{color:var(--tj-demo-codestyle-color-emphasis, #334155)}.tj-demo-renderer-content hr{border:0;border-top:1px solid var(--tj-demo-codestyle-color-border, #cbd5e1)}.tj-demo-renderer-content blockquote{padding:.85rem 1rem;border-left:4px solid var(--tj-demo-codestyle-color-quote-border, #94a3b8);border-radius:0 12px 12px 0;background:var(--tj-demo-codestyle-color-quote-bg, #f8fafc);color:var(--tj-demo-codestyle-color-quote-text, #334155)}.tj-demo-renderer-content :where(code,pre){font-family:var(--tj-demo-codestyle-font-mono, "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Monaco, monospace)}.tj-demo-renderer-content code{padding:.15em .45em;border:1px solid var(--tj-demo-codestyle-color-inline-code-border, #dbe4f0);border-radius:.45rem;background:var(--tj-demo-codestyle-color-inline-code-bg, #eff6ff);color:var(--tj-demo-codestyle-color-inline-code-text, #1e3a8a);font-size:.92em}.tj-demo-renderer-content pre{overflow-x:auto;padding:1rem 1.1rem;border:1px solid var(--tj-demo-codestyle-color-pre-border, #1e293b);border-radius:14px;background:var(--tj-demo-codestyle-color-pre-bg, #0f172a);color:var(--tj-demo-codestyle-color-pre-text, #e2e8f0);box-shadow:inset 0 1px #ffffff08}.tj-demo-renderer-content pre code{padding:0;border:0;border-radius:0;background:transparent;color:inherit;font-size:.95em}.tj-demo-renderer-content table{width:100%;border-collapse:collapse;overflow:hidden;border:1px solid var(--tj-demo-codestyle-color-border, #cbd5e1);border-radius:12px;background:var(--tj-demo-codestyle-color-table-bg, #fff)}.tj-demo-renderer-content th,.tj-demo-renderer-content td{padding:.75rem .9rem;border-bottom:1px solid var(--tj-demo-codestyle-color-border, #cbd5e1);text-align:left;vertical-align:top}.tj-demo-renderer-content th{background:var(--tj-demo-codestyle-color-table-head-bg, #f8fafc);color:var(--tj-demo-codestyle-color-heading, #020617);font-weight:600}.tj-demo-renderer-content tbody tr:last-child td{border-bottom:0}.tj-demo-renderer-content img,.tj-demo-renderer-content video,.tj-demo-renderer-content canvas,.tj-demo-renderer-content svg{display:block;max-width:100%;height:auto}';
var oe, Xe, ae, M, Hi, zi, Pt, Vi, Ri, De, lt, fe, be, ke, Fi, Bi;
const R = class R extends z {
  constructor() {
    super(...arguments);
    v(this, M);
    v(this, fe);
    v(this, be);
    ((this.errorMessage = ''),
      S(this, fe, (t) => {
        const n = t.error ? h(this, M, lt).call(this, t.error) : t.message;
        n && h(this, M, De).call(this, n);
      }),
      S(this, be, (t) => {
        h(this, M, De).call(this, h(this, M, lt).call(this, t.reason));
      }));
  }
  connectedCallback() {
    var t;
    (super.connectedCallback(),
      p(R, oe).add(this),
      h((t = R), ke, Fi).call(t),
      window.addEventListener('error', p(this, fe)),
      window.addEventListener('unhandledrejection', p(this, be)));
  }
  disconnectedCallback() {
    var t;
    (window.removeEventListener('error', p(this, fe)),
      window.removeEventListener('unhandledrejection', p(this, be)),
      p(R, oe).delete(this),
      h((t = R), ke, Bi).call(t),
      super.disconnectedCallback());
  }
  render() {
    return A`
      <slot></slot>
      ${this.errorMessage ? A`<div class="error-indicator">${this.errorMessage}</div>` : null}
    `;
  }
  async showDemo(t) {
    ((this.errorMessage = ''), this.requestUpdate(), this.replaceChildren());
    const n = h(this, M, Ri).call(this, t.css);
    for (const s of n) this.append(h(this, M, Hi).call(this, s));
    const r = document.createElement('div');
    ((r.className = 'tj-demo-renderer-content'), this.append(r));
    try {
      if (typeof t.render == 'function') {
        await t.render(r);
        return;
      }
      if (t.wrapper_html && typeof t.wrapper_html == 'string') {
        const s = document.createElement('div');
        ((s.innerHTML = t.wrapper_html.replace('{{content}}', h(this, M, zi).call(this, t))),
          r.append(...Array.from(s.childNodes)));
        return;
      }
      if (t.markdown) {
        const s = h(this, M, Pt).call(this, t.markdown);
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
      const o = h(this, M, lt).call(this, s);
      (h(this, M, De).call(this, o), (r.textContent = o));
    }
  }
};
((oe = new WeakMap()),
  (Xe = new WeakMap()),
  (ae = new WeakMap()),
  (M = new WeakSet()),
  (Hi = function (t) {
    if (h(this, M, Vi).call(this, t)) {
      const r = document.createElement('link');
      return ((r.rel = 'stylesheet'), (r.href = t), r);
    }
    const n = document.createElement('style');
    return ((n.textContent = t), n);
  }),
  (zi = function (t) {
    return typeof t.markdown == 'string' && t.markdown.length > 0
      ? h(this, M, Pt).call(this, t.markdown).innerHTML
      : (t.html ?? '');
  }),
  (Pt = function (t) {
    const n = new Ss();
    return ((n.markdown = t), n.getHTML());
  }),
  (Vi = function (t) {
    const n = t.trim();
    return !n ||
      /[{};]/.test(n) ||
      n.includes(`
`)
      ? !1
      : /^(https?:\/\/|\/|\.\/|\.\.\/)/.test(n) || /\.(css|scss|sass|less|styl|stylus)(\?|#|$)/.test(n);
  }),
  (Ri = function (t) {
    return t === void 0
      ? [ni]
      : t === null
        ? []
        : (Array.isArray(t) ? t : [t])
            .filter((r) => typeof r == 'string')
            .map((r) => r.trim())
            .filter((r) => r.length > 0)
            .map((r) => (r === 'default' ? ni : r));
  }),
  (De = function (t) {
    ((this.errorMessage = t), this.requestUpdate());
  }),
  (lt = function (t) {
    return t instanceof Error ? t.message || t.name : String(t);
  }),
  (fe = new WeakMap()),
  (be = new WeakMap()),
  (ke = new WeakSet()),
  (Fi = function () {
    p(this, ae) ||
      ((console.error = (...t) => {
        var r;
        p(this, Xe).call(this, ...t);
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
        if (n) for (const s of p(this, oe)) h((r = s), M, De).call(r, n);
      }),
      S(this, ae, !0));
  }),
  (Bi = function () {
    p(this, oe).size > 0 || !p(this, ae) || ((console.error = p(this, Xe)), S(this, ae, !1));
  }),
  v(R, ke),
  (R.styles = Yr`
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
  v(R, oe, new Set()),
  v(R, Xe, console.error),
  v(R, ae, !1));
let jt = R;
typeof customElements < 'u' && !customElements.get('tj-demo-renderer') && customElements.define('tj-demo-renderer', jt);
const Es =
  ':host{display:block}ul{list-style:none;margin:0;padding:0}.tree,.branch-children{display:grid;gap:4px}.branch-children{margin-left:12px;padding-left:12px;border-left:1px solid #e5e7eb}.toggle,.link{display:flex;align-items:center;gap:8px;width:100%;min-height:36px;padding:8px 10px;border:0;border-radius:8px;background:transparent;color:inherit;font:inherit;text-align:left;text-decoration:none;cursor:pointer}.toggle:hover,.link:hover{background:#f3f4f6}.chevron{width:1em;color:#6b7280;text-align:center;flex:0 0 auto}.label{min-width:0;word-break:break-word}.link{padding-left:28px}.link.active{background:#e0ecff;color:#0f3d91;font-weight:600}';
var he, zt, Wi;
const yt = class yt extends z {
  constructor() {
    super(...arguments);
    v(this, he);
    ((this.activeHref = ''), (this.expandedKeys = []), (this.forcedExpandedKeys = []));
  }
  render() {
    const t = this.nodes ?? [],
      n = new Set(this.expandedKeys),
      r = new Set(this.forcedExpandedKeys);
    return A`
      <ul class="tree">
        ${t.map((s, o) => h(this, he, zt).call(this, s, `${o}:${s.name}`, n, r))}
      </ul>
    `;
  }
};
((he = new WeakSet()),
  (zt = function (t, n, r, s) {
    if ('children' in t) {
      const a = r.has(n) || s.has(n),
        d = t.children ?? [];
      return A`
        <li>
          <button
            class="toggle"
            type="button"
            aria-expanded=${String(a)}
            @click=${() => h(this, he, Wi).call(this, n)}
          >
            <span class="chevron">${a ? '▾' : '▸'}</span>
            <span class="label">${t.name}</span>
          </button>

          ${
            a
              ? A`
                <ul class="branch-children">
                  ${d.map((c, u) => h(this, he, zt).call(this, c, `${n}/${u}:${c.name}`, r, s))}
                </ul>
              `
              : x
          }
        </li>
      `;
    }
    const o = this.activeHref === t.href;
    return A`
      <li>
        <a class=${o ? 'link active' : 'link'} href=${t.href}>${t.name}</a>
      </li>
    `;
  }),
  (Wi = function (t) {
    this.dispatchEvent(new CustomEvent('toggle-node', { detail: { key: t }, bubbles: !0, composed: !0 }));
  }),
  (yt.properties = {
    nodes: { attribute: !1 },
    activeHref: { attribute: !1 },
    expandedKeys: { attribute: !1 },
    forcedExpandedKeys: { attribute: !1 },
  }),
  (yt.styles = [U(Es)]));
let Ht = yt;
typeof customElements < 'u' &&
  !customElements.get('tj-demo-viewer-nav-tree') &&
  customElements.define('tj-demo-viewer-nav-tree', Ht);
const Cs =
    ':host{--tj-demo-viewer-nav-rail-width: 34px;--tj-demo-viewer-nav-panel-width: 304px;position:fixed;top:0;left:0;z-index:20;display:block;height:100vh;box-sizing:border-box;color:#1f2937;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.shell{display:grid;grid-template-columns:var(--tj-demo-viewer-nav-rail-width) auto;height:100%}.rail{display:grid;grid-template-rows:auto 1fr;justify-items:center;gap:16px;width:var(--tj-demo-viewer-nav-rail-width);height:100%;padding:0;background:#000;color:#fff}.nav-toggle{display:inline-flex;align-items:center;justify-content:center;width:var(--tj-demo-viewer-nav-rail-width);height:var(--tj-demo-viewer-nav-rail-width);padding:0;border:0;border-radius:0;background:transparent;color:inherit;cursor:pointer}.nav-toggle:hover{background:#111827}.nav-toggle-icon{font-size:18px;line-height:1}.rail-content{display:grid;justify-items:center;align-content:start;width:100%;padding:0 8px 12px}.nav-toggle-label{writing-mode:vertical-rl;transform:rotate(180deg);font-size:.9rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.sidebar-wrapper{width:var(--tj-demo-viewer-nav-panel-width);overflow:hidden;border-right:1px solid #e5e7eb;background:#fff;box-shadow:0 0 24px #0f172a14;transition:width .18s ease}.shell.is-closed .sidebar-wrapper{width:0}.panel{width:var(--tj-demo-viewer-nav-panel-width);min-width:0;height:100%;overflow:auto;padding:20px;background:#fff}.panel[hidden]{display:none}nav{display:grid;gap:16px}header{display:grid;gap:6px}h2{margin:0;font-size:1.1rem}p{margin:0;color:#6b7280;font-size:.92rem}',
  ii = 'tj-demo-viewer-nav:expanded',
  ri = 'tj-demo-viewer-nav:open';
var q, le, $, qi, Qe, et, Ui, Rt, Ki, Gi, Ji, Zi, dt, Yi, Xi, ct, ge;
const wt = class wt extends z {
  constructor() {
    super();
    v(this, $);
    v(this, q);
    v(this, le);
    v(this, Qe);
    v(this, et);
    v(this, ge);
    ((this.activeHref = ''),
      (this.navOpen = !0),
      S(this, q, new Set()),
      S(this, Qe, () => {
        this.navOpen = !this.navOpen;
      }),
      S(this, et, (t) => {
        h(this, $, qi).call(this, t.detail.key);
      }),
      S(this, ge, () => {
        this.activeHref = h(this, $, ct).call(this);
      }),
      S(this, q, h(this, $, Ki).call(this)),
      (this.activeHref = h(this, $, ct).call(this)),
      (this.navOpen = h(this, $, Ji).call(this)));
  }
  connectedCallback() {
    (super.connectedCallback(),
      (this.activeHref = h(this, $, ct).call(this)),
      h(this, $, Xi).call(this),
      h(this, $, dt).call(this),
      window.addEventListener('hashchange', p(this, ge)));
  }
  disconnectedCallback() {
    var t;
    ((t = p(this, le)) == null || t.disconnect(),
      h(this, $, Yi).call(this),
      window.removeEventListener('hashchange', p(this, ge)),
      super.disconnectedCallback());
  }
  updated(t) {
    (super.updated(t), t.has('navOpen') && (h(this, $, Zi).call(this), h(this, $, dt).call(this)));
  }
  render() {
    if (!this.data) return A`No Data`;
    const t = h(this, $, Ui).call(this, this.data.tree, this.activeHref);
    return A`
      <div class=${this.navOpen ? 'shell is-open' : 'shell is-closed'}>
        <div class="rail">
          <button
            class="nav-toggle"
            type="button"
            aria-label=${this.navOpen ? 'Navigation einklappen' : 'Navigation ausklappen'}
            aria-expanded=${String(this.navOpen)}
            @click=${p(this, Qe)}
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
                ${this.data.description ? A`<p>${this.data.description}</p>` : x}
              </header>

              <tj-demo-viewer-nav-tree
                .nodes=${this.data.tree}
                .activeHref=${this.activeHref}
                .expandedKeys=${[...p(this, q)]}
                .forcedExpandedKeys=${t}
                @toggle-node=${p(this, et)}
              ></tj-demo-viewer-nav-tree>
            </nav>
          </div>
        </div>
      </div>
    `;
  }
};
((q = new WeakMap()),
  (le = new WeakMap()),
  ($ = new WeakSet()),
  (qi = function (t) {
    (p(this, q).has(t) ? p(this, q).delete(t) : p(this, q).add(t), h(this, $, Gi).call(this), this.requestUpdate());
  }),
  (Qe = new WeakMap()),
  (et = new WeakMap()),
  (Ui = function (t, n, r = '') {
    return h(this, $, Rt).call(this, t, n, r) ?? [];
  }),
  (Rt = function (t, n, r = '') {
    for (const [s, o] of t.entries()) {
      const a = r ? `${r}/${s}:${o.name}` : `${s}:${o.name}`;
      if ('children' in o) {
        const d = h(this, $, Rt).call(this, o.children ?? [], n, a);
        if (d) return [a, ...d];
      } else if (o.href === n) return [];
    }
    return null;
  }),
  (Ki = function () {
    if (typeof sessionStorage > 'u') return new Set();
    try {
      const t = sessionStorage.getItem(ii);
      if (!t) return new Set();
      const n = JSON.parse(t);
      return Array.isArray(n) ? new Set(n.filter((r) => typeof r == 'string')) : new Set();
    } catch {
      return new Set();
    }
  }),
  (Gi = function () {
    if (!(typeof sessionStorage > 'u'))
      try {
        sessionStorage.setItem(ii, JSON.stringify([...p(this, q)]));
      } catch {}
  }),
  (Ji = function () {
    if (typeof sessionStorage > 'u') return !0;
    try {
      const t = sessionStorage.getItem(ri);
      return t === null ? !0 : t === 'true';
    } catch {
      return !0;
    }
  }),
  (Zi = function () {
    if (!(typeof sessionStorage > 'u'))
      try {
        sessionStorage.setItem(ri, String(this.navOpen));
      } catch {}
  }),
  (dt = function () {
    typeof document > 'u' ||
      requestAnimationFrame(() => {
        document.documentElement.style.paddingLeft = `${this.getBoundingClientRect().width}px`;
      });
  }),
  (Yi = function () {
    typeof document > 'u' || (document.documentElement.style.paddingLeft = '');
  }),
  (Xi = function () {
    var t;
    typeof ResizeObserver > 'u' ||
      ((t = p(this, le)) == null || t.disconnect(),
      S(
        this,
        le,
        new ResizeObserver(() => {
          h(this, $, dt).call(this);
        }),
      ),
      p(this, le).observe(this));
  }),
  (ct = function () {
    return typeof window > 'u' ? '' : window.location.hash;
  }),
  (ge = new WeakMap()),
  (wt.properties = { data: { attribute: !1 }, activeHref: { state: !0 }, navOpen: { state: !0 } }),
  (wt.styles = [U(Cs)]));
let Vt = wt;
typeof customElements < 'u' &&
  !customElements.get('tj-demo-viewer-nav') &&
  customElements.define('tj-demo-viewer-nav', Vt);
const Ot = '#/demo/';
class si {
  constructor(e) {
    this.demos = Array.isArray(e) ? [...e] : [];
  }
  getNavData() {
    const e = [];
    for (const t of this.demos) {
      if (!t.filename) continue;
      const n = t.filename.split('/');
      let r = e;
      for (const [s, o] of n.entries()) {
        if (s === n.length - 1) {
          r.push({ name: this.getDemoLabel(o), href: this.getDemoHref(t.filename) });
          continue;
        }
        let d = r.find((c) => 'children' in c && c.name === o);
        (d || ((d = { name: o, children: [] }), r.push(d)), (r = d.children));
      }
    }
    return { title: 'TDemos', description: 'Gefundene Demo-Dateien', tree: e };
  }
  getDemoByHash(e) {
    if (e.startsWith(Ot))
      try {
        return this.getDemoByFilename(decodeURIComponent(e.slice(Ot.length)));
      } catch {
        return;
      }
  }
  getDemoByFilename(e) {
    return this.demos.find((t) => t.filename === e);
  }
  getDemoHref(e) {
    const t = typeof e == 'string' ? e : (e.filename ?? '');
    return Ot + encodeURIComponent(t);
  }
  getDemoLabel(e) {
    var t;
    return typeof e == 'string'
      ? e.replace(/\.demo\.ts$/, '')
      : e.title
        ? e.title
        : (((t = (e.filename ?? '').split('/').pop()) == null ? void 0 : t.replace(/\.demo\.ts$/, '')) ?? '');
  }
}
const Ms =
    ':host{display:block;color:#111827;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.demo{min-height:100%;background:#f8fafc}.header{display:grid;align-content:end;gap:16px;min-height:200px;padding:48px 24px 20px;background:#000;color:#fff}.header-copy{display:grid;gap:8px}.title{margin:0;font-size:1.5rem;line-height:1.2}.description{margin:0;color:#fffc}.header-extra:empty{display:none}.content{min-width:0;padding:24px}',
  _t = class _t extends z {
    render() {
      var n, r, s;
      const e = ((n = this.data) == null ? void 0 : n.title) ?? '',
        t = ((r = this.data) == null ? void 0 : r.description) ?? '';
      return A`
      <section class="demo">
        <header class="header">
          <div class="header-copy">
            ${e ? A`<h2 class="title">${e}</h2>` : x}
            ${t ? A`<p class="description">${t}</p>` : x}
          </div>

          <div class="header-extra">
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
((_t.properties = { data: { attribute: !1 } }), (_t.styles = [U(Ms)]));
let Ft = _t;
typeof customElements < 'u' && !customElements.get('tj-demo') && customElements.define('tj-demo', Ft);
const Os =
  ':host{display:block;color:#111827;font:14px/1.4 sans-serif}*,*:before,*:after{box-sizing:border-box}.viewer{min-height:100%}.content{min-width:0;min-height:100%}';
var ve, ye, tt, nt, F, Wt, Qi, er, tr;
const xt = class xt extends z {
  constructor() {
    super(...arguments);
    v(this, F);
    v(this, ve, []);
    v(this, ye, new si([]));
    v(this, tt, 0);
    v(this, nt, () => {
      this.selectedDemo = h(this, F, Wt).call(this);
    });
  }
  set demos(t) {
    (S(this, ve, Array.isArray(t) ? t : []),
      S(this, ye, new si(p(this, ve))),
      (this.navData = p(this, ye).getNavData()),
      (this.selectedDemo = h(this, F, Wt).call(this)),
      this.requestUpdate());
  }
  get demos() {
    return p(this, ve);
  }
  connectedCallback() {
    (super.connectedCallback(),
      window.dispatchEvent(new CustomEvent('tj:viewerReady', { detail: { viewer: this } })),
      window.addEventListener('hashchange', p(this, nt)));
  }
  disconnectedCallback() {
    (window.removeEventListener('hashchange', p(this, nt)), super.disconnectedCallback());
  }
  updated(t) {
    (super.updated(t), (t.has('selectedDemo') || t.has('navData')) && h(this, F, Qi).call(this));
  }
  render() {
    return A`
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
((ve = new WeakMap()),
  (ye = new WeakMap()),
  (tt = new WeakMap()),
  (nt = new WeakMap()),
  (F = new WeakSet()),
  (Wt = function () {
    const t = typeof window > 'u' ? '' : window.location.hash;
    return p(this, ye).getDemoByHash(t);
  }),
  (Qi = async function () {
    const t = document.querySelector('tj-demo-renderer');
    if (!t) return;
    const n = ++Vn(this, tt)._;
    if ((h(this, F, tr).call(this), !this.selectedDemo)) {
      await t.showDemo({
        title: 'Demo auswählen',
        render(r) {
          r.textContent = 'Demo auswählen';
        },
      });
      return;
    }
    (await t.showDemo(this.selectedDemo), n === p(this, tt) && h(this, F, er).call(this, this.selectedDemo));
  }),
  (er = function (t) {
    if (!t.controls_raw_html) return;
    const n = document.createElement('div');
    ((n.slot = 'controls'), (n.dataset.generatedControls = ''), (n.innerHTML = t.controls_raw_html), this.append(n));
  }),
  (tr = function () {
    for (const t of Array.from(this.querySelectorAll('[data-generated-controls]'))) t.remove();
  }),
  (xt.properties = { navData: { state: !0 }, selectedDemo: { state: !0 } }),
  (xt.styles = [U(Os)]));
let Bt = xt;
typeof customElements < 'u' && !customElements.get('tj-demo-viewer') && customElements.define('tj-demo-viewer', Bt);
const Ls = `# nte-input

Minimaler Input-Wrapper mit Plugin-Architektur für einheitliche Formulare.

## Kurzüberblick

\`nte-input\` liefert den gemeinsamen Rahmen für Label, Control, Validation und Input-Aid.
Der eigentliche Feldtyp kommt aus statisch registrierten Plugins.

## Was du im Paket bekommst

- **Text, E-Mail und Passwort** mit einheitlichem Frame
- **Textarea** mit Auto-Grow
- **Select** aus \`<options>\` oder \`data-options\`
- **Select-Radio** für Single- und Multi-Select-Szenarien
- **Token-Input** mit Vorschlägen, Freitext und \`strict\`-Modus
- **Checkbox** als spezialisierten Sonderfall
- **Start-/End-Slots** für Icons, Buttons und Affordanzen
- **Validation** und **Input-Aid** unter dem Feld
- **Form-Association** für natives \`FormData\`
- **FormDataAccessor** zum direkten Lesen und Setzen per Datenobjekt
- **SCSS-Mixins** für Themes, Floating Labels, Größen und Select-Radio-Layouts

## Demo-Fahrplan

1. **Styles & Typen** – zeigt die wichtigsten Feldtypen, Themes, Größen und Slots
2. **FormData Submit** – liest native Formularwerte über \`new FormData(form)\` aus
3. **FormDataAccessor** – synchronisiert Inputs direkt mit JSON-Daten
4. **Validation** – demonstriert Pflichtfelder, Pattern und Browser-Validierung
5. **Select-Radio Vertical** – zeigt das Layout-Mixin für nebeneinander angeordnete Optionen

## Schnellstart

\`\`\`html
<nte-input class="default hoverlabel" label="E-Mail" type="email" required></nte-input>

<nte-input
  class="default hoverlabel"
  label="Status"
  type="select"
  data-options="draft|Entwurf;active|Aktiv"
></nte-input>

<nte-input
  class="default hoverlabel"
  label="Tags"
  type="token-input"
  value='["news"]'
  data-options='[{"value":"news","label":"News"},{"value":"docs","label":"Dokumentation"}]'
></nte-input>
\`\`\`

Weitere Details zu API und Styling stehen in der README des Pakets.`,
  Is = { title: 'Überblick', description: 'Kurzer Einstieg in Architektur, Features und Demo-Fahrplan', markdown: Ls },
  Ts = Object.freeze(Object.defineProperty({ __proto__: null, default: Is }, Symbol.toStringTag, { value: 'Module' })),
  Ds = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>nte-input Styles & Typen Demo</title>
  </head>
  <body>
    <main>
      <h1>nte-input Styles & Typen</h1>
      <p>Überblick über Themes, Größen, Slots und die wichtigsten eingebauten Input-Typen.</p>

      <section>
        <h3>Themes</h3>
        <p>This is the way the elements look with no styling applied</p>
        <nte-input
          class="skip-style"
          label="No Style (if not importet scsss)"
          type="text"
          placeholder="Max Mustermann"
          required
          validation-message="This is a validation message only shown is it is invalid"
        >
          <p slot="input-aid">This is some text to display on focus</p>
        </nte-input>
        <nte-input
          class="default"
          label="Name"
          type="text"
          required
          validation-message="This is a validation message only shown is it is invalid"
          placeholder="Max Mustermann"
        >
          <p slot="input-aid">This is some text to display on focus</p>
        </nte-input>
        <nte-input class="default hoverlabel" label="Default mit Hoverlabel" type="text"></nte-input>
        <nte-input
          class="carbon"
          label="Name"
          type="text"
          required
          validation-message="This is a validation message only shown is it is invalid"
          placeholder="Max Mustermann"
        >
          <p slot="input-aid">This is some text to display on focus</p>
        </nte-input>
        <nte-input class="carbon hoverlabel" label="Carbon mit Hoverlabel" type="text"></nte-input>
      </section>

      <section>
        <h3>Größen</h3>
        <p>This is the way the elements look with no styling applied</p>
        <nte-input class="default sm" label="default sm" type="text" placeholder="Max Mustermann"></nte-input>
        <nte-input class="default hoverlabel sm" label="default sm" type="text"></nte-input>

        <nte-input class="default" label="default" type="text" placeholder="Max Mustermann"></nte-input>
        <nte-input class="default hoverlabel" label="default" type="text"></nte-input>

        <nte-input class="default lg" label="default lg" type="text" placeholder="Max Mustermann"></nte-input>
        <nte-input class="default hoverlabel lg" label="default lg" type="text"></nte-input>

        <nte-input class="default xl" label="default lg" type="text" placeholder="Max Mustermann"></nte-input>
      </section>

      <hr />

      <section>
        <h2>Text</h2>
        <nte-input class="hoverlabel" label="Name" type="text" placeholder="Max Mustermann"></nte-input>
      </section>

      <section>
        <h2>Start / End Slot</h2>
        <nte-input class="default hoverlabel" label="Suche" type="text" placeholder="Begriff eingeben">
          <svg
            slot="start"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-hypnotize"
            viewBox="0 0 16 16"
          >
            <path
              d="m7.949 7.998.006-.003.003.009zm.025-.028v-.03l.018.01zm0 .015.04-.022.01.006v.04l-.029.016-.021-.012zm.049.057v-.014l-.008.01zm-.05-.008h.006l-.006.004z"
            />
            <path
              fill-rule="evenodd"
              d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M4.965 1.69a6.97 6.97 0 0 1 3.861-.642c.722.767 1.177 1.887 1.177 3.135 0 1.656-.802 3.088-1.965 3.766 1.263.24 2.655-.815 3.406-2.742.38-.975.537-2.023.492-2.996a7.03 7.03 0 0 1 2.488 3.003c-.303 1.01-1.046 1.966-2.128 2.59-1.44.832-3.09.85-4.26.173l.008.021.012-.006-.01.01c.42 1.218 2.032 1.9 4.08 1.586a7.4 7.4 0 0 0 2.856-1.081 6.96 6.96 0 0 1-1.358 3.662c-1.03.248-2.235.084-3.322-.544-1.433-.827-2.272-2.236-2.279-3.58l-.012-.003c-.845.972-.63 2.71.666 4.327a7.4 7.4 0 0 0 2.37 1.935 6.97 6.97 0 0 1-3.86.65c-.727-.767-1.186-1.892-1.186-3.146 0-1.658.804-3.091 1.969-3.768l-.002-.007c-1.266-.25-2.666.805-3.42 2.74a7.4 7.4 0 0 0-.49 3.012 7.03 7.03 0 0 1-2.49-3.018C1.87 9.757 2.613 8.8 3.696 8.174c1.438-.83 3.084-.85 4.253-.176l.005-.006C7.538 6.77 5.924 6.085 3.872 6.4c-1.04.16-2.03.55-2.853 1.08a6.96 6.96 0 0 1 1.372-3.667l-.002.003c1.025-.243 2.224-.078 3.306.547 1.43.826 2.269 2.23 2.28 3.573L8 7.941c.837-.974.62-2.706-.673-4.319a7.4 7.4 0 0 0-2.362-1.931Z"
            />
          </svg>

          <button slot="end" type="button">
            <svg
              style="height: 100%"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-right-square-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1"
              />
            </svg>
          </button>
        </nte-input>
      </section>

      <section>
        <h2>Textarea</h2>
        <nte-input class="hoverlabel" label="Kommentar" type="textarea" value="Erster Text"></nte-input>
      </section>

      <section>
        <h2>Select</h2>
        <nte-input class="hoverlabel" label="Status" type="select" value="inprogress">
          <options>
            <option value="wrust">Wartet auf Rückmeldung</option>
            <option value="inprogress">In Bearbeitung</option>
          </options>
        </nte-input>
      </section>

      <section>
        <h2>Select via data-options</h2>
        <nte-input
          class="hoverlabel"
          label="Status (data-options)"
          type="select"
          value="active"
          data-options="draft|Entwurf;active|Aktiv"
        ></nte-input>
      </section>

      <section>
        <h2>Select-Radio</h2>
        <nte-input label="Status" type="select-radio" value="inprogress">
          <options>
            <option value="wrust">Wartet auf Rückmeldung</option>
            <option value="inprogress">In Bearbeitung</option>
          </options>
        </nte-input>
      </section>

      <section>
        <h2>Select-Radio Vertical</h2>
        <nte-input label="Status" type="select-radio" value="inprogress" class="default vertical">
          <options>
            <option value="wrust">Wartet auf Rückmeldung</option>
            <option value="inprogress">In Bearbeitung</option>
            <option value="inprogress">In Bearbeitung</option>
            <option value="inprogress">In Bearbeitung</option>
          </options>
        </nte-input>
      </section>

      <section>
        <h2>Select-Radio Multiple</h2>
        <nte-input
          label="Kategorien"
          type="select-radio"
          multiple
          value='["news"]'
          data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"}]'
        ></nte-input>
      </section>

      <section>
        <h2>Token Input</h2>
        <nte-input
          class="hoverlabel"
          label="Schlagworte"
          type="token-input"
          value='["news"]'
          data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"},{"value":"docs","label":"Dokumentation"}]'
        ></nte-input>
      </section>

      <section>
        <h2>Token Input (strict)</h2>
        <nte-input
          class="hoverlabel"
          label="Schlagworte"
          type="token-input"
          value='["news"]'
          strict
          data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"},{"value":"docs","label":"Dokumentation"}]'
        ></nte-input>
      </section>

      <section>
        <h2>Checkbox</h2>
        <nte-input label="AGB akzeptieren" type="checkbox" checked></nte-input>
      </section>

      <section>
        <h2>Input Aid</h2>
        <nte-input class="hoverlabel" label="Benutzername" type="text" placeholder="max.mustermann">
          <span slot="input-aid">Nur Kleinbuchstaben, Zahlen, Punkt und Bindestrich verwenden.</span>
        </nte-input>
      </section>

      <section>
        <h2>Validation</h2>
        <nte-input
          class="hoverlabel"
          label="E-Mail"
          type="email"
          invalid
          validation-message="Bitte eine gültige E-Mail eingeben."
        ></nte-input>
      </section>

      <section>
        <h2>Validation + Input Aid</h2>
        <nte-input
          class="hoverlabel"
          label="Passwort"
          type="password"
          invalid
          validation-message="Bitte mindestens 12 Zeichen eingeben."
        >
          <span slot="input-aid">Nutze idealerweise Groß-/Kleinbuchstaben, Zahlen und Sonderzeichen.</span>
        </nte-input>
      </section>

      <section>
        <h2>Custom validation slot</h2>
        <nte-input class="hoverlabel" label="Passwort" type="password">
          <span slot="validation">Mindestens 12 Zeichen und 1 Sonderzeichen.</span>
        </nte-input>
      </section>
    </main>

    <script src="/demo/main.js" type="module"><\/script>
  </body>
</html>
`,
  ut = [
    { name: 'xs', minWidth: 0 },
    { name: 'sm', minWidth: 576 },
    { name: 'md', minWidth: 768 },
    { name: 'lg', minWidth: 992 },
    { name: 'xl', minWidth: 1200 },
    { name: 'xxl', minWidth: 1400 },
  ],
  oi = ut.reduce((i, e) => ((i[e.name] = e.minWidth), i), {});
function st(i) {
  if (!(i in oi)) throw new Error(`Unknown breakpoint: ${i}`);
  return oi[i];
}
function Ns() {
  return window.visualViewport ? window.visualViewport.width : window.innerWidth;
}
function js(i) {
  i === void 0 && (i = Ns());
  for (let e = ut.length - 1; e >= 0; e--) if (i >= ut[e].minWidth) return ut[e].name;
  return 'xs';
}
function nr(i, e = {}, t = []) {
  Array.isArray(t) || (t = [t]);
  const n = document.createElement(i);
  for (const r in e) e[r] !== null && e[r] !== void 0 && n.setAttribute(r, e[r] !== !0 ? e[r] : '');
  for (const r of t) n.append(typeof r == 'string' ? document.createTextNode(r) : r);
  return n;
}
class Ps {
  constructor(e, t = !1) {
    L(this, 'timeout', null);
    L(this, 'startTimeWithMs', 0);
    L(this, 'maxTimeout', null);
    ((this.delay = e), (this.max_delay = t));
  }
  async wait() {
    return (
      this.startTimeWithMs === 0 && (this.startTimeWithMs = Date.now()),
      this.timeout &&
        (this.max_delay === !1 || this.startTimeWithMs + this.max_delay > Date.now()) &&
        (clearTimeout(this.timeout), (this.timeout = null)),
      new Promise((e) => {
        this.timeout ||
          (this.timeout = setTimeout(() => {
            ((this.timeout = null), (this.startTimeWithMs = 0), e(!0));
          }, this.delay));
      })
    );
  }
  debounce(e) {
    const t = Date.now();
    this.startTimeWithMs === 0 && (this.startTimeWithMs = t);
    const n = () => {
      (this.timeout && (clearTimeout(this.timeout), (this.timeout = null)),
        this.maxTimeout && (clearTimeout(this.maxTimeout), (this.maxTimeout = null)),
        (this.startTimeWithMs = 0),
        e());
    };
    if (
      (this.timeout && clearTimeout(this.timeout),
      (this.timeout = setTimeout(n, this.delay)),
      this.max_delay !== !1 && !this.maxTimeout)
    ) {
      const r = t - this.startTimeWithMs,
        s = Math.max(0, this.max_delay - r);
      this.maxTimeout = setTimeout(n, s);
    }
  }
}
class Hs {
  constructor(e, t, n, r = 'main') {
    ((this._debug = e), (this.myTag = t), (this.myElementId = n), (this.instanceId = r));
  }
  debug(...e) {
    this._debug && console.debug(`[DEBUG][${this.myTag}:${this.myElementId}:${this.instanceId}]`, ...e);
  }
  log(...e) {
    console.log(`[LOG][${this.myTag}:${this.myElementId}:${this.instanceId}]`, ...e);
  }
  warn(...e) {
    console.warn(`[WARN][${this.myTag}:${this.myElementId}:${this.instanceId}]`, ...e);
  }
  error(...e) {
    console.error(`[ERROR][${this.myTag}:${this.myElementId}:${this.instanceId}]`, ...e);
  }
  throwError(...e) {
    const t = `[ERROR][${this.myTag}:${this.myElementId}:${this.instanceId}] ${e.join(' ')}`;
    throw (this.error(...e), new Error(t));
  }
}
class zs {
  constructor(e, t = !0) {
    L(this, 'label');
    L(this, 'last');
    L(this, 'startTime');
    L(this, 'running', !1);
    L(this, 'enabled');
    ((this.label = e), (this.enabled = t), (this.startTime = this.last = performance.now()), (this.running = !0));
  }
  lap(e = '') {
    if (!this.enabled) return;
    const t = performance.now(),
      n = (t - this.last) / 1e3;
    ((this.last = t), console.debug(`[${this.label}] ${e} +${n.toFixed(3)}s`));
  }
  elapsed() {
    return performance.now() - this.startTime;
  }
  reset() {
    this.startTime = this.last = performance.now();
  }
  stop() {
    return ((this.running = !1), this.elapsed());
  }
  start() {
    ((this.running = !0), this.reset());
  }
  isRunning() {
    return this.running;
  }
}
function Vs(i) {
  return typeof i == 'object' && i !== null && !Array.isArray(i);
}
function Rs(i) {
  if (i != null)
    try {
      return JSON.parse(i);
    } catch {
      return;
    }
}
function ai(i) {
  const e = JSON.stringify(i);
  return e === void 0 ? 'null' : e;
}
function Fs(i, e) {
  const t = { ...e };
  if (Vs(i)) for (const n of Object.keys(e)) n in i && (t[n] = i[n]);
  return t;
}
class Bs {
  constructor(e, t, n) {
    L(this, 'cache');
    ((this.backend = e), (this.storageKey = t), (this.initialValue = n));
  }
  read() {
    if (this.cache) return this.cache;
    const e = this.backend ? Rs(this.backend.getItem(this.storageKey)) : void 0,
      t = Fs(e, this.initialValue);
    if (this.backend && this.backend.getItem(this.storageKey) == null)
      try {
        this.backend.setItem(this.storageKey, ai(t));
      } catch {}
    return ((this.cache = t), t);
  }
  write(e) {
    if (((this.cache = e), !!this.backend))
      try {
        this.backend.setItem(this.storageKey, ai(e));
      } catch {}
  }
  asProxy() {
    const e = {
      get: (t, n) => {
        if (typeof n == 'symbol') return n === Symbol.toStringTag ? 'Storage' : void 0;
        const r = this.read();
        return n === 'toJSON' ? () => ({ ...r }) : r[n];
      },
      set: (t, n, r) => {
        if (typeof n != 'string') return !1;
        const o = { ...this.read() };
        return ((o[n] = r), this.write(o), !0);
      },
      deleteProperty: (t, n) => {
        if (typeof n != 'string') return !1;
        const r = this.read();
        if (!(n in r)) return !0;
        const s = { ...r };
        return (delete s[n], this.write(s), !0);
      },
      has: (t, n) => {
        if (typeof n != 'string') return !1;
        const r = this.read();
        return n in r;
      },
      ownKeys: () => {
        const t = this.read();
        return Reflect.ownKeys(t);
      },
      getOwnPropertyDescriptor: (t, n) => {
        if (typeof n != 'string') return;
        const r = this.read();
        if (n in r) return { enumerable: !0, configurable: !0, writable: !0, value: r[n] };
      },
    };
    return new Proxy({}, e);
  }
}
function Ws(i) {
  const e = globalThis.window;
  return (i === 'session' ? (e == null ? void 0 : e.sessionStorage) : e == null ? void 0 : e.localStorage) ?? void 0;
}
function qs(i, e) {
  return new Bs(Ws('session'), i, e).asProxy();
}
function dn() {
  return document.readyState === 'loading'
    ? new Promise((i) => {
        document.addEventListener('DOMContentLoaded', () => i());
      })
    : Promise.resolve();
}
function Us(i) {
  var t, n;
  class e extends i {
    constructor() {
      super(...arguments);
      v(this, t, new Ps(200, 5e3));
      L(this, 'currentBreakPoint', null);
      v(this, n, async () => {
        var m;
        (await p(this, t).wait(), await dn());
        const o = this,
          a = window.innerWidth;
        let d = getComputedStyle(o).getPropertyValue('--breakpoint');
        if (!d || d === '') return;
        d = d.trim().replace(/^['"]|['"]$/g, '');
        const c = d.split(','),
          u = c[0].trim(),
          l = ((m = c[1]) == null ? void 0 : m.trim()) ?? u,
          f = js(a);
        this.currentBreakPoint !== f &&
          (st(l) <= st(f)
            ? o.setAttribute('mode', 'desktop')
            : st(u) > st(f)
              ? o.setAttribute('mode', 'mobile')
              : o.setAttribute('mode', 'tablet'));
      });
    }
    connectedCallback() {
      super.connectedCallback();
      try {
        (p(this, n).call(this), window.addEventListener('resize', p(this, n)), p(this, n).call(this));
      } catch (o) {
        throw (console.error('Error in BreakPointMixin:', o, 'in element', this), o);
      }
    }
    disconnectedCallback() {
      (super.disconnectedCallback(), window.removeEventListener('resize', p(this, n)));
    }
  }
  return ((t = new WeakMap()), (n = new WeakMap()), e);
}
const ht = Symbol('listenerDefs'),
  ir = Symbol('withEventBindings');
function Le(i, e) {
  const t = Array.isArray(i) ? i : [i];
  return function (n, r) {
    if (r.kind !== 'method') throw new Error('@Listen nur für Methoden');
    return (
      r.addInitializer(function () {
        const s = this;
        (s[ht] || (s[ht] = [])).push({ method: r.name, events: [...t], opts: e });
      }),
      function (...s) {
        if (!this[ir]) throw new Error('[EventBindings] @Listen - decorator requires EventBindingMixin.');
        return n.apply(this, s);
      }
    );
  };
}
function Ks(i, e) {
  var t;
  return !e || e === 'host'
    ? i
    : e === 'document'
      ? (i.ownerDocument ?? document)
      : e === 'window'
        ? (((t = i.ownerDocument) == null ? void 0 : t.defaultView) ?? window)
        : e === 'shadowRoot'
          ? (i.shadowRoot ?? i)
          : typeof e == 'function'
            ? e(i)
            : e;
}
function sr(i) {
  var t, n, rr;
  class e extends i {
    constructor(...a) {
      super(...a);
      v(this, n);
      v(this, t);
      this[ir] = !0;
    }
    connectedCallback() {
      var a;
      ((a = super.connectedCallback) == null || a.call(this), h(this, n, rr).call(this));
    }
    disconnectedCallback() {
      var a, d;
      ((a = p(this, t)) == null || a.abort(), (d = super.disconnectedCallback) == null || d.call(this));
    }
  }
  return (
    (t = new WeakMap()),
    (n = new WeakSet()),
    (rr = function () {
      var d, c, u;
      ((d = p(this, t)) == null || d.abort(), S(this, t, new AbortController()));
      const a = this[ht] || [];
      for (const l of a) {
        const f = Ks(this, (c = l.opts) == null ? void 0 : c.target),
          m = ((u = l.opts) == null ? void 0 : u.options) ?? {},
          C = this[l.method].bind(this);
        for (const H of l.events) f.addEventListener(H, C, { ...m, signal: p(this, t).signal });
      }
    }),
    e
  );
}
let Gs = 1;
function or(i) {
  var t, n, r;
  class e extends i {
    constructor() {
      super(...arguments);
      v(this, t, null);
      v(this, n, Gs++);
      v(this, r, null);
    }
    invalidateDebugCache() {
      S(this, t, null);
    }
    get _debug() {
      return p(this, t) !== null
        ? p(this, t)
        : (this instanceof HTMLElement &&
            S(
              this,
              t,
              this.hasAttribute('debug') && !['false', '0', 'off', 'no'].includes(this.getAttribute('debug') || ''),
            ),
          p(this, t) === !0 &&
            console.info(`[DEBUG][ID:${p(this, n)}] LoggingMixin: Debug mode is enabled for <${this.tagName}>`, this),
          p(this, t) ?? !1);
    }
    getLogger(a = 'main') {
      const d = '<' + (this.tagName || this.constructor.name || 'UnknownElement') + '>';
      return (p(this, r) || S(this, r, new Hs(this._debug, d, `${p(this, n)}`, a)), p(this, r));
    }
    debug(...a) {
      this.getLogger().debug(...a);
    }
    log(...a) {
      this.getLogger().log(...a);
    }
    warn(...a) {
      this.getLogger().warn(...a);
    }
    error(...a) {
      this.getLogger().error(...a);
    }
    throwError(...a) {
      return this.getLogger().throwError(...a);
    }
  }
  return ((t = new WeakMap()), (n = new WeakMap()), (r = new WeakMap()), e);
}
function ar(i) {
  class e extends i {
    connectedCallback() {
      (this.dispatchEvent(
        new CustomEvent('init:child-waitreq', {
          detail: { element: this, state: 'connected' },
          bubbles: !0,
          composed: !0,
        }),
      ),
        super.connectedCallback());
    }
    firstUpdated(n) {
      var r;
      ((r = super.firstUpdated) == null || r.call(this, n),
        this.dispatchEvent(
          new CustomEvent('init:child-ready', { detail: { element: this, state: 'ready' }, bubbles: !0, composed: !0 }),
        ));
    }
    disconnectedCallback() {
      (super.disconnectedCallback(),
        this.dispatchEvent(
          new CustomEvent('init:child-ready', {
            detail: { element: this, state: 'disconnected' },
            bubbles: !0,
            composed: !0,
          }),
        ));
    }
  }
  return e;
}
function Js(i) {
  var t, lr, r, pt, dr;
  class e extends i {
    constructor() {
      super(...arguments);
      v(this, t);
      v(this, r, (c) => {
        const u = c.target,
          l = h(this, t, pt).call(this, u.assignedNodes({ flatten: !0 })),
          f = h(this, t, pt).call(this, u.childNodes);
        l || f ? u.classList.remove('slot-empty') : u.classList.add('slot-empty');
      });
    }
    firstUpdated(c) {
      var u;
      ((u = super.firstUpdated) == null || u.call(this, c), h(this, t, lr).call(this));
    }
  }
  return (
    (t = new WeakSet()),
    (lr = function () {
      var u;
      const c = (u = this.shadowRoot) == null ? void 0 : u.querySelectorAll('slot');
      c == null ||
        c.forEach((l) => {
          (h(this, t, pt).call(this, l.childNodes) || l.classList.add('slot-empty'),
            l.addEventListener('slotchange', (f) => p(this, r).call(this, f)));
        });
    }),
    (r = new WeakMap()),
    (pt = function (c) {
      return Array.from(c).some((u) => h(this, t, dr).call(this, u));
    }),
    (dr = function (c) {
      return c.nodeType === Node.TEXT_NODE ? (c.textContent || '').trim().length > 0 : c.nodeType === Node.ELEMENT_NODE;
    }),
    e
  );
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const cn = (i) => (e, t) => {
  t !== void 0
    ? t.addInitializer(() => {
        customElements.define(i, e);
      })
    : customElements.define(i, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Zs = { attribute: !0, type: String, converter: mt, reflect: !1, hasChanged: an },
  Ys = (i = Zs, e, t) => {
    const { kind: n, metadata: r } = t;
    let s = globalThis.litPropertyMetadata.get(r);
    if (
      (s === void 0 && globalThis.litPropertyMetadata.set(r, (s = new Map())),
      n === 'setter' && ((i = Object.create(i)).wrapped = !0),
      s.set(t.name, i),
      n === 'accessor')
    ) {
      const { name: o } = t;
      return {
        set(a) {
          const d = e.get.call(this);
          (e.set.call(this, a), this.requestUpdate(o, d, i, !0, a));
        },
        init(a) {
          return (a !== void 0 && this.C(o, void 0, i, a), a);
        },
      };
    }
    if (n === 'setter') {
      const { name: o } = t;
      return function (a) {
        const d = this[o];
        (e.call(this, a), this.requestUpdate(o, d, i, !0, a));
      };
    }
    throw Error('Unsupported decorator location: ' + n);
  };
function j(i) {
  return (e, t) =>
    typeof t == 'object'
      ? Ys(i, e, t)
      : ((n, r, s) => {
          const o = r.hasOwnProperty(s);
          return (r.constructor.createProperty(s, n), o ? Object.getOwnPropertyDescriptor(r, s) : void 0);
        })(i, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function li(i) {
  return j({ ...i, state: !0, attribute: !1 });
}
const Xs =
  ':host{--border-color: red;--background-color: lightgray;font-family:Arial,sans-serif}#error-fixed-indicator{position:fixed;top:10px;right:10px;cursor:pointer;z-index:100000;padding:5px 10px;width:auto;max-width:90vw;min-width:100px;height:auto;box-shadow:0 4px 8px #0003;border:5px solid white;color:#fff;background-color:red;animation:blink 1s infinite;border-radius:15px;font-size:20px;font-weight:700;font-family:Arial,sans-serif}@keyframes blink{0%,to{background-color:#000}50%{background-color:red}}#error{background-color:var(--background-color);border:3px solid var(--border-color);padding:10px;margin:10px;border-radius:5px}h1{color:red;font-size:24px;margin:0}.error-details{font-size:14px;max-height:200px;overflow:auto}';
var Qs = Object.create,
  un = Object.defineProperty,
  eo = Object.getOwnPropertyDescriptor,
  cr = (i, e) => ((e = Symbol[i]) ? e : Symbol.for('Symbol.' + i)),
  Ae = (i) => {
    throw TypeError(i);
  },
  to = (i, e, t) => (e in i ? un(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : (i[e] = t)),
  di = (i, e) => un(i, 'name', { value: e, configurable: !0 }),
  no = (i) => [, , , Qs((i == null ? void 0 : i[cr('metadata')]) ?? null)],
  ur = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  Ne = (i) => (i !== void 0 && typeof i != 'function' ? Ae('Function expected') : i),
  io = (i, e, t, n, r) => ({
    kind: ur[i],
    name: e,
    metadata: n,
    addInitializer: (s) => (t._ ? Ae('Already initialized') : r.push(Ne(s || null))),
  }),
  ro = (i, e) => to(e, cr('metadata'), i[3]),
  qt = (i, e, t, n) => {
    for (var r = 0, s = i[e >> 1], o = s && s.length; r < o; r++) e & 1 ? s[r].call(t) : (n = s[r].call(t, n));
    return n;
  },
  hr = (i, e, t, n, r, s) => {
    var o,
      a,
      d,
      c,
      u,
      l = e & 7,
      f = !!(e & 8),
      m = !!(e & 16),
      C = l > 3 ? i.length + 1 : l ? (f ? 1 : 2) : 0,
      H = ur[l + 5],
      B = l > 3 && (i[C - 1] = []),
      te = i[C] || (i[C] = []),
      _ =
        l &&
        (!m && !f && (r = r.prototype),
        l < 5 &&
          (l > 3 || !m) &&
          eo(
            l < 4
              ? r
              : {
                  get [t]() {
                    return ci(this, s);
                  },
                  set [t](g) {
                    return ui(this, s, g);
                  },
                },
            t,
          ));
    l ? m && l < 4 && di(s, (l > 2 ? 'set ' : l > 1 ? 'get ' : '') + t) : di(r, t);
    for (var D = n.length - 1; D >= 0; D--)
      ((c = io(l, t, (d = {}), i[3], te)),
        l &&
          ((c.static = f),
          (c.private = m),
          (u = c.access = { has: m ? (g) => so(r, g) : (g) => t in g }),
          l ^ 3 && (u.get = m ? (g) => (l ^ 1 ? ci : ao)(g, r, l ^ 4 ? s : _.get) : (g) => g[t]),
          l > 2 && (u.set = m ? (g, V) => ui(g, r, V, l ^ 4 ? s : _.set) : (g, V) => (g[t] = V))),
        (a = (0, n[D])(l ? (l < 4 ? (m ? s : _[H]) : l > 4 ? void 0 : { get: _.get, set: _.set }) : r, c)),
        (d._ = 1),
        l ^ 4 || a === void 0
          ? Ne(a) && (l > 4 ? B.unshift(a) : l ? (m ? (s = a) : (_[H] = a)) : (r = a))
          : typeof a != 'object' || a === null
            ? Ae('Object expected')
            : (Ne((o = a.get)) && (_.get = o), Ne((o = a.set)) && (_.set = o), Ne((o = a.init)) && B.unshift(o)));
    return (l || ro(i, r), _ && un(r, t, _), m ? (l ^ 4 ? s : _) : r);
  },
  hn = (i, e, t) => e.has(i) || Ae('Cannot ' + t),
  so = (i, e) => (Object(e) !== e ? Ae('Cannot use the "in" operator on this value') : i.has(e)),
  ci = (i, e, t) => (hn(i, e, 'read from private field'), t ? t.call(i) : e.get(i)),
  oo = (i, e, t) =>
    e.has(i) ? Ae('Cannot add the same private member more than once') : e instanceof WeakSet ? e.add(i) : e.set(i, t),
  ui = (i, e, t, n) => (hn(i, e, 'write to private field'), n ? n.call(i, t) : e.set(i, t), t),
  ao = (i, e, t) => (hn(i, e, 'access private method'), t),
  pr,
  Ut,
  mr,
  _e,
  pn;
mr = [cn('tj-error-element')];
class xe extends ((Ut = z), (pr = [j({ type: String, reflect: !0 })]), Ut) {
  constructor(e = 'An error occurred', t) {
    (super(),
      (this.originalCode = void 0),
      oo(this, pn, qt(_e, 8, this)),
      qt(_e, 11, this),
      (this.message = e),
      (this.originalCode = t));
  }
  static get is() {
    return 'tj-error-element';
  }
  render() {
    return A`
      <div id="error-fixed-indicator" @click=${() => this.scrollIntoView({ behavior: 'smooth' })}>
        Err: ${this.message}
      </div>
      <div id="error">
        <h1>Error: ${this.message}</h1>
        <pre class="error-details">
          ${this.originalCode ? this.originalCode : 'No code provided.'}
        </pre
        >

        <slot></slot>
      </div>
    `;
  }
}
_e = no(Ut);
pn = new WeakMap();
hr(_e, 4, 'message', pr, xe, pn);
xe = hr(_e, 0, 'TjErrorElement', mr, xe);
xe.styles = [U(Xs)];
qt(_e, 1, xe);
function fr(i, { allowAttributes: e = !0, ignoreGaps: t = !0 } = {}) {
  let n = 'div',
    r = null,
    s = [],
    o = [],
    a = {};
  const d = /(^[a-z][\w-]*)|#[\w-]+|\.[\w:-]+|\[\s*([\w-]+)(?:\s*=\s*(['"]?)(.*?)\3)?\s*\]/gi;
  let c = 0;
  for (;;) {
    const u = d.exec(i);
    if (!u || u.index !== c) {
      if (!t && u && u.index > c) break;
      break;
    }
    const l = u[0];
    if (l[0] === '#') r = l.slice(1);
    else if (l[0] === '.') s.push(l.slice(1));
    else if (l[0] === '[') {
      if (!e) throw new Error(`Attributes not allowed: '${l}'`);
      const f = u[2],
        m = u[4] || void 0;
      (o.push({ name: f, value: m }), (a[f] = m));
    } else n = l;
    c += l.length;
  }
  return { tag: n, id: r, classes: s, attrs: o, attrsMap: a, length: c, rest: i.slice(c) };
}
function lo(i) {
  return typeof i.beforeLayoutCallback == 'function';
}
function co(i, e, t) {
  const n = /^(=|\+|!|-|\/|)([0-9]+(?:\.[0-9]+)?|);?/,
    r = t.replace(n, ''),
    s = fr(r),
    a = Array.from(i.attributes).reduce((l, f) => ((l[f.name] = f.value), l), {});
  (s.classes.length > 0 && (a.class = (a.class ? a.class + ' ' : '') + s.classes.join(' ')), s.id && (a.id = s.id));
  const d = s.tag || 'section';
  let c = !1,
    u = nr(d, { ...a, layoutOrig: t });
  if (d.includes('-') && !customElements.get(d))
    (console.warn(`Custom element <${d}> is not registered.`),
      (u = new xe(`Custom element <${d}> is not registered.`, i.outerHTML)),
      i.replaceWith(u),
      u.append(i),
      (c = !0));
  else {
    const l = Array.from(i.children);
    (lo(u) && (c = u.beforeLayoutCallback(i, u, l) === !1),
      (u.__ORIG_ELEMENT__ = i),
      u.append(...Array.from(i.children)),
      i.replaceWith(u));
  }
  return { replacementElement: u, skipChildren: c };
}
function bt(i, e = {}) {
  const { recursive: t = !0 } = e,
    n = [];
  if (Array.isArray(i)) return (i.forEach((a) => n.push(...bt(a, e))), n);
  if (!(i instanceof HTMLElement)) return [];
  const r = i.getAttribute('layout');
  let s = !1,
    o = i;
  return (
    r && ({ replacementElement: o, skipChildren: s } = co(i, e, r)),
    t && !s && Array.from(o.children).forEach((a) => n.push(...bt(a, e))),
    n
  );
}
const Lt = /^(=|\+|!|-|\/|)([0-9]+(?:\.[0-9]+)?|)(;|$)/;
class uo {
  constructor(e, t = !1) {
    ((this.debug = t),
      (this.currentContainerNode = null),
      (this.containerPath = []),
      (this.containerIndex = [0]),
      (this.controlLayoutIndex = []),
      (this.lastFixedI = 20),
      (this.currentContainerNode = this.rootNode = e),
      this.containerPath.push(this.rootNode));
  }
  getI(e) {
    const t = e.tagName,
      n = e.getAttribute('layout'),
      r = { i: -99, variant: 'new', tag: 'hr', hi: null };
    if (n) {
      const s = n.match(Lt);
      if (s) {
        const o = s[1];
        ((r.variant =
          o === '=' || o === '+' ? 'append' : o === '!' || o === '-' ? 'skip' : o === '/' ? 'close' : 'new'),
          s[2] !== '' && (r.i = parseFloat(s[2]) * 10));
      }
    }
    if (t === 'HR' && n === null) return null;
    if (r.variant === 'close') {
      if (t !== 'HR') throw new Error('layout close syntax (/i;) is only supported on HR control elements');
      if (r.i === -99) {
        const s = this.controlLayoutIndex[this.controlLayoutIndex.length - 1];
        if (s === void 0) throw new Error('Cannot close current layout level: no open HR layout wrapper');
        r.i = s;
      }
      return r;
    }
    if (t === 'HR') return (r.i === -99 ? (r.i = this.lastFixedI + 5) : (this.lastFixedI = r.i), r);
    if (t.startsWith('H') && t.length === 2) {
      let s = t.substring(1);
      return (
        (r.tag = 'h'),
        (r.hi = parseInt(s)),
        s === '1' && (s = '2'),
        r.i === -99 && (r.i = parseInt(s) * 10),
        (this.lastFixedI = r.i),
        r
      );
    }
    return null;
  }
  stripControlOnlyLayout(e) {
    const t = e.getAttribute('layout');
    if (!t) return;
    const n = t.match(Lt);
    n && t.slice(n[0].length).trim() === '' && e.removeAttribute('layout');
  }
  getAttributeRecords(e, t = !1) {
    const n = {},
      r = e.getAttribute('layout');
    let s = null;
    if (r) {
      const o = r.replace(Lt, '').trim();
      o !== '' && (s = fr(o));
    }
    for (const o of Array.from(e.attributes))
      o.name.startsWith('section-')
        ? (n[o.name.replace(/^section-/, '')] = o.value)
        : (o.name.startsWith('layout') || t) && ((n[o.name] = o.value), e.removeAttribute(o.name));
    return (
      t ||
        Array.from(e.classList).forEach((o) => {
          o.startsWith('section-') &&
            ((n.class = (n.class ? n.class + ' ' : '') + o.replace(/^section-/, '')), e.classList.remove(o));
        }),
      s &&
        (s.classes.forEach((o) => {
          n.class = (n.class ? n.class + ' ' : '') + o + ' ';
        }),
        s.attrs.forEach((o) => {
          n[o.name] = o.value ?? '';
        }),
        s.id && (n.id = s.id)),
      n
    );
  }
  createNewContainerNode(e, t) {
    const n = this.getAttributeRecords(e, e.tagName === 'HR'),
      r = nr('section', n);
    return ((r.__IT = t), r);
  }
  arrangeSingleNode(e, t) {
    let n = 0;
    for (n = 0; n < this.containerIndex.length && !(this.containerIndex[n] >= t.i); n++);
    let r;
    if (t.variant === 'append') {
      const o = this.containerPath[n];
      if (!o || this.containerIndex[n] !== t.i)
        throw new Error(`Cannot append to layout level ${t.i / 10}: no existing section at this level`);
      ((r = o), this.stripControlOnlyLayout(e));
    } else r = this.createNewContainerNode(e, t);
    const s = this.containerPath[n - 1];
    if (!s) throw new Error(`Cannot create layout level ${t.i / 10}: no parent container`);
    ((this.containerPath.length = n),
      (this.containerIndex.length = n),
      e.tagName === 'HR' && (e.setAttribute('aria-hidden', 'true'), e.setAttribute('hidden', 'hidden')),
      r.appendChild(e),
      s.appendChild(r),
      this.containerPath.push(r),
      this.containerIndex.push(t.i),
      (this.currentContainerNode = r),
      e.tagName === 'HR' && t.variant === 'new' && this.controlLayoutIndex.push(t.i));
  }
  closeLevel(e) {
    for (; this.containerIndex.length > 1 && this.containerIndex[this.containerIndex.length - 1] >= e;)
      (this.containerIndex.pop(), this.containerPath.pop());
    for (; this.controlLayoutIndex.length && this.controlLayoutIndex[this.controlLayoutIndex.length - 1] >= e;)
      this.controlLayoutIndex.pop();
    this.currentContainerNode = this.containerPath[this.containerPath.length - 1] ?? this.rootNode;
  }
  appendToCurrentContainer(e) {
    if (this.currentContainerNode === null) throw new Error('No current container node set');
    this.currentContainerNode.appendChild(e);
  }
  arrange(e) {
    for (const t of e) {
      if (t.nodeType !== Node.ELEMENT_NODE) {
        this.appendToCurrentContainer(t);
        continue;
      }
      const n = t,
        r = this.getI(n);
      if (!r) {
        this.appendToCurrentContainer(t);
        continue;
      }
      if (r.variant === 'close') {
        (n.parentNode && n.parentNode.removeChild(n), this.closeLevel(r.i));
        continue;
      }
      if (r.variant === 'skip') {
        (this.stripControlOnlyLayout(n), this.appendToCurrentContainer(t));
        continue;
      }
      this.arrangeSingleNode(n, r);
    }
  }
}
var ho = Object.create,
  mn = Object.defineProperty,
  po = Object.getOwnPropertyDescriptor,
  br = (i, e) => ((e = Symbol[i]) ? e : Symbol.for('Symbol.' + i)),
  Se = (i) => {
    throw TypeError(i);
  },
  mo = (i, e, t) => (e in i ? mn(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : (i[e] = t)),
  hi = (i, e) => mn(i, 'name', { value: e, configurable: !0 }),
  fo = (i) => [, , , ho((i == null ? void 0 : i[br('metadata')]) ?? null)],
  gr = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  je = (i) => (i !== void 0 && typeof i != 'function' ? Se('Function expected') : i),
  bo = (i, e, t, n, r) => ({
    kind: gr[i],
    name: e,
    metadata: n,
    addInitializer: (s) => (t._ ? Se('Already initialized') : r.push(je(s || null))),
  }),
  go = (i, e) => mo(e, br('metadata'), i[3]),
  Kt = (i, e, t, n) => {
    for (var r = 0, s = i[e >> 1], o = s && s.length; r < o; r++) e & 1 ? s[r].call(t) : (n = s[r].call(t, n));
    return n;
  },
  vr = (i, e, t, n, r, s) => {
    var o,
      a,
      d,
      c,
      u,
      l = e & 7,
      f = !!(e & 8),
      m = !!(e & 16),
      C = l > 3 ? i.length + 1 : l ? (f ? 1 : 2) : 0,
      H = gr[l + 5],
      B = l > 3 && (i[C - 1] = []),
      te = i[C] || (i[C] = []),
      _ =
        l &&
        (!m && !f && (r = r.prototype),
        l < 5 &&
          (l > 3 || !m) &&
          po(
            l < 4
              ? r
              : {
                  get [t]() {
                    return pi(this, s);
                  },
                  set [t](g) {
                    return mi(this, s, g);
                  },
                },
            t,
          ));
    l ? m && l < 4 && hi(s, (l > 2 ? 'set ' : l > 1 ? 'get ' : '') + t) : hi(r, t);
    for (var D = n.length - 1; D >= 0; D--)
      ((c = bo(l, t, (d = {}), i[3], te)),
        l &&
          ((c.static = f),
          (c.private = m),
          (u = c.access = { has: m ? (g) => vo(r, g) : (g) => t in g }),
          l ^ 3 && (u.get = m ? (g) => (l ^ 1 ? pi : wo)(g, r, l ^ 4 ? s : _.get) : (g) => g[t]),
          l > 2 && (u.set = m ? (g, V) => mi(g, r, V, l ^ 4 ? s : _.set) : (g, V) => (g[t] = V))),
        (a = (0, n[D])(l ? (l < 4 ? (m ? s : _[H]) : l > 4 ? void 0 : { get: _.get, set: _.set }) : r, c)),
        (d._ = 1),
        l ^ 4 || a === void 0
          ? je(a) && (l > 4 ? B.unshift(a) : l ? (m ? (s = a) : (_[H] = a)) : (r = a))
          : typeof a != 'object' || a === null
            ? Se('Object expected')
            : (je((o = a.get)) && (_.get = o), je((o = a.set)) && (_.set = o), je((o = a.init)) && B.unshift(o)));
    return (l || go(i, r), _ && mn(r, t, _), m ? (l ^ 4 ? s : _) : r);
  },
  fn = (i, e, t) => e.has(i) || Se('Cannot ' + t),
  vo = (i, e) => (Object(e) !== e ? Se('Cannot use the "in" operator on this value') : i.has(e)),
  pi = (i, e, t) => (fn(i, e, 'read from private field'), t ? t.call(i) : e.get(i)),
  yo = (i, e, t) =>
    e.has(i) ? Se('Cannot add the same private member more than once') : e instanceof WeakSet ? e.add(i) : e.set(i, t),
  mi = (i, e, t, n) => (fn(i, e, 'write to private field'), n ? n.call(i, t) : e.set(i, t), t),
  wo = (i, e, t) => (fn(i, e, 'access private method'), t),
  yr,
  Gt,
  wr,
  $e,
  bn;
qs('tj_sess_state', { lhref: '', scrollpos: 0, sessstart: Date.now(), pages: 0 });
wr = [cn('tj-content-pane')];
class gt extends ((Gt = sr(or(ar(re)))), (yr = [j({ type: Boolean, reflect: !0, attribute: 'skip-layout' })]), Gt) {
  constructor() {
    (super(), yo(this, bn, Kt($e, 8, this, !1)), Kt($e, 11, this));
  }
  static get is() {
    return 'tj-content-pane';
  }
  createRenderRoot() {
    return this;
  }
  arrange() {
    const e = new zs('SectionTreeBuilder');
    this.log('arrange() called');
    const t = new uo(this),
      n = Array.from(this.children);
    if (
      (t.arrange(n),
      this.debug('Firing afterArrange event'),
      this.dispatchEvent(new CustomEvent('afterArrange', { detail: { target: this }, bubbles: !0 })),
      this.skipLayout)
    ) {
      this.warn('Skipping layout as per skipLayout property.');
      return;
    }
    (bt(Array.from(this.children), { recursive: !0 }), e.lap('after arrange'));
  }
  async connectedCallback() {
    (await dn(), super.connectedCallback(), this.arrange());
  }
}
$e = fo(Gt);
bn = new WeakMap();
vr($e, 4, 'skipLayout', yr, gt, bn);
gt = vr($e, 0, 'ContentAreaElement2', wr, gt);
Kt($e, 1, gt);
function _o(i, e) {
  const t = i.split('|');
  for (const n of t) {
    const r = e.querySelectorAll(n.trim());
    if (r.length > 0) return Array.from(r);
  }
  return [];
}
function xo(i) {
  class e extends i {
    beforeLayoutCallback(n, r, s) {
      return !1;
    }
    firstUpdated(n) {
      var s, o;
      (s = super.firstUpdated) == null || s.call(this, n);
      const r = ((o = this.shadowRoot) == null ? void 0 : o.querySelectorAll('slot[data-query]')) ?? [];
      for (const a of Array.from(r)) {
        if (!(a instanceof HTMLSlotElement)) continue;
        let d = a.getAttribute('name') ?? '';
        if (d !== '' && a.assignedElements({ flatten: !0 }).length > 0) continue;
        const c = a.getAttribute('data-query');
        if (!c) continue;
        let u = [];
        try {
          u = _o(c, this);
        } catch (l) {
          throw (this.error(`"${l}" in slot`, a), l);
        }
        u.forEach((l) => {
          (a
            .getAttributeNames()
            .filter((f) => f.startsWith('data-set-attribute-'))
            .forEach((f) => {
              const m = f.replace(/^data-set-attribute-/, '');
              if (!l.hasAttribute(m)) {
                const C = a.getAttribute(f);
                C !== null && l.setAttribute(m, C);
              }
            }),
            d !== '' && l.setAttribute('slot', d));
        });
      }
      bt(Array.from(this.children), { recursive: !0 });
    }
  }
  return e;
}
function $o(i) {
  var t, n, _r;
  class e extends i {
    constructor() {
      super(...arguments);
      v(this, n);
      v(this, t);
    }
    connectedCallback() {
      (super.connectedCallback(), this.ensureDefaultStyleClass(), h(this, n, _r).call(this));
    }
    disconnectedCallback() {
      var a;
      ((a = p(this, t)) == null || a.disconnect(), S(this, t, void 0), super.disconnectedCallback());
    }
    ensureDefaultStyleClass() {
      Array.from(this.classList).some((d) => d.startsWith('style-')) || this.classList.add('style-default');
    }
  }
  return (
    (t = new WeakMap()),
    (n = new WeakSet()),
    (_r = function () {
      p(this, t) === void 0 &&
        (S(this, t, new MutationObserver(() => this.ensureDefaultStyleClass())),
        p(this, t).observe(this, { attributes: !0, attributeFilter: ['class'] }));
    }),
    e
  );
}
const ko = {
  logging: !0,
  slotVisibility: !1,
  eventBinding: !1,
  breakpoints: !1,
  setDefaultStyle: !0,
  subLayoutApply: !1,
};
function Ao(i = {}) {
  const e = { ...ko, ...i };
  let t = z;
  return (
    (t = ar(t)),
    e.setDefaultStyle && (t = $o(t)),
    e.logging && (t = or(t)),
    e.slotVisibility && (t = Js(t)),
    e.breakpoints && (t = Us(t)),
    e.eventBinding && (t = sr(t)),
    e.subLayoutApply && (t = xo(t)),
    t
  );
}
const So =
    '*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;width:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}img,picture,video,canvas,svg{display:block;max-width:100%}input,button,textarea,select{font:inherit;color:inherit;background:none;border:none;outline:none}a,i{color:inherit;text-decoration:none}ul,ol{list-style:none}table{border-collapse:collapse;border-spacing:0}slot{display:contents}',
  Eo = So;
function Co(i) {
  if (typeof i == 'string') return { value: i, label: i };
  if (i && typeof i == 'object') {
    const e = i;
    if (typeof e.value == 'string' || typeof e.label == 'string')
      return {
        value: String(e.value ?? e.label ?? ''),
        label: String(e.label ?? e.value ?? ''),
        disabled: !!e.disabled,
        html: typeof e.html == 'string' ? e.html : void 0,
      };
    const t = Object.entries(e)[0];
    if (t && typeof t[0] == 'string' && typeof t[1] == 'string') return { value: t[0], label: t[1] };
  }
  return null;
}
function Mo(i) {
  if (!i) return [];
  const e = i.trim();
  if (!e) return [];
  if (e.startsWith('[') || e.startsWith('{'))
    try {
      const t = JSON.parse(e);
      if (Array.isArray(t)) return t.map(Co).filter((n) => n !== null);
      if (t && typeof t == 'object') return Object.entries(t).map(([n, r]) => ({ value: n, label: String(r) }));
    } catch (t) {
      return (console.warn('Invalid data-options JSON:', t), []);
    }
  return e
    .split(';')
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => {
      const [n, r] = t.split('|').map((a) => a.trim());
      return { value: n ?? '', label: r || n || '' };
    });
}
function Oo(i) {
  return JSON.stringify(i);
}
const N = 'main-control',
  ee = 'validation-content',
  Lo =
    ':host{display:block}:where(#wrapper),:where(#field){display:grid;gap:.5rem}:where(#label){margin:0;font-weight:600}:where(#label[hidden]){display:none}:where(#control-shell){display:flex;align-items:stretch;gap:.5rem;min-height:2.75rem;border:1px solid #ced4da}:where(#control){display:flex;flex:1 1 auto;align-items:stretch;min-width:0;padding:.625rem .75rem}:where(#control-input){display:flex;flex:1 1 auto;align-items:stretch;min-width:0}:where(#control-input)>*{flex:1 1 auto;min-width:0}:where(#start),:where(#end){display:flex;flex:0 0 auto;align-items:stretch;align-self:stretch}:where(#start.slot-empty),:where(#end.slot-empty){display:none}:where(#start)::slotted(*),:where(#end)::slotted(*){display:inline-flex;align-items:center;justify-content:center;align-self:stretch;box-sizing:border-box;height:100%;max-height:100%}:where(#control-shell:focus-within){border-color:#0d6efd}:where(#validation){display:none;grid-template-rows:1fr;padding-top:.375rem}:where(#validation slot){display:contents}:where(#validation-inner){min-height:0;overflow:visible}:where(#validation-bubble){position:relative}:where(#validation-arrow){position:absolute;top:0;left:.75rem;display:block;width:.625rem;height:.625rem;background:#fff;border-top:1px solid #dc3545;border-left:1px solid #dc3545;transform:translateY(-50%) rotate(45deg)}:where(#validation-content){display:block;border:1px solid #dc3545}:host([invalid]) :where(#validation:has(slot:not(.slot-empty))){display:grid;padding-top:.175rem}:where(#input-aid){display:none;grid-template-rows:0fr}:where(#input-aid slot){display:contents}:where(#input-aid-inner){min-height:0;overflow:visible}:where(#input-aid-bubble){position:relative;opacity:0}:where(#input-aid-arrow){position:absolute;top:0;left:.75rem;display:block;width:.625rem;height:.625rem;background:#fff;border-top:1px solid #0d6efd;border-left:1px solid #0d6efd;transform:translateY(-50%) rotate(45deg)}:where(#input-aid-content){display:block;border:1px solid #0d6efd}:where(#input-aid:has(slot:not(.slot-empty))){display:grid}:host(:focus-within) :where(#input-aid:has(slot:not(.slot-empty))){grid-template-rows:1fr;padding-top:.375rem}:host(:focus-within) :where(#input-aid:has(slot:not(.slot-empty))) :where(#input-aid-bubble){opacity:1;transform:translateY(0)}';
var Io = Object.create,
  gn = Object.defineProperty,
  To = Object.getOwnPropertyDescriptor,
  xr = (i, e) => ((e = Symbol[i]) ? e : Symbol.for('Symbol.' + i)),
  Ee = (i) => {
    throw TypeError(i);
  },
  Do = (i, e, t) => (e in i ? gn(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : (i[e] = t)),
  fi = (i, e) => gn(i, 'name', { value: e, configurable: !0 }),
  No = (i) => [, , , Io((i == null ? void 0 : i[xr('metadata')]) ?? null)],
  $r = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  Pe = (i) => (i !== void 0 && typeof i != 'function' ? Ee('Function expected') : i),
  jo = (i, e, t, n, r) => ({
    kind: $r[i],
    name: e,
    metadata: n,
    addInitializer: (s) => (t._ ? Ee('Already initialized') : r.push(Pe(s || null))),
  }),
  Po = (i, e) => Do(e, xr('metadata'), i[3]),
  k = (i, e, t, n) => {
    for (var r = 0, s = i[e >> 1], o = s && s.length; r < o; r++) e & 1 ? s[r].call(t) : (n = s[r].call(t, n));
    return n;
  },
  T = (i, e, t, n, r, s) => {
    var o,
      a,
      d,
      c,
      u,
      l = e & 7,
      f = !!(e & 8),
      m = !!(e & 16),
      C = l > 3 ? i.length + 1 : l ? (f ? 1 : 2) : 0,
      H = $r[l + 5],
      B = l > 3 && (i[C - 1] = []),
      te = i[C] || (i[C] = []),
      _ =
        l &&
        (!m && !f && (r = r.prototype),
        l < 5 &&
          (l > 3 || !m) &&
          To(
            l < 4
              ? r
              : {
                  get [t]() {
                    return y(this, s);
                  },
                  set [t](g) {
                    return X(this, s, g);
                  },
                },
            t,
          ));
    l ? m && l < 4 && fi(s, (l > 2 ? 'set ' : l > 1 ? 'get ' : '') + t) : fi(r, t);
    for (var D = n.length - 1; D >= 0; D--)
      ((c = jo(l, t, (d = {}), i[3], te)),
        l &&
          ((c.static = f),
          (c.private = m),
          (u = c.access = { has: m ? (g) => Ho(r, g) : (g) => t in g }),
          l ^ 3 && (u.get = m ? (g) => (l ^ 1 ? y : He)(g, r, l ^ 4 ? s : _.get) : (g) => g[t]),
          l > 2 && (u.set = m ? (g, V) => X(g, r, V, l ^ 4 ? s : _.set) : (g, V) => (g[t] = V))),
        (a = (0, n[D])(l ? (l < 4 ? (m ? s : _[H]) : l > 4 ? void 0 : { get: _.get, set: _.set }) : r, c)),
        (d._ = 1),
        l ^ 4 || a === void 0
          ? Pe(a) && (l > 4 ? B.unshift(a) : l ? (m ? (s = a) : (_[H] = a)) : (r = a))
          : typeof a != 'object' || a === null
            ? Ee('Object expected')
            : (Pe((o = a.get)) && (_.get = o), Pe((o = a.set)) && (_.set = o), Pe((o = a.init)) && B.unshift(o)));
    return (l || Po(i, r), _ && gn(r, t, _), m ? (l ^ 4 ? s : _) : r);
  },
  vn = (i, e, t) => e.has(i) || Ee('Cannot ' + t),
  Ho = (i, e) => (Object(e) !== e ? Ee('Cannot use the "in" operator on this value') : i.has(e)),
  y = (i, e, t) => (vn(i, e, 'read from private field'), t ? t.call(i) : e.get(i)),
  I = (i, e, t) =>
    e.has(i) ? Ee('Cannot add the same private member more than once') : e instanceof WeakSet ? e.add(i) : e.set(i, t),
  X = (i, e, t, n) => (vn(i, e, 'write to private field'), n ? n.call(i, t) : e.set(i, t), t),
  He = (i, e, t) => (vn(i, e, 'access private method'), t),
  kr,
  Ar,
  Sr,
  Er,
  Cr,
  Mr,
  Or,
  Lr,
  Ir,
  Tr,
  Dr,
  Nr,
  jr,
  Pr,
  Hr,
  zr,
  Vr,
  Jt,
  Rr,
  b,
  yn,
  wn,
  _n,
  xn,
  $n,
  kn,
  An,
  Sn,
  En,
  Cn,
  Mn,
  On,
  Ln,
  O,
  Fe,
  pe,
  P,
  W,
  Fr,
  Zt,
  Br,
  Be;
Rr = [cn('nte-input')];
let E = class Wr extends ((Jt = Ao({ eventBinding: !0, slotVisibility: !0 })),
(Vr = [j({ type: String, reflect: !0 })]),
(zr = [j({ type: String })]),
(Hr = [j({ type: String })]),
(Pr = [j({ attribute: 'data-options', converter: { fromAttribute: (e) => Mo(e), toAttribute: (e) => Oo(e) } })]),
(jr = [j({ type: Boolean })]),
(Nr = [j({ type: String, attribute: 'validation-message', reflect: !0 })]),
(Dr = [j({ type: Boolean, reflect: !0 })]),
(Tr = [j({ type: Boolean, reflect: !0 })]),
(Ir = [j({ type: Boolean, reflect: !0, attribute: 'has-value' })]),
(Lr = [j({ type: Boolean, reflect: !0, attribute: 'has-placeholder' })]),
(Or = [j({ type: Boolean, reflect: !0, attribute: 'hoverlabel-active' })]),
(Mr = [li()]),
(Cr = [li()]),
(Er = [Le('input', { target: 'host' }), Le('invalid', { target: 'host' })]),
(Sr = [Le('click')]),
(Ar = [Le('change')]),
(kr = [Le('input')]),
Jt) {
  constructor() {
    (super(),
      k(b, 5, this),
      I(this, W),
      I(this, yn, k(b, 8, this, 'text')),
      k(b, 11, this),
      I(this, wn, k(b, 12, this, '')),
      k(b, 15, this),
      I(this, _n, k(b, 16, this, '')),
      k(b, 19, this),
      I(this, xn, k(b, 20, this, null)),
      k(b, 23, this),
      I(this, $n, k(b, 24, this, !1)),
      k(b, 27, this),
      I(this, kn, k(b, 28, this, '')),
      k(b, 31, this),
      I(this, An, k(b, 32, this, !1)),
      k(b, 35, this),
      I(this, Sn, k(b, 36, this, !1)),
      k(b, 39, this),
      I(this, En, k(b, 40, this, !1)),
      k(b, 43, this),
      I(this, Cn, k(b, 44, this, !1)),
      k(b, 47, this),
      I(this, Mn, k(b, 48, this, !1)),
      k(b, 51, this),
      I(this, On, k(b, 52, this)),
      k(b, 55, this),
      I(this, Ln, k(b, 56, this, N)),
      k(b, 59, this),
      I(this, O),
      I(this, Fe),
      I(this, pe),
      I(this, P, null),
      typeof this.attachInternals == 'function' && X(this, P, this.attachInternals()));
  }
  static registerPlugin(e) {
    for (const t of e.types) {
      const n = t.trim().toLowerCase();
      if (n) {
        if (this.plugins.has(n)) throw new Error(`Plugin for input type "${n}" is already registered.`);
        this.plugins.set(n, e);
      }
    }
  }
  static getPlugin(e) {
    return this.plugins.get(e.trim().toLowerCase());
  }
  async connectedCallback() {
    var t, n, r;
    await dn();
    const e = Wr.getPlugin(y(this, W, Be));
    if (!e) throw new Error(`No plugin for type ${y(this, W, Be)}`);
    (X(this, O, new e(this)),
      this._value === void 0 && (this._value = (t = y(this, O)) == null ? void 0 : t.getInitValue()),
      He(this, W, Zt).call(this) &&
        typeof ((n = y(this, P)) == null ? void 0 : n.setValidity) == 'function' &&
        y(this, P).setValidity({ customError: !0, badInput: !0 }, 'Invalid value'),
      super.connectedCallback(),
      He(this, W, Br).call(this, y(this, O).getStyleSheet()),
      (r = y(this, O)) == null || r.connected());
  }
  disconnectedCallback() {
    var e;
    ((e = y(this, O)) == null || e.disconnected(), super.disconnectedCallback());
  }
  attributeChangedCallback(e, t, n) {
    var r;
    (super.attributeChangedCallback(e, t, n), (r = y(this, O)) == null || r.onHostAttributeChange(e, t, n));
  }
  updated(e) {
    var t;
    (super.updated(e), (t = y(this, O)) == null || t.updated(e), this.syncPluginState());
  }
  render() {
    const e = y(this, O),
      t = this.classList.contains('hoverlabel'),
      n = e == null ? void 0 : e.render(this.renderContext),
      r = A`
      <label id="label" part="label" for=${this._labelFor} ?hidden=${!this.label || !!(e != null && e.isLabelHidden())}>
        ${this.label}
      </label>
    `;
    return A`
      <div id="wrapper" part="wrapper">
        <div id="field" part="field">
          ${t ? x : r}

          <div id="control-shell" part="control">
            <slot id="start" name="start" part="start"></slot>
            <div id="control" part="control-inner">
              ${t ? r : x}
              <div id="control-input" part="control-input">${n ?? x}</div>
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
  update(e) {
    super.update(e);
  }
  get renderContext() {
    return { element: this, type: y(this, W, Be) };
  }
  get form() {
    var e;
    return ((e = y(this, P)) == null ? void 0 : e.form) ?? null;
  }
  get name() {
    return this.getAttribute('name') ?? '';
  }
  get value() {
    return this._value;
  }
  set value(e) {
    ((this._value = e), this.syncPluginState());
  }
  get selectedOptions() {
    var e;
    return ((e = y(this, O)) == null ? void 0 : e.getSelectedOptions()) ?? [];
  }
  syncPluginState() {
    const e = y(this, O);
    ((this.hasValue = (e == null ? void 0 : e.hasValue()) ?? !1),
      (this.hasPlaceholder = (e == null ? void 0 : e.hasPlaceholder()) ?? this.hasAttribute('placeholder')),
      (this.hoverlabelActive = (e == null ? void 0 : e.isHoverlabelActive()) ?? !1),
      (this._labelFor = (e == null ? void 0 : e.getLabelFor()) ?? N),
      He(this, W, Fr).call(this));
  }
  formResetCallback() {
    var e;
    ((e = y(this, O)) == null || e.formResetCallback(), this.syncPluginState());
  }
  formDisabledCallback(e) {
    var t;
    ((t = y(this, O)) == null || t.formDisabledCallback(e), this.syncPluginState());
  }
  onMustRevalidateInternal() {
    var e, t, n;
    He(this, W, Zt).call(this) &&
      (((e = y(this, O)) == null ? void 0 : e.isValid()) === !0
        ? (typeof ((t = y(this, P)) == null ? void 0 : t.setValidity) == 'function' && y(this, P).setValidity({}),
          this.removeAttribute('invalid'),
          this.setAttribute('valid', ''))
        : (typeof ((n = y(this, P)) == null ? void 0 : n.setValidity) == 'function' &&
            y(this, P).setValidity({ customError: !0, badInput: !0 }, 'Invalid value'),
          this.setAttribute('invalid', ''),
          this.removeAttribute('valid')));
  }
  onClick(e) {
    var t, n, r;
    ((t = y(this, O)) == null || t.onClick(e),
      !this.hasAttribute('disabled') &&
        ((r = (n = y(this, O)) == null ? void 0 : n.getFormElement()) == null || r.focus()));
  }
  onChange(e) {
    var t;
    (t = y(this, O)) == null || t.onChange(e);
  }
  onInput(e) {
    var t;
    (t = y(this, O)) == null || t.onInput(e);
  }
};
b = No(Jt);
yn = new WeakMap();
wn = new WeakMap();
_n = new WeakMap();
xn = new WeakMap();
$n = new WeakMap();
kn = new WeakMap();
An = new WeakMap();
Sn = new WeakMap();
En = new WeakMap();
Cn = new WeakMap();
Mn = new WeakMap();
On = new WeakMap();
Ln = new WeakMap();
O = new WeakMap();
Fe = new WeakMap();
pe = new WeakMap();
P = new WeakMap();
W = new WeakSet();
Fr = function () {
  var i;
  if (!(!y(this, P) || typeof y(this, P).setFormValue != 'function')) {
    if (!this.name || this.hasAttribute('disabled')) {
      y(this, P).setFormValue(null);
      return;
    }
    y(this, P).setFormValue(((i = y(this, O)) == null ? void 0 : i.getFormValue()) ?? null);
  }
};
Zt = function () {
  return !!(this.hasAttribute('required') && !this.hasAttribute('disabled'));
};
Br = function (i) {
  var n;
  const e = this.renderRoot;
  if (
    !(e instanceof ShadowRoot) ||
    (y(this, pe) &&
      'adoptedStyleSheets' in e &&
      ((e.adoptedStyleSheets = e.adoptedStyleSheets.filter((r) => r !== y(this, pe))), X(this, pe, void 0)),
    (n = y(this, Fe)) == null || n.remove(),
    X(this, Fe, void 0),
    !i)
  )
    return;
  if (typeof CSSStyleSheet < 'u' && i instanceof CSSStyleSheet && 'adoptedStyleSheets' in e) {
    ((e.adoptedStyleSheets = [...e.adoptedStyleSheets, i]), X(this, pe, i));
    return;
  }
  const t = document.createElement('style');
  (t.setAttribute('data-plugin-style', y(this, W, Be)),
    (t.textContent =
      typeof i == 'string'
        ? i
        : Array.from(i.cssRules, (r) => r.cssText).join(`
`)),
    e.append(t),
    X(this, Fe, t));
};
Be = function () {
  return this.type.trim().toLowerCase() || 'text';
};
T(b, 4, 'type', Vr, E, yn);
T(b, 4, 'label', zr, E, wn);
T(b, 4, 'placeholder', Hr, E, _n);
T(b, 4, 'options', Pr, E, xn);
T(b, 4, 'multiple', jr, E, $n);
T(b, 4, 'validationMessage', Nr, E, kn);
T(b, 4, 'invalid', Dr, E, An);
T(b, 4, 'valid', Tr, E, Sn);
T(b, 4, 'hasValue', Ir, E, En);
T(b, 4, 'hasPlaceholder', Lr, E, Cn);
T(b, 4, 'hoverlabelActive', Or, E, Mn);
T(b, 4, '_value', Mr, E, On);
T(b, 4, '_labelFor', Cr, E, Ln);
T(b, 1, 'onMustRevalidateInternal', Er, E);
T(b, 1, 'onClick', Sr, E);
T(b, 1, 'onChange', Ar, E);
T(b, 1, 'onInput', kr, E);
E = T(b, 0, 'NteInput', Rr, E);
E.formAssociated = !0;
E.styles = [U(Lo), U(Eo)];
E.plugins = new Map();
k(b, 1, E);
let Ce = E;
class zo {
  constructor(e) {
    this.rootElement = e;
  }
  get data() {
    const e = {};
    return (
      this.rootElement.querySelectorAll('[name]').forEach((t) => {
        const n = t.getAttribute('name');
        !n || !('value' in t) || (e[n] = t.value);
      }),
      e
    );
  }
  set data(e) {
    for (const t in e) {
      const n = e[t],
        r = this.rootElement.querySelector(`[name="${t}"]`);
      !r || !('value' in r) || (r.value = n);
    }
  }
}
class Vo {
  constructor(e) {
    this.host = e;
  }
  connected() {}
  disconnected() {}
  updated(e) {}
  onClick(e) {}
  onInput(e) {}
  getFormElement() {
    return null;
  }
  getValue() {
    return this.host.value;
  }
  setValue(e) {
    this.host.value = e;
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
    var e;
    return ((e = this.getFormElement()) == null ? void 0 : e.id) || N;
  }
  getLabelFor() {
    return this.getControlId();
  }
  isValid() {
    return null;
  }
  onChange(e) {}
  getInitValue() {
    return this.host.getAttribute('value') ?? null;
  }
  onHostAttributeChange(e, t, n) {}
  formResetCallback() {}
  formDisabledCallback(e) {}
}
var $t;
class Me extends Vo {
  constructor() {
    super(...arguments);
    v(this, $t);
  }
  query(t) {
    var n;
    return ((n = this.host.renderRoot) == null ? void 0 : n.querySelector(t)) ?? null;
  }
  queryAll(t) {
    var n;
    return Array.from(((n = this.host.renderRoot) == null ? void 0 : n.querySelectorAll(t)) ?? []);
  }
  getHostAttribute(t, n = '') {
    return this.host.getAttribute(t) ?? n;
  }
  hasHostAttribute(t) {
    return this.host.hasAttribute(t);
  }
  normalizeStringValue(t) {
    return t == null ? '' : String(t);
  }
  createFormData(t) {
    if (!this.host.name || t.length === 0) return null;
    const n = new FormData();
    return (
      t.forEach((r) => {
        n.append(this.host.name, r);
      }),
      n
    );
  }
  syncHostState() {
    this.host.syncPluginState();
  }
  disconnected() {
    var t;
    (t = p(this, $t)) == null || t.abort();
  }
  getFormValue() {
    const t = this.getValue();
    return Array.isArray(t)
      ? this.createFormData(t)
      : typeof t == 'boolean'
        ? t
          ? this.getHostAttribute('value', 'on')
          : null
        : t == null
          ? null
          : String(t);
  }
  hasValue() {
    const t = this.getValue();
    return Array.isArray(t) ? t.length > 0 : typeof t == 'boolean' ? t : this.normalizeStringValue(t).trim().length > 0;
  }
  hasPlaceholder() {
    return this.hasHostAttribute('placeholder');
  }
  isHoverlabelActive() {
    return this.hasPlaceholder() || this.hasValue();
  }
}
$t = new WeakMap();
const Ro = '',
  Tn = class Tn extends Me {
    getStyleSheet() {
      return Ro;
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
      var e;
      this.host.value = (e = this.checkbox) == null ? void 0 : e.checked;
    }
    render(e) {
      const { element: t } = e;
      return A`
      <label part="checkbox-label" for=${N}>
        <input
          id=${N}
          part="checkbox-input"
          type="checkbox"
          aria-describedby=${ee}
          name=${t.getAttribute('name') ?? ''}
          value=${t.getAttribute('value') ?? 'on'}
          ?checked=${this.host.value === !0}
          ?disabled=${t.hasAttribute('disabled')}
          ?required=${t.hasAttribute('required')}
        />
        <span part="checkbox-text">${t.label}</span>
      </label>
    `;
    }
    isValid() {
      var e;
      return ((e = this.checkbox) == null ? void 0 : e.checkValidity()) ?? null;
    }
    getSelectedOptions() {
      var e;
      return this.getValue()
        ? [
            {
              value: this.getHostAttribute('value', ((e = this.checkbox) == null ? void 0 : e.value) ?? 'on'),
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
Tn.types = ['checkbox'];
let Yt = Tn;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Fo = { CHILD: 2 },
  Bo =
    (i) =>
    (...e) => ({ _$litDirective$: i, values: e });
class Wo {
  constructor(e) {}
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(e, t, n) {
    ((this._$Ct = e), (this._$AM = t), (this._$Ci = n));
  }
  _$AS(e, t) {
    return this.update(e, t);
  }
  update(e, t) {
    return this.render(...t);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ class Xt extends Wo {
  constructor(e) {
    if ((super(e), (this.it = x), e.type !== Fo.CHILD))
      throw Error(this.constructor.directiveName + '() can only be used in child bindings');
  }
  render(e) {
    if (e === x || e == null) return ((this._t = void 0), (this.it = e));
    if (e === ue) return e;
    if (typeof e != 'string') throw Error(this.constructor.directiveName + '() called with a non-string value');
    if (e === this.it) return this._t;
    this.it = e;
    const t = [e];
    return ((t.raw = t), (this._t = { _$litType$: this.constructor.resultType, strings: t, values: [] }));
  }
}
((Xt.directiveName = 'unsafeHTML'), (Xt.resultType = 1));
const In = Bo(Xt);
function qo(i) {
  const e = i.querySelector('options');
  return e instanceof HTMLElement
    ? Array.from(e.querySelectorAll('option')).map((t) => ({
        value: t.value,
        label: t.label || t.textContent || t.value,
        disabled: t.disabled,
        html: t.innerHTML || void 0,
      }))
    : [];
}
function Ge(i) {
  return i.options && i.options.length > 0 ? i.options : qo(i);
}
function Uo(i) {
  const e = i.trim();
  if (!e) return [];
  if (e.startsWith('['))
    try {
      const t = JSON.parse(e);
      if (Array.isArray(t)) return t.map((n) => String(n));
    } catch {}
  return e
    .split(/[;,]/)
    .map((t) => t.trim())
    .filter(Boolean);
}
function Je(i) {
  return Array.isArray(i)
    ? i.map((e) => String(e)).filter(Boolean)
    : typeof i == 'boolean'
      ? i
        ? ['true']
        : []
      : i == null
        ? []
        : Uo(String(i));
}
function qr(i, e) {
  const t = new Set(Array.from(e).map((n) => String(n)));
  return Ge(i).filter((n) => t.has(n.value));
}
const Ko = 'select{width:100%;min-width:0;color:inherit;font:inherit;background:transparent;border:0;outline:0}',
  Dn = class Dn extends Me {
    getStyleSheet() {
      return Ko;
    }
    get select() {
      return this.query('select');
    }
    getFormElement() {
      return this.select;
    }
    render(e) {
      const { element: t } = e,
        n = Ge(t),
        r = Je(this.host.value)[0] ?? '';
      return A`
      <select
        id=${N}
        part="select"
        name=${t.getAttribute('name') ?? ''}
        aria-describedby=${ee}
        ?disabled=${t.hasAttribute('disabled')}
        ?required=${t.hasAttribute('required')}
      >
        ${n.map(
          (s) => A`
            <option
              value=${s.value}
              ?disabled=${!!s.disabled}
              ?selected=${s.value === r}
            >
              ${this.renderOptionLabel(s) ?? x}
            </option>
          `,
        )}
      </select>
    `;
    }
    onInput() {
      var e;
      this.host.value = ((e = this.select) == null ? void 0 : e.value) ?? '';
    }
    onChange() {
      this.onInput();
    }
    isValid() {
      var e;
      return ((e = this.select) == null ? void 0 : e.checkValidity()) ?? null;
    }
    getValue() {
      return this.host.value;
    }
    getSelectedOptions() {
      return qr(this.host, Je(this.host.value));
    }
    renderOptionLabel(e) {
      return e.html ? In(e.html) : e.label;
    }
  };
Dn.types = ['select'];
let Qt = Dn;
const Go = '[part~=option-list]{width:100%}',
  Nn = class Nn extends Me {
    getStyleSheet() {
      return Go;
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
    render(e) {
      const { element: t } = e,
        n = Ge(t),
        r = new Set(this.normalizeSelectedValues(this.host.value)),
        s = t.multiple ? 'checkbox' : 'radio',
        o = t.getAttribute('name') ?? `${N}-group`,
        a = t.multiple ? 'group' : 'radiogroup';
      return A`
      <div
        id=${`${N}-group`}
        part="option-list"
        role=${a}
        aria-describedby=${ee}
      >
        ${n.map((d, c) => {
          const u = c === 0 ? N : `${N}-${c}`;
          return A`
            <label part="option-label" for=${u}>
              <input
                id=${u}
                part="option-input"
                type=${s}
                name=${o}
                value=${d.value}
                aria-describedby=${ee}
                ?checked=${r.has(d.value)}
                ?disabled=${!!d.disabled || t.hasAttribute('disabled')}
                ?required=${!t.multiple && t.hasAttribute('required')}
              />
              <span part="option-text">${this.renderOptionLabel(d) ?? x}</span>
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
      return qr(this.host, this.normalizeSelectedValues(this.host.value));
    }
    hasPlaceholder() {
      return !1;
    }
    isHoverlabelActive() {
      return this.hasValue();
    }
    normalizeSelectedValues(e) {
      const t = Je(e);
      return this.host.multiple ? t : t.slice(0, 1);
    }
    getSelectedValuesFromInputs() {
      return this.inputs.filter((e) => e.checked).map((e) => e.value);
    }
    renderOptionLabel(e) {
      return e.html ? In(e.html) : e.label;
    }
  };
Nn.types = ['select-radio'];
let en = Nn;
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const We = (i) => i ?? x,
  Jo = 'input{width:100%;min-width:0;color:inherit;font:inherit;background:transparent;border:0;outline:0}',
  jn = class jn extends Me {
    getStyleSheet() {
      return Jo;
    }
    get input() {
      return this.query('input');
    }
    getFormElement() {
      return this.input;
    }
    onInput() {
      var e;
      this.host.value = (e = this.input) == null ? void 0 : e.value;
    }
    render(e) {
      const { element: t, type: n } = e;
      return A`
      <input
        id=${N}
        part="input"
        type=${n}
        name=${t.getAttribute('name') ?? ''}
        .value=${this.normalizeStringValue(this.host.value)}
        placeholder=${t.getAttribute('placeholder') ?? ''}
        aria-describedby=${ee}
        pattern=${We(t.getAttribute('pattern') ?? void 0)}
        minlength=${We(t.getAttribute('minlength') ?? void 0)}
        maxlength=${We(t.getAttribute('maxlength') ?? void 0)}
        ?disabled=${t.hasAttribute('disabled')}
        ?readonly=${t.hasAttribute('readonly')}
        ?required=${t.hasAttribute('required')}
      />
    `;
    }
    isValid() {
      return this.query('input').checkValidity();
    }
    getValue() {
      var e;
      return (e = this.input) == null ? void 0 : e.value;
    }
  };
jn.types = ['text', 'email', 'password'];
let tn = jn;
const Zo =
    'textarea{width:100%;min-width:0;color:inherit;font:inherit;background:transparent;border:0;outline:0;overflow-y:hidden;resize:none}',
  Pn = class Pn extends Me {
    getStyleSheet() {
      return Zo;
    }
    get textarea() {
      return this.query('textarea');
    }
    getFormElement() {
      return this.textarea;
    }
    render(e) {
      const { element: t } = e;
      return A`
      <textarea
        id=${N}
        part="textarea"
        rows=${t.getAttribute('rows') ?? '3'}
        name=${t.getAttribute('name') ?? ''}
        .value=${this.normalizeStringValue(this.host.value)}
        placeholder=${t.getAttribute('placeholder') ?? ''}
        aria-describedby=${ee}
        minlength=${We(t.getAttribute('minlength') ?? void 0)}
        maxlength=${We(t.getAttribute('maxlength') ?? void 0)}
        ?disabled=${t.hasAttribute('disabled')}
        ?readonly=${t.hasAttribute('readonly')}
        ?required=${t.hasAttribute('required')}
      ></textarea>
    `;
    }
    updated() {
      this.clampHeight();
    }
    onInput() {
      var e;
      ((this.host.value = ((e = this.textarea) == null ? void 0 : e.value) ?? ''), this.clampHeight());
    }
    getValue() {
      return this.host.value;
    }
    isValid() {
      var e;
      return ((e = this.textarea) == null ? void 0 : e.checkValidity()) ?? null;
    }
    clampHeight() {
      const e = this.textarea;
      if (!e) return;
      e.style.height = 'auto';
      const t = getComputedStyle(e),
        n = this.parsePixelValue(e.style.minHeight || t.minHeight) ?? 0,
        r = this.parsePixelValue(e.style.maxHeight || t.maxHeight) ?? Number.POSITIVE_INFINITY,
        s = Math.min(Math.max(e.scrollHeight, n), r);
      ((e.style.height = `${s}px`), (e.style.overflowY = e.scrollHeight > r ? 'auto' : 'hidden'));
    }
    parsePixelValue(e) {
      const t = Number.parseFloat(e);
      return Number.isFinite(t) ? t : void 0;
    }
  };
Pn.types = ['textarea'];
let nn = Pn;
const Yo = '[part~=token-list]{display:flex;flex-wrap:wrap;width:100%}[part~=token-input]{min-width:0}',
  Hn = class Hn extends Me {
    constructor() {
      (super(...arguments),
        (this.handleDraftInput = () => {
          this.syncHostState();
        }),
        (this.handleDraftCommit = () => {
          this.commitDraftValue();
        }),
        (this.handleKeydown = (e) => {
          var t;
          if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
            (e.preventDefault(), this.commitDraftValue());
            return;
          }
          if (e.key === 'Backspace' && !((t = this.input) != null && t.value)) {
            const n = this.normalizeSelectedValues(this.host.value),
              r = n[n.length - 1];
            r && (e.preventDefault(), this.removeToken(r));
          }
        }));
    }
    getStyleSheet() {
      return Yo;
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
    render(e) {
      const { element: t } = e,
        n = this.normalizeSelectedValues(this.host.value),
        r = this.getAvailableOptions(n);
      return A`
      <div part="token-list" aria-describedby=${ee}>
        ${n.map((s) => {
          const o = this.resolveOption(s),
            a = o != null && o.html ? In(o.html) : ((o == null ? void 0 : o.label) ?? s);
          return A`
            <span part="token">
              <span part="token-text">${a ?? x}</span>
              <button
                type="button"
                part="token-remove"
                aria-label=${`Token "${(o == null ? void 0 : o.label) ?? s}" entfernen`}
                ?disabled=${t.hasAttribute('disabled') || t.hasAttribute('readonly')}
                @click=${() => this.removeToken(s)}
              >
                ×
              </button>
            </span>
          `;
        })}

        <input
          id=${N}
          part="token-input"
          type="text"
          list=${r.length > 0 ? `${N}-options` : ''}
          placeholder=${t.getAttribute('placeholder') ?? ''}
          aria-describedby=${ee}
          ?disabled=${t.hasAttribute('disabled')}
          ?readonly=${t.hasAttribute('readonly')}
          @input=${this.handleDraftInput}
          @change=${this.handleDraftCommit}
          @blur=${this.handleDraftCommit}
          @keydown=${this.handleKeydown}
        />
      </div>

      ${
        r.length > 0
          ? A`
            <datalist id=${`${N}-options`}>
              ${r.map((s) => A`<option value=${s.value}>${s.label}</option>`)}
            </datalist>
          `
          : x
      }
    `;
    }
    onInput(e) {
      e.target === this.input && this.syncHostState();
    }
    onChange(e) {
      e.target === this.input && this.commitDraftValue();
    }
    getValue() {
      return this.normalizeSelectedValues(this.host.value);
    }
    getSelectedOptions() {
      return this.normalizeSelectedValues(this.host.value).map((e) => this.resolveOption(e) ?? { value: e, label: e });
    }
    isValid() {
      return !this.host.hasAttribute('required') || this.host.hasAttribute('disabled')
        ? !0
        : this.normalizeSelectedValues(this.host.value).length > 0;
    }
    isHoverlabelActive() {
      var e;
      return (
        this.hasValue() ||
        this.getDraftValue().length > 0 ||
        ((e = this.host.shadowRoot) == null ? void 0 : e.activeElement) === this.input
      );
    }
    formResetCallback() {
      ((this.host.value = this.getInitValue()), this.clearDraftValue());
    }
    updated() {
      const e = this.normalizeSelectedValues(this.host.value);
      this.areValuesEqual(this.host.value, e) || (this.host.value = e);
    }
    normalizeSelectedValues(e) {
      const t = Array.from(new Set(Je(e)));
      return this.isStrict ? t.filter((n) => this.resolveOption(n)) : t;
    }
    getDraftValue() {
      var e;
      return ((e = this.input) == null ? void 0 : e.value.trim()) ?? '';
    }
    clearDraftValue() {
      this.input && (this.input.value = '');
    }
    commitDraftValue() {
      this.addTokens(this.getDraftValue());
    }
    addTokens(e) {
      if (!e || this.host.hasAttribute('disabled') || this.host.hasAttribute('readonly')) return;
      const t = this.normalizeSelectedValues([
        ...this.normalizeSelectedValues(this.host.value),
        ...e
          .split(/[;,\n]/)
          .map((n) => n.trim())
          .filter(Boolean),
      ]);
      ((this.host.value = t), this.clearDraftValue(), this.dispatchValueEvents());
    }
    removeToken(e) {
      var t;
      this.host.hasAttribute('disabled') ||
        this.host.hasAttribute('readonly') ||
        ((this.host.value = this.normalizeSelectedValues(this.host.value).filter((n) => n !== e)),
        this.dispatchValueEvents(),
        (t = this.input) == null || t.focus());
    }
    getAvailableOptions(e) {
      const t = new Set(e);
      return Ge(this.host).filter((n) => !n.disabled && !t.has(n.value));
    }
    resolveOption(e) {
      return Ge(this.host).find((t) => t.value === e) ?? null;
    }
    areValuesEqual(e, t) {
      const n = Je(e);
      return n.length === t.length && n.every((r, s) => r === t[s]);
    }
    dispatchValueEvents() {
      (this.host.dispatchEvent(new InputEvent('input', { bubbles: !0, composed: !0 })),
        this.host.dispatchEvent(new Event('change', { bubbles: !0, composed: !0 })));
    }
  };
Hn.types = ['token-input'];
let rn = Hn;
Ce.registerPlugin(tn);
Ce.registerPlugin(nn);
Ce.registerPlugin(Qt);
Ce.registerPlugin(en);
Ce.registerPlugin(Yt);
Ce.registerPlugin(rn);
function rt(i, e, t) {
  const n = new DOMParser().parseFromString(e, 'text/html'),
    r = n.body,
    s = n.querySelector('main'),
    o = document.createElement('div');
  ((o.className = 'nte-input-demo'),
    r.className.trim() && o.classList.add(...r.className.trim().split(/\s+/)),
    r.querySelectorAll('script').forEach((a) => a.remove()),
    (o.innerHTML = s ? s.outerHTML : r.innerHTML),
    i.replaceChildren(o),
    t == null || t(o));
}
function Ur(i = document) {
  const e = i.querySelector('#formdata-demo-form'),
    t = i.querySelector('#formdata-json');
  !(e instanceof HTMLFormElement) ||
    !(t instanceof HTMLTextAreaElement) ||
    e.addEventListener('submit', (n) => {
      n.preventDefault();
      const r = Array.from(new FormData(e).entries()).map(([s, o]) => ({ key: s, value: String(o) }));
      t.value = JSON.stringify(r, null, 2);
    });
}
function Kr(i = document) {
  const e = i.querySelector('#form-data-demo'),
    t = i.querySelector('#form-data-json');
  if (!(e instanceof HTMLElement) || !(t instanceof HTMLTextAreaElement)) return;
  const n = new zo(e);
  let r = !1;
  const s = () => {
      r || ((t.value = JSON.stringify(n.data, null, 2)), (t.dataset.invalid = 'false'));
    },
    o = () => {
      try {
        const a = JSON.parse(t.value);
        if (!a || typeof a != 'object' || Array.isArray(a)) throw new Error('JSON must be an object');
        ((r = !0), (n.data = a), (r = !1), (t.dataset.invalid = 'false'), (t.value = JSON.stringify(n.data, null, 2)));
      } catch {
        ((r = !1), (t.dataset.invalid = 'true'));
      }
    };
  (e.addEventListener('input', () => {
    s();
  }),
    e.addEventListener('change', () => {
      s();
    }),
    t.addEventListener('input', () => {
      o();
    }),
    s());
}
function Gr(i = document) {
  const e = i.querySelector('form[action="/demo/05-validation.html"]');
  e instanceof HTMLFormElement &&
    e.addEventListener('submit', (t) => {
      t.preventDefault();
    });
}
Ur();
Kr();
Gr();
const Xo = {
    title: 'Styles & Typen',
    description: 'Themes, Größen, Slots und die wichtigsten eingebauten Input-Typen',
    render(i) {
      rt(i, Ds);
    },
  },
  Qo = Object.freeze(Object.defineProperty({ __proto__: null, default: Xo }, Symbol.toStringTag, { value: 'Module' })),
  ea = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>nte-input FormData Submit Demo</title>
  </head>
  <body>
    <main>
      <h1>nte-input</h1>
      <p>Formularauswertung per <code>FormData</code>.</p>

      <section>
        <h2>FormData Beispiel</h2>
        <p>
          Mit <code>Absenden</code> wird das Formular per <code>FormData</code> ausgewertet. Die Ausgabe erfolgt als
          Array von Key-Value-Objekten – auch für Mehrfachwerte wie <code>select-radio</code> und
          <code>token-input</code>.
        </p>

        <form id="formdata-demo-form">
          <nte-input class="hoverlabel" label="Name" type="text" name="name" value="Max Mustermann"></nte-input>

          <nte-input
            class="hoverlabel"
            label="Kommentar"
            type="textarea"
            name="message"
            value="Hallo aus dem Demo"
          ></nte-input>

          <nte-input class="hoverlabel" label="Status" type="select" name="status" value="inprogress">
            <options>
              <option value="wrust">Wartet auf Rückmeldung</option>
              <option value="inprogress">In Bearbeitung</option>
            </options>
          </nte-input>

          <nte-input
            label="Kategorien"
            type="select-radio"
            name="categories"
            multiple
            value='["news"]'
            data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"}]'
          ></nte-input>

          <nte-input
            class="hoverlabel"
            label="Schlagworte"
            type="token-input"
            name="tags"
            value='["news","docs"]'
            data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"},{"value":"docs","label":"Dokumentation"}]'
          ></nte-input>

          <nte-input label="AGB akzeptieren" type="checkbox" name="accepted" value="yes" checked></nte-input>

          <div class="demo-actions">
            <button id="formdata-submit" type="submit">Absenden</button>
          </div>
        </form>

        <label class="json-label" for="formdata-json">FormData Ausgabe</label>
        <textarea id="formdata-json" class="demo-json" spellcheck="false" readonly></textarea>
      </section>
    </main>

    <script src="/demo/main.js" type="module"><\/script>
  </body>
</html>
`,
  ta = {
    title: 'FormData Submit',
    description: 'Native Formularauswertung über new FormData(form)',
    render(i) {
      rt(i, ea, Ur);
    },
  },
  na = Object.freeze(Object.defineProperty({ __proto__: null, default: ta }, Symbol.toStringTag, { value: 'Module' })),
  ia = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>nte-input FormDataAccessor Demo</title>
  </head>
  <body>
    <main>
      <h1>nte-input</h1>
      <p>Direkte Arbeit mit <code>FormDataAccessor</code> über die <code>value</code>-API.</p>

      <section id="form-data-demo">
        <h2>FormDataAccessor Beispiel</h2>
        <p>
          Die JSON-Ausgabe zeigt direkt <code>FormDataAccessor.data</code>. Änderungen an den Feldern aktualisieren das
          JSON automatisch. Änderungen am JSON werden direkt zurück in die Inputs geschrieben – inklusive Arrays wie bei
          <code>select-radio</code> und <code>token-input</code>.
        </p>

        <div class="demo-form-grid">
          <nte-input class="hoverlabel" label="Name" type="text" name="name" value="Anna Beispiel"></nte-input>

          <nte-input
            class="hoverlabel"
            label="Kommentar"
            type="textarea"
            name="message"
            value="Wert direkt am Host lesen"
          ></nte-input>

          <nte-input class="hoverlabel" label="Status" type="select" name="status" value="inprogress">
            <options>
              <option value="wrust">Wartet auf Rückmeldung</option>
              <option value="inprogress">In Bearbeitung</option>
            </options>
          </nte-input>

          <nte-input
            label="Kategorien"
            type="select-radio"
            name="categories"
            multiple
            value='["news","events"]'
            data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"}]'
          ></nte-input>

          <nte-input
            class="hoverlabel"
            label="Schlagworte"
            type="token-input"
            name="tags"
            value='["news","docs"]'
            data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"},{"value":"docs","label":"Dokumentation"}]'
          ></nte-input>

          <nte-input label="AGB akzeptieren" type="checkbox" name="accepted" value="yes" checked></nte-input>
        </div>

        <label class="json-label" for="form-data-json">FormDataAccessor Ausgabe</label>
        <textarea id="form-data-json" class="demo-json" spellcheck="false"></textarea>
      </section>
    </main>

    <script src="/demo/main.js" type="module"><\/script>
  </body>
</html>
`,
  ra = {
    title: 'FormDataAccessor',
    description: 'Werte direkt als Objekt lesen, anzeigen und zurückschreiben',
    render(i) {
      rt(i, ia, Kr);
    },
  },
  sa = Object.freeze(Object.defineProperty({ __proto__: null, default: ra }, Symbol.toStringTag, { value: 'Module' })),
  oa = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>nte-input Validation Demo</title>
  </head>
  <body>
    <main>
      <h1>nte-input</h1>
      <p>
        Beispiel zum Testen der Formular-Validation mit <code>form</code>, <code>action</code> und <code>method</code>.
      </p>

      <section>
        <h2>Validation Beispiel</h2>
        <p>
          Das Formular nutzt native Submit-Validierung. Bitte die Pflichtfelder leer lassen oder ausfüllen und dann
          <code>Absenden</code> testen.
        </p>

        <form action="/demo/05-validation.html" method="post">
          <nte-input
            class="hoverlabel"
            label="Name *"
            type="text"
            name="name"
            placeholder="Max Mustermann"
            required
          ></nte-input>

          <nte-input
            class="hoverlabel"
            label="E-Mail *"
            type="email"
            name="email"
            placeholder="name@example.com"
            required
          ></nte-input>

          <nte-input
            class="hoverlabel"
            label="PLZ * (5 Ziffern)"
            type="text"
            name="zip"
            pattern="^\\d{5}$"
            placeholder="12345"
            required
          ></nte-input>

          <nte-input class="hoverlabel" label="Kommentar *" type="textarea" name="message" required></nte-input>

          <nte-input class="hoverlabel" label="Status *" type="select" name="status" required>
            <options>
              <option value="">Bitte wählen</option>
              <option value="draft">Entwurf</option>
              <option value="inprogress">In Bearbeitung</option>
            </options>
          </nte-input>

          <nte-input
            class="hoverlabel"
            label="Schlagworte *"
            type="token-input"
            name="tags"
            required
            data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"},{"value":"docs","label":"Dokumentation"}]'
            validation-message="Bitte mindestens ein Schlagwort eingeben oder auswählen."
          ></nte-input>

          <nte-input label="AGB akzeptieren *" type="checkbox" name="accepted" value="yes" required></nte-input>

          <div class="demo-actions">
            <button type="submit">Absenden</button>
          </div>
        </form>
      </section>
    </main>

    <script src="/demo/main.js" type="module"><\/script>
  </body>
</html>
`,
  aa = {
    title: 'Validation',
    description: 'Pflichtfelder, Pattern und native Browser-Validierung',
    render(i) {
      rt(i, oa, Gr);
    },
  },
  la = Object.freeze(Object.defineProperty({ __proto__: null, default: aa }, Symbol.toStringTag, { value: 'Module' })),
  da = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>nte-input Select-Radio Vertical Demo</title>
  </head>
  <body class="wide-demo">
    <main>
      <h1>nte-input Select-Radio Vertical</h1>
      <p>
        Die Variante <code>.default.select-radio-vertical</code> wird auf ein Form bzw. einen Container gelegt und stylt
        darin nur <code>nte-input[type="select-radio"]</code>. Die Radios werden innerhalb des jeweiligen Inputs
        nebeneinander gerendert. Mindestbreite pro Element: 350px. Bei Umbruch entsteht zusätzlich eine horizontale
        Trennlinie.
      </p>

      <section>
        <h2>Zwei Optionen nebeneinander im Input</h2>
        <form class="default select-radio-vertical demo-select-radio-vertical-form">
          <nte-input
            label="Status"
            type="select-radio"
            value="inprogress"
            data-options="wrust|Wartet auf Rückmeldung;inprogress|In Bearbeitung"
          ></nte-input>
        </form>
      </section>

      <section>
        <h2>Mit Overflow / Umbruch im Input</h2>
        <form class="default select-radio-vertical demo-select-radio-vertical-form narrow">
          <nte-input
            label="Kategorien"
            type="select-radio"
            multiple
            value='["news","internal"]'
            data-options='[{"value":"news","label":"News"},{"value":"events","label":"Events"},{"value":"internal","label":"Intern"},{"value":"release","label":"Release"}]'
          ></nte-input>
        </form>
      </section>
    </main>

    <script src="/demo/main.js" type="module"><\/script>
  </body>
</html>
`,
  ca = {
    title: 'Select-Radio Vertical',
    description: 'Layout-Mixin für nebeneinander angeordnete Optionen mit Umbruch',
    render(i) {
      rt(i, da);
    },
  },
  ua = Object.freeze(Object.defineProperty({ __proto__: null, default: ca }, Symbol.toStringTag, { value: 'Module' })),
  ha = `
.style-button-demo {
  display: grid;
  gap: 1.5rem;
  max-width: 980px;
}

.style-button-demo section {
  display: grid;
  gap: .75rem;
}

.style-button-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
  align-items: center;
}

.style-button-demo__dropdown {
  display: inline-grid;
  gap: .5rem;
  max-width: 240px;
}
`,
  pa = {
    title: 'Buttons',
    group: 'style-button',
    description: 'Standard-, Outline-, Größen-, Lead-, Glow- und Gruppen-Varianten',
    css: ['default', ha],
    html: `
    <div class="style-button-demo">
      <section>
        <h2>Button Elemente</h2>
        <div class="style-button-demo__row">
          <a class="btn btn-primary" href="#" role="button">Link</a>
          <button class="btn btn-primary" type="button">Button</button>
          <input class="btn btn-primary" type="button" value="Input" />
          <input class="btn btn-primary" type="submit" value="Submit" />
          <input class="btn btn-primary" type="reset" value="Reset" />
        </div>
      </section>

      <section>
        <h2>Varianten</h2>
        <div class="style-button-demo__row">
          <button class="btn" type="button">Default</button>
          <button class="btn btn-primary" type="button">Primary</button>
          <button class="btn btn-accent" type="button">Accent</button>
          <button class="btn btn-secondary" type="button">Secondary</button>
          <button class="btn btn-tertiary" type="button">Tertiary</button>
          <button class="btn btn-success" type="button">Success</button>
          <button class="btn btn-danger" type="button">Danger</button>
          <button class="btn btn-warning" type="button">Warning</button>
          <button class="btn btn-info" type="button">Info</button>
          <button class="btn btn-light" type="button">Light</button>
          <button class="btn btn-dark" type="button">Dark</button>
          <button class="btn btn-link" type="button">Link</button>
        </div>
      </section>

      <section>
        <h2>Outline Varianten</h2>
        <div class="style-button-demo__row">
          <button class="btn btn-outline-primary" type="button">Primary</button>
          <button class="btn btn-outline-accent" type="button">Accent</button>
          <button class="btn btn-outline-secondary" type="button">Secondary</button>
          <button class="btn btn-outline-tertiary" type="button">Tertiary</button>
          <button class="btn btn-outline-success" type="button">Success</button>
          <button class="btn btn-outline-danger" type="button">Danger</button>
          <button class="btn btn-outline-warning" type="button">Warning</button>
          <button class="btn btn-outline-info" type="button">Info</button>
          <button class="btn btn-outline-light" type="button">Light</button>
          <button class="btn btn-outline-dark" type="button">Dark</button>
        </div>
      </section>

      <section>
        <h2>Größen</h2>
        <div class="style-button-demo__row">
          <button class="btn btn-primary btn-sm" type="button">Small</button>
          <button class="btn btn-primary" type="button">Default</button>
          <button class="btn btn-primary btn-lg" type="button">Large</button>
          <button class="btn btn-primary btn-xl" type="button">Extra Large</button>
          <button class="btn btn-primary btn-xxl" type="button">XXL</button>
        </div>
      </section>

      <section>
        <h2>Lead und Glow</h2>
        <div class="style-button-demo__row">
          <a class="btn btn-primary btn-lead btn-glow btn-glow-on-view" href="#">Termin vereinbaren</a>
          <a class="btn btn-outline-primary btn-lead btn-glow" href="#">Mehr erfahren</a>
          <button class="btn btn-secondary btn-glow" type="button">Hover Glow</button>
        </div>
      </section>

      <section>
        <h2>Disabled</h2>
        <div class="style-button-demo__row">
          <button class="btn btn-primary" type="button" disabled>Primary</button>
          <button class="btn btn-secondary" type="button" disabled>Secondary</button>
          <button class="btn btn-outline-primary" type="button" disabled>Outline</button>
        </div>
      </section>

      <section>
        <h2>Button Groups</h2>
        <div class="style-button-demo__row">
          <div class="btn-group" role="group" aria-label="Primary group">
            <button class="btn btn-primary" type="button">Links</button>
            <button class="btn btn-primary" type="button">Mitte</button>
            <button class="btn btn-primary" type="button">Rechts</button>
          </div>
          <div class="btn-group" role="group" aria-label="Outline group">
            <button class="btn btn-outline-primary" type="button">Links</button>
            <button class="btn btn-outline-primary" type="button">Mitte</button>
            <button class="btn btn-outline-primary" type="button">Rechts</button>
          </div>
        </div>
      </section>

      <section>
        <h2>Dropdown</h2>
        <div class="style-button-demo__dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button">Dropdown Button</button>
          <ul class="dropdown-menu">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><hr /></li>
            <li><a href="#">Something else here</a></li>
          </ul>
        </div>
      </section>
    </div>
  `,
  },
  ma = Object.freeze(Object.defineProperty({ __proto__: null, default: pa }, Symbol.toStringTag, { value: 'Module' }));
function ie(i, e) {
  const t = e.default ?? e,
    n = typeof t == 'object' && t !== null ? t : {},
    r = typeof n.render == 'function' ? n.render : typeof e.render == 'function' ? e.render : void 0;
  return { ...n, filename: n.filename ?? i, ...(r ? { render: r } : {}) };
}
const fa = [
  ie('nextrap-elements/nte-input/demo/01-overview.demo.ts', Ts),
  ie('nextrap-elements/nte-input/demo/02-hover-style.demo.ts', Qo),
  ie('nextrap-elements/nte-input/demo/03-form-action.demo.ts', na),
  ie('nextrap-elements/nte-input/demo/04-form-data.demo.ts', sa),
  ie('nextrap-elements/nte-input/demo/05-validation.demo.ts', la),
  ie('nextrap-elements/nte-input/demo/06-select-radio-vertical.demo.ts', ua),
  ie('nextrap-styles/style-button/demo/01-buttons.demo.ts', ma),
];
function bi() {
  const i = document.querySelector('tj-demo-viewer');
  return i ? ((i.demos = fa), !0) : !1;
}
bi() ||
  window.addEventListener(
    'tj:viewerReady',
    () => {
      bi();
    },
    { once: !0 },
  );
