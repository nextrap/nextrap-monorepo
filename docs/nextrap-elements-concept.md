# Nextrap Elements Concept

## The Split-Problem

When dealing with web-components you will often find yourself in doing something like this:

```html
<!-- inside the dom Tree -->
<my-component id="my-component"></my-component>

<!-- somewhere else in the document - or - worse inside transpiled js-code: -->
<script>
    window.addEventListener('domready', () => {
        const myComponent = document.getElementById('my-component');
        myComponeent.setData({
            title: 'Hello World',
            description: 'This is a description',
        });
    });
</script>
```

So the component is responsible for rendering the data, but the data is set from outside of the component.

This happens, when the component handles rendering of the data inside the shadow DOM. This is a common pattern,
but it has some drawbacks. Especially when you want to be a bit more flexible with your components and maybe
allow html in the title or description.

And it adds a lot of boilerplate code to your application, where it is not really clear, where the data
displayed as title or description is coming from.

### A half-baked solution: All HTML

Most frameworks therefore let the rendering of all data be done inside the template.

```html
<my-component id="my-component">
    <h1 slot="title">{{ data.title }}</h1>
    <p slot="description">{{ data.description }}</p>
</my-component>
```

This is a bit better when it comes to flexibility. But it is a massive overhead, when you just want to display
some data from within your application. You have to transform your data into html and then render it inside the
component.

## Nextraps Mixed Approach

Nextrap Components are designed to work in both worlds. They can be used as normal web-components inside
a rendered template:

```html
<my-component id="my-component">
    <h1 slot="title">Hello World</h1>
    <p slot="description">This is a description</p>
</my-component>
```

But they can also be used programmatically from within your application:

```javascript
const component = new MyComponent({
    data: {
        title: 'Hello World',
        description: 'This is a description',
    },
});
document.body.appendChild(component);
```

### How it's done

If the data key of the paraemter 1 of the constructor is set, the component will append the data not to
the shadow DOM but to the main document.

So both approaches generate the same html in light-dom:

The data is inserted into the component as **slots**.

```html
<my-component id="my-component">
    <h1 slot="title">Hello World</h1>
    <p slot="description">This is a description</p>
</my-component>
```

## Styling of Components

### Shadow DOM vs. Light DOM

Each element can have both, styles in shadow DOM and light DOM. although it is not recommended to prefer shadow DOM styles,
to provide encapsulated styles for the component, which are not affected by the main document styles.

#### Limitations of Shadow DOM Styling

When it comes to styling slotted content, the shadow DOM styles can only be applied to the very first element
inside the slot. This means that you cannot style nested elements inside the slot from within the shadow DOM.

**This is possible: (Styling Top-Level Elements)**

```scss
::slotted(ul) {
    color: red; // This will work
}
```

**NOT POSSIBLE: (Styling Nested Elements)**

```scss
::slotted(ul > li) {
    color: red; // This will NOT work
}
```

#### Solution: Light DOM Styles

To style slotted content, you can use light DOM styles.

```scss
my-component,
.my-component {
    ul > li {
        color: red; // This will work
    }
}
```

### CSS Variables

All styling-relevant properties of the components are defined as CSS variables. All CSS Variables for a component
should be defined in the :host selector of the component's shadow DOM. This allows to override the styles,
when the component is used in the main document and makes it easier to for the developer to see which styles
are available for the component.
