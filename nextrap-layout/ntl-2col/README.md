# ntl-2col

Responsives Layout mit Main/Aside sowie optionalen Top-/Bottom-Regionen im gemeinsamen Wrapper. Header und Footer bleiben außerhalb des Rahmens.

## Abstände

`default-style()` setzt den gesamten Randabstand einmal am Wrapper. `--inner-padding` steuert dessen Padding, `--gap` ausschließlich den Abstand zwischen sichtbaren Regionen. Top, Main, Aside und Bottom besitzen kein zusätzliches Layout-Padding. Das gilt auch bei Main-only, automatischen Bildern, expliziten Slots, `.aside.p-0` und umgekehrter Reihenfolge. Ein vollständig leerer Wrapper wird ausgeblendet.

Bei `--inner-padding: 24px` und `--gap: 16px` liegen alle äußeren Regionskanten 24px innerhalb des Rahmens; zwischen benachbarten Regionen liegen 16px. Ein Null-Gap ist erlaubt, für CSS-Längenberechnungen bevorzugt `0px` verwenden. Eigene Inhalts-Margins und bewusst variant-spezifische Bildüberstände werden nicht automatisch entfernt.

## Automatische Helper und Mixins

```scss
@use '@nextrap/ntl-2col' as twoCol;

// Das Theme bindet die vollständige Baseline an genau eine Style-Klasse.
ntl-2col.style-default {
  @include twoCol.default-style();
}

```

| API | Mobile | Desktop |
|---|---|---|
| `with-mobile-reverse()` / Klasse `.with-mobile-reverse` (Alias `.reverse-mobile`) | Aside vor Main | Unverändert |
| `with-desktop-reverse()` / Klasse `.with-desktop-reverse` (Alias `.reverse-desktop`) | Unverändert | Aside vor Main |
| `with-reverse()` / Klasse `.with-reverse` (Alias `.reverse`) | Aside vor Main | Aside vor Main |
| `with-alternating()` / Klasse `.with-alternating` | Unverändert | Tauscht bei geraden Instanzen die Order |

Die eingebauten Klassen werden von `with-modifier-classes()` registriert und gehören standardmäßig zu `default-style()`. Direkte Mixin-Aufrufe benötigen keine zusätzliche Klasse. Top/Bottom behalten ihre volle Breite, Header/Footer ihre äußere Position. Unabhängige Theme-Regeln wie Bildpriorisierung auf Mobile bleiben wirksam. Der Divider folgt der Kombination aus Flex-Richtung und Alternating-Order, ohne den Gap zu vergrößern.

Alle Helper werden unter dem aktuellen Style-Selektor erzeugt, beispielsweise `ntl-2col.style-default.with-alternating` oder `.theme-custom ntl-2col.style-card.with-main-bottom`. `$modifierClasses: false` (auch `none`) deaktiviert die gesamte Registrierung. Direkte Mixin-Aufrufe bleiben möglich; die internen nativen Reverse-Klassen der Web Component werden dadurch nicht abgeschaltet.

| Helper-Klassen | Mixin / Wirkung |
|---|---|
| `.with-main-text-left`, `-center`, `-right`, `-justify` | `with-main-text-align($align)` richtet ausschließlich den Main-Text aus |
| `.with-main-text-start`, `-end` | Logische Textausrichtung, folgt der Schreibrichtung (RTL/LTR) |
| `.with-main-top`, `.with-main-center`, `.with-main-bottom` | `with-main-justify($justify)` positioniert ausschließlich den Main-Inhalt vertikal |
| `.with-justify-top`, `-center`, `-bottom` | `with-justify($justify)` richtet beide Spalten vertikal auf Desktop aus; `.with-justify` entspricht Center |
| `.with-main-sticky-top` | `with-main-sticky-top($top)` hält Main beim Scrollen sichtbar |
| `.with-breakout-start`, `.with-breakout-end` | Gleichnamige Mixins; bestehende `.breakout-start`/`.breakout-end` bleiben Aliasse |
| `.with-background-and-divider` | Gleichnamiges Mixin mit Standardwerten |
| `.with-image-auto-objectfit` | Gleichnamiges Mixin mit `cover` |
| `.with-wrapper-bg-color` | Gleichnamiges Mixin mit transparentem Hintergrund; konkrete Farbe per Mixin-Parameter |

```html
<ntl-2col class="style-default with-alternating with-main-text-center with-main-bottom">
  <p>Zentrierter Text, vertikal unten</p>
  <div slot="aside">Aside</div>
</ntl-2col>
```

Die Main-Helper gelten in beiden Modi. Vertikale Ausrichtung wirkt bei verfügbarer Mehrhöhe, etwa durch einen höheren Aside auf Desktop oder eine explizite Mindesthöhe. Sie nutzt einen gestreckten Main mit Flex-Spaltenlayout und ersetzt dort gegebenenfalls ein eigenes Grid-Layout. `with-main-text-align(center)` verändert weder Blockbreiten noch die Aside-Ausrichtung. Für Sonderfälle können die Mixins innerhalb eines `[mode]`-Selektors verwendet werden. Pro Achse nur eine Ausrichtungsklasse wählen; Text und vertikale Position sind unabhängig kombinierbar.

Weitere allgemeine Farb-, Größen- und Spacing-Utilities liefert `@nextrap/style-utils`; dafür werden keine parallelen 2COL-Helper eingeführt.

## Änderung gegenüber dem bisherigen Default

| Old | New |
|---|---|
| Wrapper-Gap nutzt `--inner-padding` | Wrapper-Gap nutzt `--gap` |
| Padding pro Region addiert sich zum Gap | Genau ein Wrapper-Padding |
| `.aside`/`.p-0` verändern Layout-Padding | Slot-Art und Inhaltsklasse ändern den Außenabstand nicht |
| `with-reverse()` setzt ungescoptes `row-reverse` | Kombiniert die beiden modusspezifischen Mixins |

Die Endfassung gilt direkt; es gibt weder Transition noch Opt-in-Mixin. Themes mit zusätzlichen Regions-Paddings müssen diese entfernen oder als bewusste interne Inhaltsabstände ausweisen.

## Prüfung

Package-Build: `npx nx build ntl-2col`.

Der Browser-Test nutzt die echten TS-/SCSS-Quellen und das SlotVisibilityMixin. Er prüft alle 16 Slot-Belegungen mit drei Gaps, beiden Modi, zwölf Reverse-Varianten und Alternating, außerdem 36 kombinierte Main-Ausrichtungen, Helper-Scope/Opt-out und dynamische Slot-Belegung. Chrome/Chromium muss lokal installiert sein:

```sh
CHROME_BIN=/usr/bin/google-chrome node nextrap-layout/ntl-2col/tests/spacing.browser.mjs
```

Ausführung aus der Monorepo-Wurzel. Die CI führt denselben Test aus. Bei einer Laufzeit ohne ausführbaren Dart-Sass-Compiler kann `NTL_TEST_SASS` auf die ESM-Datei eines vorhandenen JavaScript-Sass-Compilers zeigen; die Sources bleiben identisch.
