# Nextrap Elements Concept

## The Split-Problem

When working with web components you will often end up splitting your code into _markup_ and _logic_ like so:

```html
<!-- In the DOM tree -->
<my-component id="my-component"></my-component>

<!-- Somewhere else in the document – or even worse – inside transpiled JS: -->
<script>
    window.addEventListener('DOMContentLoaded', () => {
        const myComponent = document.getElementById('my-component');
        myComponent.setData({
            title: 'Hello World',
            description: 'This is a description',
        });
    });
</script>
```

In this scenario the component is responsible for rendering the data, while the data itself is fed from the outside.  
This pattern is common when the component renders its content inside a _shadow DOM_, but it comes with a few drawbacks:

- The `title` and `description` are defined far away from where they are rendered, making the code harder to reason about.
- Allowing rich HTML (e.g. `<em>` or `<strong>`) inside `title` or `description` is cumbersome.
- You end up writing boiler-plate glue code that clutters your application.

### A Half-Baked Solution: All HTML

Many frameworks therefore push all rendering into the template:

```html
<my-component id="my-component">
    <h1 slot="title">{{ data.title }}</h1>
    <p slot="description">{{ data.description }}</p>
</my-component>
```

While this gives you more flexibility (everything is plain HTML), it is still heavy-handed when all you want is to display some data.  
You now have to turn your data into HTML _before_ passing it to the component.

## Nextrap’s Mixed Approach

Nextrap Components are designed to embrace **both** worlds.

1. Use them declaratively inside a template:

    ```html
    <my-component id="my-component">
        <h1 slot="title">Hello World</h1>
        <p slot="description">This is a description</p>
    </my-component>
    ```

2. Or create them programmatically:

    ```javascript
    const component = new MyComponent({
        data: {
            title: 'Hello World',
            description: 'This is a description',
        },
    });
    document.body.appendChild(component);
    ```

### How It Works

Like in normale web compnents, the component makes use of `slots` to render its content. This way you can
always add custom HTML to the component, even when using it declaratively.

If the `data` key is present in the first argument of the constructor, the component injects that data as **slotted elements** in the _light DOM_ instead of rendering it in the shadow DOM.

Both usage patterns therefore generate identical light-DOM markup:

```html
<my-component id="my-component">
    <h1 slot="title">Hello World</h1>
    <p slot="description">This is a description</p>
</my-component>
```

From a developer’s perspective you can start simple (declarative) and later switch to a programmatic approach without touching your CSS or HTML.

> **Note for developers:** Design your components in a way that the _markup_ usage is tested first. You can add
> programmatic usage tests later, but they should not be the primary focus.

## Styling of Components

### Shadow DOM vs. Light DOM

Each Nextrap element can expose styles in both the shadow DOM **and** the light DOM.  
In practice you will usually prefer shadow-DOM styles because they are encapsulated and cannot be accidentally overridden by the page.

#### Limitations of Shadow-DOM Styling

When styling _slotted_ content the shadow DOM has one big limitation:  
You can only target the **first element** inside the slot. Nested selectors will not work.

**Possible (styling top-level elements)**

```scss
::slotted(ul) {
    color: red; // This will work
}
```

**Not possible (styling nested elements)**

```scss
::slotted(ul > li) {
    color: red; // This will NOT work
}
```

#### Solution: Light-DOM Styles

For complex selectors you can fall back to light-DOM styles:

```scss
my-component,
.my-component {
    ul > li {
        color: red; // This will work
    }
}
```

### CSS Variables

All styling-relevant properties of a component should be exposed as **CSS variables**.  
Define them in the `:host` selector inside the shadow DOM:

```scss
:host {
    --my-component-primary-color: hotpink;
}
```

This makes the available styling hooks explicit to developers and allows easy overrides from the main document:

```scss
my-component {
    --my-component-primary-color: rebeccapurple;
}
```

---

Happy hacking!
