/* empty css                */ import { r as C, A as f, b as m } from './_virtual_tdemo-client-CxMeb5Rk.js';
import { r as M } from './index-BR6EnczS.js';
import { n as z } from './nextrap-element-DeSHPIJn.js';
import './nte-table-CxwpBr-M.js';
import { t as L, n as p } from './property-C2fH_zxw.js'; /* empty css              */
import { d as D } from './types-4rIte7rE.js';
class R {
  constructor() {
    this.renderers = new Map();
  }
  register(e, i) {
    const r = e.trim().toLowerCase();
    if (!r) throw new TypeError('A cell renderer preset name must not be empty.');
    this.renderers.set(r, i);
  }
  unregister(e) {
    return this.renderers.delete(e.trim().toLowerCase());
  }
  get(e) {
    return this.renderers.get(e.trim().toLowerCase()) ?? null;
  }
  has(e) {
    return this.renderers.has(e.trim().toLowerCase());
  }
}
const c = new R();
c.register('text', (t) => (t == null ? '' : String(t)));
c.register('number', (t) => (typeof t == 'number' ? new Intl.NumberFormat().format(t) : String(t ?? '')));
c.register('date', (t) => (t == null ? '' : new Intl.DateTimeFormat().format(new Date(t))));
c.register('boolean', (t) => (t ? '✓' : '–'));
c.register('json', (t) => JSON.stringify(t));
const T = ':host{display:block}nte-table{display:block}';
var V = Object.defineProperty,
  x = Object.getOwnPropertyDescriptor,
  $ = (t) => {
    throw TypeError(t);
  },
  o = (t, e, i, r) => {
    for (var a = r > 1 ? void 0 : r ? x(e, i) : e, s = t.length - 1, d; s >= 0; s--)
      (d = t[s]) && (a = (r ? d(e, i, a) : d(a)) || a);
    return (r && a && V(e, i, a), a);
  },
  I = (t, e, i) => e.has(t) || $('Cannot ' + i),
  l = (t, e, i) => (I(t, e, 'read from private field'), i ? i.call(t) : e.get(t)),
  h = (t, e, i) =>
    e.has(t) ? $('Cannot add the same private member more than once') : e instanceof WeakSet ? e.add(t) : e.set(t, i),
  u = (t, e, i, r) => (I(t, e, 'write to private field'), e.set(t, i), i),
  w,
  _,
  b,
  g,
  v,
  S;
let n = class extends z({ eventBinding: !1, slotVisibility: !1 }) {
  constructor() {
    (super(...arguments),
      h(this, w, []),
      h(this, _, null),
      h(this, b, {}),
      h(this, g, 'resize-columns reorder-columns sort'),
      h(this, v, '24rem'),
      h(this, S, ''),
      (this._handleResize = (t) => {
        var r;
        t.stopPropagation();
        const e = (r = this.definition) == null ? void 0 : r.columns.find((a) => a.id === t.detail.columnId),
          i = Math.max(
            (e == null ? void 0 : e.minWidth) ?? 48,
            Math.min((e == null ? void 0 : e.maxWidth) ?? 1 / 0, t.detail.width),
          );
        this._setViewState(
          { ...this.viewState, columnWidths: { ...this.viewState.columnWidths, [t.detail.columnId]: i } },
          'column-resize',
        );
      }),
      (this._handleReorder = (t) => {
        if ((t.stopPropagation(), !this.definition)) return;
        const e = this._columns(this.definition).map((r) => r.id),
          [i] = e.splice(t.detail.from, 1);
        (e.splice(t.detail.to, 0, i), this._setViewState({ ...this.viewState, columnOrder: e }, 'column-reorder'));
      }),
      (this._handleSort = (t) => {
        if ((t.stopPropagation(), !this.definition)) return;
        const e = this._columns(this.definition)[t.detail.columnIndex];
        e &&
          this._setViewState({ ...this.viewState, sort: [{ columnId: e.id, direction: t.detail.direction }] }, 'sort');
      }));
  }
  get data() {
    return l(this, w);
  }
  set data(t) {
    u(this, w, t);
  }
  get definition() {
    return l(this, _);
  }
  set definition(t) {
    u(this, _, t);
  }
  get viewState() {
    return l(this, b);
  }
  set viewState(t) {
    u(this, b, t);
  }
  get features() {
    return l(this, g);
  }
  set features(t) {
    u(this, g, t);
  }
  get height() {
    return l(this, v);
  }
  set height(t) {
    u(this, v, t);
  }
  get scrollLabel() {
    return l(this, S);
  }
  set scrollLabel(t) {
    u(this, S, t);
  }
  getViewState() {
    return structuredClone(this.viewState);
  }
  setViewState(t) {
    this._setViewState(t, 'programmatic');
  }
  refresh() {
    var t;
    (t = this.renderRoot.querySelector('nte-table')) == null || t.refresh();
  }
  updated(t) {
    (super.updated(t), t.has('definition') && this._validateDefinition());
  }
  render() {
    const t = this.definition;
    if (!t) return f;
    const e = this._columns(t),
      i = this._rows(t, e),
      r = new Set(this.viewState.pinnedColumns ?? []),
      a = e.findIndex((s) => !r.has(s.id));
    return m`
      <nte-table
        .features=${this.features}
        .height=${this.height}
        .pinnedColumns=${a < 0 ? e.length : a}
        .scrollLabel=${this.scrollLabel || t.id}
        @nte-table-column-resize=${this._handleResize}
        @nte-table-column-reorder=${this._handleReorder}
        @nte-table-sort=${this._handleSort}
      >
        <table>
          <thead><tr>
            ${e.map(
              (s) => m`<th
              scope="col"
              data-column-id=${s.id}
              data-width=${this._width(s) ?? f}
              data-resizable=${s.resizable === !1 ? 'false' : f}
              data-reorderable=${s.reorderable === !1 ? 'false' : f}
              data-sortable=${s.sortable === !1 ? 'false' : f}
              ?hidden=${this._hidden(s)}
            >${s.header}</th>`,
            )}
          </tr></thead>
          <tbody>${i.map(
            (s) => m`<tr data-row-id=${this._rowId(t, s)}>
            ${e.map((d) => m`<td>${this._cell(d, s)}</td>`)}
          </tr>`,
          )}</tbody>
        </table>
      </nte-table>
    `;
  }
  _validateDefinition() {
    var e;
    const t = ((e = this.definition) == null ? void 0 : e.columns.map((i) => i.id.trim())) ?? [];
    if (t.some((i) => !i) || new Set(t).size !== t.length)
      throw new TypeError('TableDefinition column IDs must be non-empty and unique.');
  }
  _columns(t) {
    const e = new Map(t.columns.map((r) => [r.id, r])),
      i = (this.viewState.columnOrder ?? []).filter((r) => e.has(r));
    return [...i.map((r) => e.get(r)), ...t.columns.filter((r) => !i.includes(r.id))];
  }
  _rows(t, e) {
    var d;
    const i = [...this.data],
      r = (d = this.viewState.sort) == null ? void 0 : d[0];
    if (!r) return i;
    const a = e.find((y) => y.id === r.columnId);
    if (!a) return i;
    const s = r.direction === 'ascending' ? 1 : -1;
    return i.sort(
      (y, W) =>
        String(this._value(a, y) ?? '').localeCompare(String(this._value(a, W) ?? ''), void 0, { numeric: !0 }) * s,
    );
  }
  _rowId(t, e) {
    return typeof t.rowId == 'function' ? t.rowId(e) : String(e[t.rowId] ?? '');
  }
  _value(t, e) {
    return t.value ? t.value(e) : t.field === void 0 ? void 0 : e[t.field];
  }
  _cell(t, e) {
    var r, a;
    const i = this._value(t, e);
    return (
      ((r = t.render) == null ? void 0 : r.call(t, i, e)) ??
      (t.preset ? ((a = c.get(t.preset)) == null ? void 0 : a(i)) : void 0) ??
      (i == null ? '' : String(i))
    );
  }
  _width(t) {
    var e;
    return ((e = this.viewState.columnWidths) == null ? void 0 : e[t.id]) ?? t.defaultWidth;
  }
  _hidden(t) {
    return t.hidden === !0 || (this.viewState.hiddenColumns ?? []).includes(t.id);
  }
  _setViewState(t, e) {
    ((this.viewState = structuredClone(t)),
      this.dispatchEvent(
        new CustomEvent('nte-data-table-view-state-change', {
          bubbles: !0,
          composed: !0,
          detail: { reason: e, state: this.getViewState() },
        }),
      ));
  }
};
w = new WeakMap();
_ = new WeakMap();
b = new WeakMap();
g = new WeakMap();
v = new WeakMap();
S = new WeakMap();
n.styles = [C(M), C(T)];
o([p({ attribute: !1 })], n.prototype, 'data', 1);
o([p({ attribute: !1 })], n.prototype, 'definition', 1);
o([p({ attribute: !1 })], n.prototype, 'viewState', 1);
o([p({ type: String })], n.prototype, 'features', 1);
o([p({ type: String })], n.prototype, 'height', 1);
o([p({ type: String, attribute: 'scroll-label' })], n.prototype, 'scrollLabel', 1);
n = o([L('nte-data-table')], n);
const O = [
    { id: 1, name: 'Ada GmbH', amount: 1200, active: !0 },
    { id: 2, name: 'Turing AG', amount: 850, active: !1 },
  ],
  k = {
    id: 'customers',
    rowId: 'id',
    columns: [
      { id: 'name', header: 'Name', field: 'name', defaultWidth: 220 },
      { id: 'amount', header: 'Umsatz', field: 'amount', preset: 'number', defaultWidth: 140 },
      { id: 'active', header: 'Aktiv', field: 'active', preset: 'boolean', defaultWidth: 100 },
    ],
  },
  H = D({
    title: 'Data und View State',
    description: 'Rendert Objekte und zeigt serialisierbaren Benutzerzustand.',
    render(t) {
      t.innerHTML = '<nte-data-table height="18rem"></nte-data-table><pre data-state></pre>';
      const e = t.querySelector('nte-data-table');
      ((e.definition = k),
        (e.data = O),
        e.addEventListener('nte-data-table-view-state-change', (i) => {
          t.querySelector('[data-state]').textContent = JSON.stringify(i.detail.state, null, 2);
        }));
    },
  });
export { H as default };
