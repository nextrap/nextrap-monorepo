---
name: nte-icon-usage
description: Verwende diesen Skill für Markup, API und Auswahl von nte-icon als Bild oder Bootstrap-Icon in Websites, Links und Buttons. Nicht für Theme-Erstellung.
---

# nte-icon verwenden

Importiere `@nextrap/nte-icon`. Verwende `src` für eine Bild-URL oder genau eine
Bootstrap-Klasse wie `bi-house`; die zusätzliche Klasse `bi` ist optional.
`src` hat Vorrang. Verwende kein Inline-SVG als Inhalt und keinen Default-Slot;
dieser ist ein Diagnose-Fallback für unerwartetes Markup.

```html
<nte-icon class="bi-house" label="Startseite"></nte-icon>
<nte-icon src="/icons/logo.svg" height="2rem" label="Logo"></nte-icon>
<button type="button"><nte-icon class="bi-download"></nte-icon> Download</button>
```

Lasse dekorative Icons ohne `label`; beschrifte Icon-only-Buttons am Button.
Nutze `label`, `aria-label` oder `aria-labelledby` für eigenständig bedeutsame
Icons. Autorenseitige ARIA-Attribute haben Vorrang vor internen Defaults.

Nutze `size="xs|sm|md|lg|xl|xxl"` für `.75/.875/1/1.25/1.5/2em`. Aliase:
`s/small`, `m/medium`, `l/large`, `2xl`. Die Standardgröße ist `1em × 1em`.
Setze `height` für eine explizite CSS-Länge. Textfarbe wird vererbt.

Überschreibe bei Bedarf vor der ersten verbundenen Font-Instanz
`NTE_ICON_CONFIG.bootstrapIconsFontUrl`. Die voreingestellte Leuffen-CDN-URL,
die 1.996 Bootstrap-Icons-Klassen einschließlich 43 auf kanonische Glyphen
abgebildeter historischer Aliase und das Verhalten bei
Font-Fehlern stehen im [README](../../../README.md). Import und reine
Bild-Instanzen starten keinen Font-Download. Eine dokumentweite Promise
speichert Erfolg oder Fehler; ein späterer Konfigurationswechsel startet
keinen erneuten Versuch in demselben Dokument.

Setze `placeholder` auf einen kurzen Text oder `""`. Während des Ladens und
bei Fehlern bleibt die Box reserviert. Lies `loadingState` beziehungsweise
`loading-state` (`empty`, `loading`, `loaded`, `error`) oder verwende
`nte-icon-load`/`nte-icon-error`. Beide Events blubbern und sind composed;
`detail.source` nennt `font` oder `image`, Fehler enthalten `detail.error`.

Theme-SCSS, `--nte-icon-size` und öffentliche Parts sind im
[Theming-Skill](../nte-icon-theming/SKILL.md) beschrieben.
