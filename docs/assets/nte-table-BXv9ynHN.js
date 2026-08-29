import { r as G, b as ut } from './_virtual_tdemo-client-BQ75DL_E.js';
import { r as ft } from './index-BR6EnczS.js';
import { n as dt } from './nextrap-element-BgVUIfl5.js';
import { t as _t, n as E } from './property-pW3KQYk0.js'; /* empty css              */
class gt {
  constructor() {
    this._factories = new Map();
  }
  register(t, e) {
    const s = t.trim().toLowerCase();
    if (!s) throw new TypeError('A table plugin name must not be empty.');
    this._factories.set(s, e);
  }
  unregister(t) {
    return this._factories.delete(t.trim().toLowerCase());
  }
  create(t) {
    var e;
    return ((e = this._factories.get(t.trim().toLowerCase())) == null ? void 0 : e()) ?? null;
  }
  has(t) {
    return this._factories.has(t.trim().toLowerCase());
  }
}
const z = new gt(),
  B = (o, t, e, s) => {
    const i = o.createElement('button');
    return (
      (i.type = 'button'),
      (i.className = `nte-table-plugin-control ${t}`),
      i.setAttribute('aria-label', e),
      (i.textContent = s),
      i
    );
  };
class k {
  constructor() {
    this.context = null;
  }
  connect(t) {
    ((this.context = t), this.onConnect());
  }
  disconnect() {
    (this.onDisconnect(), (this.context = null));
  }
  refresh() {
    this.onRefresh();
  }
}
class pt extends k {
  constructor() {
    (super(...arguments),
      (this._collator = new Intl.Collator(void 0, { numeric: !0, sensitivity: 'base' })),
      (this._handleClick = (t) => {
        var g, p;
        const e = t.target;
        if (!(e instanceof Element)) return;
        const s = e.closest('[data-nte-table-sort-control]'),
          i = s == null ? void 0 : s.closest('th, td'),
          n = this.context;
        if (!s || !i || !n) return;
        const r = Array.from(((p = (g = n.table.tHead) == null ? void 0 : g.rows[0]) == null ? void 0 : p.cells) ?? []),
          a = r.indexOf(i);
        if (a < 0) return;
        const c = i.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        (r.forEach((S) => {
          S.removeAttribute('aria-sort');
          const b = S.querySelector('[data-nte-table-sort-control]');
          b && (b.textContent = '↕');
        }),
          i.setAttribute('aria-sort', c),
          (s.textContent = c === 'ascending' ? '↑' : '↓'));
        const l = n.table.tBodies[0],
          u = Array.from((l == null ? void 0 : l.rows) ?? []),
          h = c === 'ascending' ? 1 : -1,
          f = i.dataset.sortType ?? 'string';
        (u.sort((S, b) => h * this._compare(S.cells[a], b.cells[a], f)),
          l == null || l.append(...u),
          n.host.dispatchEvent(
            new CustomEvent('nte-table-sort', {
              bubbles: !0,
              composed: !0,
              detail: { columnIndex: a, direction: c, header: i },
            }),
          ),
          n.refresh());
      }));
  }
  onConnect() {
    var t, e;
    ((e = (t = this.context) == null ? void 0 : t.table.tHead) == null ||
      e.addEventListener('click', this._handleClick),
      this.onRefresh());
  }
  onDisconnect() {
    var t, e, s, i, n;
    ((e = (t = this.context) == null ? void 0 : t.table.tHead) == null ||
      e.removeEventListener('click', this._handleClick),
      (s = this.context) == null ||
        s.table.querySelectorAll('[data-nte-table-sort-control]').forEach((r) => r.remove()),
      (n = (i = this.context) == null ? void 0 : i.table.tHead) == null ||
        n.querySelectorAll('[aria-sort]').forEach((r) => r.removeAttribute('aria-sort')));
  }
  onRefresh() {
    var e, s;
    const t = this.context;
    Array.from(
      ((s = (e = t == null ? void 0 : t.table.tHead) == null ? void 0 : e.rows[0]) == null ? void 0 : s.cells) ?? [],
    ).forEach((i, n) => {
      if (i.dataset.sortable === 'false' || i.querySelector('[data-nte-table-sort-control]')) return;
      const r = B(t.host.ownerDocument, 'nte-table-sort-control indicator', `Spalte ${n + 1} sortieren`, '↕');
      ((r.dataset.nteTableSortControl = ''), i.append(r));
    });
  }
  _compare(t, e, s) {
    var r, a;
    const i = t.dataset.sortValue ?? ((r = t.textContent) == null ? void 0 : r.trim()) ?? '',
      n = e.dataset.sortValue ?? ((a = e.textContent) == null ? void 0 : a.trim()) ?? '';
    return s === 'number'
      ? (Number(i) || 0) - (Number(n) || 0)
      : s === 'date'
        ? (Date.parse(i) || 0) - (Date.parse(n) || 0)
        : this._collator.compare(i, n);
  }
}
const mt = 8;
class bt extends k {
  constructor() {
    (super(...arguments),
      (this._resize = null),
      (this._down = (t) => {
        var i;
        if (
          !this.context ||
          t.button !== 0 ||
          !t.isPrimary ||
          this._resize ||
          (t.target instanceof Element && t.target.closest('.nte-table-plugin-control'))
        )
          return;
        const e = this._at(t),
          s = e ? this.context.remote.getColumnWidth(e) : null;
        !e ||
          s === null ||
          (t.preventDefault(),
          (this._resize = {
            direction: getComputedStyle(this.context.table).direction === 'rtl' ? -1 : 1,
            header: e,
            pointerId: t.pointerId,
            previousWidth: s,
            startClientX: t.clientX,
          }),
          (e.style.cursor = 'col-resize'),
          (i = e.setPointerCapture) == null || i.call(e, t.pointerId));
      }),
      (this._move = (t) => {
        var e, s;
        if (this.context) {
          if (!this._resize) {
            const i = this._at(t);
            for (const n of Array.from(
              ((s = (e = this.context.table.tHead) == null ? void 0 : e.rows[0]) == null ? void 0 : s.cells) ?? [],
            ))
              n.style.cursor = n === i ? 'col-resize' : '';
            return;
          }
          this._resize.pointerId === t.pointerId &&
            (t.preventDefault(),
            this.context.remote.setColumnWidth(
              this._resize.header,
              this._resize.previousWidth + (t.clientX - this._resize.startClientX) * this._resize.direction,
            ));
        }
      }),
      (this._end = (t) => {
        var e;
        ((e = this._resize) == null ? void 0 : e.pointerId) === t.pointerId && (t.preventDefault(), this._finish(!0));
      }),
      (this._cancel = (t) => {
        var e, s;
        ((e = this._resize) == null ? void 0 : e.pointerId) === t.pointerId &&
          ((s = this.context) == null || s.remote.setColumnWidth(this._resize.header, this._resize.previousWidth),
          this._finish(!1));
      }));
  }
  onConnect() {
    var e;
    const t = (e = this.context) == null ? void 0 : e.table;
    (t == null || t.addEventListener('pointerdown', this._down, !0),
      t == null || t.addEventListener('pointermove', this._move, !0),
      t == null || t.addEventListener('pointerup', this._end, !0),
      t == null || t.addEventListener('pointercancel', this._cancel, !0));
  }
  onDisconnect() {
    var e;
    const t = (e = this.context) == null ? void 0 : e.table;
    (t == null || t.removeEventListener('pointerdown', this._down, !0),
      t == null || t.removeEventListener('pointermove', this._move, !0),
      t == null || t.removeEventListener('pointerup', this._end, !0),
      t == null || t.removeEventListener('pointercancel', this._cancel, !0),
      this._finish(!1));
  }
  onRefresh() {}
  _at(t) {
    var r;
    if (!(t.target instanceof Element)) return null;
    const e = t.target.closest('th,td');
    if (
      !e ||
      e.closest('thead') !== ((r = this.context) == null ? void 0 : r.table.tHead) ||
      e.dataset.resizable === 'false' ||
      e.hidden
    )
      return null;
    const s = e.getBoundingClientRect(),
      n = getComputedStyle(this.context.table).direction === 'rtl' ? t.clientX - s.left : s.right - t.clientX;
    return n >= 0 && n <= mt ? e : null;
  }
  _finish(t) {
    var c, l, u;
    const e = this.context,
      s = this._resize;
    if (!e || !s) return;
    ((this._resize = null), (s.header.style.cursor = ''));
    const i = e.remote.getColumnWidth(s.header);
    if (!t || i === null || i === s.previousWidth) return;
    const n = Array.from(((l = (c = e.table.tHead) == null ? void 0 : c.rows[0]) == null ? void 0 : l.cells) ?? []),
      r = n.indexOf(s.header),
      a = ((u = s.header.dataset.columnId) == null ? void 0 : u.trim()) || s.header.id.trim() || String(r);
    e.host.dispatchEvent(
      new CustomEvent('nte-table-column-resize', {
        bubbles: !0,
        composed: !0,
        detail: { columnId: a, columnIndex: r, previousWidth: s.previousWidth, width: i },
      }),
    );
  }
}
const j = 160,
  D = 36,
  I = 14,
  wt = 8,
  yt = 24,
  St = 0.15,
  tt = (o, t) => {
    var g;
    const e = Array.from(o),
      s = (g = e[0]) == null ? void 0 : g.ownerDocument,
      i = s == null ? void 0 : s.defaultView;
    if (!s || !i) return null;
    const n = { left: 0, top: 0, right: i.innerWidth, bottom: i.innerHeight },
      r = e.flatMap((p) => {
        const S = i.getComputedStyle(p);
        if (S.display === 'none' || S.visibility === 'hidden') return [];
        const b = p.getBoundingClientRect(),
          w = typeof t == 'function' ? t(p) : t,
          d = Math.max(b.left, w.left, n.left),
          _ = Math.max(b.top, w.top, n.top),
          m = Math.min(b.right, w.right, n.right),
          v = Math.min(b.bottom, w.bottom, n.bottom);
        return m > d && v > _ ? [{ left: d, top: _, right: m, bottom: v }] : [];
      });
    if (!r.length) return null;
    const a = Math.min(...r.map((p) => p.left)),
      c = Math.min(...r.map((p) => p.top)),
      l = Math.max(...r.map((p) => p.right)),
      u = Math.max(...r.map((p) => p.bottom)),
      h = { left: a, top: c, right: l, bottom: u, width: l - a, height: u - c },
      f = s.createElement('div');
    return (
      (f.dataset.nteTableDragPreview = ''),
      f.setAttribute('aria-hidden', 'true'),
      Object.assign(f.style, {
        position: 'fixed',
        zIndex: '2147483647',
        pointerEvents: 'none',
        left: `${h.left}px`,
        top: `${h.top}px`,
        width: `${h.width}px`,
        height: `${h.height}px`,
        boxSizing: 'border-box',
        background: 'rgb(108 117 125 / 0.42)',
        border: '1px solid rgb(73 80 87 / 0.5)',
        borderRadius: '0.25rem',
        filter: 'drop-shadow(0 0.5rem 1rem rgb(0 0 0 / 0.22))',
        willChange: 'left, top',
      }),
      s.body.append(f),
      { element: f, rect: h }
    );
  },
  O = (o, t, e) => {
    var i, n;
    if (
      (n = (i = o[0]) == null ? void 0 : i.ownerDocument.defaultView) != null &&
      n.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      t();
      return;
    }
    const s = new Map(o.map((r) => [r, r.getBoundingClientRect()]));
    t();
    for (const r of o) {
      const a = s.get(r),
        c = r.getBoundingClientRect(),
        l = e === 'x' ? a.left - c.left : a.top - c.top;
      l &&
        r.animate(
          [{ transform: e === 'x' ? `translateX(${l}px)` : `translateY(${l}px)` }, { transform: 'translate(0, 0)' }],
          { duration: j, easing: 'cubic-bezier(.2,.8,.2,1)' },
        );
    }
  },
  et = (o, t, e) => {
    const s = o.getBoundingClientRect();
    e === 'y'
      ? (t.clientY < s.top + D && (o.scrollTop -= I), t.clientY > s.bottom - D && (o.scrollTop += I))
      : (t.clientX < s.left + D && (o.scrollLeft -= I), t.clientX > s.right - D && (o.scrollLeft += I));
  };
class st extends k {
  constructor() {
    (super(...arguments),
      (this.pointerId = null),
      (this.preview = null),
      (this.grabOffsetX = 0),
      (this.grabOffsetY = 0));
  }
  bindPointerTracking() {
    var e;
    const t = (e = this.context) == null ? void 0 : e.host.ownerDocument;
    (t == null || t.addEventListener('pointermove', this.handlePointerMove),
      t == null || t.addEventListener('pointerup', this.handlePointerEnd),
      t == null || t.addEventListener('pointercancel', this.handlePointerCancel));
  }
  unbindPointerTracking() {
    var e;
    const t = (e = this.context) == null ? void 0 : e.host.ownerDocument;
    (t == null || t.removeEventListener('pointermove', this.handlePointerMove),
      t == null || t.removeEventListener('pointerup', this.handlePointerEnd),
      t == null || t.removeEventListener('pointercancel', this.handlePointerCancel));
  }
  movePreview(t, e, s) {
    this.preview &&
      (s !== 'y' && (this.preview.style.left = `${t - this.grabOffsetX}px`),
      s !== 'x' && (this.preview.style.top = `${e - this.grabOffsetY}px`));
  }
  clearDragState() {
    var t, e, s;
    (this.unbindPointerTracking(),
      (t = this.preview) == null || t.remove(),
      (this.preview = null),
      (this.pointerId = null),
      (e = this.context) == null ||
        e.table
          .querySelectorAll('[data-nte-table-dragging]')
          .forEach((i) => i.removeAttribute('data-nte-table-dragging')),
      (s = this.context) == null ||
        s.table
          .querySelectorAll('[data-nte-table-drop-target]')
          .forEach((i) => i.removeAttribute('data-nte-table-drop-target')));
  }
}
class vt extends st {
  constructor() {
    (super(...arguments),
      (this._sourceIndex = null),
      (this._originalCells = []),
      (this._lastPointerX = 0),
      (this._lastSwapDirection = null),
      (this._reverseLockedUntil = 0),
      (this._pendingMove = null),
      (this._moveFrame = null),
      (this._handlePointerDown = (t) => {
        var c, l, u;
        const e = t.target instanceof Element ? t.target.closest('[data-nte-table-column-handle]') : null,
          s = this.context;
        if (!e || !s || t.button !== 0 || this.pointerId !== null) return;
        const i = e.closest('th, td'),
          r = Array.from(
            ((l = (c = s.table.tHead) == null ? void 0 : c.rows[0]) == null ? void 0 : l.cells) ?? [],
          ).indexOf(i);
        if (!i || r < 0) return;
        t.preventDefault();
        const a = this._createColumnGhost(r);
        if (a) {
          ((this.pointerId = t.pointerId),
            (this._sourceIndex = r),
            (this._originalCells = Array.from(s.table.rows, (h) => Array.from(h.cells))),
            (this.preview = a.element),
            (this.grabOffsetX = t.clientX - a.rect.left),
            (this.grabOffsetY = 0),
            (this._lastPointerX = t.clientX),
            this.movePreview(t.clientX, a.rect.top, 'x'));
          for (const h of Array.from(s.table.rows))
            (u = h.cells[r]) == null || u.setAttribute('data-nte-table-dragging', '');
          this.bindPointerTracking();
        }
      }),
      (this.handlePointerMove = (t) => {
        const e = this.context;
        if (
          !e ||
          t.pointerId !== this.pointerId ||
          this._sourceIndex === null ||
          (t.preventDefault(),
          this.movePreview(t.clientX, t.clientY, 'x'),
          (this._pendingMove = t),
          this._moveFrame !== null)
        )
          return;
        const s = e.host.ownerDocument.defaultView;
        if (!s) {
          const i = this._pendingMove;
          ((this._pendingMove = null), i && this._processPointerMove(i));
          return;
        }
        this._moveFrame = s.requestAnimationFrame(() => {
          this._moveFrame = null;
          const i = this._pendingMove;
          ((this._pendingMove = null), i && this._processPointerMove(i));
        });
      }),
      (this.handlePointerEnd = (t) => {
        var r, a, c;
        if (t.pointerId !== this.pointerId) return;
        const e = this.context,
          s = (r = this._originalCells[0]) == null ? void 0 : r.find((l) => l.hasAttribute('data-nte-table-dragging')),
          i = s ? this._originalCells[0].indexOf(s) : -1,
          n = s
            ? Array.from(
                ((c = (a = e == null ? void 0 : e.table.tHead) == null ? void 0 : a.rows[0]) == null
                  ? void 0
                  : c.cells) ?? [],
              ).indexOf(s)
            : -1;
        (this._finishDrag(),
          !(!e || i < 0 || n < 0 || i === n) &&
            (e.remote.clearSelection(),
            e.host.dispatchEvent(
              new CustomEvent('nte-table-column-reorder', { bubbles: !0, composed: !0, detail: { from: i, to: n } }),
            ),
            e.refresh()));
      }),
      (this.handlePointerCancel = (t) => {
        t.pointerId === this.pointerId && this._cancelDrag();
      }));
  }
  onConnect() {
    var t, e;
    ((e = (t = this.context) == null ? void 0 : t.table.tHead) == null ||
      e.addEventListener('pointerdown', this._handlePointerDown),
      this.onRefresh());
  }
  onDisconnect() {
    var t, e, s;
    ((e = (t = this.context) == null ? void 0 : t.table.tHead) == null ||
      e.removeEventListener('pointerdown', this._handlePointerDown),
      (s = this.context) == null ||
        s.table.querySelectorAll('[data-nte-table-column-handle]').forEach((i) => i.remove()),
      this._cancelDrag());
  }
  onRefresh() {
    var e, s;
    const t = this.context;
    Array.from(
      ((s = (e = t == null ? void 0 : t.table.tHead) == null ? void 0 : e.rows[0]) == null ? void 0 : s.cells) ?? [],
    ).forEach((i, n) => {
      if (i.dataset.reorderable === 'false' || i.querySelector('[data-nte-table-column-handle]')) return;
      const r = B(t.host.ownerDocument, 'nte-table-drag-handle', `Spalte ${n + 1} verschieben`, '⋮⋮');
      ((r.dataset.nteTableColumnHandle = ''), i.prepend(r));
    });
  }
  _processPointerMove(t) {
    var S, b;
    const e = this.context,
      s = this._sourceIndex;
    if (!e || s === null || !this.preview) return;
    et(e.table.tBodies[0], t, 'x');
    const i = t.clientX - this._lastPointerX;
    if (!i) return;
    this._lastPointerX = t.clientX;
    const n = i < 0 ? -1 : 1;
    if (this._lastSwapDirection !== null && n !== this._lastSwapDirection && t.timeStamp < this._reverseLockedUntil)
      return;
    const r = Array.from(((b = (S = e.table.tHead) == null ? void 0 : S.rows[0]) == null ? void 0 : b.cells) ?? []),
      a = s + n,
      c = r[a];
    if (!c) return;
    const l = c.getBoundingClientRect(),
      u = Math.min(yt, Math.max(wt, l.width * St)),
      h = l.left + l.width / 2 + n * u,
      f = this.preview.getBoundingClientRect(),
      g = f.left + f.width / 2;
    if ((n > 0 && g <= h) || (n < 0 && g >= h)) return;
    const p = Array.from(e.table.rows).flatMap((w) => Array.from(w.cells));
    (O(
      p,
      () => {
        for (const w of Array.from(e.table.rows)) {
          const d = w.cells[s],
            _ = w.cells[a];
          w.insertBefore(d, s < a ? _.nextSibling : _);
        }
      },
      'x',
    ),
      (this._sourceIndex = a),
      (this._lastSwapDirection = n),
      (this._reverseLockedUntil = t.timeStamp + j),
      e.table
        .querySelectorAll('[data-nte-table-drop-target]')
        .forEach((w) => w.removeAttribute('data-nte-table-drop-target')),
      c.setAttribute('data-nte-table-drop-target', ''));
  }
  _createColumnGhost(t) {
    const e = this.context,
      s = e.table.tBodies[0].getBoundingClientRect(),
      i = e.host.getBoundingClientRect(),
      n = Array.from(e.table.rows, (r) => r.cells[t]).filter((r) => !!r);
    return tt(n, (r) => (r.closest('tbody') ? s : i));
  }
  _finishDrag() {
    var t, e;
    (this._moveFrame !== null &&
      ((e = (t = this.context) == null ? void 0 : t.host.ownerDocument.defaultView) == null ||
        e.cancelAnimationFrame(this._moveFrame)),
      (this._moveFrame = null),
      (this._pendingMove = null),
      this.clearDragState(),
      (this._sourceIndex = null),
      (this._originalCells = []),
      (this._lastSwapDirection = null),
      (this._reverseLockedUntil = 0));
  }
  _cancelDrag() {
    const t = this.context;
    (t &&
      this._originalCells.length &&
      O(
        Array.from(t.table.rows).flatMap((e) => Array.from(e.cells)),
        () => {
          Array.from(t.table.rows).forEach((e, s) => e.append(...this._originalCells[s]));
        },
        'x',
      ),
      this._finishDrag());
  }
}
class xt extends st {
  constructor() {
    (super(...arguments),
      (this._sourceRow = null),
      (this._originalRows = []),
      (this._handlePointerDown = (t) => {
        const e = t.target instanceof Element ? t.target.closest('[data-nte-table-row-handle]') : null,
          s = this.context;
        if (!e || !s || t.button !== 0 || this.pointerId !== null) return;
        const i = e.closest('tr');
        if (!i) return;
        t.preventDefault();
        const n = tt(Array.from(i.cells), s.table.tBodies[0].getBoundingClientRect());
        n &&
          ((this.pointerId = t.pointerId),
          (this._sourceRow = i),
          (this._originalRows = Array.from(s.table.tBodies[0].rows)),
          (this.preview = n.element),
          (this.grabOffsetX = t.clientX - n.rect.left),
          (this.grabOffsetY = t.clientY - n.rect.top),
          this.movePreview(t.clientX, t.clientY, 'both'),
          i.setAttribute('data-nte-table-dragging', ''),
          this.bindPointerTracking());
      }),
      (this.handlePointerMove = (t) => {
        const e = this.context;
        if (!e || !this._sourceRow || t.pointerId !== this.pointerId) return;
        (t.preventDefault(), this.movePreview(t.clientX, t.clientY, 'both'));
        const s = e.table.tBodies[0];
        et(s, t, 'y');
        const i = Array.from(s.rows).filter((c) => c !== this._sourceRow),
          n =
            i.find((c) => t.clientY < c.getBoundingClientRect().top + c.getBoundingClientRect().height / 2) ??
            i[i.length - 1];
        if (!n) return;
        const r = t.clientY >= n.getBoundingClientRect().top + n.getBoundingClientRect().height / 2,
          a = r ? n.nextSibling : n;
        a === this._sourceRow ||
          (!r && n.previousSibling === this._sourceRow) ||
          (O(Array.from(s.rows), () => s.insertBefore(this._sourceRow, a), 'y'),
          s
            .querySelectorAll('[data-nte-table-drop-target]')
            .forEach((c) => c.removeAttribute('data-nte-table-drop-target')),
          n.setAttribute('data-nte-table-drop-target', ''));
      }),
      (this.handlePointerEnd = (t) => {
        var r;
        if (t.pointerId !== this.pointerId) return;
        const e = this.context,
          s = this._sourceRow,
          i = s ? this._originalRows.indexOf(s) : -1,
          n = s
            ? Array.from(((r = e == null ? void 0 : e.table.tBodies[0]) == null ? void 0 : r.rows) ?? []).indexOf(s)
            : -1;
        (this._finishDrag(),
          !(!e || i < 0 || n < 0 || i === n) &&
            (e.host.dispatchEvent(
              new CustomEvent('nte-table-row-reorder', { bubbles: !0, composed: !0, detail: { from: i, to: n } }),
            ),
            e.refresh()));
      }),
      (this.handlePointerCancel = (t) => {
        t.pointerId === this.pointerId && this._cancelDrag();
      }));
  }
  onConnect() {
    var t, e;
    ((e = (t = this.context) == null ? void 0 : t.table.tBodies[0]) == null ||
      e.addEventListener('pointerdown', this._handlePointerDown),
      this.onRefresh());
  }
  onDisconnect() {
    var e;
    const t = (e = this.context) == null ? void 0 : e.table.tBodies[0];
    (t == null || t.removeEventListener('pointerdown', this._handlePointerDown),
      t == null || t.querySelectorAll('[data-nte-table-row-handle]').forEach((s) => s.remove()),
      this._cancelDrag());
  }
  onRefresh() {
    var e;
    const t = this.context;
    Array.from(((e = t == null ? void 0 : t.table.tBodies[0]) == null ? void 0 : e.rows) ?? []).forEach((s, i) => {
      const n = s.cells[0];
      if (!n || s.dataset.reorderable === 'false' || n.querySelector('[data-nte-table-row-handle]')) return;
      const r = B(t.host.ownerDocument, 'nte-table-drag-handle', `Zeile ${i + 1} verschieben`, '⠿');
      ((r.dataset.nteTableRowHandle = ''), n.prepend(r));
    });
  }
  _finishDrag() {
    (this.clearDragState(), (this._sourceRow = null), (this._originalRows = []));
  }
  _cancelDrag() {
    var e;
    const t = (e = this.context) == null ? void 0 : e.table.tBodies[0];
    (t && this._originalRows.length && O(Array.from(t.rows), () => t.append(...this._originalRows), 'y'),
      this._finishDrag());
  }
}
z.register('sort', () => new pt());
z.register('resize-columns', () => new bt());
z.register('reorder-columns', () => new vt());
z.register('reorder-rows', () => new xt());
const Ct =
  ':host{display:block;min-inline-size:0}#viewport{box-sizing:border-box;inline-size:100%;min-block-size:0;overflow:hidden;position:relative;border-radius:0}::slotted(table){border:0;border-collapse:separate;border-radius:0;border-spacing:0}';
var Mt = Object.create,
  F = Object.defineProperty,
  At = Object.getOwnPropertyDescriptor,
  it = (o, t) => ((t = Symbol[o]) ? t : Symbol.for('Symbol.' + o)),
  A = (o) => {
    throw TypeError(o);
  },
  Rt = (o, t, e) => (t in o ? F(o, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (o[t] = e)),
  Z = (o, t) => F(o, 'name', { value: t, configurable: !0 }),
  Et = (o) => [, , , Mt((o == null ? void 0 : o[it('metadata')]) ?? null)],
  nt = ['class', 'method', 'getter', 'setter', 'accessor', 'field', 'value', 'get', 'set'],
  T = (o) => (o !== void 0 && typeof o != 'function' ? A('Function expected') : o),
  Lt = (o, t, e, s, i) => ({
    kind: nt[o],
    name: t,
    metadata: s,
    addInitializer: (n) => (e._ ? A('Already initialized') : i.push(T(n || null))),
  }),
  Tt = (o, t) => Rt(t, it('metadata'), o[3]),
  C = (o, t, e, s) => {
    for (var i = 0, n = o[t >> 1], r = n && n.length; i < r; i++) t & 1 ? n[i].call(e) : (s = n[i].call(e, s));
    return s;
  },
  R = (o, t, e, s, i, n) => {
    var r,
      a,
      c,
      l,
      u,
      h = t & 7,
      f = !!(t & 8),
      g = !!(t & 16),
      p = h > 3 ? o.length + 1 : h ? (f ? 1 : 2) : 0,
      S = nt[h + 5],
      b = h > 3 && (o[p - 1] = []),
      w = o[p] || (o[p] = []),
      d =
        h &&
        (!g && !f && (i = i.prototype),
        h < 5 &&
          (h > 3 || !g) &&
          At(
            h < 4
              ? i
              : {
                  get [e]() {
                    return J(this, n);
                  },
                  set [e](m) {
                    return K(this, n, m);
                  },
                },
            e,
          ));
    h ? g && h < 4 && Z(n, (h > 2 ? 'set ' : h > 1 ? 'get ' : '') + e) : Z(i, e);
    for (var _ = s.length - 1; _ >= 0; _--)
      ((l = Lt(h, e, (c = {}), o[3], w)),
        h &&
          ((l.static = f),
          (l.private = g),
          (u = l.access = { has: g ? (m) => zt(i, m) : (m) => e in m }),
          h ^ 3 && (u.get = g ? (m) => (h ^ 1 ? J : Dt)(m, i, h ^ 4 ? n : d.get) : (m) => m[e]),
          h > 2 && (u.set = g ? (m, v) => K(m, i, v, h ^ 4 ? n : d.set) : (m, v) => (m[e] = v))),
        (a = (0, s[_])(h ? (h < 4 ? (g ? n : d[S]) : h > 4 ? void 0 : { get: d.get, set: d.set }) : i, l)),
        (c._ = 1),
        h ^ 4 || a === void 0
          ? T(a) && (h > 4 ? b.unshift(a) : h ? (g ? (n = a) : (d[S] = a)) : (i = a))
          : typeof a != 'object' || a === null
            ? A('Object expected')
            : (T((r = a.get)) && (d.get = r), T((r = a.set)) && (d.set = r), T((r = a.init)) && b.unshift(r)));
    return (h || Tt(o, i), d && F(i, e, d), g ? (h ^ 4 ? n : d) : i);
  },
  X = (o, t, e) => t.has(o) || A('Cannot ' + e),
  zt = (o, t) => (Object(t) !== t ? A('Cannot use the "in" operator on this value') : o.has(t)),
  J = (o, t, e) => (X(o, t, 'read from private field'), e ? e.call(o) : t.get(o)),
  L = (o, t, e) =>
    t.has(o) ? A('Cannot add the same private member more than once') : t instanceof WeakSet ? t.add(o) : t.set(o, e),
  K = (o, t, e, s) => (X(o, t, 'write to private field'), s ? s.call(o, e) : t.set(o, e), e),
  Dt = (o, t, e) => (X(o, t, 'access private method'), e),
  rt,
  ot,
  at,
  lt,
  ct,
  H,
  ht,
  y,
  $,
  N,
  q,
  V,
  Y;
const P = '24rem',
  Q = 48,
  x = {
    borderFree: 'data-nte-table-border-free',
    columnSelected: 'data-nte-table-column-selected',
    headerSelected: 'data-nte-table-header-selected',
    highlight: 'data-nte-table-highlight',
    hidden: 'data-nte-table-hidden',
    pinned: 'data-nte-table-pinned',
    rowSelected: 'data-nte-table-row-selected',
    sized: 'data-nte-table-sized',
  },
  It = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'];
class Pt {
  constructor(t) {
    this._actions = t;
  }
  selectRow(t) {
    return this._actions.setRowSelected(t, !0);
  }
  deselectRow(t) {
    return this._actions.setRowSelected(t, !1);
  }
  toggleRow(t) {
    return this._actions.toggleRow(t);
  }
  selectColumn(t) {
    return this._actions.setColumnSelected(t, !0);
  }
  deselectColumn(t) {
    return this._actions.setColumnSelected(t, !1);
  }
  toggleColumn(t) {
    return this._actions.toggleColumn(t);
  }
  clearSelection() {
    this._actions.clearSelection();
  }
  getColumnWidth(t) {
    return this._actions.getColumnWidth(t);
  }
  setColumnWidth(t, e) {
    return this._actions.setColumnWidth(t, e);
  }
  getLayoutState() {
    return this._actions.getLayoutState();
  }
}
ht = [_t('nte-table')];
class M extends ((H = dt({ eventBinding: !1, slotVisibility: !1 })),
(ct = [E({ type: String })]),
(lt = [E({ type: String })]),
(at = [E({ type: Number, attribute: 'pinned-columns' })]),
(ot = [E({ type: String, attribute: 'scroll-label' })]),
(rt = [E({ type: String, reflect: !0, attribute: 'aria-label' })]),
H) {
  constructor() {
    (super(...arguments),
      L(this, $, C(y, 8, this, P)),
      C(y, 11, this),
      L(this, N, C(y, 12, this, '')),
      C(y, 15, this),
      L(this, q, C(y, 16, this, 0)),
      C(y, 19, this),
      L(this, V, C(y, 20, this, '')),
      C(y, 23, this),
      L(this, Y, C(y, 24, this, '')),
      C(y, 27, this),
      (this._body = null),
      (this._columnWidths = []),
      (this._layoutFrame = null),
      (this._managed = new Map()),
      (this._plugins = new Map()),
      (this._refreshWidths = !0),
      (this._resizeObserver = null),
      (this._resizeTargets = new Set()),
      (this._selectedColumns = new Set()),
      (this._selectedRows = new Set()),
      (this._sourceTable = null),
      (this._warnings = new Set()),
      (this._remote = new Pt({
        getColumnWidth: (t) => this._getColumnWidth(t),
        setColumnWidth: (t, e) => this._setColumnWidth(t, e),
        getLayoutState: () => this._getLayoutState(),
        clearSelection: () => this._clearSelection(),
        setColumnSelected: (t, e) => this._setColumnSelected(t, e),
        setRowSelected: (t, e) => this._setRowSelected(t, e),
        toggleColumn: (t) => this._toggleColumn(t),
        toggleRow: (t) => this._toggleRow(t),
      })),
      (this._handleSlotChange = () => this._bindSourceTable()),
      (this._handleBodyScroll = () => this._syncHorizontalScroll()));
  }
  get sourceTable() {
    return this._sourceTable;
  }
  get remote() {
    return this._remote;
  }
  refresh() {
    var t;
    for (const e of this._plugins.values()) (t = e.refresh) == null || t.call(e);
    ((this._refreshWidths = !0), this._scheduleLayout());
  }
  connectedCallback() {
    (super.connectedCallback(), this.hasUpdated && queueMicrotask(() => this.isConnected && this._bindSourceTable()));
  }
  disconnectedCallback() {
    (this._unbindSourceTable(), super.disconnectedCallback());
  }
  firstUpdated() {
    this._bindSourceTable();
  }
  updated(t) {
    (super.updated(t),
      t.has('height') && this._validateHeight(),
      t.has('features') && this._syncPlugins(),
      (t.has('ariaLabel') || t.has('height') || t.has('pinnedColumns') || t.has('scrollLabel')) &&
        this._scheduleLayout());
  }
  render() {
    return ut`
      <div
        id="viewport"
        part="viewport"
        role="region"
        aria-label="${this._viewportLabel()}"
      >
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }
  _bindSourceTable() {
    const t = Array.from(this.children).filter((i) => i.tagName === 'TABLE'),
      e = t.length === 1 ? t[0] : null;
    if (e === this._sourceTable) {
      this._scheduleLayout();
      return;
    }
    if ((this._unbindSourceTable(), (this._sourceTable = e), !e)) {
      this._warnOnce(
        t.length === 0
          ? 'nte-table expects exactly one direct <table> child.'
          : 'nte-table received more than one direct <table>; layout enhancements are disabled.',
      );
      return;
    }
    const s = this.ownerDocument.defaultView;
    (s != null && s.ResizeObserver && (this._resizeObserver = new s.ResizeObserver(() => this._scheduleLayout())),
      this._syncPlugins(),
      this._scheduleLayout());
  }
  _unbindSourceTable() {
    var t;
    (this._setBody(null),
      (t = this._resizeObserver) == null || t.disconnect(),
      (this._resizeObserver = null),
      this._resizeTargets.clear(),
      this._disconnectPlugins(),
      (this._columnWidths = []),
      (this._refreshWidths = !0),
      this._clearSelection(),
      this._cancelLayout(),
      this._restoreManagedState(),
      (this._sourceTable = null));
  }
  _pluginContext(t) {
    return { host: this, remote: this.remote, table: t, refresh: () => this.refresh() };
  }
  _syncPlugins() {
    const t = this._sourceTable;
    if (!t) return;
    const e = new Set(
      (this.features ?? '')
        .split(/[\s,]+/)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    );
    for (const [s, i] of this._plugins) e.has(s) || (i.disconnect(), this._plugins.delete(s));
    for (const s of e) {
      if (this._plugins.has(s)) continue;
      const i = z.create(s);
      if (!i) {
        this._warnOnce(`nte-table feature is not registered: ${s}`);
        continue;
      }
      (i.connect(this._pluginContext(t)), this._plugins.set(s, i));
    }
    ((this._refreshWidths = !0), this._scheduleLayout());
  }
  _disconnectPlugins() {
    for (const t of this._plugins.values()) t.disconnect();
    this._plugins.clear();
  }
  _setBody(t) {
    var e, s;
    t !== this._body &&
      ((e = this._body) == null || e.removeEventListener('scroll', this._handleBodyScroll),
      (this._body = t),
      (s = this._body) == null || s.addEventListener('scroll', this._handleBodyScroll, { passive: !0 }));
  }
  _syncHorizontalScroll() {
    var r;
    const t = this._sourceTable,
      e = this._body;
    if (!t || !e) return;
    const s = (r = this.ownerDocument.defaultView) == null ? void 0 : r.getComputedStyle(t).direction,
      i = this._normalizedScrollLeft(e, s === 'rtl'),
      n = `translateX(${-i}px)`;
    (t.tHead && this._setManagedStyle(t.tHead, 'transform', n),
      t.tFoot && this._setManagedStyle(t.tFoot, 'transform', n));
    for (const a of [t.tHead, t.tFoot])
      if (a)
        for (const c of Array.from(a.querySelectorAll(`[${x.pinned}]`)))
          this._setManagedStyle(c, 'transform', `translateX(${i}px)`);
  }
  _normalizedScrollLeft(t, e) {
    if (!e) return t.scrollLeft;
    const s = t.scrollWidth - t.clientWidth;
    return t.scrollLeft < 0 ? -t.scrollLeft : s - t.scrollLeft;
  }
  _scheduleLayout() {
    if (!this.isConnected || !this._sourceTable || this._layoutFrame !== null) return;
    const t = this.ownerDocument.defaultView;
    t &&
      (this._layoutFrame = t.requestAnimationFrame(() => {
        ((this._layoutFrame = null), this._syncLayout());
      }));
  }
  _cancelLayout() {
    var t;
    this._layoutFrame !== null &&
      ((t = this.ownerDocument.defaultView) == null || t.cancelAnimationFrame(this._layoutFrame),
      (this._layoutFrame = null));
  }
  _syncLayout() {
    var s, i, n, r;
    const t = this._sourceTable;
    if (!t) return;
    (this._setBody(null), this._restoreManagedState(), this._refreshWidths && (this._columnWidths = []));
    let e = [];
    try {
      this._updateViewportLabel(t);
      const a = (s = t.tHead) == null ? void 0 : s.rows[0],
        c = Array.from(t.tBodies);
      if (
        !a ||
        ((i = t.tHead) == null ? void 0 : i.rows.length) !== 1 ||
        c.length !== 1 ||
        (t.tFoot && t.tFoot.rows.length !== 1)
      ) {
        this._warnOnce('nte-table requires one header row, one tbody and at most one footer row.');
        return;
      }
      e = Array.from(a.cells);
      const l = Array.from(t.rows),
        u = e.length;
      if (!(
        u > 0 &&
        l.every((d) => d.cells.length === u && Array.from(d.cells).every((_) => _.colSpan === 1 && _.rowSpan === 1))
      )) {
        this._warnOnce('nte-table width, hide and pin enhancements do not support colspan or rowspan.');
        return;
      }
      (this._setManagedStyle(t, 'border-collapse', 'separate'),
        this._setManagedStyle(t, 'border-spacing', '0px'),
        this._setManagedStyle(t, 'display', 'block'),
        this._setManagedStyle(t, 'inline-size', '100%'),
        this._setManagedStyle(t, 'margin', '0px'),
        this._setManagedStyle(t, 'overflow', 'visible'),
        this._setManagedStyle(t, 'padding', '0px'));
      const f = c[0];
      (this._setManagedAttribute(f, 'tabindex', '0'),
        this._setManagedStyle(f, 'box-sizing', 'border-box'),
        this._setManagedStyle(f, 'display', 'block'),
        this._setManagedStyle(f, 'block-size', this._safeHeight()),
        this._setManagedStyle(f, 'inline-size', '100%'),
        this._setManagedStyle(f, 'overflow-x', 'auto'),
        this._setManagedStyle(f, 'overflow-y', 'auto'),
        this._setManagedStyle(f, 'overscroll-behavior', 'contain'),
        this._setManagedStyle(f, 'touch-action', 'pan-x pan-y'),
        this._setManagedStyle(f, '-webkit-overflow-scrolling', 'touch'));
      const g = [];
      (e.forEach((d, _) => {
        if ((d.hidden || this._isDataHidden(d) || g.push(_), this._columnWidths[_] !== void 0)) return;
        const v = this._readColumnWidth(d);
        v &&
          (this._setManagedStyle(d, 'inline-size', v),
          this._setManagedStyle(d, 'min-inline-size', v),
          this._setManagedStyle(d, 'max-inline-size', v));
      }),
        e.forEach((d, _) => {
          var m;
          (m = this._columnWidths)[_] ?? (m[_] = Math.max(Q, Math.ceil(d.getBoundingClientRect().width)));
        }));
      const p = this._columnWidths;
      (l.forEach((d) => {
        Array.from(d.cells).forEach((_, m) => {
          var U;
          const v = !g.includes(m),
            W = `${p[m]}px`;
          (this._setManagedStyle(_, 'box-sizing', 'border-box'),
            v
              ? (this._setManagedAttribute(_, x.hidden, ''), this._setManagedStyle(_, 'display', 'none'))
              : (this._setManagedAttribute(_, x.sized, ''),
                this._setManagedStyle(_, 'inline-size', W),
                this._setManagedStyle(_, 'min-inline-size', W),
                this._setManagedStyle(_, 'max-inline-size', W),
                ((U = d.parentElement) == null ? void 0 : U.tagName) !== 'TBODY' &&
                  this._setManagedStyle(_, 'white-space', 'nowrap')));
        });
      }),
        this._applyHeaderColumnStates(l, e),
        this._applySelectionState(l));
      const S = g.reduce((d, _) => d + p[_], 0),
        b = `${Math.max(S, f.clientWidth)}px`,
        w = t.caption;
      if (w) {
        const d =
          ((r = (n = this.shadowRoot) == null ? void 0 : n.querySelector('#viewport')) == null
            ? void 0
            : r.clientWidth) ?? t.clientWidth;
        (this._setManagedStyle(w, 'box-sizing', 'border-box'),
          this._setManagedStyle(w, 'display', 'block'),
          this._setManagedStyle(w, 'inline-size', `${d}px`));
      }
      (this._configureSection(t.tHead, b), t.tFoot && this._configureSection(t.tFoot, b));
      for (const d of Array.from(f.rows))
        (this._setManagedStyle(d, 'display', 'table'),
          this._setManagedStyle(d, 'table-layout', 'fixed'),
          this._setManagedStyle(d, 'inline-size', b));
      (this._applyPinnedColumns(l, e, g, p),
        this._setBody(f),
        this._syncHorizontalScroll(),
        (this._refreshWidths = !1));
    } finally {
      this._updateResizeTargets(t);
    }
  }
  _configureSection(t, e) {
    (this._setManagedStyle(t, 'display', 'table'),
      this._setManagedStyle(t, 'inline-size', e),
      this._setManagedStyle(t, 'table-layout', 'fixed'));
  }
  _applyPinnedColumns(t, e, s, i) {
    var a;
    const n = Math.min(this._safePinnedColumns(), s.length);
    let r = 0;
    for (const c of s.slice(0, n)) {
      for (const l of t) {
        const u = l.cells[c];
        (this._setManagedAttribute(u, x.pinned, ''),
          this._setManagedStyle(u, 'position', 'sticky'),
          this._setManagedStyle(u, 'inset-inline-start', `${r}px`),
          this._setManagedStyle(
            u,
            'z-index',
            ((a = l.parentElement) == null ? void 0 : a.tagName) === 'TBODY' ? '2' : '4',
          ));
      }
      r += i[c];
    }
  }
  _applyHeaderColumnStates(t, e) {
    e.forEach((s, i) => {
      const n =
          It.find((c) => s.classList.contains(`highlight-${c}`)) ??
          (s.classList.contains('highlight') ? 'primary' : void 0),
        r = s.classList.contains('selected'),
        a = s.classList.contains('border-free');
      for (const c of t) {
        const l = c.cells[i];
        (n && this._setManagedAttribute(l, x.highlight, n),
          r && this._setManagedAttribute(l, x.headerSelected, ''),
          a && this._setManagedAttribute(l, x.borderFree, ''));
      }
    });
  }
  _applySelectionState(t) {
    var e;
    for (const s of Array.from(this._selectedRows)) t.includes(s) || this._selectedRows.delete(s);
    for (const s of t) {
      const i = this._selectedRows.has(s);
      s.toggleAttribute(x.rowSelected, i);
      for (const n of Array.from(s.cells)) n.toggleAttribute(x.rowSelected, i);
      for (const n of this._selectedColumns) (e = s.cells[n]) == null || e.setAttribute(x.columnSelected, '');
    }
  }
  _getColumnWidth(t) {
    var s, i, n, r;
    const e = this._resolveColumn(t);
    return e === null
      ? null
      : (this._columnWidths[e] ??
          ((r =
            (n = (i = (s = this._sourceTable) == null ? void 0 : s.tHead) == null ? void 0 : i.rows[0]) == null
              ? void 0
              : n.cells[e]) == null
            ? void 0
            : r.getBoundingClientRect().width) ??
          null);
  }
  _setColumnWidth(t, e) {
    var r, a, c;
    const s = this._resolveColumn(t),
      i =
        s === null
          ? null
          : (c = (a = (r = this._sourceTable) == null ? void 0 : r.tHead) == null ? void 0 : a.rows[0]) == null
            ? void 0
            : c.cells[s];
    if (s === null || !i || !Number.isFinite(e)) return !1;
    const n = Math.max(Q, Math.round(e));
    return ((this._columnWidths[s] = n), (i.dataset.width = `${n}px`), this._scheduleLayout(), !0);
  }
  _getLayoutState() {
    var r, a, c;
    const t = Array.from(
        ((c = (a = (r = this._sourceTable) == null ? void 0 : r.tHead) == null ? void 0 : a.rows[0]) == null
          ? void 0
          : c.cells) ?? [],
      ),
      e = t.filter((l) => !l.hidden && !this._isDataHidden(l)),
      s = new Set(e.slice(0, this._safePinnedColumns())),
      i = {},
      n = t.map((l, u) => {
        var h;
        return ((h = l.dataset.columnId) == null ? void 0 : h.trim()) || l.id.trim() || String(u);
      });
    return (
      t.forEach(
        (l, u) =>
          (i[n[u]] = {
            width: this._columnWidths[u] ?? Math.round(l.getBoundingClientRect().width),
            hidden: l.hidden || this._isDataHidden(l),
            pinned: s.has(l),
          }),
      ),
      { columns: i, order: n }
    );
  }
  _setRowSelected(t, e) {
    var i;
    const s = this._resolveRow(t);
    return s
      ? (e ? this._selectedRows.add(s) : this._selectedRows.delete(s),
        this._applySelectionState(Array.from(((i = this._sourceTable) == null ? void 0 : i.rows) ?? [])),
        !0)
      : !1;
  }
  _toggleRow(t) {
    const e = this._resolveRow(t);
    return e ? this._setRowSelected(e, !this._selectedRows.has(e)) : !1;
  }
  _setColumnSelected(t, e) {
    var i;
    const s = this._resolveColumn(t);
    return s === null
      ? !1
      : (e ? this._selectedColumns.add(s) : this._selectedColumns.delete(s),
        this._clearSelectionMarkers(x.columnSelected),
        this._applySelectionState(Array.from(((i = this._sourceTable) == null ? void 0 : i.rows) ?? [])),
        !0);
  }
  _toggleColumn(t) {
    const e = this._resolveColumn(t);
    return e === null ? !1 : this._setColumnSelected(e, !this._selectedColumns.has(e));
  }
  _clearSelection() {
    (this._selectedRows.clear(),
      this._selectedColumns.clear(),
      this._clearSelectionMarkers(x.rowSelected),
      this._clearSelectionMarkers(x.columnSelected));
  }
  _clearSelectionMarkers(t) {
    var e;
    (e = this._sourceTable) == null || e.querySelectorAll(`[${t}]`).forEach((s) => s.removeAttribute(t));
  }
  _resolveRow(t) {
    var s, i;
    const e = Array.from(
      ((i = (s = this._sourceTable) == null ? void 0 : s.tBodies[0]) == null ? void 0 : i.rows) ?? [],
    );
    return typeof t == 'number'
      ? (e[t] ?? null)
      : t instanceof HTMLTableRowElement
        ? e.includes(t)
          ? t
          : null
        : (e.find((n) => n.id === t || n.dataset.rowId === t) ?? null);
  }
  _resolveColumn(t) {
    var i, n, r;
    const e = Array.from(
      ((r = (n = (i = this._sourceTable) == null ? void 0 : i.tHead) == null ? void 0 : n.rows[0]) == null
        ? void 0
        : r.cells) ?? [],
    );
    if (typeof t == 'number') return e[t] ? t : null;
    if (t instanceof HTMLTableCellElement) {
      const a = e.indexOf(t);
      return a < 0 ? null : a;
    }
    const s = e.findIndex((a) => a.id === t || a.dataset.columnId === t);
    return s < 0 ? null : s;
  }
  _updateResizeTargets(t) {
    var i;
    if (!this._resizeObserver) return;
    const e = new Set();
    t.caption && e.add(t.caption);
    const s = (i = this.shadowRoot) == null ? void 0 : i.querySelector('#viewport');
    s && e.add(s);
    for (const n of this._resizeTargets) e.has(n) || this._resizeObserver.unobserve(n);
    for (const n of e) this._resizeTargets.has(n) || this._resizeObserver.observe(n);
    this._resizeTargets = e;
  }
  _readColumnWidth(t) {
    var i, n, r;
    let e =
      ((i = t.dataset.width) == null ? void 0 : i.trim()) ||
      t.style.width.trim() ||
      ((n = t.getAttribute('width')) == null ? void 0 : n.trim());
    if (!e) return null;
    /^\d+(?:\.\d+)?$/.test(e) && (e = `${e}px`);
    const s = (r = this.ownerDocument.defaultView) == null ? void 0 : r.CSS;
    return !s || s.supports('width', e) ? e : (this._warnOnce(`nte-table ignored invalid column width: ${e}`), null);
  }
  _isDataHidden(t) {
    return t.hasAttribute('data-hidden') && t.getAttribute('data-hidden') !== 'false';
  }
  _safePinnedColumns() {
    return Number.isFinite(this.pinnedColumns) ? Math.max(0, Math.floor(this.pinnedColumns)) : 0;
  }
  _safeHeight() {
    var s;
    const t = (this.height ?? '').trim(),
      e = (s = this.ownerDocument.defaultView) == null ? void 0 : s.CSS;
    return t && (!e || e.supports('height', t)) ? t : P;
  }
  _validateHeight() {
    this._safeHeight() === P &&
      (this.height ?? '').trim() !== P &&
      this._warnOnce(`nte-table ignored invalid height: ${this.height}`);
  }
  _viewportLabel() {
    return (this.scrollLabel ?? '').trim() || (this.ariaLabel ?? '').trim() || 'Table';
  }
  _updateViewportLabel(t) {
    var s, i, n, r, a;
    const e =
      (this.scrollLabel ?? '').trim() ||
      (this.ariaLabel ?? '').trim() ||
      ((s = t.getAttribute('aria-label')) == null ? void 0 : s.trim()) ||
      ((n = (i = t.caption) == null ? void 0 : i.textContent) == null ? void 0 : n.trim()) ||
      this._viewportLabel();
    (a = (r = this.shadowRoot) == null ? void 0 : r.querySelector('#viewport')) == null ||
      a.setAttribute('aria-label', e);
  }
  _managedState(t) {
    let e = this._managed.get(t);
    return (e || ((e = { attributes: new Map(), styles: new Map() }), this._managed.set(t, e)), e);
  }
  _setManagedAttribute(t, e, s) {
    const i = this._managedState(t);
    (i.attributes.has(e) || i.attributes.set(e, t.getAttribute(e)), t.getAttribute(e) !== s && t.setAttribute(e, s));
  }
  _setManagedStyle(t, e, s) {
    const i = this._managedState(t);
    (i.styles.has(e) ||
      i.styles.set(e, { priority: t.style.getPropertyPriority(e), value: t.style.getPropertyValue(e) }),
      t.style.getPropertyValue(e) !== s && t.style.setProperty(e, s));
  }
  _restoreManagedState() {
    for (const [t, e] of this._managed) {
      for (const [s, i] of e.attributes) i === null ? t.removeAttribute(s) : t.setAttribute(s, i);
      for (const [s, i] of e.styles) i.value ? t.style.setProperty(s, i.value, i.priority) : t.style.removeProperty(s);
    }
    this._managed.clear();
  }
  _warnOnce(t) {
    this._warnings.has(t) || (this._warnings.add(t), this.warn(t));
  }
}
y = Et(H);
$ = new WeakMap();
N = new WeakMap();
q = new WeakMap();
V = new WeakMap();
Y = new WeakMap();
R(y, 4, 'height', ct, M, $);
R(y, 4, 'features', lt, M, N);
R(y, 4, 'pinnedColumns', at, M, q);
R(y, 4, 'scrollLabel', ot, M, V);
R(y, 4, 'ariaLabel', rt, M, Y);
M = R(y, 0, 'NteTableElement', ht, M);
M.styles = [G(ft), G(Ct)];
C(y, 1, M);
