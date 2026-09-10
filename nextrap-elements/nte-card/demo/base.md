# nte-card usage Examples
{: layout="1;.container"}

This demo shows the default card styling and the image variants. The cards are placed in a `.row` without an additional card gap; spacing between cards is handled by the parent grid/layout.

## Variants
{: layout=".row"}

### Default 16/9 image
{: layout="nte-card.col-3" .keep }

![Bild1](https://picsum.photos/200)

Default card with automatic image assignment. The image area uses the default `16 / 9` aspect ratio.

### Custom 1/1 aspect ratio
{: layout="nte-card.col-3" section-style="--aspect-ratio: 1 / 1" }

![Bild1](https://picsum.photos/200)

The same default card, but the image area is controlled with `--aspect-ratio: 1 / 1`.

### img-fullsize
{: layout="nte-card.col-3.img-fullsize" }

![Bild1](https://picsum.photos/200/400)

The `.img-fullsize` variant disables the fixed image aspect ratio. The image keeps its natural rendered height.

### img-overlay
{: layout="nte-card.col-3.img-overlay" }

![Bild1](https://picsum.photos/200/400)

The `.img-overlay` variant renders image and content on the same grid layer. The content overlays the image area and uses the overlay gradient part.

## Variants 2
{: layout=".row"}

### Card without image
{: layout="nte-card.col-3"}

A card without an image. Empty header/image/footer areas are hidden by slot visibility handling.


## Randlose Regionen und unabhängiger Gap
{: layout=".row"}

### Titelbild bis zum Rahmen
{: layout="nte-card.col-4.with-image-bleed" section-style="--inner-padding: 24px; --gap: 16px" }

![Randloses Titelbild](https://picsum.photos/640/360)

Der Text bleibt eingerückt; zum Bild wirkt nur der Gap.

### Reine Bildkarte ohne Randabstand
{: layout="nte-card.col-4.with-image-bleed" section-style="--inner-padding: 24px; --gap: 16px" }

![Bild an allen vier Rahmenkanten](https://picsum.photos/640/480)

### Randloser Header
{: layout="nte-card.col-4.with-header-bleed" section-style="--inner-padding: 24px; --gap: 16px" }

Dieser Header reicht oben und seitlich bis zum Rahmen.
{: slot="header" .bg-primary }

Der normale Inhalt behält den Seitenabstand.

### Overlay mit Textschutz
{: layout="nte-card.col-4.with-image-overlay" section-style="--inner-padding: 24px; --gap: 16px" }

![Overlay-Bild](https://picsum.photos/640/400)

Randloses Bild mit innen geschütztem Overlay-Text.
