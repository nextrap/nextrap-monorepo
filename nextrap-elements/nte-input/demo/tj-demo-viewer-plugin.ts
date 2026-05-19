import fg from 'fast-glob';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

type TDemoOptions = {
  include?: string[];
  route?: string;
};

function readTemplate(relativePath: string) {
  const absolutePath = fileURLToPath(new URL(relativePath, import.meta.url));
  return readFileSync(absolutePath, 'utf8');
}

function applyTemplate(template: string, replacements: Record<string, string>) {
  let result = template;

  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.split(placeholder).join(value);
  }

  return result;
}

const viewerComponentImportPath =
  '/@fs/' +
  fileURLToPath(
    new URL(
      '../../../node_modules/@trunkjs/vite-demo-viewer/src/components/tj-demo-viewer/tj-demo-viewer.ts',
      import.meta.url,
    ),
  ).replace(/\\/g, '/');
const clientTemplate = readTemplate('../../../node_modules/@trunkjs/vite-demo-viewer/src/lib/tjDemoViewerClient.js');
const htmlTemplate = readTemplate('../../../node_modules/@trunkjs/vite-demo-viewer/src/lib/tjDemoViewer.html');

export function tjDemoViewerPlugin(options: TDemoOptions = {}): Plugin {
  const include = options.include ?? ['**/*.demo.ts'];
  const route = options.route ?? '/__tdemo';

  const virtualRegistryId = 'virtual:tdemo-registry';
  const resolvedRegistryId = `\0${virtualRegistryId}`;

  let demoFiles: string[] = [];

  async function scanDemos() {
    demoFiles = await fg(include, {
      cwd: process.cwd(),
      absolute: false,
    });
  }

  function generateRegistry() {
    return `
      ${demoFiles.map((file, index) => `import * as demoModule${index} from ${JSON.stringify('/' + file)}`).join('\n')}

      function normalizeDemoDefinition(filename, mod) {
        const definition = mod.default ?? mod;
        const baseDefinition = typeof definition === 'object' && definition !== null ? definition : {};
        const render =
          typeof baseDefinition.render === 'function'
            ? baseDefinition.render
            : typeof mod.render === 'function'
              ? mod.render
              : undefined;

        return {
          ...baseDefinition,
          filename: baseDefinition.filename ?? filename,
          ...(render ? { render } : {}),
        };
      }

      export const demos = [
        ${demoFiles.map((file, index) => `normalizeDemoDefinition(${JSON.stringify(file)}, demoModule${index})`).join(',\n')}
      ];
    `;
  }

  function generateHtml() {
    return applyTemplate(htmlTemplate, {
      'TDemo Viewer': 'nte-input demos',
    });
  }

  function generateClient() {
    return applyTemplate(clientTemplate, {
      '/* __TJ_DEMO_VIEWER_COMPONENT_IMPORT__ */': `import ${JSON.stringify(viewerComponentImportPath)};`,
    });
  }

  return {
    name: 'vite-plugin-tdemo',

    async configResolved() {
      await scanDemos();
    },

    resolveId(id) {
      if (id === virtualRegistryId) {
        return resolvedRegistryId;
      }

      if (id === '/@tdemo/client') {
        return id;
      }

      return undefined;
    },

    load(id) {
      if (id === resolvedRegistryId) {
        return generateRegistry();
      }

      if (id === '/@tdemo/client') {
        return generateClient();
      }

      return undefined;
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '';
        const isViewerRoute = url === '/' || url === '/index.html' || url.startsWith(route);

        if (!isViewerRoute) {
          return next();
        }

        await scanDemos();

        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(generateHtml());
      });
    },

    async handleHotUpdate(ctx) {
      if (ctx.file.endsWith('.demo.ts')) {
        await scanDemos();

        const mod = ctx.server.moduleGraph.getModuleById(resolvedRegistryId);
        if (mod) {
          ctx.server.moduleGraph.invalidateModule(mod);
        }

        ctx.server.ws.send({
          type: 'full-reload',
        });

        return [];
      }

      return undefined;
    },
  };
}
