# ntl-2col component

## Empty Image
{: layout="ntl-2col.testimonial.default" section-style="--cols: 8;"}

Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates distinctio saepe temporibus eius doloribus, mollitia quae nisi excepturi. Error similique perferendis voluptatem ipsa dicta quidem, nesciunt voluptates fugit ut quisquam!


## cols 3
{: layout="ntl-2col.testimonial.default" section-style="--cols: 8;"}

Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates distinctio saepe temporibus eius doloribus, mollitia quae nisi excepturi. Error similique perferendis voluptatem ipsa dicta quidem, nesciunt voluptates fugit ut quisquam!

![alt](https://placehold.co/600x400?text=Hello+World){: .p-3 }


## Dual Text
{: layout="ntl-2col" section-style="--cols: 6;"}

![img](https://placehold.co/600x400?text=Hello+World)

Text on main Side

## Text on aside Side
{: layout="2.1" section-slot="aside"}

If a slot="aside" is set the image will not be pulled to the side

This text is on aside side.



## Testimonial
{: layout="ntl-2col.testimonial.default"}

Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates distinctio saepe temporibus eius doloribus, mollitia quae nisi excepturi. Error similique perferendis voluptatem ipsa dicta quidem, nesciunt voluptates fugit ut quisquam!

![alt](https://placehold.co/600x400?text=Hello+World)

---
{: layout="1;.alternating"}

## Alternating 1
{: layout="ntl-2col"}

![alt](https://placehold.co/600x400?text=Hello+World)


## Alternating 2
{: layout="ntl-2col"}

![alt](https://placehold.co/600x400?text=Hello+World)

---
{: layout="1;"}

## Breakout end
{: layout="ntl-2col.default.breakout-end"}

![alt](https://placehold.co/600x400?text=Hello+World)


## Breakout Start
{: layout="ntl-2col.default.breakout-start"}

![alt](https://placehold.co/600x400?text=Hello+World)

---
{: layout="1;"}

## Volle Breite
{: layout="ntl-2col.default" section-style="--container-width: 100%; --cols: 7;"}

Dieser Abschnitt setzt die Container-Breite direkt auf `100%`. Border und Border-Radius kommen aus dem Demo-Style.

![alt](https://placehold.co/900x500?text=Full+Width)


## Header/Footer + Breakout rechts
{: layout="ntl-2col.default.breakout-end.with-header-footer" section-style="--cols: 7; --container-width: min(72rem, calc(100vw - 2rem));"}

<div class="top">Header: bleibt auf der angegebenen Container-Breite.</div>

Der Text bleibt im normalen Container. Nur das Bild erweitert die rechte Spalte bis zum rechten Viewport-Rand.

![alt](https://placehold.co/900x500?text=Breakout+Right)

<div class="bottom">Footer: bleibt ebenfalls auf der angegebenen Container-Breite.</div>


## Header/Footer + Breakout links
{: layout="ntl-2col.default.breakout-start.with-header-footer" section-style="--cols: 7; --container-width: min(72rem, calc(100vw - 2rem));"}

<div class="top">Header: bleibt auf der angegebenen Container-Breite.</div>

Der Text bleibt im normalen Container. Nur das Bild erweitert die linke Spalte bis zum linken Viewport-Rand.

![alt](https://placehold.co/900x500?text=Breakout+Left)

<div class="bottom">Footer: bleibt ebenfalls auf der angegebenen Container-Breite.</div>