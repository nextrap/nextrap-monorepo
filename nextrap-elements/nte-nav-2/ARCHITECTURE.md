# NTE Nav 2 architecture

## Native Popover only

Die horizontale Submenu-Variante basiert vollständig auf dem nativen HTML
Popover-Mechanismus.

Ein `nte-nav-item` mit `submenu-popover` rendert intern ausschließlich
deklaratives Popover-Markup:

```html
<button popovertarget="submenu">...</button>
<div id="submenu" popover="auto">...</div>
```

Die Popover-Logik muss vom Browser kommen. `nte-nav-2` / `nte-nav-item` dürfen
keine JavaScript-Popover-Logik implementieren:

- kein `showPopover()`;
- kein `hidePopover()`;
- keine JS-Synchronisierung zwischen CSS-Orientation und Popover;
- keine Resize-/Media-Query-Logik für Popover.

Popover wird manuell durch das öffentliche `submenu-popover` Attribut am
betroffenen `nte-nav-item` aktiviert oder durch Entfernen dieses Attributs
deaktiviert.

## Vertikale Navigation

Die vertikale Variante darf kein Popover verwenden. Ein vertikales Submenu wird
korrekt gerendert, indem am betroffenen `nte-nav-item` **kein**
`submenu-popover` Attribut gesetzt wird.

Dann rendert `nte-nav-item` intern native Disclosure-Struktur:

```html
<details id="details" part="details">
  <summary id="disclosure" part="disclosure">...</summary>
  <div id="submenu" part="submenu" role="list">...</div>
</details>
```

Bei einem Elternpunkt mit eigenem `href` bleiben Link und Disclosure getrennt:

```html
<a id="link" part="link" href="...">...</a>
<details id="details" part="details">
  <summary id="toggle" part="toggle">...</summary>
  <div id="submenu" part="submenu" role="list">...</div>
</details>
```

Die vertikale Darstellung entsteht durch die `vertical()` SCSS-Variante. Sie
setzt die Navigationsrichtung auf Spalte und die Submenu-Position auf normalen
Dokumentfluss:

- `--nte-nav-flow: column`;
- `--nte-nav-submenu-position: static`;
- `--nte-nav-submenu-inline-size: 100%`;
- transparente Submenu-Fläche ohne Popover-Box, Border oder Shadow;
- optionaler Einzug über `--nte-nav-inline-submenu-indent`.

Das Submenu öffnet ausschließlich über den nativen `details[open]` Zustand. Die
CSS-Regel für `#details[open] #submenu` macht den Inhalt sichtbar und klappt die
Grid-Zeile von `0fr` auf `1fr` auf. Dadurch bleibt das Submenu inline unter dem
Elterneintrag und erweitert die Navigation vertikal, statt als Overlay aus dem
Layout herauszuspringen.

Wichtig: Für vertikale Navigation darf weder das öffentliche
`submenu-popover` Attribut noch intern `popover` oder `popovertarget` vorhanden
sein.
