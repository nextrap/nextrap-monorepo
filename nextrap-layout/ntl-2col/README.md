# ntl-2col

Responsives Layout mit Main/Aside sowie optionalen Top-/Bottom-Regionen im gemeinsamen Wrapper. Header und Footer bleiben außerhalb des Rahmens.

## Abstände

`default-style()` setzt den gesamten Randabstand einmal am Wrapper. `--inner-padding` steuert dessen Padding, `--gap` ausschließlich den Abstand zwischen sichtbaren Regionen. Top, Main, Aside und Bottom besitzen kein zusätzliches Layout-Padding. Das gilt auch bei Main-only, automatischen Bildern, expliziten Slots, `.aside.p-0` und umgekehrter Reihenfolge. Ein vollständig leerer Wrapper wird ausgeblendet.

Bei `--inner-padding: 24px` und `--gap: 16px` liegen alle äußeren Regionskanten 24px innerhalb des Rahmens; zwischen benachbarten Regionen liegen 16px. Ein Null-Gap ist erlaubt, für CSS-Längenberechnungen bevorzugt `0px` verwenden. Eigene Inhalts-Margins und bewusst variant-spezifische Bildüberstände werden nicht automatisch entfernt.

## Reverse-Mixins

```scss
@use '@nextrap/ntl-2col' as twoCol;

// Das Theme bindet die vollständige Baseline an genau eine Style-Klasse.
ntl-2col.style-default {
  @include twoCol.default-style();
}

// Die beiden Modi können unabhängig voneinander komponiert werden.
ntl-2col.with-mobile-reverse {
  @include twoCol.with-mobile-reverse();
}
ntl-2col.with-desktop-reverse {
  @include twoCol.with-desktop-reverse();
}
```

| API | Mobile | Desktop |
|---|---|---|
| `with-mobile-reverse()` / Klasse `.reverse-mobile` | Aside vor Main | Unverändert |
| `with-desktop-reverse()` / Klasse `.reverse-desktop` | Unverändert | Aside vor Main |
| `with-reverse()` / Klasse `.reverse` | Aside vor Main | Aside vor Main |
| `with-alternating()` | Unverändert | Tauscht bei geraden Instanzen die Order |

Die eingebauten Klassen werden von `with-modifier-classes()` registriert und gehören standardmäßig zu `default-style()`. Direkte Mixin-Aufrufe benötigen keine zusätzliche Klasse. Top/Bottom behalten ihre volle Breite, Header/Footer ihre äußere Position. Unabhängige Theme-Regeln wie Bildpriorisierung auf Mobile bleiben wirksam. Der Divider folgt der Kombination aus Flex-Richtung und Alternating-Order, ohne den Gap zu vergrößern.

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

Der Browser-Test nutzt die echten TS-/SCSS-Quellen und das SlotVisibilityMixin. Er prüft alle 16 Slot-Belegungen mit drei Gaps, beiden Modi, neun Reverse-Varianten und Alternating, außerdem dynamische Slot-Belegung. Chrome/Chromium muss lokal installiert sein:

```sh
CHROME_BIN=/usr/bin/google-chrome node nextrap-layout/ntl-2col/tests/spacing.browser.mjs
```

Ausführung aus der Monorepo-Wurzel. Die CI führt denselben Test aus. Bei einer Laufzeit ohne ausführbaren Dart-Sass-Compiler kann `NTL_TEST_SASS` auf die ESM-Datei eines vorhandenen JavaScript-Sass-Compilers zeigen; die Sources bleiben identisch.
