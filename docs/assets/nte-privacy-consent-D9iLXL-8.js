var Lt = (s) => {
  throw TypeError(s);
};
var Mt = (s, t, e) => t.has(s) || Lt('Cannot ' + e);
var Wt = (s, t, e) => (Mt(s, t, 'read from private field'), e ? e.call(s) : t.get(s)),
  Ot = (s, t, e) =>
    t.has(s) ? Lt('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(s) : t.set(s, e),
  Nt = (s, t, e, r) => (Mt(s, t, 'write to private field'), r ? r.call(s, e) : t.set(s, e), e);
import {
  b as _,
  A as B,
  E as dt,
  y as ht,
  D as It,
  j as Ne,
  r as O,
  n as Oe,
} from './_virtual_tdemo-client-CxMeb5Rk.js';
import { t as ft, i as pt, e as ut } from './directive-CJw_OlP2.js'; /**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { r as ie } from './index-BR6EnczS.js';
import {
  D as De,
  c as ee,
  S as Le,
  n as lt,
  s as Me,
  w as re,
  a as se,
  L as Te,
  l as We,
} from './nextrap-element-DeSHPIJn.js';
import { t as J, n as w } from './property-C2fH_zxw.js'; /* empty css              */
const Ie = (s, t, e) => (
  (e.configurable = !0),
  (e.enumerable = !0),
  Reflect.decorate && typeof t != 'object' && Object.defineProperty(s, t, e),
  e
);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function Pe(s, t) {
  return (e, r, i) => {
    const n = (o) => {
      var a;
      return ((a = o.renderRoot) == null ? void 0 : a.querySelector(s)) ?? null;
    };
    return Ie(e, r, {
      get() {
        return n(this);
      },
    });
  };
}
class Be {
  constructor(t, e = !1) {
    ((this.delay = t), (this.max_delay = e), (this.timeout = null), (this.startTimeWithMs = 0));
  }
  async wait() {
    return (
      this.startTimeWithMs === 0 && (this.startTimeWithMs = Date.now()),
      this.timeout &&
        (this.max_delay === !1 || this.startTimeWithMs + this.max_delay > Date.now()) &&
        clearTimeout(this.timeout),
      new Promise((t) => {
        this.timeout = setTimeout(() => {
          ((this.startTimeWithMs = 0), t(!0));
        }, this.delay);
      })
    );
  }
  debounce(t) {
    (this.timeout && clearTimeout(this.timeout),
      (this.timeout = setTimeout(() => {
        t();
      }, this.delay)));
  }
}
const Y = {
  xs: { name: 'xs', minWidth: 0 },
  sm: { name: 'sm', minWidth: 576 },
  md: { name: 'md', minWidth: 768 },
  lg: { name: 'lg', minWidth: 992 },
  xl: { name: 'xl', minWidth: 1200 },
  xxl: { name: 'xxl', minWidth: 1400 },
};
let j = Y.xs;
function tt() {
  const s = window.innerWidth;
  let t = Y.xs;
  for (const e in Y) {
    const r = Y[e];
    s >= r.minWidth && (t = r);
  }
  return t;
}
if (!window.__nextrap_current_breakpoint) {
  window.__nextrap_current_breakpoint = tt();
  const s = new Be(200, 500);
  window.addEventListener('resize', async () => {
    if ((await s.wait(), j !== tt())) {
      ((j = tt()), (window.__nextrap_current_breakpoint = j));
      const t = new CustomEvent('breakpoint-changed', { detail: { breakpoint: j } });
      (console.log('Breakpoint changed', j), window.dispatchEvent(t));
    }
  });
}
const ne = 'nte-group-open-close';
function je(s, t) {
  document.dispatchEvent(new CustomEvent(ne, { bubbles: !1, composed: !0, detail: { open: s, groupName: t } }));
}
function ze(s, t) {
  const e = document.createElement('template');
  return (
    (e.innerHTML = s.trim()),
    t.append(e.content.cloneNode(!0)),
    new Proxy(
      {},
      {
        get(r, i) {
          if (i === 'fragment') return t;
          if (typeof i == 'string') {
            const n = t.getElementById(i);
            if (!n) throw new Error(`❌ Unknown id '${i}'.`);
            return n;
          }
        },
      },
    )
  );
}
const Dt = class Dt extends ht {
  constructor(t) {
    super();
    const e = this.createRenderRoot();
    this.$ = ze(t, e);
  }
  connectedCallback() {
    super.connectedCallback();
    let t = this.css;
    Array.isArray(t) || (t = [t]);
    const e = t.map((r) => (r instanceof Oe ? r.styleSheet : O(r).styleSheet));
    this.shadowRoot.adoptedStyleSheets = e;
  }
};
Dt.DEFINITION = { classes: [], attributes: {} };
let Pt = Dt;
const Fe =
  ':host{--size: 40px;--color: var(--nt-text, black);--color-hover: var(--color);--width: 4px;height:var(--size);width:var(--size);display:block}#button{padding:0;width:100%;height:100%;cursor:pointer}.hamburger{display:block;-webkit-appearance:none;-moz-appearance:none;appearance:none;border:0 none;background:none;position:relative;transition:transform .4s}.hamburger:hover{--color: var(--color-hover)}:host([open]) .hamburger .bar:nth-of-type(1){transform-origin:center center;transform:translateY(calc(.5em - var(--width) / 2)) rotate(45deg)}:host([open]) .hamburger .bar:nth-of-type(2){opacity:0}:host([open]) .hamburger .bar:nth-of-type(3){transform:translateY(calc(.5em - var(--width) / 2)) rotate(-45deg)}:host(:not([open])) #button:hover .bar:nth-of-type(1){transform:translateY(calc(.2em - var(--width) / 2))}:host(:not([open])) #button:hover .bar:nth-of-type(2){transform:translateY(calc(.5em - var(--width) / 2))}:host(:not([open])) #button:hover .bar:nth-of-type(3){transform:translateY(calc(.8em - var(--width) / 2))}.bar{font-size:var(--size)}.bar:nth-of-type(1){transform:translateY(calc(.25em - var(--width) / 2))}.bar:nth-of-type(2){transform:translateY(calc(.5em - var(--width) / 2))}.bar:nth-of-type(3){transform:translateY(calc(.75em - var(--width) / 2))}.bar{height:var(--width);width:var(--size);display:block;position:absolute;top:0;background-color:var(--color);transition:.4s}';
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Re = Symbol.for(''),
  He = (s) => {
    if ((s == null ? void 0 : s.r) === Re) return s == null ? void 0 : s._$litStatic$;
  },
  Bt = new Map(),
  Ue =
    (s) =>
    (t, ...e) => {
      const r = e.length;
      let i, n;
      const o = [],
        a = [];
      let h,
        l = 0,
        p = !1;
      for (; l < r;) {
        for (h = t[l]; l < r && ((n = e[l]), (i = He(n)) !== void 0);) ((h += i + t[++l]), (p = !0));
        (l !== r && a.push(n), o.push(h), l++);
      }
      if ((l === r && o.push(t[r]), p)) {
        const c = o.join('$$lit$$');
        ((t = Bt.get(c)) === void 0 && ((o.raw = o), Bt.set(c, (t = o))), (e = a));
      }
      return s(t, ...e);
    },
  qe = Ue(_);
var Ve = Object.create,
  mt = Object.defineProperty,
  Ye = Object.getOwnPropertyDescriptor,
  oe = (s, t) => ((t = Symbol[s]) ? t : Symbol.for('Symbol.' + s)),
  I = (s) => {
    throw TypeError(s);
  },
  Ge = (s, t, e) => (t in s ? mt(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (s[t] = e)),
  jt = (s, t) => mt(s, 'name', { value: t, configurable: !0 }),
  Ke = (s) => [, , , Ve((s == null ? void 0 : s[oe('metadata')]) ?? null)],
  ae = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  F = (s) => (s !== void 0 && typeof s != 'function' ? I('Function expected') : s),
  Ze = (s, t, e, r, i) => ({
    kind: ae[s],
    name: t,
    metadata: r,
    addInitializer: (n) => (e._ ? I('Already initialized') : i.push(F(n || null))),
  }),
  Xe = (s, t) => Ge(t, oe('metadata'), s[3]),
  T = (s, t, e, r) => {
    for (var i = 0, n = s[t >> 1], o = n && n.length; i < o; i++) t & 1 ? n[i].call(e) : (r = n[i].call(e, r));
    return r;
  },
  q = (s, t, e, r, i, n) => {
    var o,
      a,
      h,
      l,
      p,
      c = t & 7,
      u = !!(t & 8),
      d = !!(t & 16),
      f = c > 3 ? s.length + 1 : c ? (u ? 1 : 2) : 0,
      g = ae[c + 5],
      $ = c > 3 && (s[f - 1] = []),
      x = s[f] || (s[f] = []),
      b =
        c &&
        (!d && !u && (i = i.prototype),
        c < 5 &&
          (c > 3 || !d) &&
          Ye(
            c < 4
              ? i
              : {
                  get [e]() {
                    return zt(this, n);
                  },
                  set [e](m) {
                    return Ft(this, n, m);
                  },
                },
            e,
          ));
    c ? d && c < 4 && jt(n, (c > 2 ? 'set ' : c > 1 ? 'get ' : '') + e) : jt(i, e);
    for (var L = r.length - 1; L >= 0; L--)
      ((l = Ze(c, e, (h = {}), s[3], x)),
        c &&
          ((l.static = u),
          (l.private = d),
          (p = l.access = { has: d ? (m) => Je(i, m) : (m) => e in m }),
          c ^ 3 && (p.get = d ? (m) => (c ^ 1 ? zt : Qe)(m, i, c ^ 4 ? n : b.get) : (m) => m[e]),
          c > 2 && (p.set = d ? (m, M) => Ft(m, i, M, c ^ 4 ? n : b.set) : (m, M) => (m[e] = M))),
        (a = (0, r[L])(c ? (c < 4 ? (d ? n : b[g]) : c > 4 ? void 0 : { get: b.get, set: b.set }) : i, l)),
        (h._ = 1),
        c ^ 4 || a === void 0
          ? F(a) && (c > 4 ? $.unshift(a) : c ? (d ? (n = a) : (b[g] = a)) : (i = a))
          : typeof a != 'object' || a === null
            ? I('Object expected')
            : (F((o = a.get)) && (b.get = o), F((o = a.set)) && (b.set = o), F((o = a.init)) && $.unshift(o)));
    return (c || Xe(s, i), b && mt(i, e, b), d ? (c ^ 4 ? n : b) : i);
  },
  vt = (s, t, e) => t.has(s) || I('Cannot ' + e),
  Je = (s, t) => (Object(t) !== t ? I('Cannot use the "in" operator on this value') : s.has(t)),
  zt = (s, t, e) => (vt(s, t, 'read from private field'), e ? e.call(s) : t.get(s)),
  et = (s, t, e) =>
    t.has(s) ? I('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(s) : t.set(s, e),
  Ft = (s, t, e, r) => (vt(s, t, 'write to private field'), r ? r.call(s, e) : t.set(s, e), e),
  Qe = (s, t, e) => (vt(s, t, 'access private method'), e),
  ce,
  le,
  he,
  de,
  nt,
  ue,
  E,
  gt,
  bt,
  yt;
ue = [J('nte-burger')];
class D extends ((nt = lt({ eventBinding: !0 })),
(de = [w({ type: Boolean, attribute: 'open', reflect: !0 })]),
(he = [w({ type: String, reflect: !0 })]),
(le = [w({ type: String, reflect: !1, attribute: 'data-group-name' })]),
(ce = [Te(ne, { target: 'document' })]),
nt) {
  constructor() {
    (super(),
      T(E, 5, this),
      et(this, gt, T(E, 8, this, !1)),
      T(E, 11, this),
      et(this, bt, T(E, 12, this, 'Menu')),
      T(E, 15, this),
      et(this, yt, T(E, 16, this, '')),
      T(E, 19, this));
  }
  render() {
    return qe` <button id="button" class="hamburger">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </button>`;
  }
  listenEvents(t) {
    t instanceof CustomEvent && t.detail.groupName === this.dataGroupName && (this.open = t.detail.open);
  }
  firstUpdated(t) {
    super.firstUpdated(t);
    const e = this.renderRoot.querySelector('#button');
    e &&
      Array.from(this.attributes).forEach((r) => {
        r.name.startsWith('aria-') && e.setAttribute(r.name, r.value);
      });
  }
  update(t) {
    (super.update(t), t.has('open') && this.dataGroupName !== '' && je(this.open, this.dataGroupName));
  }
}
E = Ke(nt);
gt = new WeakMap();
bt = new WeakMap();
yt = new WeakMap();
q(E, 4, 'open', de, D, gt);
q(E, 4, 'text', he, D, bt);
q(E, 4, 'dataGroupName', le, D, yt);
q(E, 1, 'listenEvents', ce, D);
D = q(E, 0, 'NteBurger', ue, D);
D.styles = [O(Fe)];
T(E, 1, D);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const { I: ts } = Ne,
  Rt = (s) => s,
  Ht = () => document.createComment(''),
  z = (s, t, e) => {
    var n;
    const r = s._$AA.parentNode,
      i = t === void 0 ? s._$AB : t._$AA;
    if (e === void 0) {
      const o = r.insertBefore(Ht(), i),
        a = r.insertBefore(Ht(), i);
      e = new ts(o, a, s, s.options);
    } else {
      const o = e._$AB.nextSibling,
        a = e._$AM,
        h = a !== s;
      if (h) {
        let l;
        ((n = e._$AQ) == null || n.call(e, s), (e._$AM = s), e._$AP !== void 0 && (l = s._$AU) !== a._$AU && e._$AP(l));
      }
      if (o !== i || h) {
        let l = e._$AA;
        for (; l !== o;) {
          const p = Rt(l).nextSibling;
          (Rt(r).insertBefore(l, i), (l = p));
        }
      }
    }
    return e;
  },
  W = (s, t, e = s) => (s._$AI(t, e), s),
  es = {},
  ss = (s, t = es) => (s._$AH = t),
  rs = (s) => s._$AH,
  st = (s) => {
    (s._$AR(), s._$AA.remove());
  };
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const Ut = (s, t, e) => {
    const r = new Map();
    for (let i = t; i <= e; i++) r.set(s[i], i);
    return r;
  },
  is = ut(
    class extends pt {
      constructor(s) {
        if ((super(s), s.type !== ft.CHILD)) throw Error('repeat() can only be used in text expressions');
      }
      dt(s, t, e) {
        let r;
        e === void 0 ? (e = t) : t !== void 0 && (r = t);
        const i = [],
          n = [];
        let o = 0;
        for (const a of s) ((i[o] = r ? r(a, o) : o), (n[o] = e(a, o)), o++);
        return { values: n, keys: i };
      }
      render(s, t, e) {
        return this.dt(s, t, e).values;
      }
      update(s, [t, e, r]) {
        const i = rs(s),
          { values: n, keys: o } = this.dt(t, e, r);
        if (!Array.isArray(i)) return ((this.ut = o), n);
        const a = this.ut ?? (this.ut = []),
          h = [];
        let l,
          p,
          c = 0,
          u = i.length - 1,
          d = 0,
          f = n.length - 1;
        for (; c <= u && d <= f;)
          if (i[c] === null) c++;
          else if (i[u] === null) u--;
          else if (a[c] === o[d]) ((h[d] = W(i[c], n[d])), c++, d++);
          else if (a[u] === o[f]) ((h[f] = W(i[u], n[f])), u--, f--);
          else if (a[c] === o[f]) ((h[f] = W(i[c], n[f])), z(s, h[f + 1], i[c]), c++, f--);
          else if (a[u] === o[d]) ((h[d] = W(i[u], n[d])), z(s, i[c], i[u]), u--, d++);
          else if ((l === void 0 && ((l = Ut(o, d, f)), (p = Ut(a, c, u))), l.has(a[c])))
            if (l.has(a[u])) {
              const g = p.get(o[d]),
                $ = g !== void 0 ? i[g] : null;
              if ($ === null) {
                const x = z(s, i[c]);
                (W(x, n[d]), (h[d] = x));
              } else ((h[d] = W($, n[d])), z(s, i[c], $), (i[g] = null));
              d++;
            } else (st(i[u]), u--);
          else (st(i[c]), c++);
        for (; d <= f;) {
          const g = z(s, h[f + 1]);
          (W(g, n[d]), (h[d++] = g));
        }
        for (; c <= u;) {
          const g = i[c++];
          g !== null && st(g);
        }
        return ((this.ut = o), ss(s, h), dt);
      }
    },
  );
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const ns = ut(
  class extends pt {
    constructor(s) {
      var t;
      if (
        (super(s), s.type !== ft.ATTRIBUTE || s.name !== 'class' || ((t = s.strings) == null ? void 0 : t.length) > 2)
      )
        throw Error(
          '`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.',
        );
    }
    render(s) {
      return (
        ' ' +
        Object.keys(s)
          .filter((t) => s[t])
          .join(' ') +
        ' '
      );
    }
    update(s, [t]) {
      var r, i;
      if (this.st === void 0) {
        ((this.st = new Set()),
          s.strings !== void 0 &&
            (this.nt = new Set(
              s.strings
                .join(' ')
                .split(/\s/)
                .filter((n) => n !== ''),
            )));
        for (const n in t) t[n] && !((r = this.nt) != null && r.has(n)) && this.st.add(n);
        return this.render(t);
      }
      const e = s.element.classList;
      for (const n of this.st) n in t || (e.remove(n), this.st.delete(n));
      for (const n in t) {
        const o = !!t[n];
        o === this.st.has(n) ||
          ((i = this.nt) != null && i.has(n)) ||
          (o ? (e.add(n), this.st.add(n)) : (e.remove(n), this.st.delete(n)));
      }
      return dt;
    }
  },
);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const pe = 'important',
  os = ' !' + pe,
  as = ut(
    class extends pt {
      constructor(s) {
        var t;
        if (
          (super(s), s.type !== ft.ATTRIBUTE || s.name !== 'style' || ((t = s.strings) == null ? void 0 : t.length) > 2)
        )
          throw Error(
            'The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.',
          );
      }
      render(s) {
        return Object.keys(s).reduce((t, e) => {
          const r = s[e];
          return r == null
            ? t
            : t +
                `${(e = e.includes('-') ? e : e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, '-$&').toLowerCase())}:${r};`;
        }, '');
      }
      update(s, [t]) {
        const { style: e } = s.element;
        if (this.ft === void 0) return ((this.ft = new Set(Object.keys(t))), this.render(t));
        for (const r of this.ft)
          t[r] == null && (this.ft.delete(r), r.includes('-') ? e.removeProperty(r) : (e[r] = null));
        for (const r in t) {
          const i = t[r];
          if (i != null) {
            this.ft.add(r);
            const n = typeof i == 'string' && i.endsWith(os);
            r.includes('-') || n ? e.setProperty(r, n ? i.slice(0, -11) : i, n ? pe : '') : (e[r] = i);
          }
        }
        return dt;
      }
    },
  );
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function cs(s, t, e) {
  return s ? t(s) : e == null ? void 0 : e(s);
}
function ls(s) {
  var e;
  const t =
    (e = s.split(`
`)[0]) == null
      ? void 0
      : e.match(/:(\d+):(\d+)$/);
  return { line: t ? +t[1] : -1, column: t ? +t[2] : -1 };
}
const hs = (s, t, e = !1, r = '<undefined>') => {
  try {
    return t();
  } catch (i) {
    let { line: n, column: o } = ls((i == null ? void 0 : i.stack) ?? ''),
      a = String((s == null ? void 0 : s.originalCode) ?? ''),
      h = !1;
    s != null && s.originalTemplateString && ((n -= 2), (a = s.originalTemplateString), (h = !0));
    const l = a.split(`
`),
      p = Math.min(Math.max(n - 1, 0), l.length - 1),
      c = l[p] ?? '',
      u = Math.min(Math.max((o || 1) - 1, 0), c.length);
    let d = ' '.repeat(u + String(n).length) + '^^^^';
    h && (d = '^'.repeat(String(c).length));
    const f = l.map(($, x) =>
        x === p
          ? `${x + 1}: ${$}
 ${d}`
          : `${x + 1}: ${$}`,
      ).join(`
`),
      g = `Error while rendering \`${r}\`: ${i}
Line ${n}, Column ${u + 1}:

${n}:${c}
${d}

Compiled Template:
${f}
`;
    if (!e) console.warn('Caught error via *catch: ' + g);
    else throw (console.error('Caught error via *catch: ' + g), new Error(g));
    return String(i);
  }
};
function ds(s, t) {
  return {
    html: _,
    repeat: is,
    when: cs,
    styleMap: as,
    classMap: ns,
    catchError: hs,
    originalCode: s.toString(),
    originalTemplateString: t,
  };
}
var U;
class qt extends Error {
  constructor(e, r) {
    super(e);
    Ot(this, U);
    ((this.name = 'SyntaxTesterError'), Nt(this, U, r));
  }
  get code() {
    return Wt(this, U);
  }
}
U = new WeakMap();
function us(s) {
  try {
    new Function(s);
  } catch (t) {
    throw t instanceof SyntaxError ? new qt(`Syntax error: ${t.message}`, s) : new qt(String(t), s);
  }
}
let Vt = class extends Error {
  constructor(t, e, r, i) {
    (super(`Syntax Error: ${t} at line ${r}, column ${i}
Code: ${e}`),
      (this.name = 'SyntaxError'));
  }
};
class ps {
  htmlEntityDecoer(t) {
    return t ? (new DOMParser().parseFromString(t, 'text/html').body.textContent ?? '') : 'null';
  }
  wrapStrucutre(t, e) {
    const r = [];
    for (const n of t.attributes || [])
      if (n.name.startsWith('*')) {
        if (n.name === '*for') {
          const o = /^(.*?)\s+(in|of)\s+(.*?)(;(.*?))?$/.exec(n.value || '');
          if (!o) throw new Error(`Invalid *for attribute value: ${n.value}`);
          let a = 'null';
          (o[5] && (a = o[1] + ' => ' + o[5].trim()),
            this.testSyntax(t, n.name, o[1]),
            this.testSyntax(t, n.name, o[3]),
            this.testSyntax(t, n.name, a),
            o[2] === 'of'
              ? r.push({ start: `$$__litEnv.repeat(${o[3]}, ${a}, (${o[1]}, $index) => `, end: ')' })
              : o[2] === 'in' &&
                r.push({ start: `$$__litEnv.repeat(Object.keys(${o[3]}), ${a}, (${o[1]}, $index) => `, end: ')' }));
          continue;
        }
        if ((this.testSyntax(t, n.name, n.value || ''), n.name === '*if')) {
          (this.testSyntax(t, n.name, n.value || ''),
            r.push({
              start: `$$__litEnv.when(${this.getCatchErrorValue(t, '*if', n.value)}, ()=>{lastIf=true; return   `,
              end: '}, ()=>{lastIf=false; return $$__litEnv.html``})',
            }));
          continue;
        }
        if (n.name === '*do') {
          r.push({
            start: `(()=>{$$__litEnv.catchError($$__litEnv, ()=>{ ${n.value}}, true, '*do="${this.escapeStmt(n.value)}"'); return `,
            end: '})()',
          });
          continue;
        }
        if (n.name === '*catch') {
          r.push({ start: '$$__litEnv.catchError($$__litEnv, () => ', end: ')' });
          continue;
        }
        if (n.name === '*log') {
          r.push({
            start: `(()=>{$$__litEnv.catchError($$__litEnv, ()=>console.log(${n.value}), true, '*log="${this.escapeStmt(n.value)}"'); return `,
            end: '})()',
          });
          continue;
        }
        throw new Error(`Unknown attribute ${n.name} in element ${t.tagName}`);
      }
    if (r.length === 0) return e;
    let i = '$$__litEnv.html`' + e + '`';
    for (let n = r.length - 1; n >= 0; n--) i = r[n].start + i + r[n].end;
    return '${' + i + '}';
  }
  escapeStmt(t) {
    return t.replace(/'/g, "\\'");
  }
  getCatchErrorValue(t, e, r) {
    return `$$__litEnv.catchError($$__litEnv, ()=>(${r}), true, '${this.escapeStmt(e + '="' + r + '"')}')`;
  }
  parseString(t) {
    return t.replace(
      /{{\s*([^}]+?)\s*}}/g,
      (e, r) => `\${$$__litEnv.catchError($$__litEnv, ()=>${r}, true, '${this.escapeStmt(e)}')}`,
    );
  }
  testSyntax(t, e, r) {
    try {
      us(r);
    } catch (i) {
      throw new Vt(`${i.message} in attribute ${e}="${r}" of element ${t.tagName}`, r, 0, 0);
    }
  }
  parseElement(t) {
    let e = '';
    if (t.type === 'element') {
      if (((e += `<${t.tagName}`), t.attributes))
        for (const r of t.attributes) {
          ((r.value = this.htmlEntityDecoer(r.value || null)),
            ['.', ':', '~', '@'].includes(r.name[0]) && this.testSyntax(t, r.name, r.value || ''));
          const i = this.getCatchErrorValue(t, r.name, r.value || '');
          if (!r.name.startsWith('*')) {
            if (r.name.startsWith('@')) {
              e += ` ${r.name}=\${()=>{$$__litEnv.catchError($$__litEnv, ()=>{${r.value}}, true, '${this.escapeStmt(r.name + '="' + r.value + '"')}')}}`;
              continue;
            }
            if (r.name.startsWith('~')) {
              let n = '';
              switch (r.name) {
                case '~style':
                  n = 'styleMap';
                  break;
                case '~class':
                  n = 'classMap';
                  break;
                default:
                  throw new Error(`Unknown directive ${r.name} in element ${t.tagName}`);
              }
              e += ` ${r.name.slice(1)}=\${$$__litEnv.${n}(${i})}`;
              continue;
            }
            if (r.name.startsWith('?')) {
              e += ` ${r.name}=\${${i}}`;
              continue;
            }
            if (r.name === '$ref') {
              e += ` \${$$__litEnv.ref($el => { ${i} })}`;
              continue;
            }
            if (r.name.startsWith('.')) {
              e += ` ${r.name}=\${${i}}`;
              continue;
            }
            ((e += ` ${r.name}`), r.value !== void 0 && (e += `="${this.parseString(r.value)}"`));
          }
        }
      if (((e += '>'), t.children)) for (const r of t.children) e += this.parseElement(r);
      t.isVoid || (e += `</${t.tagName}>`);
    } else t.type === 'text' && (e += this.parseString(t.textContent || ''));
    return this.wrapStrucutre(t, e);
  }
  buildFunctionBody(t) {
    let e = '';
    for (const i of t) e += this.parseElement(i);
    return `with($scope){return $$__litEnv.html\`${e}\`};`;
  }
  buildFunction(t) {
    const e = this.buildFunctionBody(t);
    try {
      return new Function('$scope', '$$__litEnv', e);
    } catch (r) {
      throw (console.log('Error building function:', r), new Vt(String(r), e, 0, 0));
    }
  }
}
class fe {
  parse(t) {
    const e = new vs(t);
    return new ms(e).parseDocument();
  }
}
const fs = new Set([
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
  'command',
  'keygen',
  'menuitem',
]);
class ms {
  constructor(t) {
    this.s = t;
  }
  parseDocument() {
    return this.parseNodes();
  }
  parseNodes(t) {
    const e = [];
    for (; !this.s.eof();) {
      if (this.s.startsWith('</')) {
        const { line: r, col: i } = this.s.position(),
          n = this.parseClosingTag();
        return (
          t || this.s.throwError(`Unexpected closing tag </${n}>`, r, i),
          n.toLowerCase() !== t.tag.toLowerCase() &&
            this.s.throwError(
              `Mismatched closing tag: expected </${t.tag}>, found </${n}> (opened at line ${t.line}, col ${t.col})`,
              r,
              i,
            ),
          e
        );
      }
      if (this.s.peek() === '<')
        if (this.s.startsWith('<!--')) {
          e.push(this.parseComment());
          continue;
        } else if (this.s.startsWith('<!')) {
          e.push(this.parseDeclaration());
          continue;
        } else if (this.s.startsWith('<?')) {
          e.push(this.parseProcessingInstruction());
          continue;
        } else if (this.isTagStart()) {
          e.push(this.parseElement());
          continue;
        } else {
          e.push(this.parseText());
          continue;
        }
      else {
        e.push(this.parseText());
        continue;
      }
    }
    return (
      t &&
        this.s.throwError(
          `Unclosed tag <${t.tag}> (opened at line ${t.line}, col ${t.col}) before end of input`,
          this.s.line,
          this.s.col,
        ),
      e
    );
  }
  isTagStart() {
    const t = this.s.peek(0),
      e = this.s.peek(1);
    return t !== '<' || !e ? !1 : e === '/' || e === '!' || e === '?' ? !0 : rt(e);
  }
  parseText() {
    let t = '';
    for (this.s.position(); !this.s.eof();) {
      if (this.s.peek() === '<') {
        if (this.s.startsWith('<!--') || this.s.startsWith('</') || this.s.startsWith('<!') || this.s.startsWith('<?'))
          break;
        const r = this.s.peek(1);
        if (r && rt(r)) break;
        t += this.s.next();
        continue;
      }
      t += this.s.next();
    }
    return { type: 'text', textContent: t };
  }
  parseComment() {
    const t = this.s.position();
    this.s.consumeExpected('<!--');
    const e = this.s.readUntilSequence('-->', () =>
      this.s.throwError('Unterminated comment. Expected -->', t.line, t.col),
    );
    return (this.s.consumeExpected('-->'), { type: 'other', textContent: e });
  }
  parseDeclaration() {
    const t = this.s.position();
    this.s.consumeExpected('<!');
    const e = this.s.readUntilChar('>', () => this.s.throwError('Unterminated declaration. Expected >', t.line, t.col));
    return (this.s.consumeExpected('>'), { type: 'other', textContent: `!${e}` });
  }
  parseProcessingInstruction() {
    const t = this.s.position();
    this.s.consumeExpected('<?');
    const e = this.s.readUntilSequence('?>', () =>
      this.s.throwError('Unterminated processing instruction. Expected ?>', t.line, t.col),
    );
    return (this.s.consumeExpected('?>'), { type: 'other', textContent: `?${e}` });
  }
  parseClosingTag() {
    const t = this.s.position();
    (this.s.consumeExpected('</'), this.s.skipWhitespace());
    const e = this.readTagName();
    if (
      (e || this.s.throwError('Invalid closing tag name', t.line, t.col),
      this.s.skipWhitespace(),
      this.s.peek() !== '>')
    ) {
      const r = this.s.position();
      this.s.throwError(`Expected '>' after closing tag </${e}>`, r.line, r.col);
    }
    return (this.s.next(), e);
  }
  parseElement() {
    const t = this.s.position();
    this.s.consumeExpected('<');
    const e = this.readTagName();
    e || this.s.throwError('Invalid tag name after "<"', t.line, t.col);
    const r = [];
    let i = !1;
    for (; !this.s.eof();) {
      if ((this.s.skipWhitespace(), this.s.startsWith('/>'))) {
        ((i = !0), this.s.consumeExpected('/>'));
        break;
      }
      const h = this.s.peek();
      if (h === '>') {
        this.s.next();
        break;
      }
      h === null && this.s.throwError('Unexpected end of input inside start tag', t.line, t.col);
      const l = this.parseAttribute();
      r.push(l);
    }
    const n = e.toLowerCase();
    if (i || fs.has(n)) return { type: 'element', tagName: e, attributes: r, children: [], isVoid: !0 };
    const a = this.parseNodes({ tag: e, line: t.line, col: t.col });
    return { type: 'element', tagName: e, attributes: r, children: a, isVoid: !1 };
  }
  parseAttribute() {
    const t = this.s.position(),
      e = this.readAttributeName();
    (e || this.s.throwError('Invalid attribute name', t.line, t.col), this.s.skipWhitespace());
    let r;
    if (this.s.peek() === '=') {
      (this.s.next(), this.s.skipWhitespace());
      const i = this.s.peek();
      if (i === '"' || i === "'") {
        this.s.next();
        const n = i,
          o = this.s.readUntilChar(n, () =>
            this.s.throwError(`Unterminated quoted attribute value for "${e}"`, t.line, t.col),
          );
        (this.s.consumeExpected(n), (r = o));
      } else {
        let n = '';
        for (; !this.s.eof();) {
          const o = this.s.peek();
          if (o === null || me(o) || o === '>' || (o === '/' && this.s.peek(1) === '>')) break;
          n += this.s.next();
        }
        r = n;
      }
    }
    return { name: e, value: r };
  }
  readTagName() {
    let t = '';
    const e = this.s.peek();
    if (!e || !rt(e)) return null;
    for (t += this.s.next(); !this.s.eof();) {
      const r = this.s.peek();
      if (!r || !gs(r)) break;
      t += this.s.next();
    }
    return t;
  }
  readAttributeName() {
    let t = '';
    const e = this.s.peek();
    if (!e || !bs(e)) return null;
    for (t += this.s.next(); !this.s.eof();) {
      const r = this.s.peek();
      if (!r || !ys(r)) break;
      t += this.s.next();
    }
    return t;
  }
}
class vs {
  constructor(t) {
    ((this.input = t), (this.pos = 0), (this.line = 1), (this.col = 1));
  }
  eof() {
    return this.pos >= this.input.length;
  }
  peek(t = 0) {
    const e = this.pos + t;
    return e < 0 || e >= this.input.length ? null : this.input[e];
  }
  next() {
    if (this.eof()) return null;
    const t = this.input[this.pos++];
    return (
      t ===
      `
`
        ? ((this.line += 1), (this.col = 1))
        : t === '\r'
          ? this.peek() ===
              `
` || ((this.line += 1), (this.col = 1))
          : (this.col += 1),
      t
    );
  }
  startsWith(t) {
    return this.input.startsWith(t, this.pos);
  }
  consumeExpected(t) {
    if (!this.startsWith(t)) {
      const { line: e, col: r } = this.position();
      this.throwError(`Expected "${t}"`, e, r);
    }
    for (let e = 0; e < t.length; e++) this.next();
  }
  readUntilSequence(t, e) {
    let r = '';
    for (; !this.eof() && !this.startsWith(t);) {
      const i = this.next();
      if (i === null) break;
      r += i;
    }
    return (this.eof() && !this.startsWith(t) && e && e(), r);
  }
  readUntilChar(t, e) {
    let r = '';
    for (; !this.eof() && this.peek() !== t;) {
      const n = this.next();
      if (n === null) break;
      r += n;
    }
    return (this.eof() && e && e(), r);
  }
  skipWhitespace() {
    for (; !this.eof();) {
      const t = this.peek();
      if (!t || !me(t)) break;
      this.next();
    }
  }
  position() {
    return { index: this.pos, line: this.line, col: this.col };
  }
  throwError(t, e = this.line, r = this.col) {
    const i =
      this.input.split(`
`)[e - 1] || '';
    throw new Error(`[Html2AstParser] ${t} at line ${e}, column ${r}: 
'${i}'`);
  }
}
function rt(s) {
  return /[A-Za-z]/.test(s);
}
function gs(s) {
  return /[A-Za-z0-9\-\_\:\.]/.test(s);
}
function bs(s) {
  return /[A-Za-z_:*@?.~]/.test(s);
}
function ys(s) {
  return /[A-Za-z0-9_:\-.~]/.test(s);
}
function me(s) {
  return (
    s === ' ' ||
    s === '	' ||
    s ===
      `
` ||
    s === '\r' ||
    s === '\f'
  );
}
class G {
  constructor(t, e) {
    ((this.fn = null), (this.scope = null), (this.templateString = t), e && ((e.$tpl = this), (this.scope = e)));
  }
  getCompiledTemplate() {
    return this.fn ? this.fn : (new fe().parse(this.templateString), (this.fn = ws(this.templateString)), this.fn);
  }
  render() {
    if (!this.scope) throw new Error('Scope is not defined. Please define a scope using scopeDefine.');
    const t = this.getCompiledTemplate();
    return t(this.scope, ds(t, this.templateString));
  }
  renderIntoElement(t) {
    if (!t) throw new Error('Element is not defined. Please provide a valid HTMLElement to render into.');
    It(this.render(), t);
  }
  renderInElement(t) {
    It(this.render(), t);
  }
}
function ws(s) {
  const t = new fe().parse(s);
  return new ps().buildFunction(t);
}
function _s(s) {
  if (
    ((s.$update = () => {
      s.$this && typeof s.$this.requestUpdate == 'function' && s.$this.requestUpdate();
    }),
    s.$tpl !== void 0)
  )
    if (typeof s.$tpl == 'string') s.$tpl = new G(s.$tpl);
    else if (s.$tpl instanceof G) s.$tpl.scope = s;
    else throw new Error('Invalid value for $tpl: Expected string or ProLitTemplate, found' + typeof s.$tpl);
  return new Proxy(s, {
    get(t, e) {
      if (e === '$tpl') {
        if (!t.$tpl) throw new Error('Template is not defined. Please define a template using the $tpl property.');
        return t.$tpl;
      }
      return e === '$raw'
        ? t
        : e === '$rawPure'
          ? Object.fromEntries(Object.entries(t).filter(([r]) => !r.startsWith('$')))
          : t[e];
    },
    set(t, e, r) {
      if (((t[e] = r), !e.startsWith('$') && s.$this && s.$this.requestUpdate(), e === '$tpl')) {
        if (!(r instanceof G)) throw new Error('$tpl must be an instance of Template.');
        r.scope = s;
      }
      return !0;
    },
  });
}
function ot(s, t) {
  for (const e in t)
    t[e] && typeof t[e] == 'object' && !Array.isArray(t[e]) ? (s[e] || (s[e] = {}), ot(s[e], t[e])) : (s[e] = t[e]);
  return s;
}
async function $s(s, t) {
  for (const e of Array.from(s.content.querySelectorAll('[import-src]'))) {
    t.log('Processing [import-src] element', e);
    const r = e.getAttribute('import-src');
    r || t.throwError('import element is missing the src attribute', e);
    const i = await fetch(r);
    (i.ok || t.throwError(`Failed to load content from ${r}: ${i.status} ${i.statusText}`, e),
      (e.innerHTML = await i.text()));
  }
  return s;
}
async function ks(s, t) {
  const e = await fetch(s);
  e.ok || t.throwError(`Failed to load content from ${s}: ${e.status} ${e.statusText}`);
  const r = await e.text(),
    i = ee('template');
  i.innerHTML = r;
  const o = i.content.querySelector('script[scope]');
  return { template: r, scope: JSON.parse((o == null ? void 0 : o.textContent) || 'null') || null };
}
function Es(s, t) {
  let e = s.querySelector('template');
  e ||
    (t.log('No <template> element found inside the provided root element. Wrapping content into template'),
    (e = document.createElement('template')),
    (e.innerHTML = s.innerHTML),
    (s.innerHTML = ''),
    s.appendChild(e));
  const r = e.content.querySelector('script[scope]');
  t.log('Found scope script:', r);
  const i = r != null && r.textContent ? JSON.parse(r.textContent) : null;
  return (r && e.content.removeChild(r), { template: e.innerHTML, scope: i });
}
async function xs(s, t, e) {
  const r = Ss(t),
    i = Object.getPrototypeOf(async function () {}).constructor;
  try {
    const o = await new i('host', 'scope', 'console', 'fetch', '"use strict"; return (' + r + ');')(
      s,
      e,
      console,
      Gt(),
    );
    return (Yt(o), o);
  } catch {
    try {
      const a = await new i('host', 'scope', 'console', 'fetch', '"use strict"; ' + r)(s, e, console, Gt());
      return (Yt(a), a);
    } catch (o) {
      const a = o instanceof Error ? o : new Error(typeof o == 'string' ? o : 'Unknown evaluation error');
      throw new Error(`scope-init evaluation failed: ${a.message}`);
    }
  }
}
function Ss(s) {
  let t = (s ?? '').trim();
  return (t.toLowerCase().startsWith('javascript:') && (t = t.slice(11).trim()), t);
}
function Yt(s) {
  if (s === null || typeof s != 'object' || Array.isArray(s))
    throw new Error('scope-init must evaluate to an object (e.g. { foo: "bar" })');
}
function Gt() {
  if (typeof fetch == 'function') return fetch;
  throw new Error('fetch is not available in this environment');
}
var Cs = Object.defineProperty,
  As = Object.getOwnPropertyDescriptor,
  ve = (s) => {
    throw TypeError(s);
  },
  Q = (s, t, e, r) => {
    for (var i = r > 1 ? void 0 : r ? As(t, e) : t, n = s.length - 1, o; n >= 0; n--)
      (o = s[n]) && (i = (r ? o(t, e, i) : o(i)) || i);
    return (r && i && Cs(t, e, i), i);
  },
  ge = (s, t, e) => t.has(s) || ve('Cannot ' + e),
  Kt = (s, t, e) => (ge(s, t, 'read from private field'), t.get(s)),
  Zt = (s, t, e) =>
    t.has(s) ? ve('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(s) : t.set(s, e),
  Xt = (s, t, e, r) => (ge(s, t, 'write to private field'), t.set(s, e), e),
  K,
  Z;
let H = class extends se(ht) {
  constructor() {
    (super(),
      (this.updateOn = 'change keyup click'),
      (this.src = ''),
      (this.srcData = null),
      (this.myProLitTemplate = null),
      Zt(this, K),
      Zt(this, Z, !0),
      (this.$scope = _s({})),
      (this.renderInElement = ee('div', { style: 'display: contents' })),
      Xt(this, K, new De(50, 200)));
  }
  createRenderRoot() {
    return this;
  }
  async _renderTemplates(s = !1) {
    if (!this.myProLitTemplate || s) {
      let t;
      if (this.srcData) t = this.srcData.template;
      else {
        const e = Array.from(this.querySelectorAll('template'));
        if (e.length === 0) {
          this.warn(
            'No templates found in tj-html-scope element. Please add <template> elements inside the tj-html-scope element.',
          );
          return;
        }
        e.length > 1 &&
          this.warn('Multiple templates found in tj-html-scope element. Only the first template will be rendered.');
        let r = e[0];
        ((r = await $s(r, this.getLogger('evalImportSrc'))), (t = r.innerHTML));
      }
      this.myProLitTemplate = new G(t, this.$scope);
    }
    (this.myProLitTemplate.renderInElement(this.renderInElement),
      Kt(this, Z) && (this._updateScope(), Xt(this, Z, !1)));
  }
  _updateScope() {
    for (const s of Array.from(this.querySelectorAll('[name]'))) {
      const t = s.getAttribute('name');
      t && s.value !== void 0 && (this.$scope[t] = s.value);
    }
    this.log('Scope updated', this.$scope.$rawPure);
  }
  async _initializeScopeFromInit() {
    await Kt(this, K).wait();
    const s = {};
    if (
      (this.src && this.src.trim() !== ''
        ? (this.log('Loading external src', this.src),
          (this.srcData = await ks(this.src, this.getLogger('loadExternalSrc'))),
          this.log('External src loaded', this.srcData))
        : ((this.srcData = Es(this, this.getLogger('loadInlineTemplate'))),
          this.log('Inline template loaded', this.srcData)),
      ot(s, this.srcData.scope),
      this.scopeInit && this.scopeInit.trim() !== '')
    )
      try {
        this.log('Evaluating scope-init expression', this.scopeInit);
        const t = await xs(this, this.scopeInit, this.$scope);
        (this.log('Scope-init evaluation result', t), ot(s, t));
      } catch (t) {
        this.error('scope-init evaluation failed', t);
      }
    (this.appendChild(this.renderInElement),
      Object.assign(this.$scope, s),
      this.dispatchEvent(new CustomEvent('scope-update')));
  }
  updated(s) {
    var e;
    this.log('update(): Property change', s);
    const t = () => {
      (this._updateScope(), this._renderTemplates());
    };
    for (const r of this.updateOn.replace(',', ' ').split(' '))
      r.trim() !== '' && (this.removeEventListener(r, t), this.addEventListener(r, t));
    (e = s == null ? void 0 : s.has) != null &&
      e.call(s, 'scopeInit') &&
      this._initializeScopeFromInit().then(() => t());
  }
  async connectedCallback() {
    (await re(),
      super.connectedCallback(),
      this.log('Connected', this.$scope),
      this._initializeScopeFromInit()
        .catch(() => {})
        .finally(() => {
          (this._updateScope(), this._renderTemplates());
        }));
  }
};
K = new WeakMap();
Z = new WeakMap();
Q([w({ type: String, reflect: !0, attribute: 'update-on' })], H.prototype, 'updateOn', 2);
Q([w({ type: String, reflect: !0, attribute: 'init' })], H.prototype, 'scopeInit', 2);
Q([w({ type: String, reflect: !1, attribute: 'src' })], H.prototype, 'src', 2);
H = Q([J('prolit-scope')], H);
class Ts extends HTMLElement {
  static get observedAttributes() {
    return ['duration', 'easing', 'stagger', 'selectors'];
  }
  get duration() {
    return Number(this.getAttribute('duration') ?? 200);
  }
  get easing() {
    return this.getAttribute('easing') ?? 'ease';
  }
  get stagger() {
    return Number(this.getAttribute('stagger') ?? 0);
  }
  get selectors() {
    return this.getAttribute('selectors') ?? '';
  }
  constructor() {
    (super(),
      (this._rects = new WeakMap()),
      (this._anims = new WeakMap()),
      (this._mo = null),
      (this.attachShadow({ mode: 'open' }).innerHTML = '<slot></slot>'));
  }
  connectedCallback() {
    (this._snapshot(),
      (this._mo = new MutationObserver((t) => this._onMutations(t))),
      this._mo.observe(this, { childList: !0, subtree: !!this.selectors.trim() }));
  }
  disconnectedCallback() {
    var t;
    (t = this._mo) == null || t.disconnect();
  }
  attributeChangedCallback(t, e, r) {
    var i;
    t === 'selectors' &&
      ((i = this._mo) == null || i.disconnect(),
      this._snapshot(),
      (this._mo = new MutationObserver((n) => this._onMutations(n))),
      this._mo.observe(this, { childList: !0, subtree: !!this.selectors.trim() }));
  }
  _elements() {
    const t = this.selectors.trim();
    if (!t) return Array.from(this.children);
    try {
      return Array.from(this.querySelectorAll(t));
    } catch {
      return (
        console.warn(`Invalid selector "${t}" in <auto-animate-container>. Falling back to direct children.`),
        Array.from(this.children)
      );
    }
  }
  _snapshot() {
    for (const t of this._elements()) this._rects.set(t, t.getBoundingClientRect());
  }
  _onMutations(t) {
    let e = [],
      r = [];
    const i = this.selectors.trim();
    if (i) {
      for (const o of t)
        (o.removedNodes.forEach((a) => {
          var h, l, p;
          if (a.nodeType === 1) {
            const c = a;
            try {
              (h = c.matches) != null && h.call(c, i) && e.push(c);
            } catch {}
            try {
              (p = (l = c.querySelectorAll) == null ? void 0 : l.call(c, i)) == null || p.forEach((u) => e.push(u));
            } catch {}
          }
        }),
          o.addedNodes.forEach((a) => {
            var h, l, p;
            if (a.nodeType === 1) {
              console.log('Added node:', a);
              const c = a;
              try {
                (h = c.matches) != null && h.call(c, i) && r.push(c);
              } catch {}
              try {
                (p = (l = c.querySelectorAll) == null ? void 0 : l.call(c, i)) == null || p.forEach((u) => r.push(u));
              } catch {}
            }
          }));
      ((e = Array.from(new Set(e))), (r = Array.from(new Set(r))));
    } else
      for (const o of t)
        (o.removedNodes.forEach((a) => {
          a.nodeType === 1 && e.push(a);
        }),
          o.addedNodes.forEach((a) => {
            a.nodeType === 1 && r.push(a);
          }));
    for (const o of e) {
      const a = this._rects.get(o);
      a && this._animateLeave(o, a);
    }
    for (const o of r);
    const n = new Map();
    for (const o of this._elements()) n.set(o, this._rects.get(o));
    requestAnimationFrame(() => {
      var p, c;
      const o = this.duration,
        a = this.easing,
        h = this.stagger;
      let l = 0;
      for (const u of this._elements()) {
        const d = n.get(u),
          f = u.getBoundingClientRect();
        if ((this._rects.set(u, f), d)) {
          const g = d.left - f.left,
            $ = d.top - f.top;
          if (g || $) {
            (p = this._anims.get(u)) == null || p.cancel();
            const x = u.animate([{ transform: `translate(${g}px, ${$}px)` }, { transform: 'none' }], {
              duration: o,
              easing: a,
              delay: h * l,
            });
            this._anims.set(u, x);
          }
        } else {
          (c = this._anims.get(u)) == null || c.cancel();
          const g = u.animate(
            [
              { opacity: 0, transform: 'translateY(-6px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: o, easing: a, delay: h * l },
          );
          this._anims.set(u, g);
        }
        l++;
      }
    });
  }
  _animateLeave(t, e) {
    console.log('Leave animation for:', t);
    const r = t.cloneNode(!0),
      i = r.style;
    ((i.position = 'fixed'),
      (i.left = e.left + 'px'),
      (i.top = e.top + 'px'),
      (i.width = e.width + 'px'),
      (i.height = e.height + 'px'),
      (i.margin = '0'),
      (i.pointerEvents = 'none'),
      (i.boxSizing = 'border-box'),
      document.body.appendChild(r),
      r
        .animate(
          [
            { opacity: 1, transform: 'none' },
            { opacity: 0, transform: 'translateY(-6px)' },
          ],
          { duration: this.duration, easing: this.easing },
        )
        .finished.finally(() => r.remove()));
  }
}
customElements.define('tj-animate-changes', Ts);
var Ds = Object.defineProperty,
  Ls = Object.getOwnPropertyDescriptor,
  V = (s, t, e, r) => {
    for (var i = r > 1 ? void 0 : r ? Ls(t, e) : t, n = s.length - 1, o; n >= 0; n--)
      (o = s[n]) && (i = (r ? o(t, e, i) : o(i)) || i);
    return (r && i && Ds(t, e, i), i);
  };
let N = class extends se(ht) {
  constructor() {
    (super(...arguments),
      (this.src = ''),
      (this.lazy = !1),
      (this.unwrap = !1),
      (this.loading = !1),
      (this._observer = null),
      (this._loadedSrc = ''),
      (this._loadPromise = null),
      (this._defaultLoader = null));
  }
  createRenderRoot() {
    return this;
  }
  disconnectedCallback() {
    var s;
    ((s = this._observer) == null || s.disconnect(), (this._observer = null), super.disconnectedCallback());
  }
  _scheduleLoad() {
    var s;
    if (!(!this.src || this._loadedSrc === this.src || this._loadPromise)) {
      if (!this.lazy || typeof IntersectionObserver > 'u') {
        this._loadSrc();
        return;
      }
      ((s = this._observer) == null || s.disconnect(),
        (this._observer = new IntersectionObserver((t) => {
          var e;
          t.some((r) => r.isIntersecting) &&
            ((e = this._observer) == null || e.disconnect(), (this._observer = null), this._loadSrc());
        })),
        this._observer.observe(this));
    }
  }
  _showLoader() {
    const s = this.querySelector(':scope > [slot="loader"]');
    if (s) {
      s.hidden = !1;
      return;
    }
    const t = document.createElement('span');
    t.setAttribute('data-tj-include-loader', '');
    const e = getComputedStyle(this).getPropertyValue('--tj-include-loader-text').trim();
    ((t.textContent = e.replace(/^['"]|['"]$/g, '') || 'Loading…'), (this._defaultLoader = t), this.append(t));
  }
  _hideLoader() {
    var t;
    ((t = this._defaultLoader) == null || t.remove(), (this._defaultLoader = null));
    const s = this.querySelector(':scope > [slot="loader"]');
    s && (s.hidden = !0);
  }
  async _loadSrc() {
    if (!this.src) {
      this.warn('src attribute is empty. Please provide a valid URL.');
      return;
    }
    if (this._loadedSrc === this.src || this._loadPromise) return this._loadPromise;
    const s = this.src;
    return (
      (this.loading = !0),
      this._showLoader(),
      this.dispatchEvent(new CustomEvent('loadstart', { detail: { src: s }, bubbles: !0, composed: !0 })),
      (this._loadPromise = (async () => {
        try {
          const t = await fetch(s);
          if (!t.ok) throw new Error(`Failed to load content from ${s}: ${t.status} ${t.statusText}`);
          const e = await t.text(),
            r = document.createElement('template');
          if (((r.innerHTML = e), (this._loadedSrc = s), this.unwrap)) {
            const i = r.content;
            (this.dispatchEvent(new CustomEvent('load', { detail: { src: s }, bubbles: !0, composed: !0 })),
              this.replaceWith(i));
            return;
          }
          (this.replaceChildren(r.content),
            this.dispatchEvent(new CustomEvent('load', { detail: { src: s }, bubbles: !0, composed: !0 })));
        } catch (t) {
          (this.dispatchEvent(new CustomEvent('error', { detail: { src: s, error: t }, bubbles: !0, composed: !0 })),
            this.error(`Error fetching content from ${s}: ${t}`));
        } finally {
          ((this.loading = !1), this.isConnected && this._hideLoader(), (this._loadPromise = null));
        }
      })()),
      this._loadPromise
    );
  }
  update(s) {
    var t;
    (super.update(s),
      (s.has('src') || s.has('lazy')) &&
        (s.has('src') && ((t = this._observer) == null || t.disconnect(), (this._observer = null)),
        this._scheduleLoad()));
  }
};
V([w({ type: String, reflect: !1, attribute: 'src' })], N.prototype, 'src', 2);
V([w({ type: Boolean, reflect: !0 })], N.prototype, 'lazy', 2);
V([w({ type: Boolean, reflect: !0 })], N.prototype, 'unwrap', 2);
V([w({ type: Boolean, reflect: !0 })], N.prototype, 'loading', 2);
N = V([J('tj-include')], N);
const Ms =
  ':host{display:contents}slot[name=launcher].slot-empty{display:none}dialog{width:var(--nte-dialog-width, min(90vw, 500px));height:var(--nte-dialog-height, auto);max-width:var(--nte-dialog-max-width, 90vw);max-height:var(--nte-dialog-max-height, calc(100vh - 3.5rem) );margin:auto;padding:0;border:var(--nte-dialog-border, 0);border-radius:var(--nte-dialog-border-radius, var(--nt-border-radius, .5rem));background:var(--nte-dialog-background, #fff);color:var(--nte-dialog-color, #212529);display:flex;flex-direction:column;box-shadow:var(--nte-dialog-box-shadow, 0 .5rem 1rem rgba(0, 0, 0, .15), 0 .125rem .25rem rgba(0, 0, 0, .075));overflow:hidden;opacity:0;transform:translateY(-24px) scale(.98);transition:opacity var(--nte-dialog-transition-duration, .25s) var(--nte-dialog-transition-easing, ease),transform var(--nte-dialog-transition-duration, .25s) var(--nte-dialog-transition-easing, ease)}dialog:open{opacity:1;transform:translateY(0) scale(1)}@starting-style{dialog:open{opacity:0;transform:translateY(-24px) scale(.98)}}dialog.closing{opacity:0;transform:translateY(-24px) scale(.98)}dialog.shake{animation:dialogShake .35s ease}dialog::backdrop{background:var(--nte-dialog-backdrop-background-closed, rgba(0, 0, 0, 0));-webkit-backdrop-filter:blur(var(--nte-dialog-backdrop-blur-closed, 0));backdrop-filter:blur(var(--nte-dialog-backdrop-blur-closed, 0));transition:background var(--nte-dialog-transition-duration, .25s) var(--nte-dialog-transition-easing, ease),backdrop-filter var(--nte-dialog-transition-duration, .25s) var(--nte-dialog-transition-easing, ease)}dialog:open::backdrop{background:var(--nte-dialog-backdrop-background, rgba(0, 0, 0, .5));-webkit-backdrop-filter:blur(var(--nte-dialog-backdrop-blur, 6px));backdrop-filter:blur(var(--nte-dialog-backdrop-blur, 6px))}@starting-style{dialog:open::backdrop{background:var(--nte-dialog-backdrop-background-closed, rgba(0, 0, 0, 0));-webkit-backdrop-filter:blur(var(--nte-dialog-backdrop-blur-closed, 0));backdrop-filter:blur(var(--nte-dialog-backdrop-blur-closed, 0))}}dialog.closing::backdrop{background:var(--nte-dialog-backdrop-background-closed, rgba(0, 0, 0, 0));-webkit-backdrop-filter:blur(var(--nte-dialog-backdrop-blur-closed, 0));backdrop-filter:blur(var(--nte-dialog-backdrop-blur-closed, 0))}#header,#footer{display:flex;align-items:center;padding:var(--nte-dialog-section-padding, 1rem);background:var(--nte-dialog-section-background, var(--nte-dialog-background, #fff))}#header:has(slot[name=title].slot-empty){display:none}#header:has(#close-button):has(slot[name=title].slot-empty){display:flex;justify-content:flex-end}#footer:has(slot[name=footer].slot-empty){display:none}#header{justify-content:space-between;border-bottom:var(--nte-dialog-header-border, 1px solid #dee2e6);font-size:1.25rem;font-weight:500;line-height:1.5}#content{overflow:auto;flex-grow:1}#footer{justify-content:flex-end;gap:.5rem;border-top:var(--nte-dialog-footer-border, 1px solid #dee2e6)}#close-button{display:inline-flex;align-items:center;justify-content:center;margin-left:auto;cursor:pointer;background:transparent;border:0;padding:.25rem;border-radius:var(--nt-border-radius-sm, .375rem);opacity:.65;transition:opacity .15s ease,background-color .15s ease}#close-button:hover{opacity:1;background:#0000000d}:host(.with-floating-header) dialog{position:relative}:host(.with-floating-header) #header{position:absolute;top:0;left:0;width:100%;z-index:1;transition:background .25s ease,backdrop-filter .25s ease}:host(.with-floating-header) dialog:hover #header{background:var(--nte-dialog-floating-header-background, rgba(255, 255, 255, .8));-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}@media(prefers-reduced-motion:reduce){dialog,dialog::backdrop{transition-duration:0s}}@media(max-width:576px){dialog{width:var(--nte-dialog-mobile-width, calc(100vw - 1rem) );max-height:var(--nte-dialog-mobile-max-height, calc(100vh - 1rem) )}}@keyframes dialogShake{0%,to{transform:translateY(0) translate(0) scale(1)}15%{transform:translateY(0) translate(-10px) scale(1)}30%{transform:translateY(0) translate(10px) scale(1)}45%{transform:translateY(0) translate(-8px) scale(1)}60%{transform:translateY(0) translate(8px) scale(1)}75%{transform:translateY(0) translate(-4px) scale(1)}}';
var Ws = Object.create,
  wt = Object.defineProperty,
  Os = Object.getOwnPropertyDescriptor,
  be = (s, t) => ((t = Symbol[s]) ? t : Symbol.for('Symbol.' + s)),
  P = (s) => {
    throw TypeError(s);
  },
  Ns = (s, t, e) => (t in s ? wt(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (s[t] = e)),
  Jt = (s, t) => wt(s, 'name', { value: t, configurable: !0 }),
  Is = (s) => [, , , Ws((s == null ? void 0 : s[be('metadata')]) ?? null)],
  ye = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  R = (s) => (s !== void 0 && typeof s != 'function' ? P('Function expected') : s),
  Ps = (s, t, e, r, i) => ({
    kind: ye[s],
    name: t,
    metadata: r,
    addInitializer: (n) => (e._ ? P('Already initialized') : i.push(R(n || null))),
  }),
  Bs = (s, t) => Ns(t, be('metadata'), s[3]),
  y = (s, t, e, r) => {
    for (var i = 0, n = s[t >> 1], o = n && n.length; i < o; i++) t & 1 ? n[i].call(e) : (r = n[i].call(e, r));
    return r;
  },
  C = (s, t, e, r, i, n) => {
    var o,
      a,
      h,
      l,
      p,
      c = t & 7,
      u = !!(t & 8),
      d = !!(t & 16),
      f = c > 3 ? s.length + 1 : c ? (u ? 1 : 2) : 0,
      g = ye[c + 5],
      $ = c > 3 && (s[f - 1] = []),
      x = s[f] || (s[f] = []),
      b =
        c &&
        (!d && !u && (i = i.prototype),
        c < 5 &&
          (c > 3 || !d) &&
          Os(
            c < 4
              ? i
              : {
                  get [e]() {
                    return Qt(this, n);
                  },
                  set [e](m) {
                    return te(this, n, m);
                  },
                },
            e,
          ));
    c ? d && c < 4 && Jt(n, (c > 2 ? 'set ' : c > 1 ? 'get ' : '') + e) : Jt(i, e);
    for (var L = r.length - 1; L >= 0; L--)
      ((l = Ps(c, e, (h = {}), s[3], x)),
        c &&
          ((l.static = u),
          (l.private = d),
          (p = l.access = { has: d ? (m) => js(i, m) : (m) => e in m }),
          c ^ 3 && (p.get = d ? (m) => (c ^ 1 ? Qt : zs)(m, i, c ^ 4 ? n : b.get) : (m) => m[e]),
          c > 2 && (p.set = d ? (m, M) => te(m, i, M, c ^ 4 ? n : b.set) : (m, M) => (m[e] = M))),
        (a = (0, r[L])(c ? (c < 4 ? (d ? n : b[g]) : c > 4 ? void 0 : { get: b.get, set: b.set }) : i, l)),
        (h._ = 1),
        c ^ 4 || a === void 0
          ? R(a) && (c > 4 ? $.unshift(a) : c ? (d ? (n = a) : (b[g] = a)) : (i = a))
          : typeof a != 'object' || a === null
            ? P('Object expected')
            : (R((o = a.get)) && (b.get = o), R((o = a.set)) && (b.set = o), R((o = a.init)) && $.unshift(o)));
    return (c || Bs(s, i), b && wt(i, e, b), d ? (c ^ 4 ? n : b) : i);
  },
  _t = (s, t, e) => t.has(s) || P('Cannot ' + e),
  js = (s, t) => (Object(t) !== t ? P('Cannot use the "in" operator on this value') : s.has(t)),
  Qt = (s, t, e) => (_t(s, t, 'read from private field'), e ? e.call(s) : t.get(s)),
  A = (s, t, e) =>
    t.has(s) ? P('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(s) : t.set(s, e),
  te = (s, t, e, r) => (_t(s, t, 'write to private field'), r ? r.call(s, e) : t.set(s, e), e),
  zs = (s, t, e) => (_t(s, t, 'access private method'), e),
  we,
  _e,
  $e,
  ke,
  Ee,
  xe,
  Se,
  Ce,
  at,
  Ae,
  v,
  $t,
  kt,
  Et,
  xt,
  St,
  Ct,
  At,
  Tt;
const Fs = {
  fromAttribute(s) {
    return s === null ? !1 : s === '' ? !0 : s;
  },
  toAttribute(s) {
    return s === !1 ? null : s === !0 ? '' : s;
  },
};
Ae = [J('nte-dialog')];
let k = class S extends ((at = Le(lt({ slotVisibility: !0 }))),
(Ce = [Pe('dialog')]),
(Se = [w({ type: String, reflect: !0 })]),
(xe = [w({ attribute: 'anchor', reflect: !0, converter: Fs })]),
(Ee = [w({ type: String, reflect: !0 })]),
(ke = [w({ type: Boolean, attribute: 'no-dismiss', reflect: !0 })]),
($e = [w({ type: Boolean, attribute: 'hide-close-button', reflect: !0 })]),
(_e = [w({ type: Boolean, attribute: 'no-escape', reflect: !0 })]),
(we = [w({ type: String, attribute: 'backdrop-action', reflect: !0 })]),
at) {
  constructor() {
    (super(...arguments),
      A(this, $t, y(v, 8, this, null)),
      y(v, 11, this),
      A(this, kt, y(v, 12, this, 'closed')),
      y(v, 15, this),
      A(this, Et, y(v, 16, this, !1)),
      y(v, 19, this),
      A(this, xt, y(v, 20, this, '')),
      y(v, 23, this),
      A(this, St, y(v, 24, this, !1)),
      y(v, 27, this),
      A(this, Ct, y(v, 28, this, !1)),
      y(v, 31, this),
      A(this, At, y(v, 32, this, !1)),
      y(v, 35, this),
      A(this, Tt, y(v, 36, this, 'shake')),
      y(v, 39, this),
      (this._isClosing = !1),
      (this._openedByAnchor = !1),
      (this._srcInclude = null),
      (this._scrollLockActive = !1),
      (this.onHashChange = () => void this.syncWithAnchor()));
  }
  connectedCallback() {
    (super.connectedCallback(),
      window.addEventListener('hashchange', this.onHashChange),
      this.syncSrcInclude(),
      this.updateComplete.then(() => this.syncWithAnchor()));
  }
  disconnectedCallback() {
    (window.removeEventListener('hashchange', this.onHashChange),
      this.unlockBackgroundScroll(),
      super.disconnectedCallback());
  }
  updated(t) {
    (super.updated(t),
      (t.has('anchor') || t.has('id')) && this.syncWithAnchor(),
      t.has('src') && this.syncSrcInclude());
  }
  render() {
    const t = !this.noDismiss && !this.hideCloseButton;
    return _`
      <slot
        name="launcher"
        data-query=":scope > .launcher | :scope > [data-dialog-launcher]"
        @click=${this.onLauncherClick}
      ></slot>

      <dialog part="dialog" @cancel=${this.onDialogCancel} @close=${this.onDialogClose} @click=${this.onDialogClick}>
        <div id="header" part="header">
          <slot
            name="title"
            data-query=":scope > h1 | :scope > h2 | :scope > h3 | :scope > h4 | :scope > h5"
          ></slot>
          ${
            t
              ? _`<button part="close-button" id="close-button" type="button" @click=${this.onCloseButtonClick}>
                <slot name="closeButton"><nte-burger open></nte-burger></slot>
              </button>`
              : null
          }
        </div>
        <div id="content" part="content"><slot></slot></div>
        <div id="footer" part="footer">
          <slot name="footer" data-query=":scope > .footer | :scope > [data-dialog-footer]"></slot>
        </div>
      </dialog>
    `;
  }
  show() {
    var t, e;
    ((t = this.dialogEl) == null || t.classList.remove('closing'),
      (this.mode = 'open'),
      (e = this.dialogEl) == null || e.show());
  }
  showModal() {
    const t = this.dialogEl;
    t && (t.open || (t.classList.remove('closing'), (this.mode = 'open'), t.showModal(), this.lockBackgroundScroll()));
  }
  async close() {
    if (this._isClosing) return;
    this._isClosing = !0;
    const t = this.dialogEl;
    if (!t) {
      ((this.mode = 'closed'), this.unlockBackgroundScroll(), (this._isClosing = !1));
      return;
    }
    if (!t.open) {
      ((this.mode = 'closed'), t.classList.remove('closing'), (this._isClosing = !1));
      return;
    }
    (t.classList.add('closing'), await this.waitForCloseTransition(t), t.open && t.close(), (this._isClosing = !1));
  }
  syncSrcInclude() {
    var t, e;
    if (!this.src) {
      ((t = this._srcInclude) == null || t.remove(), (this._srcInclude = null));
      return;
    }
    if (!((e = this._srcInclude) != null && e.isConnected)) {
      const r = document.createElement('tj-include');
      (r.setAttribute('data-nte-dialog-src', ''),
        r.setAttribute('lazy', ''),
        r.setAttribute('unwrap', ''),
        (this._srcInclude = r),
        this.append(r));
    }
    this._srcInclude.setAttribute('src', this.src);
  }
  async waitForCloseTransition(t) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const e = getComputedStyle(t),
      r = e.transitionDuration.split(',').map((a) => this.cssTimeToMs(a.trim())),
      i = e.transitionDelay.split(',').map((a) => this.cssTimeToMs(a.trim())),
      n = Math.max(r.length, i.length);
    let o = 0;
    for (let a = 0; a < n; a += 1) {
      const h = r[a % r.length] ?? 0,
        l = i[a % i.length] ?? 0;
      o = Math.max(o, h + l);
    }
    o <= 0 ||
      (await new Promise((a) => {
        let h = !1;
        const l = () => {
            h ||
              ((h = !0),
              t.removeEventListener('transitionend', p),
              t.removeEventListener('transitioncancel', l),
              window.clearTimeout(c),
              a());
          },
          p = (u) => {
            u.target === t && u.propertyName === 'opacity' && l();
          },
          c = window.setTimeout(l, o + 50);
        (t.addEventListener('transitionend', p), t.addEventListener('transitioncancel', l));
      }));
  }
  cssTimeToMs(t) {
    return t.endsWith('ms') ? Number.parseFloat(t) || 0 : t.endsWith('s') ? (Number.parseFloat(t) || 0) * 1e3 : 0;
  }
  get anchorName() {
    return typeof this.anchor == 'string' && this.anchor.length > 0
      ? this.anchor
      : (this.anchor === !0 && this.id) || null;
  }
  get anchorHash() {
    const t = this.anchorName;
    return t ? `#modal:${t}` : null;
  }
  async syncWithAnchor() {
    const t = this.anchorHash;
    if (!t) return;
    await this.updateComplete;
    const e = window.location.hash === t;
    if (e && this.mode !== 'open') {
      ((this._openedByAnchor = !0), this.showModal());
      return;
    }
    !e && this._openedByAnchor && this.mode === 'open' && ((this._openedByAnchor = !1), await this.close());
  }
  clearAnchorHash() {
    const t = this.anchorHash;
    !t ||
      window.location.hash !== t ||
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`);
  }
  onLauncherClick() {
    const t = this.anchorHash;
    if (t) {
      window.location.hash === t ? this.syncWithAnchor() : (window.location.hash = t);
      return;
    }
    this.showModal();
  }
  onCloseButtonClick() {
    this.requestDismiss('close-button');
  }
  onDialogCancel(t) {
    if ((t.preventDefault(), this.noDismiss || this.noEscape)) {
      this.shake();
      return;
    }
    this.requestDismiss('escape');
  }
  onDialogClose() {
    var t;
    ((this.mode = 'closed'),
      (t = this.dialogEl) == null || t.classList.remove('closing'),
      this.unlockBackgroundScroll(),
      (this._openedByAnchor || window.location.hash === this.anchorHash) &&
        ((this._openedByAnchor = !1), this.clearAnchorHash()),
      this.dispatchEvent(new CustomEvent('closed', { bubbles: !0, composed: !0 })));
  }
  onDialogClick(t) {
    const e = this.dialogEl;
    if (!(e != null && e.open)) return;
    const r = e.getBoundingClientRect();
    if (t.clientX < r.left || t.clientX > r.right || t.clientY < r.top || t.clientY > r.bottom) {
      if ((t.preventDefault(), this.noDismiss || this.backdropAction === 'shake')) {
        this.shake();
        return;
      }
      (this.backdropAction === 'cancel' || this.backdropAction === 'dismiss') && this.requestDismiss('backdrop');
    }
  }
  requestDismiss(t) {
    if (this.noDismiss) {
      this.shake();
      return;
    }
    const e = new CustomEvent('dismiss', { detail: { reason: t }, bubbles: !0, composed: !0, cancelable: !0 });
    this.dispatchEvent(e) && this.close();
  }
  shake() {
    const t = this.dialogEl;
    t &&
      (t.classList.remove('shake'),
      t.offsetWidth,
      t.classList.add('shake'),
      window.setTimeout(() => t.classList.remove('shake'), 350));
  }
  lockBackgroundScroll() {
    if (this._scrollLockActive) return;
    const { body: t, documentElement: e } = document;
    (S.modalScrollLockCount === 0 &&
      ((S.previousBodyOverflow = t.style.overflow),
      (S.previousDocumentOverflow = e.style.overflow),
      (t.style.overflow = 'hidden'),
      (e.style.overflow = 'hidden')),
      (S.modalScrollLockCount += 1),
      (this._scrollLockActive = !0));
  }
  unlockBackgroundScroll() {
    if (!this._scrollLockActive) return;
    const { body: t, documentElement: e } = document;
    ((S.modalScrollLockCount = Math.max(0, S.modalScrollLockCount - 1)),
      S.modalScrollLockCount === 0 &&
        ((t.style.overflow = S.previousBodyOverflow), (e.style.overflow = S.previousDocumentOverflow)),
      (this._scrollLockActive = !1));
  }
};
v = Is(at);
$t = new WeakMap();
kt = new WeakMap();
Et = new WeakMap();
xt = new WeakMap();
St = new WeakMap();
Ct = new WeakMap();
At = new WeakMap();
Tt = new WeakMap();
C(v, 4, 'dialogEl', Ce, k, $t);
C(v, 4, 'mode', Se, k, kt);
C(v, 4, 'anchor', xe, k, Et);
C(v, 4, 'src', Ee, k, xt);
C(v, 4, 'noDismiss', ke, k, St);
C(v, 4, 'hideCloseButton', $e, k, Ct);
C(v, 4, 'noEscape', _e, k, At);
C(v, 4, 'backdropAction', we, k, Tt);
k = C(v, 0, 'NteDialog', Ae, k);
k.styles = [O(Ms), O(ie)];
k.modalScrollLockCount = 0;
k.previousBodyOverflow = '';
k.previousDocumentOverflow = '';
y(v, 1, k);
const Rs =
    ':host{display:contents}nte-dialog{--nte-dialog-width: min(90vw, 42rem)}#body{padding:var(--nt-space-4, 1rem)}#intro{margin:0;color:var(--nt-text, currentColor)}#services{display:grid;gap:var(--nt-space-3, .75rem);margin:0;padding:0;list-style:none}.service{display:grid;grid-template-columns:auto 1fr;gap:var(--nt-space-3, .75rem);align-items:start;padding:var(--nt-space-3, .75rem);border:var(--nt-border-width, 1px) solid var(--nt-border-color, #dee2e6);border-radius:var(--nt-border-radius, .375rem)}.service input{margin-top:.25em}.service-copy{display:grid;gap:var(--nt-space-1, .25rem)}.service-purpose,.service-description{color:var(--nt-text-muted, #6c757d);font-size:.875em}.service-privacy{color:var(--nt-link, currentColor)}#footer-content{display:grid;width:100%;gap:var(--nt-space-3, .75rem)}#actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:var(--nt-space-2, .5rem)}button{--btn-txt: var(--nt-text-on-primary, #fff);--btn-bg: var(--nt-primary, #0d6efd);--btn-bg-hover: var(--nt-primary-hover, var(--btn-bg));--btn-bg-active: var(--nt-primary-active, var(--btn-bg));display:inline-block;-moz-appearance:none;appearance:none;-webkit-appearance:none;padding:var(--nt-btn-padding-y, .5rem) var(--nt-btn-padding-x, 1rem);background-color:var(--btn-bg);color:var(--btn-txt)!important;border-radius:var(--nt-border-radius, var(--nt-radius, .375rem));border:var(--nt-border-width, 1px) solid var(--btn-bg);text-decoration:none;text-align:center;cursor:pointer;transition:background-color .3s ease,color .3s ease}button:link,button:visited{color:var(--btn-txt)!important}button:hover{background-color:var(--btn-bg-hover);color:var(--btn-txt)!important;text-decoration:none}button:active{background-color:var(--btn-bg-active);color:var(--btn-txt)!important}button.disabled,button[disabled]{background-color:rgb(from var(--btn-bg) r g b/.5);color:rgb(from var(--nt-text, currentColor) r g b/.5)!important;cursor:not-allowed;pointer-events:none}#accept-all{--btn-bg: var(--nt-primary) !important;--btn-bg-hover: var(--nt-primary-hover, var(--nt-primary)) !important;--btn-bg-active: var(--nt-primary-active, var(--nt-primary)) !important;--btn-txt: var(--nt-text-on-primary, var(--nt-text-on-primary, #fff)) !important;border-color:var(--nt-primary)!important}.secondary-action{--btn-bg: transparent;--btn-bg-hover: var(--nt-secondary);--btn-bg-active: var(--nt-secondary-active, var(--nt-secondary));--btn-txt: var(--nt-secondary);background-color:transparent;color:var(--btn-txt)!important;border-color:var(--nt-secondary)}.secondary-action:hover{--btn-txt: var(--nt-text-on-secondary, var(--nt-text-on-primary, #fff));background-color:var(--nt-secondary);color:var(--btn-txt)!important}@media(max-width:576px){#actions,#actions button{width:100%}}',
  it = { schema: 1, policyVersion: '', services: {}, decidedAt: '' },
  Hs = {
    title: 'Datenschutzeinstellungen',
    intro:
      'Wir verwenden optionale externe Dienste erst nach deiner Zustimmung. Du kannst alle akzeptieren oder deine Auswahl einzeln festlegen.',
    settings: 'Einstellungen',
    acceptAll: 'Alle akzeptieren',
    rejectAll: 'Alle ablehnen',
    save: 'Auswahl speichern',
    cancel: 'Abbrechen',
    privacy: 'Datenschutzinformationen',
    noServices: 'Es wurden keine optionalen Dienste konfiguriert.',
  },
  Us = {
    title: 'Privacy settings',
    intro:
      'We only use optional external services after your consent. You can accept all services or choose them individually.',
    settings: 'Settings',
    acceptAll: 'Accept all',
    rejectAll: 'Reject all',
    save: 'Save selection',
    cancel: 'Cancel',
    privacy: 'Privacy information',
    noServices: 'No optional services have been configured.',
  },
  qs = ['crossorigin', 'defer', 'fetchpriority', 'integrity', 'nomodule', 'nonce', 'referrerpolicy'],
  X = class X extends lt() {
    constructor() {
      (super(...arguments),
        (this.policyVersion = ''),
        (this.storage = 'local'),
        (this.storageKey = 'nte-privacy-consent'),
        (this.prompt = 'auto'),
        (this.showRejectAll = !1),
        (this._services = []),
        (this._view = 'summary'),
        (this._draft = {}),
        (this._decision = null),
        (this._initialized = !1),
        (this._store = null),
        (this._memoryRecord = { ...it, services: {} }),
        (this._generatedNodes = new WeakMap()),
        (this._observer = new MutationObserver(() => void this.declarationsChanged())),
        (this._onStorage = (t) => void this.storageChanged(t)),
        (this.serviceSelectionChanged = (t) => {
          const e = t.currentTarget,
            r = e.dataset.service;
          r && (this._draft = { ...this._draft, [r]: e.checked });
        }),
        (this.openPreferences = () => {
          ((this._view = 'preferences'),
            (this._draft = this._decision ? this.draftFromDecision(this._decision) : this.allServices(!0)));
        }),
        (this.cancelPreferences = () => {
          ((this._view = 'summary'), this.hide());
        }),
        (this.acceptAll = () => void this.commitDecision(this.allServices(!0))),
        (this.rejectAll = () => void this.commitDecision(this.allServices(!1))),
        (this.saveSelection = () => void this.commitDecision(this._draft)));
    }
    connectedCallback() {
      (super.connectedCallback(),
        this._observer.observe(this, { childList: !0, subtree: !0 }),
        window.addEventListener('storage', this._onStorage),
        this.initialize());
    }
    disconnectedCallback() {
      (this._observer.disconnect(),
        window.removeEventListener('storage', this._onStorage),
        super.disconnectedCallback());
    }
    updated(t) {
      (super.updated(t),
        this._initialized &&
          (t.has('policyVersion') || t.has('storage') || t.has('storageKey')) &&
          ((this._store = null), this.applyStoredDecision()));
    }
    render() {
      const t = this.copy,
        e = this._decision !== null;
      return _`
      <nte-dialog
        id="dialog"
        class="style-default size-md"
        exportparts="dialog,header,content,footer"
        .noDismiss=${!e}
        .hideCloseButton=${!0}
        .backdropAction=${'ignore'}
      >
        <slot name="launcher" slot="launcher" @click=${this.openPreferences}></slot>
        <span slot="title" part="title"><slot name="title">${t.title}</slot></span>

        <div id="body" part="body">
          ${this._view === 'summary' ? _`<p id="intro" part="intro"><slot name="intro">${t.intro}</slot></p>` : this.renderServices(t)}
        </div>

        <div id="footer-content" slot="footer">
          <slot name="privacy-link"></slot>
          <slot name="footer"></slot>
          <div id="actions" part="actions">${this.renderActions(t, e)}</div>
        </div>
      </nte-dialog>
    `;
    }
    show() {
      var t;
      ((this._view = this._decision ? 'preferences' : 'summary'), (t = this.dialog) == null || t.showModal());
    }
    showPreferences() {
      var t;
      (this.openPreferences(), (t = this.dialog) == null || t.showModal());
    }
    hide() {
      var t;
      (t = this.dialog) == null || t.close();
    }
    getDecision() {
      return this._decision ? this.cloneDecision(this._decision) : null;
    }
    async setDecision(t) {
      const e = Object.fromEntries(this._services.map((r) => [r.name, t[r.name] === !0]));
      await this.commitDecision(e);
    }
    async reset() {
      var r;
      const t = this.getDecision(),
        e = { ...it, services: {} };
      (this.writeRecord(e),
        (this._decision = null),
        (this._view = 'summary'),
        (this._draft = this.allServices(!0)),
        this.removeGeneratedTemplates(),
        this.dispatchConsentChange(t, null),
        await this.updateComplete,
        (r = this.dialog) == null || r.showModal());
    }
    get dialog() {
      return this.renderRoot.querySelector('#dialog');
    }
    get copy() {
      return (this.lang || document.documentElement.lang || 'de').toLowerCase().startsWith('de') ? Hs : Us;
    }
    async initialize() {
      var t;
      (await re(),
        this.discoverDeclarations(),
        this.policyVersion || this.dispatchConsentError('discovery', null, new Error('policy-version is required.')),
        await customElements.whenDefined('nte-dialog'),
        await this.updateComplete,
        await ((t = this.dialog) == null ? void 0 : t.updateComplete),
        (this._initialized = !0),
        await this.applyStoredDecision());
    }
    async applyStoredDecision() {
      var e;
      const t = this.readValidDecision();
      ((this._decision = t),
        (this._draft = t ? this.draftFromDecision(t) : this.allServices(!0)),
        t
          ? await this.activateAllowedServices(t)
          : this.prompt === 'auto' &&
            (await this.updateComplete, (this._view = 'summary'), (e = this.dialog) == null || e.showModal()),
        this.dispatchEvent(
          new CustomEvent('consent-ready', { detail: { decision: this.getDecision() }, bubbles: !0, composed: !0 }),
        ));
    }
    async declarationsChanged() {
      const t = new Set(this._services.flatMap((r) => r.resources));
      (this.discoverDeclarations(),
        this._services.some((r) => r.resources.some((i) => !t.has(i))) &&
          ((this._draft = this._decision ? this.draftFromDecision(this._decision) : this.allServices(!0)),
          this._decision && (await this.activateAllowedServices(this._decision))));
    }
    discoverDeclarations() {
      var e;
      const t = new Map();
      for (const r of Array.from(this.children)) {
        if (r instanceof HTMLScriptElement || r instanceof HTMLTemplateElement) {
          const n = r.dataset.consentService;
          n && this.addDeclaration(t, n, r, r);
          continue;
        }
        if (r.localName !== 'nte-privacy-consent-service') continue;
        const i = (e = r.getAttribute('name')) == null ? void 0 : e.trim();
        if (i)
          for (const n of Array.from(r.children))
            (n instanceof HTMLScriptElement || n instanceof HTMLTemplateElement) && this.addDeclaration(t, i, n, r);
      }
      this._services = Array.from(t.values()).sort((r, i) => r.label.localeCompare(i.label));
    }
    addDeclaration(t, e, r, i) {
      if (r instanceof HTMLScriptElement && r.type !== 'text/plain') {
        this.dispatchConsentError('discovery', e, new Error('Consent scripts must use type="text/plain".'));
        return;
      }
      const n = this.readMetadata(e, i),
        o = t.get(e);
      if (!o) {
        t.set(e, { ...n, label: n.label || e, resources: [r], invalid: !1 });
        return;
      }
      for (const a of ['label', 'purpose', 'description', 'privacyUrl']) {
        const h = n[a];
        h &&
          (o[a] && o[a] !== h
            ? ((o.invalid = !0),
              this.dispatchConsentError('discovery', e, new Error(`Conflicting ${a} metadata for service "${e}".`)))
            : (o[a] = h));
      }
      o.resources.push(r);
    }
    readMetadata(t, e) {
      const r = e.localName === 'nte-privacy-consent-service',
        i = (n, o) => {
          var a, h;
          return r
            ? ((a = e.getAttribute(o)) == null ? void 0 : a.trim()) || ''
            : ((h = e.getAttribute(`data-consent-${n}`)) == null ? void 0 : h.trim()) || '';
        };
      return {
        name: t,
        label: i('label', 'label'),
        purpose: i('purpose', 'purpose'),
        description: i('description', 'description'),
        privacyUrl: i('privacy', 'privacy-url'),
      };
    }
    renderServices(t) {
      return this._services.length === 0
        ? _`<p>${t.noServices}</p>`
        : _`
      <ul id="services" part="services">
        ${this._services.map(
          (e) => _`
            <li class="service" part="service">
              <input
                id=${`service-${e.name}`}
                type="checkbox"
                .checked=${this._draft[e.name] !== !1}
                ?disabled=${e.invalid}
                data-service=${e.name}
                @change=${this.serviceSelectionChanged}
              />
              <label class="service-copy" for=${`service-${e.name}`}>
                <strong>${e.label}</strong>
                ${e.purpose ? _`<span class="service-purpose">${e.purpose}</span>` : B}
                ${e.description ? _`<span class="service-description">${e.description}</span>` : B}
                ${
                  e.privacyUrl
                    ? _`<a
                        class="service-privacy"
                        href=${e.privacyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        >${t.privacy}</a
                      >`
                    : B
                }
              </label>
            </li>
          `,
        )}
      </ul>
    `;
    }
    renderActions(t, e) {
      return this._view === 'summary'
        ? _`
        ${this.showRejectAll ? _`<button class="secondary-action" type="button" @click=${this.rejectAll}>${t.rejectAll}</button>` : B}
        <button class="secondary-action" type="button" @click=${this.openPreferences}>${t.settings}</button>
        <button id="accept-all" type="button" @click=${this.acceptAll}>${t.acceptAll}</button>
      `
        : _`
      ${
        e
          ? _`<button class="secondary-action" type="button" @click=${this.cancelPreferences}>
              ${t.cancel}
            </button>`
          : B
      }
      <button class="secondary-action" type="button" @click=${this.saveSelection}>${t.save}</button>
      <button id="accept-all" type="button" @click=${this.acceptAll}>${t.acceptAll}</button>
    `;
    }
    allServices(t) {
      return Object.fromEntries(this._services.map((e) => [e.name, t]));
    }
    draftFromDecision(t) {
      return Object.fromEntries(this._services.map((e) => [e.name, t.services[e.name] === !0]));
    }
    async commitDecision(t) {
      var i;
      if (!this.policyVersion) {
        this.dispatchConsentError('storage', null, new Error('Cannot store consent without policy-version.'));
        return;
      }
      const e = this.getDecision(),
        r = {
          schema: 1,
          policyVersion: this.policyVersion,
          services: Object.fromEntries(this._services.map((n) => [n.name, t[n.name] === !0])),
          decidedAt: new Date().toISOString(),
        };
      (this.writeRecord(r),
        (this._decision = r),
        (this._draft = { ...r.services }),
        await this.applyDecision(e, r),
        this.dispatchConsentChange(e, r),
        (this._view = 'summary'),
        await ((i = this.dialog) == null ? void 0 : i.close()));
    }
    async applyDecision(t, e) {
      for (const r of this._services)
        e.services[r.name]
          ? await this.activateService(r)
          : t != null && t.services[r.name] && this.removeGeneratedTemplates(r);
    }
    async activateAllowedServices(t) {
      for (const e of this._services) t.services[e.name] && (await this.activateService(e));
    }
    async activateService(t) {
      if (t.invalid) return;
      const e = [];
      try {
        for (const r of t.resources) {
          if (r.dataset.consentActivated === 'true') continue;
          const i = r instanceof HTMLScriptElement ? await this.activateScript(r, t.name) : this.activateTemplate(r);
          (e.push(...i), (r.dataset.consentActivated = 'true'));
        }
      } catch (r) {
        this.dispatchConsentError('activation', t.name, r);
        return;
      }
      e.length > 0 &&
        this.dispatchEvent(
          new CustomEvent('consent-service-activated', {
            detail: { service: t.name, elements: e },
            bubbles: !0,
            composed: !0,
          }),
        );
    }
    async activateScript(t, e) {
      const r = document.createElement('script');
      for (const a of qs) t.hasAttribute(a) && r.setAttribute(a, t.getAttribute(a) ?? '');
      const i = t.dataset.type;
      i && (r.type = i);
      const n = t.dataset.src;
      if (!n) return ((r.textContent = t.textContent), t.after(r), [r]);
      r.src = n;
      const o = t.hasAttribute('data-async');
      return (
        (r.async = o),
        o
          ? (r.addEventListener('error', () =>
              this.dispatchConsentError('activation', e, new Error(`Failed to load consent script: ${n}`)),
            ),
            t.after(r),
            [r])
          : (await new Promise((a, h) => {
              (r.addEventListener('load', () => a(), { once: !0 }),
                r.addEventListener('error', () => h(new Error(`Failed to load consent script: ${n}`)), { once: !0 }),
                t.after(r));
            }),
            [r])
      );
    }
    activateTemplate(t) {
      const e = t.content.cloneNode(!0),
        r = Array.from(e.childNodes);
      return (t.after(e), this._generatedNodes.set(t, r), r);
    }
    removeGeneratedTemplates(t) {
      var r;
      const e = t ? [t] : this._services;
      for (const i of e)
        for (const n of i.resources)
          if (n instanceof HTMLTemplateElement) {
            for (const o of this._generatedNodes.get(n) ?? []) (r = o.parentNode) == null || r.removeChild(o);
            (this._generatedNodes.delete(n), n.removeAttribute('data-consent-activated'));
          }
    }
    getStore() {
      if (this.storage === 'memory') return this._memoryRecord;
      if (this._store) return this._store;
      const t = { ...it, services: {} };
      return (
        (this._store = this.storage === 'session' ? Me(this.storageKey, t) : We(this.storageKey, t)),
        this._store
      );
    }
    readValidDecision() {
      let t;
      try {
        ((t = this.getStore()), t.schema);
      } catch (r) {
        return ((this._store = null), this.dispatchConsentError('storage', null, r), null);
      }
      if (
        t.schema !== 1 ||
        t.policyVersion !== this.policyVersion ||
        typeof t.decidedAt != 'string' ||
        t.decidedAt.length === 0 ||
        typeof t.services != 'object' ||
        t.services === null ||
        Array.isArray(t.services)
      )
        return null;
      const e = Object.fromEntries(Object.entries(t.services).filter((r) => typeof r[1] == 'boolean'));
      return { schema: 1, policyVersion: t.policyVersion, services: e, decidedAt: t.decidedAt };
    }
    writeRecord(t) {
      if (this.storage === 'memory') {
        this._memoryRecord = { ...t, services: { ...t.services } };
        return;
      }
      try {
        const e = this.getStore();
        ((e.schema = t.schema),
          (e.policyVersion = t.policyVersion),
          (e.services = { ...t.services }),
          (e.decidedAt = t.decidedAt));
      } catch (e) {
        ((this._store = null),
          (this._memoryRecord = { ...t, services: { ...t.services } }),
          this.dispatchConsentError('storage', null, e));
      }
    }
    async storageChanged(t) {
      var e;
      this.storage !== 'local' ||
        t.storageArea !== window.localStorage ||
        t.key !== this.storageKey ||
        ((this._store = null),
        await this.applyStoredDecision(),
        this._decision && (await ((e = this.dialog) == null ? void 0 : e.close())));
    }
    cloneDecision(t) {
      return { ...t, services: { ...t.services } };
    }
    dispatchConsentChange(t, e) {
      const r = new Set([
          ...Object.keys((t == null ? void 0 : t.services) ?? {}),
          ...Object.keys((e == null ? void 0 : e.services) ?? {}),
        ]),
        i = Array.from(r).filter((n) => (t == null ? void 0 : t.services[n]) !== (e == null ? void 0 : e.services[n]));
      this.dispatchEvent(
        new CustomEvent('consent-change', {
          detail: { previous: t, current: e, changedServices: i },
          bubbles: !0,
          composed: !0,
        }),
      );
    }
    dispatchConsentError(t, e, r) {
      this.dispatchEvent(
        new CustomEvent('consent-error', { detail: { phase: t, service: e, error: r }, bubbles: !0, composed: !0 }),
      );
    }
  };
((X.properties = {
  policyVersion: { type: String, attribute: 'policy-version', reflect: !0 },
  storage: { type: String, reflect: !0 },
  storageKey: { type: String, attribute: 'storage-key', reflect: !0 },
  prompt: { type: String, reflect: !0 },
  showRejectAll: { type: Boolean, attribute: 'show-reject-all', reflect: !0 },
  _services: { state: !0 },
  _view: { state: !0 },
  _draft: { state: !0 },
  _decision: { state: !0 },
}),
  (X.styles = [O(ie), O(Rs)]));
let ct = X;
customElements.get('nte-privacy-consent') || customElements.define('nte-privacy-consent', ct);
