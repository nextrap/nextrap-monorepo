# nte-app-interaction

Global application interaction channel for Nextrap.

It listens to global `window` custom events with the `nextrap:` prefix and handles loading states, progress, success/error messages, information and confirmation questions.
The component only needs to be mounted once, e.g. directly in the `body` – it does not need to wrap other content.

The current presenter uses a native `<dialog>` and exposes screen-reader context for waiting states and confirmation questions. The public component name deliberately does not make the dialog presentation part of its responsibility.

The dialog inherits its raised surface, text, border, radius and backdrop colors from `@nextrap/style-base`. Its actions use the matching `@nextrap/style-button` mixins inside the Shadow DOM. Clicking the backdrop dismisses passive messages. Confirmations, selections and non-cancelable running operations remain open and shake to signal that an explicit interaction is required.

## Installation

```bash
npm install @nextrap/nte-app-interaction
```

## Usage

```html
<body>
  <!-- once per page is enough -->
  <nte-app-interaction></nte-app-interaction>
</body>
```

```ts
window.dispatchEvent(
  new CustomEvent('nextrap:progress', {
    detail: {
      progress: 45,
      message: 'Dateien werden verarbeitet...',
      cancelable: true,
    },
  }),
);
```

## Supported events

- `nextrap:loading`
- `nextrap:progress`
- `nextrap:success`
- `nextrap:fail`
- `nextrap:info`
- `nextrap:confirm`

## Detail options

Most event detail payloads support:

- `title?: string` → custom dialog title, otherwise the default status title is used
- `message?: string`
- `cancelable?: boolean` → shows a close button (`×`) and allows ESC / cancel

Additional options depend on the event type, e.g. `progress`, `details`, `html`, `actions`, `onAbort`, `onConfirm`, `autoClose`.

## Presentation direction

`nte-app-interaction` is the single public event consumer and coordinator. Presentation is a separate concern: blocking operations and questions use the dialog presenter, while a future toast presenter may handle non-blocking success, failure and information messages. A toast implementation should remain separate, for example as `nte-toast-stack`, and be delegated to by this component rather than duplicating the global event API.
