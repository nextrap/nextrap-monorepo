// Die veränderbare Konfiguration bleibt auch bei mehrfach gebündeltem Package global geteilt.
export interface NteIconConfig {
  /** URL einer zu den mitgelieferten Bootstrap-Icons-Zuordnungen passenden Schriftdatei. */
  bootstrapIconsFontUrl: string;
}

// Der Symbol-Key vereinheitlicht Konfiguration und Ladezustand über Package-Kopien hinweg.
const configKey = Symbol.for('@nextrap/nte-icon/config');
const fontKey = Symbol.for('@nextrap/nte-icon/bootstrap-font');
const globalConfig = globalThis as typeof globalThis & { [configKey]?: NteIconConfig };

/** Vor der ersten Font-Icon-Instanz setzen; ein gestarteter Download behält seine URL. */
export const NTE_ICON_CONFIG: NteIconConfig = globalConfig[configKey] ??= {
  bootstrapIconsFontUrl: 'https://cdn.leuffen.de/hyperpage-components/v1.0/fonts/bootstrap-icons.woff2',
};

// Die Schrift bleibt dokumentweit verfügbar, auch für verschachtelte Shadow Roots.
export const BOOTSTRAP_ICON_FONT_FAMILY = 'bootstrap-icons';
type FontDocument = Document & { [fontKey]?: Promise<FontFace> };

/**
 * Startet erst bei Aufruf einen einzigen Font-Download pro Dokument.
 * Auch ein Fehler bleibt gecacht, damit weitere Icons keine Download-Schleife starten.
 */
export function loadBootstrapIconFont(document: Document): Promise<FontFace> {
  const target = document as FontDocument;
  return target[fontKey] ??= createBootstrapIconFont(document, NTE_ICON_CONFIG.bootstrapIconsFontUrl);
}

// FontFace.load() bestätigt genau diese Schrift; document.fonts.ready/check tun das nicht.
async function createBootstrapIconFont(document: Document, url: string): Promise<FontFace> {
  const Font = document.defaultView?.FontFace ?? globalThis.FontFace;
  if (!Font || !document.fonts) {
    throw new Error('nte-icon: CSS Font Loading wird in diesem Dokument nicht unterstützt.');
  }
  if (!url.trim()) {
    throw new Error('nte-icon: bootstrapIconsFontUrl darf nicht leer sein.');
  }

  // Ein CSS-String verhindert, dass Sonderzeichen der URL die src-Deklaration verändern.
  const source = url.replace(/[\u0000-\u001f\u007f"\\]/g, (character) =>
    `\\${character.codePointAt(0)!.toString(16)} `,
  );
  const font = new Font(BOOTSTRAP_ICON_FONT_FAMILY, `url("${source}")`, {
    style: 'normal',
    weight: 'normal',
    display: 'block',
  });
  const loaded = await font.load();
  document.fonts.add(loaded);
  return loaded;
}
