


## Accordion Demo
{: layout="ntl-accordion" style="margin-top:2rem"}

### Summary 1

Text für die Details 1

### Summary 2

Text für die Details 2

### Summary 3

Text für die Details 3

---

## Accordion mit initialem Open
{: layout="ntl-accordion[initial-open-index='1']" style="margin-top:2rem"}

### Erstes Element

Dieser Text ist initial geschlossen.

### Zweites Element (initial offen)

Dieser Text ist initial geöffnet, da `initial-open-index="1"` gesetzt ist.

### Drittes Element

Dieser Text ist auch initial geschlossen.

---

## Exclusive Accordion
{: layout="ntl-accordion[exclusive='true']" style="margin-top:2rem"}

### Exklusiv Item 1

Nur ein Item kann gleichzeitig offen sein.

### Exklusiv Item 2

Wenn du dieses öffnest, schließt sich das andere.

### Exklusiv Item 3

Das gilt für alle Items in diesem Accordion.

---

## Accordion mit Plus/Minus Icons
{: layout="ntl-accordion[marker-icon='plus']" style="margin-top:2rem"}

### Plus Item 1

Dieses Accordion verwendet Plus/Minus Icons statt Chevrons.

### Plus Item 2

Das Icon wechselt zwischen + und - beim Öffnen/Schließen.

### Chevron Override
{: style="--marker-icon: chevron"}

Individuell auf Chevron zurückgesetzt via `style="--marker-icon: chevron"`.

---

## Accordion mit Marker links
{: layout="ntl-accordion[marker-position='start']" style="margin-top:2rem"}

### Marker Start 1

Bei diesem Accordion ist der Marker links positioniert.

### Marker Start 2

Das gilt für alle Items in diesem Accordion.

### Marker Start 3

Der Chevron zeigt nach rechts und rotiert beim Öffnen.

---

## Gemischte Marker-Icons
{: layout="ntl-accordion"}

### Chevron (Standard)

Standard Chevron-Icon durch Rotation.

### Plus/Minus Icon
{: style="--marker-icon: plus"}

Individuell auf Plus/Minus umgestellt via `style="--marker-icon: plus"`.

### Marker links positioniert
{: marker-position="start"}

Chevron links positioniert via `marker-position="start"`.
