# Komponenten-Style- und Responsive-Konfiguration

## Ziel

Nextrap-Komponenten sollen so aufgebaut sein, dass sie mit dem TrunkJS Responsive Framework zusammenarbeiten können, ohne das Framework direkt vorauszusetzen oder selbst Breakpoint-Logik zu implementieren. Die Komponenten müssen also responsiv steuerbar sein, dürfen aber nicht davon abhängen, dass TrunkJS Responsive zwingend verwendet wird.

Breakpoint-Logik gehört nicht in einzelne `nte-*`-Elemente. Insbesondere sind komponentenlokale CSS-Media-Queries sowie eigene `matchMedia`-/Breakpoint-Listener in `nte-*` verboten. Stattdessen muss ein `nte-*`-Element so gestaltet sein, dass externe responsive Steuerung über `class` und `style` seine wirksamen CSS-Variablen beziehungsweise Styles verändern kann.

**So nicht:**

```css
@media (min-width: 1200px) {
  nte-example {
    --width: 33.333%;
  }
}
```

oder eine eigene Breakpoint-Auswertung mit `matchMedia(...)` im Element.

**So:** Ein externer Responsive-Layer kann bei Bedarf die Klasse beziehungsweise den Style am Element verändern, zum Beispiel mit TrunkJS Responsive über Klassen nach dem Muster `-xl:col-12 xl:col-4`, oder indem bei `xl` direkt die relevanten CSS-Variablen im `style` des Elements gesetzt werden. Das `nte-*`-Element kennt den Breakpoint nicht selbst, sondern liest nur den daraus resultierenden wirksamen Style.

Der vorgesehene Integrationsweg ist:

`optionaler Responsive-Layer -> class/style am Element -> CSS-Variablen / wirksamer Style -> Komponentenlogik`

### Ausnahme für Layout-Elemente

Nur `ntl-*`-Layout-Elemente dürfen eigene Breakpoint-Logik enthalten. Der Umschaltpunkt wird dabei über die öffentliche CSS-Variable `--breakpoint` gesteuert. Die Breakpoint-Logik bleibt damit Bestandteil des Layout-Contracts und darf nicht auf normale `nte-*`-Elemente übertragen werden.

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

Damit können Theme-Klassen sowie ein optional eingesetzter Responsive-Layer das Komponentenverhalten ändern, ohne das Element neu zu erzeugen.

Geerbte CSS-Variablen auf Vorfahren ändern nicht zwingend `class` oder `style` am Host-Element. Muss eine Komponente auf solche Änderungen sofort reagieren, ist der projektweite Theme-/Style-Refresh-Contract oder ein expliziter Style-Refresh-Einstieg zu verwenden. Ein reiner Host-`MutationObserver` erkennt keine beliebigen Style-Änderungen auf Vorfahren.

## Responsive-Verhalten

`nte-*`-Elemente dürfen keine eigene Breakpoint-Auswertung besitzen. Sie stellen nur die responsive Steuerungsoberfläche über `class`, `style`, öffentliche CSS-Variablen und den daraus resultierenden wirksamen Style bereit. Welcher externe Mechanismus diese Werte ändert, ist nicht Bestandteil des Elements; TrunkJS Responsive ist der vorgesehene kompatible Responsive-Layer, aber keine zwingende Laufzeitabhängigkeit.

Für DOM-Verschiebung, Orientierung, Sichtbarkeit, Darstellungswerte und ähnliche responsive Komposition kann TrunkJS Responsive beziehungsweise ein dazugehöriger Mechanismus wie Element Relocator verwendet werden. Die Nextrap-Komponente implementiert dafür keine zweite Breakpoint-Logik.

## Review-Checkliste

- Ist der Wert semantischer oder funktionaler Zustand? Dann ist ein Attribut beziehungsweise eine Property passend.
- Ist der Wert Darstellung, Layout oder responsive Konfiguration? Dann ist eine CSS-Variable beziehungsweise der wirksame Style zu bevorzugen.
- Ist ein `nte-*`-Element breakpointabhängig? Dann muss es über externe `class`-/`style`-Änderungen steuerbar sein; keine Media Query, kein `matchMedia` und keine eigene Breakpoint-Logik in der Komponente.
- Ist es ein `ntl-*`-Layout mit eigenem Layout-Umschaltpunkt? Dann darf dessen Breakpoint-Logik über `--breakpoint` gesteuert werden.
- Benötigt JavaScript den Wert? Dann den wirksamen berechneten Style lesen.
- Kann der Wert über responsive oder Theme-Klassen wechseln? Dann Host-`class` und `style` beobachten und abhängige Berechnungen aktualisieren.
- Kann der Wert nur über geerbte Variablen auf Vorfahren wechseln? Dann bei notwendiger Sofortsynchronisierung den Projekt-Refresh-Contract verwenden.
- Wird derselbe Darstellungswert doppelt exponiert? Dann die parallele API entfernen.
