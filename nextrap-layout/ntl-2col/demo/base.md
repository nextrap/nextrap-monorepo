# ntl-2col component

Diese Demo zeigt typische Varianten von `ntl-2col`: automatische Aside-Erkennung, manuelle Aside-Slots, Bildverhalten, alternierende Ausrichtung und Breakout-Layouts.

## Nur Hauptspalte ohne Aside
{: layout="ntl-2col.testimonial.default" section-style="--cols: 8;"}

Dieses Beispiel enthält kein Bild und keinen `aside`-Slot. `ntl-2col` rendert dadurch nur die Hauptspalte; die Aside-Spalte bleibt leer und wird ausgeblendet.

Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates distinctio saepe temporibus eius doloribus, mollitia quae nisi excepturi. Error similique perferendis voluptatem ipsa dicta quidem, nesciunt voluptates fugit ut quisquam!


## Automatisch erkannte Bild-Aside
{: layout="ntl-2col.testimonial.default" section-style="--cols: 8;"}

Dieses Beispiel zeigt die automatische Aside-Erkennung: Das Bild wird anhand der Layout-Regel in die Aside-Spalte verschoben. Über `--cols: 8` bekommt die Hauptspalte acht von zwölf Spalten.

Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates distinctio saepe temporibus eius doloribus, mollitia quae nisi excepturi. Error similique perferendis voluptatem ipsa dicta quidem, nesciunt voluptates fugit ut quisquam!

![alt](https://placehold.co/600x400?text=Hello+World){: .p-3 }


## Text und Bild im Standardlayout
{: layout="ntl-2col" section-style="--cols: 6;"}

Dieses Beispiel verwendet die Standardaufteilung mit `--cols: 6`. Haupt- und Aside-Bereich erhalten dadurch ungefähr gleich viel Platz.

![img](https://placehold.co/600x400?text=Hello+World)

Dieser Text bleibt in der Hauptspalte, während das Bild automatisch in der Aside-Spalte angezeigt wird.

## Manueller Aside-Slot
{: layout="2.1" section-slot="aside"}

Dieses Beispiel setzt den Inhalt explizit in den `aside`-Slot. Dadurch wird der Text manuell in der Aside-Spalte platziert; die automatische Bild-Erkennung ist hier nicht beteiligt.

Dieser Text steht auf der Aside-Seite.


## Blauer Hintergrund mit Divider
{: layout="ntl-2col.default.with-background-and-divider" section-style="--cols: 6;"}

Dieses Beispiel verwendet `.with-background-and-divider`. Der Abschnitt bekommt einen blauen Hintergrund; in der Desktopansicht sitzt eine vertikale Linie mittig im konfigurierbaren Gap zwischen Haupt- und Aside-Spalte.

---
{: layout=".aside"}

Der Hauptinhalt steht links und teilt sich den verfügbaren Platz mit der Aside-Spalte.





## Automatisches Object-Fit für Bilder
{: layout="ntl-2col"}

Dieses Beispiel zeigt das Bildverhalten bei ungleichen Höhen. Der Textblock ist künstlich hoch gesetzt, damit sichtbar wird, wie das Bild in der Aside-Spalte automatisch passend skaliert wird.

Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates distinctio saepe temporibus eius doloribus, mollitia quae nisi excepturi. Error similique perferendis voluptatem ipsa dicta quidem, nesciunt voluptates fugit ut quisquam!
{: style="height: 500px" }


![alt](https://placehold.co/600x400?text=Hello+World)

---
{: layout="1;.alternating"}

## Alternating 1
{: layout="ntl-2col"}

Dieses Beispiel ist Teil einer `.alternating`-Gruppe. Das erste `ntl-2col` wird in der normalen Reihenfolge dargestellt.

![alt](https://placehold.co/600x400?text=Hello+World)


## Alternating 2
{: layout="ntl-2col"}

Dieses zweite Beispiel innerhalb derselben `.alternating`-Gruppe wechselt die Spaltenrichtung. So entsteht bei mehreren aufeinanderfolgenden 2-Spalten-Abschnitten ein alternierendes Layout.

![alt](https://placehold.co/600x400?text=Hello+World)

---
{: layout="1;"}

## Breakout rechts
{: layout="ntl-2col.default.breakout-end"}

Dieses Beispiel verwendet `.breakout-end`. Die rechte Spalte kann dadurch optisch bis zum rechten Viewport-Rand ausbrechen, während die restliche Struktur im Container bleibt.

![alt](https://placehold.co/600x400?text=Hello+World)


## Breakout links
{: layout="ntl-2col.default.breakout-start"}

Dieses Beispiel verwendet `.breakout-start`. Die linke Spalte kann dadurch optisch bis zum linken Viewport-Rand ausbrechen.

![alt](https://placehold.co/600x400?text=Hello+World)

---
{: layout="1;"}

## Volle Breite
{: layout="ntl-2col.default" section-style="--container-width: 100%; --cols: 7;"}

Dieses Beispiel setzt die Container-Breite direkt auf `100%`. Der Abschnitt nutzt dadurch die volle verfügbare Breite; Border und Border-Radius kommen aus dem Demo-Style.

![alt](https://placehold.co/900x500?text=Full+Width)


## Header/Footer + Breakout rechts
{: layout="ntl-2col.default.breakout-end.with-header-footer" section-style="--cols: 7;"}

Dieses Beispiel kombiniert Header, Footer und einen rechten Breakout. Header und Footer bleiben auf der definierten Container-Breite, während die Aside-Spalte rechts bis zum Viewport-Rand erweitert wird.

<div class="top">Header: bleibt auf der angegebenen Container-Breite.</div>

Der Text bleibt im normalen Container. Nur das Bild erweitert die rechte Spalte bis zum rechten Viewport-Rand.

![alt](https://placehold.co/900x500?text=Breakout+Right)

<div class="bottom">Footer: bleibt ebenfalls auf der angegebenen Container-Breite.</div>


## Header/Footer + Breakout links
{: layout="ntl-2col.default.breakout-start.with-header-footer" section-style="--cols: 7;"}

Dieses Beispiel kombiniert Header, Footer und einen linken Breakout. Header und Footer bleiben im Container, während die linke Spalte bis zum linken Viewport-Rand erweitert wird.

<div class="top">Header: bleibt auf der angegebenen Container-Breite.</div>

Der Text bleibt im normalen Container. Nur das Bild erweitert die linke Spalte bis zum linken Viewport-Rand.

![alt](https://placehold.co/900x500?text=Breakout+Left)

<div class="bottom">Footer: bleibt ebenfalls auf der angegebenen Container-Breite.</div>
