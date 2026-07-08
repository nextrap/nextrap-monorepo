# ntl-accordion
{: layout="1;.container"}

Diese Demo zeigt `ntl-accordion` als eingebettetes Layout-Element. Das Accordion bringt keine äußeren Abstände mit; Abstand, Container und Cards kommen vom umgebenden Element.

## Standard im umgebenden Block
{: layout="1;.demo-card"}

### FAQ
{: layout="ntl-accordion.default"}

#### Was macht ntl-accordion?

Es gruppiert direkte `section`-Kinder beziehungsweise Markdown-Abschnitte als aufklappbare `ntl-accordion-item` Elemente.

#### Woher kommt das Styling?

Das funktionale Shadow-DOM-CSS bleibt klein. Das visuelle Standard-Styling wird über `accordion.default-style()` im Light DOM gesetzt.

#### Darf außen Abstand gesetzt werden?

Ja. Außenabstände sollten vom Parent-Layout kommen, weil das Accordion typischerweise in Cards, Spalten oder Content-Sections eingesetzt wird.

## Initial geöffnet und exklusiv
{: layout="1;.demo-card"}

### Produktdetails
{: layout="ntl-accordion.default[initial-open-index='1'][exclusive='true']"}

#### Überblick

Dieses Item ist zu Beginn geschlossen.

#### Technische Daten

Dieses Item ist initial geöffnet, weil `initial-open-index="1"` gesetzt ist.

#### Downloads

Wenn ein anderes Item geöffnet wird, schließt sich dieses im exklusiven Modus.

## Marker-Varianten
{: layout="1;.demo-card"}

### Marker links
{: layout="ntl-accordion.default.marker-start[marker-position='start']"}

#### Versand

Der Marker wird links angezeigt. Das Attribut wird an die Items weitergereicht.

#### Zahlung

Die Klasse `.marker-start` zeigt dieselbe Variante für rein CSS-basierte Theme-/Demo-Styles.

### Plus/Minus
{: layout="ntl-accordion.default.marker-plus[marker-icon='plus']"}

#### Geschlossenes Icon

Im geschlossenen Zustand wird ein Plus angezeigt.

#### Offenes Icon

Im geöffneten Zustand wird ein Minus angezeigt.

## Kompakte Variante im Parent
{: layout="1;.demo-card.demo-compact"}

### Kompakte FAQ
{: layout="ntl-accordion.default"}

#### Erste Frage

Der Parent `.demo-compact` bindet `default-style()` mit kleineren Padding-Werten ein.

#### Zweite Frage

So bleiben Varianten außerhalb der Komponente und können später im Theme ersetzt werden.
