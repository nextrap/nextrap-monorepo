---
name: nextrap-api-skill
description: Zentraler Einstieg für Auswahl und Verwendung öffentlicher Nextrap-Packages; vor konkreter API- oder Theme-Arbeit auf package-lokale Skills routen.
---

# Nextrap API Skill

Dieser Skill ist der zentrale Einstieg für die Verwendung des gesamten Nextrap-Monorepositories. Er ordnet Packages und öffentliche Oberflächen ein; package-lokale Usage- und Theming-Skills bleiben für konkrete Verträge verbindlich.

## Regeln

### § 1 Quellen und Paketwahl

§ 1.1 Für konkrete Markup-, API- oder Komponentenfragen ist zuerst der passende package-lokale `skills/*-usage/SKILL.md` zu lesen; für Theme-Arbeit gilt entsprechend `skills/*-theming/SKILL.md`. Fehlt ein lokaler Skill, sind öffentlicher Entrypoint, README, Tests und `.ai-usage-info.md` die nächsten Quellen.

§ 1.2 Cross-Package-Imports erfolgen über `@nextrap/<package>` und nicht über relative Pfade in andere Packages. Aus `dist/`, `node_modules/` oder generierten Artefakten wird keine öffentliche API abgeleitet, wenn Quell-Entrypoints verfügbar sind.

§ 1.3 Layouts werden für Markdown/Kramdown-Inhalte grundsätzlich zusammen mit `@trunkjs/content-pane` gedacht. Responsive Zustände werden über die vorhandene `@trunkjs/responsive`-Integration genutzt; Komponenten registrieren diese Infrastruktur nicht selbst.

### § 2 Styling

§ 2.1 Visuelle Defaults von `nte-*`- und `ntl-*`-Komponenten gehören in die äußere Theme-/Sass-Schicht. Shadow-DOM-CSS bleibt auf funktional notwendige Regeln begrenzt; vorhandene Parts, CSS-Variablen, Tokens und Mixins sind vor neuen Styling-Oberflächen zu verwenden.

§ 2.2 Bei Style-Packages ist `index.scss` die Sass-API ohne unbeabsichtigte globale Ausgabe; explizite Default-Ausgabe gehört in die dafür vorgesehene Output-Datei beziehungsweise den Aggregate-Mixin-Vertrag des Packages.

### § 3 Rückmeldung bei falscher Benutzungsinformation

§ 3.1 Ist Benutzungsinformation unklar, widersprüchlich oder nachweislich falsch, soll ein GitHub-Issue in `nextrap/nextrap-monorepo` angelegt werden. Das Issue nennt betroffene API, erwartetes Verhalten, beobachtetes Verhalten oder Missverständnis und möglichst ein reproduzierbares Beispiel. Solche Issues werden täglich gegen aktuellen Code, Tests, Exports und Repository-Regeln validiert und erst bei Bestätigung in diesen Skill übernommen.

## Paketübersicht

### @nextrap/nt-core – Gemeinsame Basis für Nextrap-Web-Components
Stellt Factory, Mixins und re-exportierte Browser-/Lit-Grundlagen für Nextrap-Komponenten bereit.

- `nextrap_element()` — erzeugt die gemeinsame Basisklasse mit konfigurierbaren Core-Features; für neue Nextrap-Elemente und Layouts.
- `SetDefaultStyleMixin` — setzt den automatischen Default-Style-Vertrag, sofern keine andere `style-*`-Variante aktiv ist.
- Re-Exports aus `@trunkjs/browser-utils`, `lit` und `lit/decorators.js` — gemeinsame Basisimporte für Komponenten; nur verwenden, wenn der Core-Vertrag dies vorsieht.

### @nextrap/nt-framework – Framework- und Integrationsgrundlagen
Bündelt gemeinsame Integrationshilfen; direkte Nutzung nur über den öffentlichen Entrypoint.

- Öffentlicher Entrypoint `src/index.ts` — exportiert die stabilen Framework-Hilfen; vor direkter Nutzung aktuellen Entrypoint prüfen.

### @nextrap/nt-meta – Metadaten für Organisation und Pakettypen
Stellt kleine Metadaten-Konstanten und Typinformationen für Nextrap-Pakete bereit.

- `nextrap` — Organisationsname als Konstante.
- `nextrapScope` — npm-Scope `@nextrap`.
- Exporte aus `package-type` — Pakettyp-Metadaten; für Generator-/Repository-Infrastruktur.

### @nextrap/nt-nx-generators – Nx-Generatoren für Nextrap-Packages
Erzeugt und migriert Package-Strukturen nach den aktuellen Nextrap-Konventionen.

- Generator-Entrypoints aus `src/index.ts` — für neue Packages und definierte Migrationen; Generator-Templates sind Strukturreferenz.

### @nextrap/nt-scope – Scope- und Laufzeithilfen
Kapselt Nextrap-spezifische Scope-Funktionen für Komponenten und Integrationen.

- Öffentliche Exporte aus `src/index.ts`/`src/lib/nt-scope.ts` — Scope-Hilfen; nur über den Package-Entrypoint importieren.

### @nextrap/nte-accordion – Accordion- und Disclosure-Komponenten
Für auf- und zuklappbare Inhaltsgruppen mit einzelnen Accordion-Einträgen.

- `NteAccordionElement` / `<nte-accordion>` — Container für Accordion-Einträge.
- `NteAccordionItemElement` / `<nte-accordion-item>` — einzelner Disclosure-Eintrag.
- Package-lokale Usage-/Theming-Skills — verbindlich für Attribute, Marker-Varianten, Parts und Sass-Mixins.

### @nextrap/nte-burger – Responsiver Disclosure-Button für Navigation
Für zugängliche Menüschalter, die Navigation oder Offcanvas-Inhalte öffnen und schließen.

- `NteBurger` / `<nte-burger>` — Burger-/Disclosure-Element.
- `toggle()` — schaltet den offenen Zustand programmatisch.
- `open`, `static-state`, `disabled`, `text`, `aria-controls`, `data-group-name` — zentrale öffentliche Zustände laut Usage-Skill.

### @nextrap/nte-card – Kartenkomponente für strukturierte Inhalte
Für wiederverwendbare Karten in Reihen, Grids und freien Inhaltsbereichen.

- `<nte-card>` — öffentliche Kartenkomponente; Slots, Varianten und Styling über den package-lokalen Vertrag verwenden.

### @nextrap/nte-consent-blocker – Consent-Blocker für eingebettete Inhalte
Verhindert das Laden oder Anzeigen zustimmungspflichtiger Inhalte bis zur Freigabe.

- `<nte-consent-blocker>` — kapselt consent-abhängige Inhalte; Konfiguration und Zustände dem Package-Vertrag entnehmen.

### @nextrap/nte-data-table – Datengetriebene Tabelle mit View-State
Rendert Objektarrays anhand einer Tabellendefinition und serialisierbarem Ansichtsstatus.

- `<nte-data-table>` — datengetriebene Tabellenkomponente.
- `TableDefinition` — beschreibt Spalten und Darstellung der Daten.
- `TableViewState` — hält serialisierbaren Ansichts-/Spaltenzustand.
- Für reine native Tabellenstruktur und Spalteninteraktionen `@nextrap/nte-table` verwenden.

### @nextrap/nte-demo-viewer – Nextrap-Demo-Integration
Bindet Nextrap-spezifische Demo-Darstellung in die Dokumentationsumgebung ein.

- `<nte-demo-viewer>` beziehungsweise Package-Entrypoint — Nextrap-Demooberfläche; Demo-Definitionen selbst nach `@trunkjs/demo-viewer` erstellen.

### @nextrap/nte-dialog – Dialog- und Modal-Komponente
Für modale oder dialogartige Interaktionen mit Nextrap-Styling und Content-Pane-Integration.

- `<nte-dialog>` und exportierte Dialogklasse — öffentlicher Dialog-Entrypoint; konkrete Steuerungs-API im package-lokalen Vertrag prüfen.

### @nextrap/nte-dialog-component – Basis für Dialog-Inhaltskomponenten
Für wiederverwendbare Komponenten, die innerhalb von Nextrap-Dialogen ausgeführt werden.

- Exportierte Dialog-Component-Basis — für spezialisierte Dialoginhalte; baut auf `@nextrap/nte-dialog` auf.

### @nextrap/nte-element-highlighter – Hervorhebung von DOM-Elementen
Für visuelles Markieren oder Fokussieren ausgewählter Elemente in Werkzeug- und UI-Flows.

- Öffentliche Exporte aus `src/index.ts` — Highlighter-Komponente/-Hilfen; Entrypoint für konkrete API prüfen.

### @nextrap/nte-feedback – Zentraler Feedback-Kanal für Anwendungen
Für Alerts, Rückfragen, Loading-/Progress-Zustände sowie Erfolgs- und Fehlermeldungen.

- `Feedback` — statische zentrale API für anwendungsweite Rückmeldungen.
- `<nte-feedback>` beziehungsweise exportierte Feedback-Komponenten — UI-Ausgabe des zentralen Kanals.
- Usage-Skill ist verbindlich für Alert-, Confirm-, Loading-, Progress-, Success- und Error-Aufrufe.

### @nextrap/nte-image – Bildkomponente für Nextrap-Inhalte
Für Bilder mit Nextrap-spezifischer Darstellung und Integrationsverhalten.

- `<nte-image>` beziehungsweise Exporte aus `src/index.ts` — öffentliche Bildoberfläche; Attribute und Parts im Package prüfen.

### @nextrap/nte-infiniscroll – Infinite-Scroll-Komponente
Für schrittweises Nachladen bei fortschreitendem Scrollen.

- `<nte-infiniscroll>` beziehungsweise Exporte aus `src/index.ts` — Scroll-/Load-Oberfläche; konkrete Events und Optionen aus Entrypoint/README beziehen.

### @nextrap/nte-input – Aktuelle Eingabe- und Formular-Komponente
Für neue Formularfelder; gegenüber `nte-input-old` die bevorzugte Implementierung.

- `<nte-input>` und exportierte Input-Typen/Plugins — aktuelle Eingabe-API.
- Typen aus `src/lib/types.ts` und Plugin-Vertrag aus `src/lib/plugin.ts` — für programmatische Erweiterung.

### @nextrap/nte-input-old – Legacy-Eingabekomponente
Nur für bestehende Kompatibilität oder Migration; nicht als Standard für neue Formulare.

- Legacy-Exporte aus `src/index.ts` — nur verwenden, wenn bestehender Code dies erfordert.

### @nextrap/nte-multiselect – Mehrfachauswahl für Formulare
Für Auswahl mehrerer Werte in einer einzelnen Eingabekomponente.

- `<nte-multiselect>` beziehungsweise Package-Entrypoint — öffentliche Mehrfachauswahl; Events und Value-Vertrag im Package prüfen.

### @nextrap/nte-nav – Navigation mit Untermenüs und Responsive-Komposition
Für Site-Navigation und verschachtelte Menüs; responsive Verschiebung bevorzugt mit TrunkJS.

- `<nte-nav>` und exportierte Navigationsklassen — Navigationsoberfläche.
- Package-lokaler Usage-Skill — verbindlich für Untermenüs und Zusammenspiel mit `@trunkjs/element-relocator`, Burger und Offcanvas.

### @nextrap/nte-navbar – Mehrzeilige Site-Header-/Navbar-Komponente
Für Header mit Start-, Center- und End-Bereichen sowie Sticky/Fixed- und Collapse-Verhalten.

- `<nte-navbar>` — Navbar-Container.
- Öffentliche Zustände für Platzierung, Scroll-Collapse und Shrink — dem Usage-Skill entnehmen.
- Für Navigationselemente innerhalb der Navbar `@nextrap/nte-nav` verwenden.

### @nextrap/nte-offcanvas – Offcanvas- und Drawer-Komponente
Für seitlich ein-/ausblendbare Inhalte, häufig als mobile Navigation.

- `<nte-offcanvas>` und Exporte aus `src/index.ts` — Drawer-Oberfläche; Zustände/Events im Usage-Vertrag prüfen.

### @nextrap/nte-parallax-bg – Parallax-Hintergrund
Für dekorative Hintergrundbewegung relativ zum Scrollverlauf.

- `<nte-parallax-bg>` und Package-Entrypoint — Parallax-Oberfläche; nur für Präsentation, nicht für essentielle Inhalte.

### @nextrap/nte-privacy-consent – Consent-Verwaltung für Scripts und Embeds
Für deklarativ geschützte Drittinhalte und die zugehörige Consent-Dialog-Konfiguration.

- `<nte-privacy-consent>` — zentrale Consent-Komponente.
- Deklarative Script-/Embed-Konfiguration — für Inhalte, die erst nach Zustimmung aktiviert werden dürfen.
- Usage-Skill ist verbindlich für Dialog-API und Consent-Gruppen.

### @nextrap/nte-progress – Fortschrittsanzeige in mehreren Darstellungen
Für determinate, kreisförmige, schrittweise, gestreifte und animierte Progress-Anzeigen.

- `<nte-progress>` / exportierte Progress-Klasse — Fortschrittskomponente.
- `progress-changed`, `step-changed`, `completed` — öffentliche Ereignisse laut Usage-Skill.

### @nextrap/nte-scroll-to-top – Scroll-zum-Seitenanfang-Steuerung
Für einen zugänglichen Rücksprung zum Anfang langer Seiten.

- `NteScrollToTop` / `<nte-scroll-to-top>` — öffentliche Komponente und programmatische API.

### @nextrap/nte-scrollspy – Aktive Sektion anhand des Scrollstands
Für Navigationen oder Anzeigen, die der aktuell sichtbaren Inhaltssektion folgen.

- `<nte-scrollspy>` beziehungsweise Exporte aus `src/index.ts` — Scrollspy-Oberfläche; Events/Target-Vertrag im Package prüfen.

### @nextrap/nte-slider – Slider- und Carousel-Komponente
Für horizontal oder sequenziell dargestellte Inhaltsgruppen.

- `<nte-slider>` beziehungsweise Package-Entrypoint — Slider-Oberfläche; Slots, Navigation und Styling im Package-Vertrag prüfen.

### @nextrap/nte-spinner – Ladeindikator
Für kompakte visuelle Anzeige laufender, nicht determiniert fortschreitender Arbeit.

- `NteSpinnerElement` / `<nte-spinner>` — öffentlicher Spinner laut Usage-Skill.

### @nextrap/nte-split-view – Geteilte Ansichten
Für zwei oder mehr Bereiche mit einer Split-View-Interaktion.

- `<nte-split-view>` beziehungsweise Exporte aus `src/index.ts` — Split-View-Oberfläche; Größen-/Interaktionsvertrag im Package prüfen.

### @nextrap/nte-stepper – Schrittweiser Wizard-/Prozessablauf
Für mehrstufige Abläufe mit aktuellem Schritt und Navigation zwischen Schritten.

- `<nte-stepper>` beziehungsweise Exporte aus `src/index.ts` — Stepper-Oberfläche; Schrittmodell und Events im Package prüfen.

### @nextrap/nte-table – Native Tabellenbasis mit Spaltenzuständen
Für native Light-DOM-Tabellen mit scrollbarem Body, fixierten Bereichen und Auswahl.

- `<nte-table>` — Table-Viewport um die native Tabelle.
- Spaltenzustände — Breite, Sichtbarkeit und angeheftete führende Spalten.
- Programmatische Auswahl/Remote — für Auswahlsteuerung; Details im Usage-Skill.

### @nextrap/nte-theme-switcher – Umschalter für Theme-Zustände
Für Benutzerwahl zwischen verfügbaren Themes oder Farbschemata.

- `<nte-theme-switcher>` und Package-Entrypoint — Theme-Schalter; konkrete Werte und Persistenz im Package prüfen.

### @nextrap/nte-tree-node – Knoten für hierarchische Baumdarstellung
Für verschachtelte Tree-/Node-Strukturen mit expandierbaren Hierarchien.

- `<nte-tree-node>` beziehungsweise Exporte aus `src/index.ts` — öffentlicher Knoten; Child-/State-Vertrag im Package prüfen.

### @nextrap/ntl-2col – Zwei-Spalten-Layout und Layout-Referenz
Für zweispaltige Content-Pane-Seiten mit responsiver Anordnung.

- `<ntl-2col>` / exportierte Layout-Komponente — zwei Inhaltsbereiche.
- Markup als Markdown/Kramdown mit `{: layout="..."}`; package-lokalen Usage-Skill für Slot-/Content-Zuordnung lesen.

### @nextrap/ntl-card-grid – Grid-Layout für Karten
Für mehrere Cards in einem responsiven Raster.

- `<ntl-card-grid>` beziehungsweise Package-Entrypoint — Grid-Layout; Content-Pane-Markup und Theme-Mixins im Package prüfen.

### @nextrap/ntl-card-row – Reihenlayout für Karten
Für Cards in einer horizontalen/ responsiv umbrechenden Reihe.

- `<ntl-card-row>` / Exporte aus `src/index.ts` — Card-Row-Layout.
- `@nextrap/nte-card` — vorgesehene Kartenkomponente innerhalb des Layouts.

### @nextrap/ntl-footer – Footer-Layout
Für strukturierte Footer-Inhalte in Content-Pane-basierten Seiten.

- `<ntl-footer>` beziehungsweise Package-Entrypoint — Footer-Layout; responsive Zustände über die vorhandene Responsive-Infrastruktur.

### @nextrap/ntl-form – Formularlayout und Formatierung
Für strukturierte Formularbereiche und Layout-Formatierung.

- `<ntl-form>` — Hauptlayout für Formulare.
- `<ntl-form-format>` — exportierte Formatierungskomponente.
- Für Eingaben `@nextrap/nte-input` verwenden; Markup über Content-Pane-Konventionen schreiben.

### @nextrap/ntl-hero – Hero- und Header-Layout
Für große Einstiegs-/Headerbereiche einer Seite.

- `<ntl-hero>` / exportierte Hero-Komponente — Hero-Layout; Content-Zuordnung und Theme-Vertrag package-lokal prüfen.

### @nextrap/style-base – Globale Design-Tokens ohne visuelle Seiteneffekte
Definiert `--nt-*`-Tokens und Theme-Erzeugung als gemeinsame Styling-Basis.

- CSS-Custom-Properties `--nt-*` — zentrale Design-Tokens.
- Sass-API über `index.scss` — darf beim Import keine globalen visuellen Regeln emittieren.

### @nextrap/style-button – Wiederverwendbare Button-Styles
Stellt Sass-Mixins für konsistente Button-Darstellung bereit.

- Öffentliche Button-Mixins — in Themes/Komponenten verwenden statt Button-Regeln zu duplizieren.

### @nextrap/style-elements – Wiederverwendbare Elementmuster
Bündelt visuelle Muster wie Prose, Tabellen, Listen und Container.

- Element-Mixins und Aggregate-Mixin — für wiederverwendbare visuelle Baselines; Theme-Vertrag beachten.

### @nextrap/style-reset – Shadow-DOM-sicherer Reset
Setzt Elemente auf eine konsistente Basis zurück, besonders in Web Components.

- Reset-Sass/CSS-Entrypoint — als funktionale Basis in Komponenten verwenden, ohne Theme-Regeln zu ersetzen.

### @nextrap/style-switch – Zugängliche Switch-Styles
Stellt Styling-Mixins für Schalter-/Toggle-Oberflächen bereit.

- Switch-Mixins — für zugängliche Schalterdarstellung in Themes und Komponenten.

### @nextrap/style-typography – Typografie und vertikaler Rhythmus
Definiert Textdarstellung einzelner Typografieelemente, aber kein Seiten-/Section-Layout.

- Typografie-Mixins — für Überschriften, Text und vertikalen Rhythmus; keine Seitenabstände hier verankern.

### @nextrap/style-utils – Atomare Utility-Mixins
Stellt mixin-basierte Utilities für Abstand, Display, Flex, Farben und ähnliche Einzelaufgaben bereit.

- Einzelne Utility-Mixins — gezielt in Themes zusammensetzen.
- `style-utils()` — Aggregate-Mixin für die vorgesehene Utility-Ausgabe.
