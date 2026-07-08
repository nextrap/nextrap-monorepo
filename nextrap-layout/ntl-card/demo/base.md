# ntl-card usage Examples
{: layout="1;.container"}

This demo shows the default card styling and the image variants. The cards are placed in a `.row` without an additional card gap; spacing between cards is handled by the parent grid/layout.

## Variants
{: layout=".row"}

### Default 16/9 image
{: layout="ntl-card.col-3" .keep }

![Bild1](https://picsum.photos/200)

Default card with automatic image assignment. The image area uses the default `16 / 9` aspect ratio.

### Custom 1/1 aspect ratio
{: layout="ntl-card.col-3" section-style="--aspect-ratio: 1 / 1" }

![Bild1](https://picsum.photos/200)

The same default card, but the image area is controlled with `--aspect-ratio: 1 / 1`.

### img-fullsize
{: layout="ntl-card.col-3.img-fullsize" }

![Bild1](https://picsum.photos/200/400)

The `.img-fullsize` variant disables the fixed image aspect ratio. The image keeps its natural rendered height.

### img-overlay
{: layout="ntl-card.col-3.img-overlay" }

![Bild1](https://picsum.photos/200/400)

The `.img-overlay` variant renders image and content on the same grid layer. The content overlays the image area and uses the overlay gradient part.

## Variants 2
{: layout=".row"}

### Card without image
{: layout="ntl-card.col-3"}

A card without an image. Empty header/image/footer areas are hidden by slot visibility handling.
