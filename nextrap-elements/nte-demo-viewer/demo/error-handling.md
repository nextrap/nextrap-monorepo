# Error Handling

## Automatic File Validation

When `nte-demo-viewer` initializes, it validates all demo source files by sending HTTP GET requests. This ensures users get immediate feedback about broken or missing demo files.

### Validation States

| State       | Card UI                        | Menu UI                        | Clickable |
| ----------- | ------------------------------ | ------------------------------ | --------- |
| **Valid**   | Normal card with index number  | Normal menu item               | Yes       |
| **Invalid** | Red border, warning icon       | Dimmed, red title              | No        |
| **Pending** | Dimmed, hourglass icon         | Dimmed, "Validating..." text   | No        |

## How Validation Works

1. For each `<demo>` element, a `GET` request is sent to the `src` URL
2. The response status and `Content-Type` header are checked:
   - **Markdown files (.md)**: Must NOT return `text/html` (which indicates a 404 fallback)
   - **HTML files (.html)**: Must return `200 OK`
3. CORS errors and network failures are caught and reported

## Example with Invalid File

```html
<nte-demo-viewer>
  <demo title="Working Demo" src="/demo/base.md"></demo>
  <demo title="Missing File" src="/demo/nonexistent.md"></demo>
</nte-demo-viewer>
```

The second demo will show:
- A **red-bordered card** with a ⚠ icon on the welcome screen
- An **error message** explaining why the file is invalid
- A **`not-allowed` cursor** when hovering
- The card and menu item are **disabled** and cannot be clicked

## Error UI When Loading

If an invalid demo is somehow navigated to (e.g., via URL hash), an error screen is shown with:
- A warning icon
- "File Not Found" heading
- The specific error message
- The file path that was requested
- A "Back to Home" button

## Dev Server Considerations

Some development servers (like Vite) return `200 OK` for non-existent files by serving a fallback `index.html` (SPA routing). The validator detects this by checking if a `.md` file returns `text/html` content type, which indicates a fallback rather than the actual file.
