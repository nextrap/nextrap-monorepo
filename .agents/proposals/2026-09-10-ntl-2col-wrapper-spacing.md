# NTL-2COL: Außenabstand am Wrapper, Zwischenabstand über Gap

| Datum | Benutzername | Kurzbeschreibung |
|---|---|---|
| 2026-09-10 | dermatthes | §§ 1–9: Proposal mit Bestandsanalyse, Styling-Entwurf, Theme-Migration und Abnahmekriterien angelegt |
| 2026-09-10 | dermatthes | §§ 1, 4–9: Direkte Endfassung ohne Transition beauftragt, Reverse-Mixins ergänzt und Umsetzung konkretisiert |

## § 1 Ziel und Scope

Status: Direkte Endfassung beauftragt und im PR implementiert. Keine Transition und kein Opt-in-Mixin; ThemeJS2 erhält die passenden Änderungen in einem separaten PR. [geändert]

Der gemeinsame Rand um `top`, `main`, `aside` und `bottom` erhält genau einen Innenabstand. Zwischen benachbarten Regionen wirkt ausschließlich das konfigurierte Gap. `header` und `footer` bleiben außerhalb dieses Wrappers. Leere Slots erzeugen weder Regionen noch zusätzliche Gaps. Reverse, mobile Bildpriorisierung und Alternating dürfen den Außenabstand nicht beeinflussen.

Empfehlung: Das Layout-Padding vollständig an `::part(wrapper)` verlagern. Die vier inneren Parts erhalten kein eigenes Layout-Padding. Das erfüllt die gewünschte mobile Geometrie — Abstand oberhalb der ersten sichtbaren Region, seitlich entlang aller Regionen und unterhalb der letzten — ohne die jeweils erste oder letzte Region per Selektor ermitteln zu müssen.

Slot-Zuordnung, TypeScript, Shadow-DOM-Struktur, Registrierung von `tj-responsive`, Dependencies, Section-Rhythmus und vertikale Inhaltsausrichtung bleiben unverändert. Das interne CSS blendet einen vollständig leeren Wrapper und einen verwaisten Spaltentrenner aus. [geändert]

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

`default-style()` setzt unmittelbar `padding: var(--inner-padding)` und `gap: var(--gap)` am Wrapper. Die bisherigen Main-/Top-/Bottom-/Aside-Paddings einschließlich des spezifischen `.aside`-Selektors entfallen. Die vier Regions-Parts erhalten `padding: 0`. Die Parameter `$innerPadding` und `$gap` bleiben erhalten und wirken unabhängig; andere Baseline-Parameter bleiben unverändert. [geändert]

Es gibt keinen Kompatibilitätsmodus, keinen Übergangs-Export und keine zweite Spacing-Implementierung. ThemeJS2 wird direkt auf diesen Contract angepasst. [geändert]

### § 4.3 Kein Positionsalgorithmus für Padding

Kein `:first-child`, `:last-child` oder Light-DOM-`:has(.top)` zur Ermittlung der Außenkanten: DOM-Reihenfolge, visuelle Order, automatische Slot-Zuordnung und Slot-Leerzustand sind verschiedene Dinge. Ein Theme kann den internen Slot-Leerzustand außerdem nicht durch Verkettung von `::part(...)` mit beliebigen Shadow-DOM-Nachfahren abfragen. Der Wrapper funktioniert unabhängig davon.

Das bestehende Flex-Layout zunächst beibehalten. Ein Wechsel auf Grid oder eine neue Auslegung von `--cols` gehört nicht in den Spacing-Fix. Desktop-Main verwendet aktuell einen Anteil der verfügbaren Breite, Aside den Rest nach Gap; das bedeutet nicht automatisch zwei gleich breite Spalten bei `--cols: 6`. Bei großen Gaps und extremen Spaltenwerten ist verbleibender Platz zu prüfen, ohne diesen API-Vertrag stillschweigend neu zu definieren.

### § 4.4 Modusspezifische Reverse-Mixins

`with-mobile-reverse()` ändert nur unter `[mode='mobile']` die Main-/Aside-Order. `with-desktop-reverse()` setzt nur unter `[mode='desktop']` die umgekehrte Flex-Richtung. `with-reverse()` kombiniert beide. Die vorhandenen Modifier-Klassen verwenden diese Mixins; `.reverse-mobile` ergänzt `.reverse-desktop` und `.reverse`. Beide neuen Mixins werden über `index.scss` exportiert, ohne CSS beim Import auszugeben. [neu]

Der dekorative Divider nutzt pro Instanz zurückgesetzte interne Richtungsfaktoren aus den äußeren Mixins. Flex-Umkehr und Alternating multiplizieren sich; zwei Umkehrungen ergeben wieder die Ausgangsseite. Der Divider liegt absolut im Gap, beansprucht keinen Platz und hat bei Gap null keine sichtbare Border. [neu]

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

Sind alle vier inneren Slots leer, wird der gesamte Wrapper über den vorhandenen `.slot-empty`-Zustand ausgeblendet. Header/Footer bleiben sichtbar. Ohne Main wird der Aside-Spaltentrenner ausgeblendet. Änderungen der Slot-Belegung werden durch die vorhandene SlotVisibility-Logik berücksichtigt. [geändert]

## § 6 Konkrete Theme-Migration

### § 6.1 Osman

`theme/osman/elements/ntl-2col/_style-default.scss`: Das bisherige zusätzliche Wrapper-`padding-block` entfällt. `--inner-padding: var(--nt-spacing-text)` und die vorhandenen responsiven Gap-Werte bleiben getrennt; erstmals bestimmen `clamp(...)` beziehungsweise mobil `1.25rem` den tatsächlichen Gap. [geändert]

Die seitlichen Padding-Zugaben für Text-Aside aus Default, Reverse und `_with-bg-primary.scss` entfernen. Automatische Bildreihenfolge, Bildformat und Min-Height bleiben erhalten. Das eigenständige Footer-Padding liegt außerhalb dieses Vertrags und bleibt separat.

Der vorhandene gemeinsame Divider wird auch für den Text-Aside verwendet, mit `$background: null` zur Erhaltung der Section-Fläche. Er liegt ohne zusätzlichen Padding-Anteil im Gap und folgt derselben Richtungslogik wie die Spalten. Die bisherigen lokalen Reverse-/Divider-Korrekturen entfallen. [geändert]

### § 6.2 Müller Default

`theme/mueller/elements/ntl-2col/_style-default.scss`: Die bestehenden Padding-Tokens `--nt-space-4` mobil und `--nt-space-6` Desktop werden zu den einmaligen Wrapper-Abständen. Der gewünschte sichtbare Zwischenraum wird direkt mit `$gap: var(--nt-spacing-layout)` gesetzt. [geändert]

Die aktuelle Angabe `$gap: 0` wird nach der Korrektur tatsächlich null. Für den hier gewünschten sichtbaren Zwischenraum lautet der Vorschlag deshalb ausdrücklich `$gap: var(--nt-spacing-layout)`. Das ist eine bewusste Theme-Entscheidung; bei einer gewünschten nahtlosen Komposition ist `0` weiterhin korrekt. Nicht versuchen, einen gewünschten Gap durch Slot-Padding zu simulieren.

Auto-Bilder erhalten durch das Wrapper-Padding nun auch einen Abstand zum Rahmen. Für die normale gerahmte Variante entspricht dies dem Ziel. Ein absichtlich bis zum Rand reichendes Bild braucht eine separat geprüfte, explizite Komposition; die automatische Bildzuordnung oder ein `.p-0` im Inhalt darf nicht implizit den gemeinsamen Außenabstand entfernen.

### § 6.3 Müller Testimonial und Breakouts

Auch das Testimonial nutzt sofort die neue Baseline. Zusätzliches Aside-Padding und redundantes Wrapper-Block-Padding entfallen. Der ausdrücklich komponierte mobile Bildüberstand einschließlich Transform, negativer Margin und offenem oberen Wrapper bleibt erhalten; er ist eine visuelle Sonderkomposition und keine Transition. [geändert]

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

Nextrap ändert die Default-Baseline, die funktionalen Leerzustände, Reverse-/Alternating-/Divider-Mixins, den Sass-Export, Demo und API-Dokumentation. Die neuen Dateien `_with-mobile-reverse.scss` und `_with-desktop-reverse.scss` kapseln die beiden Modi. Der Browser-Test `tests/spacing.browser.mjs` und `.github/workflows/ntl-2col-spacing.yml` sichern den Abstandsvertrag ab. [geändert]

ThemeJS2 passt die fünf vorhandenen Osman-/Müller-Dateien `_style-default.scss`, `_reverse.scss`, `_with-bg-primary.scss` beziehungsweise `_style-default.scss` und `_style-testimonial.scss` direkt an. Kein Opt-in-Mixin wird angelegt. [geändert]

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

Die Ursachenanalyse wurde gegen die Quellen aus § 2 abgeglichen. Default, Divider, Reverse-API sowie Osman-/Müller-SCSS lassen sich mit dem JavaScript-Sass-Compiler kompilieren; der reine API-Import erzeugt kein CSS. Der Browser-Regressionstest prüft 1.728 Kombinationen sowie dynamische Slot-Belegung und ist zusätzlich in der CI registriert. Der tatsächliche Laufstatus wird in den PRs dokumentiert. [geändert]

Der Package-Build einschließlich TypeScript-Deklarationen ist mit Vite und JavaScript-Sass erfolgreich. Die reguläre Nx-/Dart-Sass-Ausführung und der Chromium-Start sind in der lokalen Laufzeit blockiert. ThemeJS2s vollständiger Standard-Build ist zusätzlich durch die nicht veröffentlichte konfigurierte Abhängigkeit `@leuffen/vite-jekyll-hmr-manager@^1.0.1` blockiert. Diese bestehenden Infrastruktur-/Dependency-Probleme werden nicht durch einen lokalen Theme-Hack oder eine Übergangslösung umgangen. [geändert]

Der ThemeJS2-PR setzt die veröffentlichte Nextrap-Endfassung aus dem verknüpften PR voraus. Bis diese verfügbar ist, kann ein CI-Build mit der bisherigen npm-Version nicht als Prüfung der neuen gemeinsamen Baseline gewertet werden. Es werden keine Releases oder produktiven Deployments manuell ausgelöst. [geändert]
