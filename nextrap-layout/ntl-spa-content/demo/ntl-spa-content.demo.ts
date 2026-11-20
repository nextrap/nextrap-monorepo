// Content Pane übernimmt die Markdown-Struktur und überträgt section-slot auf Slots.
import '@trunkjs/content-pane';
import { defineDemo } from '@trunkjs/demo-viewer';
import '../index';
import css from './ntl-spa-content.scss?inline';

// Lange Beispieldaten machen die drei voneinander unabhängigen Scrollports sichtbar.
const files = Array.from({ length: 40 }, (_, index) => `- document-${String(index + 1).padStart(2, '0')}.ts`).join('\n');
const editor = Array.from(
  { length: 64 },
  (_, index) => `  { id: 'document-${String(index + 1).padStart(2, '0')}', title: 'Dokument ${index + 1}', status: 'ready' },`,
).join('\n');
const properties = Array.from(
  { length: 24 },
  (_, index) => `- **Abschnitt ${index + 1}**\n  TypeScript · lokal gespeichert · bereit zur Vorschau`,
).join('\n');

// Die Navbar liegt vor dem Layout im Dokumentfluss und scrollt mit der äußeren Seite.
export default defineDemo({
  title: 'SPA Content: Workspace mit Navbar',
  navPath: ['Layouts', 'SPA Content'],
  description: 'Volle Viewport-Höhe, optionale Sidebars und feste Header/Footer mit unabhängig scrollendem Inhalt.',
  css,
  wrapper_html: '<tj-content-pane>{{content}}</tj-content-pane>',
  markdown: `---
{: layout="1;nav.demo-navbar"}

**NEXTRAP** / workspace / SPA Content

Über diese Leiste die Seite scrollen: Die Navbar verschwindet, der Workspace füllt den Bildschirm. Innerhalb der drei Spalten scrollt jeweils deren Inhalt; am oberen Rand kann die Navbar wieder hereinscrollen.
{: .demo-hint}

---
{: layout="1;ntl-spa-content"}

## Explorer
{: section-slot="sidebar-left-header"}

## Workspace
{: section-slot="sidebar-left"}

**src / documents**

${files}

## src / workspace.ts
{: section-slot="header"}

## Editor-Vorschau
{: section-class="demo-editor"}

Die Kopf- und Fußleiste bleiben sichtbar, während dieses Dokument scrollt.

\`\`\`typescript
// Beispielinhalt: Die Anwendung kann hier auch einen echten Editor einsetzen.
export const documents = [
${editor}
];
\`\`\`

## TypeScript · UTF-8 · 64 Dokumente
{: section-slot="footer"}

## Inspector
{: section-slot="sidebar-right-header"}

## Dokumenteigenschaften
{: section-slot="sidebar-right"}

**workspace.ts**

Die rechte Sidebar scrollt separat. Ihr Header bleibt oben stehen.

${properties}
`,
});
