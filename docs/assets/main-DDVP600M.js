var li = Object.defineProperty;
var ae = (i) => {
  throw TypeError(i);
};
var ui = (i, t, e) => (t in i ? li(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (i[t] = e));
var T = (i, t, e) => ui(i, typeof t != 'symbol' ? t + '' : t, e),
  ft = (i, t, e) => t.has(i) || ae('Cannot ' + e);
var w = (i, t, e) => (ft(i, t, 'read from private field'), e ? e.call(i) : t.get(i)),
  I = (i, t, e) =>
    t.has(i) ? ae('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(i) : t.set(i, e),
  F = (i, t, e, r) => (ft(i, t, 'write to private field'), r ? r.call(i, e) : t.set(i, e), e),
  D = (i, t, e) => (ft(i, t, 'access private method'), e);
import {
  i as be,
  u as ci,
  y as di,
  b as E,
  r as gt,
  f as hi,
  A as O,
  E as pi,
} from './_virtual_tdemo-client-vVsB0um6.js'; /* empty css              */
const lt = [
    { name: 'xs', minWidth: 0 },
    { name: 'sm', minWidth: 576 },
    { name: 'md', minWidth: 768 },
    { name: 'lg', minWidth: 992 },
    { name: 'xl', minWidth: 1200 },
    { name: 'xxl', minWidth: 1400 },
  ],
  oe = lt.reduce((i, t) => ((i[t.name] = t.minWidth), i), {});
function ot(i) {
  if (!(i in oe)) throw new Error(`Unknown breakpoint: ${i}`);
  return oe[i];
}
function fi() {
  return window.visualViewport ? window.visualViewport.width : window.innerWidth;
}
function mi(i) {
  i === void 0 && (i = fi());
  for (let t = lt.length - 1; t >= 0; t--) if (i >= lt[t].minWidth) return lt[t].name;
  return 'xs';
}
function ve(i, t = {}, e = []) {
  Array.isArray(e) || (e = [e]);
  const r = document.createElement(i);
  for (const n in t) t[n] !== null && t[n] !== void 0 && r.setAttribute(n, t[n] !== !0 ? t[n] : '');
  for (const n of e) r.append(typeof n == 'string' ? document.createTextNode(n) : n);
  return r;
}
class gi {
  constructor(t, e = !1) {
    T(this, 'timeout', null);
    T(this, 'startTimeWithMs', 0);
    T(this, 'maxTimeout', null);
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
    const r = () => {
      (this.timeout && (clearTimeout(this.timeout), (this.timeout = null)),
        this.maxTimeout && (clearTimeout(this.maxTimeout), (this.maxTimeout = null)),
        (this.startTimeWithMs = 0),
        t());
    };
    if (
      (this.timeout && clearTimeout(this.timeout),
      (this.timeout = setTimeout(r, this.delay)),
      this.max_delay !== !1 && !this.maxTimeout)
    ) {
      const n = e - this.startTimeWithMs,
        s = Math.max(0, this.max_delay - n);
      this.maxTimeout = setTimeout(r, s);
    }
  }
}
class bi {
  constructor(t, e, r, n = 'main') {
    ((this._debug = t), (this.myTag = e), (this.myElementId = r), (this.instanceId = n));
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
class vi {
  constructor(t, e = !0) {
    T(this, 'label');
    T(this, 'last');
    T(this, 'startTime');
    T(this, 'running', !1);
    T(this, 'enabled');
    ((this.label = t), (this.enabled = e), (this.startTime = this.last = performance.now()), (this.running = !0));
  }
  lap(t = '') {
    if (!this.enabled) return;
    const e = performance.now(),
      r = (e - this.last) / 1e3;
    ((this.last = e), console.debug(`[${this.label}] ${t} +${r.toFixed(3)}s`));
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
function yi(i) {
  return typeof i == 'object' && i !== null && !Array.isArray(i);
}
function wi(i) {
  if (i != null)
    try {
      return JSON.parse(i);
    } catch {
      return;
    }
}
function le(i) {
  const t = JSON.stringify(i);
  return t === void 0 ? 'null' : t;
}
function _i(i, t) {
  const e = { ...t };
  if (yi(i)) for (const r of Object.keys(t)) r in i && (e[r] = i[r]);
  return e;
}
class $i {
  constructor(t, e, r) {
    T(this, 'cache');
    ((this.backend = t), (this.storageKey = e), (this.initialValue = r));
  }
  read() {
    if (this.cache) return this.cache;
    const t = this.backend ? wi(this.backend.getItem(this.storageKey)) : void 0,
      e = _i(t, this.initialValue);
    if (this.backend && this.backend.getItem(this.storageKey) == null)
      try {
        this.backend.setItem(this.storageKey, le(e));
      } catch {}
    return ((this.cache = e), e);
  }
  write(t) {
    if (((this.cache = t), !!this.backend))
      try {
        this.backend.setItem(this.storageKey, le(t));
      } catch {}
  }
  asProxy() {
    const t = {
      get: (e, r) => {
        if (typeof r == 'symbol') return r === Symbol.toStringTag ? 'Storage' : void 0;
        const n = this.read();
        return r === 'toJSON' ? () => ({ ...n }) : n[r];
      },
      set: (e, r, n) => {
        if (typeof r != 'string') return !1;
        const o = { ...this.read() };
        return ((o[r] = n), this.write(o), !0);
      },
      deleteProperty: (e, r) => {
        if (typeof r != 'string') return !1;
        const n = this.read();
        if (!(r in n)) return !0;
        const s = { ...n };
        return (delete s[r], this.write(s), !0);
      },
      has: (e, r) => {
        if (typeof r != 'string') return !1;
        const n = this.read();
        return r in n;
      },
      ownKeys: () => {
        const e = this.read();
        return Reflect.ownKeys(e);
      },
      getOwnPropertyDescriptor: (e, r) => {
        if (typeof r != 'string') return;
        const n = this.read();
        if (r in n) return { enumerable: !0, configurable: !0, writable: !0, value: n[r] };
      },
    };
    return new Proxy({}, t);
  }
}
function Ai(i) {
  const t = globalThis.window;
  return (i === 'session' ? (t == null ? void 0 : t.sessionStorage) : t == null ? void 0 : t.localStorage) ?? void 0;
}
function Si(i, t) {
  return new $i(Ai('session'), i, t).asProxy();
}
function Vt() {
  return document.readyState === 'loading'
    ? new Promise((i) => {
        document.addEventListener('DOMContentLoaded', () => i());
      })
    : Promise.resolve();
}
function ki(i) {
  var e, r;
  class t extends i {
    constructor() {
      super(...arguments);
      I(this, e, new gi(200, 5e3));
      T(this, 'currentBreakPoint', null);
      I(this, r, async () => {
        var p;
        (await w(this, e).wait(), await Vt());
        const o = this,
          l = window.innerWidth;
        let d = getComputedStyle(o).getPropertyValue('--breakpoint');
        if (!d || d === '') return;
        d = d.trim().replace(/^['"]|['"]$/g, '');
        const h = d.split(','),
          u = h[0].trim(),
          a = ((p = h[1]) == null ? void 0 : p.trim()) ?? u,
          b = mi(l);
        this.currentBreakPoint !== b &&
          (ot(a) <= ot(b)
            ? o.setAttribute('mode', 'desktop')
            : ot(u) > ot(b)
              ? o.setAttribute('mode', 'mobile')
              : o.setAttribute('mode', 'tablet'));
      });
    }
    connectedCallback() {
      super.connectedCallback();
      try {
        (w(this, r).call(this), window.addEventListener('resize', w(this, r)), w(this, r).call(this));
      } catch (o) {
        throw (console.error('Error in BreakPointMixin:', o, 'in element', this), o);
      }
    }
    disconnectedCallback() {
      (super.disconnectedCallback(), window.removeEventListener('resize', w(this, r)));
    }
  }
  return ((e = new WeakMap()), (r = new WeakMap()), t);
}
const ut = Symbol('listenerDefs'),
  ye = Symbol('withEventBindings');
function X(i, t) {
  const e = Array.isArray(i) ? i : [i];
  return function (r, n) {
    if (n.kind !== 'method') throw new Error('@Listen nur für Methoden');
    return (
      n.addInitializer(function () {
        const s = this;
        (s[ut] || (s[ut] = [])).push({ method: n.name, events: [...e], opts: t });
      }),
      function (...s) {
        if (!this[ye]) throw new Error('[EventBindings] @Listen - decorator requires EventBindingMixin.');
        return r.apply(this, s);
      }
    );
  };
}
function xi(i, t) {
  var e;
  return !t || t === 'host'
    ? i
    : t === 'document'
      ? (i.ownerDocument ?? document)
      : t === 'window'
        ? (((e = i.ownerDocument) == null ? void 0 : e.defaultView) ?? window)
        : t === 'shadowRoot'
          ? (i.shadowRoot ?? i)
          : typeof t == 'function'
            ? t(i)
            : t;
}
function _e(i) {
  var e, r, we;
  class t extends i {
    constructor(...l) {
      super(...l);
      I(this, r);
      I(this, e);
      this[ye] = !0;
    }
    connectedCallback() {
      var l;
      ((l = super.connectedCallback) == null || l.call(this), D(this, r, we).call(this));
    }
    disconnectedCallback() {
      var l, d;
      ((l = w(this, e)) == null || l.abort(), (d = super.disconnectedCallback) == null || d.call(this));
    }
  }
  return (
    (e = new WeakMap()),
    (r = new WeakSet()),
    (we = function () {
      var d, h, u;
      ((d = w(this, e)) == null || d.abort(), F(this, e, new AbortController()));
      const l = this[ut] || [];
      for (const a of l) {
        const b = xi(this, (h = a.opts) == null ? void 0 : h.target),
          p = ((u = a.opts) == null ? void 0 : u.options) ?? {},
          S = this[a.method].bind(this);
        for (const M of a.events) b.addEventListener(M, S, { ...p, signal: w(this, e).signal });
      }
    }),
    t
  );
}
let Ci = 1;
function $e(i) {
  var e, r, n;
  class t extends i {
    constructor() {
      super(...arguments);
      I(this, e, null);
      I(this, r, Ci++);
      I(this, n, null);
    }
    invalidateDebugCache() {
      F(this, e, null);
    }
    get _debug() {
      return w(this, e) !== null
        ? w(this, e)
        : (this instanceof HTMLElement &&
            F(
              this,
              e,
              this.hasAttribute('debug') && !['false', '0', 'off', 'no'].includes(this.getAttribute('debug') || ''),
            ),
          w(this, e) === !0 &&
            console.info(`[DEBUG][ID:${w(this, r)}] LoggingMixin: Debug mode is enabled for <${this.tagName}>`, this),
          w(this, e) ?? !1);
    }
    getLogger(l = 'main') {
      const d = '<' + (this.tagName || this.constructor.name || 'UnknownElement') + '>';
      return (w(this, n) || F(this, n, new bi(this._debug, d, `${w(this, r)}`, l)), w(this, n));
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
  return ((e = new WeakMap()), (r = new WeakMap()), (n = new WeakMap()), t);
}
function Ae(i) {
  class t extends i {
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
    firstUpdated(r) {
      var n;
      ((n = super.firstUpdated) == null || n.call(this, r),
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
function Ei(i) {
  var e, Se, n, ht, ke;
  class t extends i {
    constructor() {
      super(...arguments);
      I(this, e);
      I(this, n, (h) => {
        const u = h.target,
          a = D(this, e, ht).call(this, u.assignedNodes({ flatten: !0 })),
          b = D(this, e, ht).call(this, u.childNodes);
        a || b ? u.classList.remove('slot-empty') : u.classList.add('slot-empty');
      });
    }
    firstUpdated(h) {
      var u;
      ((u = super.firstUpdated) == null || u.call(this, h), D(this, e, Se).call(this));
    }
  }
  return (
    (e = new WeakSet()),
    (Se = function () {
      var u;
      const h = (u = this.shadowRoot) == null ? void 0 : u.querySelectorAll('slot');
      h == null ||
        h.forEach((a) => {
          (D(this, e, ht).call(this, a.childNodes) || a.classList.add('slot-empty'),
            a.addEventListener('slotchange', (b) => w(this, n).call(this, b)));
        });
    }),
    (n = new WeakMap()),
    (ht = function (h) {
      return Array.from(h).some((u) => D(this, e, ke).call(this, u));
    }),
    (ke = function (h) {
      return h.nodeType === Node.TEXT_NODE ? (h.textContent || '').trim().length > 0 : h.nodeType === Node.ELEMENT_NODE;
    }),
    t
  );
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Lt = (i) => (t, e) => {
  e !== void 0
    ? e.addInitializer(() => {
        customElements.define(i, t);
      })
    : customElements.define(i, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Ii = { attribute: !0, type: String, converter: ci, reflect: !1, hasChanged: hi },
  Vi = (i = Ii, t, e) => {
    const { kind: r, metadata: n } = e;
    let s = globalThis.litPropertyMetadata.get(n);
    if (
      (s === void 0 && globalThis.litPropertyMetadata.set(n, (s = new Map())),
      r === 'setter' && ((i = Object.create(i)).wrapped = !0),
      s.set(e.name, i),
      r === 'accessor')
    ) {
      const { name: o } = e;
      return {
        set(l) {
          const d = t.get.call(this);
          (t.set.call(this, l), this.requestUpdate(o, d, i, !0, l));
        },
        init(l) {
          return (l !== void 0 && this.C(o, void 0, i, l), l);
        },
      };
    }
    if (r === 'setter') {
      const { name: o } = e;
      return function (l) {
        const d = this[o];
        (t.call(this, l), this.requestUpdate(o, d, i, !0, l));
      };
    }
    throw Error('Unsupported decorator location: ' + r);
  };
function x(i) {
  return (t, e) =>
    typeof e == 'object'
      ? Vi(i, t, e)
      : ((r, n, s) => {
          const o = n.hasOwnProperty(s);
          return (n.constructor.createProperty(s, r), o ? Object.getOwnPropertyDescriptor(n, s) : void 0);
        })(i, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function ue(i) {
  return x({ ...i, state: !0, attribute: !1 });
}
const Li =
  ':host{--border-color: red;--background-color: lightgray;font-family:Arial,sans-serif}#error-fixed-indicator{position:fixed;top:10px;right:10px;cursor:pointer;z-index:100000;padding:5px 10px;width:auto;max-width:90vw;min-width:100px;height:auto;box-shadow:0 4px 8px #0003;border:5px solid white;color:#fff;background-color:red;animation:blink 1s infinite;border-radius:15px;font-size:20px;font-weight:700;font-family:Arial,sans-serif}@keyframes blink{0%,to{background-color:#000}50%{background-color:red}}#error{background-color:var(--background-color);border:3px solid var(--border-color);padding:10px;margin:10px;border-radius:5px}h1{color:red;font-size:24px;margin:0}.error-details{font-size:14px;max-height:200px;overflow:auto}';
var Ti = Object.create,
  Tt = Object.defineProperty,
  Mi = Object.getOwnPropertyDescriptor,
  xe = (i, t) => ((t = Symbol[i]) ? t : Symbol.for('Symbol.' + i)),
  j = (i) => {
    throw TypeError(i);
  },
  Ni = (i, t, e) => (t in i ? Tt(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (i[t] = e)),
  he = (i, t) => Tt(i, 'name', { value: t, configurable: !0 }),
  Oi = (i) => [, , , Ti((i == null ? void 0 : i[xe('metadata')]) ?? null)],
  Ce = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  Q = (i) => (i !== void 0 && typeof i != 'function' ? j('Function expected') : i),
  Pi = (i, t, e, r, n) => ({
    kind: Ce[i],
    name: t,
    metadata: r,
    addInitializer: (s) => (e._ ? j('Already initialized') : n.push(Q(s || null))),
  }),
  Di = (i, t) => Ni(t, xe('metadata'), i[3]),
  bt = (i, t, e, r) => {
    for (var n = 0, s = i[t >> 1], o = s && s.length; n < o; n++) t & 1 ? s[n].call(e) : (r = s[n].call(e, r));
    return r;
  },
  Ee = (i, t, e, r, n, s) => {
    var o,
      l,
      d,
      h,
      u,
      a = t & 7,
      b = !!(t & 8),
      p = !!(t & 16),
      S = a > 3 ? i.length + 1 : a ? (b ? 1 : 2) : 0,
      M = Ce[a + 5],
      P = a > 3 && (i[S - 1] = []),
      Y = i[S] || (i[S] = []),
      g =
        a &&
        (!p && !b && (n = n.prototype),
        a < 5 &&
          (a > 3 || !p) &&
          Mi(
            a < 4
              ? n
              : {
                  get [e]() {
                    return ce(this, s);
                  },
                  set [e](f) {
                    return de(this, s, f);
                  },
                },
            e,
          ));
    a ? p && a < 4 && he(s, (a > 2 ? 'set ' : a > 1 ? 'get ' : '') + e) : he(n, e);
    for (var V = r.length - 1; V >= 0; V--)
      ((h = Pi(a, e, (d = {}), i[3], Y)),
        a &&
          ((h.static = b),
          (h.private = p),
          (u = h.access = { has: p ? (f) => Wi(n, f) : (f) => e in f }),
          a ^ 3 && (u.get = p ? (f) => (a ^ 1 ? ce : Fi)(f, n, a ^ 4 ? s : g.get) : (f) => f[e]),
          a > 2 && (u.set = p ? (f, L) => de(f, n, L, a ^ 4 ? s : g.set) : (f, L) => (f[e] = L))),
        (l = (0, r[V])(a ? (a < 4 ? (p ? s : g[M]) : a > 4 ? void 0 : { get: g.get, set: g.set }) : n, h)),
        (d._ = 1),
        a ^ 4 || l === void 0
          ? Q(l) && (a > 4 ? P.unshift(l) : a ? (p ? (s = l) : (g[M] = l)) : (n = l))
          : typeof l != 'object' || l === null
            ? j('Object expected')
            : (Q((o = l.get)) && (g.get = o), Q((o = l.set)) && (g.set = o), Q((o = l.init)) && P.unshift(o)));
    return (a || Di(i, n), g && Tt(n, e, g), p ? (a ^ 4 ? s : g) : n);
  },
  Mt = (i, t, e) => t.has(i) || j('Cannot ' + e),
  Wi = (i, t) => (Object(t) !== t ? j('Cannot use the "in" operator on this value') : i.has(t)),
  ce = (i, t, e) => (Mt(i, t, 'read from private field'), e ? e.call(i) : t.get(i)),
  Hi = (i, t, e) =>
    t.has(i) ? j('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(i) : t.set(i, e),
  de = (i, t, e, r) => (Mt(i, t, 'write to private field'), r ? r.call(i, e) : t.set(i, e), e),
  Fi = (i, t, e) => (Mt(i, t, 'access private method'), e),
  Ie,
  vt,
  Ve,
  q,
  Nt;
Ve = [Lt('tj-error-element')];
class B extends ((vt = be), (Ie = [x({ type: String, reflect: !0 })]), vt) {
  constructor(t = 'An error occurred', e) {
    (super(),
      (this.originalCode = void 0),
      Hi(this, Nt, bt(q, 8, this)),
      bt(q, 11, this),
      (this.message = t),
      (this.originalCode = e));
  }
  static get is() {
    return 'tj-error-element';
  }
  render() {
    return E`
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
q = Oi(vt);
Nt = new WeakMap();
Ee(q, 4, 'message', Ie, B, Nt);
B = Ee(q, 0, 'TjErrorElement', Ve, B);
B.styles = [gt(Li)];
bt(q, 1, B);
function Le(i, { allowAttributes: t = !0, ignoreGaps: e = !0 } = {}) {
  let r = 'div',
    n = null,
    s = [],
    o = [],
    l = {};
  const d = /(^[a-z][\w-]*)|#[\w-]+|\.[\w:-]+|\[\s*([\w-]+)(?:\s*=\s*(['"]?)(.*?)\3)?\s*\]/gi;
  let h = 0;
  for (;;) {
    const u = d.exec(i);
    if (!u || u.index !== h) {
      if (!e && u && u.index > h) break;
      break;
    }
    const a = u[0];
    if (a[0] === '#') n = a.slice(1);
    else if (a[0] === '.') s.push(a.slice(1));
    else if (a[0] === '[') {
      if (!t) throw new Error(`Attributes not allowed: '${a}'`);
      const b = u[2],
        p = u[4] || void 0;
      (o.push({ name: b, value: p }), (l[b] = p));
    } else r = a;
    h += a.length;
  }
  return { tag: r, id: n, classes: s, attrs: o, attrsMap: l, length: h, rest: i.slice(h) };
}
function zi(i) {
  return typeof i.beforeLayoutCallback == 'function';
}
function qi(i, t, e) {
  const r = /^(=|\+|!|-|\/|)([0-9]+(?:\.[0-9]+)?|);?/,
    n = e.replace(r, ''),
    s = Le(n),
    l = Array.from(i.attributes).reduce((a, b) => ((a[b.name] = b.value), a), {});
  (s.classes.length > 0 && (l.class = (l.class ? l.class + ' ' : '') + s.classes.join(' ')), s.id && (l.id = s.id));
  const d = s.tag || 'section';
  let h = !1,
    u = ve(d, { ...l, layoutOrig: e });
  if (d.includes('-') && !customElements.get(d))
    (console.warn(`Custom element <${d}> is not registered.`),
      (u = new B(`Custom element <${d}> is not registered.`, i.outerHTML)),
      i.replaceWith(u),
      u.append(i),
      (h = !0));
  else {
    const a = Array.from(i.children);
    (zi(u) && (h = u.beforeLayoutCallback(i, u, a) === !1),
      (u.__ORIG_ELEMENT__ = i),
      u.append(...Array.from(i.children)),
      i.replaceWith(u));
  }
  return { replacementElement: u, skipChildren: h };
}
function ct(i, t = {}) {
  const { recursive: e = !0 } = t,
    r = [];
  if (Array.isArray(i)) return (i.forEach((l) => r.push(...ct(l, t))), r);
  if (!(i instanceof HTMLElement)) return [];
  const n = i.getAttribute('layout');
  let s = !1,
    o = i;
  return (
    n && ({ replacementElement: o, skipChildren: s } = qi(i, t, n)),
    e && !s && Array.from(o.children).forEach((l) => r.push(...ct(l, t))),
    r
  );
}
const mt = /^(=|\+|!|-|\/|)([0-9]+(?:\.[0-9]+)?|)(;|$)/;
class Bi {
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
      r = t.getAttribute('layout'),
      n = { i: -99, variant: 'new', tag: 'hr', hi: null };
    if (r) {
      const s = r.match(mt);
      if (s) {
        const o = s[1];
        ((n.variant =
          o === '=' || o === '+' ? 'append' : o === '!' || o === '-' ? 'skip' : o === '/' ? 'close' : 'new'),
          s[2] !== '' && (n.i = parseFloat(s[2]) * 10));
      }
    }
    if (e === 'HR' && r === null) return null;
    if (n.variant === 'close') {
      if (e !== 'HR') throw new Error('layout close syntax (/i;) is only supported on HR control elements');
      if (n.i === -99) {
        const s = this.controlLayoutIndex[this.controlLayoutIndex.length - 1];
        if (s === void 0) throw new Error('Cannot close current layout level: no open HR layout wrapper');
        n.i = s;
      }
      return n;
    }
    if (e === 'HR') return (n.i === -99 ? (n.i = this.lastFixedI + 5) : (this.lastFixedI = n.i), n);
    if (e.startsWith('H') && e.length === 2) {
      let s = e.substring(1);
      return (
        (n.tag = 'h'),
        (n.hi = parseInt(s)),
        s === '1' && (s = '2'),
        n.i === -99 && (n.i = parseInt(s) * 10),
        (this.lastFixedI = n.i),
        n
      );
    }
    return null;
  }
  stripControlOnlyLayout(t) {
    const e = t.getAttribute('layout');
    if (!e) return;
    const r = e.match(mt);
    r && e.slice(r[0].length).trim() === '' && t.removeAttribute('layout');
  }
  getAttributeRecords(t, e = !1) {
    const r = {},
      n = t.getAttribute('layout');
    let s = null;
    if (n) {
      const o = n.replace(mt, '').trim();
      o !== '' && (s = Le(o));
    }
    for (const o of Array.from(t.attributes))
      o.name.startsWith('section-')
        ? (r[o.name.replace(/^section-/, '')] = o.value)
        : (o.name.startsWith('layout') || e) && ((r[o.name] = o.value), t.removeAttribute(o.name));
    return (
      e ||
        Array.from(t.classList).forEach((o) => {
          o.startsWith('section-') &&
            ((r.class = (r.class ? r.class + ' ' : '') + o.replace(/^section-/, '')), t.classList.remove(o));
        }),
      s &&
        (s.classes.forEach((o) => {
          r.class = (r.class ? r.class + ' ' : '') + o + ' ';
        }),
        s.attrs.forEach((o) => {
          r[o.name] = o.value ?? '';
        }),
        s.id && (r.id = s.id)),
      r
    );
  }
  createNewContainerNode(t, e) {
    const r = this.getAttributeRecords(t, t.tagName === 'HR'),
      n = ve('section', r);
    return ((n.__IT = e), n);
  }
  arrangeSingleNode(t, e) {
    let r = 0;
    for (r = 0; r < this.containerIndex.length && !(this.containerIndex[r] >= e.i); r++);
    let n;
    if (e.variant === 'append') {
      const o = this.containerPath[r];
      if (!o || this.containerIndex[r] !== e.i)
        throw new Error(`Cannot append to layout level ${e.i / 10}: no existing section at this level`);
      ((n = o), this.stripControlOnlyLayout(t));
    } else n = this.createNewContainerNode(t, e);
    const s = this.containerPath[r - 1];
    if (!s) throw new Error(`Cannot create layout level ${e.i / 10}: no parent container`);
    ((this.containerPath.length = r),
      (this.containerIndex.length = r),
      t.tagName === 'HR' && (t.setAttribute('aria-hidden', 'true'), t.setAttribute('hidden', 'hidden')),
      n.appendChild(t),
      s.appendChild(n),
      this.containerPath.push(n),
      this.containerIndex.push(e.i),
      (this.currentContainerNode = n),
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
      const r = e,
        n = this.getI(r);
      if (!n) {
        this.appendToCurrentContainer(e);
        continue;
      }
      if (n.variant === 'close') {
        (r.parentNode && r.parentNode.removeChild(r), this.closeLevel(n.i));
        continue;
      }
      if (n.variant === 'skip') {
        (this.stripControlOnlyLayout(r), this.appendToCurrentContainer(e));
        continue;
      }
      this.arrangeSingleNode(r, n);
    }
  }
}
var Ri = Object.create,
  Ot = Object.defineProperty,
  ji = Object.getOwnPropertyDescriptor,
  Te = (i, t) => ((t = Symbol[i]) ? t : Symbol.for('Symbol.' + i)),
  U = (i) => {
    throw TypeError(i);
  },
  Ui = (i, t, e) => (t in i ? Ot(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (i[t] = e)),
  pe = (i, t) => Ot(i, 'name', { value: t, configurable: !0 }),
  Ji = (i) => [, , , Ri((i == null ? void 0 : i[Te('metadata')]) ?? null)],
  Me = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  Z = (i) => (i !== void 0 && typeof i != 'function' ? U('Function expected') : i),
  Ki = (i, t, e, r, n) => ({
    kind: Me[i],
    name: t,
    metadata: r,
    addInitializer: (s) => (e._ ? U('Already initialized') : n.push(Z(s || null))),
  }),
  Gi = (i, t) => Ui(t, Te('metadata'), i[3]),
  yt = (i, t, e, r) => {
    for (var n = 0, s = i[t >> 1], o = s && s.length; n < o; n++) t & 1 ? s[n].call(e) : (r = s[n].call(e, r));
    return r;
  },
  Ne = (i, t, e, r, n, s) => {
    var o,
      l,
      d,
      h,
      u,
      a = t & 7,
      b = !!(t & 8),
      p = !!(t & 16),
      S = a > 3 ? i.length + 1 : a ? (b ? 1 : 2) : 0,
      M = Me[a + 5],
      P = a > 3 && (i[S - 1] = []),
      Y = i[S] || (i[S] = []),
      g =
        a &&
        (!p && !b && (n = n.prototype),
        a < 5 &&
          (a > 3 || !p) &&
          ji(
            a < 4
              ? n
              : {
                  get [e]() {
                    return fe(this, s);
                  },
                  set [e](f) {
                    return me(this, s, f);
                  },
                },
            e,
          ));
    a ? p && a < 4 && pe(s, (a > 2 ? 'set ' : a > 1 ? 'get ' : '') + e) : pe(n, e);
    for (var V = r.length - 1; V >= 0; V--)
      ((h = Ki(a, e, (d = {}), i[3], Y)),
        a &&
          ((h.static = b),
          (h.private = p),
          (u = h.access = { has: p ? (f) => Yi(n, f) : (f) => e in f }),
          a ^ 3 && (u.get = p ? (f) => (a ^ 1 ? fe : Qi)(f, n, a ^ 4 ? s : g.get) : (f) => f[e]),
          a > 2 && (u.set = p ? (f, L) => me(f, n, L, a ^ 4 ? s : g.set) : (f, L) => (f[e] = L))),
        (l = (0, r[V])(a ? (a < 4 ? (p ? s : g[M]) : a > 4 ? void 0 : { get: g.get, set: g.set }) : n, h)),
        (d._ = 1),
        a ^ 4 || l === void 0
          ? Z(l) && (a > 4 ? P.unshift(l) : a ? (p ? (s = l) : (g[M] = l)) : (n = l))
          : typeof l != 'object' || l === null
            ? U('Object expected')
            : (Z((o = l.get)) && (g.get = o), Z((o = l.set)) && (g.set = o), Z((o = l.init)) && P.unshift(o)));
    return (a || Gi(i, n), g && Ot(n, e, g), p ? (a ^ 4 ? s : g) : n);
  },
  Pt = (i, t, e) => t.has(i) || U('Cannot ' + e),
  Yi = (i, t) => (Object(t) !== t ? U('Cannot use the "in" operator on this value') : i.has(t)),
  fe = (i, t, e) => (Pt(i, t, 'read from private field'), e ? e.call(i) : t.get(i)),
  Xi = (i, t, e) =>
    t.has(i) ? U('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(i) : t.set(i, e),
  me = (i, t, e, r) => (Pt(i, t, 'write to private field'), r ? r.call(i, e) : t.set(i, e), e),
  Qi = (i, t, e) => (Pt(i, t, 'access private method'), e),
  Oe,
  wt,
  Pe,
  R,
  Dt;
Si('tj_sess_state', { lhref: '', scrollpos: 0, sessstart: Date.now(), pages: 0 });
Pe = [Lt('tj-content-pane')];
class dt extends ((wt = _e($e(Ae(di)))), (Oe = [x({ type: Boolean, reflect: !0, attribute: 'skip-layout' })]), wt) {
  constructor() {
    (super(), Xi(this, Dt, yt(R, 8, this, !1)), yt(R, 11, this));
  }
  static get is() {
    return 'tj-content-pane';
  }
  createRenderRoot() {
    return this;
  }
  arrange() {
    const t = new vi('SectionTreeBuilder');
    this.log('arrange() called');
    const e = new Bi(this),
      r = Array.from(this.children);
    if (
      (e.arrange(r),
      this.debug('Firing afterArrange event'),
      this.dispatchEvent(new CustomEvent('afterArrange', { detail: { target: this }, bubbles: !0 })),
      this.skipLayout)
    ) {
      this.warn('Skipping layout as per skipLayout property.');
      return;
    }
    (ct(Array.from(this.children), { recursive: !0 }), t.lap('after arrange'));
  }
  async connectedCallback() {
    (await Vt(), super.connectedCallback(), this.arrange());
  }
}
R = Ji(wt);
Dt = new WeakMap();
Ne(R, 4, 'skipLayout', Oe, dt, Dt);
dt = Ne(R, 0, 'ContentAreaElement2', Pe, dt);
yt(R, 1, dt);
function Zi(i, t) {
  const e = i.split('|');
  for (const r of e) {
    const n = t.querySelectorAll(r.trim());
    if (n.length > 0) return Array.from(n);
  }
  return [];
}
function tr(i) {
  class t extends i {
    beforeLayoutCallback(r, n, s) {
      return !1;
    }
    firstUpdated(r) {
      var s, o;
      (s = super.firstUpdated) == null || s.call(this, r);
      const n = ((o = this.shadowRoot) == null ? void 0 : o.querySelectorAll('slot[data-query]')) ?? [];
      for (const l of Array.from(n)) {
        if (!(l instanceof HTMLSlotElement)) continue;
        let d = l.getAttribute('name') ?? '';
        if (d !== '' && l.assignedElements({ flatten: !0 }).length > 0) continue;
        const h = l.getAttribute('data-query');
        if (!h) continue;
        let u = [];
        try {
          u = Zi(h, this);
        } catch (a) {
          throw (this.error(`"${a}" in slot`, l), a);
        }
        u.forEach((a) => {
          (l
            .getAttributeNames()
            .filter((b) => b.startsWith('data-set-attribute-'))
            .forEach((b) => {
              const p = b.replace(/^data-set-attribute-/, '');
              if (!a.hasAttribute(p)) {
                const S = l.getAttribute(b);
                S !== null && a.setAttribute(p, S);
              }
            }),
            d !== '' && a.setAttribute('slot', d));
        });
      }
      ct(Array.from(this.children), { recursive: !0 });
    }
  }
  return t;
}
function er(i) {
  var e, r, De;
  class t extends i {
    constructor() {
      super(...arguments);
      I(this, r);
      I(this, e);
    }
    connectedCallback() {
      (super.connectedCallback(), this.ensureDefaultStyleClass(), D(this, r, De).call(this));
    }
    disconnectedCallback() {
      var l;
      ((l = w(this, e)) == null || l.disconnect(), F(this, e, void 0), super.disconnectedCallback());
    }
    ensureDefaultStyleClass() {
      Array.from(this.classList).some((d) => d.startsWith('style-')) || this.classList.add('style-default');
    }
  }
  return (
    (e = new WeakMap()),
    (r = new WeakSet()),
    (De = function () {
      w(this, e) === void 0 &&
        (F(this, e, new MutationObserver(() => this.ensureDefaultStyleClass())),
        w(this, e).observe(this, { attributes: !0, attributeFilter: ['class'] }));
    }),
    t
  );
}
const ir = {
  logging: !0,
  slotVisibility: !1,
  eventBinding: !1,
  breakpoints: !1,
  setDefaultStyle: !0,
  subLayoutApply: !1,
};
function rr(i = {}) {
  const t = { ...ir, ...i };
  let e = be;
  return (
    (e = Ae(e)),
    t.setDefaultStyle && (e = er(e)),
    t.logging && (e = $e(e)),
    t.slotVisibility && (e = Ei(e)),
    t.breakpoints && (e = ki(e)),
    t.eventBinding && (e = _e(e)),
    t.subLayoutApply && (e = tr(e)),
    e
  );
}
const nr =
    '*,*:before,*:after{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;width:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}img,picture,video,canvas,svg{display:block;max-width:100%}input,button,textarea,select{font:inherit;color:inherit;background:none;border:none;outline:none}a,i{color:inherit;text-decoration:none}ul,ol{list-style:none}table{border-collapse:collapse;border-spacing:0}slot{display:contents}',
  sr = nr;
function ar(i) {
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
function or(i) {
  if (!i) return [];
  const t = i.trim();
  if (!t) return [];
  if (t.startsWith('[') || t.startsWith('{'))
    try {
      const e = JSON.parse(t);
      if (Array.isArray(e)) return e.map(ar).filter((r) => r !== null);
      if (e && typeof e == 'object') return Object.entries(e).map(([r, n]) => ({ value: r, label: String(n) }));
    } catch (e) {
      return (console.warn('Invalid data-options JSON:', e), []);
    }
  return t
    .split(';')
    .map((e) => e.trim())
    .filter(Boolean)
    .map((e) => {
      const [r, n] = e.split('|').map((l) => l.trim());
      return { value: r ?? '', label: n || r || '' };
    });
}
function lr(i) {
  return JSON.stringify(i);
}
const k = 'main-control',
  H = 'validation-content',
  ur =
    ':host{display:block}:where(#wrapper),:where(#field){display:grid;gap:.5rem}:where(#label){margin:0;font-weight:600}:where(#label[hidden]){display:none}:where(#control-shell){display:flex;align-items:stretch;gap:.5rem;min-height:2.75rem;border:1px solid #ced4da}:where(#control){display:flex;flex:1 1 auto;align-items:stretch;min-width:0;padding:.625rem .75rem}:where(#control-input){display:flex;flex:1 1 auto;align-items:stretch;min-width:0}:where(#control-input)>*{flex:1 1 auto;min-width:0}:where(#start),:where(#end){display:flex;flex:0 0 auto;align-items:stretch;align-self:stretch}:where(#start.slot-empty),:where(#end.slot-empty){display:none}:where(#start)::slotted(*),:where(#end)::slotted(*){display:inline-flex;align-items:center;justify-content:center;align-self:stretch;box-sizing:border-box;height:100%;max-height:100%}:where(#control-shell:focus-within){border-color:#0d6efd}:where(#validation){display:none;grid-template-rows:1fr;padding-top:.375rem}:where(#validation slot){display:contents}:where(#validation-inner){min-height:0;overflow:visible}:where(#validation-bubble){position:relative}:where(#validation-arrow){position:absolute;top:0;left:.75rem;display:block;width:.625rem;height:.625rem;background:#fff;border-top:1px solid #dc3545;border-left:1px solid #dc3545;transform:translateY(-50%) rotate(45deg)}:where(#validation-content){display:block;border:1px solid #dc3545}:host([invalid]) :where(#validation:has(slot:not(.slot-empty))){display:grid;padding-top:.175rem}:where(#input-aid){display:none;grid-template-rows:0fr}:where(#input-aid slot){display:contents}:where(#input-aid-inner){min-height:0;overflow:visible}:where(#input-aid-bubble){position:relative;opacity:0}:where(#input-aid-arrow){position:absolute;top:0;left:.75rem;display:block;width:.625rem;height:.625rem;background:#fff;border-top:1px solid #0d6efd;border-left:1px solid #0d6efd;transform:translateY(-50%) rotate(45deg)}:where(#input-aid-content){display:block;border:1px solid #0d6efd}:where(#input-aid:has(slot:not(.slot-empty))){display:grid}:host(:focus-within) :where(#input-aid:has(slot:not(.slot-empty))){grid-template-rows:1fr;padding-top:.375rem}:host(:focus-within) :where(#input-aid:has(slot:not(.slot-empty))) :where(#input-aid-bubble){opacity:1;transform:translateY(0)}';
var hr = Object.create,
  Wt = Object.defineProperty,
  cr = Object.getOwnPropertyDescriptor,
  We = (i, t) => ((t = Symbol[i]) ? t : Symbol.for('Symbol.' + i)),
  J = (i) => {
    throw TypeError(i);
  },
  dr = (i, t, e) => (t in i ? Wt(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (i[t] = e)),
  ge = (i, t) => Wt(i, 'name', { value: t, configurable: !0 }),
  pr = (i) => [, , , hr((i == null ? void 0 : i[We('metadata')]) ?? null)],
  He = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  tt = (i) => (i !== void 0 && typeof i != 'function' ? J('Function expected') : i),
  fr = (i, t, e, r, n) => ({
    kind: He[i],
    name: t,
    metadata: r,
    addInitializer: (s) => (e._ ? J('Already initialized') : n.push(tt(s || null))),
  }),
  mr = (i, t) => dr(t, We('metadata'), i[3]),
  v = (i, t, e, r) => {
    for (var n = 0, s = i[t >> 1], o = s && s.length; n < o; n++) t & 1 ? s[n].call(e) : (r = s[n].call(e, r));
    return r;
  },
  A = (i, t, e, r, n, s) => {
    var o,
      l,
      d,
      h,
      u,
      a = t & 7,
      b = !!(t & 8),
      p = !!(t & 16),
      S = a > 3 ? i.length + 1 : a ? (b ? 1 : 2) : 0,
      M = He[a + 5],
      P = a > 3 && (i[S - 1] = []),
      Y = i[S] || (i[S] = []),
      g =
        a &&
        (!p && !b && (n = n.prototype),
        a < 5 &&
          (a > 3 || !p) &&
          cr(
            a < 4
              ? n
              : {
                  get [e]() {
                    return m(this, s);
                  },
                  set [e](f) {
                    return W(this, s, f);
                  },
                },
            e,
          ));
    a ? p && a < 4 && ge(s, (a > 2 ? 'set ' : a > 1 ? 'get ' : '') + e) : ge(n, e);
    for (var V = r.length - 1; V >= 0; V--)
      ((h = fr(a, e, (d = {}), i[3], Y)),
        a &&
          ((h.static = b),
          (h.private = p),
          (u = h.access = { has: p ? (f) => gr(n, f) : (f) => e in f }),
          a ^ 3 && (u.get = p ? (f) => (a ^ 1 ? m : et)(f, n, a ^ 4 ? s : g.get) : (f) => f[e]),
          a > 2 && (u.set = p ? (f, L) => W(f, n, L, a ^ 4 ? s : g.set) : (f, L) => (f[e] = L))),
        (l = (0, r[V])(a ? (a < 4 ? (p ? s : g[M]) : a > 4 ? void 0 : { get: g.get, set: g.set }) : n, h)),
        (d._ = 1),
        a ^ 4 || l === void 0
          ? tt(l) && (a > 4 ? P.unshift(l) : a ? (p ? (s = l) : (g[M] = l)) : (n = l))
          : typeof l != 'object' || l === null
            ? J('Object expected')
            : (tt((o = l.get)) && (g.get = o), tt((o = l.set)) && (g.set = o), tt((o = l.init)) && P.unshift(o)));
    return (a || mr(i, n), g && Wt(n, e, g), p ? (a ^ 4 ? s : g) : n);
  },
  Ht = (i, t, e) => t.has(i) || J('Cannot ' + e),
  gr = (i, t) => (Object(t) !== t ? J('Cannot use the "in" operator on this value') : i.has(t)),
  m = (i, t, e) => (Ht(i, t, 'read from private field'), e ? e.call(i) : t.get(i)),
  $ = (i, t, e) =>
    t.has(i) ? J('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(i) : t.set(i, e),
  W = (i, t, e, r) => (Ht(i, t, 'write to private field'), r ? r.call(i, e) : t.set(i, e), e),
  et = (i, t, e) => (Ht(i, t, 'access private method'), e),
  Fe,
  ze,
  qe,
  Be,
  Re,
  je,
  Ue,
  Je,
  Ke,
  Ge,
  Ye,
  Xe,
  Qe,
  Ze,
  ti,
  ei,
  ii,
  _t,
  ri,
  c,
  Ft,
  zt,
  qt,
  Bt,
  Rt,
  jt,
  Ut,
  Jt,
  Kt,
  Gt,
  Yt,
  Xt,
  Qt,
  _,
  it,
  z,
  C,
  N,
  ni,
  $t,
  si,
  rt;
ri = [Lt('nte-input')];
let y = class ai extends ((_t = rr({ eventBinding: !0, slotVisibility: !0 })),
(ii = [x({ type: String, reflect: !0 })]),
(ei = [x({ type: String })]),
(ti = [x({ type: String })]),
(Ze = [x({ attribute: 'data-options', converter: { fromAttribute: (t) => or(t), toAttribute: (t) => lr(t) } })]),
(Qe = [x({ type: Boolean })]),
(Xe = [x({ type: String, attribute: 'validation-message', reflect: !0 })]),
(Ye = [x({ type: Boolean, reflect: !0 })]),
(Ge = [x({ type: Boolean, reflect: !0 })]),
(Ke = [x({ type: Boolean, reflect: !0, attribute: 'has-value' })]),
(Je = [x({ type: Boolean, reflect: !0, attribute: 'has-placeholder' })]),
(Ue = [x({ type: Boolean, reflect: !0, attribute: 'hoverlabel-active' })]),
(je = [ue()]),
(Re = [ue()]),
(Be = [X('input', { target: 'host' }), X('invalid', { target: 'host' })]),
(qe = [X('click')]),
(ze = [X('change')]),
(Fe = [X('input')]),
_t) {
  constructor() {
    (super(),
      v(c, 5, this),
      $(this, N),
      $(this, Ft, v(c, 8, this, 'text')),
      v(c, 11, this),
      $(this, zt, v(c, 12, this, '')),
      v(c, 15, this),
      $(this, qt, v(c, 16, this, '')),
      v(c, 19, this),
      $(this, Bt, v(c, 20, this, null)),
      v(c, 23, this),
      $(this, Rt, v(c, 24, this, !1)),
      v(c, 27, this),
      $(this, jt, v(c, 28, this, '')),
      v(c, 31, this),
      $(this, Ut, v(c, 32, this, !1)),
      v(c, 35, this),
      $(this, Jt, v(c, 36, this, !1)),
      v(c, 39, this),
      $(this, Kt, v(c, 40, this, !1)),
      v(c, 43, this),
      $(this, Gt, v(c, 44, this, !1)),
      v(c, 47, this),
      $(this, Yt, v(c, 48, this, !1)),
      v(c, 51, this),
      $(this, Xt, v(c, 52, this)),
      v(c, 55, this),
      $(this, Qt, v(c, 56, this, k)),
      v(c, 59, this),
      $(this, _),
      $(this, it),
      $(this, z),
      $(this, C, null),
      typeof this.attachInternals == 'function' && W(this, C, this.attachInternals()));
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
    var e, r, n;
    await Vt();
    const t = ai.getPlugin(m(this, N, rt));
    if (!t) throw new Error(`No plugin for type ${m(this, N, rt)}`);
    (W(this, _, new t(this)),
      this._value === void 0 && (this._value = (e = m(this, _)) == null ? void 0 : e.getInitValue()),
      et(this, N, $t).call(this) &&
        typeof ((r = m(this, C)) == null ? void 0 : r.setValidity) == 'function' &&
        m(this, C).setValidity({ customError: !0, badInput: !0 }, 'Invalid value'),
      super.connectedCallback(),
      et(this, N, si).call(this, m(this, _).getStyleSheet()),
      (n = m(this, _)) == null || n.connected());
  }
  disconnectedCallback() {
    var t;
    ((t = m(this, _)) == null || t.disconnected(), super.disconnectedCallback());
  }
  attributeChangedCallback(t, e, r) {
    var n;
    (super.attributeChangedCallback(t, e, r), (n = m(this, _)) == null || n.onHostAttributeChange(t, e, r));
  }
  updated(t) {
    var e;
    (super.updated(t), (e = m(this, _)) == null || e.updated(t), this.syncPluginState());
  }
  render() {
    const t = m(this, _),
      e = this.classList.contains('hoverlabel'),
      r = t == null ? void 0 : t.render(this.renderContext),
      n = E`
      <label id="label" part="label" for=${this._labelFor} ?hidden=${!this.label || !!(t != null && t.isLabelHidden())}>
        ${this.label}
      </label>
    `;
    return E`
      <div id="wrapper" part="wrapper">
        <div id="field" part="field">
          ${e ? O : n}

          <div id="control-shell" part="control">
            <slot id="start" name="start" part="start"></slot>
            <div id="control" part="control-inner">
              ${e ? n : O}
              <div id="control-input" part="control-input">${r ?? O}</div>
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
    return { element: this, type: m(this, N, rt) };
  }
  get form() {
    var t;
    return ((t = m(this, C)) == null ? void 0 : t.form) ?? null;
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
    return ((t = m(this, _)) == null ? void 0 : t.getSelectedOptions()) ?? [];
  }
  syncPluginState() {
    const t = m(this, _);
    ((this.hasValue = (t == null ? void 0 : t.hasValue()) ?? !1),
      (this.hasPlaceholder = (t == null ? void 0 : t.hasPlaceholder()) ?? this.hasAttribute('placeholder')),
      (this.hoverlabelActive = (t == null ? void 0 : t.isHoverlabelActive()) ?? !1),
      (this._labelFor = (t == null ? void 0 : t.getLabelFor()) ?? k),
      et(this, N, ni).call(this));
  }
  formResetCallback() {
    var t;
    ((t = m(this, _)) == null || t.formResetCallback(), this.syncPluginState());
  }
  formDisabledCallback(t) {
    var e;
    ((e = m(this, _)) == null || e.formDisabledCallback(t), this.syncPluginState());
  }
  onMustRevalidateInternal() {
    var t, e, r;
    et(this, N, $t).call(this) &&
      (((t = m(this, _)) == null ? void 0 : t.isValid()) === !0
        ? (typeof ((e = m(this, C)) == null ? void 0 : e.setValidity) == 'function' && m(this, C).setValidity({}),
          this.removeAttribute('invalid'),
          this.setAttribute('valid', ''))
        : (typeof ((r = m(this, C)) == null ? void 0 : r.setValidity) == 'function' &&
            m(this, C).setValidity({ customError: !0, badInput: !0 }, 'Invalid value'),
          this.setAttribute('invalid', ''),
          this.removeAttribute('valid')));
  }
  onClick(t) {
    var e, r, n;
    ((e = m(this, _)) == null || e.onClick(t),
      !this.hasAttribute('disabled') &&
        ((n = (r = m(this, _)) == null ? void 0 : r.getFormElement()) == null || n.focus()));
  }
  onChange(t) {
    var e;
    (e = m(this, _)) == null || e.onChange(t);
  }
  onInput(t) {
    var e;
    (e = m(this, _)) == null || e.onInput(t);
  }
};
c = pr(_t);
Ft = new WeakMap();
zt = new WeakMap();
qt = new WeakMap();
Bt = new WeakMap();
Rt = new WeakMap();
jt = new WeakMap();
Ut = new WeakMap();
Jt = new WeakMap();
Kt = new WeakMap();
Gt = new WeakMap();
Yt = new WeakMap();
Xt = new WeakMap();
Qt = new WeakMap();
_ = new WeakMap();
it = new WeakMap();
z = new WeakMap();
C = new WeakMap();
N = new WeakSet();
ni = function () {
  var i;
  if (!(!m(this, C) || typeof m(this, C).setFormValue != 'function')) {
    if (!this.name || this.hasAttribute('disabled')) {
      m(this, C).setFormValue(null);
      return;
    }
    m(this, C).setFormValue(((i = m(this, _)) == null ? void 0 : i.getFormValue()) ?? null);
  }
};
$t = function () {
  return !!(this.hasAttribute('required') && !this.hasAttribute('disabled'));
};
si = function (i) {
  var r;
  const t = this.renderRoot;
  if (
    !(t instanceof ShadowRoot) ||
    (m(this, z) &&
      'adoptedStyleSheets' in t &&
      ((t.adoptedStyleSheets = t.adoptedStyleSheets.filter((n) => n !== m(this, z))), W(this, z, void 0)),
    (r = m(this, it)) == null || r.remove(),
    W(this, it, void 0),
    !i)
  )
    return;
  if (typeof CSSStyleSheet < 'u' && i instanceof CSSStyleSheet && 'adoptedStyleSheets' in t) {
    ((t.adoptedStyleSheets = [...t.adoptedStyleSheets, i]), W(this, z, i));
    return;
  }
  const e = document.createElement('style');
  (e.setAttribute('data-plugin-style', m(this, N, rt)),
    (e.textContent =
      typeof i == 'string'
        ? i
        : Array.from(i.cssRules, (n) => n.cssText).join(`
`)),
    t.append(e),
    W(this, it, e));
};
rt = function () {
  return this.type.trim().toLowerCase() || 'text';
};
A(c, 4, 'type', ii, y, Ft);
A(c, 4, 'label', ei, y, zt);
A(c, 4, 'placeholder', ti, y, qt);
A(c, 4, 'options', Ze, y, Bt);
A(c, 4, 'multiple', Qe, y, Rt);
A(c, 4, 'validationMessage', Xe, y, jt);
A(c, 4, 'invalid', Ye, y, Ut);
A(c, 4, 'valid', Ge, y, Jt);
A(c, 4, 'hasValue', Ke, y, Kt);
A(c, 4, 'hasPlaceholder', Je, y, Gt);
A(c, 4, 'hoverlabelActive', Ue, y, Yt);
A(c, 4, '_value', je, y, Xt);
A(c, 4, '_labelFor', Re, y, Qt);
A(c, 1, 'onMustRevalidateInternal', Be, y);
A(c, 1, 'onClick', qe, y);
A(c, 1, 'onChange', ze, y);
A(c, 1, 'onInput', Fe, y);
y = A(c, 0, 'NteInput', ri, y);
y.formAssociated = !0;
y.styles = [gt(ur), gt(sr)];
y.plugins = new Map();
v(c, 1, y);
let K = y;
class br {
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
        n = this.rootElement.querySelector(`[name="${e}"]`);
      !n || !('value' in n) || (n.value = r);
    }
  }
}
class vr {
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
    return ((t = this.getFormElement()) == null ? void 0 : t.id) || k;
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
var pt;
class G extends vr {
  constructor() {
    super(...arguments);
    I(this, pt);
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
      e.forEach((n) => {
        r.append(this.host.name, n);
      }),
      r
    );
  }
  syncHostState() {
    this.host.syncPluginState();
  }
  disconnected() {
    var e;
    (e = w(this, pt)) == null || e.abort();
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
pt = new WeakMap();
const yr = '',
  te = class te extends G {
    getStyleSheet() {
      return yr;
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
      return E`
      <label part="checkbox-label" for=${k}>
        <input
          id=${k}
          part="checkbox-input"
          type="checkbox"
          aria-describedby=${H}
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
te.types = ['checkbox'];
let At = te;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const wr = { CHILD: 2 },
  _r =
    (i) =>
    (...t) => ({ _$litDirective$: i, values: t });
class $r {
  constructor(t) {}
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, r) {
    ((this._$Ct = t), (this._$AM = e), (this._$Ci = r));
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ class St extends $r {
  constructor(t) {
    if ((super(t), (this.it = O), t.type !== wr.CHILD))
      throw Error(this.constructor.directiveName + '() can only be used in child bindings');
  }
  render(t) {
    if (t === O || t == null) return ((this._t = void 0), (this.it = t));
    if (t === pi) return t;
    if (typeof t != 'string') throw Error(this.constructor.directiveName + '() called with a non-string value');
    if (t === this.it) return this._t;
    this.it = t;
    const e = [t];
    return ((e.raw = e), (this._t = { _$litType$: this.constructor.resultType, strings: e, values: [] }));
  }
}
((St.directiveName = 'unsafeHTML'), (St.resultType = 1));
const Zt = _r(St);
function Ar(i) {
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
function st(i) {
  return i.options && i.options.length > 0 ? i.options : Ar(i);
}
function Sr(i) {
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
function at(i) {
  return Array.isArray(i)
    ? i.map((t) => String(t)).filter(Boolean)
    : typeof i == 'boolean'
      ? i
        ? ['true']
        : []
      : i == null
        ? []
        : Sr(String(i));
}
function oi(i, t) {
  const e = new Set(Array.from(t).map((r) => String(r)));
  return st(i).filter((r) => e.has(r.value));
}
const kr = 'select{width:100%;min-width:0;color:inherit;font:inherit;background:transparent;border:0;outline:0}',
  ee = class ee extends G {
    getStyleSheet() {
      return kr;
    }
    get select() {
      return this.query('select');
    }
    getFormElement() {
      return this.select;
    }
    render(t) {
      const { element: e } = t,
        r = st(e),
        n = at(this.host.value)[0] ?? '';
      return E`
      <select
        id=${k}
        part="select"
        name=${e.getAttribute('name') ?? ''}
        aria-describedby=${H}
        ?disabled=${e.hasAttribute('disabled')}
        ?required=${e.hasAttribute('required')}
      >
        ${r.map(
          (s) => E`
            <option
              value=${s.value}
              ?disabled=${!!s.disabled}
              ?selected=${s.value === n}
            >
              ${this.renderOptionLabel(s) ?? O}
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
      return oi(this.host, at(this.host.value));
    }
    renderOptionLabel(t) {
      return t.html ? Zt(t.html) : t.label;
    }
  };
ee.types = ['select'];
let kt = ee;
const xr = '[part~=option-list]{width:100%}',
  ie = class ie extends G {
    getStyleSheet() {
      return xr;
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
        r = st(e),
        n = new Set(this.normalizeSelectedValues(this.host.value)),
        s = e.multiple ? 'checkbox' : 'radio',
        o = e.getAttribute('name') ?? `${k}-group`,
        l = e.multiple ? 'group' : 'radiogroup';
      return E`
      <div
        id=${`${k}-group`}
        part="option-list"
        role=${l}
        aria-describedby=${H}
      >
        ${r.map((d, h) => {
          const u = h === 0 ? k : `${k}-${h}`;
          return E`
            <label part="option-label" for=${u}>
              <input
                id=${u}
                part="option-input"
                type=${s}
                name=${o}
                value=${d.value}
                aria-describedby=${H}
                ?checked=${n.has(d.value)}
                ?disabled=${!!d.disabled || e.hasAttribute('disabled')}
                ?required=${!e.multiple && e.hasAttribute('required')}
              />
              <span part="option-text">${this.renderOptionLabel(d) ?? O}</span>
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
      return oi(this.host, this.normalizeSelectedValues(this.host.value));
    }
    hasPlaceholder() {
      return !1;
    }
    isHoverlabelActive() {
      return this.hasValue();
    }
    normalizeSelectedValues(t) {
      const e = at(t);
      return this.host.multiple ? e : e.slice(0, 1);
    }
    getSelectedValuesFromInputs() {
      return this.inputs.filter((t) => t.checked).map((t) => t.value);
    }
    renderOptionLabel(t) {
      return t.html ? Zt(t.html) : t.label;
    }
  };
ie.types = ['select-radio'];
let xt = ie;
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const nt = (i) => i ?? O,
  Cr = 'input{width:100%;min-width:0;color:inherit;font:inherit;background:transparent;border:0;outline:0}',
  re = class re extends G {
    getStyleSheet() {
      return Cr;
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
      return E`
      <input
        id=${k}
        part="input"
        type=${r}
        name=${e.getAttribute('name') ?? ''}
        .value=${this.normalizeStringValue(this.host.value)}
        placeholder=${e.getAttribute('placeholder') ?? ''}
        aria-describedby=${H}
        pattern=${nt(e.getAttribute('pattern') ?? void 0)}
        minlength=${nt(e.getAttribute('minlength') ?? void 0)}
        maxlength=${nt(e.getAttribute('maxlength') ?? void 0)}
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
re.types = ['text', 'email', 'password'];
let Ct = re;
const Er =
    'textarea{width:100%;min-width:0;color:inherit;font:inherit;background:transparent;border:0;outline:0;overflow-y:hidden;resize:none}',
  ne = class ne extends G {
    getStyleSheet() {
      return Er;
    }
    get textarea() {
      return this.query('textarea');
    }
    getFormElement() {
      return this.textarea;
    }
    render(t) {
      const { element: e } = t;
      return E`
      <textarea
        id=${k}
        part="textarea"
        rows=${e.getAttribute('rows') ?? '3'}
        name=${e.getAttribute('name') ?? ''}
        .value=${this.normalizeStringValue(this.host.value)}
        placeholder=${e.getAttribute('placeholder') ?? ''}
        aria-describedby=${H}
        minlength=${nt(e.getAttribute('minlength') ?? void 0)}
        maxlength=${nt(e.getAttribute('maxlength') ?? void 0)}
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
        n = this.parsePixelValue(t.style.maxHeight || e.maxHeight) ?? Number.POSITIVE_INFINITY,
        s = Math.min(Math.max(t.scrollHeight, r), n);
      ((t.style.height = `${s}px`), (t.style.overflowY = t.scrollHeight > n ? 'auto' : 'hidden'));
    }
    parsePixelValue(t) {
      const e = Number.parseFloat(t);
      return Number.isFinite(e) ? e : void 0;
    }
  };
ne.types = ['textarea'];
let Et = ne;
const Ir = '[part~=token-list]{display:flex;flex-wrap:wrap;width:100%}[part~=token-input]{min-width:0}',
  se = class se extends G {
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
              n = r[r.length - 1];
            n && (t.preventDefault(), this.removeToken(n));
          }
        }));
    }
    getStyleSheet() {
      return Ir;
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
        n = this.getAvailableOptions(r);
      return E`
      <div part="token-list" aria-describedby=${H}>
        ${r.map((s) => {
          const o = this.resolveOption(s),
            l = o != null && o.html ? Zt(o.html) : ((o == null ? void 0 : o.label) ?? s);
          return E`
            <span part="token">
              <span part="token-text">${l ?? O}</span>
              <button
                type="button"
                part="token-remove"
                aria-label=${`Token "${(o == null ? void 0 : o.label) ?? s}" entfernen`}
                ?disabled=${e.hasAttribute('disabled') || e.hasAttribute('readonly')}
                @click=${() => this.removeToken(s)}
              >
                ×
              </button>
            </span>
          `;
        })}

        <input
          id=${k}
          part="token-input"
          type="text"
          list=${n.length > 0 ? `${k}-options` : ''}
          placeholder=${e.getAttribute('placeholder') ?? ''}
          aria-describedby=${H}
          ?disabled=${e.hasAttribute('disabled')}
          ?readonly=${e.hasAttribute('readonly')}
          @input=${this.handleDraftInput}
          @change=${this.handleDraftCommit}
          @blur=${this.handleDraftCommit}
          @keydown=${this.handleKeydown}
        />
      </div>

      ${
        n.length > 0
          ? E`
            <datalist id=${`${k}-options`}>
              ${n.map((s) => E`<option value=${s.value}>${s.label}</option>`)}
            </datalist>
          `
          : O
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
      const e = Array.from(new Set(at(t)));
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
      return st(this.host).filter((r) => !r.disabled && !e.has(r.value));
    }
    resolveOption(t) {
      return st(this.host).find((e) => e.value === t) ?? null;
    }
    areValuesEqual(t, e) {
      const r = at(t);
      return r.length === e.length && r.every((n, s) => n === e[s]);
    }
    dispatchValueEvents() {
      (this.host.dispatchEvent(new InputEvent('input', { bubbles: !0, composed: !0 })),
        this.host.dispatchEvent(new Event('change', { bubbles: !0, composed: !0 })));
    }
  };
se.types = ['token-input'];
let It = se;
K.registerPlugin(Ct);
K.registerPlugin(Et);
K.registerPlugin(kt);
K.registerPlugin(xt);
K.registerPlugin(At);
K.registerPlugin(It);
function Pr(i, t, e) {
  const r = new DOMParser().parseFromString(t, 'text/html'),
    n = r.body,
    s = r.querySelector('main'),
    o = document.createElement('div');
  ((o.className = 'nte-input-demo'),
    n.className.trim() && o.classList.add(...n.className.trim().split(/\s+/)),
    n.querySelectorAll('script').forEach((l) => l.remove()),
    (o.innerHTML = s ? s.outerHTML : n.innerHTML),
    i.replaceChildren(o),
    e == null || e(o));
}
function Vr(i = document) {
  const t = i.querySelector('#formdata-demo-form'),
    e = i.querySelector('#formdata-json');
  !(t instanceof HTMLFormElement) ||
    !(e instanceof HTMLTextAreaElement) ||
    t.addEventListener('submit', (r) => {
      r.preventDefault();
      const n = Array.from(new FormData(t).entries()).map(([s, o]) => ({ key: s, value: String(o) }));
      e.value = JSON.stringify(n, null, 2);
    });
}
function Lr(i = document) {
  const t = i.querySelector('#form-data-demo'),
    e = i.querySelector('#form-data-json');
  if (!(t instanceof HTMLElement) || !(e instanceof HTMLTextAreaElement)) return;
  const r = new br(t);
  let n = !1;
  const s = () => {
      n || ((e.value = JSON.stringify(r.data, null, 2)), (e.dataset.invalid = 'false'));
    },
    o = () => {
      try {
        const l = JSON.parse(e.value);
        if (!l || typeof l != 'object' || Array.isArray(l)) throw new Error('JSON must be an object');
        ((n = !0), (r.data = l), (n = !1), (e.dataset.invalid = 'false'), (e.value = JSON.stringify(r.data, null, 2)));
      } catch {
        ((n = !1), (e.dataset.invalid = 'true'));
      }
    };
  (t.addEventListener('input', () => {
    s();
  }),
    t.addEventListener('change', () => {
      s();
    }),
    e.addEventListener('input', () => {
      o();
    }),
    s());
}
function Tr(i = document) {
  const t = i.querySelector('form[action="/demo/05-validation.html"]');
  t instanceof HTMLFormElement &&
    t.addEventListener('submit', (e) => {
      e.preventDefault();
    });
}
Vr();
Lr();
Tr();
export { Lr as a, Tr as b, Pr as r, Vr as s };
