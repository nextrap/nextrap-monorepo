# NTL Columns

Verändere die Viewport-Breite, um die Varianten zu prüfen.

## 1. Drei Spalten
{: layout="ntl-columns"}

### Hauptinhalt

Ohne Slot bleibt dieser Inhalt im Center (Gewicht 6). Das Layout schaltet
standardmäßig ab LG automatisch auf Desktop um.

### Start
{: section-slot="start"}

Dieser Inhalt steht mobil vor Center (Gewicht 4).

### Hinweis
{: section-class="aside"}

Die Klasse aside weist den Inhalt automatisch End zu (Gewicht 4).

## 2. Reverse
{: layout="ntl-columns" section-class="xl:reverse" section-style="--breakpoint: md, xl;"}

### Center

Unter MD gilt Mobile, ab MD Tablet (weiterhin gestapelt), ab XL Desktop.
Ab XL tauschen Start und End zusätzlich ihre Position.

### Start
{: section-slot="start"}

Normalerweise links oder oben.

### End
{: section-slot="end"}

Normalerweise rechts oder unten.

## 3. Leere Start-Spalte erst ab XXL beibehalten
{: layout="ntl-columns" section-class="lg:desktop xxl:preserve-empty" section-style="--breakpoint: xxl;"}

### Center

Mobil steht Center über End. Die Klasse `lg:desktop` überschreibt den
auf XXL gesetzten automatischen Breakpoint. Ab LG teilen sich die Regionen die Breite
im Verhältnis 6:4. Ab XXL bleibt Start zusätzlich als leerer Platzhalter.

### End
{: section-class="aside"}

Diese Hinweisbox bleibt auf allen Breakpoints sichtbar.

## 4. Responsive Sichtbarkeit und eigene Gewichte
{: layout="ntl-columns" section-class="lg:desktop" section-style="--start-cols: 2; --center-cols: 8; --end-cols: 2;"}

### Center

Der Center erhält Gewicht 8.

### Start
{: section-slot="start" section-class="xl:d-none"}

Dieser Inhalt verschwindet ab XL; seine Spalte beansprucht keinen Platz mehr.

### End
{: section-slot="end"}

Der End-Slot erhält Gewicht 2. Ab XL wird seine Breite gemeinsam mit
Center neu verteilt.

## 5. Ausschließlich Center
{: layout="ntl-columns" section-class="desktop"}

### Hauptinhalt

Beide Seitenspalten sind leer. Der Center füllt die gesamte Breite.
