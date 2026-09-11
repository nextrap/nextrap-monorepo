# NTE-Card: ein Rahmenabstand und ein Gap zwischen sichtbaren Regionen

| Datum | Benutzername | Kurzbeschreibung |
|---|---|---|
| 2026-09-10 | dermatthes | §§ 1–8: Entwurf mit Quellenanalyse, Abstandsvertrag, Bildvarianten, Theme-Abgleich und Abnahmekriterien angelegt |
| 2026-09-10 | dermatthes | §§ 1–8: Direkte Umsetzung freigegeben, regionsbezogenes Bleed ergänzt und Theme-Verwendungen angepasst |
| 2026-09-10 | dermatthes | Gap-Default auf das zentrale --nt-spacing-text korrigiert; Bleed darf weder innere noch äußere Gaps aufheben |
| 2026-09-11 | dermatthes | § 1, § 9: Vereinfachung durch positive Insets, aktuelle Risiken, Rundungen und Prüfplan ergänzt; Revisionsmarkierungen zurückgesetzt |

## § 1 Ziel und Umfang

Historischer Umsetzungsstand vom 2026-09-10: Die direkte Umsetzung einschließlich `with-region-bleed()` für Image, Header, Content und Footer wurde beauftragt; das damalige ThemeJS2-Gegenstück ist PR #58. Der aktuelle Proposal-PR ergänzt ausschließlich den noch offenen Vereinfachungsvorschlag in § 9. [geändert]

Die Card erhält genau einen Abstand innerhalb ihres Rahmens. Zwischen benachbarten, sichtbaren Card-Regionen wirkt ausschließlich ein unabhängiger Gap. Das gilt für einzelne Karten, Listen, Kartenraster, fehlende Slots und veränderte visuelle Reihenfolgen.

Anders als bei NTL-2COL liegen **Image, Header, Content und Footer innerhalb des Card-Rahmens**. Der versteckte Link-Slot ist Metadatum und darf keine Layout-Region oder zusätzlichen Gap erzeugen. Ein optionaler äußerer Link-Wrapper bleibt funktional erhalten.

Es werden keine Slots umbenannt, keine zusätzlichen Autoren-Wrapper verlangt und keine Abhängigkeiten oder Responsive-Registrierungen eingeführt. Layoutabstände zwischen mehreren Karten bleiben bei NTL-Card-Row beziehungsweise NTL-Card-Grid. Vorhandene Hover-Animationen sind nicht Gegenstand dieser Arbeit. Die vorgeschlagene Baseline gilt nach Umsetzung direkt, ohne Übergangsmodus.

## § 2 Geprüfter Bestand

### § 2.1 Core-Quellen

Quellstand: [nextrap-monorepo, 894f0ffd](https://github.com/nextrap/nextrap-monorepo/tree/894f0ffd5e3fdb7d27ec62b2cf19759c427a46e7).

Alle nachstehenden Pfade sind relativ zu `nextrap-elements/nte-card/`.

| Datei | Befund |
|---|---|
| `src/scss/_default-style.scss` | `$innerPadding` wird auf Header, Content und Footer vollständig angewendet. Image bleibt ohne Padding. Ein eigener Gap-Parameter fehlt. |
| `src/components/nte-card/nte-card.scss` | Wrapper ist Flex-Column; Image hat Order 1, Header 2, Content 50 und Footer 999. Content wächst über `flex-grow: 1`. Rahmen und Hintergrund werden zusätzlich intern gesetzt. |
| `src/components/nte-card/nte-card.scss` | Aktuelles Main blendet direkte leere Slot-Regionen bereits mit `*:has(> .slot-empty)` aus. Diese Änderung erhalten; nicht die ältere breitere Descendant-Prüfung wieder einführen. Der vollständig leere Wrapper besitzt noch keine eigene Ausblendung. |
| `src/components/nte-card/nte-card.ts` | Vorhandene Slots, automatische Bildzuordnung und optionaler äußerer Anker bilden den funktionalen Vertrag. Bilder erhalten teilweise Inline-Defaults; Fullsize daher mit realem Runtime-Verhalten prüfen. |
| `src/scss/_with-image-overlay.scss` | Image und Content teilen Grid-Zeile/-Spalte 1. Header/Footer bleiben zusätzliche Regionen. Der Gradient liegt innerhalb des Bild-Parts. |
| `src/scss/_with-image-fullsize.scss` | Hebt die feste Aspect-Ratio auf und verwendet die natürliche Bildhöhe; dieses Feature ist kein Bleed-/Abstandsmodifier. |
| `src/scss/_with-modifier-classes.scss` | Registriert bisher `.img-fullsize` und `.img-overlay`. Der Default kann die Registrierung bereits über `$modifierClasses: false` beziehungsweise `none` abschalten. |
| `index.scss`, `.ai-usage-info.md` | Öffentliche Sass-API und Nutzungsvertrag; Dokumentation empfiehlt bisher Padding/Inhaltsstyles statt eigenem Card-Gap. |

### § 2.2 Ursache und Abgrenzung

Bei zwei benachbarten Textregionen beträgt der Abstand zwischen deren Inhaltsboxen bereits `P + P`. Fügt ein Theme einen Wrapper-Gap `G` hinzu, entsteht `2P + G`. Einzelne Footer-Padding-Resets, Bild-Margins oder weiteres Wrapper-Padding gleichen nur bestimmte Belegungen aus und brechen bei anderen Kombinationen.

Äußere Margins der redaktionellen Elemente können zusätzlich sichtbar werden. Sie sind vom Abstand zwischen den Slot-Regionen zu unterscheiden. Auch `gap` auf einem Content-Part verteilt nicht automatisch mehrere slottierte Absätze: Der Slot ist zunächst selbst ein Flex-Kind. Keine scheinbare Lösung durch einen weiteren Content-Gap ohne Prüfung des tatsächlichen Boxbaums.

Der Abstand zwischen zwei Karten und der Abstand einer Region zu ihrem Kartenrahmen sind unterschiedliche Zuständigkeiten. Der neue Card-Gap darf insbesondere nicht unbeabsichtigt den vom Elternlayout geerbten `--gap` übernehmen.

## § 3 Vorgeschlagener Abstandsvertrag

| Ebene | Verantwortliche Eigenschaft | Wirkung |
|---|---|---|
| Kartenreihe / Raster | Bestehende NTL-Gap-/Gutter-API | Abstand zwischen Karten |
| Card-Wrapper | `padding: var(--inner-padding)` | Abstand der äußersten sichtbaren Regionen zur inneren Rahmenkante |
| Card-Wrapper | `gap: var(--gap)` | Abstand zwischen benachbarten sichtbaren Regionen |
| Image / Header / Content / Footer | Kein zusätzliches Layout-Padding | Kein doppelter Zwischenabstand |
| Redaktioneller Inhalt | Bestehende Typografie | Abstände innerhalb eines Inhaltsblocks |
| Overlay-Content | Bewusster innerer Textschutz | Abstand des Textes zur überlagerten Bildkante; siehe § 5 |

Der Default setzt seine Variablen am jeweiligen Card-Host neu. Dadurch erbt eine verschachtelte Card nicht versehentlich den Gap ihres NTL-Elternlayouts oder ihrer äußeren Card. Der Theme-Selektor beziehungsweise die konkrete Instanz kann diese Werte danach konfigurieren.

Für normales Stacking mit `P = 24px`, `G = 16px` und mindestens einer sichtbaren Region gilt: vier äußere Kanten haben P Abstand zum Rahmen, zwischen sichtbaren Nachbarn liegt G. Nur Content, nur Header, nur Footer und nur Image erhalten jeweils das vollständige Außenpadding. Bei N sichtbaren, gestapelten Regionen gibt es N−1 Gaps. Bei null sichtbaren Regionen verschwindet der Wrapper einschließlich Rahmen und Padding.

Bei gleicher Kartenhöhe bleibt der Content-Part bei Bedarf flexibel wachsend. Dann ist G weiterhin exakt der Abstand zwischen den **Regionsboxen**; der letzte Text im wachsenden Content kann vom Footer weiter entfernt sein. Ein zusätzliches `margin-top: auto` am Footer würde dagegen freien Raum zwischen den Regionen verteilen und ist für diesen Vertrag zu entfernen, wenn Content bereits wächst.

Geänderte Order oder Flex-Richtung ändert nicht den Randabstand. Horizontale Theme-Kompositionen benutzen denselben Wrapper als Eigentümer des Außenpaddings und des Spalten-Gaps; sie müssen ihre Track-Zuweisung bei fehlenden Regionen gesondert prüfen.

## § 4 Geplante Core-Änderung

### § 4.1 Default und Sass-API

`default-style()` erhält **am Ende** der bestehenden Parameterliste `$gap: var(--nt-spacing-text)`. Damit bleiben bestehende positionale Argumente zu Border, Bildformat, Overlay und Modifier-Registrierung korrekt zugeordnet. `--inner-padding` bleibt erhalten; `--gap` wird als unabhängige Card-API dokumentiert.

Schematischer Kern der Änderung innerhalb des vorhandenen Mixins:

```scss
// Initialisiert den Regionsabstand auf dieser Card unabhängig vom Elternlayout.
@if $gap == 0 {
  $gap: 0px;
}
--gap: #{$gap};

// Genau eine Box trägt den Kartenrahmen und dessen Innenabstand.
&::part(wrapper) {
  padding: var(--inner-padding);
  gap: var(--gap);
}

// Regionsboxen addieren keinen weiteren Layout-Abstand.
&::part(image),
&::part(header),
&::part(content),
&::part(footer) {
  padding: 0;
}
```

Border, Radius, Background und vorhandenes Clipping bleiben Teil der visuellen Baseline. Visuelle doppelte Rahmen-/Background-Deklarationen im internen SCSS entfernen; zuvor Theme-Verwendungen, die nur interne Defaults oder Host-Variablen nutzen, explizit auf eine vollständige Card-Baseline umstellen. Das ist Bestandteil der gemeinsamen Umsetzung und keine isoliert auszuliefernde Teiländerung.

### § 4.2 Leerzustände und öffentliche Parts

Die vorhandene SlotVisibility-Auswertung bleibt maßgeblich. Eine ergänzende interne CSS-Regel blendet `#wrapper` genau dann aus, wenn die Slots in `#image`, `#header`, `#content` und `#footer` jeweils leer sind. Der versteckte Link-Slot zählt nicht mit. Direkte Kind-/Slot-Prüfungen verwenden; ein leerer Slot einer verschachtelten Komponente darf seine äußere Card nicht ausblenden.

Keine Änderung am Shadow-DOM-Aufbau und keine neuen Slots sind für die normale Baseline notwendig. Den leeren verlinkten Host zusätzlich auf eine Phantom-Klickfläche prüfen. Der belegungsabhängige Zustand wird für Overlay- und horizontale Theme-Kompositionen aus den tatsächlichen Slots abgeleitet.

### § 4.3 Automatische Helper

Analog zum beauftragten 2COL-Vertrag registriert der Card-Default seine vorhandenen Features unter dem aktuellen Style-Selektor auch mit kanonischen Namen:

| Klasse | Mixin | Bestehender Alias |
|---|---|---|
| `.with-image-fullsize` | `with-image-fullsize()` | `.img-fullsize` |
| `.with-image-overlay` | `with-image-overlay()` | `.img-overlay` |

Die Klassenregistrierung bindet dieselben Mixins ein und dupliziert keine Implementierung. `$modifierClasses: false` beziehungsweise `none` unterdrückt die gesamte Registrierung. Der reine Sass-Import erzeugt weiterhin kein CSS. Zusätzliche Reverse-/Alignment-APIs werden für diesen Abstandsfix nicht vorausgesetzt.

## § 5 Bilder und Sonderkompositionen

### § 5.1 Normale und natürliche Bilder

Normale Regionen werden durch ein Wrapper-Padding eingerückt. `with-region-bleed($region: image, $edges: all)` erweitert gezielt Image, Header, Content oder Footer bis zur inneren Rahmenkante; Klassen `.with-image-bleed`, `.with-header-bleed`, `.with-content-bleed` und `.with-footer-bleed` stehen automatisch bereit. Ein einzelnes Bild kann dadurch alle vier Rahmenkanten erreichen.

Die Kantenwahl unterstützt `all`, `inline`, `block` sowie einzelne logische Kanten und Listen. `--inner-padding` muss für Bleed ein einzelner Längenwert sein. Seitliches Bleed wirkt unmittelbar; Block-Bleed nur bei einer tatsächlich äußeren Region. Funktionale Flags folgen der Slot-Belegung und verhindern, dass innere Gaps durch negative Margins verändert werden. Fullsize bleibt unabhängig davon.

### § 5.2 Overlay

Image und Content teilen eine randlose Grid-Fläche. Beide erhalten korrespondierendes Bleed; Content trägt innerhalb dieser Fläche `--inner-padding` als Textschutz. Header/Footer bleiben weitere Regionen innerhalb des Kartenrahmens und erhalten nur den gemeinsamen Gap. Ohne Bild wird das Overlay nicht aktiviert.

Der abgeleitete Zustand `data-card-regions` spiegelt belegte Slots einschließlich reiner Textknoten. Die vorhandenen Slotchange-Callbacks aktualisieren diesen Zustand; zusätzliche Callback-Bindungen an Header/Content/Footer decken dynamische Änderungen ab. Theme-Grids können damit fehlende Tracks vermeiden. Autoren setzen diesen Zustand nicht selbst.

### § 5.3 Horizontale Stories, Avatare und Footer-Aktionen

Theme-eigene Grid-Spalten dürfen den gemeinsamen Außenabstand nicht erneut in Header/Content/Footer einbauen. Prozent-/Fr-Spalten müssen auf der inneren Wrapperbreite basieren. Keine fixen drei Textzeilen mit sichtbaren Gaps, wenn Header oder Footer fehlt.

Avatare behalten ihre Größe und runde Form; ihre bisherigen nachgebauten Außen-Margins entfallen zugunsten des Wrapper-Paddings. Absichtlich rechts-/linksbündige Avatare erhalten eine Ausrichtung, kein dupliziertes Padding.

Gleiche Kartenhöhen und Footer-Aktionen bleiben möglich: vorzugsweise Content wachsen lassen, statt Gap mit weiteren Layout-Margins zu ergänzen. Absatz- oder Buttonabstände innerhalb einer Region bleiben davon unabhängig.

## § 6 Umsetzungspfade und Theme-Abhängigkeit

| Geplante Datei | Änderung |
|---|---|
| `nextrap-elements/nte-card/src/scss/_default-style.scss` | Gap-Parameter, Host-Initialisierung, Wrapper-Padding, Regions-Reset |
| `nextrap-elements/nte-card/src/components/nte-card/nte-card.scss` | Vollständig leerer Wrapper; doppelte visuelle Regeln nach Theme-Abgleich entfernen |
| `nextrap-elements/nte-card/src/scss/_with-image-overlay.scss` | Bewusster Overlay-Textabstand und Image-Leerzustand |
| `nextrap-elements/nte-card/src/scss/_with-modifier-classes.scss` | Kanonische Helper mit bestehenden Aliasnamen |
| `nextrap-elements/nte-card/.ai-usage-info.md` | Neuer Abstandsvertrag, Parameter und Sonderfälle |
| `nextrap-elements/nte-card/demo/base.md`, `demo/main.scss` im selben Package | Kleine reproduzierbare Standard-, Bild- und Overlayfälle |
| `nextrap-elements/nte-card/tests/spacing.browser.mjs` | Fokussierter Browser-Geometrietest als geplante neue Datei |

ThemeJS2 erhält einen eigenen Proposal-PR unter demselben relativen Proposal-Pfad. Er benennt die tatsächlichen Osman-, Müller-, Raven-, Unify-, ePraxis- und Medic-Verwendungen. Kein globales Suchen/Ersetzen aller `padding`- oder `margin`-Deklarationen.

Die spätere Theme-Implementierung benötigt eine veröffentlichte kompatible NTE-Card-Version. Beide PRs enthalten jetzt die konkrete Implementierung; Paket-Releases werden damit nicht ausgelöst.

## § 7 Abnahmeplan

1. Alle 16 Belegungen von Image/Header/Content/Footer bei mobilen und Desktop-Breiten prüfen; explizite Slots und automatische Bildzuordnung einschließlich eines umschließenden Absatzes abdecken.
2. Für P=24px und G=0px/16px/40px die tatsächlichen Regionsboxen messen. Kein Gap für leere Regionen; auch ein leerer Wrapper mit Link-only darf keine Rahmen-/Klickfläche hinterlassen.
3. Reihenfolge der sichtbaren Regionen verändern und horizontale Karten mit Bild links/rechts prüfen; Außenabstand bleibt unverändert. Lange Wörter, schmale Container, große Rahmenbreiten und natürliche Bildformate dürfen keinen horizontalen Überlauf verursachen.
4. Slots nach dem ersten Rendern hinzufügen/entfernen; reine Textknoten, verschachtelte Cards sowie befüllte äußere Slots mit leeren inneren Slots prüfen.
5. Verlinkte und unverlinkte Karten vergleichen: gleicher Rahmen, gleiche Geometrie, funktionierende Links und erkennbare Tastaturfokussierung.
6. Gleiche Kartenhöhe und wachsender Content: Regions-Gap exakt, Footer bündig; zusätzliche freie Höhe innerhalb Content separat von G ausweisen.
7. Overlay mit/ohne Bild, Header, Content und Footer sowie Fullsize separat prüfen. Gemeinsame Bild-/Content-Zelle ohne internen Gap, bewusster Textschutz und keine Phantom-Tracks.
8. Sass-Import ohne CSS, Parameterkompatibilität, gescopte Helper/Aliasse und `$modifierClasses: false|none` prüfen. Card-Gap unabhängig von NTL-Gap und von verschachtelten Card-Werten.
9. Theme-Vergleich mit echten Inhalten und deren typografischen Margins; gemeinsame Baseline darf keine verschachtelte Card unabsichtlich mitstylen.
10. Erst danach relevanten Package-/Theme-Build und erreichbare Desktop-/Mobile-Preview prüfen. Ein erfolgreicher Proposal-PR ist kein Nachweis für eine bereits getestete Implementierung.

## § 8 Entscheidungen und Prüfstand

Die Umsetzung folgt der Freigabe: Wrapper-Padding, eigener Gap, regionsbezogenes Bleed und automatisch registrierte Helper. ThemeJS2 erhält dieselbe API und verwendet Image-Bleed für bisher randlose Titelbilder. Avatare bleiben eingerückt.

Sass- und Package-Prüfungen sowie die Browser-CI sind in der PR-Beschreibung dokumentiert. Der Browser-Test prüft explizite Slots, verlinkte Karten, dynamische Inhalte und Bleed-/Overlay-Geometrie. Ein blockierter Theme-Gesamtbuild wird nicht als erfolgreiche visuelle Abnahme ausgegeben.

Der Gap verwendet das zentrale `--nt-spacing-text`; das bisherige `--nt-text-gap` ist ausschließlich in Unify definiert. Randlose Medien verändern nur Außen-Padding, niemals den Abstand zum nächsten Inhalt oder zur nächsten Card.

## § 9 Vereinfachungsvorschlag: positive Einrückungen statt Bleed-Verrechnung

### § 9.1 Status und aktueller Ausgangspunkt

Stand 2026-09-11: Dieser Abschnitt ist ein neuer Vorschlag zur Diskussion, keine implementierte Änderung und keine erneute Freigabe der früheren Umsetzung. §§ 1–8 dokumentieren den bisherigen Vertrag; die hier vorgeschlagene Änderung seines Padding-Eigentümers ist noch offen. Bezugsstand: [9596b3b31fed96b67177a38b1b7bab7caf33a739](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-elements/nte-card/src/scss/_default-style.scss). [neu]

Heute setzt `default-style()` Padding, Gap, Rahmen, Radius und `overflow: hidden` am Wrapper. `with-region-bleed()` zieht seitlich `--inner-padding` als negative Margin ab, setzt `width: auto` und markiert Blockkanten über acht mögliche Regions-Flags. Intern wählt eine Slot-Belegungsmatrix die erste/letzte Region; der Default verrechnet die ausgewählten Flags mit dem Wrapper-Padding. Overlay überschreibt diese Auswahl für seine gemeinsame Bild-/Content-Fläche. Das Mixin allein zeigt daher nicht das vollständige Verhalten. [neu]

Quellen: [Default](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-elements/nte-card/src/scss/_default-style.scss), [Bleed](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-elements/nte-card/src/scss/_with-region-bleed.scss), [interne Kantenwahl](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-elements/nte-card/src/components/nte-card/nte-card.scss), [Overlay](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-elements/nte-card/src/scss/_with-image-overlay.scss), [Slotzustand](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-elements/nte-card/src/components/nte-card/nte-card.ts), [Browser-Test](https://github.com/nextrap/nextrap-monorepo/blob/9596b3b31fed96b67177a38b1b7bab7caf33a739/nextrap-elements/nte-card/tests/spacing.browser.mjs). [neu]

### § 9.2 Was funktioniert und wo die Komplexität herkommt

Die bestehende Lösung schützt den inneren Gap bewusst: Ein mittlerer Header mit Bleed darf nicht seine Nachbarn überlappen. Der Blockabstand wird am Wrapper entfernt, damit auch ein einzelnes sehr kleines Medium keinen Rest einer gepolsterten Mindestbox hinterlässt. Das sind sinnvolle Anforderungen; bloß alle Margins auf `-P` zu setzen wäre ein Rückschritt. [neu]

Die Kantenwahl folgt jedoch fest Image → Header → Content → Footer. Im Template steht Header vor Image; `order` erzeugt erst die normale visuelle Reihenfolge. Ein schlichtes `:first-child` wäre deshalb schon im Default falsch. Theme-eigene Order, eine horizontale Card und Overlay brauchen jeweils eine eigene Außenkantenzuordnung. Diese Grenze besteht auch nach einer Vereinfachung. [neu]

Die vorhandenen Tests decken viele Belegungen und Bleed-Varianten ab, setzen den Card-Radius aber auf null und prüfen keine frei geänderte Regions-Order. Daraus folgt keine visuelle Abnahme von Rundungen, Fokus-Clipping oder beliebigen horizontalen Themes. Die Beispiele der Usage-Datei nennen außerdem noch `--nt-text-gap`, während der Default bereits `--nt-spacing-text` nutzt; das ist eine Dokumentationsabweichung, kein Gegenstand dieses reinen Proposal-PRs. [neu]

### § 9.3 Empfehlung und genauer Abstandskontrakt

Empfehlung: Den Wrapper ungepolstert lassen. Er behält Rahmen, Hintergrund, Radius, Clipping und Gap. Sichtbare Regionen erhalten positive Margins ausschließlich an den Kanten, die zum äußeren Rahmen zeigen. Randlos bedeutet an diesen Kanten `0px`. An inneren Nachbarkanten bleibt die Margin immer null; dort wirkt ausschließlich Gap. Die Insets werden vom äußeren Theme-Mixin auf die vorhandenen Parts gesetzt, nicht auf beliebige slottierte Kinder. [neu]

Das ist keine Rückkehr zu `padding: P` auf jeder Region: Dieses würde zwischen zwei Inhalten erneut `2P + G` erzeugen. Ebenso wäre `margin: P` auf jedem Kind falsch. Ob eine Kante außen liegt, entscheidet der Layout-Adapter einmal; ob dort Abstand gewünscht ist, entscheidet das jeweilige Region-Mixin. [neu]

| Fall bei P=24px, G=16px | Ziel |
|---|---|
| Nur Content | Content auf allen vier Seiten 24px eingerückt |
| Nur randloses Image | Image auf allen vier Seiten 0px eingerückt |
| Randloses Image, danach Content | Image oben/seitlich 0px; Content seitlich/unten 24px; dazwischen 16px |
| Image, randloser Header, Content | Header seitlich 0px; beide inneren Gaps unverändert 16px |
| Beliebige leere Regionen | Keine leeren Layoutboxen und keine Phantom-Gaps |

Für den normalen Stack bleibt Flex-Column ausreichend. `width: auto`, `min-width: 0` und Stretch auf den Regionsboxen lassen positive Seiten-Margins die verfügbare Breite reduzieren; eine feste `width: 100%` würde zusammen mit diesen Margins überlaufen. Card-Content darf weiterhin wachsen. [neu]

### § 9.4 Konkreter CSS-Entwurf

Folgender Ausschnitt zeigt nur den normalen Stack mit vorhandenem Image und Content, ohne Header/Footer. Die Zustandsbegrenzung ist wesentlich: Dies ist kein vollständiger Ersatz für `default-style()`. Die lokalen Properties werden auf jedem Regions-Part neu initialisiert, damit verschachtelte Cards keine Konfiguration erben. [neu]

```scss
// Demonstriert positive Insets für genau den belegten Image/Content-Stack.
nte-card.style-default[data-card-regions~='image'][data-card-regions~='content']:not([data-card-regions~='header']):not([data-card-regions~='footer']) {
  // Rahmen und Gap bleiben beim Wrapper; negative Verrechnung entfällt.
  &::part(wrapper) {
    padding: 0;
    gap: var(--gap);
  }

  // Initialisiert die Abstände direkt auf den beiden Regionsboxen.
  &::part(image), &::part(content) {
    --_card-inset-inline-start: var(--inner-padding);
    --_card-inset-inline-end: var(--inner-padding);
    --_card-inset-block-start: var(--inner-padding);
    --_card-inset-block-end: var(--inner-padding);
    box-sizing: border-box;
    width: auto;
    min-width: 0;
    padding: 0;
    margin: 0;
    margin-inline-start: var(--_card-inset-inline-start);
    margin-inline-end: var(--_card-inset-inline-end);
  }

  // Nur die tatsächlich äußeren Blockkanten erhalten einen Abstand.
  &::part(image) { margin-block-start: var(--_card-inset-block-start); }
  &::part(content) { margin-block-end: var(--_card-inset-block-end); }

  // Der bestehende Helper setzt Werte auf null statt den Wrapper zu korrigieren.
  &.with-image-bleed::part(image) {
    --_card-inset-inline-start: 0px;
    --_card-inset-inline-end: 0px;
    --_card-inset-block-start: 0px;
    --_card-inset-block-end: 0px;
  }
}
```

Die vollständige Stack-Baseline wählt jeweils die erste und letzte belegte Region anhand des bereits vorhandenen `data-card-regions`. Für die vier Regionen genügen je vier geordnete Start-/End-Fälle; die übrigen Block-Margins bleiben null. Diese Regeln gehören zusammen in die Baseline, nicht in jeden Bleed-Helper. `with-region-bleed($region, $edges)` behält Validierung und öffentliche Signatur, setzt auf dem gewählten Part lediglich die ausgewählten Insets auf null. Die acht Wrapper-Bleed-Flags, deren Resets, die interne First-/Last-Bleed-Auswahl und die Padding-Multiplikation können für diese Baseline entfallen. [neu]

Das reduziert die Kopplung zwischen Dateien; eine kleinere gesamte kompilierte CSS-Ausgabe ist damit noch nicht nachgewiesen. Der spätere Prototyp muss auch die zusätzliche Initialisierung der vier Werte pro Region mitzählen. Ein einzelner Inset-Wert wäre kürzer, würde aber die bereits öffentliche Auswahl einzelner Kanten einschränken. [neu]

### § 9.5 Overlay, Rundungen und interaktive Inhalte

Overlay bleibt eine eigene Grid-Komposition: Image und Content liegen in derselben Zelle. Beide haben dort null Außen-Inset; Content behält echtes inneres Padding als Textschutz. Header/Footer sind weitere Zeilen. Die letzte sichtbare Zeile erhält bei Bedarf den unteren positiven Inset; kein Rückgriff auf Wrapper-Bleed-Flags. Ohne Bild bleibt die normale Stack-Baseline aktiv. Horizontale Cards brauchen eine explizite Kantenkarte wie 2COL, nicht die Stack-Regeln. [neu]

Für randlose Medien bleibt der Wrapper die gemeinsame Schnittkante. `border-radius` allein beschneidet Nachfahren nicht allgemein; das vorhandene Clipping muss bewusst erhalten werden. Kein pauschales `border-radius: inherit` auf allen Kindern: Ein Image über Content hätte sonst auch innen abgerundete untere Ecken. Bei einheitlichem äußerem Radius R und Rahmen B liegt die innere Rahmenkurve bei `max(0, R - B)`; das Wrapper-Clipping berücksichtigt diese Geometrie. [neu]

Ein eingerücktes, eigenständig gerundetes Bild darf seinen eigenen Radius behalten. Soll es konzentrisch zum Rahmen wirken, ergibt sich im einfachen gleichmäßigen Fall `max(0, R - B - P)`; elliptische Radien und ungleiche Borders brauchen getrennte Betrachtung. Avatare behalten ihre beabsichtigte runde Form. Große Radien können randlosen Text oder Bedienelemente abschneiden: Eine randlose Oberfläche benötigt gegebenenfalls eigenes Inhaltspadding. [neu]

`overflow: hidden` kann innere Fokusumrisse, Menüs und Schatten abschneiden. `overflow: clip` vermeidet einen Scrollcontainer, ist aber kein allgemeiner Ersatz: Es clippt weiterhin und verändert Overflow-/Scrollverhalten. Der äußere Card-Link, innere interaktive Elemente, Overlays und Medien müssen separat mit Tastatur getestet werden. Ein solcher Wechsel ist nicht Teil dieser Empfehlung zur Abstandsvereinfachung. [neu]

### § 9.6 Umsetzung und Abnahme nach Entscheidung

| Old | New |
|---|---|
| Padding auf Wrapper plus negative Regions-Margins | Wrapper ohne Padding; positive Margins nur an Außenkanten |
| Region-Flags am Wrapper plus interne Flag-Auswahl | Insets direkt am Part plus zusammenhängende Layout-Kantenwahl |
| `with-region-bleed(region, edges)` | Öffentliche API bleibt; ausgewählte Inset-Werte werden null |
| Separate Overlay-Bleed-Korrektur | Explizite gemeinsame Grid-Fläche mit innerem Textschutz |

Spätere Umsetzung: `src/scss/_default-style.scss`, `_with-region-bleed.scss`, `_with-image-overlay.scss`, `src/components/nte-card/nte-card.scss` sowie bestehende Tests, Demo und Usage-Dokumentation im Package konsistent anpassen. Die TS-Slotzustände können für den normalen Stack weiterverwendet werden. Freie Theme-Reihenfolgen müssen ihren Adapter selbst definieren oder separat als API beauftragt werden; keine DOM-Messung oder Sortierung nach `getBoundingClientRect()` einführen. [neu]

Abnahme: Bestehende Geometriefälle weiter ausführen, ergänzt um P=0/24/48px, G=0/16/40px, sehr kleine Einzelbilder, Radius=0/12/48px und Border=0/1/8px. Reihenfolge, Overlay mit fehlenden Regionen, reine Textknoten, dynamische Slots, verschachtelte Cards, verlinkte Cards und natürliche Bilder prüfen. Geometrie, Screenshot und Tastaturfokus getrennt bewerten. Theme-Verwendungen dieses veränderten Padding-Vertrags benötigen einen eigenen Vergleich; der Proposal-PR ändert sie nicht. [neu]

Prüfstand dieses Vorschlags: Quellen und vorhandene Testabdeckung statisch geprüft; kein Package-Code geändert. Der lokale Browserstart scheiterte am fehlenden Playwright-Chromium, Sass ist hier ebenfalls nicht installiert. Der CSS-Entwurf wurde nicht kompiliert oder visuell ausgeführt; frühere Prüfberichte aus § 8 gelten nicht als Prüfung dieses Alternativentwurfs. [neu]

### § 9.7 Externe Belege

- [CSS Box Alignment, Gaps](https://www.w3.org/TR/css-align-3/#gaps): Gap und zusätzliche Boxabstände sind getrennt; daraus folgt die Beschränkung positiver Margins auf Außenkanten.
- [CSS Shadow Parts](https://www.w3.org/TR/css-shadow-parts-1/#part): Parts öffnen keine beliebige interne DOM-Struktur; die Kantenwahl darf nicht auf `::part(content):first-child` als vermeintlichem ersten sichtbaren Kind beruhen.
- [CSS Overflow, Corner Clipping](https://www.w3.org/TR/css-overflow-3/#corner-clipping): Unterschied zwischen Hidden/Clip und deren Rundungsgeometrie.
- [CSS Backgrounds, Corner Shaping](https://www.w3.org/TR/css-backgrounds-3/#corner-shaping): Verhältnis von äußerem Radius, Border und innerer Kurve.

Die Gestaltungsempfehlung ist eine aus Code und CSS-Verträgen abgeleitete Architekturentscheidung, keine durch diese Quellen bestätigte Nextrap-Implementierung. [neu]
