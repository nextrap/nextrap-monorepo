var et = (e) => {
  throw TypeError(e);
};
var R = (e, t, r) => t.has(e) || et('Cannot ' + r);
var M = (e, t, r) => (R(e, t, 'read from private field'), r ? r.call(e) : t.get(e)),
  z = (e, t, r) =>
    t.has(e) ? et('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(e) : t.set(e, r),
  U = (e, t, r, n) => (R(e, t, 'write to private field'), n ? n.call(e, r) : t.set(e, r), r),
  rt = (e, t, r) => (R(e, t, 'access private method'), r);
import { y as _t, b as Dt, i as ht, f as It, A as jt, u as Ot, r as Pt } from './_virtual_tdemo-client-8tx_scwF.js';
var Rt = Object.defineProperty,
  dt = (e) => {
    throw TypeError(e);
  },
  zt = (e, t, r) => (t in e ? Rt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : (e[t] = r)),
  y = (e, t, r) => zt(e, typeof t != 'symbol' ? t + '' : t, r),
  K = (e, t, r) => t.has(e) || dt('Cannot ' + r),
  g = (e, t, r) => (K(e, t, 'read from private field'), r ? r.call(e) : t.get(e)),
  v = (e, t, r) =>
    t.has(e) ? dt('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(e) : t.set(e, r),
  O = (e, t, r, n) => (K(e, t, 'write to private field'), t.set(e, r), r),
  x = (e, t, r) => (K(e, t, 'access private method'), r);
const P = [
    { name: 'xs', minWidth: 0 },
    { name: 'sm', minWidth: 576 },
    { name: 'md', minWidth: 768 },
    { name: 'lg', minWidth: 992 },
    { name: 'xl', minWidth: 1200 },
    { name: 'xxl', minWidth: 1400 },
  ],
  nt = P.reduce((e, t) => ((e[t.name] = t.minWidth), e), {});
function I(e) {
  if (!(e in nt)) throw new Error(`Unknown breakpoint: ${e}`);
  return nt[e];
}
function Ut() {
  return window.visualViewport ? window.visualViewport.width : window.innerWidth;
}
function Ft(e) {
  e === void 0 && (e = Ut());
  for (let t = P.length - 1; t >= 0; t--) if (e >= P[t].minWidth) return P[t].name;
  return 'xs';
}
function ft(e, t = {}, r = []) {
  Array.isArray(r) || (r = [r]);
  const n = document.createElement(e);
  for (const i in t) t[i] !== null && t[i] !== void 0 && n.setAttribute(i, t[i] !== !0 ? t[i] : '');
  for (const i of r) n.append(typeof i == 'string' ? document.createTextNode(i) : i);
  return n;
}
class mt {
  constructor(t, r = !1) {
    (y(this, 'timeout', null),
      y(this, 'startTimeWithMs', 0),
      y(this, 'maxTimeout', null),
      (this.delay = t),
      (this.max_delay = r));
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
    const r = Date.now();
    this.startTimeWithMs === 0 && (this.startTimeWithMs = r);
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
      const i = r - this.startTimeWithMs,
        s = Math.max(0, this.max_delay - i);
      this.maxTimeout = setTimeout(n, s);
    }
  }
}
class Bt {
  constructor(t, r, n, i = 'main') {
    ((this._debug = t), (this.myTag = r), (this.myElementId = n), (this.instanceId = i));
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
    const r = `[ERROR][${this.myTag}:${this.myElementId}:${this.instanceId}] ${t.join(' ')}`;
    throw (this.error(...t), new Error(r));
  }
}
let qt = class {
  constructor(t, r = !0) {
    (y(this, 'label'),
      y(this, 'last'),
      y(this, 'startTime'),
      y(this, 'running', !1),
      y(this, 'enabled'),
      (this.label = t),
      (this.enabled = r),
      (this.startTime = this.last = performance.now()),
      (this.running = !0));
  }
  lap(t = '') {
    if (!this.enabled) return;
    const r = performance.now(),
      n = (r - this.last) / 1e3;
    ((this.last = r), console.debug(`[${this.label}] ${t} +${n.toFixed(3)}s`));
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
};
function Ht(e) {
  return typeof e == 'object' && e !== null && !Array.isArray(e);
}
function Vt(e) {
  if (e != null)
    try {
      return JSON.parse(e);
    } catch {
      return;
    }
}
function it(e) {
  const t = JSON.stringify(e);
  return t === void 0 ? 'null' : t;
}
function Kt(e, t) {
  const r = { ...t };
  if (Ht(e)) for (const n of Object.keys(t)) n in e && (r[n] = e[n]);
  return r;
}
let Gt = class {
  constructor(t, r, n) {
    (y(this, 'cache'), (this.backend = t), (this.storageKey = r), (this.initialValue = n));
  }
  read() {
    if (this.cache) return this.cache;
    const t = this.backend ? Vt(this.backend.getItem(this.storageKey)) : void 0,
      r = Kt(t, this.initialValue);
    if (this.backend && this.backend.getItem(this.storageKey) == null)
      try {
        this.backend.setItem(this.storageKey, it(r));
      } catch {}
    return ((this.cache = r), r);
  }
  write(t) {
    if (((this.cache = t), !!this.backend))
      try {
        this.backend.setItem(this.storageKey, it(t));
      } catch {}
  }
  asProxy() {
    const t = {
      get: (r, n) => {
        if (typeof n == 'symbol') return n === Symbol.toStringTag ? 'Storage' : void 0;
        const i = this.read();
        return n === 'toJSON' ? () => ({ ...i }) : i[n];
      },
      set: (r, n, i) => {
        if (typeof n != 'string') return !1;
        const s = { ...this.read() };
        return ((s[n] = i), this.write(s), !0);
      },
      deleteProperty: (r, n) => {
        if (typeof n != 'string') return !1;
        const i = this.read();
        if (!(n in i)) return !0;
        const s = { ...i };
        return (delete s[n], this.write(s), !0);
      },
      has: (r, n) => {
        if (typeof n != 'string') return !1;
        const i = this.read();
        return n in i;
      },
      ownKeys: () => {
        const r = this.read();
        return Reflect.ownKeys(r);
      },
      getOwnPropertyDescriptor: (r, n) => {
        if (typeof n != 'string') return;
        const i = this.read();
        if (n in i) return { enumerable: !0, configurable: !0, writable: !0, value: i[n] };
      },
    };
    return new Proxy({}, t);
  }
};
function Jt(e) {
  const t = globalThis.window;
  return (e === 'session' ? (t == null ? void 0 : t.sessionStorage) : t == null ? void 0 : t.localStorage) ?? void 0;
}
function Xt(e, t) {
  return new Gt(Jt('session'), e, t).asProxy();
}
function pt() {
  return document.readyState === 'loading'
    ? new Promise((e) => {
        document.addEventListener('DOMContentLoaded', () => e());
      })
    : Promise.resolve();
}
function Zt(e) {
  var t, r;
  class n extends e {
    constructor() {
      (super(...arguments),
        v(this, t, new mt(200, 5e3)),
        y(this, 'currentBreakPoint', null),
        v(this, r, async () => {
          var s;
          (await g(this, t).wait(), await pt());
          const a = this,
            o = window.innerWidth;
          let u = getComputedStyle(a).getPropertyValue('--breakpoint');
          if (!u || u === '') return;
          u = u.trim().replace(/^['"]|['"]$/g, '');
          const c = u.split(','),
            h = c[0].trim(),
            l = ((s = c[1]) == null ? void 0 : s.trim()) ?? h,
            p = Ft(o);
          this.currentBreakPoint !== p &&
            (I(l) <= I(p)
              ? a.setAttribute('mode', 'desktop')
              : I(h) > I(p)
                ? a.setAttribute('mode', 'mobile')
                : a.setAttribute('mode', 'tablet'));
        }));
    }
    connectedCallback() {
      super.connectedCallback();
      try {
        (g(this, r).call(this), window.addEventListener('resize', g(this, r)), g(this, r).call(this));
      } catch (s) {
        throw (console.error('Error in BreakPointMixin:', s, 'in element', this), s);
      }
    }
    disconnectedCallback() {
      (super.disconnectedCallback(), window.removeEventListener('resize', g(this, r)));
    }
  }
  return ((t = new WeakMap()), (r = new WeakMap()), n);
}
const F = Symbol('listenerDefs'),
  gt = Symbol('withEventBindings');
function Ie(e, t) {
  const r = Array.isArray(e) ? e : [e];
  return function (n, i) {
    if (i.kind !== 'method') throw new Error('@Listen nur für Methoden');
    return (
      i.addInitializer(function () {
        const s = this;
        (s[F] || (s[F] = [])).push({ method: i.name, events: [...r], opts: t });
      }),
      function (...s) {
        if (!this[gt]) throw new Error('[EventBindings] @Listen - decorator requires EventBindingMixin.');
        return n.apply(this, s);
      }
    );
  };
}
function Yt(e, t) {
  var r;
  return !t || t === 'host'
    ? e
    : t === 'document'
      ? (e.ownerDocument ?? document)
      : t === 'window'
        ? (((r = e.ownerDocument) == null ? void 0 : r.defaultView) ?? window)
        : t === 'shadowRoot'
          ? (e.shadowRoot ?? e)
          : typeof t == 'function'
            ? t(e)
            : t;
}
function bt(e) {
  var t, r, n;
  class i extends e {
    constructor(...a) {
      (super(...a), v(this, r), v(this, t), (this[gt] = !0));
    }
    connectedCallback() {
      var a;
      ((a = super.connectedCallback) == null || a.call(this), x(this, r, n).call(this));
    }
    disconnectedCallback() {
      var a, o;
      ((a = g(this, t)) == null || a.abort(), (o = super.disconnectedCallback) == null || o.call(this));
    }
  }
  return (
    (t = new WeakMap()),
    (r = new WeakSet()),
    (n = function () {
      var s, a, o;
      ((s = g(this, t)) == null || s.abort(), O(this, t, new AbortController()));
      const u = this[F] || [];
      for (const c of u) {
        const h = Yt(this, (a = c.opts) == null ? void 0 : a.target),
          l = ((o = c.opts) == null ? void 0 : o.options) ?? {},
          p = this[c.method].bind(this);
        for (const d of c.events) h.addEventListener(d, p, { ...l, signal: g(this, t).signal });
      }
    }),
    i
  );
}
let Qt = 1;
function yt(e) {
  var t, r, n;
  class i extends e {
    constructor() {
      (super(...arguments), v(this, t, null), v(this, r, Qt++), v(this, n, null));
    }
    invalidateDebugCache() {
      O(this, t, null);
    }
    get _debug() {
      return g(this, t) !== null
        ? g(this, t)
        : (this instanceof HTMLElement &&
            O(
              this,
              t,
              this.hasAttribute('debug') && !['false', '0', 'off', 'no'].includes(this.getAttribute('debug') || ''),
            ),
          g(this, t) === !0 &&
            console.info(`[DEBUG][ID:${g(this, r)}] LoggingMixin: Debug mode is enabled for <${this.tagName}>`, this),
          g(this, t) ?? !1);
    }
    getLogger(a = 'main') {
      const o = '<' + (this.tagName || this.constructor.name || 'UnknownElement') + '>';
      return (g(this, n) || O(this, n, new Bt(this._debug, o, `${g(this, r)}`, a)), g(this, n));
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
  return ((t = new WeakMap()), (r = new WeakMap()), (n = new WeakMap()), i);
}
function vt(e) {
  class t extends e {
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
function te(e) {
  var t, r, n, i, s;
  class a extends e {
    constructor() {
      (super(...arguments),
        v(this, t),
        v(this, n, (u) => {
          const c = u.target,
            h = x(this, t, i).call(this, c.assignedNodes({ flatten: !0 })),
            l = x(this, t, i).call(this, c.childNodes);
          h || l ? c.classList.remove('slot-empty') : c.classList.add('slot-empty');
        }));
    }
    firstUpdated(u) {
      var c;
      ((c = super.firstUpdated) == null || c.call(this, u), x(this, t, r).call(this));
    }
  }
  return (
    (t = new WeakSet()),
    (r = function () {
      var o;
      const u = (o = this.shadowRoot) == null ? void 0 : o.querySelectorAll('slot');
      u == null ||
        u.forEach((c) => {
          (x(this, t, i).call(this, c.childNodes) || c.classList.add('slot-empty'),
            c.addEventListener('slotchange', (h) => g(this, n).call(this, h)));
        });
    }),
    (n = new WeakMap()),
    (i = function (o) {
      return Array.from(o).some((u) => x(this, t, s).call(this, u));
    }),
    (s = function (o) {
      return o.nodeType === Node.TEXT_NODE ? (o.textContent || '').trim().length > 0 : o.nodeType === Node.ELEMENT_NODE;
    }),
    a
  );
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const wt = (e) => (t, r) => {
  r !== void 0
    ? r.addInitializer(() => {
        customElements.define(e, t);
      })
    : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const ee = { attribute: !0, type: String, converter: Ot, reflect: !1, hasChanged: It },
  re = (e = ee, t, r) => {
    const { kind: n, metadata: i } = r;
    let s = globalThis.litPropertyMetadata.get(i);
    if (
      (s === void 0 && globalThis.litPropertyMetadata.set(i, (s = new Map())),
      n === 'setter' && ((e = Object.create(e)).wrapped = !0),
      s.set(r.name, e),
      n === 'accessor')
    ) {
      const { name: a } = r;
      return {
        set(o) {
          const u = t.get.call(this);
          (t.set.call(this, o), this.requestUpdate(a, u, e, !0, o));
        },
        init(o) {
          return (o !== void 0 && this.C(a, void 0, e, o), o);
        },
      };
    }
    if (n === 'setter') {
      const { name: a } = r;
      return function (o) {
        const u = this[a];
        (t.call(this, o), this.requestUpdate(a, u, e, !0, o));
      };
    }
    throw Error('Unsupported decorator location: ' + n);
  };
function G(e) {
  return (t, r) =>
    typeof r == 'object'
      ? re(e, t, r)
      : ((n, i, s) => {
          const a = i.hasOwnProperty(s);
          return (i.constructor.createProperty(s, n), a ? Object.getOwnPropertyDescriptor(i, s) : void 0);
        })(e, t, r);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function Oe(e) {
  return G({ ...e, state: !0, attribute: !1 });
}
const ne =
  ':host{--border-color: red;--background-color: lightgray;font-family:Arial,sans-serif}#error-fixed-indicator{position:fixed;top:10px;right:10px;cursor:pointer;z-index:100000;padding:5px 10px;width:auto;max-width:90vw;min-width:100px;height:auto;box-shadow:0 4px 8px #0003;border:5px solid white;color:#fff;background-color:red;animation:blink 1s infinite;border-radius:15px;font-size:20px;font-weight:700;font-family:Arial,sans-serif}@keyframes blink{0%,to{background-color:#000}50%{background-color:red}}#error{background-color:var(--background-color);border:3px solid var(--border-color);padding:10px;margin:10px;border-radius:5px}h1{color:red;font-size:24px;margin:0}.error-details{font-size:14px;max-height:200px;overflow:auto}';
var ie = Object.create,
  J = Object.defineProperty,
  se = Object.getOwnPropertyDescriptor,
  kt = (e, t) => ((t = Symbol[e]) ? t : Symbol.for('Symbol.' + e)),
  $ = (e) => {
    throw TypeError(e);
  },
  ae = (e, t, r) => (t in e ? J(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : (e[t] = r)),
  st = (e, t) => J(e, 'name', { value: t, configurable: !0 }),
  oe = (e) => [, , , ie((e == null ? void 0 : e[kt('metadata')]) ?? null)],
  xt = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  N = (e) => (e !== void 0 && typeof e != 'function' ? $('Function expected') : e),
  le = (e, t, r, n, i) => ({
    kind: xt[e],
    name: t,
    metadata: n,
    addInitializer: (s) => (r._ ? $('Already initialized') : i.push(N(s || null))),
  }),
  ce = (e, t) => ae(t, kt('metadata'), e[3]),
  B = (e, t, r, n) => {
    for (var i = 0, s = e[t >> 1], a = s && s.length; i < a; i++) t & 1 ? s[i].call(r) : (n = s[i].call(r, n));
    return n;
  },
  Et = (e, t, r, n, i, s) => {
    var a,
      o,
      u,
      c,
      h,
      l = t & 7,
      p = !!(t & 8),
      d = !!(t & 16),
      b = l > 3 ? e.length + 1 : l ? (p ? 1 : 2) : 0,
      S = xt[l + 5],
      W = l > 3 && (e[b - 1] = []),
      j = e[b] || (e[b] = []),
      m =
        l &&
        (!d && !p && (i = i.prototype),
        l < 5 &&
          (l > 3 || !d) &&
          se(
            l < 4
              ? i
              : {
                  get [r]() {
                    return at(this, s);
                  },
                  set [r](f) {
                    return ot(this, s, f);
                  },
                },
            r,
          ));
    l ? d && l < 4 && st(s, (l > 2 ? 'set ' : l > 1 ? 'get ' : '') + r) : st(i, r);
    for (var w = n.length - 1; w >= 0; w--)
      ((c = le(l, r, (u = {}), e[3], j)),
        l &&
          ((c.static = p),
          (c.private = d),
          (h = c.access = { has: d ? (f) => ue(i, f) : (f) => r in f }),
          l ^ 3 && (h.get = d ? (f) => (l ^ 1 ? at : de)(f, i, l ^ 4 ? s : m.get) : (f) => f[r]),
          l > 2 && (h.set = d ? (f, k) => ot(f, i, k, l ^ 4 ? s : m.set) : (f, k) => (f[r] = k))),
        (o = (0, n[w])(l ? (l < 4 ? (d ? s : m[S]) : l > 4 ? void 0 : { get: m.get, set: m.set }) : i, c)),
        (u._ = 1),
        l ^ 4 || o === void 0
          ? N(o) && (l > 4 ? W.unshift(o) : l ? (d ? (s = o) : (m[S] = o)) : (i = o))
          : typeof o != 'object' || o === null
            ? $('Object expected')
            : (N((a = o.get)) && (m.get = a), N((a = o.set)) && (m.set = a), N((a = o.init)) && W.unshift(a)));
    return (l || ce(e, i), m && J(i, r, m), d ? (l ^ 4 ? s : m) : i);
  },
  X = (e, t, r) => t.has(e) || $('Cannot ' + r),
  ue = (e, t) => (Object(t) !== t ? $('Cannot use the "in" operator on this value') : e.has(t)),
  at = (e, t, r) => (X(e, t, 'read from private field'), r ? r.call(e) : t.get(e)),
  he = (e, t, r) =>
    t.has(e) ? $('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(e) : t.set(e, r),
  ot = (e, t, r, n) => (X(e, t, 'write to private field'), n ? n.call(e, r) : t.set(e, r), r),
  de = (e, t, r) => (X(e, t, 'access private method'), r),
  Ct,
  q,
  At,
  E,
  Z;
At = [wt('tj-error-element')];
class C extends ((q = ht), (Ct = [G({ type: String, reflect: !0 })]), q) {
  constructor(t = 'An error occurred', r) {
    (super(),
      (this.originalCode = void 0),
      he(this, Z, B(E, 8, this)),
      B(E, 11, this),
      (this.message = t),
      (this.originalCode = r));
  }
  static get is() {
    return 'tj-error-element';
  }
  render() {
    return Dt`
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
E = oe(q);
Z = new WeakMap();
Et(E, 4, 'message', Ct, C, Z);
C = Et(E, 0, 'TjErrorElement', At, C);
C.styles = [Pt(ne)];
B(E, 1, C);
function $t(e, { allowAttributes: t = !0, ignoreGaps: r = !0 } = {}) {
  let n = 'div',
    i = null,
    s = [],
    a = [],
    o = {};
  const u = /(^[a-z][\w-]*)|#[\w-]+|\.[\w:-]+|\[\s*([\w-]+)(?:\s*=\s*(['"]?)(.*?)\3)?\s*\]/gi;
  let c = 0;
  for (;;) {
    const h = u.exec(e);
    if (!h || h.index !== c) {
      if (!r && h && h.index > c) break;
      break;
    }
    const l = h[0];
    if (l[0] === '#') i = l.slice(1);
    else if (l[0] === '.') s.push(l.slice(1));
    else if (l[0] === '[') {
      if (!t) throw new Error(`Attributes not allowed: '${l}'`);
      const p = h[2],
        d = h[4] || void 0;
      (a.push({ name: p, value: d }), (o[p] = d));
    } else n = l;
    c += l.length;
  }
  return { tag: n, id: i, classes: s, attrs: a, attrsMap: o, length: c, rest: e.slice(c) };
}
function fe(e) {
  return typeof e.beforeLayoutCallback == 'function';
}
function me(e, t, r) {
  const n = /^(\+|-|)([0-9]+\.?[0-9]*);?/,
    i = r.replace(n, ''),
    s = $t(i),
    a = Array.from(e.attributes).reduce((h, l) => ((h[l.name] = l.value), h), {}),
    o = s.tag || 'section';
  let u = !1,
    c = ft(o, { ...a, layoutOrig: r });
  if (o.includes('-') && !customElements.get(o))
    (console.warn(`Custom element <${o}> is not registered.`),
      (c = new C(`Custom element <${o}> is not registered.`, e.outerHTML)),
      e.replaceWith(c),
      c.append(e),
      (u = !0));
  else {
    const h = Array.from(e.children);
    (fe(c) && (u = c.beforeLayoutCallback(e, c, h) === !1),
      (c.__ORIG_ELEMENT__ = e),
      c.append(...Array.from(e.children)),
      e.replaceWith(c));
  }
  return { replacementElement: c, skipChildren: u };
}
function D(e, t = {}) {
  const { recursive: r = !0 } = t;
  let n = [];
  if (Array.isArray(e)) return (e.forEach((o) => n.push(...D(o, t))), n);
  if (!(e instanceof HTMLElement)) return [];
  const i = e.getAttribute('layout');
  let s = !1,
    a = e;
  return (
    i && ({ replacementElement: a, skipChildren: s } = me(e, t, i)),
    r && !s && Array.from(a.children).forEach((o) => n.push(...D(o, t))),
    n
  );
}
class pe {
  constructor(t, r = !1) {
    ((this.debug = r),
      (this.currentContainerNode = null),
      (this.containerPath = []),
      (this.containerIndex = [0]),
      (this.lastFixedI = 20),
      (this.currentContainerNode = this.rootNode = t),
      this.containerPath.push(this.rootNode));
  }
  getI(t) {
    const r = t.tagName,
      n = t.getAttribute('layout'),
      i = { i: -99, variant: 'new', tag: 'hr', hi: null };
    if (n) {
      const s = /^(\+|-|)([0-9]\.?[0-9]?|)(;|$)/,
        a = n.match(s);
      a &&
        ((i.variant = a[1] === '+' ? 'append' : a[1] === '-' ? 'skip' : 'new'),
        a[2] !== '' && (i.i = parseFloat(a[2]) * 10));
    }
    if (r === 'HR' && n === null) return null;
    if (r === 'HR') return n !== null && i.i === -99 ? ((i.i = this.lastFixedI + 5), i) : ((this.lastFixedI = i.i), i);
    if (r.startsWith('H') && r.length === 2) {
      let s = r.substring(1);
      return (
        (i.tag = 'h'),
        (i.hi = parseInt(s)),
        s === '1' && (s = '2'),
        i.i === -99 && ((i.i = parseInt(s) * 10), (this.lastFixedI = i.i)),
        i
      );
    }
    return null;
  }
  getAttributeRecords(t, r = !1) {
    const n = {},
      i = t.getAttribute('layout');
    let s = null;
    if (i) {
      const a = /^(\+|-|)([0-9]\.?[0-9]?|)(;|)/,
        o = i.replace(a, '').trim();
      o !== '' && (s = $t(o));
    }
    for (const a of Array.from(t.attributes))
      a.name.startsWith('section-')
        ? (n[a.name.replace(/^section-/, '')] = a.value)
        : (a.name.startsWith('layout') || r) && ((n[a.name] = a.value), t.removeAttribute(a.name));
    return (
      r ||
        Array.from(t.classList).forEach((a) => {
          a.startsWith('section-') &&
            ((n.class = (n.class ? n.class + ' ' : '') + a.replace(/^section-/, '')), t.classList.remove(a));
        }),
      s &&
        (s.classes.forEach((a) => {
          n.class = (n.class ? n.class + ' ' : '') + a + ' ';
        }),
        s.attrs.forEach((a) => {
          n[a.name] = a.value ?? '';
        }),
        s.id && (n.id = s.id)),
      n
    );
  }
  createNewContainerNode(t, r) {
    const n = this.getAttributeRecords(t, t.tagName === 'HR'),
      i = ft('section', n);
    return ((i.__IT = r), i);
  }
  arrangeSingleNode(t, r) {
    r.i;
    let n = 0;
    for (n = 0; n < this.containerIndex.length && !(this.containerIndex[n] >= r.i); n++);
    let i = null;
    r.variant === 'append' ? (i = this.containerPath[n]) : (i = this.createNewContainerNode(t, r));
    const s = this.containerPath[n - 1];
    ((this.containerPath.length = n),
      (this.containerIndex.length = n),
      t.tagName === 'HR' && (t.setAttribute('aria-hidden', 'true'), t.setAttribute('hidden', 'hidden')),
      i.appendChild(t),
      s.appendChild(i),
      this.containerPath.push(i),
      this.containerIndex.push(r.i),
      (this.currentContainerNode = i));
  }
  appendToCurrentContainer(t) {
    if (this.currentContainerNode === null) throw new Error('No current container node set');
    this.currentContainerNode.appendChild(t);
  }
  arrange(t) {
    for (let r of t) {
      if (r.nodeType !== Node.ELEMENT_NODE) {
        this.appendToCurrentContainer(r);
        continue;
      }
      const n = r,
        i = this.getI(n);
      if (!i || i.variant === 'skip') {
        this.appendToCurrentContainer(r);
        continue;
      }
      this.arrangeSingleNode(n, i);
    }
  }
}
var ge = Object.create,
  Y = Object.defineProperty,
  be = Object.getOwnPropertyDescriptor,
  Tt = (e, t) => ((t = Symbol[e]) ? t : Symbol.for('Symbol.' + e)),
  T = (e) => {
    throw TypeError(e);
  },
  ye = (e, t, r) => (t in e ? Y(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : (e[t] = r)),
  lt = (e, t) => Y(e, 'name', { value: t, configurable: !0 }),
  ve = (e) => [, , , ge((e == null ? void 0 : e[Tt('metadata')]) ?? null)],
  St = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  L = (e) => (e !== void 0 && typeof e != 'function' ? T('Function expected') : e),
  we = (e, t, r, n, i) => ({
    kind: St[e],
    name: t,
    metadata: n,
    addInitializer: (s) => (r._ ? T('Already initialized') : i.push(L(s || null))),
  }),
  ke = (e, t) => ye(t, Tt('metadata'), e[3]),
  H = (e, t, r, n) => {
    for (var i = 0, s = e[t >> 1], a = s && s.length; i < a; i++) t & 1 ? s[i].call(r) : (n = s[i].call(r, n));
    return n;
  },
  Wt = (e, t, r, n, i, s) => {
    var a,
      o,
      u,
      c,
      h,
      l = t & 7,
      p = !!(t & 8),
      d = !!(t & 16),
      b = l > 3 ? e.length + 1 : l ? (p ? 1 : 2) : 0,
      S = St[l + 5],
      W = l > 3 && (e[b - 1] = []),
      j = e[b] || (e[b] = []),
      m =
        l &&
        (!d && !p && (i = i.prototype),
        l < 5 &&
          (l > 3 || !d) &&
          be(
            l < 4
              ? i
              : {
                  get [r]() {
                    return ct(this, s);
                  },
                  set [r](f) {
                    return ut(this, s, f);
                  },
                },
            r,
          ));
    l ? d && l < 4 && lt(s, (l > 2 ? 'set ' : l > 1 ? 'get ' : '') + r) : lt(i, r);
    for (var w = n.length - 1; w >= 0; w--)
      ((c = we(l, r, (u = {}), e[3], j)),
        l &&
          ((c.static = p),
          (c.private = d),
          (h = c.access = { has: d ? (f) => xe(i, f) : (f) => r in f }),
          l ^ 3 && (h.get = d ? (f) => (l ^ 1 ? ct : Ce)(f, i, l ^ 4 ? s : m.get) : (f) => f[r]),
          l > 2 && (h.set = d ? (f, k) => ut(f, i, k, l ^ 4 ? s : m.set) : (f, k) => (f[r] = k))),
        (o = (0, n[w])(l ? (l < 4 ? (d ? s : m[S]) : l > 4 ? void 0 : { get: m.get, set: m.set }) : i, c)),
        (u._ = 1),
        l ^ 4 || o === void 0
          ? L(o) && (l > 4 ? W.unshift(o) : l ? (d ? (s = o) : (m[S] = o)) : (i = o))
          : typeof o != 'object' || o === null
            ? T('Object expected')
            : (L((a = o.get)) && (m.get = a), L((a = o.set)) && (m.set = a), L((a = o.init)) && W.unshift(a)));
    return (l || ke(e, i), m && Y(i, r, m), d ? (l ^ 4 ? s : m) : i);
  },
  Q = (e, t, r) => t.has(e) || T('Cannot ' + r),
  xe = (e, t) => (Object(t) !== t ? T('Cannot use the "in" operator on this value') : e.has(t)),
  ct = (e, t, r) => (Q(e, t, 'read from private field'), r ? r.call(e) : t.get(e)),
  Ee = (e, t, r) =>
    t.has(e) ? T('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(e) : t.set(e, r),
  ut = (e, t, r, n) => (Q(e, t, 'write to private field'), n ? n.call(e, r) : t.set(e, r), r),
  Ce = (e, t, r) => (Q(e, t, 'access private method'), r),
  Nt,
  V,
  Lt,
  A,
  tt;
Xt('tj_sess_state', { lhref: '', scrollpos: 0, sessstart: Date.now(), pages: 0 });
new mt(100, 200);
Lt = [wt('tj-content-pane')];
class _ extends ((V = bt(yt(vt(_t)))), (Nt = [G({ type: Boolean, reflect: !0, attribute: 'skip-layout' })]), V) {
  constructor() {
    (super(), Ee(this, tt, H(A, 8, this, !1)), H(A, 11, this));
  }
  static get is() {
    return 'tj-content-pane';
  }
  createRenderRoot() {
    return this;
  }
  arrange() {
    const t = new qt('SectionTreeBuilder');
    this.log('arrange() called');
    const r = new pe(this),
      n = Array.from(this.children);
    if (
      (r.arrange(n),
      this.debug('Firing afterArrange event'),
      this.dispatchEvent(new CustomEvent('afterArrange', { detail: { target: this }, bubbles: !0 })),
      this.skipLayout)
    ) {
      this.warn('Skipping layout as per skipLayout property.');
      return;
    }
    (D(Array.from(this.children), { recursive: !0 }), t.lap('after arrange'));
  }
  async connectedCallback() {
    (await pt(), super.connectedCallback(), this.arrange());
  }
}
A = ve(V);
tt = new WeakMap();
Wt(A, 4, 'skipLayout', Nt, _, tt);
_ = Wt(A, 0, 'ContentAreaElement2', Lt, _);
H(A, 1, _);
function Ae(e, t) {
  const r = e.split('|');
  for (const n of r) {
    const i = t.querySelectorAll(n.trim());
    if (i.length > 0) return Array.from(i);
  }
  return [];
}
function $e(e) {
  class t extends e {
    beforeLayoutCallback(n, i, s) {
      return !1;
    }
    firstUpdated(n) {
      var i, s;
      (i = super.firstUpdated) == null || i.call(this, n);
      const a = ((s = this.shadowRoot) == null ? void 0 : s.querySelectorAll('slot[data-query]')) ?? [];
      for (const o of Array.from(a)) {
        if (!(o instanceof HTMLSlotElement)) continue;
        let u = o.getAttribute('name') ?? '';
        if (u !== '' && o.assignedElements({ flatten: !0 }).length > 0) continue;
        const c = o.getAttribute('data-query');
        if (!c) continue;
        let h = [];
        try {
          h = Ae(c, this);
        } catch (l) {
          throw (this.error(`"${l}" in slot`, o), l);
        }
        h.forEach((l) => {
          (o
            .getAttributeNames()
            .filter((p) => p.startsWith('data-set-attribute-'))
            .forEach((p) => {
              const d = p.replace(/^data-set-attribute-/, '');
              if (!l.hasAttribute(d)) {
                const b = o.getAttribute(p);
                b !== null && l.setAttribute(d, b);
              }
            }),
            u !== '' && l.setAttribute('slot', u));
        });
      }
      D(Array.from(this.children), { recursive: !0 });
    }
  }
  return t;
}
function Te(e) {
  var r, n, Mt;
  class t extends e {
    constructor() {
      super(...arguments);
      z(this, n);
      z(this, r);
    }
    connectedCallback() {
      (super.connectedCallback(), this.ensureDefaultStyleClass(), rt(this, n, Mt).call(this));
    }
    disconnectedCallback() {
      var o;
      ((o = M(this, r)) == null || o.disconnect(), U(this, r, void 0), super.disconnectedCallback());
    }
    ensureDefaultStyleClass() {
      Array.from(this.classList).some((u) => u.startsWith('style-')) || this.classList.add('style-default');
    }
  }
  return (
    (r = new WeakMap()),
    (n = new WeakSet()),
    (Mt = function () {
      M(this, r) === void 0 &&
        (U(this, r, new MutationObserver(() => this.ensureDefaultStyleClass())),
        M(this, r).observe(this, { attributes: !0, attributeFilter: ['class'] }));
    }),
    t
  );
}
const Se = {
  logging: !0,
  slotVisibility: !1,
  eventBinding: !1,
  breakpoints: !1,
  setDefaultStyle: !0,
  subLayoutApply: !1,
};
function Pe(e = {}) {
  const t = { ...Se, ...e };
  let r = ht;
  return (
    (r = vt(r)),
    t.setDefaultStyle && (r = Te(r)),
    t.logging && (r = yt(r)),
    t.slotVisibility && (r = te(r)),
    t.breakpoints && (r = Zt(r)),
    t.eventBinding && (r = bt(r)),
    t.subLayoutApply && (r = $e(r)),
    r
  );
}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const De = (e) => e ?? jt;
export { G as a, pt as H, Pe as n, De as o, Oe as r, wt as t, Ie as u };
