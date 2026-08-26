# Header 1

This is a sample of pose -styleing. This text is a paragraph to demonstrate the typography styles.
This is the `.lead` of the document.
{: .lead}

By default all text elements are styled with a comfortable line height and spacing. [This is a link](/test/page).
Headings are bold and have a bit more spacing above them.

## This is a box .box

{: layout=".box"}

Dies ist Text in der Box. Boxes are styled with a border and background color.

## This is a box .box .box-primary

{: layout=".box.box-primary"}

Dies ist Text in der Box. Boxes are styled with a border and background color.

## This is a box .box .box-secondary

{: layout=".box.box-secondary"}

Dies ist Text in der Box. Boxes are styled with a border and background color.

## This is a box .box .box-accent

{: layout=".box.box-accent"}

Dies ist Text in der Box. Boxes are styled with a border and background color.

---

{: layout="2:.box"}

This is also in a box, but in a two-column layout.

## Blockquotes

> Blockquotes are styled with a border and italic text.

> "Blockquotes as cited text"
>
> &mdash; Author Name
> {: .cite}

## Tables

This is some Text with **bold** and _italic_ styles.

| Som | Tabular | Data |
| --- | ------- | ---- |
| 1   | 2       | 3    |
| 4   | 5       | 6    |

## Heading Variants

### Heading 3 <small>with small Text</small>

#### Heading 4

##### Heading 5

###### Heading 6

#### [Header as link](/link/to/site) [and with .text-reset](#){: .text-reset }

## Lists

Lists fit nicely into the text.

- Unordered list item 1
- Unordered list item 2
- Unordered list item 3

And here some odered list:

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

And some nested lists:

- Unordered list item 1
    - Unordered list item 2
        - Unordered list item 4
        - Unordered list item 5
    - Unordered list item 3
    - Unordered list item 5
- Unordered list item 6
- Unordered list item 7

Some Stacked lists with content:

- **Bold item**: Description of the bold item.

    Paragraph inside the list item (currently not supported in all markdown parsers).

- _Italic item_: Description of the italic item.

- Regular item: Description of the regular item

## Code `in heading`

Some text with `inline code`.

```javascript
// Code block
function greet(name) {
    console.log(`Hello, ${name}!`);
}
greet('World');
```

## Images

Images inside the Text:

![Image with alt text](https://placehold.co/600x400)

![Image with alt text](https://placehold.co/600x400)
With Image Caption
{: .img-caption}

And Text Below the image.

And a Image Grid:

![Image with alt text](https://placehold.co/600x400)
![Image with alt text](https://placehold.co/600x400)
![Image with alt text](https://placehold.co/600x400)
![Image with alt text](https://placehold.co/600x400)
{: .img-grid}

![Alt Text](https://placehold.co/600x400){: .img-start} And a image inside a paragraph: with text around it. And here some lorem ipsum text to fill the space. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. and a little more text to see how it flows around the image. and more text to see how it flows around the image.

![Alt Text](https://placehold.co/600x400){: .img-end} And a image inside a paragraph: with text around it. And here some lorem ipsum text to fill the space. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. and a little more text to see how it flows around the image. and more text to see how it flows around the image.

And a image inside a paragraph: with text around it. And here some lorem ipsum text to fill the space. Lorem ipsum dolor sit amet, ![Alt Text](https://placehold.co/600x400){: .img-inline} consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. and a little more text to see how it flows around the image. and more text to see how it flows around the image.

## Images inside a box

{: layout=".box.box-accent"}

![Image with alt text](https://placehold.co/600x400)
