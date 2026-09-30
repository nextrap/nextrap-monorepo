# NTL-2COL: Außenabstand am Wrapper, Zwischenabstand über Gap

| Datum | Benutzername | Kurzbeschreibung |
|---|---|---|
| 2026-09-10 | dermatthes | §§ 1–9: Proposal mit Bestandsanalyse, Styling-Entwurf, Theme-Migration und Abnahmekriterien angelegt |
| 2026-09-10 | dermatthes | §§ 1, 4–9: Direkte Endfassung ohne Transition beauftragt, Reverse-Mixins ergänzt und Umsetzung konkretisiert |

| 2026-09-10 | dermatthes | §§ 1, 7–9: Automatische Helper, Main-Ausrichtung und Raven in ThemeJS2 ergänzt |
| 2026-09-11 | dermatthes | § 1, § 10: Vereinfachung durch positive Insets, aktuelle Risiken, Rundungen und Prüfplan ergänzt; Revisionsmarkierungen zurückgesetzt |
| 2026-09-11 | dermatthes | § 1, § 10: Umsetzung, Sonderabstands-API, Dokumentation und Grafik ergänzt |

## § 1 Ziel und Scope

Historischer Umsetzungsstand vom 2026-09-10: Die direkte Endfassung wurde ohne Transition und Opt-in-Mixin beauftragt und implementiert; ThemeJS2 wurde in einem separaten PR behandelt. Der aktuelle PR implementiert den freigegebenen Vereinfachungsvorschlag; aktueller Stand und Prüfgrenzen stehen in § 10.10. [geändert]

Der gemeinsame Rand um `top`, `main`, `aside` und `bottom` erhält genau einen Innenabstand. Zwischen benachbarten Regionen wirkt ausschließlich das konfigurierte Gap. `header` und `footer` bleiben außerhalb dieses Wrappers. Leere Slots erzeugen weder Regionen noch zusätzliche Gaps. Reverse, mobile Bildpriorisierung und Alternating dürfen den Außenabstand nicht beeinflussen.

Empfehlung: Das Layout-Padding vollständig an `::part(wrapper)` verlagern. Die vier inneren Parts erhalten kein eigenes Layout-Padding. Das erfüllt die gewünschte mobile Geometrie — Abstand oberhalb der ersten sichtbaren Region, seitlich entlang aller Regionen und unterhalb der letzten — ohne die jeweils erste oder letzte Region per Selektor ermitteln zu müssen.

Slot-Zuordnung, TypeScript, Shadow-DOM-Struktur, Registrierung von `tj-responsive`, Dependencies, Section-Rhythmus bleiben unverändert. Zusätzliche optionale Main-Helper ergänzen die Text- und vertikale Inhaltsausrichtung. Das interne CSS blendet einen vollständig leeren Wrapper und einen verwaisten Spaltentrenner aus.

## § 2 Geprüfter Bestand und Ursache

### § 2.1 Nextrap

Quellstand: [nextrap-monorepo, 91442b72d89329adf362935d77ad883ea5ab9de2](https://github.com/nextrap/nextrap-monorepo/tree/91442b72d89329adf362935d77ad883ea5ab9de2).

| Datei unter `nextrap-layout/ntl-2col/` | Befund |
|---|---|
| [src/components/ntl-2col/ntl-2col.ts](https://github.com/nextrap/nextrap-monorepo/blob/91442b72d89329adf362935d77ad883ea5ab9de2/nextrap-layout/ntl-2col/src/components/ntl-2col/ntl-2col.ts) | Wrapper enthält Top, Main, Aside, Bottom; Header/Footer sind Geschwister. Main ist der unbenannte Slot. |
| [src/components/ntl-2col/ntl-2col.scss](https://github.com/nextrap/nextrap-monorepo/blob/91442b72d89329adf362935d77ad883ea5ab9de2/nextrap-layout/ntl-2col/src/components/ntl-2col/ntl-2col.scss) | Flex-Layout, mobil Spalte, Desktop Zeile mit Wrap; Top/Bottom volle Breite. Regionen mit direktem `.slot-empty` werden ausgeblendet. |
| [src/scss/_default-style.scss](https://github.com/nextrap/nextrap-monorepo/blob/91442b72d89329adf362935d77ad883ea5ab9de2/nextrap-layout/ntl-2col/src/scss/_default-style.scss) | Mixin setzt `--gap`, überschreibt am Wrapper aber `gap` mit `var(--inner-padding)`. Main erhält rundum Padding; Top ohne unteres, Bottom ohne oberes Padding; Aside bei `:has(.aside:not(.p-0))` rundum. |
| [src/scss/_with-modifier-classes.scss](https://github.com/nextrap/nextrap-monorepo/blob/91442b72d89329adf362935d77ad883ea5ab9de2/nextrap-layout/ntl-2col/src/scss/_with-modifier-classes.scss) | `.reverse` verändert mobil Order und Desktop die Flex-Richtung; `.reverse-desktop` nur Desktop. |
| [src/scss/_with-alternating.scss](https://github.com/nextrap/nextrap-monorepo/blob/91442b72d89329adf362935d77ad883ea5ab9de2/nextrap-layout/ntl-2col/src/scss/_with-alternating.scss) | Ändert auf Desktop bei `:nth-of-type(even)` die Order von Main und Aside. Eigenständiges Mixin, nicht automatisch als Klasse im Modifier-Mixin registriert. |

Mit `P = --inner-padding` beträgt der Abstand zwischen Main und explizit gepolstertem Aside derzeit `P + P + P = 3P`: zwei Slot-Paddings plus Wrapper-Gap. Auch Top–Main und Main–Bottom addieren einen inneren Main-Padding-Anteil zum Gap. Automatische Bild-Asides haben andere Padding-Regeln, wodurch das Ergebnis zusätzlich vom Inhalt abhängt.

Die Kommentare im Default-Mixin bezeichnen die aktuelle Logik als geprüft. Bei der späteren Umsetzung müssen diese Kommentare zusammen mit dem Verhalten geändert und sämtliche Slot-Kombinationen erneut geprüft werden.

### § 2.2 ThemeJS2: Osman und Müller

Quellstand: [themejs2, e14f0d79d098f9e14fbe5d4f7d0124e96565892a](https://github.com/leuffen/themejs2/tree/e14f0d79d098f9e14fbe5d4f7d0124e96565892a). Untersucht wurden die öffentlichen Theme-Dateien und Demo-Seiten, keine privaten Kundenprojekte.

| Datei unter `theme/` | Relevantes Verhalten |
|---|---|
| [osman/elements/ntl-2col/_style-default.scss](https://github.com/leuffen/themejs2/blob/e14f0d79d098f9e14fbe5d4f7d0124e96565892a/theme/osman/elements/ntl-2col/_style-default.scss) | Gap als `clamp(1.75rem, 3vw, 3.5rem)`, mobil `1.25rem`; diese Werte steuern im Bestand nicht den tatsächlichen Wrapper-Gap. Zusätzlich Wrapper-`padding-block`; mobile Auto-Bilder vor Main; Desktop-Text-Aside mit linkem Padding und Border. |
| [osman/elements/ntl-2col/_reverse.scss](https://github.com/leuffen/themejs2/blob/e14f0d79d098f9e14fbe5d4f7d0124e96565892a/theme/osman/elements/ntl-2col/_reverse.scss) | Tauscht bei `.reverse` Aside-Padding und Border links/rechts. Deckt die übrigen Umkehrwege nicht allgemein ab. |
| [osman/elements/ntl-2col/_with-bg-primary.scss](https://github.com/leuffen/themejs2/blob/e14f0d79d098f9e14fbe5d4f7d0124e96565892a/theme/osman/elements/ntl-2col/_with-bg-primary.scss) | Nutzt Divider-Mixin und eigenes Aside-Padding; Position des Pseudo-Dividers folgt unter anderem `.reverse`. |
| [mueller/elements/ntl-2col/_style-default.scss](https://github.com/leuffen/themejs2/blob/e14f0d79d098f9e14fbe5d4f7d0124e96565892a/theme/mueller/elements/ntl-2col/_style-default.scss) | `$gap: 0`, Padding mobil `--nt-space-4`, Desktop `--nt-space-6`; Border und Wrapper-Hintergrund; Auto-Bild ohne allgemeines Aside-Padding. |
| [mueller/elements/ntl-2col/_style-testimonial.scss](https://github.com/leuffen/themejs2/blob/e14f0d79d098f9e14fbe5d4f7d0124e96565892a/theme/mueller/elements/ntl-2col/_style-testimonial.scss) | Zusätzliches Wrapper- und Aside-Padding, feste Bildgrößen, eigene Order; mobil überstehendes Bild mit Transform und negativer Margin. Bewusste Sonderkomposition. |
| [unify/upstream-proposal/ntl-2col/_with-wrapper-gap.scss](https://github.com/leuffen/themejs2/blob/e14f0d79d098f9e14fbe5d4f7d0124e96565892a/theme/unify/upstream-proposal/ntl-2col/_with-wrapper-gap.scss) | Bereits vorhandener lokaler Vorschlag setzt `gap: var(--gap)`; korrigiert allein jedoch nicht die addierten Slot-Paddings. |

Die Verwendung ist in [osman-start.md](https://github.com/leuffen/themejs2/blob/e14f0d79d098f9e14fbe5d4f7d0124e96565892a/docs/pages/theme-osman/osman-start.md) und [mueller-start.md](https://github.com/leuffen/themejs2/blob/e14f0d79d098f9e14fbe5d4f7d0124e96565892a/docs/pages/theme-mueller/mueller-start.md) belegt: Main-only, automatische Bilder, explizite Aside-Inhalte, Reverse, Top-Inhalte und bei Müller Testimonial. Die jeweiligen `*-default.md`-Seiten liefern zusätzlich Main-only-Beispiele.

## § 3 Verantwortlichkeiten und Geometrie

| Ebene | Verantwortung |
|---|---|
| Umgebender Content-Container | Abstand zu anderen Sections, vorhandener `--nt-spacing-section`-Rhythmus |
| Header/Footer | Eigene Darstellung außerhalb des inneren Rahmens |
| Wrapper | Border, Radius, Hintergrund, Außen-Innenabstand `--inner-padding`, Gap `--gap` |
| Top/Main/Aside/Bottom | Inhalt und vorhandene funktionale Breite/Order, kein zusätzliches Layout-Padding |
| Inhalt innerhalb eines Slots | Eigener typografischer Rhythmus; keine zufälligen zusätzlichen Rand-Margins für das Layout |

`--inner-padding` bleibt der Abstand von der inneren Borderkante zur nächsten Region. `--gap` ist unabhängig davon der Abstand zwischen Regionen; sollen beide gleich sein, setzt das Theme beide auf denselben Token. Unterschiedliche Werte und `0` sind gültige Konfigurationen.

Mobil: Jede sichtbare Region erhält dieselbe verfügbare Breite innerhalb des gepolsterten Wrappers. Es entsteht genau ein oberer und ein unterer Randabstand. Das erste sichtbare Element benötigt selbst kein `padding-top`, weil der Wrapper diesen Abstand bereits bereitstellt.

Desktop: Top/Bottom nehmen die volle innere Wrapperbreite ein. Main und Aside liegen mit genau einem horizontalen Gap nebeneinander. Wenn nur Main vorhanden ist, füllt es den inneren Wrapper; das Wrapper-Padding liefert alle vier Außenkanten. Auch Aside-only und Top-/Bottom-only sind abzudecken.

Messbeispiel ohne Inhalts-Margins, Border separat gerechnet: Bei `P = 24px` und `G = 16px` sind es außen jeweils 24px und zwischen Regionen 16px. Für eine mobile Folge aus `n` sichtbaren Regionen gilt: Gesamthöhe ohne Border = Summe der Regionshöhen + `2P + (n - 1)G`.

## § 4 Vorgeschlagene SCSS-Änderung und Einführung

### § 4.1 Zunächst explizit aktivierbares Mixin [gelöscht]

### § 4.2 Direkte Default-Umstellung

`default-style()` setzt unmittelbar `padding: var(--inner-padding)` und `gap: var(--gap)` am Wrapper. Die bisherigen Main-/Top-/Bottom-/Aside-Paddings einschließlich des spezifischen `.aside`-Selektors entfallen. Die vier Regions-Parts erhalten `padding: 0`. Die Parameter `$innerPadding` und `$gap` bleiben erhalten und wirken unabhängig; andere Baseline-Parameter bleiben unverändert.

Es gibt keinen Kompatibilitätsmodus, keinen Übergangs-Export und keine zweite Spacing-Implementierung. ThemeJS2 wird direkt auf diesen Contract angepasst.

### § 4.3 Kein Positionsalgorithmus für Padding

Kein `:first-child`, `:last-child` oder Light-DOM-`:has(.top)` zur Ermittlung der Außenkanten: DOM-Reihenfolge, visuelle Order, automatische Slot-Zuordnung und Slot-Leerzustand sind verschiedene Dinge. Ein Theme kann den internen Slot-Leerzustand außerdem nicht durch Verkettung von `::part(...)` mit beliebigen Shadow-DOM-Nachfahren abfragen. Der Wrapper funktioniert unabhängig davon.

Das bestehende Flex-Layout zunächst beibehalten. Ein Wechsel auf Grid oder eine neue Auslegung von `--cols` gehört nicht in den Spacing-Fix. Desktop-Main verwendet aktuell einen Anteil der verfügbaren Breite, Aside den Rest nach Gap; das bedeutet nicht automatisch zwei gleich breite Spalten bei `--cols: 6`. Bei großen Gaps und extremen Spaltenwerten ist verbleibender Platz zu prüfen, ohne diesen API-Vertrag stillschweigend neu zu definieren.

### § 4.4 Modusspezifische Reverse-Mixins

`with-mobile-reverse()` ändert nur unter `[mode='mobile']` die Main-/Aside-Order. `with-desktop-reverse()` setzt nur unter `[mode='desktop']` die umgekehrte Flex-Richtung. `with-reverse()` kombiniert beide. Die vorhandenen Modifier-Klassen verwenden diese Mixins; `.reverse-mobile` ergänzt `.reverse-desktop` und `.reverse`. Beide neuen Mixins werden über `index.scss` exportiert, ohne CSS beim Import auszugeben.

Der dekorative Divider nutzt pro Instanz zurückgesetzte interne Richtungsfaktoren aus den äußeren Mixins. Flex-Umkehr und Alternating multiplizieren sich; zwei Umkehrungen ergeben wieder die Ausgangsseite. Der Divider liegt absolut im Gap, beansprucht keinen Platz und hat bei Gap null keine sichtbare Border.

## § 5 Reverse, Alternating und Slot-Verfügbarkeit

| Zustand | Erwartung |
|---|---|
| Standard mobil | Top → Main → Aside → Bottom, nur belegte Regionen |
| `.reverse` mobil | Top → Aside → Main → Bottom |
| Osman mit Auto-Bild mobil | Bild-Aside vor Main; identische Außenabstände |
| `.reverse-desktop` mobil | Reihenfolge bleibt durch diesen Modifier unverändert |
| Standard Desktop | Top volle Breite, Main links und Aside rechts, Bottom volle Breite |
| Reverse Desktop | Main/Aside vertauscht; Top/Bottom bleiben volle Breite |
| `with-alternating()` Desktop | Bestehende Even-Order bleibt erhalten; beide Außenkanten unverändert |
| Kombination Reverse + Alternating | Ergebnis aus Flex-Richtung und Order prüfen; Padding bleibt immer am Wrapper |
| Dynamische Slot-Belegung | Nach Aktualisierung der vorhandenen Slot-Sichtbarkeit nur Gaps zwischen sichtbaren Regionen |

Die bestehenden zusätzlichen Klassen `mobile-reverse` und `desktop-reverse` aus dem internen Layout sind ebenfalls als Regression abzudecken. Sie nicht ungeprüft mit den öffentlichen Modifier-Namen `reverse-desktop` beziehungsweise `reverse` gleichsetzen.

Sind alle vier inneren Slots leer, wird der gesamte Wrapper über den vorhandenen `.slot-empty`-Zustand ausgeblendet. Header/Footer bleiben sichtbar. Ohne Main wird der Aside-Spaltentrenner ausgeblendet. Änderungen der Slot-Belegung werden durch die vorhandene SlotVisibility-Logik berücksichtigt.

## § 6 Konkrete Theme-Migration

### § 6.1 Osman

`theme/osman/elements/ntl-2col/_style-default.scss`: Das bisherige zusätzliche Wrapper-`padding-block` entfällt. `--inner-padding: var(--nt-spacing-text)` und die vorhandenen responsiven Gap-Werte bleiben getrennt; erstmals bestimmen `clamp(...)` beziehungsweise mobil `1.25rem` den tatsächlichen Gap.

Die seitlichen Padding-Zugaben für Text-Aside aus Default, Reverse und `_with-bg-primary.scss` entfernen. Automatische Bildreihenfolge, Bildformat und Min-Height bleiben erhalten. Das eigenständige Footer-Padding liegt außerhalb dieses Vertrags und bleibt separat.

Der vorhandene gemeinsame Divider wird auch für den Text-Aside verwendet, mit `$background: null` zur Erhaltung der Section-Fläche. Er liegt ohne zusätzlichen Padding-Anteil im Gap und folgt derselben Richtungslogik wie die Spalten. Die bisherigen lokalen Reverse-/Divider-Korrekturen entfallen.

### § 6.2 Müller Default

`theme/mueller/elements/ntl-2col/_style-default.scss`: Die bestehenden Padding-Tokens `--nt-space-4` mobil und `--nt-space-6` Desktop werden zu den einmaligen Wrapper-Abständen. Der gewünschte sichtbare Zwischenraum wird direkt mit `$gap: var(--nt-spacing-layout)` gesetzt.

Die aktuelle Angabe `$gap: 0` wird nach der Korrektur tatsächlich null. Für den hier gewünschten sichtbaren Zwischenraum lautet der Vorschlag deshalb ausdrücklich `$gap: var(--nt-spacing-layout)`. Das ist eine bewusste Theme-Entscheidung; bei einer gewünschten nahtlosen Komposition ist `0` weiterhin korrekt. Nicht versuchen, einen gewünschten Gap durch Slot-Padding zu simulieren.

Auto-Bilder erhalten durch das Wrapper-Padding nun auch einen Abstand zum Rahmen. Für die normale gerahmte Variante entspricht dies dem Ziel. Ein absichtlich bis zum Rand reichendes Bild braucht eine separat geprüfte, explizite Komposition; die automatische Bildzuordnung oder ein `.p-0` im Inhalt darf nicht implizit den gemeinsamen Außenabstand entfernen.

### § 6.3 Müller Testimonial und Breakouts

Auch das Testimonial nutzt sofort die neue Baseline. Zusätzliches Aside-Padding und redundantes Wrapper-Block-Padding entfallen. Der ausdrücklich komponierte mobile Bildüberstand einschließlich Transform, negativer Margin und offenem oberen Wrapper bleibt erhalten; er ist eine visuelle Sonderkomposition und keine Transition.

`with-breakout-start()` und `with-breakout-end()` verwenden eigene Desktop-Breitenberechnungen. Für sie Wrapper-Padding, verfügbare Restbreite, Viewport-Überstand und Gegenkante gesondert messen. Die normale eingerückte Baseline ist keine implizite Zusage für randlose Breakout-Medien.

### § 6.4 Migration im Überblick

| Old | New |
|---|---|
| Wrapper-Gap = `--inner-padding` | Wrapper-Gap = `--gap` |
| Regions-Padding plus Gap | Ein Wrapper-Padding plus Gap |
| Positionsabhängige äußere Padding-Kanten | Positionsunabhängige Wrapper-Kanten |
| `.aside` entscheidet über Layout-Padding | Alle vier Regionen ohne eigenes Layout-Padding |
| Osman Aside-Padding als Divider-Abstand | Divider dekorativ innerhalb des Gaps |
| Müller `$gap: 0` mit dennoch sichtbarem Zwischenraum | Expliziter Gap-Token oder bewusst echter Null-Gap |
| Implizit randlose Auto-Bilder | Normal eingerückt; randlose Komposition separat |

## § 7 Umsetzungsdateien

Nextrap ändert die Default-Baseline, die funktionalen Leerzustände, Reverse-/Alternating-/Divider-Mixins, den Sass-Export, Demo und API-Dokumentation. Die neuen Dateien `_with-mobile-reverse.scss` und `_with-desktop-reverse.scss` kapseln die beiden Modi. Der Browser-Test `tests/spacing.browser.mjs` und `.github/workflows/ntl-2col-spacing.yml` sichern den Abstandsvertrag ab.

ThemeJS2 passt die fünf vorhandenen Osman-/Müller-Dateien `_style-default.scss`, `_reverse.scss`, `_with-bg-primary.scss` beziehungsweise `_style-default.scss` und `_style-testimonial.scss` direkt an. Kein Opt-in-Mixin wird angelegt.

`default-style()` registriert alle öffentlichen Feature-Helper unter dem aktuellen Style-Selektor; `$modifierClasses: false` oder `none` schaltet diese Registrierung ab. `.with-alternating` und beide `.with-*-reverse` sind ohne zusätzliche Theme-Bindung verfügbar. `_with-main-align.scss` exportiert `with-main-text-align($align: start)` und `with-main-justify($justify: center)`; ihre Klassen decken links/mitte/rechts/Blocksatz/start/end sowie oben/mitte/unten ab.

Raven in ThemeJS2 übernimmt den Wrapper-Vertrag in Default, Form, Card und Hero. Hero-Regions-Padding wandert in den Wrapper; Card nutzt den gemeinsamen Padding-Token statt lokaler Padding-Regeln. Die automatische Helper-Registrierung gilt in jedem dieser Styles.

## § 8 Akzeptanz- und Prüfkriterien

1. Alle 15 nichtleeren Belegungen der vier inneren Regionen in Mobile und Desktop prüfen. Dazu den vollständig leeren Wrapper mit Header/Footer-only separat prüfen.
2. Jeweils Standard, Reverse, Reverse-desktop, bestehende interne Reverse-Zustände sowie gerade/ungerade Alternating-Fälle und kombinierte Umkehrung abdecken.
3. Mit unabhängigen Werten `P = 24px`, `G = 16px` und zusätzlich `G = 0` messen: Abstand von der inneren Borderkante zur äußeren Regionskante genau P; Abstand benachbarter Regionsboxen genau G, abgesehen von Rundung unter 1px.
4. Automatische Bild-Asides, explizite `.aside`, explizite Slot-Attribute ohne `.aside`, `.aside.p-0`, Top/Bottom und dynamisches Hinzufügen/Entfernen von Slot-Inhalt abdecken.
5. Top/Bottom bleiben volle innere Breite; Header/Footer werden nicht eingerückt oder in die Spalten verschoben. Main-only erhält vier Außenabstände und keine Phantom-Gaps.
6. Testinhalte ohne äußere Margins verwenden, damit Layout-Geometrie eindeutig messbar ist. Anschließend echte Theme-Inhalte mit Überschriften, Absätzen, Bildern und verschachtelten Komponenten prüfen: deren eigene Rand-Margins können sonst optisch zusätzliche Abstände erzeugen und müssen am jeweils zuständigen Inhalts-/Typografie-Vertrag bewertet werden.
7. Große und kleine Gaps, `--cols`-Werte, lange untrennbare Inhalte und schmale Desktop-Container auf unerwünschtes Wrapping/Overflow prüfen. Breakout-/Sticky-/Divider-/Testimonial-Fälle separat vergleichen.
8. Sass-Compile der Default-Baseline und beider neuen Reverse-Mixins sowie im verschachtelten Theme-Scope prüfen; ein reiner `@use` des Entrypoints darf kein CSS ausgeben. Bestehende Demos und fokussierte Browser-Geometriemessungen verwenden; anschließend den relevanten Package-/Theme-Build ausführen.

## § 9 Prüfstand und Veröffentlichung

Die Ursachenanalyse wurde gegen die Quellen aus § 2 abgeglichen. Default, Divider, Reverse-API sowie Osman-/Müller-/Raven-SCSS lassen sich mit dem JavaScript-Sass-Compiler kompilieren; der reine API-Import erzeugt kein CSS. Der Browser-Regressionstest prüft 2.304 Layoutkombinationen und 36 Main-Ausrichtungen sowie dynamische Slot-Belegung und ist zusätzlich in der CI registriert. Der tatsächliche Laufstatus wird in den PRs dokumentiert.

Der Package-Build einschließlich TypeScript-Deklarationen ist mit Vite und JavaScript-Sass erfolgreich. Die reguläre Nx-/Dart-Sass-Ausführung und der Chromium-Start sind in der lokalen Laufzeit blockiert. ThemeJS2s vollständiger Standard-Build ist zusätzlich durch die nicht veröffentlichte konfigurierte Abhängigkeit `@leuffen/vite-jekyll-hmr-manager@^1.0.1` blockiert. Diese bestehenden Infrastruktur-/Dependency-Probleme werden nicht durch einen lokalen Theme-Hack oder eine Übergangslösung umgangen.

Der ThemeJS2-PR setzt die veröffentlichte Nextrap-Endfassung aus dem verknüpften PR voraus. Bis diese verfügbar ist, kann ein CI-Build mit der bisherigen npm-Version nicht als Prüfung der neuen gemeinsamen Baseline gewertet werden. Es werden keine Releases oder produktiven Deployments manuell ausgelöst.

## § 10 Vereinfachungsvorschlag: Außenkanten direkt einrücken

### § 10.1 Status und aktueller Stand

Stand 2026-09-11: Neuer Alternativvorschlag zur Diskussion; keine implementierte Layout-Änderung. §§ 1–9 halten den bisherigen Wrapper-Vertrag und dessen Umsetzung fest. Dieser Abschnitt schlägt vor, seinen Padding-Eigentümer zu ändern und den visuellen Vertrag aus genau einem Außenabstand und genau einem Gap zu erhalten. Gemeinsames Prinzip und Card-Entwurf stehen in [NTE-Card § 9](2026-09-10-nte-card-wrapper-spacing.md#-9-vereinfachungsvorschlag-positive-einrückungen-statt-bleed-verrechnung).

Bezugsstand: [9596b3b31fed96b67177a38b1b7bab7caf33a739](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-layout/ntl-2col/src/scss/_default-style.scss). Der Default setzt `padding: var(--inner-padding)`, `gap: var(--gap)`, Border, Radius und `overflow: hidden` am Wrapper. Top/Main/Aside/Bottom haben kein eigenes Padding. Header/Footer stehen außerhalb dieses Rahmens. Das entspricht bereits der gewünschten normalen Abstandsgeometrie.

`with-media-frame(false)` erkennt einzelne Medien in Top/Aside, setzt ihre Füllgeometrie und erweitert sie mit negativen Margins bis an den Rahmen. Top/Mobile erhalten zusätzlich `width: calc(100% + 2 * P)`; Aside erhält Desktop-Flexbasis-Korrekturen und berechnete Richtungsfaktoren. Ob Blockkanten außen liegen, wird über zusätzliche Light-DOM-Selektoren und eine Liste von Reverse-/Auto-Bild-Zuständen bestimmt. `with-media-frame(true)` erzeugt dagegen keine Regeln. Der Name mit invertiertem Default erschwert zusätzlich das Verständnis.

Quellen: [Default](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-layout/ntl-2col/src/scss/_default-style.scss), [Medien-Mixin](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-layout/ntl-2col/src/scss/_with-media-frame.scss), [funktionales Layout](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-layout/ntl-2col/src/components/ntl-2col/ntl-2col.scss), [Auto-Bild/Order](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-layout/ntl-2col/src/scss/_with-image-auto-objectfit.scss), [Breakout](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-layout/ntl-2col/src/scss/_with-breakout-start.scss), [Sticky](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-layout/ntl-2col/src/scss/_with-main-sticky-top.scss), [Browser-Test](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-layout/ntl-2col/tests/spacing.browser.mjs).

### § 10.2 Konkrete Schwachstellen und Prüflücken

| Fall | Quellbefund und mögliche Folge |
|---|---|
| Main besteht ausschließlich aus einem Textknoten | Die `:has(> ...)`-Belegungsprüfung des Medien-Mixins sieht Elemente, keine Textknoten. Ein vorhandener Default-Slot kann als nicht vorhanden gelten; bei vorangestelltem mobilem Aside kann dessen untere negative Margin den inneren Gap verkleinern. Statisch hergeleiteter Verdachtsfall, nicht im Browser reproduziert. |
| Direkt komponiertes Reverse-Mixin auf eigener Theme-Klasse | Die mobile First-Erkennung listet konkrete Klassen plus Auto-Bilder auf. Ein Theme, das die Order über dieselbe Sass-API unter anderem Selektor setzt, muss nicht in diese Liste passen. Layout und Bleed können unterschiedliche Außenkanten annehmen. |
| Absatz mit Bild und zusätzlichem Text | `img:only-child` schließt weitere Element-Geschwister aus, aber keine Text-Geschwister. Der Kommentar verspricht mehr als dieser Selektor prüft; gemischter Text-/Bildinhalt kann als reines randloses Medium behandelt werden. |
| Implizite oder dynamische Slot-Zuordnung | Funktionaler Slot-Leerzustand und Light-DOM-Heuristik sind zwei getrennte Wahrheiten. Änderungen müssen beide Logiken treffen. |
| Breakout + Media + Reverse | Richtungsfaktoren, zusätzliche Breite und Flexbasis hängen zusammen. Aus einem lokal plausiblen Margin-Fix folgt keine Zusage für alle Kombinationen. |
| Rundungen und Bedienelemente | Rechteckmessungen prüfen weder sichtbare Ecken noch abgeschnittene Fokusumrisse oder Popup-Inhalte. |

Der bestehende Browser-Test enthält echte Medienhosts, Slot-Kombinationen und Reverse-Varianten. Seine Medienfälle setzen Main jedoch als Element an; reine Textknoten werden separat nur in der normalen Baseline getestet. Direkt eingebundene Reverse-Mixins werden ebenfalls in der Baseline, nicht in der Medienmatrix geprüft. Ein Bildabsatz mit zusätzlichem Textknoten und die visuelle Radius-/Fokus-Abnahme fehlen als gezielte Fälle. Die Tabelle beschreibt deshalb Risiken und konkrete Testlücken, keine behauptete vollständige Fehlerreproduktion.

### § 10.3 Empfehlung: Layout entscheidet die Kante, Region entscheidet den Abstand

Der Wrapper bleibt Rahmen, Hintergrund, Radius und Gap-Eigentümer, trägt aber kein Padding. Die Regionsboxen erhalten positive Margins nur an ihren äußeren Rahmenkanten. Ein randloses Medium setzt seine gewünschten Insets auf null. Die inneren Main-/Aside-Kanten haben immer null Margin, damit zwischen ihnen exakt G verbleibt. Header/Footer werden nicht in dieses Modell einbezogen.

| Verantwortung | Ort |
|---|---|
| Welche Slots tatsächlich belegt sind | Vorhandene SlotVisibility-/Slotchange-Auswertung |
| Mode, Main-/Aside-Anordnung, erste/letzte belegte Zeile | Zusammenhängende Layout-Regeln einschließlich Reverse/Alternating |
| Ob eine Region Abstand zum Rahmen benötigt | Expliziter Region-Helper auf dem Host bzw. Theme-Mixin |
| Bildfläche ausfüllen, Object-Fit, Consent-Inhalt | Medien-/Komponenten-Styling |
| Radius, Border, gemeinsames Clipping | Äußerer Wrapper |

Das Medium kennt weder Nachbar-Slots noch Reverse-Klassennamen, Flexbasis oder Wrapper-Padding. Es wählt lediglich seine Region und optional logische Kanten. Das Layout darf dafür weiterhin Zustandsregeln haben; sie werden gemeinsam mit seiner Order gepflegt. Weniger Zeilen allein wären kein Gewinn, wenn dieselbe Positionsmatrix nur in JavaScript oder ein universelles Meta-Mixin verschoben würde.

### § 10.4 Außenkanten als überprüfbare Tabelle

| Anordnung | Außenkanten mit normalem Inset P |
|---|---|
| Mobil | Jede Region inline-start/end; erste sichtbare Region block-start; letzte block-end |
| Desktop: Top/Bottom | Beide Inline-Kanten; Top oben, Bottom unten, sofern jeweils äußere Zeile |
| Desktop: Main links / Aside rechts | Main inline-start; Aside inline-end; innere Spaltenkanten immer 0 |
| Desktop: Main rechts / Aside links | Main inline-end; Aside inline-start; innere Spaltenkanten immer 0 |
| Desktop: Main-/Aside-Zeile ohne Top bzw. Bottom | Beide Regionen an block-start bzw. block-end außen |
| Nur eine Region | Alle vier Kanten |
| Keine innere Region | Wrapper ausgeblendet |

Die Tabelle wird aus tatsächlicher Belegung und derselben Anordnung wie das Layout ausgewertet, nicht aus dem Namen der Klasse, die einen Reverse-Mixin zufällig eingebunden hat. Nicht jedes CSS-`order` eines fremden Themes kann automatisch erkannt werden. Eine eigene Anordnung braucht einen eigenen Layout-Adapter; DOM-Reihenfolge und visuelle Reihenfolge sind ausdrücklich verschieden.

### § 10.5 Umsetzungsskizze und Breitenvertrag

Als erster Prototyp sollte das vorhandene Flex-Layout erhalten bleiben. Positive Regions-Margins verlangen eine gezielte Anpassung seiner Breiten: Die jetzigen `width: 100%` und prozentualen Flexbasen dürfen nicht unverändert plus Margins weiterlaufen. Ein Wechsel auf Grid ist für diese Vereinfachung nicht zwingend erforderlich und würde weitere Verträge berühren.

Mit W als Wrapper-Innenbreite ohne Border, P als normalem Inset und c = `--cols / 12` bleibt die normale Main-Inhaltsbreite `(W - 2P) * c`. Im ungepolsterten Wrapper muss die entsprechende Flexbasis daher auf `calc((100% - 2 * var(--inner-padding)) * var(--cols) / 12)` bezogen werden. Aside erhält den Rest nach Main, G und den tatsächlich gesetzten Außen-Margins. Fällt allein die äußere Aside-Margin weg, wächst Aside um P; Main und seine innere Gap-Kante bleiben an derselben Stelle. Main-only benötigt weiterhin den vorhandenen gesonderten Vollbreitenfall.

Top/Bottom und mobile Vollbreitenregionen verwenden die verbleibende Breite nach ihren positiven Inline-Margins, etwa `calc(100% - var(--_inset-inline-start) - var(--_inset-inline-end))`, statt zunächst 100% festzulegen und danach über negative Ränder zu vergrößern. Die konkreten internen Namen sind Entwurfsnamen, keine neue freigegebene API. Für kleine W und extreme `--cols` muss der Prototyp bestehendes Wrapping und Mindestbreiten prüfen; diese Rechnung ersetzt keine Browserabnahme.

Der Theme-Helper soll im Ziel nur Werte auf dem ausgewählten Part setzen. Schematischer Kern, der die vollständige Layout-Baseline und deren Kantenkarte voraussetzt:

```scss
// Konfiguriert randlosen Aside; nur vom Layout als außen bestimmte Kanten konsumieren diese Werte.
@mixin with-aside-bleed() {
  &::part(aside) {
    --_inset-inline-start: 0px;
    --_inset-inline-end: 0px;
    --_inset-block-start: 0px;
    --_inset-block-end: 0px;
  }
}
```

Die Baseline initialisiert diese Werte pro Region/Instanz; Default-Inset ist P, innere Margins bleiben unabhängig davon null. Dadurch ist der Modifier klein, ohne dass er nachträglich Width/Flexbasis oder den Wrapper korrigieren muss. Eine vollständige Implementierung muss zwischen konfigurierten Insets und tatsächlich äußeren Kanten unterscheiden; der Ausschnitt allein ist nicht ausführbar als Ersatz für `with-media-frame()`.

Der vorhandene Media-Helper kann als kompatible Komposition erhalten bleiben: Medienzuordnung, Füllverhalten und Inset-Konfiguration werden getrennt. Neue Verwendung sollte ausdrücklich eine Region wählen, beispielsweise ein vorgeschlagenes `with-region-bleed(aside)` oder eine `with-aside-bleed`-Klasse. Namen und Exporte sind noch zu entscheiden. Keine öffentliche API ersatzlos entfernen und keine automatische Medienerkennung stillschweigend abschalten.

Für belastbare Belegung gibt es zwei Wege: intern den vorhandenen Slot-Leerzustand direkt verwenden oder wie bei der Card einen abgeleiteten Host-Zustand anbieten. Letzteres benötigt eine separat zu prüfende TypeScript-/API-Änderung; im Proposal wird kein solcher Zustand implementiert. Ein Textknoten darf in beiden Fällen nicht durch einen Elementselektor ersetzt werden.

### § 10.6 Border-Radius, Bilder und Sonderkomponenten

Randlose Medien reichen bis zur inneren Rahmenkante; der Wrapper beschneidet die gemeinsame Außenkontur. Bei einem rechten Aside sind nur dessen äußere rechte Ecken Karten-/Layout-Ecken, bei Reverse die linken. Das Wrapper-Clipping erledigt diese Geometrie ohne Radius-Kopie und ohne spezielle Border-Radius-Regeln pro Reverse-Zustand. Ein innen liegendes Top-/Aside-Ende bekommt dadurch keine künstliche Rundung zum Gap.

`nte-image`, `nte-consent-blocker`, Avatare und sonstige gerundete Kindkomponenten können eigene Rahmen, Radien und Overflow-Regeln besitzen. Ein äußerer Wrapper kann eine bereits im Kind abgeschnittene Fläche nicht wieder auffüllen. Deshalb beim Pairing entscheiden, ob ein Medium eine eigene Karte oder Teil der gemeinsamen Fläche ist; innere Parts nur über deren öffentliche Styling-Oberfläche konfigurieren. Randlose Textflächen behalten gegebenenfalls eigenes Inhaltspadding, damit große Ecken keine Inhalte abschneiden.

`overflow: hidden` kann Fokusumrisse und Menüs abschneiden und beeinflusst Scrollcontainer-/Sticky-Verhalten. Das bestehende Sticky-Mixin setzt bereits `overflow: clip` am Wrapper. Diese gezielte Entscheidung erhalten und testen; kein pauschaler globaler Overflow-Wechsel als Teil des Spacing-Vorschlags. Breakouts und bewusst überstehende Testimonial-Bilder benötigen weiterhin eine explizite Clipping-Komposition.

### § 10.7 Alternativen und Entscheidungskriterium

| Alternative | Bewertung |
|---|---|
| Bisheriges Bleed nur auf mehrere kleinere Dateien verteilen | Kleinerer sichtbarer Mixin, aber weiterhin negative Margins, Breitenkorrekturen und doppelte Zustandserkennung |
| Alle Regionsinhalte mit Padding P versehen | Einfach, aber verletzt den gewünschten reinen Gap zwischen Inhalten |
| Ein einziges Grid für alle Layouts, Slots und Medienvarianten | Kann Außen-/Inhaltstracks explizit ausdrücken; ändert jedoch Spalten-, Flexgrow-, Overlay- und Theme-Verträge; kein kostenloser Ersatz |
| Positive Insets ausschließlich an Außenkanten | Empfohlen: erklärt den Zielabstand direkt; Positionslogik bleibt im zuständigen Layout |

Eine absolute Zusage „alle Mixins werden kürzer“ wäre vor dem Prototyp nicht seriös. Erfolgsmaßstab: Der Medien-Modifier enthält keine Breiten-/Flexkorrektur, keine negative Margin und keine eigene Reverse-/Belegungsabfrage mehr; die gesamte CSS-/Zustandsmenge samt Layout-Adapter wird vor/nach verglichen. Bleibt die Gesamtkomplexität gleich oder wächst sie deutlich, sollte der bestehende Wrapper-Ansatz erhalten und nur die nachgewiesene Doppelung der Zustandserkennung korrigiert werden.

### § 10.8 Migration und Prüfplan

| Old | New |
|---|---|
| Wrapper-Padding plus herausgezogene Medien | Ungepolsterter Wrapper plus positive Regions-Inset-Margins |
| Heuristische Main-/Top-/Bottom-Erkennung im Medien-Mixin | Tatsächlicher Slotzustand in einer Layout-Kantenkarte |
| Reverse-Klassenliste im Medien-Mixin | Kantenkarte zusammen mit der tatsächlichen Layout-Anordnung |
| Media-Helper mit Object-Fit, Erkennung und Geometriekorrektur | Komposition separater Verantwortlichkeiten; bestehende API bleibt erreichbar |

Ein späterer Implementierungs-PR betrifft im Package mindestens Default, Medien-Helper, funktionales Layout, Order-/Reverse-Komposition, Browser-Test und Usage-/Theming-Dokumentation. Neue Part-Properties, mögliche TS-Zustandsänderungen und direkte Theme-Zugriffe auf Wrapper-Padding benötigen dann eine konkrete Entscheidung. ThemeJS2 oder andere Repositories werden durch diesen Proposal-PR nicht geändert.

Die vorhandene Matrix bleibt Ausgangspunkt. Ergänzungen: Medien + Main als reiner Textknoten; Absatz mit Bild und Text; Reverse über direktes Mixin unter eigener Klasse; kombinierte Reverse-/Alternating-/Breakout-Zustände; dynamisch entfernte Slots; P=0/24/48px, G=0/16/40px, sehr kurze Medien und extreme Spaltenwerte. Sichtbare Regionskanten gegen innere Borderkante messen, nicht nur Margin-/Padding-Werte vergleichen. Radius=0/12/48px und Border=0/1/8px separat als Screenshots beurteilen; LTR/RTL, Consent-Bedienung, Bild-Overlays und Sticky mit Tastatur prüfen.

Prüfstand: Statischer Quellen- und Testabgleich durchgeführt. Keine Sass-Kompilierung, kein Package-Build und keine Browser-Geometrieprüfung dieses Alternativentwurfs: Sass fehlt in der lokalen Laufzeit, Playwright-Chromium ist nicht installiert. Die historischen Ergebnisse aus § 9 sind kein Nachweis für diesen Vorschlag.

### § 10.9 Externe Belege

- [CSS Box Alignment: Gaps](https://www.w3.org/TR/css-align-3/#gaps) erklärt die Trennung von Gap und zusätzlichen Boxabständen.
- [CSS Shadow Parts](https://www.w3.org/TR/css-shadow-parts-1/#part) begrenzt strukturelle Selektoren über Shadow-Grenzen; ein Theme kann nicht einfach den ersten sichtbaren internen Part auswählen.
- [CSS Overflow](https://www.w3.org/TR/css-overflow-3/#corner-clipping) beschreibt Clipping und die Interaktion mit Border-Radius.
- [CSS Backgrounds: Corner Shaping](https://www.w3.org/TR/css-backgrounds-3/#corner-shaping) definiert die innere Rahmenkurve. Bei gleichmäßigem Radius R und Border B gilt dort `max(0, R - B)`.

Das sind CSS-Grundlagen; die Empfehlung für Nextrap und die benannten Risiken wurden daraus und aus den verlinkten Repository-Quellen abgeleitet.

## § 10.10 Beauftragte Umsetzung im PR #200

2COL verwendet positive Insets mit dimensionslosen Außenkanten-Masken aus den vorhandenen internen Slot-Leerzuständen. Reverse, Alternating und Auto-Bilder teilen ihre Richtungsinformation mit dieser Kantenkarte. Der Media-Helper konfiguriert Insets und Medienfüllung, ohne eigene Belegungs-/Reverse-Kantenheuristik oder negative Margin. Die Element-/Medienauswahl bleibt kompatibel; zusätzliche Textknoten im Bildabsatz werden von dieser CSS-Auswahl weiterhin nicht sicher erkannt. TypeScript und die Slot-Zuordnung bleiben unverändert. [neu]

Die neue öffentliche API `with-region-inset($region, $space, $edges: all)` setzt normale, große oder einseitige Zielabstände; randlos ist `0px`. Regionen und logische Kantennamen werden geprüft. Die Baseline behält `--inner-padding` und den unabhängigen `--gap`. AI Usage Info und die SVG-Abstandsgrafik dokumentieren Instanz-/Theme-Konfiguration und Migration; für 2COL wurde außerdem der bestehende Theming-Skill ergänzt. [neu]

JavaScript-Sass kompiliert beide Baselines, die Inset-Kantenvarianten und nebenwirkungsfreien Entrypoints. Die Browser-Tests wurden um Sonderabstände, ungepolsterte Wrapper und bei 2COL Main-Textknoten plus direkt komponierte Reverse-Mixins erweitert. Der lokale native Chromium-Prozess startet in dieser Laufzeit nicht; die vorhandenen GitHub-Browser-Workflows prüfen den Commit. Ihr tatsächlicher Ergebnisstand wird in der PR-Beschreibung nachgetragen. Ein erfolgreiches Sass-Ergebnis ersetzt keine visuelle Browser-Abnahme. [neu]
