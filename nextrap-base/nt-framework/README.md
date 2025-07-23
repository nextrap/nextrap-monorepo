# nt-framework

## Decorators

| Decorator                                             | Description                    |
| ----------------------------------------------------- | ------------------------------ |
| @eventListener(event_name, target = "this", options?) | Decorator to listen to events. |

## Examples

### Listening to Events

```ts
import { listenEvents } from 'nt-framework';

class MyComponent extends LitElement {
    @eventListener('click', 'this', { once: true })
    handleEvent(evt: Event) {
        console.log(`Received event: ${evt.type}`);
    }
}
```
