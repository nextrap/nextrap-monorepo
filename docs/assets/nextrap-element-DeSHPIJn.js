var zt = Object.defineProperty;
var rt = (r) => {
  throw TypeError(r);
};
var Ft = (r, t, e) => (t in r ? zt(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (r[t] = e));
var v = (r, t, e) => Ft(r, typeof t != 'symbol' ? t + '' : t, e),
  F = (r, t, e) => t.has(r) || rt('Cannot ' + e);
var g = (r, t, e) => (F(r, t, 'read from private field'), e ? e.call(r) : t.get(r)),
  y = (r, t, e) =>
    t.has(r) ? rt('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(r) : t.set(r, e),
  k = (r, t, e, n) => (F(r, t, 'write to private field'), n ? n.call(r, e) : t.set(r, e), e),
  _ = (r, t, e) => (F(r, t, 'access private method'), e);
import { r as Ht, i as mt, y as qt, b as Vt } from './_virtual_tdemo-client-CxMeb5Rk.js';
import { t as gt, n as V } from './property-C2fH_zxw.js';
const D = [
    { name: 'xs', minWidth: 0 },
    { name: 'sm', minWidth: 576 },
    { name: 'md', minWidth: 768 },
    { name: 'lg', minWidth: 992 },
    { name: 'xl', minWidth: 1200 },
    { name: 'xxl', minWidth: 1400 },
  ],
  nt = D.reduce((r, t) => ((r[t.name] = t.minWidth), r), {});
function W(r) {
  if (!(r in nt)) throw new Error(`Unknown breakpoint: ${r}`);
  return nt[r];
}
function Ut() {
  return window.visualViewport ? window.visualViewport.width : window.innerWidth;
}
function jt(r) {
  r === void 0 && (r = Ut());
  for (let t = D.length - 1; t >= 0; t--) if (r >= D[t].minWidth) return D[t].name;
  return 'xs';
}
function yt(r, t = {}, e = []) {
  Array.isArray(e) || (e = [e]);
  const n = document.createElement(r);
  for (const i in t) t[i] !== null && t[i] !== void 0 && n.setAttribute(i, t[i] !== !0 ? t[i] : '');
  for (const i of e) n.append(typeof i == 'string' ? document.createTextNode(i) : i);
  return n;
}
class Gt {
  constructor(t, e = !1) {
    v(this, 'timeout', null);
    v(this, 'startTimeWithMs', 0);
    v(this, 'maxTimeout', null);
    ((this.delay = t), (this.max_delay = e));
  }
  async wait() {
    return (
      this.startTimeWithMs === 0 && (this.startTimeWithMs = Date.now()),
      this.timeout &&
        (this.max_delay === !1 || this.startTimeWithMs + this.max_delay > Date.now()) &&
        (clearTimeout(this.timeout), (this.timeout = null)),
      new Promise((t) => {
        this.timeout ||
          (this.timeout = setTimeout(() => {
            ((this.timeout = null), (this.startTimeWithMs = 0), t(!0));
          }, this.delay));
      })
    );
  }
  debounce(t) {
    const e = Date.now();
    this.startTimeWithMs === 0 && (this.startTimeWithMs = e);
    const n = () => {
      (this.timeout && (clearTimeout(this.timeout), (this.timeout = null)),
        this.maxTimeout && (clearTimeout(this.maxTimeout), (this.maxTimeout = null)),
        (this.startTimeWithMs = 0),
        t());
    };
    if (
      (this.timeout && clearTimeout(this.timeout),
      (this.timeout = setTimeout(n, this.delay)),
      this.max_delay !== !1 && !this.maxTimeout)
    ) {
      const i = e - this.startTimeWithMs,
        s = Math.max(0, this.max_delay - i);
      this.maxTimeout = setTimeout(n, s);
    }
  }
}
class Kt {
  constructor(t, e, n, i = 'main') {
    ((this._debug = t), (this.myTag = e), (this.myElementId = n), (this.instanceId = i));
  }
  debug(...t) {
    this._debug && console.debug(`[DEBUG][${this.myTag}:${this.myElementId}:${this.instanceId}]`, ...t);
  }
  log(...t) {
    console.log(`[LOG][${this.myTag}:${this.myElementId}:${this.instanceId}]`, ...t);
  }
  warn(...t) {
    console.warn(`[WARN][${this.myTag}:${this.myElementId}:${this.instanceId}]`, ...t);
  }
  error(...t) {
    console.error(`[ERROR][${this.myTag}:${this.myElementId}:${this.instanceId}]`, ...t);
  }
  throwError(...t) {
    const e = `[ERROR][${this.myTag}:${this.myElementId}:${this.instanceId}] ${t.join(' ')}`;
    throw (this.error(...t), new Error(e));
  }
}
class Jt {
  constructor(t, e = !0) {
    v(this, 'label');
    v(this, 'last');
    v(this, 'startTime');
    v(this, 'running', !1);
    v(this, 'enabled');
    ((this.label = t), (this.enabled = e), (this.startTime = this.last = performance.now()), (this.running = !0));
  }
  lap(t = '') {
    if (!this.enabled) return;
    const e = performance.now(),
      n = (e - this.last) / 1e3;
    ((this.last = e), console.debug(`[${this.label}] ${t} +${n.toFixed(3)}s`));
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
function Xt(r) {
  return typeof r == 'object' && r !== null && !Array.isArray(r);
}
function Qt(r) {
  if (r != null)
    try {
      return JSON.parse(r);
    } catch {
      return;
    }
}
function it(r) {
  const t = JSON.stringify(r);
  return t === void 0 ? 'null' : t;
}
function Zt(r, t) {
  const e = { ...t };
  if (Xt(r)) for (const n of Object.keys(t)) n in r && (e[n] = r[n]);
  return e;
}
class vt {
  constructor(t, e, n) {
    v(this, 'cache');
    ((this.backend = t), (this.storageKey = e), (this.initialValue = n));
  }
  read() {
    if (this.cache) return this.cache;
    const t = this.backend ? Qt(this.backend.getItem(this.storageKey)) : void 0,
      e = Zt(t, this.initialValue);
    if (this.backend && this.backend.getItem(this.storageKey) == null)
      try {
        this.backend.setItem(this.storageKey, it(e));
      } catch {}
    return ((this.cache = e), e);
  }
  write(t) {
    if (((this.cache = t), !!this.backend))
      try {
        this.backend.setItem(this.storageKey, it(t));
      } catch {}
  }
  asProxy() {
    const t = {
      get: (e, n) => {
        if (typeof n == 'symbol') return n === Symbol.toStringTag ? 'Storage' : void 0;
        const i = this.read();
        return n === 'toJSON' ? () => ({ ...i }) : i[n];
      },
      set: (e, n, i) => {
        if (typeof n != 'string') return !1;
        const o = { ...this.read() };
        return ((o[n] = i), this.write(o), !0);
      },
      deleteProperty: (e, n) => {
        if (typeof n != 'string') return !1;
        const i = this.read();
        if (!(n in i)) return !0;
        const s = { ...i };
        return (delete s[n], this.write(s), !0);
      },
      has: (e, n) => {
        if (typeof n != 'string') return !1;
        const i = this.read();
        return n in i;
      },
      ownKeys: () => {
        const e = this.read();
        return Reflect.ownKeys(e);
      },
      getOwnPropertyDescriptor: (e, n) => {
        if (typeof n != 'string') return;
        const i = this.read();
        if (n in i) return { enumerable: !0, configurable: !0, writable: !0, value: i[n] };
      },
    };
    return new Proxy({}, t);
  }
}
function bt(r) {
  const t = globalThis.window;
  return (r === 'session' ? (t == null ? void 0 : t.sessionStorage) : t == null ? void 0 : t.localStorage) ?? void 0;
}
function Yt(r, t) {
  return new vt(bt('session'), r, t).asProxy();
}
function Re(r, t) {
  return new vt(bt('local'), r, t).asProxy();
}
function wt() {
  return document.readyState === 'loading'
    ? new Promise((r) => {
        document.addEventListener('DOMContentLoaded', () => r());
      })
    : Promise.resolve();
}
function te(r) {
  var e, n;
  class t extends r {
    constructor() {
      super(...arguments);
      y(this, e, new Gt(200, 5e3));
      v(this, 'currentBreakPoint', null);
      y(this, n, async () => {
        var h;
        (await g(this, e).wait(), await wt());
        const o = this,
          l = window.innerWidth;
        let d = getComputedStyle(o).getPropertyValue('--breakpoint');
        if (!d || d === '') return;
        d = d.trim().replace(/^['"]|['"]$/g, '');
        const u = d.split(','),
          c = u[0].trim(),
          a = ((h = u[1]) == null ? void 0 : h.trim()) ?? c,
          f = jt(l);
        this.currentBreakPoint !== f &&
          (W(a) <= W(f)
            ? o.setAttribute('mode', 'desktop')
            : W(c) > W(f)
              ? o.setAttribute('mode', 'mobile')
              : o.setAttribute('mode', 'tablet'));
      });
    }
    connectedCallback() {
      super.connectedCallback();
      try {
        (g(this, n).call(this), window.addEventListener('resize', g(this, n)), g(this, n).call(this));
      } catch (o) {
        throw (console.error('Error in BreakPointMixin:', o, 'in element', this), o);
      }
    }
    disconnectedCallback() {
      (super.disconnectedCallback(), window.removeEventListener('resize', g(this, n)));
    }
  }
  return ((e = new WeakMap()), (n = new WeakMap()), t);
}
const O = Symbol('listenerDefs'),
  _t = Symbol('withEventBindings');
function ze(r, t) {
  const e = Array.isArray(r) ? r : [r];
  return function (n, i) {
    if (i.kind !== 'method') throw new Error('@Listen nur für Methoden');
    return (
      i.addInitializer(function () {
        const s = this;
        (s[O] || (s[O] = [])).push({ method: i.name, events: [...e], opts: t });
      }),
      function (...s) {
        if (!this[_t]) throw new Error('[EventBindings] @Listen - decorator requires EventBindingMixin.');
        return n.apply(this, s);
      }
    );
  };
}
function ee(r, t) {
  var e;
  return !t || t === 'host'
    ? r
    : t === 'document'
      ? (r.ownerDocument ?? document)
      : t === 'window'
        ? (((e = r.ownerDocument) == null ? void 0 : e.defaultView) ?? window)
        : t === 'shadowRoot'
          ? (r.shadowRoot ?? r)
          : typeof t == 'function'
            ? t(r)
            : t;
}
function Et(r) {
  var e, n, xt;
  class t extends r {
    constructor(...l) {
      super(...l);
      y(this, n);
      y(this, e);
      this[_t] = !0;
    }
    connectedCallback() {
      var l;
      ((l = super.connectedCallback) == null || l.call(this), _(this, n, xt).call(this));
    }
    disconnectedCallback() {
      var l, d;
      ((l = g(this, e)) == null || l.abort(), (d = super.disconnectedCallback) == null || d.call(this));
    }
  }
  return (
    (e = new WeakMap()),
    (n = new WeakSet()),
    (xt = function () {
      var d, u, c;
      ((d = g(this, e)) == null || d.abort(), k(this, e, new AbortController()));
      const l = this[O] || [];
      for (const a of l) {
        const f = ee(this, (u = a.opts) == null ? void 0 : u.target),
          h = ((c = a.opts) == null ? void 0 : c.options) ?? {},
          b = this[a.method].bind(this);
        for (const x of a.events) f.addEventListener(x, b, { ...h, signal: g(this, e).signal });
      }
    }),
    t
  );
}
let re = 1;
function Ct(r) {
  var e, n, i;
  class t extends r {
    constructor() {
      super(...arguments);
      y(this, e, null);
      y(this, n, re++);
      y(this, i, null);
    }
    invalidateDebugCache() {
      k(this, e, null);
    }
    get _debug() {
      return g(this, e) !== null
        ? g(this, e)
        : (this instanceof HTMLElement &&
            k(
              this,
              e,
              this.hasAttribute('debug') && !['false', '0', 'off', 'no'].includes(this.getAttribute('debug') || ''),
            ),
          g(this, e) === !0 &&
            console.info(`[DEBUG][ID:${g(this, n)}] LoggingMixin: Debug mode is enabled for <${this.tagName}>`, this),
          g(this, e) ?? !1);
    }
    getLogger(l = 'main') {
      const d = '<' + (this.tagName || this.constructor.name || 'UnknownElement') + '>';
      return (g(this, i) || k(this, i, new Kt(this._debug, d, `${g(this, n)}`, l)), g(this, i));
    }
    debug(...l) {
      this.getLogger().debug(...l);
    }
    log(...l) {
      this.getLogger().log(...l);
    }
    warn(...l) {
      this.getLogger().warn(...l);
    }
    error(...l) {
      this.getLogger().error(...l);
    }
    throwError(...l) {
      return this.getLogger().throwError(...l);
    }
  }
  return ((e = new WeakMap()), (n = new WeakMap()), (i = new WeakMap()), t);
}
function kt(r) {
  class t extends r {
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
      var i;
      ((i = super.firstUpdated) == null || i.call(this, n),
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
  return t;
}
function ne(r) {
  var e, At, i, B, Lt;
  class t extends r {
    constructor() {
      super(...arguments);
      y(this, e);
      y(this, i, (u) => {
        const c = u.target,
          a = _(this, e, B).call(this, c.assignedNodes({ flatten: !0 })),
          f = _(this, e, B).call(this, c.childNodes);
        a || f ? c.classList.remove('slot-empty') : c.classList.add('slot-empty');
      });
    }
    firstUpdated(u) {
      var c;
      ((c = super.firstUpdated) == null || c.call(this, u), _(this, e, At).call(this));
    }
  }
  return (
    (e = new WeakSet()),
    (At = function () {
      var c;
      const u = (c = this.shadowRoot) == null ? void 0 : c.querySelectorAll('slot');
      u == null ||
        u.forEach((a) => {
          (_(this, e, B).call(this, a.childNodes) || a.classList.add('slot-empty'),
            a.addEventListener('slotchange', (f) => g(this, i).call(this, f)));
        });
    }),
    (i = new WeakMap()),
    (B = function (u) {
      return Array.from(u).some((c) => _(this, e, Lt).call(this, c));
    }),
    (Lt = function (u) {
      return u.nodeType === Node.TEXT_NODE ? (u.textContent || '').trim().length > 0 : u.nodeType === Node.ELEMENT_NODE;
    }),
    t
  );
}
const ie =
  ':host{--border-color: red;--background-color: lightgray;font-family:Arial,sans-serif}#error-fixed-indicator{position:fixed;top:10px;right:10px;cursor:pointer;z-index:100000;padding:5px 10px;width:auto;max-width:90vw;min-width:100px;height:auto;box-shadow:0 4px 8px #0003;border:5px solid white;color:#fff;background-color:red;animation:blink 1s infinite;border-radius:15px;font-size:20px;font-weight:700;font-family:Arial,sans-serif}@keyframes blink{0%,to{background-color:#000}50%{background-color:red}}#error{background-color:var(--background-color);border:3px solid var(--border-color);padding:10px;margin:10px;border-radius:5px}h1{color:red;font-size:24px;margin:0}.error-details{font-size:14px;max-height:200px;overflow:auto}';
var se = Object.create,
  G = Object.defineProperty,
  oe = Object.getOwnPropertyDescriptor,
  St = (r, t) => ((t = Symbol[r]) ? t : Symbol.for('Symbol.' + r)),
  S = (r) => {
    throw TypeError(r);
  },
  ae = (r, t, e) => (t in r ? G(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (r[t] = e)),
  st = (r, t) => G(r, 'name', { value: t, configurable: !0 }),
  le = (r) => [, , , se((r == null ? void 0 : r[St('metadata')]) ?? null)],
  Tt = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  I = (r) => (r !== void 0 && typeof r != 'function' ? S('Function expected') : r),
  ce = (r, t, e, n, i) => ({
    kind: Tt[r],
    name: t,
    metadata: n,
    addInitializer: (s) => (e._ ? S('Already initialized') : i.push(I(s || null))),
  }),
  ue = (r, t) => ae(t, St('metadata'), r[3]),
  q = (r, t, e, n) => {
    for (var i = 0, s = r[t >> 1], o = s && s.length; i < o; i++) t & 1 ? s[i].call(e) : (n = s[i].call(e, n));
    return n;
  },
  $t = (r, t, e, n, i, s) => {
    var o,
      l,
      d,
      u,
      c,
      a = t & 7,
      f = !!(t & 8),
      h = !!(t & 16),
      b = a > 3 ? r.length + 1 : a ? (f ? 1 : 2) : 0,
      x = Tt[a + 5],
      $ = a > 3 && (r[b - 1] = []),
      z = r[b] || (r[b] = []),
      m =
        a &&
        (!h && !f && (i = i.prototype),
        a < 5 &&
          (a > 3 || !h) &&
          oe(
            a < 4
              ? i
              : {
                  get [e]() {
                    return ot(this, s);
                  },
                  set [e](p) {
                    return at(this, s, p);
                  },
                },
            e,
          ));
    a ? h && a < 4 && st(s, (a > 2 ? 'set ' : a > 1 ? 'get ' : '') + e) : st(i, e);
    for (var E = n.length - 1; E >= 0; E--)
      ((u = ce(a, e, (d = {}), r[3], z)),
        a &&
          ((u.static = f),
          (u.private = h),
          (c = u.access = { has: h ? (p) => de(i, p) : (p) => e in p }),
          a ^ 3 && (c.get = h ? (p) => (a ^ 1 ? ot : fe)(p, i, a ^ 4 ? s : m.get) : (p) => p[e]),
          a > 2 && (c.set = h ? (p, C) => at(p, i, C, a ^ 4 ? s : m.set) : (p, C) => (p[e] = C))),
        (l = (0, n[E])(a ? (a < 4 ? (h ? s : m[x]) : a > 4 ? void 0 : { get: m.get, set: m.set }) : i, u)),
        (d._ = 1),
        a ^ 4 || l === void 0
          ? I(l) && (a > 4 ? $.unshift(l) : a ? (h ? (s = l) : (m[x] = l)) : (i = l))
          : typeof l != 'object' || l === null
            ? S('Object expected')
            : (I((o = l.get)) && (m.get = o), I((o = l.set)) && (m.set = o), I((o = l.init)) && $.unshift(o)));
    return (a || ue(r, i), m && G(i, e, m), h ? (a ^ 4 ? s : m) : i);
  },
  K = (r, t, e) => t.has(r) || S('Cannot ' + e),
  de = (r, t) => (Object(t) !== t ? S('Cannot use the "in" operator on this value') : r.has(t)),
  ot = (r, t, e) => (K(r, t, 'read from private field'), e ? e.call(r) : t.get(r)),
  he = (r, t, e) =>
    t.has(r) ? S('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(r) : t.set(r, e),
  at = (r, t, e, n) => (K(r, t, 'write to private field'), n ? n.call(r, e) : t.set(r, e), e),
  fe = (r, t, e) => (K(r, t, 'access private method'), e),
  It,
  U,
  Pt,
  A,
  J;
Pt = [gt('tj-error-element')];
class L extends ((U = mt), (It = [V({ type: String, reflect: !0 })]), U) {
  constructor(t = 'An error occurred', e) {
    (super(),
      (this.originalCode = void 0),
      he(this, J, q(A, 8, this)),
      q(A, 11, this),
      (this.message = t),
      (this.originalCode = e));
  }
  static get is() {
    return 'tj-error-element';
  }
  render() {
    return Vt`
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
A = le(U);
J = new WeakMap();
$t(A, 4, 'message', It, L, J);
L = $t(A, 0, 'TjErrorElement', Pt, L);
L.styles = [Ht(ie)];
q(A, 1, L);
function X(r, { allowAttributes: t = !0, ignoreGaps: e = !0 } = {}) {
  let n = 'div',
    i = null,
    s = [],
    o = [],
    l = {};
  const d = /(^[a-z][\w-]*)|#[\w-]+|\.[\w:-]+|\[\s*([\w-]+)(?:\s*=\s*(['"]?)(.*?)\3)?\s*\]/gi;
  let u = 0;
  for (;;) {
    const c = d.exec(r);
    if (!c || c.index !== u) {
      if (!e && c && c.index > u) break;
      break;
    }
    const a = c[0];
    if (a[0] === '#') i = a.slice(1);
    else if (a[0] === '.') s.push(a.slice(1));
    else if (a[0] === '[') {
      if (!t) throw new Error(`Attributes not allowed: '${a}'`);
      const f = c[2],
        h = c[4] || void 0;
      (o.push({ name: f, value: h }), (l[f] = h));
    } else n = a;
    u += a.length;
  }
  return { tag: n, id: i, classes: s, attrs: o, attrsMap: l, length: u, rest: r.slice(u) };
}
function pe(r) {
  return typeof r.beforeLayoutCallback == 'function';
}
function me(r, t, e) {
  const n = /^(=|\+|!|-|\/|)([0-9]+(?:\.[0-9]+)?|);?/,
    i = e.replace(n, ''),
    s = X(i),
    l = Array.from(r.attributes).reduce((a, f) => ((a[f.name] = f.value), a), {});
  (s.classes.length > 0 && (l.class = (l.class ? l.class + ' ' : '') + s.classes.join(' ')), s.id && (l.id = s.id));
  const d = s.tag || 'section';
  let u = !1,
    c = yt(d, { ...l, layoutOrig: e });
  if (d.includes('-') && !customElements.get(d))
    (console.warn(`Custom element <${d}> is not registered.`),
      (c = new L(`Custom element <${d}> is not registered.`, r.outerHTML)),
      r.replaceWith(c),
      c.append(r),
      (u = !0));
  else {
    const a = Array.from(r.children);
    (pe(c) && (u = c.beforeLayoutCallback(r, c, a) === !1),
      (c.__ORIG_ELEMENT__ = r),
      c.append(...Array.from(r.children)),
      r.replaceWith(c));
  }
  return { replacementElement: c, skipChildren: u };
}
function R(r, t = {}) {
  const { recursive: e = !0 } = t,
    n = [];
  if (Array.isArray(r)) return (r.forEach((l) => n.push(...R(l, t))), n);
  if (!(r instanceof HTMLElement)) return [];
  const i = r.getAttribute('layout');
  let s = !1,
    o = r;
  return (
    i && ({ replacementElement: o, skipChildren: s } = me(r, t, i)),
    e && !s && Array.from(o.children).forEach((l) => n.push(...R(l, t))),
    n
  );
}
const H = /^(=|\+|!|-|\/|)([0-9]+(?:\.[0-9]+)?|)(;|$)/;
class ge {
  constructor(t, e = !1) {
    ((this.debug = e),
      (this.currentContainerNode = null),
      (this.containerPath = []),
      (this.containerIndex = [0]),
      (this.controlLayoutIndex = []),
      (this.lastFixedI = 20),
      (this.currentContainerNode = this.rootNode = t),
      this.containerPath.push(this.rootNode));
  }
  getI(t) {
    const e = t.tagName,
      n = t.getAttribute('layout'),
      i = { i: -99, variant: 'new', tag: 'hr', hi: null };
    if (n) {
      const s = n.match(H);
      if (s) {
        const o = s[1];
        ((i.variant =
          o === '=' || o === '+' ? 'append' : o === '!' || o === '-' ? 'skip' : o === '/' ? 'close' : 'new'),
          s[2] !== '' && (i.i = parseFloat(s[2]) * 10));
      }
    }
    if (e === 'HR' && n === null) return null;
    if (i.variant === 'close') {
      if (e !== 'HR') throw new Error('layout close syntax (/i;) is only supported on HR control elements');
      if (i.i === -99) {
        const s = this.controlLayoutIndex[this.controlLayoutIndex.length - 1];
        if (s === void 0) throw new Error('Cannot close current layout level: no open HR layout wrapper');
        i.i = s;
      }
      return i;
    }
    if (e === 'HR') return (i.i === -99 ? (i.i = this.lastFixedI + 5) : (this.lastFixedI = i.i), i);
    if (e.startsWith('H') && e.length === 2) {
      let s = e.substring(1);
      return (
        (i.tag = 'h'),
        (i.hi = parseInt(s)),
        s === '1' && (s = '2'),
        i.i === -99 && (i.i = parseInt(s) * 10),
        (this.lastFixedI = i.i),
        i
      );
    }
    return null;
  }
  stripControlOnlyLayout(t) {
    const e = t.getAttribute('layout');
    if (!e) return;
    const n = e.match(H);
    n && e.slice(n[0].length).trim() === '' && t.removeAttribute('layout');
  }
  getAttributeRecords(t, e = !1) {
    const n = {},
      i = t.getAttribute('layout');
    let s = null;
    if (i) {
      const o = i.replace(H, '').trim();
      o !== '' && (s = X(o));
    }
    for (const o of Array.from(t.attributes))
      o.name.startsWith('section-')
        ? (n[o.name.replace(/^section-/, '')] = o.value)
        : (o.name.startsWith('layout') || e) && ((n[o.name] = o.value), t.removeAttribute(o.name));
    return (
      e ||
        Array.from(t.classList).forEach((o) => {
          o.startsWith('section-') &&
            ((n.class = (n.class ? n.class + ' ' : '') + o.replace(/^section-/, '')), t.classList.remove(o));
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
  createNewContainerNode(t, e) {
    const n = this.getAttributeRecords(t, t.tagName === 'HR'),
      i = yt('section', n);
    return ((i.__IT = e), i);
  }
  arrangeSingleNode(t, e) {
    let n = 0;
    for (n = 0; n < this.containerIndex.length && !(this.containerIndex[n] >= e.i); n++);
    let i;
    if (e.variant === 'append') {
      const o = this.containerPath[n];
      if (!o || this.containerIndex[n] !== e.i)
        throw new Error(`Cannot append to layout level ${e.i / 10}: no existing section at this level`);
      ((i = o), this.stripControlOnlyLayout(t));
    } else i = this.createNewContainerNode(t, e);
    const s = this.containerPath[n - 1];
    if (!s) throw new Error(`Cannot create layout level ${e.i / 10}: no parent container`);
    ((this.containerPath.length = n),
      (this.containerIndex.length = n),
      t.tagName === 'HR' && (t.setAttribute('aria-hidden', 'true'), t.setAttribute('hidden', 'hidden')),
      i.appendChild(t),
      s.appendChild(i),
      this.containerPath.push(i),
      this.containerIndex.push(e.i),
      (this.currentContainerNode = i),
      t.tagName === 'HR' && e.variant === 'new' && this.controlLayoutIndex.push(e.i));
  }
  closeLevel(t) {
    for (; this.containerIndex.length > 1 && this.containerIndex[this.containerIndex.length - 1] >= t;)
      (this.containerIndex.pop(), this.containerPath.pop());
    for (; this.controlLayoutIndex.length && this.controlLayoutIndex[this.controlLayoutIndex.length - 1] >= t;)
      this.controlLayoutIndex.pop();
    this.currentContainerNode = this.containerPath[this.containerPath.length - 1] ?? this.rootNode;
  }
  appendToCurrentContainer(t) {
    if (this.currentContainerNode === null) throw new Error('No current container node set');
    this.currentContainerNode.appendChild(t);
  }
  arrange(t) {
    for (const e of t) {
      if (e.nodeType !== Node.ELEMENT_NODE) {
        this.appendToCurrentContainer(e);
        continue;
      }
      const n = e,
        i = this.getI(n);
      if (!i) {
        this.appendToCurrentContainer(e);
        continue;
      }
      if (i.variant === 'close') {
        (n.parentNode && n.parentNode.removeChild(n), this.closeLevel(i.i));
        continue;
      }
      if (i.variant === 'skip') {
        (this.stripControlOnlyLayout(n), this.appendToCurrentContainer(e));
        continue;
      }
      this.arrangeSingleNode(n, i);
    }
  }
}
const ye = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
  ]),
  ve = 3,
  be = 4;
class we {
  constructor() {
    this.name = 'text-block';
  }
  parse(t) {
    var s;
    const e = Array.from(t.querySelectorAll('*')).reverse();
    for (const o of e) {
      if (!o.innerHTML.includes('#[')) continue;
      const l = this.parseLine(o.innerHTML, t.ownerDocument);
      l && o.replaceWith(l);
    }
    const n = t.ownerDocument.createTreeWalker(t, be),
      i = [];
    for (; n.nextNode();) {
      const o = n.currentNode;
      o.nodeType === ve && (s = o.textContent) != null && s.includes('#[') && i.push(o);
    }
    for (const o of i) this.parseTextNode(o);
  }
  parseTextNode(t) {
    const n = t.data.split(/(\r?\n)/),
      i = t.ownerDocument.createDocumentFragment();
    let s = !1;
    for (const o of n) {
      if (/^\r?\n$/.test(o)) {
        i.append(o);
        continue;
      }
      const l = this.parseLine(o, t.ownerDocument);
      l ? (i.append(l), (s = !0)) : i.append(o);
    }
    s && t.replaceWith(i);
  }
  parseLine(t, e) {
    const n = t.match(/^\s*#\[(.*)\]\s*$/);
    if (!n || n[1].includes('#[')) return null;
    try {
      return this.createElement(n[1], e);
    } catch (i) {
      return (console.warn('[tj-content-pane] Unable to parse text block:', t, i), null);
    }
  }
  createElement(t, e) {
    const { definition: n, content: i } = this.splitContent(t);
    if (!/^[a-z][\w-]*/i.test(n)) throw new Error('The text block must start with an element name.');
    const s = X(n, { allowAttributes: !0 }),
      o = s.rest.trim(),
      l = e.createElement(s.tag);
    (s.id && (l.id = s.id), l.classList.add(...s.classes));
    for (const d of s.attrs) this.applyAttribute(l, d);
    for (const d of this.parseAttributes(o)) this.applyAttribute(l, d);
    if (i !== void 0) {
      if (ye.has(s.tag.toLowerCase())) throw new Error(`The void element <${s.tag}> cannot have content.`);
      l.innerHTML = i.trim();
    }
    return l;
  }
  splitContent(t) {
    let e = null;
    for (let n = 0; n < t.length; n++) {
      const i = t[n];
      if (e) {
        i === e && (e = null);
        continue;
      }
      if (i === '"' || i === "'") {
        e = i;
        continue;
      }
      if (i === '>') return { definition: t.slice(0, n).trim(), content: t.slice(n + 1) };
      if (t.startsWith('&gt;', n)) return { definition: t.slice(0, n).trim(), content: t.slice(n + 4) };
    }
    return { definition: t.trim() };
  }
  parseAttributes(t) {
    if (!t) return [];
    const e = [],
      n = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gy;
    let i = 0;
    for (; i < t.length;) {
      for (; /\s/.test(t[i] ?? '');) i++;
      if (i >= t.length) break;
      n.lastIndex = i;
      const s = n.exec(t);
      if (!s || s.index !== i) throw new Error(`Invalid attribute syntax near '${t.slice(i)}'.`);
      const o = s[0].includes('=');
      (e.push({ name: s[1], value: o ? (s[2] ?? s[3] ?? s[4] ?? '') : void 0 }), (i = n.lastIndex));
    }
    return e;
  }
  applyAttribute(t, e) {
    if (e.name.toLowerCase() === 'class' && e.value) {
      t.classList.add(...e.value.split(/\s+/).filter(Boolean));
      return;
    }
    t.setAttribute(e.name, e.value ?? '');
  }
}
var _e = Object.create,
  Q = Object.defineProperty,
  xe = Object.getOwnPropertyDescriptor,
  Mt = (r, t) => ((t = Symbol[r]) ? t : Symbol.for('Symbol.' + r)),
  T = (r) => {
    throw TypeError(r);
  },
  Ee = (r, t, e) => (t in r ? Q(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (r[t] = e)),
  lt = (r, t) => Q(r, 'name', { value: t, configurable: !0 }),
  Ce = (r) => [, , , _e((r == null ? void 0 : r[Mt('metadata')]) ?? null)],
  Nt = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  P = (r) => (r !== void 0 && typeof r != 'function' ? T('Function expected') : r),
  ke = (r, t, e, n, i) => ({
    kind: Nt[r],
    name: t,
    metadata: n,
    addInitializer: (s) => (e._ ? T('Already initialized') : i.push(P(s || null))),
  }),
  Ae = (r, t) => Ee(t, Mt('metadata'), r[3]),
  M = (r, t, e, n) => {
    for (var i = 0, s = r[t >> 1], o = s && s.length; i < o; i++) t & 1 ? s[i].call(e) : (n = s[i].call(e, n));
    return n;
  },
  Z = (r, t, e, n, i, s) => {
    var o,
      l,
      d,
      u,
      c,
      a = t & 7,
      f = !!(t & 8),
      h = !!(t & 16),
      b = a > 3 ? r.length + 1 : a ? (f ? 1 : 2) : 0,
      x = Nt[a + 5],
      $ = a > 3 && (r[b - 1] = []),
      z = r[b] || (r[b] = []),
      m =
        a &&
        (!h && !f && (i = i.prototype),
        a < 5 &&
          (a > 3 || !h) &&
          xe(
            a < 4
              ? i
              : {
                  get [e]() {
                    return ct(this, s);
                  },
                  set [e](p) {
                    return dt(this, s, p);
                  },
                },
            e,
          ));
    a ? h && a < 4 && lt(s, (a > 2 ? 'set ' : a > 1 ? 'get ' : '') + e) : lt(i, e);
    for (var E = n.length - 1; E >= 0; E--)
      ((u = ke(a, e, (d = {}), r[3], z)),
        a &&
          ((u.static = f),
          (u.private = h),
          (c = u.access = { has: h ? (p) => Le(i, p) : (p) => e in p }),
          a ^ 3 && (c.get = h ? (p) => (a ^ 1 ? ct : Se)(p, i, a ^ 4 ? s : m.get) : (p) => p[e]),
          a > 2 && (c.set = h ? (p, C) => dt(p, i, C, a ^ 4 ? s : m.set) : (p, C) => (p[e] = C))),
        (l = (0, n[E])(a ? (a < 4 ? (h ? s : m[x]) : a > 4 ? void 0 : { get: m.get, set: m.set }) : i, u)),
        (d._ = 1),
        a ^ 4 || l === void 0
          ? P(l) && (a > 4 ? $.unshift(l) : a ? (h ? (s = l) : (m[x] = l)) : (i = l))
          : typeof l != 'object' || l === null
            ? T('Object expected')
            : (P((o = l.get)) && (m.get = o), P((o = l.set)) && (m.set = o), P((o = l.init)) && $.unshift(o)));
    return (a || Ae(r, i), m && Q(i, e, m), h ? (a ^ 4 ? s : m) : i);
  },
  Y = (r, t, e) => t.has(r) || T('Cannot ' + e),
  Le = (r, t) => (Object(t) !== t ? T('Cannot use the "in" operator on this value') : r.has(t)),
  ct = (r, t, e) => (Y(r, t, 'read from private field'), e ? e.call(r) : t.get(r)),
  ut = (r, t, e) =>
    t.has(r) ? T('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(r) : t.set(r, e),
  dt = (r, t, e, n) => (Y(r, t, 'write to private field'), n ? n.call(r, e) : t.set(r, e), e),
  Se = (r, t, e) => (Y(r, t, 'access private method'), e),
  Wt,
  Dt,
  j,
  Ot,
  w,
  tt,
  et;
Yt('tj_sess_state', { lhref: '', scrollpos: 0, sessstart: Date.now(), pages: 0 });
const Bt = new Map(),
  ht = new we();
Bt.set(ht.name, ht);
Ot = [gt('tj-content-pane')];
class N extends ((j = Et(Ct(kt(qt)))),
(Dt = [V({ type: Boolean, reflect: !0, attribute: 'skip-layout' })]),
(Wt = [V({ type: String, reflect: !0, attribute: 'pre-parser' })]),
j) {
  constructor() {
    (super(), ut(this, tt, M(w, 8, this, !1)), M(w, 11, this), ut(this, et, M(w, 12, this, '')), M(w, 15, this));
  }
  static get is() {
    return 'tj-content-pane';
  }
  createRenderRoot() {
    return this;
  }
  arrange() {
    const t = new Jt('SectionTreeBuilder');
    (this.log('arrange() called'), this.applyPreParsers());
    const e = new ge(this),
      n = Array.from(this.children);
    if (
      (e.arrange(n),
      this.debug('Firing afterArrange event'),
      this.dispatchEvent(new CustomEvent('afterArrange', { detail: { target: this }, bubbles: !0 })),
      this.skipLayout)
    ) {
      this.warn('Skipping layout as per skipLayout property.');
      return;
    }
    (R(Array.from(this.children), { recursive: !0 }), t.lap('after arrange'));
  }
  applyPreParsers() {
    for (const t of this.preParser.split(/\s+/).filter(Boolean)) {
      const e = Bt.get(t);
      if (!e) {
        this.warn(`Unknown pre-parser '${t}'.`);
        continue;
      }
      e.parse(this);
    }
  }
  async connectedCallback() {
    (await wt(), super.connectedCallback(), this.arrange());
  }
}
w = Ce(j);
tt = new WeakMap();
et = new WeakMap();
Z(w, 4, 'skipLayout', Dt, N, tt);
Z(w, 4, 'preParser', Wt, N, et);
N = Z(w, 0, 'ContentAreaElement2', Ot, N);
M(w, 1, N);
const Te = /^@var\(\s*(--[a-zA-Z0-9_-]+)\s*\)$/;
function $e(r, t, e) {
  const n = t.trim();
  if (!n) throw new Error(`Empty selector alternative at position ${e + 1} in data-query "${r}".`);
  if (!n.startsWith('@var')) return { type: 'selector', selector: n };
  const i = n.match(Te);
  if (!i)
    throw new Error(`Invalid CSS variable selector "${n}" in data-query "${r}". Expected @var(--custom-property).`);
  return { type: 'variable', name: i[1], expression: n };
}
function ft(r, t, e) {
  try {
    return Array.from(t.querySelectorAll(r));
  } catch (n) {
    const i = n instanceof Error ? n.message : String(n);
    throw new Error(`Invalid CSS selector "${r}" ${e}: ${i}`);
  }
}
function Ie(r, t) {
  console.error(r instanceof Error ? r : new Error(String(r)), t);
}
function Pe(r, t) {
  let e;
  for (const [n, i] of r.split('|').entries())
    try {
      const s = $e(r, i, n);
      if (s.type === 'selector') {
        const d = ft(s.selector, t, `in data-query "${r}"`);
        if (d.length > 0) return { elements: d, source: 'selector' };
        continue;
      }
      e ?? (e = getComputedStyle(t));
      const o = e.getPropertyValue(s.name).trim();
      if (!o) continue;
      const l = ft(o, t, `resolved from ${s.expression}`);
      if (l.length > 0) return { elements: l, source: 'variable' };
    } catch (s) {
      Ie(s, t);
    }
  return { elements: [], source: null };
}
function pt({ slotElement: r, slotName: t, elements: e }) {
  e.forEach((n) => {
    (r
      .getAttributeNames()
      .filter((i) => i.startsWith('data-set-attribute-'))
      .forEach((i) => {
        const s = i.replace(/^data-set-attribute-/, '');
        if (!n.hasAttribute(s)) {
          const o = r.getAttribute(i);
          o !== null && n.setAttribute(s, o);
        }
      }),
      t !== '' && n.setAttribute('slot', t));
  });
}
function Me(r) {
  class t extends r {
    beforeLayoutCallback(n, i, s) {
      return !1;
    }
    firstUpdated(n) {
      var o, l;
      (o = super.firstUpdated) == null || o.call(this, n);
      const i = ((l = this.shadowRoot) == null ? void 0 : l.querySelectorAll('slot[data-query]')) ?? [],
        s = [];
      for (const d of Array.from(i)) {
        if (!(d instanceof HTMLSlotElement)) continue;
        const u = d.getAttribute('name') ?? '';
        if (u !== '' && d.assignedElements({ flatten: !0 }).length > 0) continue;
        const c = d.getAttribute('data-query');
        if (c)
          try {
            const a = Pe(c, this),
              f = { slotElement: d, slotName: u, elements: a.elements };
            a.source === 'variable' ? s.push(f) : pt(f);
          } catch (a) {
            const f = a instanceof Error ? a.message : String(a);
            console.error(new Error(`Failed to process data-query "${c}" for slot "${u}": ${f}`), d);
          }
      }
      (s.forEach(pt), R(Array.from(this.children), { recursive: !0 }));
    }
  }
  return t;
}
function Ne(r) {
  var e, n, Rt;
  class t extends r {
    constructor() {
      super(...arguments);
      y(this, n);
      y(this, e);
    }
    connectedCallback() {
      (super.connectedCallback(), this.ensureDefaultStyleClass(), _(this, n, Rt).call(this));
    }
    disconnectedCallback() {
      var l;
      ((l = g(this, e)) == null || l.disconnect(), k(this, e, void 0), super.disconnectedCallback());
    }
    ensureDefaultStyleClass() {
      Array.from(this.classList).some((d) => d.startsWith('style-')) || this.classList.add('style-default');
    }
  }
  return (
    (e = new WeakMap()),
    (n = new WeakSet()),
    (Rt = function () {
      g(this, e) === void 0 &&
        (k(this, e, new MutationObserver(() => this.ensureDefaultStyleClass())),
        g(this, e).observe(this, { attributes: !0, attributeFilter: ['class'] }));
    }),
    t
  );
}
const We = {
  logging: !0,
  slotVisibility: !1,
  eventBinding: !1,
  breakpoints: !1,
  setDefaultStyle: !0,
  subLayoutApply: !1,
};
function Fe(r = {}) {
  const t = { ...We, ...r };
  let e = mt;
  return (
    (e = kt(e)),
    t.setDefaultStyle && (e = Ne(e)),
    t.logging && (e = Ct(e)),
    t.slotVisibility && (e = ne(e)),
    t.breakpoints && (e = te(e)),
    t.eventBinding && (e = Et(e)),
    t.subLayoutApply && (e = Me(e)),
    e
  );
}
export { Ct as a, yt as c, Gt as D, ze as L, Re as l, Fe as n, Me as S, Yt as s, wt as w };
