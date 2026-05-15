# nte-notifier

Global notifier web component for Nextrap.

It listens to global `window` custom events with the `nextrap:` prefix and displays loading states, progress, success/error messages, info dialogs and confirm dialogs.
The component only needs to be mounted once, e.g. directly in the `body` – it does not need to wrap other content.

The notifier is rendered as a native `<dialog>` and exposes screen-reader context for waiting dialogs and confirm dialogs. Error details are rendered inside a native `<details><summary></summary></details>` block.

## Installation

```bash
npm install @nextrap/nte-notifier
```

## Usage

```html
<body>
  <!-- once per page is enough -->
  <nte-notifier></nte-notifier>
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
