# nte-card

Bootstrap-like card web component built with Lit. Supports header, image, body and footer slots. Optional full-height mode lets the card body expand to fill available space.

## Visual Demo

```bash
nx dev nte-card
# open http://localhost:4000/demo/base.html
```

## Usage

Basic:

```html
<nte-card>
    <h3 slot="header">Card Header</h3>
    <p>Some main content</p>
    <div slot="footer">Card Footer</div>
</nte-card>
```

With image:

```html
<nte-card>
    <h3 slot="header">Card Header</h3>
    <img slot="image" src="https://placehold.co/600x400" alt="Placeholder" />
    <p>Some main content</p>
    <div slot="footer">Card Footer</div>
</nte-card>
```

Image wrapped in a paragraph (Static generators):

```html
<nte-card>
    <h3 slot="header">Card Header</h3>
    <p slot="image">
        <img src="https://placehold.co/600x400" alt="Placeholder" />
    </p>
    <p>Some main content</p>
    <div slot="footer">Card Footer</div>
</nte-card>
```

Full height fill:

```html
<section style="height: 300px; border: 1px dashed #ccc;">
    <nte-card fill style="height: 100%;">
        <h3 slot="header">Full-height Card</h3>
        <p>This card body grows to fill the available height.</p>
        <div slot="footer">Footer</div>
    </nte-card>
</section>
```

## Slots

- header: Content for the card header.
- image: Top image area. Accepts <img> or any markup; <p> wrappers are normalized.
- default: Main content (card body).
- footer: Footer content.

## Attributes

- fill (boolean): When present, the card uses flexbox to expand its body to fill available height.

## Styling (CSS custom properties)

- --card-bg
- --card-color
- --card-border-color
- --card-border-radius
- --card-box-shadow
- --card-spacer-x
- --card-spacer-y

Example:

```css
nte-card {
    --card-border-radius: 0.5rem;
    --card-box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
```
