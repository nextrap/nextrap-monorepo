# Komponenten-Style- und Responsive-Konfiguration

## Ziel

Nextrap-Komponenten sollen so aufgebaut sein, dass sie mit dem TrunkJS Responsive Framework zusammenarbeiten können, ohne das Framework direkt vorauszusetzen. Normale `nte-*`-Elemente enthalten keine eigene Breakpoint-Logik. Responsive Änderungen müssen von außen über `class` und `style` steuerbar sein, sodass TrunkJS Responsive oder ein anderer externer Layer den wirksamen Style verändern kann.

Dieser Contract gilt ausdrücklich auch innerhalb des Shadow DOM und für die Default-Designs beziehungsweise Default-Styles von Komponenten: Dort dürfen keine Media Queries zur responsiven Umschaltung eingebaut werden. Ebenso gehören `matchMedia` oder eigene Breakpoint-Listener nicht in `nte-*`-Elemente.

Ein responsiver Zustand wird stattdessen über Klassen oder Styles ausgedrückt. Beispiel mit einer responsiven Klasse:

```html
<nte-example class="xl:wide"></nte-example>
```

Die Klasse verändert den wirksamen Style beziehungsweise die dafür vorgesehenen CSS-Variablen; das Element selbst wertet `xl` nicht aus. Alternativ kann der externe Responsive-Layer breakpointabhängig CSS-Variablen direkt über `style` setzen.

Der vorgesehene Integrationsweg ist:

`optionaler Responsive-Layer -> class/style am Element -> CSS-Variablen / wirksamer Style -> Komponentenlogik`

## Demos und Beispiele

Responsive Klassen und Styles werden in Demos und Beispielen exakt so verwendet, wie sie später auch im realen Markup eingesetzt werden. Eine Demo darf für Responsiveness keine abweichende Sonderlogik, keine Media Query und keine eigene Breakpoint-Auswertung einführen.

Damit die responsive Syntax in einer Demo tatsächlich ausgewertet wird, muss die Demo `@trunkjs/responsive` importieren und den responsiv gesteuerten Inhalt mit `<tj-responsive>` umschließen. Das entspricht dem bestehenden Demo-Muster im Repository.

Beispiel:

```ts
import '@trunkjs/responsive';

root.innerHTML = `
  <tj-responsive>
    <nte-example class="xl:wide" style="--cols: 3" style-xl="--cols: 5"></nte-example>
  </tj-responsive>
`;
```

Auch bei reinen HTML-Demos gilt dasselbe Wrapper-Muster:

```html
<tj-responsive>
  <nte-example class="xl:wide"></nte-example>
</tj-responsive>
```

Der Wrapper gehört nur zur Demo- beziehungsweise Seitenintegration des Responsive Frameworks. Die `nte-*`-Komponente selbst darf weder `<tj-responsive>` voraussetzen noch TrunkJS Responsive direkt importieren.

## Layout-Ausnahme

Nur `ntl-*`-Layout-Elemente dürfen eigene Breakpoint-Logik enthalten. Der Umschaltpunkt wird über die öffentliche CSS-Variable `--breakpoint` gesteuert. Für die Auswertung ist der vorhandene `BreakPointMixin` aus `@trunkjs/browser-utils` zu verwenden; Nextrap bindet ihn über die `breakpoints`-Feature-Option von `nextrap_element(...)` ein. Der Mixin reflektiert den ausgewerteten Zustand als `mode="mobile"` beziehungsweise `mode="desktop"`. Diese Ausnahme ist ausschließlich für Layout-Komponenten vorgesehen und darf nicht auf normale `nte-*`-Elemente übertragen werden.

## Styling-Konfiguration

Properties und Attribute sind nicht für Styling oder reine Darstellungskonfiguration vorgesehen. Darstellungswerte werden über CSS, insbesondere öffentliche CSS-Variablen, konfiguriert. Statt beispielsweise eine rein visuelle Spaltenzahl als `rows="5"` oder Property zu modellieren, wird der Darstellungswert als CSS-Variable gesetzt:

```html
<nte-example style="--cols: 5"></nte-example>
```

Semantischer, funktionaler oder zugänglichkeitsrelevanter Zustand bleibt dagegen eine gültige Aufgabe von Attributen und Properties. Dazu gehören beispielsweise `disabled`, `open`, `aria-*`, IDs, Zielreferenzen und Domain-Werte; solche Werte können von einer Komponente bei Bedarf an interne Elemente weitergereicht werden.

Wenn JavaScript einen Darstellungswert für Verhalten oder Berechnungen benötigt, wird der wirksame Wert aus dem berechneten Style gelesen, bevorzugt über den projektüblichen Component-Style-Helper, andernfalls über `getComputedStyle(...)`. Ein CSS-basierter Darstellungswert wird nicht zusätzlich als parallele Property- oder JavaScript-Konfiguration geführt.

Wenn JavaScript-Verhalten von berechneter CSS-Konfiguration abhängt, muss die Komponente Änderungen ihrer eigenen Attribute `class` und `style` beobachten und danach die abhängigen Werte neu lesen. Geerbte CSS-Variablen auf Vorfahren erfordern bei notwendiger Sofortsynchronisierung den projektweiten Theme-/Style-Refresh-Contract beziehungsweise einen expliziten Style-Refresh-Einstieg.

## Review-Checkliste

- Ist der Wert semantischer, funktionaler oder zugänglichkeitsrelevanter Zustand? Dann Attribut beziehungsweise Property verwenden, zum Beispiel `disabled`, `open` oder `aria-expanded`.
- Ist der Wert reine Darstellung oder Layoutkonfiguration? Dann CSS beziehungsweise eine CSS-Variable verwenden, zum Beispiel `style="--cols: 5"` statt einer Styling-Property oder eines Styling-Attributs.
- Soll ein `nte-*`-Element responsiv reagieren? Dann die Änderung über externe `class`-/`style`-Steuerung ermöglichen, zum Beispiel `class="xl:wide"`; das Element selbst wertet keinen Breakpoint aus.
- Zeigt eine Demo responsives Verhalten? Dann dieselbe responsive `class`-/`style`-Syntax wie im realen Markup verwenden, `@trunkjs/responsive` importieren und den Demo-Inhalt mit `<tj-responsive>` umschließen.
- Enthält das Shadow DOM oder ein Default-Design einer `nte-*`-Komponente eine responsive Media Query? Dann entfernen; Media Queries sind dort nicht zulässig.
- Enthält ein `nte-*`-Element `matchMedia`, einen Breakpoint-Listener oder sonstige eigene Breakpoint-Logik? Dann entfernen und den Zustand über die externe Responsive-Steuerungsoberfläche ausdrücken.
- Ist es ein `ntl-*`-Layout mit eigenem Layout-Umschaltpunkt? Dann `--breakpoint` zusammen mit dem vorhandenen `BreakPointMixin` verwenden; keine eigene parallele Breakpoint-Auswertung bauen.
- Benötigt JavaScript einen Darstellungswert? Dann den wirksamen berechneten Style lesen und keine parallele Property-/JS-Konfiguration anlegen.
- Kann ein JS-relevanter Style über `class` oder `style` wechseln? Dann Änderungen beobachten und abhängige Berechnungen aktualisieren.
