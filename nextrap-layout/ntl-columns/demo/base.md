# NTL Columns

Verändere die Viewport-Breite, um die Varianten zu prüfen.

## 1. Drei Spalten
{: layout="ntl-columns" section-class="lg:desktop"}

### Hauptinhalt

Ohne Slot bleibt dieser Inhalt im Center (Gewicht 6).

### Start
{: section-slot="start"}

Dieser Inhalt steht mobil vor Center (Gewicht 4).

### Hinweis
{: section-class="aside"}

Die Klasse aside weist den Inhalt automatisch End zu (Gewicht 4).

## 2. Reverse
{: layout="ntl-columns" section-class="lg:desktop xl:reverse"}

### Center

Ab XL tauschen Start und End ihre Position.

### Start
{: section-slot="start"}

Normalerweise links oder oben.

### End
{: section-slot="end"}

Normalerweise rechts oder unten.

## 3. Leere Start-Spalte erst ab XXL beibehalten
{: layout="ntl-columns" section-class="lg:desktop xxl:preserve-empty"}

### Center

Mobil steht Center über End. Ab LG teilen sich Center und End die Breite
im Verhältnis 6:4. Ab XXL bleibt Start zusätzlich als leerer Platzhalter.

### End
{: section-class="aside"}

Diese Hinweisbox bleibt auf allen Breakpoints sichtbar.

## 4. Responsive Sichtbarkeit und eigene Gewichte
{: layout="ntl-columns" section-class="lg:desktop"}

### Center
{: section-style="--grid-cols: 8"}

Der Center erhält Gewicht 8.

### Start
{: section-slot="start" section-class="xl:d-none" section-style="--grid-cols: 2"}

Dieser Inhalt verschwindet ab XL; seine Spalte beansprucht keinen Platz mehr.

### End
{: section-slot="end" section-style="--grid-cols: 2"}

Der End-Slot erhält Gewicht 2. Ab XL wird seine Breite gemeinsam mit
Center neu verteilt.

## 5. Ausschließlich Center
{: layout="ntl-columns" section-class="desktop"}

### Hauptinhalt

Beide Seitenspalten sind leer. Der Center füllt die gesamte Breite.
