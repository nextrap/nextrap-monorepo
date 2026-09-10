# NTL-2COL: Außenabstand am Wrapper, Zwischenabstand über Gap

| Datum | Benutzername | Kurzbeschreibung |
|---|---|---|
| 2026-09-10 | dermatthes | §§ 1–9: Proposal mit Bestandsanalyse, Styling-Entwurf, Theme-Migration und Abnahmekriterien angelegt |

## § 1 Ziel und Scope

Status: Vorschlag zur Prüfung; dieser PR enthält ausschließlich dieses Konzept. Die unten genannten SCSS-Änderungen sind noch nicht implementiert.

Der gemeinsame Rand um `top`, `main`, `aside` und `bottom` erhält genau einen Innenabstand. Zwischen benachbarten Regionen wirkt ausschließlich das konfigurierte Gap. `header` und `footer` bleiben außerhalb dieses Wrappers. Leere Slots erzeugen weder Regionen noch zusätzliche Gaps. Reverse, mobile Bildpriorisierung und Alternating dürfen den Außenabstand nicht beeinflussen.

Empfehlung: Das Layout-Padding vollständig an `::part(wrapper)` verlagern. Die vier inneren Parts erhalten kein eigenes Layout-Padding. Das erfüllt die gewünschte mobile Geometrie — Abstand oberhalb der ersten sichtbaren Region, seitlich entlang aller Regionen und unterhalb der letzten — ohne die jeweils erste oder letzte Region per Selektor ermitteln zu müssen.

Keine Änderung an Slot-Zuordnung, TypeScript, Shadow-DOM-Struktur, Registrierung von `tj-responsive`, Dependencies, Section-Rhythmus oder vertikaler Inhaltsausrichtung. ThemeJS2 wird in diesem PR nur analysiert; seine Migration erfolgt separat.

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

### § 4.1 Zunächst explizit aktivierbares Mixin

Da die Korrektur bestehende Theme-Geometrien verändert, zunächst ein öffentliches Feature-Mixin `with-wrapper-spacing()` bereitstellen. Es verbraucht die vorhandenen Variablen und wird nach `default-style()` innerhalb der jeweiligen `style-*`-Baseline eingebunden. So können Osman und Müller Default gezielt migrieren, während Testimonial und andere Themes zunächst ihre bestehende Komposition behalten.

Vorgesehene neue Datei: `nextrap-layout/ntl-2col/src/scss/_with-wrapper-spacing.scss`; Export über `nextrap-layout/ntl-2col/index.scss`. Der folgende Code ist ein Entwurf, kein bereits verfügbarer API-Aufruf:

```scss
// Trennt den einmaligen Abstand zum Rahmen von den Zwischenräumen der Regionen.
@mixin with-wrapper-spacing() {
  &::part(wrapper) {
    padding: var(--inner-padding);
    gap: var(--gap);
  }

  // Die Regionen tragen keinen zweiten Layout-Abstand zum Wrapper oder zueinander.
  &::part(top),
  &::part(main),
  &::part(aside),
  &::part(bottom) {
    padding: 0;
  }

  // Neutralisiert auch die spezifischere Aside-Regel der bestehenden Baseline.
  &:has(.aside:not(.p-0))::part(aside) {
    padding: 0;
  }
}
```

Die letzte Regel ist für die Übergangsphase nötig: Das bestehende `:has(.aside:not(.p-0))` hat höhere Spezifität als ein einfacher Part-Selektor. Ein späteres generisches `padding: 0` allein würde daher nicht ausreichen. Nach Entfernung der alten Padding-Logik aus der Baseline entfällt dieser Kompatibilitätsselektor.

Das Mixin erzeugt nur am Aufrufort CSS, besitzt keinen eigenen Root-Selektor und inkludiert keine Baseline. `index.scss` exportiert nur die API. Kein Style-Import in `index.ts`, kein `!important`, keine neuen Shadow-DOM-Variablen und keine zusätzlichen Breakpoints. Eine Klassenregistrierung `.with-wrapper-spacing` ist für die Theme-Migration nicht erforderlich; bei späterer Bereitstellung gilt dieselbe Mixin-Implementierung.

### § 4.2 Spätere Default-Umstellung

Nach Prüfung und Migration der Verbraucher kann `default-style()` dieselbe Wrapper-Geometrie direkt verwenden. Dabei die bisherigen Main-/Top-/Bottom-/Aside-Paddings entfernen und den Wrapper-Gap auf `var(--gap)` umstellen. Den Übergang entsprechend der Release-Policy als sichtbare Verhaltensänderung dokumentieren.

`$innerPadding` und `$gap` behalten ihre Namen; sie steuern künftig tatsächlich Außen-Innenabstand und Zwischenabstand. Im ersten Schritt bleiben alle anderen Parameter und insbesondere Justify unverändert. Die derzeit voneinander abweichenden Ausrichtungsempfehlungen in Usage-/Theming-Dokumentation werden nicht nebenbei als Runtime-Änderung aufgelöst.

### § 4.3 Kein Positionsalgorithmus für Padding

Kein `:first-child`, `:last-child` oder Light-DOM-`:has(.top)` zur Ermittlung der Außenkanten: DOM-Reihenfolge, visuelle Order, automatische Slot-Zuordnung und Slot-Leerzustand sind verschiedene Dinge. Ein Theme kann den internen Slot-Leerzustand außerdem nicht durch Verkettung von `::part(...)` mit beliebigen Shadow-DOM-Nachfahren abfragen. Der Wrapper funktioniert unabhängig davon.

Das bestehende Flex-Layout zunächst beibehalten. Ein Wechsel auf Grid oder eine neue Auslegung von `--cols` gehört nicht in den Spacing-Fix. Desktop-Main verwendet aktuell einen Anteil der verfügbaren Breite, Aside den Rest nach Gap; das bedeutet nicht automatisch zwei gleich breite Spalten bei `--cols: 6`. Bei großen Gaps und extremen Spaltenwerten ist verbleibender Platz zu prüfen, ohne diesen API-Vertrag stillschweigend neu zu definieren.

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

Wenn alle vier inneren Slots leer sind, verhindern ausgeblendete Regionen zwar Phantom-Gaps, nicht aber automatisch einen sichtbaren Wrapper-Rahmen samt Padding. Für Header-/Footer-only-Fälle muss vor der späteren Default-Umstellung entschieden und geprüft werden, ob der ganze leere Wrapper funktional ausgeblendet wird. Das Beispiel-Mixin behauptet keine solche Erkennung; eine gegebenenfalls nötige Erweiterung gehört in die vorhandene interne Slot-Sichtbarkeitslogik und erhält eine eigene Prüfung.

## § 6 Konkrete Theme-Migration

### § 6.1 Osman

`theme/osman/elements/ntl-2col/_style-default.scss`: Nach dem Default-Mixin `with-wrapper-spacing()` einbinden. Das bisherige zusätzliche Wrapper-`padding-block` entfernen beziehungsweise in den einen Wrapper-Padding-Wert integrieren. `--inner-padding: var(--nt-spacing-text)` und die vorhandenen responsiven Gap-Werte getrennt belassen; erstmals bestimmen `clamp(...)` beziehungsweise mobil `1.25rem` den tatsächlichen Gap.

Die seitlichen Padding-Zugaben für Text-Aside aus Default, Reverse und `_with-bg-primary.scss` entfernen. Automatische Bildreihenfolge, Bildformat und Min-Height bleiben erhalten. Das eigenständige Footer-Padding liegt außerhalb dieses Vertrags und bleibt separat.

Trennlinien sind Dekoration innerhalb des Gaps. Wenn sie weiter benötigt werden, als absolut positionierten Pseudo-Divider ohne zusätzlichen Layout-Padding-/Border-Anteil im Gap zeichnen. Seine Seite muss mit derselben Logik wie die visuelle Main-/Aside-Position wechseln: Standard, `.reverse`, `.reverse-desktop`, bestehendes `.desktop-reverse`, Alternating und kombinierte Umkehrungen. Die aktuelle Korrektur nur für `.reverse` ist dafür unvollständig. Bei Gap 0 oder fehlender Partnerregion keinen Divider zeichnen; die verlässliche Erkennung belegter Regionen ist vor Umsetzung festzulegen, nicht durch bloßes `:has(.aside)` zu ersetzen.

### § 6.2 Müller Default

`theme/mueller/elements/ntl-2col/_style-default.scss`: Neues Mixin nach Default aktivieren. Die bestehenden Padding-Tokens `--nt-space-4` mobil und `--nt-space-6` Desktop werden zu den einmaligen Wrapper-Abständen.

Die aktuelle Angabe `$gap: 0` wird nach der Korrektur tatsächlich null. Für den hier gewünschten sichtbaren Zwischenraum lautet der Vorschlag deshalb ausdrücklich `$gap: var(--nt-spacing-layout)`. Das ist eine bewusste Theme-Entscheidung; bei einer gewünschten nahtlosen Komposition ist `0` weiterhin korrekt. Nicht versuchen, einen gewünschten Gap durch Slot-Padding zu simulieren.

Auto-Bilder erhalten durch das Wrapper-Padding nun auch einen Abstand zum Rahmen. Für die normale gerahmte Variante entspricht dies dem Ziel. Ein absichtlich bis zum Rand reichendes Bild braucht eine separat geprüfte, explizite Komposition; die automatische Bildzuordnung oder ein `.p-0` im Inhalt darf nicht implizit den gemeinsamen Außenabstand entfernen.

### § 6.3 Müller Testimonial und Breakouts

Das Testimonial zunächst nicht auf das neue Mixin umstellen: Bildüberstand, negative Margin, Transform und eigenes Wrapper-Padding bilden eine gezielte Komposition. Eine spätere Migration muss jeden dieser Abstände funktional zuordnen; sichtbarer Bildüberstand kann nicht gleichzeitig der allgemeinen Regel „alle Regionen bleiben innerhalb des Randabstands“ entsprechen.

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

## § 7 Vorgesehene Umsetzungsdateien

Dieser Konzept-PR ändert nur die vorliegende Datei. Nach Review sind folgende Änderungen vorgesehen; ThemeJS2 benötigt dafür einen separaten PR.

| Phase | Repository / Pfad | Änderung |
|---|---|---|
| Opt-in | Nextrap: `nextrap-layout/ntl-2col/src/scss/_with-wrapper-spacing.scss` | Mixin aus § 4.1 |
| Opt-in | Nextrap: `nextrap-layout/ntl-2col/index.scss` | Öffentlicher Sass-Export |
| Validierung | Nextrap: `nextrap-layout/ntl-2col/demo/base.md` und `demo/demo.scss` | Slot-/Order-Vergleichsfälle und explizite Mixin-Einbindung |
| Dokumentation | Nextrap: `nextrap-layout/ntl-2col/README.md`, lokale Usage-/Theming-Dokumentation und `.ai-usage-info.md` | Opt-in-Vertrag, bestehende Variablen, Migration und Ausnahmen konsistent erklären |
| Migration | ThemeJS2: `theme/osman/elements/ntl-2col/_style-default.scss`, `_reverse.scss`, `_with-bg-primary.scss` | Gemeinsamer Außenabstand, Gap und gesondert geprüfte Divider-Regeln |
| Migration | ThemeJS2: `theme/mueller/elements/ntl-2col/_style-default.scss` | Neues Mixin, Gap bewusst konfigurieren |
| Spätere Baseline | Nextrap: `nextrap-layout/ntl-2col/src/scss/_default-style.scss` | Legacy-Paddings durch Wrapper-Modell ersetzen, Zweckkommentare aktualisieren |

Die Opt-in-Phase setzt keine Änderung in `ntl-2col.ts` oder internem Layout-SCSS voraus. Zusätzlicher funktionaler Änderungsbedarf, etwa das vollständige Ausblenden eines leeren Wrappers, wird nach Prüfung konkret abgegrenzt.

## § 8 Akzeptanz- und Prüfkriterien

1. Alle 15 nichtleeren Belegungen der vier inneren Regionen in Mobile und Desktop prüfen. Dazu den vollständig leeren Wrapper mit Header/Footer-only separat prüfen.
2. Jeweils Standard, Reverse, Reverse-desktop, bestehende interne Reverse-Zustände sowie gerade/ungerade Alternating-Fälle und kombinierte Umkehrung abdecken.
3. Mit unabhängigen Werten `P = 24px`, `G = 16px` und zusätzlich `G = 0` messen: Abstand von der inneren Borderkante zur äußeren Regionskante genau P; Abstand benachbarter Regionsboxen genau G, abgesehen von Rundung unter 1px.
4. Automatische Bild-Asides, explizite `.aside`, explizite Slot-Attribute ohne `.aside`, `.aside.p-0`, Top/Bottom und dynamisches Hinzufügen/Entfernen von Slot-Inhalt abdecken.
5. Top/Bottom bleiben volle innere Breite; Header/Footer werden nicht eingerückt oder in die Spalten verschoben. Main-only erhält vier Außenabstände und keine Phantom-Gaps.
6. Testinhalte ohne äußere Margins verwenden, damit Layout-Geometrie eindeutig messbar ist. Anschließend echte Theme-Inhalte mit Überschriften, Absätzen, Bildern und verschachtelten Komponenten prüfen: deren eigene Rand-Margins können sonst optisch zusätzliche Abstände erzeugen und müssen am jeweils zuständigen Inhalts-/Typografie-Vertrag bewertet werden.
7. Große und kleine Gaps, `--cols`-Werte, lange untrennbare Inhalte und schmale Desktop-Container auf unerwünschtes Wrapping/Overflow prüfen. Breakout-/Sticky-/Divider-/Testimonial-Fälle separat vergleichen.
8. Bei der Implementierung Sass-Compile mit und ohne explizites Mixin sowie im verschachtelten Theme-Scope prüfen; ein reiner `@use` des Entrypoints darf kein CSS ausgeben. Bestehende Demos und fokussierte Browser-Geometriemessungen verwenden; anschließend den relevanten Package-/Theme-Build ausführen.

## § 9 Prüfung dieses Proposals und offene Entscheidungen

Die Ursachenanalyse und der Entwurf wurden gegen die in § 2 verlinkten Quellen, die Slot-Struktur und die vorhandenen Reverse-/Alternating-Mixins abgeglichen. Die Bestandsquellen belegen die additive Padding-Logik und den unwirksamen Gap-Parameter. Es wurden keine Styles implementiert, keine Browser-Geometriemessungen und keine Builds ausgeführt; § 8 beschreibt die Abnahme für die spätere Umsetzung.

Vor der Default-Umstellung zu entscheiden: Veröffentlichung der Opt-in-Phase, gewünschter Müller-Gap, explizite randlose Bild-/Breakout-Ausnahmen, Umgang mit vollständig leerem Wrapper und zuverlässige Divider-Sichtbarkeit bei fehlenden Partnerregionen. Die Empfehlung für die normale gerahmte Komposition bleibt eindeutig: ein Wrapper-Padding, ein unabhängiger Gap, kein zusätzliches Regions-Padding.
