# Features Overview

## Welcome Screen

The welcome screen is shown when no demo is selected. It displays:
- A **title** (configurable via `welcome-title` attribute)
- A **README button** (if `readme` attribute is set)
- **Demo cards** for each `<demo>` element, showing title, description, and index

## Demo Switching

- Click a demo card on the welcome screen to open it
- Use the **FAB menu** (bottom-right floating button) to switch between demos
- The FAB shows a **badge** with the total number of demos
- The currently active demo is **highlighted** in the menu

## URL Hash Routing

The component automatically syncs with the URL hash:
- Opening a demo sets the hash to `#demo/filename.md`
- The README view uses `#readme`
- The welcome screen clears the hash
- **Browser back/forward** navigation works
- **Page reload** preserves the current demo

## File Type Support

### Markdown Files (.md)
- Rendered via `tj-markdown-loader` and `tj-content-pane`
- Supports **live code editing** with split view
- Changes preview in real-time (500ms debounce)

### HTML Files (.html)
- Loaded in an **iframe** for proper script execution
- Auto-resizes to fit content height
- Code editing is **disabled** for HTML demos

## Code Editor (Split View)

- Toggle via the `</>` button in the menu header
- **Split view**: desktop shows 50/50 side-by-side, mobile stacks vertically
- **Live editing**: changes in the textarea are reflected in the preview after 500ms
- **Syntax-aware**: shows file path and correct placeholder text
- Only available for **Markdown files** (not HTML)

## File Validation

On initialization, all demo sources are validated:
- **Valid files** are shown normally
- **Invalid files** show a warning icon and red error state
- **Pending validation** shows a loading indicator
- Invalid demos **cannot be selected**
- The validation uses HTTP GET and checks Content-Type headers

## Events

| Event          | Detail                                  | Description                     |
| -------------- | --------------------------------------- | ------------------------------- |
| `demo-change`  | `{ index: number, demo: DemoConfig }`   | Fired when selected demo changes|
| `code-change`  | `{ content: string }`                   | Fired when code is edited       |

### Listening to events

```javascript
const viewer = document.querySelector('nte-demo-viewer');

viewer.addEventListener('demo-change', (e) => {
  console.log('Demo changed:', e.detail.demo.title);
});

viewer.addEventListener('code-change', (e) => {
  console.log('Code edited:', e.detail.content.length, 'chars');
});
```
