# NTE-Card: ein Rahmenabstand und ein Gap zwischen sichtbaren Regionen

| Datum | Benutzername | Kurzbeschreibung |
|---|---|---|
| 2026-09-10 | dermatthes | §§ 1–8: Entwurf mit Quellenanalyse, Abstandsvertrag, Bildvarianten, Theme-Abgleich und Abnahmekriterien angelegt |
| 2026-09-10 | dermatthes | §§ 1–8: Direkte Umsetzung freigegeben, regionsbezogenes Bleed ergänzt und Theme-Verwendungen angepasst |

## § 1 Ziel und Umfang

Status: Die direkte Umsetzung ist beauftragt und in diesem PR enthalten, einschließlich `with-region-bleed()` für Image, Header, Content und Footer. Das zugehörige ThemeJS2-Gegenstück ist PR #58. [geändert]

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

`default-style()` erhält **am Ende** der bestehenden Parameterliste `$gap: var(--nt-text-gap)`. Damit bleiben bestehende positionale Argumente zu Border, Bildformat, Overlay und Modifier-Registrierung korrekt zugeordnet. `--inner-padding` bleibt erhalten; `--gap` wird als unabhängige Card-API dokumentiert.

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

Keine Änderung am Shadow-DOM-Aufbau und keine neuen Slots sind für die normale Baseline notwendig. Den leeren verlinkten Host zusätzlich auf eine Phantom-Klickfläche prüfen. Der belegungsabhängige Zustand wird für Overlay- und horizontale Theme-Kompositionen aus den tatsächlichen Slots abgeleitet. [geändert]

### § 4.3 Automatische Helper

Analog zum beauftragten 2COL-Vertrag registriert der Card-Default seine vorhandenen Features unter dem aktuellen Style-Selektor auch mit kanonischen Namen:

| Klasse | Mixin | Bestehender Alias |
|---|---|---|
| `.with-image-fullsize` | `with-image-fullsize()` | `.img-fullsize` |
| `.with-image-overlay` | `with-image-overlay()` | `.img-overlay` |

Die Klassenregistrierung bindet dieselben Mixins ein und dupliziert keine Implementierung. `$modifierClasses: false` beziehungsweise `none` unterdrückt die gesamte Registrierung. Der reine Sass-Import erzeugt weiterhin kein CSS. Zusätzliche Reverse-/Alignment-APIs werden für diesen Abstandsfix nicht vorausgesetzt.

## § 5 Bilder und Sonderkompositionen

### § 5.1 Normale und natürliche Bilder

Normale Regionen werden durch ein Wrapper-Padding eingerückt. `with-region-bleed($region: image, $edges: all)` erweitert gezielt Image, Header, Content oder Footer bis zur inneren Rahmenkante; Klassen `.with-image-bleed`, `.with-header-bleed`, `.with-content-bleed` und `.with-footer-bleed` stehen automatisch bereit. Ein einzelnes Bild kann dadurch alle vier Rahmenkanten erreichen. [geändert]

Die Kantenwahl unterstützt `all`, `inline`, `block` sowie einzelne logische Kanten und Listen. `--inner-padding` muss für Bleed ein einzelner Längenwert sein. Seitliches Bleed wirkt unmittelbar; Block-Bleed nur bei einer tatsächlich äußeren Region. Funktionale Flags folgen der Slot-Belegung und verhindern, dass innere Gaps durch negative Margins verändert werden. Fullsize bleibt unabhängig davon. [neu]

### § 5.2 Overlay

Image und Content teilen eine randlose Grid-Fläche. Beide erhalten korrespondierendes Bleed; Content trägt innerhalb dieser Fläche `--inner-padding` als Textschutz. Header/Footer bleiben weitere Regionen innerhalb des Kartenrahmens und erhalten nur den gemeinsamen Gap. Ohne Bild wird das Overlay nicht aktiviert. [geändert]

Der abgeleitete Zustand `data-card-regions` spiegelt belegte Slots einschließlich reiner Textknoten. Die vorhandenen Slotchange-Callbacks aktualisieren diesen Zustand; zusätzliche Callback-Bindungen an Header/Content/Footer decken dynamische Änderungen ab. Theme-Grids können damit fehlende Tracks vermeiden. Autoren setzen diesen Zustand nicht selbst. [neu]

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

Die spätere Theme-Implementierung benötigt eine veröffentlichte kompatible NTE-Card-Version. Beide PRs enthalten jetzt die konkrete Implementierung; Paket-Releases werden damit nicht ausgelöst. [geändert]

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

Die Umsetzung folgt der Freigabe: Wrapper-Padding, eigener Gap, regionsbezogenes Bleed und automatisch registrierte Helper. ThemeJS2 erhält dieselbe API und verwendet Image-Bleed für bisher randlose Titelbilder. Avatare bleiben eingerückt. [geändert]

Sass- und Package-Prüfungen sowie die Browser-CI sind in der PR-Beschreibung dokumentiert. Der Browser-Test prüft explizite Slots, verlinkte Karten, dynamische Inhalte und Bleed-/Overlay-Geometrie. Ein blockierter Theme-Gesamtbuild wird nicht als erfolgreiche visuelle Abnahme ausgegeben. [geändert]
