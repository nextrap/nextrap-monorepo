# Komponenten-Style- und Responsive-Konfiguration

## Ziel

Nextrap arbeitet bei Responsiveness immer mit dem TrunkJS Responsive Framework zusammen. Breakpoint-Logik wird deshalb nicht innerhalb einzelner Nextrap-Komponenten neu implementiert. Insbesondere sind komponentenlokale CSS-Media-Queries und parallele `matchMedia`-/Breakpoint-Listener in Nextrap verboten.

Für `nte-*`-Elemente wird Responsiveness von außen über TrunkJS Responsive gesteuert. Das Framework setzt breakpointabhängig Klassen und/oder Styles direkt am Element; diese ändern die wirksamen CSS-Variablen beziehungsweise Styles, die das Element anschließend konsumiert. Ein Element soll also nicht selbst wissen müssen, welcher Projekt-Breakpoint gerade aktiv ist.

**So nicht:**

```css
@media (min-width: 1200px) {
  nte-example {
    --width: 33.333%;
  }
}
```

oder eine eigene Breakpoint-Auswertung mit `matchMedia(...)` im Element.

**So:** TrunkJS Responsive steuert die Klasse beziehungsweise den Style am Element, zum Beispiel über responsive Klassen nach dem Muster `-xl:col-12 xl:col-4`, oder setzt bei `xl` direkt die für das Element relevanten CSS-Variablen im `style`. Das `nte-*`-Element liest nur den daraus resultierenden wirksamen Style.

Der beabsichtigte Datenfluss ist:

`TrunkJS Responsive -> class/style am Element -> CSS-Variablen / wirksamer Style -> Komponentenlogik`

### Ausnahme für Layout-Elemente

`ntl-*`-Layout-Elemente dürfen einen eigenen Layout-Umschaltpunkt als öffentliche CSS-Variable `--breakpoint` anbieten. Diese Variable beschreibt ausschließlich den Layout-Contract des jeweiligen Layout-Elements. Sie ist keine Erlaubnis, beliebige Media Queries in Nextrap-Komponenten einzuführen.

## Attribute/Properties gegenüber CSS-Konfiguration

HTML-Attribute und Component-Properties sind für semantischen, funktionalen und Anwendungszustand vorgesehen, zum Beispiel `disabled`, `open`, `aria-*`, IDs, Zielreferenzen und Domain-Werte.

Darstellungs-, Layout-, Positionierungs-, Animations- und responsive Konfiguration soll bevorzugt über öffentliche CSS-Variablen erfolgen. Typische Beispiele sind Größen, Abstände, Sticky-/Fixed-Positionierung, Scroll-Schwellen, Overlay-Verhalten oder Collapse-/Shrink-Werte.

Derselbe Darstellungswert soll nicht parallel als HTML-/Property-API und als CSS-Variable angeboten werden. Es gibt genau eine wirksame Quelle.

## Style-Konfiguration in JavaScript lesen

Wenn JavaScript einen Darstellungswert für Verhalten oder Berechnungen benötigt, wird der wirksame Wert aus dem berechneten Style der Komponente gelesen, bevorzugt über den projektüblichen Component-Style-Helper, andernfalls über `getComputedStyle(...)`.

Ein CSS-basierter Wert darf nicht nur aus Bequemlichkeit in ein separates JavaScript-Konfigurationsobjekt gespiegelt werden. Der berechnete Style bleibt die wirksame Quelle.

CSS-Werte müssen defensiv geparst und validiert werden. Für fehlende oder ungültige Werte ist ein sicherer Komponenten-Default vorzusehen.

## Änderungen zur Laufzeit

Wenn JavaScript-Verhalten von berechneter CSS-Konfiguration abhängt, muss die Komponente Änderungen ihrer eigenen Attribute `class` und `style` beobachten. Nach einer Änderung wird die wirksame Style-Konfiguration neu gelesen und alle davon abhängigen internen Berechnungen beziehungsweise Zustände werden aktualisiert.

Damit können Theme-Klassen sowie TrunkJS-Responsive-Klassen und -Styles das Komponentenverhalten ändern, ohne das Element neu zu erzeugen.

Geerbte CSS-Variablen auf Vorfahren ändern nicht zwingend `class` oder `style` am Host-Element. Muss eine Komponente auf solche Änderungen sofort reagieren, ist der projektweite Theme-/Style-Refresh-Contract oder ein expliziter Style-Refresh-Einstieg zu verwenden. Ein reiner Host-`MutationObserver` erkennt keine beliebigen Style-Änderungen auf Vorfahren.

## Responsive-Verhalten

Für `nte-*`-Elemente gehört die Entscheidung, **wann** eine breakpointabhängige Änderung gilt, ausschließlich in das TrunkJS Responsive Framework. Das Framework setzt die passende Klasse oder den passenden Style; die Komponente reagiert nur auf den daraus entstehenden wirksamen Zustand.

Für DOM-Verschiebung, Orientierung, Sichtbarkeit, Darstellungswerte und ähnliche responsive Komposition sind die vorgesehenen TrunkJS-Responsive-Mechanismen und -Komponenten zu verwenden, zum Beispiel Element Relocator, statt eine zweite Responsive-Implementierung innerhalb der Nextrap-Komponente aufzubauen.

## Review-Checkliste

- Ist der Wert semantischer oder funktionaler Zustand? Dann ist ein Attribut beziehungsweise eine Property passend.
- Ist der Wert Darstellung, Layout oder responsive Konfiguration? Dann ist eine CSS-Variable beziehungsweise der wirksame Style zu bevorzugen.
- Ist ein `nte-*`-Element breakpointabhängig? Dann steuert TrunkJS Responsive dessen `class`/`style`; keine Media Query und kein `matchMedia` in der Komponente.
- Ist es ein `ntl-*`-Layout mit eigenem Layout-Umschaltpunkt? Dann darf der Layout-Contract `--breakpoint` verwenden.
- Benötigt JavaScript den Wert? Dann den wirksamen berechneten Style lesen.
- Kann der Wert über responsive oder Theme-Klassen wechseln? Dann Host-`class` und `style` beobachten und abhängige Berechnungen aktualisieren.
- Kann der Wert nur über geerbte Variablen auf Vorfahren wechseln? Dann bei notwendiger Sofortsynchronisierung den Projekt-Refresh-Contract verwenden.
- Wird derselbe Darstellungswert doppelt exponiert? Dann die parallele API entfernen.
