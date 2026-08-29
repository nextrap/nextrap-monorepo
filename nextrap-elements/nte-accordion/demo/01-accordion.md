# NTE Accordion
{: layout="1;.nte-accordion-demo"}

Das Accordion eignet sich für FAQ- und Detailbereiche innerhalb eines bestehenden Layouts. Die Beispiele sind direkt im `trunkjs/content-pane`-Markdown-Format geschrieben.

## Standard
{: layout=".demo-card"}

---
{: layout="nte-accordion[initial-open-index='0'][exclusive]"}

### Was macht nte-accordion?

Direkte Abschnitte werden zu zugänglichen, aufklappbaren Accordion-Items.

### Wie wird ein Eintrag geöffnet?

Ein Klick auf die Überschrift ändert den reflektierten `open`-Zustand des Items.

### Woher kommt das Styling?

Das visuelle Styling wird über die öffentliche Sass-API und Shadow Parts eingebunden.

## Mehrere offene Einträge
{: layout=".demo-card"}

Ohne `exclusive` können mehrere Einträge gleichzeitig geöffnet bleiben.

---
{: layout="nte-accordion[initial-open-index='1']"}

### Überblick

Dieser Eintrag ist zunächst geschlossen.

### Technische Daten

Dieser Eintrag ist über `initial-open-index="1"` anfangs geöffnet.

### Downloads

Beim Öffnen bleibt der vorherige Eintrag ebenfalls offen.

## Marker links als Plus und Minus
{: layout=".demo-card"}

---
{: layout="nte-accordion.marker-start.marker-plus[initial-open-index='0'][marker-position='start'][marker-icon='plus']"}

### Versand

Der Marker steht links und zeigt im geschlossenen Zustand ein Plus.

### Zahlung

Im geöffneten Zustand wechselt der Marker zum Minus.

## Kompakte Theme-Komposition
{: layout=".demo-card.demo-compact"}

---
{: layout="nte-accordion[initial-open-index='0']"}

### Erste Frage

Der umgebende Demo-Block komponiert kleinere Padding-Werte über die Sass-API.

### Zweite Frage

Das Markup bleibt dabei identisch und kann direkt in Content-Markdown übernommen werden.
